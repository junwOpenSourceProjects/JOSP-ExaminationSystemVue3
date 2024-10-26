<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.subjectClass"
        placeholder="大类名称"
        class="filter-item"
        clearable
        style="width: 200px"
        @keyup.enter="handleFilter"
      />
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
      <el-button icon="el-icon-download" :loading="downloadLoading" type="primary" @click="handleDownload">导出</el-button>
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
      <el-table-column type="index" align="center" label="序号" width="120px" />
      <el-table-column label="学科大类" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">
            {{ row.subjectClass }}
          </span>
          <el-tag>{{ studentClassFilter(row.studentClass) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="政治校线" prop="scorePolite" width="80px" />
      <el-table-column align="center" label="英语校线" prop="scoreEnglish" width="80px" />
      <el-table-column align="center" label="专业课一校线" prop="scoreProfessional1" width="120px" />
      <el-table-column align="center" label="专业课二校线" prop="scoreProfessional2" width="120px" />
      <el-table-column align="center" label="总分校线" prop="scoreTotal" width="80px" />
      <el-table-column v-if="showMoreInfo" align="center" label="公共课总分校线" width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalPublic }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMoreInfo" align="center" label="专业课总分校线" width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalProfessional }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学硕/专硕" prop="degreeType" width="120px">
        <template #default="{ row }">
          <el-tag :type="degreeTypeFilter(row.degreeType)">
            {{ row.degreeType }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

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
const excelName = "校线分数表";

export default defineComponent({
  name: "QueryCollegeLineTable",
  setup() {
    const listQuery = reactive({
      page: 1,
      limit: 10,
      degreeType: "Academic",
      subjectClass: "",
      sort: "0",
    });
    const list = ref < any[] > ([]);
    const total = ref(0);
    const listLoading = ref(false);
    const downloadLoading = ref(false);
    const showMoreInfo = ref(false);
    const tableKey = ref(0);
    const temp = reactive({
      id: undefined,
      subjectClass: "",
      degreeType: "",
      scorePolite: "",
      scoreEnglish: "",
      scoreProfessional1: "",
      scoreProfessional2: "",
      scoreTotal: "",
      scoreTotalPublic: "",
      scoreTotalProfessional: "",
    });

    const getList = () => {
      listLoading.value = true;
      axios.get("/dev-api/CollegeLine/list", { params: listQuery }).then((response) => {
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
      listQuery.subjectClass = "";
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

    const handleDownload = () => {
      downloadLoading.value = true;
      const exportData = list.value.map((item) => ({
        "院线主键": item.id,
        "学科类型": item.subjectClass,
        "学硕/专硕": item.degreeType,
        "政治校线": item.scorePolite,
        "英语校线": item.scoreEnglish,
        "专业课一校线": item.scoreProfessional1,
        "专业课二校线": item.scoreProfessional2,
        "总分校线": item.scoreTotal,
        "公共课总分校线": item.scoreTotalPublic,
        "专业课总分校线": item.scoreTotalProfessional,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "校线分数表");
      XLSX.writeFile(wb, `${excelName}.xlsx`);
      downloadLoading.value = false;
    };

    const studentClassFilter = (type: string) =>
      studentClassOptions.find((item) => item.key === type)?.display_name || "";

    const degreeTypeFilter = (type: string) =>
      type === "Academic" ? "success" : "info";

    const sortChange = ({ prop, order }: { prop: string; order: string }) => {
      if (prop === "id") {
        listQuery.sort = order === "ascending" ? "+id" : "-id";
      }
      handleFilter();
    };

    onMounted(getList);

    return {
      listQuery,
      list,
      total,
      listLoading,
      downloadLoading,
      showMoreInfo,
      tableKey,
      temp,
      handleFilter,
      handleFilterRefresh,
      handlePageChange,
      handleSizeChange,
      handleDownload,
      studentClassFilter,
      degreeTypeFilter,
      sortChange,
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
