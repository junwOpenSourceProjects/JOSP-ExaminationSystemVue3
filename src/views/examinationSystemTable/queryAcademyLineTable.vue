<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentName"
        :placeholder="'学院名称'"
        class="filter-item"
        clearable
        style="width: 200px"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.isChecked"
        :placeholder="'录取情况'"
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
        :placeholder="'学院名称'"
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
      <!--todo 根据学院的名称，查询出专业代码-->
      <el-select
        v-model="listQuery.subjectCode"
        :placeholder="'专业代码'"
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
        {{ "重置条件" }}
      </el-button>
      <el-button
        class="filter-item"
        icon="el-icon-edit"
        style="margin-left: 10px"
        type="primary"
        @click="handleCreate"
      >
        {{ "添加" }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
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
      <!--<el-table-column :label = "'考生姓名'" min-width = "150px">-->
      <!--  <template slot-scope = "{row}">-->
      <!--    <span class = "link-type" @click = "handleUpdate(row)">{{ row.studentName }}</span>-->
      <!--    &lt;!&ndash;todo 这里放专业&ndash;&gt;-->
      <!--    <el-tag>{{ row.studentCode | subjectCodeFilter }}</el-tag>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--==========================================================================-->
      <el-table-column
        align="center"
        label="学院名称"
        prop="academyName"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="专业代码"
        prop="professionCode"
        sortable
        width="80px"
      />
      <el-table-column
        align="center"
        label="专业名称"
        prop="professionName"
        sortable
        width="80px"
      />
      <el-table-column
        v-if="showMoreInfo"
        :label="'考试方式'"
        align="center"
        sortable
        width="120px"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.testWay }}</span>
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
        v-if="showMoreInfo"
        :label="'公共课总分'"
        align="center"
        sortable
        width="120px"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.scoreTotalPublic }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showMoreInfo"
        :label="'专业课总分'"
        align="center"
        sortable
        width="120px"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.scoreTotalProfessional }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="培养方式"
        prop="trainingMode"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="学位类型"
        prop="degreeType"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="研究方向"
        prop="researchDirection"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="免试人数"
        prop="numberOfStudentsExempted"
        sortable
        width="120px"
      />
      <el-table-column
        align="center"
        label="统考报名人数"
        prop="numberOfStudentsEnrolledInTheUnifiedExamination"
        sortable
        width="120px"
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
        fixed="right"
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
          <el-button
            v-if="row.status != 'deleted'"
            disabled
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ "删除" }}
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
        style="width: 500px; margin-left: 50px"
      >
        <!--todo 设置校验规则-->
        <!--成绩必须是数字，1-4必填-->
        <!--培养方式必填，学位必填，学院名称，专业必填，考试方式必填-->
        <!--专业代码必填-->

        <el-form-item label="院线主键" prop="id">
          <el-input
            v-model="temp.id"
            disabled
            placeholder="请输入院线主键     primary key"
          />
        </el-form-item>
        <el-form-item label="专业代码" prop="professionCode">
          <el-input
            v-model="temp.professionCode"
            placeholder="请输入专业代码"
          />
        </el-form-item>
        <el-form-item label="专业名称" prop="professionName">
          <el-input
            v-model="temp.professionName"
            placeholder="请输入专业名称"
          />
        </el-form-item>
        <el-form-item label="考试方式" prop="testWay">
          <el-input v-model="temp.testWay" placeholder="请输入考试方式" />
        </el-form-item>
        <el-form-item label="政治成绩" prop="scorePolite">
          <el-input v-model="temp.scorePolite" placeholder="请输入政治成绩" />
        </el-form-item>
        <el-form-item label="英语成绩" prop="scoreEnglish">
          <el-input v-model="temp.scoreEnglish" placeholder="请输入英语成绩" />
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
        <el-form-item label="复试线总分" prop="scoreTotal">
          <el-input
            v-model="temp.scoreTotal"
            disabled
            placeholder="请输入复试线总分"
          />
        </el-form-item>
        <el-form-item label="公共课总分院线" prop="scoreTotalPublic">
          <el-input
            v-model="temp.scoreTotalPublic"
            disabled
            placeholder="请输入公共课总分院线"
          />
        </el-form-item>
        <el-form-item label="专业课总分院线" prop="scoreTotalProfessional">
          <el-input
            v-model="temp.scoreTotalProfessional"
            disabled
            placeholder="请输入专业课总分院线"
          />
        </el-form-item>
        <el-form-item label="培养方式" prop="trainingMode">
          <!--<el-input placeholder = "请输入培养方式" v-model = "temp.trainingMode"></el-input>-->
          <el-radio-group v-model="temp.trainingMode">
            <el-radio label="全日制" value="0" />
            <el-radio label="非全日制" value="1" />
            <el-radio label="联合培养" value="2" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学位类型" prop="degreeType">
          <el-radio-group v-model="temp.degreeType">
            <el-radio label="学硕" value="0" />
            <el-radio label="专硕" value="1" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="研究方向" prop="researchDirection">
          <el-input
            v-model="temp.researchDirection"
            placeholder="请输入研究方向"
          />
        </el-form-item>
        <el-form-item label="推免生人数" prop="numberOfStudentsExempted">
          <el-input
            v-model="temp.numberOfStudentsExempted"
            placeholder="请输入推免生人数"
          />
        </el-form-item>
        <el-form-item
          label="统考生人数"
          prop="numberOfStudentsEnrolledInTheUnifiedExamination"
        >
          <el-input
            v-model="temp.numberOfStudentsEnrolledInTheUnifiedExamination"
            placeholder="请输入统考生人数"
          />
        </el-form-item>
        <el-form-item label="学院名称" prop="academyName">
          <el-select
            v-model="temp.academyName"
            :placeholder="'学院名称'"
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
import {
  fetchAcademyLine,
  fetchAcademyList,
  insertOrUpdateAcademyLine
} from '@/api/examination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 专业代码
const subjectCodeOptions = [
  { key: '030500', display_name: '马克思主义理论' },
  { key: '071200', display_name: '科学技术史' },
  { key: '010108', display_name: '科学技术哲学' }
]
const isCheckedOptions = [
  { key: '0', display_name: '录取' },
  { key: '1', display_name: '落榜' }
]

// arr to obj, such as { 030500 : "马克思主义理论", 071200 : "科学技术史" }
const subjectCodeKeyValue = subjectCodeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const excelName = '查询院线'

export default {
  name: 'QueryAcademyLineTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    subjectCodeFilter(type) {
      return subjectCodeKeyValue[type]
    }
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
        subjectCode: '',
        isChecked: undefined,
        studentName: undefined,
        type: undefined,
        academySearchInput: '',
        sort: '0'
      },
      isCheckedOptions,
      subjectCodeOptions,
      sortOptions: [
        { label: '高分优先', key: '0' },
        { label: '低分优先', key: '1' }
      ],
      academyList: [
        { label: '学院1', key: '0' },
        { label: '学院2', key: '1' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showMoreInfo: false,
      temp: {
        id: undefined,
        professionCode: '',
        professionName: '',
        testWay: '',
        scorePolite: '',
        scoreEnglish: '',
        scoreProfessional1: '',
        scoreProfessional2: '',
        scoreTotal: '',
        scoreTotalPublic: '',
        scoreTotalProfessional: '',
        trainingMode: '',
        degreeType: '',
        researchDirection: '',
        numberOfStudentsExempted: '',
        numberOfStudentsEnrolledInTheUnifiedExamination: '',
        academyName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        studentName: [
          {
            required: true,
            message: 'studentName is required',
            trigger: 'blur'
          }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.remoteMethod()
  },
  methods: {
    // 学院框进行搜索
    remoteMethod() {
      this.listLoading = true
      fetchAcademyList()
        .then((response) => {
          this.academyList = response.data
        })
        .then(() => {
          this.listLoading = false
        })
    },
    getList() {
      this.listLoading = true
      fetchAcademyLine(this.listQuery).then((response) => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      // todo 这里如果没有条件，就默认查询马院的三个代码
      this.listQuery.page = 1
      this.getList()
    },
    handleFilterRefresh() {
      this.listQuery.page = 1
      this.listQuery.studentName = ''
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
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
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm']
        .validate((valid) => {
          if (valid) {
            insertOrUpdateAcademyLine(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
        .then(() => {
          this.getList()
        })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          insertOrUpdateAcademyLine(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleHide(row, index) {
      this.$notify({
        title: '隐藏成功',
        message: '刷新后再次出现',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDelete(row, index) {
      this.$notify({
        title: '暂无删除',
        message: '暂无删除',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        // 设置文件头
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
          '备注'
        ]
        // 设置文件需要的展示列
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
          'remark'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: excelName
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
