<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParam" :inline="true">
      <el-form-item label="用户名：">
        <el-input v-model="queryParam.userName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <router-link :to="{path:'/user/student/edit'}" class="link-left">
          <el-button type="primary">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="rank" label="最终排名" fixed />
      <el-table-column prop="studentName" label="姓名" width="110px" />
      <el-table-column prop="scorePolite" label="政治" width="110px" sortable />
      <el-table-column prop="scoreEnglish" label="英语" width="110px" sortable />
      <el-table-column prop="scoreProfessional1" label="专业课一" width="110px" sortable />
      <el-table-column prop="scoreProfessional2" label="专业课二" width="110px" sortable />
      <el-table-column prop="scoreTotal" label="初试总分" width="110px" sortable />
      <el-table-column prop="scoreTotalPublic" label="公共课总分" width="120px" sortable />
      <el-table-column prop="scoreTotalProfessional" label="专业总分" width="110px" sortable />
      <el-table-column prop="reviewScore" label="复试得分" width="110px" sortable />
      <el-table-column prop="finalScore" label="最终得分" width="110px" sortable />
      <el-table-column prop="studentCode" label="考生编号" width="150px" sortable />
      <!--<el-table-column prop = "userLevel" label = "学级" :formatter = "levelFormatter"/>-->
      <!--<el-table-column prop = "sex" label = "性别" width = "60px;" :formatter = "sexFormatter"/>-->
      <el-table-column prop="subjectName" label="学科名称" width="160px" sortable />
      <el-table-column prop="subjectCode" label="学科代码" width="120px" sortable />
      <el-table-column prop="researchDirectionCodeAndName" label="研究方向" width="150px" />
      <el-table-column prop="learningStyle" label="日制" width="auto" />
      <el-table-column prop="admissionCategory" label="非定向就业" width="160px" />
      <!--<el-table-column label = "状态" prop = "status" width = "70px">-->
      <!--  <template slot-scope = "{row}">-->
      <!--    <el-tag :type = "statusTagFormatter(row.status)">-->
      <!--      {{ statusFormatter(row.status) }}-->
      <!--    </el-tag>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column width = "270px" label = "操作" align = "center">-->
      <!--  <template slot-scope = "{row}">-->
      <!--    <el-button size = "mini" @click = "changeStatus(row)" class = "link-left">-->
      <!--      {{ statusBtnFormatter(row.status) }}-->
      <!--    </el-button>-->
      <!--    <router-link :to = "{path:'/user/student/edit', query:{id:row.id}}" class = "link-left">-->
      <!--      <el-button size = "mini">编辑</el-button>-->
      <!--    </router-link>-->
      <!--    <router-link :to = "{path:'/log/user/list', query:{userId:row.id}}" class = "link-left">-->
      <!--      <el-button size = "mini">日志</el-button>-->
      <!--    </router-link>-->
      <!--    <el-button size = "mini" type = "danger" @click = "deleteUser(row)" class = "link-left">删除</el-button>-->
      <!--  </template>-->
      <!--</el-table-column>-->
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParam.pageIndex"
      :limit.sync="queryParam.pageSize"
      @pagination="search"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import userApi from '@/api/user'

export default {
  components: { Pagination },
  data() {
    return {
      queryParam: {
        userName: '',
        role: 1,
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      tableData: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),
    ...mapState('enumItem', {
      sexEnum: state => state.user.sexEnum,
      statusEnum: state => state.user.statusEnum,
      statusTag: state => state.user.statusTag,
      statusBtn: state => state.user.statusBtn,
      levelEnum: state => state.user.levelEnum
    })
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      userApi.getScorePageList(this.queryParam).then(data => {
        const re = data.response
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.listLoading = false
      })
    },
    changeStatus(row) {
      const _this = this
      userApi.changeStatus(row.id).then(re => {
        if (re.code === 1) {
          row.status = re.response
          _this.$message.success(re.message)
        } else {
          _this.$message.error(re.message)
        }
      })
    },
    deleteUser(row) {
      const _this = this
      userApi.deleteUser(row.id).then(re => {
        if (re.code === 1) {
          _this.search()
          _this.$message.success(re.message)
        } else {
          _this.$message.error(re.message)
        }
      })
    },
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    levelFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    },
    sexFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.sexEnum, cellValue)
    },
    statusFormatter(status) {
      return this.enumFormat(this.statusEnum, status)
    },
    statusTagFormatter(status) {
      return this.enumFormat(this.statusTag, status)
    },
    statusBtnFormatter(status) {
      return this.enumFormat(this.statusBtn, status)
    }
  }
}
</script>
