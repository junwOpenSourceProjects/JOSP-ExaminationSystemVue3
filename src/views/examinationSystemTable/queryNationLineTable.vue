<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentName"
        :placeholder="'大类名称'"
        class="filter-item"
        clearable
        style="width: 200px"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.studentClass"
        :placeholder="'A/B地区'"
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
        :placeholder="'学位类型'"
        class="filter-item"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="item in degreeTypeOptions"
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
        <!--todo 没有设置清空表单的方法-->
        {{ "重置条件" }}
      </el-button>
      <el-button
        class="filter-item"
        disabled
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
      <el-table-column :label="'学科大类'" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.subjectClass
          }}</span>
          <!--todo 这里放专业-->
          <el-tag>{{ row.studentClass | studentClassFilter }}</el-tag>
        </template>
      </el-table-column>
      <!--==========================================================================-->
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
      <!--<el-table-column-->
      <!--  prop = "rank"-->
      <!--  label = "学科类型"-->
      <!--  width = "120px"-->
      <!--  sortable-->
      <!--  align = "center"-->
      <!--/>-->
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
        label="学硕/专硕"
        prop="degreeType"
        sortable
        width="120px"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.degreeType | degreeTypeFilter">
            {{ row.degreeType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showMoreInfo"
        :label="'学科编号'"
        align="center"
        sortable
        width="110px"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.subjectCode }}</span>
        </template>
      </el-table-column>
      <!--==========================================================================-->
      <!--<el-table-column v-if = "showMoreInfo" :label = "'显示备注'" width = "110px" align = "center">-->
      <!--  <template slot-scope = "{row}">-->
      <!--    <span style = "color:red;">{{ row.remark }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
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
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="国家线主键" prop="id">
          <el-input
            v-model="temp.id"
            :disabled="true"
            placeholder="请输入国家线主键 primary key"
          />
        </el-form-item>
        <el-form-item label="学科类型" prop="subjectClass">
          <el-input
            v-model="temp.subjectClass"
            :disabled="true"
            placeholder="请输入学科类型"
          />
        </el-form-item>
        <el-form-item label="ab类学生" prop="studentClass">
          <el-input
            v-model="temp.studentClass"
            :disabled="true"
            placeholder="请输入ab类学生"
          />
        </el-form-item>
        <el-form-item label="政治国家线" prop="scorePolite">
          <el-input
            v-model="temp.scorePolite"
            :disabled="true"
            placeholder="请输入政治国家线"
          />
        </el-form-item>
        <el-form-item label="英语国家线" prop="scoreEnglish">
          <el-input
            v-model="temp.scoreEnglish"
            :disabled="true"
            placeholder="请输入英语国家线"
          />
        </el-form-item>
        <el-form-item label="专业课一国家线" prop="scoreProfessional1">
          <el-input
            v-model="temp.scoreProfessional1"
            :disabled="true"
            placeholder="请输入专业课一国家线"
          />
        </el-form-item>
        <el-form-item label="专业课二国家线" prop="scoreProfessional2">
          <el-input
            v-model="temp.scoreProfessional2"
            :disabled="true"
            placeholder="请输入专业课二国家线"
          />
        </el-form-item>
        <el-form-item label="总分国家线" prop="scoreTotal">
          <el-input
            v-model="temp.scoreTotal"
            :disabled="true"
            placeholder="请输入总分国家线"
          />
        </el-form-item>
        <el-form-item label="公共课总分国家线" prop="scoreTotalPublic">
          <el-input
            v-model="temp.scoreTotalPublic"
            :disabled="true"
            placeholder="请输入公共课总分国家线"
          />
        </el-form-item>
        <el-form-item label="专业课总分国家线" prop="scoreTotalProfessional">
          <el-input
            v-model="temp.scoreTotalProfessional"
            :disabled="true"
            placeholder="请输入专业课总分国家线"
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
import { fetchNationLine, insertOrUpdateNationLine } from '@/api/examination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 专业代码
const degreeTypeOptions = [
  { key: 'Academic', display_name: '学硕' },
  { key: 'Professional', display_name: '专硕' }
]
const studentClassOptions = [
  { key: 'A', display_name: 'A类' },
  { key: 'B', display_name: 'B类' }
]

// arr to obj, such as { 030500 : "马克思主义理论", 071200 : "科学技术史" }
// const degreeTypeKeyValue = degreeTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

const studentClassKeyValue = studentClassOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const excelName = '国家线分数表'

export default {
  name: 'QueryNationLineTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    degreeTypeFilter(status) {
      const statusMap = {
        Academic: 'success',
        Professional: 'info'
      }
      return statusMap[status]
    },
    studentClassFilter(type) {
      return studentClassKeyValue[type]
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
        degreeType: 'Academic',
        studentClass: 'A',
        studentName: '',
        type: '',
        sort: '0'
      },
      studentClassOptions,
      degreeTypeOptions,
      sortOptions: [
        { label: '高分优先', key: '0' },
        { label: '低分优先', key: '1' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showMoreInfo: false,
      temp: {
        id: undefined,
        subjectClass: undefined,
        studentClass: '',
        scorePolite: '',
        scoreEnglish: '',
        scoreProfessional1: '',
        scoreProfessional2: '',
        scoreTotal: '',
        scoreTotalPublic: '',
        scoreTotalProfessional: '',
        subjectName: '',
        degreeType: '',
        subjectCode: 1
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
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchNationLine(this.listQuery).then((response) => {
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
        degreeType: '',
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertOrUpdateNationLine(this.temp).then(() => {
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
          insertOrUpdateNationLine(tempData).then(() => {
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
          '国家线主键',
          '学科类型',
          'AB类学生',
          '政治国家线',
          '英语国家线',
          '专业课一国家线',
          '专业课二国家线',
          '总分国家线',
          '公共课总分国家线',
          '专业课总分国家线',
          '学硕专硕',
          '学科大类'
        ]
        // 设置文件需要的展示列
        const filterVal = [
          'id',
          'subjectClass',
          'studentClass',
          'scorePolite',
          'scoreEnglish',
          'scoreProfessional1',
          'scoreProfessional2',
          'scoreTotal',
          'scoreTotalPublic',
          'scoreTotalProfessional',
          'degreeType',
          'subjectCode'
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
