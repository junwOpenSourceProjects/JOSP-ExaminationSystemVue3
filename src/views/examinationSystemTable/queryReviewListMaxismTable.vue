<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentName"
        placeholder="姓名"
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
        v-model="listQuery.subjectCode"
        placeholder="专业代码"
        class="filter-item"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="item in subjectCodeOptions"
          :key="item.key"
          :label="`${item.display_name}(${item.key})`"
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
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="handleFilterRefresh"
      >
        重置条件
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="margin-left: 10px"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >
        导出
      </el-button>
      <el-checkbox
        v-model="showMoreInfo"
        class="filter-item"
        style="margin-left: 15px"
      >
        展示更多
      </el-checkbox>
    </div>

    <el-table
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
      <el-table-column label="考生姓名" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="政治" prop="scorePolite" sortable width="80px" />
      <el-table-column align="center" label="英语" prop="scoreEnglish" sortable width="80px" />
      <el-table-column align="center" label="专业课一" prop="scoreProfessional1" sortable width="120px" />
      <el-table-column align="center" label="专业课二" prop="scoreProfessional2" sortable width="120px" />
      <el-table-column align="center" label="总分" prop="scoreTotal" sortable width="80px" />
      <el-table-column align="center" label="初试排名" prop="rank" sortable width="120px" />
      <el-table-column v-if="showMoreInfo" label="公共课总分" align="center" sortable width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalPublic }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMoreInfo" label="专业课总分" align="center" sortable width="120px">
        <template #default="{ row }">
          <span style="color: red">{{ row.scoreTotalProfessional }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="专业名称" prop="subjectName" sortable width="120px">
        <template #default="{ row }">
          <el-tag :type="subjectNameFilter(row.subjectName)">
            {{ row.subjectName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showMoreInfo" label="专业代码" align="center" sortable width="110px">
        <template #default="{ row }">
          <span style="color: red">{{ row.subjectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMoreInfo" label="考生编号" align="center" sortable width="140px">
        <template #default="{ row }">
          <span style="color: red">{{ row.studentCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMoreInfo" label="显示备注" align="center" width="110px">
        <template #default="{ row }">
          <span style="color: red">{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280px">
        <template #default="{ row, $index }">
          <el-button size="small" type="primary" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.status != 'deleted'" size="small" type="default" @click="handleHide(row, $index)">隐藏</el-button>
          <el-button v-if="row.status != 'deleted'" size="small" type="danger" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      v-model="dialogFormVisible"
      width="30%"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="复试线主键" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入复试线主键" />
        </el-form-item>
        <el-form-item label="初试排名" prop="rank">
          <el-input v-model="temp.rank" disabled placeholder="请输入初试排名" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="temp.studentName" disabled placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="学生编号" prop="studentCode">
          <el-input v-model="temp.studentCode" disabled placeholder="请输入学生编号" />
        </el-form-item>
        <el-form-item label="学科代码" prop="subjectCode">
          <el-input v-model="temp.subjectCode" disabled placeholder="请输入学科代码" />
        </el-form-item>
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="temp.subjectName" disabled placeholder="请输入学科名称" />
        </el-form-item>
        <el-form-item label="政治" prop="scorePolite">
          <el-input v-model="temp.scorePolite" placeholder="请输入政治" />
        </el-form-item>
        <el-form-item label="英语" prop="scoreEnglish">
          <el-input v-model="temp.scoreEnglish" placeholder="请输入英语" />
        </el-form-item>
        <el-form-item label="专业课一" prop="scoreProfessional1">
          <el-input v-model="temp.scoreProfessional1" placeholder="请输入专业课一" />
        </el-form-item>
        <el-form-item label="专业课二" prop="scoreProfessional2">
          <el-input v-model="temp.scoreProfessional2" placeholder="请输入专业课二" />
        </el-form-item>
        <el-form-item label="初试总分" prop="scoreTotal">
          <el-input v-model="temp.scoreTotal" disabled placeholder="请输入初试总分" />
        </el-form-item>
        <el-form-item label="初试公共课总分" prop="scoreTotalPublic">
          <el-input v-model="temp.scoreTotalPublic" disabled placeholder="请输入初试公共课总分" />
        </el-form-item>
        <el-form-item label="初试专业课总分" prop="scoreTotalProfessional">
          <el-input v-model="temp.scoreTotalProfessional" disabled placeholder="请输入初试专业课总分" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column label="Channel" prop="key" />
        <el-table-column label="Pv" prop="pv" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElNotification } from 'element-plus'
import axios from 'axios'
import * as XLSX from 'xlsx'

type ListQuery = {
  page: number
  limit: number
  studentName: string
  subjectCode: string
  isChecked: string
  sort: string
}

interface Temp {
  id: string;
  rank: number | null;
  studentName: string;
  studentCode: string;
  subjectCode: string;
  subjectName: string;
  scorePolite: number | null;
  scoreEnglish: number | null;
  scoreProfessional1: number | null;
  scoreProfessional2: number | null;
  scoreTotal: number | null;
  scoreTotalPublic: number | null;
  scoreTotalProfessional: number | null;
  remark: string;
}

const subjectCodeOptions = [
  { key: '030500', display_name: '马克思主义理论' },
  { key: '071200', display_name: '科学技术史' },
  { key: '010108', display_name: '科学技术哲学' }
]

const isCheckedOptions = [
  { key: '0', display_name: '录取' },
  { key: '1', display_name: '落榜' }
]

const excelName = '马克思主义理论复试名单'

const list = ref<Temp[]>([])
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive<ListQuery>({
  page: 1,
  limit: 10,
  studentName: '',
  subjectCode: '',
  isChecked: '',
  sort: '0'
})

const sortOptions = [
  { label: '总分降序', key: '0' },
  { label: '总分升序', key: '1' },
  { label: '公共分降序', key: '2' },
  { label: '专业分降序', key: '3' }
]

const showMoreInfo = ref(false)
const temp = reactive<Temp>({
  id: '',
  rank: null,
  studentName: '',
  studentCode: '',
  subjectCode: '',
  subjectName: '',
  scorePolite: null,
  scoreEnglish: null,
  scoreProfessional1: null,
  scoreProfessional2: null,
  scoreTotal: null,
  scoreTotalPublic: null,
  scoreTotalProfessional: null,
  remark: ''
})

const dialogFormVisible = ref(false)
const dialogStatus = ref('')
const textMap = {
  update: 'Edit',
  create: 'Create'
}
const dialogPvVisible = ref(false)
const pvData = ref<any[]>([])
const rules = {
  studentName: [{ required: true, message: 'studentName is required', trigger: 'blur' }]
}

const downloadLoading = ref(false)

const fetchReviewListMarxism = (query: ListQuery) => {
  return axios.get('/dev-api/ReviewListMarxism/list', { params: query })
}

const insertOrUpdateReviewListMarxism = (data: Temp) => {
  return axios.post('/dev-api/ReviewListMarxism/insertOrUpdate', data)
}

interface ApiResponse {
  code: number;
  msg: string | null;
  data: {
    records: Temp[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

const getList = () => {
  listLoading.value = true;

  console.log('Request parameters:', JSON.stringify(listQuery));

  fetchReviewListMarxism(listQuery).then((response: ApiResponse) => {
    if (response.code != null) {
      list.value = response.data.records;
      total.value = response.data.total;
      listQuery.page = response.data.current;
      listQuery.limit = response.data.size;
    } else {
      ElNotification({
        title: '错误',
        message: response.msg || '获取数据失败',
        type: 'error',
        duration: 5000
      });
      list.value = [];
      total.value = 0;
    }
    listLoading.value = false;
  }).catch((error) => {
    console.error('获取数据失败:', error);
    ElNotification({
      title: '错误',
      message: '获取数据失败，请检查网络连接',
      type: 'error',
      duration: 5000
    });
    list.value = [];
    total.value = 0;
    listLoading.value = false;
  });
}

const handleFilter = () => {
  listQuery.page = 1
  getList()
}

const handleFilterRefresh = () => {
  listQuery.page = 1
  listQuery.studentName = ''
  listQuery.subjectCode = ''
  getList()
}

const sortChange = (data: { prop: string; order: string }) => {
  const { prop, order } = data
  if (prop === 'id') {
    sortByID(order)
  }
}

const sortByID = (order: string) => {
  listQuery.sort = order === 'ascending' ? '1' : '0'
  handleFilter()
}

const resetTemp = () => {
  Object.assign(temp, {
    id: '',
    rank: null,
    studentName: '',
    studentCode: '',
    subjectCode: '',
    subjectName: '',
    scorePolite: null,
    scoreEnglish: null,
    scoreProfessional1: null,
    scoreProfessional2: null,
    scoreTotal: null,
    scoreTotalPublic: null,
    scoreTotalProfessional: null,
    remark: ''
  })
}

const handleCreate = () => {
  resetTemp()
  dialogStatus.value = 'create'
  dialogFormVisible.value = true
}

const createData = () => {
  // @ts-ignore
  dataForm.value.validate((valid: boolean) => {
    if (valid) {
      insertOrUpdateReviewListMarxism(temp).then(() => {
        list.value.unshift(temp)
        dialogFormVisible.value = false
        ElNotification({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  })
}

const handleUpdate = (row: Temp) => {
  Object.assign(temp, row)
  dialogStatus.value = 'update'
  dialogFormVisible.value = true
}

const updateData = () => {
  // @ts-ignore
  dataForm.value.validate((valid: boolean) => {
    if (valid) {
      insertOrUpdateReviewListMarxism(temp).then(() => {
        dialogFormVisible.value = false
        ElNotification({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  })
}

const handleHide = (row: Temp, index: number) => {
  ElNotification({
    title: '隐藏成功',
    message: '刷新后再次出现',
    type: 'success',
    duration: 2000
  })
  list.value.splice(index, 1)
}

const handleDelete = (row: Temp, index: number) => {
  ElNotification({
    title: '暂无删除',
    message: '暂无删除',
    type: 'success',
    duration: 2000
  })
  list.value.splice(index, 1)
}

const handleDownload = () => {
  downloadLoading.value = true
  const tHeader = [
    'id', '初试排名', '学生姓名', '学生编号', '学科名称', '政治', '英语',
    '专业课一', '专业课二', '初试总分', '初试公共课总分', '初试专业课总分', '备注'
  ]
  const filterVal = [
    'id', 'rank', 'studentName', 'studentCode', 'subjectName', 'scorePolite', 'scoreEnglish',
    'scoreProfessional1', 'scoreProfessional2', 'scoreTotal', 'scoreTotalPublic', 'scoreTotalProfessional', 'remark'
  ]
  const data = formatJson(filterVal)
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${excelName}.xlsx`)
  downloadLoading.value = false
}

const formatJson = (filterVal: string[]) => {
  return list.value.map(v => filterVal.map(j => {
    return v[j]
  }))
}

const subjectNameFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '马克思主义理论': 'success',
    '科学技术史': 'info',
    '科学技术哲学': 'default'
  }
  return statusMap[status]
}

onMounted(() => {
  getList()
})

// 辅助函数
const parseTime = (time?: object | string | number): string => {
  if (time) {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  return ''
}

// Expose the variables and methods for use in the template
defineExpose({
  listQuery,
  handleFilter,
  handleFilterRefresh,
  handleCreate,
  downloadLoading,
  showMoreInfo,
  getList,
  dialogFormVisible,
  dialogStatus,
  temp,
  rules,
  textMap
});
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>
