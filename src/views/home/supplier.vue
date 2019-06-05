<template>
  <div class="content">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="panel">
          <div class="panel-hd">
            <span class="title">今日数据</span>
          </div>
          <div class="panel-bd">
            <div class="panel-item pd-between">
              <el-row :gutter="24">
                <el-col :span="8">
                  <div>
                    <div class="number">{{data.orderTotal}}</div>
                    <div class="saleName">兑换订单数</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="">
                    <div class="number">{{data.memberTotal}}</div>
                    <div class="saleName">兑换人数</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="">
                    <div class="number">{{data.giftTotal}}</div>
                    <div class="saleName">兑换货品数量</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-hd">
            <span class="title">待处理任务</span>
          </div>
          <div class="panel-bd">
            <div class="panel-item pd-between">
              <el-row :gutter="50">
                <el-col :span="14">
                  <el-row :gutter="50">
                    <el-col :span="4">
                      <router-link to="/gift/supplierGiftManage/index?onlineStatus=&categoryId=&barCode=&status=1&giftName=&createTime=&createTime=&lastTime=&lastTime=&orderField=createTime&orderType=1&pageIndex=1&pageSize=20">
                        <el-button type="text">待审核礼品: {{data.pendingGiftTotal}}</el-button>
                      </router-link>
                    </el-col>
                    <el-col :span="4">
                      <router-link :to="'/gift/giftOrder/index?orderStatus=' + orderStatus.PendingDelivery">
                        <el-button type="text">待发货: {{data.pendingOrderTotal}}</el-button>
                      </router-link>
                    </el-col>
                  </el-row>
                </el-col>

              </el-row>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-hd">
            <span class="title">近15天礼品兑换情况</span>
          </div>
          <div class="panel-bd">
            <el-row>
              <div class="home-chart" v-loading="canvasLoading">
                <ECharts :options="chartDatas" autoResize></ECharts>
              </div>
            </el-row>
          </div>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {
  GIFTING_API_STATISTIC_GETSTATISTICSINFO 
} from '../../apis/gifting'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
import {
  OrderStatus 
} from '../../enums/gifting'

export default {
  components: {
    ECharts
  },
  data() {
    return {
      orderStatus: OrderStatus,
      chartDatas: {
      },
      canvasLoading: false,
      data: {
      }
    }
  },
  methods: {
    initOptions(data) {
      const color = ['#54aae5']

      let xAxis = {
        data: data.map(d => d.dateLabel),
        type: 'category'
      }
      const series = [
        {
          // data: data.map(d => Math.random() * 100),
          data: data.map(d => d.giftTotal),
          type: 'bar',
          name: '礼品数量'
        }
      ]

      const yAxis = {
        type: 'value'
      }
      const tooltip = {
      }
      this.chartDatas = {
        color,
        xAxis,
        series,
        yAxis,
        tooltip
      }
    },
    getData() {
      GIFTING_API_STATISTIC_GETSTATISTICSINFO().then(res => {
        const {
          Code, Data 
        } = res.data
        if (Code === 'CORRECT') {
          this.data = Data
          this.initOptions(Data.items)
        }
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.panel {
  margin-bottom: 10px;
}

.pd-between {
  padding: 10px 20px;
  margin: 0;
}
.home-chart {
  width: 100%;
  .echarts {
    width: 100%;
  }
}
.init-panel {
  min-width: 220px;
}

/* @module 表格选择数据样式 */
.panel-item {
  margin: 20px 0;

  .vertical {
    position: relative;
    top: -1px;
  }

  .el-row {
    padding: 5px 0;
    border: none;

    .el-col {
      // height: 96px;
      overflow: hidden;

      & > div {
        text-align: center;
        border-radius: 2px;
        color: rgba(0, 0, 0, 0.65);

        .number {
          font-size: 1.5em;
        }
        div {
          line-height: 30px;
          height: 30px;
        }
      }
    }
  }
}

/* End 选择数据样式*/
</style>
