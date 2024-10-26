<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentName"
        placeholder="学院名称"
        class="filter-item"
        clearable
        style="width: 200px"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.isChecked"
        placeholder="录取情况"
        class="filter-item"
        clearable
        style="width: 90px"
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
      <el-table-column align="center" label="学院名称" prop="academyName" width="120px" />
      <el-table-column align="center" label="专业代码" prop="professionCode" width="80px" />
      <el-table-column align="center" label="专业名称" prop="professionName" width="80px" />
      <el-table-column v-if="showMoreInfo" align="center" label="考试方式" width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.testWay }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="政治" prop="scorePolite" width="80px" />
      <el-table-column align="center" label="英语" prop="scoreEnglish" width="80px" />
      <el-table-column align="center" label="专业课一" prop="scoreProfessional1" width="120px" />
      <el-table-column align="center" label="专业课二" prop="scoreProfessional2" width="120px" />
      <el-table-column align="center" label="总分" prop="scoreTotal" width="80px" />
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
      <el-table-column align="center" label="培养方式" prop="trainingMode" width="120px" />
      <el-table-column align="center" label="学位类型" prop="degreeType" width="120px" />
      <el-table-column align="center" label="研究方向" prop="researchDirection" width="120px" />
      <el-table-column align="center" label="免试人数" prop="numberOfStudentsExempted" width="120px" />
      <el-table-column align="center" label="统考报名人数" prop="numberOfStudentsEnrolledInTheUnifiedExamination" width="120px" />
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

const subjectCodeOptions = [
  { key: "030500", display_name: "马克思主义理论" },
  { key: "071200", display_name: "科学技术史" },
  { key: "010108", display_name: "科学技术哲学" },
];
const isCheckedOptions = [
  { key: "0", display_name: "录取" },
  { key: "1", display_name: "落榜" },
];
const sortOptions = [
  { key: "0", label: "高分优先" },
  { key: "1", label: "低分优先" },
];
const excelName = "查询院线";

export default defineComponent({
  name: "QueryAcademyLineTable",
  setup() {
    const listQuery = reactive({
      page: 1,
      limit: 10,
      subjectCode: "",
      isChecked: undefined,
      studentName: undefined,
      academySearchInput: "",
      sort: "0",
    });
    const list = ref<any[]>([]);
    const total = ref(0);
    const listLoading = ref(false);
    const downloadLoading = ref(false);
    const showMoreInfo = ref(false);
    const tableKey = ref(0);
    const academyList = ref<{ key: string; label: string }[]>([
      { label: "学院1", key: "0" },
      { label: "学院2", key: "1" },
    ]);
    const temp = reactive({
      id: undefined,
      professionCode: "",
      professionName: "",
      testWay: "",
      scorePolite: "",
      scoreEnglish: "",
      scoreProfessional1: "",
      scoreProfessional2: "",
      scoreTotal: "",
      scoreTotalPublic: "",
      scoreTotalProfessional: "",
      trainingMode: "",
      degreeType: "",
      researchDirection: "",
      numberOfStudentsExempted: "",
      numberOfStudentsEnrolledInTheUnifiedExamination: "",
      academyName: "",
    });

    const getList = () => {
      listLoading.value = true;
      axios.get("/dev-api/AcademyLine/list", { params: listQuery }).then((response) => {
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

    const handleDownload = () => {
      downloadLoading.value = true;
      const exportData = list.value.map((item) => ({
        "学院名称": item.academyName,
        "专业代码": item.professionCode,
        "专业名称": item.professionName,
        "考试方式": item.testWay,
        "政治成绩": item.scorePolite,
        "英语成绩": item.scoreEnglish,
        "专业课一": item.scoreProfessional1,
        "专业课二": item.scoreProfessional2,
        "总分": item.scoreTotal,
        "公共课总分": item.scoreTotalPublic,
        "专业课总分": item.scoreTotalProfessional,
        "培养方式": item.trainingMode,
        "学位类型": item.degreeType,
        "研究方向": item.researchDirection,
        "免试人数": item.numberOfStudentsExempted,
        "统考报名人数": item.numberOfStudentsEnrolledInTheUnifiedExamination,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "查询院线");
      XLSX.writeFile(wb, `${excelName}.xlsx`);
      downloadLoading.value = false;
    };

    const sortChange = ({ prop, order }: { prop: string; order: string }) => {
      if (prop === "id") {
        listQuery.sort = order === "ascending" ? "+id" : "-id";
      }
      handleFilter();
    };

    onMounted(() => {
      getList();
      fetchAcademyList();
    });

    const fetchAcademyList = () => {
      listLoading.value = true;
      axios.get("/dev-api/AcademyList").then((response) => {
        academyList.value = response.data;
        listLoading.value = false;
      });
    };

    return {
      listQuery,
      list,
      total,
      listLoading,
      downloadLoading,
      showMoreInfo,
      tableKey,
      academyList,
      temp,
      handleFilter,
      handleFilterRefresh,
      handlePageChange,
      handleSizeChange,
      handleDownload,
      sortChange,
      subjectCodeOptions,
      isCheckedOptions,
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
</style>
