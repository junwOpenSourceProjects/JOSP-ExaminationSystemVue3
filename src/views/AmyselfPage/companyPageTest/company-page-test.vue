<template>
  <div>

    <el-form
      ref="formModel"
      :disabled="formModelDisabled"
      :model="formModelData"
      :rules="formModelRules"
      :hide-required-asterisk="true"
      label-width="125px"
      label-position="right"
    >
      <el-row :gutter="15">
        <el-col :span="24" style="width:100%;">
          <el-row :gutter="15">
            <el-col :span="24" style="width:50%;">
              <el-row :gutter="15">
                <el-col :span="24" style="width:100%;">
                  <el-row :gutter="15">
                    <el-col :span="24" style="width:33%;">
                      <el-row :gutter="15">
                        <el-col v-if="formModelControl.field113.isShow" :span="24" :offset="0">
                          <el-form-item-ex label="查询维度" prop="field113">
                            <remote-dict
                              ref="formModel_field113"
                              v-model="formModelData.field113"
                              :params="formModelControl.field113.params"
                              :disabled="formModelControl.field113.disabled"
                              placeholder="请选择查询维度"
                              clearable
                              :style="{width: '100%'}"
                            />
                          </el-form-item-ex>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="24" style="width:33%;">
                      <el-row :gutter="15">
                        <el-col v-if="formModelControl.field115.isShow" :span="24" :offset="0">
                          <el-form-item-ex label="日期" prop="field115">
                            <el-date-picker
                              v-model="formModelData.field115"
                              format="yyyy-MM-dd"
                              value-format="yyyyMMdd"
                              :style="{width: '100%'}"
                              placeholder="请选择日期"
                              clearable
                              :disabled="formModelControl.field115.disabled"
                            />
                          </el-form-item-ex>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="24" style="width:33%;">
                      <el-row :gutter="15">
                        <el-col v-if="formModelControl.field118.isShow" :span="24" :offset="0">
                          <el-form-item-ex label="组织名称" prop="field118">
                            <el-input
                              v-model="formModelData.field118"
                              placeholder="请选择组织名称"
                              show-word-limit
                              :disabled="formModelControl.field118.disabled"
                              clearable
                              :style="{width: '100%'}"
                            />
                          </el-form-item-ex>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24" style="width:100%;">
                  <el-row type="flex" justify="center" align="middle" :gutter="15" style="flex-direction:row;text-align:center">
                    <el-col v-if="formModelControl.field109.isShow" :span="24" :offset="0">
                      <el-form-item-ex label-width="0" prop="field109">
                        <el-button
                          :loading="formModelControl.field199.loading"
                          type="primary"
                          icon="el-icon-refresh-right"
                          :disabled="formModelControl.field199.disabled"
                          @click.native="formModel_field199ClickHandler"
                        > 查询
                        </el-button>
                        <el-button
                          :loading="formModelControl.field109.loading"
                          type="primary"
                          icon="el-icon-refresh-right"
                          :disabled="formModelControl.field109.disabled"
                          @click.native="formModel_field109ClickHandler"
                        > 重置
                        </el-button>
                        <el-button
                          :loading="formModelControl.field110.loading"
                          type="primary"
                          :disabled="formModelControl.field110.disabled"
                          @click.native="formModel_field110ClickHandler"
                        > 导出 </el-button>
                      </el-form-item-ex>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24" style="width:100%;">
                  <el-row :gutter="15">
                    <el-col v-if="formModelControl.field107.isShow" :span="24" :offset="0">
                      <el-table
                        ref="formModel_field107"
                        highlight-current-row
                        stripe
                        border
                        height="250"
                        :data="formModelControl.field107.tableData"
                        style="width:100%;"
                        @current-change="formModel_field107_handleCurrentChange"
                      >
                        <el-table-column
                          v-for="(th, key) in formModelControl.field107.tableHeader"
                          :key="key"
                          :show-overflow-tooltip="true"
                          :fixed="key<0"
                          :prop="th.prop"
                          :formatter="th.formatter"
                          :label="th.label"
                          :min-width="th.width"
                        />
                      </el-table>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <div
              id="mychar2"
              class="echartDemo"
            />
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
// import bizFormMixin from '@/mixins/biz-form'
import * as echarts from 'echarts'
export default {
  name: 'CompanyPageTest',
  components: {},
  // mixins: [bizFormMixin],
  props: [],
  data() {
    return {
      name: '张雪',
      xData: ['2020-02', '2020-03', '2020-04', '2020-05'], // 横坐标数据
      formModelDisabled: false, // 纵坐标数据，与横坐标对应
      yData: [30, 132, 80, 134],
      formModelData: {
        field113: undefined,
        field115: undefined,
        field118: undefined
      },
      formModelControl: {
        field113: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
          params: {
            'data': {
              'codeType': 'QUERY_TYPE'
            }
          },
          url: undefined
        },
        field115: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false
        },
        field118: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false
        },
        field109: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
          url: undefined
        },
        field199: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
          url: undefined
        },
        field110: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
          url: undefined
        },
        field107: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
          tableHeader: [{
            'prop': 'shidian',
            'label': '时点',
            'width': 120
          }, {
            'prop': 'zuzhimingc',
            'label': '组织名称',
            'width': 120
          }, {
            'prop': 'zongquanz',
            'label': '总权重',
            'width': 120
          }, {
            'prop': 'zaigangrenshu',
            'label': '在岗人数',
            'width': 120
          }, {
            'prop': 'renjunquanz',
            'label': '人均权重',
            'width': 120
          }],
          url: undefined,
          tableData: [{
            'shidian': '1',
            'zuzhimingc': '1',
            'zongquanz': '1',
            'zaigangrenshu': '1',
            'renjunquanz': '1'
          }, {
            'shidian': '2',
            'zuzhimingc': '2',
            'zongquanz': '2',
            'zaigangrenshu': '2',
            'renjunquanz': '2'
          }],
          currentRow: null
        }
      },
      formModelRules: {
        field113: [{
          required: false,
          message: '请选择查询维度',
          trigger: 'blur'
        }, {
          required: false,
          message: '请选择查询维度',
          trigger: 'change'
        }],
        field115: [{
          required: false,
          message: '请选择查询维度',
          trigger: 'blur'
        }, {
          required: false,
          message: '请选择查询维度',
          trigger: 'change'
        }],
        field118: [{
          required: false,
          message: '请选择查询维度',
          trigger: 'blur'
        }, {
          required: false,
          message: '请选择查询维度',
          trigger: 'change'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      // *************************************************************
      var myChart2 = echarts.init(document.getElementById('mychar2'))// 获取图标的dom元素
      const colors = ['#001871', '#ff585d', '#ffb549', '#41b6e6'] // 设置折线图颜色
      var option2 = {
        title: {
          text: '业务完成压力监控',
          right: 'center'

        },
        color: colors,
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        // legend: {}, // 图例，表示横纵轴的名称
        legend: {
          // data: ['销量'],
          // Try 'horizontal'
          orient: 'vertical',
          right: 0, // 距离右边的距离
          // icon: 'rect', // 修改图例的图标和样式
          top: 'center'
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // 配置横轴的字段颜色
            // axisLine: {
            //   onZero: false,
            //   lineStyle: {
            //     color: colors[1]
            //   }
            // },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    '压力数据2  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  )
                }
              }
            },
            // prettier-ignore
            data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
          },
          {
            type: 'category',
            axisLabel: {
              interval: 0 // 刻度间隔为0，显示全部刻度
              // rotate: 40, // 让x轴文字旋转40度
              // formatter: function(value) { // 自定义x轴文字，让x轴标签垂直显示
              //   return value.split('').join('\n')
              // }
            },

            axisTick: {
              alignWithLabel: true
            },
            // 横轴两个，表示上下两个横坐标
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  // var demo = params.seriesData[0].data // 获取横轴的数据
                  // console.log(params.seriesData[0])
                  return (
                    // params.seriesData[0].seriesName +
                    '压力数据1  ' +
              params.value +
                    (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  )
                }
              }
            },
            // prettier-ignore
            data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],

        series: [
          {
            name: '福建战略服务部',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: '总行',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: [
              3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
            ]
          },
          {
            name: '绍兴分行',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: [
              3.9, 4.9, 9.1, 12.7, 22.3, 43.2, 211.6, 4.6, 53.4, 18.4, 10.3, 0.7
            ]
          },
          {
            name: '上海战略服务部',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: [
              3.9, 5.9, 19.1, 11.7, 41.3, 79.2, 91.6, 4.6, 125.4, 8.4, 8.3, 7.7
            ]
          }
        ]
      }
      myChart2.setOption(option2)
    },
    formModel_field199ClickHandler() {
      this.$message.info('查询')
    },
    formModel_field109ClickHandler() {
      this.$refs['formModel'].resetFields()
    },
    formModel_field110ClickHandler() {
      // todo here
    },
    /* 搜索表格field107选中行*/
    formModel_field107_handleCurrentChange(val) {
      this.formModelControl.field107.currentRow = val
    }
  }
}

</script>
<style scoped>
.echartDemo{
  border: 1px;
  border: black;
  background-color: #fff;
  display: inline-block;
  width: 50%;
   height: 400px;
}
</style>
