<template>
  <div class = "app-container">
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
    <!--新增和编辑的弹窗-->
    <el-dialog :title = "textMap[dialogStatus]" :visible.sync = "dialogFormVisible">
    </el-dialog>
  </div>
</template>

<script>
import {fetchAcademyLine, fetchAcademyList, insertOrUpdateAcademyLine} from '@/api/examination'
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'addAcademyLine',
  components: {Pagination},
  directives: {waves},
  filters: {},
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
          this.$refs['dataForm'].clearValidate()
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
