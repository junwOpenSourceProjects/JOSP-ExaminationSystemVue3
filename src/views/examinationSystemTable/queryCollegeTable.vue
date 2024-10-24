<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.academyName"
        :placeholder="'学院名称'"
        class="filter-item"
        clearable
        style="width: 500px"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        icon="el-icon-search"
        type="primary"
        @click="handleFilter"
      >
        {{ "搜索" }}
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        icon="el-icon-search"
        type="primary"
        @click="handleFilterRefresh"
      >
        <!--todo 没有设置清空表单的方法-->
        {{ "重置条件" }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        disabled
        icon="el-icon-download"
        type="primary"
        @click="handleDownload"
      >
        {{ "导出" }}
      </el-button>
      <el-checkbox
        v-model="showMoreInfo"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        {{ "展示更多" }}
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
      <!--==========================================================================-->
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
      <!--==========================================================================-->
      <el-table-column
        v-if="showMoreInfo"
        :label="'显示备注'"
        align="center"
        width="110px"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
        width="280px"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="default"
            @click="handleHide(row, $index)"
          >
            {{ "隐藏" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :total="total"
      @pagination="getList"
    />
    <!--新增和编辑的弹窗-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
            :disabled="true"
            placeholder="请输入复试线主键"
          />
        </el-form-item>
        <el-form-item label="学院代码" prop="academyCode">
          <el-input
            v-model="temp.academyCode"
            :disabled="true"
            placeholder="请输入学院代码"
          />
        </el-form-item>
        <el-form-item label="学院名称" prop="academyName">
          <el-input
            v-model="temp.academyName"
            :disabled="true"
            placeholder="请输入学院名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="Channel" prop="key" />
        <el-table-column label="Pv" prop="pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCollege, insertOrUpdateCollege } from "@/api/examination";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// 专业代码
const subjectCodeOptions = [
  { key: "030500", display_name: "马克思主义理论" },
  { key: "071200", display_name: "科学技术史" },
  { key: "010108", display_name: "科学技术哲学" },
];
const isCheckedOptions = [
  { key: "0", display_name: "录取" },
  { key: "1", display_name: "落榜" },
];

// arr to obj, such as { 030500 : "马克思主义理论", 071200 : "科学技术史" }
const subjectCodeKeyValue = subjectCodeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

const excelName = "学院名称表";

export default {
  name: "QueryCollegeTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    subjectCodeFilter(type) {
      return subjectCodeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        academyName: "",
        sort: "0",
      },
      isCheckedOptions,
      subjectCodeOptions,
      sortOptions: [
        { label: "高分优先", key: "0" },
        { label: "低分优先", key: "1" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showMoreInfo: false,
      temp: {
        id: undefined,
        academyCode: "",
        academyName: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        academyName: [
          {
            required: true,
            message: "academyName is required",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchCollege(this.listQuery).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      // todo 这里如果没有条件，就默认查询马院的三个代码
      this.listQuery.page = 1;
      this.getList();
    },
    handleFilterRefresh() {
      this.listQuery.page = 1;
      this.listQuery.academyName = "";
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        academyCode: "",
        academyName: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          insertOrUpdateCollege(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          insertOrUpdateCollege(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleHide(row, index) {
      this.$notify({
        title: "隐藏成功",
        message: "刷新后再次出现",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleDelete(row, index) {
      this.$notify({
        title: "暂无删除",
        message: "暂无删除",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        // 设置文件头
        const tHeader = ["id", "学院代码", "学院名称", "复试进度"];
        // 设置文件需要的展示列
        const filterVal = ["id", "academyCode", "academyName", "reviewStatus"];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: excelName,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
