<template>
  <div class = "app-container">
    <div class = "filter-container">
      <el-button
        class = "filter-item"
        style = "margin-left: 10px;"
        type = "primary"
        icon = "el-icon-edit"
        @click = "handleCreate"
      >
        {{ '添加' }}
      </el-button>
    </div>
    <el-form ref = "dataForm"
             :rules = "rules"
             :model = "temp"
             label-position = "left"
             label-width = "140px"
             style = "width: 500px; margin-left:50px;">
      <el-card class = "box-card">
        <div slot = "header" class = "header clearfix">
          <span>academy_line</span>
          <el-button @click = "dialogFormVisible = false">
            {{ '取消' }}
          </el-button>
          <el-button type = "primary" @click = "dialogStatus==='create'?createData():updateData()">
            {{ '新增' }}
          </el-button>
        </div>
        <el-form-item label = "院线主键     primary key" prop = "id">
          <el-input placeholder = "请输入院线主键     primary key" v-model = "temp.id"></el-input>
        </el-form-item>
        <el-form-item label = "专业代码" prop = "professionCode">
          <el-input placeholder = "请输入专业代码" v-model = "temp.professionCode"></el-input>
        </el-form-item>
        <el-form-item label = "专业名称" prop = "professionName">
          <el-input placeholder = "请输入专业名称" v-model = "temp.professionName"></el-input>
        </el-form-item>
        <el-form-item label = "考试方式" prop = "testWay">
          <el-input placeholder = "请输入考试方式" v-model = "temp.testWay"></el-input>
        </el-form-item>
        <el-form-item label = "政治成绩" prop = "scorePolite">
          <el-input placeholder = "请输入政治成绩" v-model = "temp.scorePolite"></el-input>
        </el-form-item>
        <el-form-item label = "英语成绩" prop = "scoreEnglish">
          <el-input placeholder = "请输入英语成绩" v-model = "temp.scoreEnglish"></el-input>
        </el-form-item>
        <el-form-item label = "专业课一" prop = "scoreProfessional1">
          <el-input placeholder = "请输入专业课一" v-model = "temp.scoreProfessional1"></el-input>
        </el-form-item>
        <el-form-item label = "专业课二" prop = "scoreProfessional2">
          <el-input placeholder = "请输入专业课二" v-model = "temp.scoreProfessional2"></el-input>
        </el-form-item>
        <el-form-item label = "复试线总分" prop = "scoreTotal">
          <el-input placeholder = "请输入复试线总分" v-model = "temp.scoreTotal"></el-input>
        </el-form-item>
        <el-form-item label = "公共课总分院线" prop = "scoreTotalPublic">
          <el-input placeholder = "请输入公共课总分院线" v-model = "temp.scoreTotalPublic"></el-input>
        </el-form-item>
        <el-form-item label = "专业课总分院线" prop = "scoreTotalProfessional">
          <el-input placeholder = "请输入专业课总分院线" v-model = "temp.scoreTotalProfessional"></el-input>
        </el-form-item>
        <el-form-item label = "培养方式" prop = "trainingMode">
          <!--<el-input placeholder = "请输入培养方式" v-model = "temp.trainingMode"></el-input>-->
          <el-radio-group v-model = "temp.trainingMode">
            <el-radio label = "全日制" value = "0"></el-radio>
            <el-radio label = "非全日制" value = "1"></el-radio>
            <el-radio label = "联合培养" value = "2"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label = "学位类型" prop = "degreeType">
          <el-radio-group v-model = "temp.degreeType">
            <el-radio label = "学硕" value = "0"></el-radio>
            <el-radio label = "专硕" value = "1"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label = "研究方向" prop = "researchDirection">
          <el-input placeholder = "请输入研究方向" v-model = "temp.researchDirection"></el-input>
        </el-form-item>
        <el-form-item label = "推免生人数" prop = "numberOfStudentsExempted">
          <el-input placeholder = "请输入推免生人数" v-model = "temp.numberOfStudentsExempted"></el-input>
        </el-form-item>
        <el-form-item label = "统考生人数" prop = "numberOfStudentsEnrolledInTheUnifiedExamination">
          <el-input placeholder = "请输入统考生人数"
                    v-model = "temp.numberOfStudentsEnrolledInTheUnifiedExamination"></el-input>
        </el-form-item>
        <el-form-item label = "学院名称" prop = "academyName">
          <el-select
            v-model = "temp.academyName"
            :placeholder = "'学院名称'"
            clearable
            filterable
            class = "filter-item"
            style = "width: 200px"
          >
            <el-option
              v-for = "item in academyList"
              :key = "item.key"
              :label = "'('+item.key+')'+item.label"
              :value = "item.key"
            />
          </el-select>
        </el-form-item>
      </el-card>
    </el-form>
    <pagination
      v-show = "total>0"
      :total = "total"
      :page.sync = "listQuery.page"
      :limit.sync = "listQuery.limit"
      @pagination = "getList"
    />
    <!--新增和编辑的弹窗-->
    <el-dialog :title = "textMap[dialogStatus]" :visible.sync = "dialogFormVisible">
    </el-dialog>

    <el-dialog :visible.sync = "dialogPvVisible" title = "Reading statistics">
      <el-table :data = "pvData" border fit highlight-current-row style = "width: 100%">
        <el-table-column prop = "key" label = "Channel"/>
        <el-table-column prop = "pv" label = "Pv"/>
      </el-table>
      <span slot = "footer" class = "dialog-footer">
        <el-button type = "primary" @click = "dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {fetchAcademyLine, fetchAcademyList, insertOrUpdateAcademyLine} from '@/api/examination'
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 专业代码
const subjectCodeOptions = [
  {key: '030500', display_name: '马克思主义理论'},
  {key: '071200', display_name: '科学技术史'},
  {key: '010108', display_name: '科学技术哲学'}
]
const isCheckedOptions = [
  {key: '0', display_name: '录取'},
  {key: '1', display_name: '落榜'}
]

// arr to obj, such as { 030500 : "马克思主义理论", 071200 : "科学技术史" }
const subjectCodeKeyValue = subjectCodeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const excelName = '查询院线'

export default {
  name: 'addAcademyLine',
  components: {Pagination},
  directives: {waves},
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
      sortOptions: [{label: '高分优先', key: '0'}, {label: '低分优先', key: '1'}],
      academyList: [{label: '学院1', key: '0'}, {label: '学院2', key: '1'}],
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
        type: [{required: true, message: 'type is required', trigger: 'change'}],
        timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
        studentName: [{required: true, message: 'studentName is required', trigger: 'blur'}]
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
      this.listLoading = true;
      fetchAcademyList().then(response => {
        this.academyList = response.data
      }).then(() => {
        this.listLoading = false;
      })
    },
    getList() {
      this.listLoading = true
      fetchAcademyLine(this.listQuery).then(response => {
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
      const {prop, order} = data
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
        remark: '',
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
      this.$refs['dataForm'].validate((valid) => {
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
      }).then(() => {
          this.getList()
        }
      )
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
    }, handleDelete(row, index) {
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
      import('@/vendor/Export2Excel').then(excel => {
        // 设置文件头
        const tHeader = ['id', '初试排名', '学生姓名', '学生编号', '学科名称', '政治', '英语', '专业课一', '专业课二', '初试总分', '初试公共课总分', '初试专业课总分', '备注']
        // 设置文件需要的展示列
        const filterVal = ['id', 'rank', 'studentName', 'studentCode', 'subjectName', 'scorePolite', 'scoreEnglish', 'scoreProfessional1', 'scoreProfessional2', 'scoreTotal', 'scoreTotalPublic', 'scoreTotalProfessional', 'remark']
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
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
  }
}
</script>
