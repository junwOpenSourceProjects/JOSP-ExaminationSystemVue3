<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentName"
        placeholder="姓名"
        class="filter-item"
        clearable
        style="width: 300px"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.isChecked"
        placeholder="录取情况"
        class="filter-item"
        clearable
        style="width: 80px"
      >
        <el-option
          v-for="item in isCheckedOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.academySearchInput"
        placeholder="学院名称"
        class="filter-item"
        clearable
        filterable
        style="width: 200px"
      >
        <el-option
          v-for="item in academyList"
          :key="item.key"
          :label="'(' + item.key + ')' + item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.subjectCode"
        placeholder="专业代码"
        class="filter-item"
        clearable
        style="width: 200px"
      >
        <el-option
          v-for="item in subjectCodeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        class="filter-item"
        style="width: 140px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        class="filter-item"
        icon="el-icon-search"
        type="primary"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        icon="el-icon-refresh"
        type="primary"
        @click="handleFilterRefresh"
      >
        重置条件
      </el-button>
      <el-button
        class="filter-item"
        disabled
        icon="el-icon-edit"
        style="margin-left: 10px"
        type="primary"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        icon="el-icon-download"
        type="primary"
        @click="handleDownload"
      >
        导出
      </el-button>
      <el-checkbox
        v-model="showMoreInfo"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey++"
      >
        展示更多
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        align="center"
        label="序号"
        sortable
        type="index"
        width="120px"
      />
      <el-table-column label="考生姓名" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">
            {{ row.studentName }}
          </span>
          <el-tag>{{ subjectCodeKeyValue[row.studentCode] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="政治"
        prop="scorePolite"
        sortable
        width="80px"
      />
      <el-table-column
        align="center"
        label="英语"
        prop="scoreEnglish"
        sortable
        width="80px"
      />
      <el-table-column
        align="center"
        label="专业课一"
        prop="scoreProfessional1"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="专业课二"
        prop="scoreProfessional2"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="总分"
        prop="scoreTotal"
        sortable
        width="80px"
      />
      <el-table-column
        align="center"
        label="初试排名"
        prop="rank"
        sortable
        width="120px"
      />
      <el-table-column
        v-if="showMoreInfo"
        label="公共课总分"
        align="center"
        sortable
        width="120px"
      >
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalPublic }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showMoreInfo"
        label="专业课总分"
        align="center"
        sortable
        width="120px"
      >
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalProfessional }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="专业名称"
        prop="subjectName"
        sortable
        width="120px"
      />
      <el-table-column
        v-if="showMoreInfo"
        label="专业代码"
        align="center"
        sortable
        width="110px"
      >
        <template #default="{ row }">
          <span style="color: red">{{ row.subjectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showMoreInfo"
        label="考生编号"
        align="center"
        sortable
        width="140px"
      >
        <template #default="{ row }">
          <span style="color: red">{{ row.studentCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showMoreInfo"
        label="显示备注"
        align="center"
        width="110px"
      >
        <template #default="{ row }">
          <span style="color: red">{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="280px"
      >
        <template #default="{ row, $index }">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status !== 'deleted'"
            size="mini"
            type="default"
            @click="handleHide(row, $index)"
          >
            隐藏
          </el-button>
          <el-button
            v-if="row.status !== 'deleted'"
            disabled
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="total > 0" class="pagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size.sync="listQuery.limit"
        :current-page.sync="listQuery.page"
        @current-change="getList"
      />
    </div>

    <el-dialog :title="textMap[dialogStatus]" v-model:visible="dialogFormVisible">
      <el-form
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="复试线主键" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入复试线主键" />
        </el-form-item>
        <el-form-item label="初试排名" prop="rank">
          <el-input v-model="temp.rank" disabled placeholder="请输入初试排名" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="temp.studentName" disabled placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="学生编号" prop="studentCode">
          <el-input v-model="temp.studentCode" disabled placeholder="请输入学生编号" />
        </el-form-item>
        <el-form-item label="学科代码" prop="subjectCode">
          <el-input v-model="temp.subjectCode" disabled placeholder="请输入学科代码" />
        </el-form-item>
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="temp.subjectName" disabled placeholder="请输入学科名称" />
        </el-form-item>
        <el-form-item label="政治" prop="scorePolite">
          <el-input v-model="temp.scorePolite" placeholder="请输入政治" />
        </el-form-item>
        <el-form-item label="英语" prop="scoreEnglish">
          <el-input v-model="temp.scoreEnglish" placeholder="请输入英语" />
        </el-form-item>
        <el-form-item label="专业课一" prop="scoreProfessional1">
          <el-input v-model="temp.scoreProfessional1" placeholder="请输入专业课一" />
        </el-form-item>
        <el-form-item label="专业课二" prop="scoreProfessional2">
          <el-input v-model="temp.scoreProfessional2" placeholder="请输入专业课二" />
        </el-form-item>
        <el-form-item label="初试总分" prop="scoreTotal">
          <el-input v-model="temp.scoreTotal" disabled placeholder="请输入初试总分" />
        </el-form-item>
        <el-form-item label="初试公共课总分" prop="scoreTotalPublic">
          <el-input
            v-model="temp.scoreTotalPublic"
            disabled
            placeholder="请输入初试公共课总分"
          />
        </el-form-item>
        <el-form-item label="初试专业课总分" prop="scoreTotalProfessional">
          <el-input
            v-model="temp.scoreTotalProfessional"
            disabled
            placeholder="请输入初试专业课总分"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model:visible="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column label="Channel" prop="key" />
        <el-table-column label="Pv" prop="pv" />
      </el-table>
      <template #footer>
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface Query {
  page: number;
  limit: number;
  subjectCode?: string;
  isChecked?: string;
  studentName?: string;
  type?: string;
  academySearchInput?: string;
  sort: string;
}

interface Option {
  key: string;
  display_name: string;
}

interface AcademyOption {
  label: string;
  key: string;
}

interface Temp {
  id: number | undefined;
  rank: number | undefined;
  studentName: string;
  studentCode: string;
  subjectCode: string | number;
  subjectName: string;
  scorePolite: string;
  scoreEnglish: string;
  scoreProfessional1: string;
  scoreProfessional2: string;
  scoreTotal: string;
  scoreTotalPublic: string;
  scoreTotalProfessional: string;
  remark: string;
}

export default defineComponent({
  name: 'QueryReviewListAllTable',
  setup() {
    const tableKey = ref(0);
    const list = ref<any[]>([]);
    const total = ref(0);
    const listLoading = ref(true);
    const downloadLoading = ref(false);
    const dialogFormVisible = ref(false);
    const dialogPvVisible = ref(false);
    const showMoreInfo = ref(false);
    const dialogStatus = ref('create');
    const pvData = ref<any[]>([]); // Define pvData for the statistics dialog

    const listQuery = reactive<Query>({
      page: 1,
      limit: 10,
      subjectCode: '',
      isChecked: undefined,
      studentName: undefined,
      type: undefined,
      academySearchInput: '',
      sort: '0',
    });

    const temp = reactive<Temp>({
      id: undefined,
      rank: undefined,
      studentName: '',
      studentCode: '',
      subjectCode: 1,
      subjectName: '',
      scorePolite: '',
      scoreEnglish: '',
      scoreProfessional1: '',
      scoreProfessional2: '',
      scoreTotal: '',
      scoreTotalPublic: '',
      scoreTotalProfessional: '',
      remark: '',
    });

    const subjectCodeOptions: Option[] = [
      { key: '030500', display_name: '马克思主义理论' },
      { key: '071200', display_name: '科学技术史' },
      { key: '010108', display_name: '科学技术哲学' },
    ];

    const isCheckedOptions: Option[] = [
      { key: '0', display_name: '录取' },
      { key: '1', display_name: '落榜' },
    ];

    const academyList: AcademyOption[] = [
      { label: '学院1', key: '0' },
      { label: '学院2', key: '1' },
    ];

    const sortOptions = [
      { label: '高分优先', key: '0' },
      { label: '低分优先', key: '1' },
    ];

    const subjectCodeKeyValue = computed(() => {
      return subjectCodeOptions.reduce((acc: any, cur: Option) => {
        acc[cur.key] = cur.display_name;
        return acc;
      }, {});
    });

    const textMap = {
      update: 'Edit',
      create: 'Create',
    };

    const rules = {
      type: [{ required: true, message: 'type is required', trigger: 'change' }],
      timestamp: [
        { type: 'date', required: true, message: 'timestamp is required', trigger: 'change' },
      ],
      studentName: [{ required: true, message: 'studentName is required', trigger: 'blur' }],
    };

    const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
      console.log({ message, type });
      // Here you can implement a global message component or use an Element Plus Message component
    };

    const getList = () => {
      listLoading.value = true;
      axios.get('/dev-api/AcademyGenerateScore/list', { params: listQuery }).then((response) => {
        list.value = response.data.records;
        total.value = response.data.total;
        listLoading.value = false;
      });
    };

    const handleFilter = () => {
      listQuery.page = 1;
      getList();
    };

    const handleFilterRefresh = () => {
      listQuery.page = 1;
      listQuery.studentName = '';
      getList();
    };

    const handleCreate = () => {
      resetTemp();
      dialogFormVisible.value = true;
      dialogStatus.value = 'create';
    };

    const resetTemp = () => {
      Object.assign(temp, {
        id: undefined,
        rank: undefined,
        studentName: '',
        studentCode: '',
        subjectCode: '',
        subjectName: '',
        scorePolite: '',
        scoreEnglish: '',
        scoreProfessional1: '',
        scoreProfessional2: '',
        scoreTotal: '',
        scoreTotalPublic: '',
        scoreTotalProfessional: '',
        remark: '',
      });
    };

    const createData = () => {
      axios.post('/dev-api/AcademyGenerateScore/insertOrUpdate', temp).then(() => {
        list.value.unshift(temp);
        dialogFormVisible.value = false;
        showMessage('创建成功');
      });
    };

    const handleUpdate = (row: any) => {
      Object.assign(temp, row);
      dialogFormVisible.value = true;
      dialogStatus.value = 'update';
    };

    const updateData = () => {
      axios.post('/dev-api/AcademyGenerateScore/insertOrUpdate', { ...temp }).then(() => {
        dialogFormVisible.value = false;
        showMessage('更新成功');
      });
    };

    const handleHide = (row: any, index: number) => {
      showMessage('隐藏成功, 刷新后再次出现');
      list.value.splice(index, 1);
    };

    const handleDelete = (row: any, index: number) => {
      showMessage('暂无删除', 'error');
      list.value.splice(index, 1);
    };

    const handleDownload = () => {
      downloadLoading.value = true;
      const tHeader = [
        'id',
        '初试排名',
        '学生姓名',
        '学生编号',
        '学科名称',
        '政治',
        '英语',
        '专业课一',
        '专业课二',
        '初试总分',
        '初试公共课总分',
        '初试专业课总分',
        '备注',
      ];
      const filterVal = [
        'id',
        'rank',
        'studentName',
        'studentCode',
        'subjectName',
        'scorePolite',
        'scoreEnglish',
        'scoreProfessional1',
        'scoreProfessional2',
        'scoreTotal',
        'scoreTotalPublic',
        'scoreTotalProfessional',
        'remark',
      ];
      const data = formatJson(filterVal);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, '所有专业复试名单.xlsx');
      downloadLoading.value = false;
    };

    const formatJson = (filterVal: string[]) => {
      return list.value.map((v) =>
        filterVal.reduce((acc: any, key: string) => {
          acc[key] = v[key];
          return acc;
        }, {})
      );
    };

    const remoteMethod = () => {
      listLoading.value = true;
      axios.get('/dev-api/AcademyGenerateScore/list').then((response) => {
        academyList.length = response.data.length;
        response.data.forEach((item: any, index: number) => {
          academyList[index] = { label: item.name, key: item.id };
        });
        listLoading.value = false;
      });
    };

    onMounted(() => {
      getList();
      remoteMethod();
    });

    return {
      tableKey,
      list,
      total,
      listLoading,
      listQuery,
      temp,
      subjectCodeOptions,
      isCheckedOptions,
      sortOptions,
      academyList,
      downloadLoading,
      dialogFormVisible,
      dialogPvVisible,
      textMap,
      rules,
      resetTemp,
      createData,
      handleUpdate,
      updateData,
      handleHide,
      handleDelete,
      handleDownload,
      handleFilter,
      handleFilterRefresh,
      getList,
      showMoreInfo,
      subjectCodeKeyValue,
      remoteMethod,
      dialogStatus,
      showMessage,
      pvData,
    };
  },
});
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.link-type {
  cursor: pointer;
  color: #409EFF;
}

.el-table th,
.el-table td {
  text-align: center;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
