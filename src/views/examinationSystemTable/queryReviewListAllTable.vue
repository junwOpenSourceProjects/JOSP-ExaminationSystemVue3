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
        type="primary"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleFilterRefresh"
      >
        重置条件
      </el-button>
      <el-button
        disabled
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
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
          <el-tag>{{ subjectCodeFilter(row.studentCode) }}</el-tag>
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
          <el-button size="small" type="primary" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="small"
            type="default"
            @click="handleHide(row, $index)"
          >
            隐藏
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            disabled
            size="small"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total > 0"
      :total="total"
      v-model:current-page="listQuery.page"
      v-model:page-size="listQuery.limit"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
    />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="复试线主键" prop="id">
          <el-input
            v-model="temp.id"
            disabled
            placeholder="请输入复试线主键"
          />
        </el-form-item>
        <el-form-item label="初试排名" prop="rank">
          <el-input
            v-model="temp.rank"
            disabled
            placeholder="请输入初试排名"
          />
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input
            v-model="temp.studentName"
            disabled
            placeholder="请输入学生姓名"
          />
        </el-form-item>
        <el-form-item label="学生编号" prop="studentCode">
          <el-input
            v-model="temp.studentCode"
            disabled
            placeholder="请输入学生编号"
          />
        </el-form-item>
        <el-form-item label="学科代码" prop="subjectCode">
          <el-input
            v-model="temp.subjectCode"
            disabled
            placeholder="请输入学科代码"
          />
        </el-form-item>
        <el-form-item label="学科名称" prop="subjectName">
          <el-input
            v-model="temp.subjectName"
            disabled
            placeholder="请输入学科名称"
          />
        </el-form-item>
        <el-form-item label="政治" prop="scorePolite">
          <el-input v-model="temp.scorePolite" placeholder="请输入政治" />
        </el-form-item>
        <el-form-item label="英语" prop="scoreEnglish">
          <el-input v-model="temp.scoreEnglish" placeholder="请输入英语" />
        </el-form-item>
        <el-form-item label="专业课一" prop="scoreProfessional1">
          <el-input
            v-model="temp.scoreProfessional1"
            placeholder="请输入专业课一"
          />
        </el-form-item>
        <el-form-item label="专业课二" prop="scoreProfessional2">
          <el-input
            v-model="temp.scoreProfessional2"
            placeholder="请输入专业课二"
          />
        </el-form-item>
        <el-form-item label="初试总分" prop="scoreTotal">
          <el-input
            v-model="temp.scoreTotal"
            disabled
            placeholder="请输入初试总分"
          />
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
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column label="Channel" prop="key" />
        <el-table-column label="Pv" prop="pv" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default defineComponent({
  name: 'QueryReviewListAllTable',
  setup() {
    const state = reactive({
      tableKey: 0,
      list: [] as any[],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        subjectCode: '',
        isChecked: undefined as string | undefined,
        studentName: undefined as string | undefined,
        type: undefined as string | undefined,
        academySearchInput: '',
        sort: '0'
      },
      showMoreInfo: false,
      temp: {
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
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [] as any[],
      downloadLoading: false
    });

    const rules = {
      type: [{ required: true, message: 'type is required', trigger: 'change' }],
      studentName: [{ required: true, message: 'studentName is required', trigger: 'blur' }]
    };

    const subjectCodeOptions = [
      { key: '030500', display_name: '马克思主义理论' },
      { key: '071200', display_name: '科学技术史' },
      { key: '010108', display_name: '科学技术哲学' }
    ];

    const isCheckedOptions = [
      { key: '0', display_name: '录取' },
      { key: '1', display_name: '落榜' }
    ];

    const sortOptions = [
      { label: '高分优先', key: '0' },
      { label: '低分优先', key: '1' }
    ];

    const academyList = [
      { label: '学院1', key: '0' },
      { label: '学院2', key: '1' }
    ];

    const textMap = {
      update: '编辑',
      create: '创建'
    };

    const subjectCodeKeyValue = subjectCodeOptions.reduce((acc: Record<string, string>, cur) => {
      acc[cur.key] = cur.display_name;
      return acc;
    }, {});
    const subjectCodeFilter = (code: string) => {
      return subjectCodeKeyValue[code] || code;
    };

    const getList = async () => {
      state.listLoading = true;
      try {
        const response = await axios.get('/dev-api/ReviewListAll/list', {
          params: {
            page: state.listQuery.page,
            limit: state.listQuery.limit,
            studentName: state.listQuery.studentName,
            isChecked: state.listQuery.isChecked,
            subjectCode: state.listQuery.subjectCode,
            sort: state.listQuery.sort
          }
        });

        if (response.data.code === 20000) {
          state.list = response.data.data.records;
          state.total = response.data.data.total;
        } else {
          ElMessage.error(`获取数据失败: ${response.data.msg || '未知错误'}`);
        }
      } catch (error) {
        ElMessage.error(`获取数据失败: ${error.message}`);
      } finally {
        state.listLoading = false;
      }
    };

    const handleCurrentChange = (val: number) => {
      state.listQuery.page = val;
      getList();
    };
    const handleFilter = () => {
      state.listQuery.page = 1;
      getList();
    };

    const handleFilterRefresh = () => {
      state.listQuery.page = 1;
      state.listQuery.studentName = '';
      getList();
    };

    const sortChange = (data: any) => {
      const { prop, order } = data;
      if (prop === 'id') {
        state.listQuery.sort = order === 'ascending' ? '+id' : '-id';
        handleFilter();
      }
    };

    const handleCreate = () => {
      resetTemp();
      state.dialogStatus = 'create';
      state.dialogFormVisible = true;
    };

    const createData = async () => {
      try {
        const response = await axios.post('/dev-api/ReviewListAll/insertOrUpdate', state.temp);
        if (response.data.code === 20000) {
          state.dialogFormVisible = false;
          ElMessage.success('创建成功');
          getList(); // Refresh list
        } else {
          ElMessage.error(`创建失败: ${response.data.msg || '未知错误'}`);
        }
      } catch (error) {
        ElMessage.error(`创建失败: ${error.message}`);
      }
    };

    const handleUpdate = (row: any) => {
      Object.assign(state.temp, row);
      state.dialogStatus = 'update';
      state.dialogFormVisible = true;
    };

    const updateData = async () => {
      try {
        const response = await axios.post('/dev-api/ReviewListAll/insertOrUpdate', state.temp);
        if (response.data.code === 20000) {
          state.dialogFormVisible = false;
          ElMessage.success('更新成功');
          getList(); // Refresh list
        } else {
          ElMessage.error(`更新失败: ${response.data.msg || '未知错误'}`);
        }
      } catch (error) {
        ElMessage.error(`更新失败: ${error.message}`);
      }
    };

    const handleHide = (row: any, index: number) => {
      ElMessage.success('隐藏成功');
      state.list.splice(index, 1);
    };

    const handleDelete = (row: any, index: number) => {
      ElMessage.success('删除成功');
      state.list.splice(index, 1);
    };

    const handleDownload = () => {
      state.downloadLoading = true;
      // handle download logic here
      state.downloadLoading = false;
    };

    const resetTemp = () => {
      Object.assign(state.temp, {
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
        remark: ''
      });
    };

    onMounted(() => {
      getList();
    });

    return {
      ...toRefs(state),
      rules,
      isCheckedOptions,
      subjectCodeOptions,
      sortOptions,
      academyList,
      textMap,
      getList,
      handleCurrentChange,
      subjectCodeFilter,
      handleFilter,
      handleFilterRefresh,
      handleCreate,
      handleUpdate,
      createData,
      updateData,
      handleHide,
      handleDelete,
      handleDownload,
      sortChange
    };
  }
});
</script>


<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
