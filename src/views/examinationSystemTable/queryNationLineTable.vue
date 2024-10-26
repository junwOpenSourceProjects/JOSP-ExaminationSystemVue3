<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentName"
        placeholder="大类名称"
        class="filter-item"
        clearable
        style="width: 200px"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.studentClass"
        placeholder="A/B地区"
        class="filter-item"
        clearable
        style="width: 90px"
      >
        <el-option
          v-for="item in studentClassOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.degreeType"
        placeholder="学位类型"
        class="filter-item"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="item in degreeTypeOptions"
          :key="item.key"
          :label="`${item.display_name} (${item.key})`"
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
      <el-button icon="el-icon-search" type="primary" @click="handleFilter">搜索</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="handleFilterRefresh">重置条件</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" icon="el-icon-download" type="primary" @click="handleDownload">导出</el-button>
      <el-checkbox v-model="showMoreInfo" @change="tableKey += 1" style="margin-left: 15px">展示更多</el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column type="index" align="center" label="序号" sortable width="120px" />
      <el-table-column label="学科大类" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">
            {{ row.subjectClass }}
          </span>
          <el-tag>{{ studentClassFilter(row.studentClass) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="政治" prop="scorePolite" sortable width="80px" />
      <el-table-column align="center" label="英语" prop="scoreEnglish" sortable width="80px" />
      <el-table-column align="center" label="专业课一" prop="scoreProfessional1" sortable width="120px" />
      <el-table-column align="center" label="专业课二" prop="scoreProfessional2" sortable width="120px" />
      <el-table-column align="center" label="总分" prop="scoreTotal" sortable width="80px" />
      <el-table-column v-if="showMoreInfo" align="center" label="公共课总分" width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalPublic }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMoreInfo" align="center" label="专业课总分" width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalProfessional }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学硕/专硕" prop="degreeType" sortable width="120px">
        <template #default="{ row }">
          <el-tag :type="degreeTypeFilter(row.degreeType)">
            {{ row.degreeType }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-if="total > 0"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="listQuery.limit"
      :current-page="listQuery.page"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import * as XLSX from "xlsx";

const degreeTypeOptions = [
  { key: "Academic", display_name: "学硕" },
  { key: "Professional", display_name: "专硕" },
];
const studentClassOptions = [
  { key: "A", display_name: "A类" },
  { key: "B", display_name: "B类" },
];
const sortOptions = [
  { key: "0", label: "高分优先" },
  { key: "1", label: "低分优先" },
];
const excelName = "国家线分数表";

export default defineComponent({
  name: "QueryNationLineTable",
  setup() {
    const listQuery = reactive({
      page: 1,
      limit: 10,
      degreeType: "Academic",
      studentClass: "A",
      studentName: "",
      sort: "0",
    });
    const list = ref<any[]>([]);
    const total = ref(0);
    const listLoading = ref(false);
    const downloadLoading = ref(false);
    const showMoreInfo = ref(false);
    const tableKey = ref(0);
    const dialogFormVisible = ref(false);
    const dialogTitle = ref("创建/编辑");
    const temp = reactive({
      id: undefined,
      subjectClass: "",
      studentClass: "",
      scorePolite: "",
      scoreEnglish: "",
      scoreProfessional1: "",
      scoreProfessional2: "",
      scoreTotal: "",
      scoreTotalPublic: "",
      scoreTotalProfessional: "",
    });

    const rules = {
      studentName: [{ required: true, message: "studentName is required", trigger: "blur" }],
    };

    const getList = () => {
      listLoading.value = true;
      axios.get("/dev-api/NationLine/list", { params: listQuery }).then((response) => {
        const { records, total: totalRecords } = response.data.data;
        list.value = records;
        total.value = totalRecords;
        listLoading.value = false;
      });
    };

    const handleFilter = () => {
      listQuery.page = 1;
      getList();
    };

    const handleFilterRefresh = () => {
      listQuery.page = 1;
      listQuery.studentName = "";
      getList();
    };

    const handlePageChange = (page: number) => {
      listQuery.page = page;
      getList();
    };

    const handleSizeChange = (size: number) => {
      listQuery.limit = size;
      listQuery.page = 1;
      getList();
    };

    const handleCreate = () => {
      dialogTitle.value = "创建";
      dialogFormVisible.value = true;
      Object.keys(temp).forEach((key) => (temp[key] = ""));
    };

    const handleUpdate = (row: any) => {
      dialogTitle.value = "编辑";
      dialogFormVisible.value = true;
      Object.assign(temp, row);
    };

    const handleConfirm = () => {
      const method = temp.id ? "post" : "put";
      axios({ method, url: "/dev-api/NationLine/insertOrUpdate", data: temp }).then(() => {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        getList();
      });
    };

    const studentClassFilter = (type: string) =>
      studentClassOptions.find((item) => item.key === type)?.display_name || "";

    const degreeTypeFilter = (type: string) =>
      type === "Academic" ? "success" : "info";

    const handleDownload = () => {
      downloadLoading.value = true;
      const exportData = list.value.map((item) => ({
        "国家线主键": item.id,
        "学科类型": item.subjectClass,
        "AB类学生": studentClassFilter(item.studentClass),
        "政治国家线": item.scorePolite,
        "英语国家线": item.scoreEnglish,
        "专业课一国家线": item.scoreProfessional1,
        "专业课二国家线": item.scoreProfessional2,
        "总分国家线": item.scoreTotal,
        "公共课总分国家线": item.scoreTotalPublic,
        "专业课总分国家线": item.scoreTotalProfessional,
        "学硕/专硕": item.degreeType,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "国家线分数表");
      XLSX.writeFile(wb, `${excelName}.xlsx`);
      downloadLoading.value = false;
    };

    // 排序功能
    const sortChange = ({ prop, order }: { prop: string; order: string }) => {
      if (prop === "id") {
        listQuery.sort = order === "ascending" ? "+id" : "-id";
      }
      handleFilter();
    };

    // 页面加载时调用获取列表数据
    onMounted(getList);

    return {
      listQuery,
      list,
      total,
      listLoading,
      downloadLoading,
      showMoreInfo,
      tableKey,
      dialogFormVisible,
      dialogTitle,
      temp,
      rules,
      handleFilter,
      handleFilterRefresh,
      handlePageChange,
      handleSizeChange,
      handleCreate,
      handleUpdate,
      handleConfirm,
      handleDownload,
      studentClassFilter,
      degreeTypeFilter,
      sortChange,
      getList,
      studentClassOptions,
      degreeTypeOptions,
      sortOptions,
    };
  },
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.link-type {
  cursor: pointer;
  color: #409eff;
}
</style>
