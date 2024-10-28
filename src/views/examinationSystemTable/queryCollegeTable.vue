<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.academyName"
        placeholder="学院名称"
        class="filter-item"
        clearable
        style="width: 500px"
        @keyup.enter="handleFilter"
      />
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
      <el-table-column
        align="center"
        label="学院编号"
        prop="academyCode"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="学院名称"
        prop="academyName"
        sortable
        width="500px"
      />
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
            v-if="row.status != 'deleted'"
            size="mini"
            type="default"
            @click="handleHide(row, $index)"
          >
            隐藏
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
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="复试线主键" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入复试线主键" />
        </el-form-item>
        <el-form-item label="学院代码" prop="academyCode">
          <el-input v-model="temp.academyCode" disabled placeholder="请输入学院代码" />
        </el-form-item>
        <el-form-item label="学院名称" prop="academyName">
          <el-input v-model="temp.academyName" disabled placeholder="请输入学院名称" />
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
  academyName: string;
  sort: string;
}

interface Temp {
  id: number | undefined;
  academyCode: string;
  academyName: string;
  remark?: string;
}

export default defineComponent({
  name: 'QueryCollegeTable',
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
    const pvData = ref<any[]>([]);

    const listQuery = reactive<Query>({
      page: 1,
      limit: 10,
      academyName: '',
      sort: '0',
    });

    const temp = reactive<Temp>({
      id: undefined,
      academyCode: '',
      academyName: '',
    });

    const textMap = {
      update: 'Edit',
      create: 'Create',
    };

    const rules = {
      academyName: [
        {
          required: true,
          message: 'academyName is required',
          trigger: 'blur',
        },
      ],
    };

    const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
      console.log({ message, type });
    };

    const getList = () => {
      listLoading.value = true;
      axios.get('/dev-api/College/list', { params: listQuery }).then((response) => {
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
      listQuery.academyName = '';
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
        academyCode: '',
        academyName: '',
      });
    };

    const createData = () => {
      axios.post('/dev-api/College/insertOrUpdate', temp).then(() => {
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
      axios.post('/dev-api/College/insertOrUpdate', { ...temp }).then(() => {
        dialogFormVisible.value = false;
        showMessage('更新成功');
      });
    };

    const handleHide = (row: any, index: number) => {
      showMessage('隐藏成功, 刷新后再次出现');
      list.value.splice(index, 1);
    };

    const handleDownload = () => {
      downloadLoading.value = true;
      const tHeader = ['id', '学院代码', '学院名称'];
      const filterVal = ['id', 'academyCode', 'academyName'];
      const data = formatJson(filterVal);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, '学院名称表.xlsx');
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

    onMounted(() => {
      getList();
    });

    return {
      tableKey,
      list,
      total,
      listLoading,
      listQuery,
      temp,
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
      handleDownload,
      handleFilter,
      handleFilterRefresh,
      getList,
      showMoreInfo,
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
