<template>
  <div class = "app-container">
    <div class = "filter-container">
      <el-input
        v-model = "listQuery.studentName"
        :placeholder = "'姓名'"
        style = "width: 200px;"
        class = "filter-item"
        clearable
        @keyup.enter.native = "handleFilter"
      />
      <el-select
        v-model = "listQuery.isChecked"
        :placeholder = "'录取情况'"
        clearable
        style = "width: 90px"
        class = "filter-item"
      >
        <el-option v-for = "item in isCheckedOptions" :key = "item.key" :label = "item.display_name"
                   :value = "item.key"/>
      </el-select>
      <el-select
        v-model = "listQuery.subjectCode"
        :placeholder = "'专业代码'"
        clearable
        class = "filter-item"
        style = "width: 130px"
      >
        <el-option
          v-for = "item in subjectCodeOptions"
          :key = "item.key"
          :label = "item.display_name+'('+item.key+')'"
          :value = "item.key"
        />
      </el-select>
      <el-select v-model = "listQuery.sort" style = "width: 140px" class = "filter-item" @change = "handleFilter">
        <el-option v-for = "item in sortOptions" :key = "item.key" :label = "item.label" :value = "item.key"/>
      </el-select>
      <el-button v-waves class = "filter-item" type = "primary" icon = "el-icon-search" @click = "handleFilter">
        {{ '搜索' }}
      </el-button>
      <el-button v-waves class = "filter-item" type = "primary" icon = "el-icon-search" @click = "handleFilterRefresh">
        <!--todo 没有设置清空表单的方法-->
        {{ '重置条件' }}
      </el-button>
      <el-button
        class = "filter-item"
        style = "margin-left: 10px;"
        type = "primary"
        icon = "el-icon-edit"
        @click = "handleCreate"
        disabled
      >
        {{ '添加' }}
      </el-button>
      <el-button
        v-waves
        :loading = "downloadLoading"
        class = "filter-item"
        type = "primary"
        icon = "el-icon-download"
        @click = "handleDownload"
      >
        {{ '导出' }}
      </el-button>
      <el-checkbox v-model = "showMoreInfo" class = "filter-item" style = "margin-left:15px;"
                   @change = "tableKey=tableKey+1">
        {{ '展示更多' }}
      </el-checkbox>
    </div>

    <el-table
      :key = "tableKey"
      v-loading = "listLoading"
      :data = "list"
      border
      fit
      highlight-current-row
      style = "width: 100%;"
      @sort-change = "sortChange"
    >
      <!--<el-table-column-->
      <!--  :label="$t('table.id')"-->
      <!--  prop="id"-->
      <!--  sortable="custom"-->
      <!--  align="center"-->
      <!--  width="80"-->
      <!--  :class-name="getSortClass('id')"-->
      <!--&gt;-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span>{{ row.id }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.date')" width="150px" align="center">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <el-table-column
        type = "index"
        label = "序号"
        width = "120px"
        sortable
        align = "center"
      />
      <el-table-column :label = "'考生姓名'" min-width = "150px">
        <template slot-scope = "{row}">
          <span class = "link-type" @click = "handleUpdate(row)">{{ row.studentName }}</span>
          <!--todo 这里放专业-->
          <el-tag>{{ row.studentCode | subjectCodeFilter }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.author')" width="110px" align="center">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span>{{ row.author }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--==========================================================================-->
      <!--<el-table-column-->
      <!--  prop="studentCode"-->
      <!--  label="考生编号"-->
      <!--  width="180px"-->
      <!--  sortable-->
      <!--  align="center"-->
      <!--/>-->
      <el-table-column
        prop = "scorePolite"
        label = "政治"
        width = "80px"
        sortable
        align = "center"
      />
      <el-table-column
        prop = "scoreEnglish"
        label = "英语"
        width = "80px"
        sortable
        align = "center"
      />
      <el-table-column
        prop = "scoreProfessional1"
        label = "专业课一"
        width = "120px"
        sortable
        align = "center"
      />
      <el-table-column
        prop = "scoreProfessional2"
        label = "专业课二"
        width = "120px"
        sortable
        align = "center"
      />
      <el-table-column
        prop = "scoreTotal"
        label = "总分"
        width = "80px"
        sortable
        align = "center"
      />
      <el-table-column
        prop = "rank"
        label = "初试排名"
        width = "120px"
        sortable
        align = "center"
      />
      <el-table-column v-if = "showMoreInfo" :label = "'公共课总分'" width = "120px" sortable align = "center">
        <template slot-scope = "{row}">
          <span style = "color:red;">{{ row.scoreTotalPublic }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--  prop="scoreTotalPublic"-->
      <!--  label="公共课总分"-->
      <!--  width="120px"-->
      <!--  sortable-->
      <!--  align="center"-->
      <!--/>-->
      <el-table-column v-if = "showMoreInfo" :label = "'专业课总分'" width = "120px" sortable align = "center">
        <template slot-scope = "{row}">
          <span style = "color:red;">{{ row.scoreTotalProfessional }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--  prop="scoreTotalProfessional"-->
      <!--  label="专业课总分"-->
      <!--  width="120px"-->
      <!--  sortable-->
      <!--  align="center"-->
      <!--/>-->
      <el-table-column
        prop = "subjectName"
        label = "专业名称"
        width = "120px"
        sortable
        align = "center"
      />
      <el-table-column v-if = "showMoreInfo" :label = "'专业代码'" width = "110px" sortable align = "center">
        <template slot-scope = "{row}">
          <span style = "color:red;">{{ row.subjectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if = "showMoreInfo" :label = "'考生编号'" width = "140px" sortable align = "center">
        <template slot-scope = "{row}">
          <span style = "color:red;">{{ row.studentCode }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--  prop="subjectCode"-->
      <!--  label="专业代码"-->
      <!--  width="120px"-->
      <!--  sortable-->
      <!--  align="center"-->
      <!--/>-->
      <!--      <el-table-column-->
      <!--  prop="remark"-->
      <!--  label="备注"-->
      <!--  width="120px"-->
      <!--  sortable-->
      <!--  align="center"-->
      <!--/>-->
      <!--==========================================================================-->
      <el-table-column v-if = "showMoreInfo" :label = "'显示备注'" width = "110px" align = "center">
        <template slot-scope = "{row}">
          <span style = "color:red;">{{ row.remark }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.isChecked')" width="80px">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <svg-icon v-for="n in +row.isChecked" :key="n" icon-class="star" class="meta-item__icon" />-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.readings')" align="center" width="95">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>-->
      <!--    <span v-else>0</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.status')" class-name="status-col" width="100">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <el-tag :type="row.status | statusFilter">-->
      <!--      {{ row.status }}-->
      <!--    </el-tag>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <el-table-column :label = "$t('table.actions')" align = "center" width = "280px"
                       class-name = "small-padding fixed-width">
        <template slot-scope = "{row,$index}">
          <el-button type = "primary" size = "mini" @click = "handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <!--<el-button-->
          <!--  v-if="row.status!='published'"-->
          <!--  size="mini"-->
          <!--  type="success"-->
          <!--  @click="handleModifyStatus(row,'published')"-->
          <!--&gt;-->
          <!--  {{ $t('table.publish') }}-->
          <!--</el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">-->
          <!--  {{ $t('table.draft') }}-->
          <!--</el-button>-->
          <el-button v-if = "row.status!='deleted'" size = "mini" type = "default" @click = "handleHide(row,$index)">
            {{ '隐藏' }}
          </el-button>
          <el-button v-if = "row.status!='deleted'" size = "mini" type = "danger" @click = "handleDelete(row,$index)">
            {{ '删除' }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show = "total>0"
      :total = "total"
      :page.sync = "listQuery.page"
      :limit.sync = "listQuery.limit"
      @pagination = "getList"
    />
    <!--新增和编辑的弹窗-->
    <el-dialog :title = "textMap[dialogStatus]" :visible.sync = "dialogFormVisible">
      <el-form
        ref = "dataForm"
        :rules = "rules"
        :model = "temp"
        label-position = "left"
        label-width = "140px"
        style = "width: 400px; margin-left:50px;"
      >
        <!--<div slot="header" class="header clearfix">-->
        <!--    <span>review_list</span>-->
        <!--    <el-button v-if="!ischeck && !isFind" class="fr" type="primary" @click="validate('ruleForm')">提交</el-button>-->
        <!--    <el-button v-else class="fr" type="primary" @click="goBack">返回</el-button>-->
        <!--</div>-->
        <el-form-item label = "复试线主键" prop = "id">
          <el-input placeholder = "请输入复试线主键" v-model = "temp.id" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "初试排名" prop = "rank">
          <el-input placeholder = "请输入初试排名" v-model = "temp.rank" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "学生姓名" prop = "studentName">
          <el-input placeholder = "请输入学生姓名" v-model = "temp.studentName" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "学生编号" prop = "studentCode">
          <el-input placeholder = "请输入学生编号" v-model = "temp.studentCode" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "学科代码" prop = "subjectCode">
          <el-input placeholder = "请输入学科代码" v-model = "temp.subjectCode" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "学科名称" prop = "subjectName">
          <el-input placeholder = "请输入学科名称" v-model = "temp.subjectName" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "政治" prop = "scorePolite">
          <el-input placeholder = "请输入政治" v-model = "temp.scorePolite"></el-input>
        </el-form-item>
        <el-form-item label = "英语" prop = "scoreEnglish">
          <el-input placeholder = "请输入英语" v-model = "temp.scoreEnglish"></el-input>
        </el-form-item>
        <el-form-item label = "专业课一" prop = "scoreProfessional1">
          <el-input placeholder = "请输入专业课一" v-model = "temp.scoreProfessional1"></el-input>
        </el-form-item>
        <el-form-item label = "专业课二" prop = "scoreProfessional2">
          <el-input placeholder = "请输入专业课二" v-model = "temp.scoreProfessional2"></el-input>
        </el-form-item>
        <el-form-item label = "初试总分" prop = "scoreTotal">
          <el-input placeholder = "请输入初试总分" v-model = "temp.scoreTotal" :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "初试公共课总分" prop = "scoreTotalPublic">
          <el-input placeholder = "请输入初试公共课总分" v-model = "temp.scoreTotalPublic"
                    :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "初试专业课总分" prop = "scoreTotalProfessional">
          <el-input placeholder = "请输入初试专业课总分" v-model = "temp.scoreTotalProfessional"
                    :disabled = "true"></el-input>
        </el-form-item>
        <el-form-item label = "备注" prop = "remark">
          <el-input placeholder = "请输入备注" v-model = "temp.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type = "primary" @click = "dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
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
import {fetchReviewListMarxism, insertOrUpdateReviewListMarxism} from '@/api/examination'
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

const excelName = '马克思主义理论复试名单'

export default {
  name: 'QueryMaxismReviewListTable',
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
        subjectCode: '030500',
        isChecked: undefined,
        studentName: undefined,
        type: undefined,
        sort: '0'
      },
      isCheckedOptions,
      subjectCodeOptions,
      sortOptions: [{label: '高分优先', key: '0'}, {label: '低分优先', key: '1'}],
      statusOptions: ['published', 'draft', 'deleted'],
      showMoreInfo: false,
      temp: {
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
        // isChecked: 1,
        // timestamp: new Date(),
        // type: '',
        // status: 'published'
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
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchReviewListMarxism(this.listQuery).then(response => {
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
    // handleModifyStatus(row, status) {
    //   this.$message({
    //     message: '操作成功',
    //     type: 'success'
    //   })
    //   row.status = status
    // },
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
        isChecked: 1,
        remark: '',
        // timestamp: new Date(),
        studentName: '',
        status: 'published',
        type: ''
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          insertOrUpdateReviewListMarxism(this.temp).then(() => {
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
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
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
          // console.log("我是数据："+JSON.stringify(tempData))
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          insertOrUpdateReviewListMarxism(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
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
        title: '删除成功',
        message: '永久删除',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
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
    // getSortClass: function (key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // }
  }
}
</script>
