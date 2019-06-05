<template>
  <div class="">
    <el-row>
      <el-col :span="18">
        <div class="">
          <Panel>
            <template slot="header">快捷操作</template>
            <template slot="body">
              <ul class="fast-list clearfix">
                <li @click="$router.push('/setter/company/companyCreate')"><img src="/static/images/icons/icon-1.png" alt="" /><span>添加公司</span></li>
                <!-- <li @click="$router.push('product/productlist/productcreate')" ><img src="/static/images/icons/icon-2.png" alt="" /><span>添加礼品</span></li> -->
                <li @click="$router.push('/setter/staff/staffCreate')"><img src="/static/images/icons/icon-3.png" alt="" /><span>添加员工</span></li>
                <li @click="$router.push('/setter/settinglist/rechargeedit')"><img src="/static/images/icons/icon-4.png" alt="" /><span>充值设置</span></li>
                <li @click="$router.push('/setter/userConfig/index')"><img src="/static/images/icons/icon-5.png" alt="" /><span>个人设置</span></li>
              </ul>
            </template>
          </Panel>
          <Panel CustmerClass="m-t-10">
            <template slot="header">待处理事项</template>
            <template slot="body">
              <ul class="fast-list clearfix">
                <!-- <li @click="$router.push('/gifting/orderlist')"><img src="/static/images/delay/delay-1.png" alt=""><span>礼品代发</span></li> -->
                <!-- <li @click="$router.push('/setter/store/storebasiclist')"><img src="/static/images/delay/delay-2.png" alt=""><span>门店审核</span></li>
                <li @click="$router.push('/recharge/orderlist')"><img src="/static/images/delay/delay-3.png" alt=""><span>充值审核</span></li> -->
                <!-- <li @click="$router.push('/gifting/orderlist')"><img src="/static/images/delay/delay-4.png" alt=""><span>礼品审核</span></li> -->
                <li @click="$router.push('/setter/staff/index')"><img src="/static/images/delay/delay-5.png" alt=""><span>员工审核</span></li>
              </ul>
            </template>
          </Panel>
        </div>
      </el-col>
      <el-col :span="6" class="p-x-10">
        <div class="">
          <div class="border-1px">
            <ul class="recharge-total clearfix">
              <li class="today">
                <span>{{today.week}}</span>
                <span>{{today.day}}</span>
              </li>
              <li>
                <el-row :gutter="5">
                  <el-col :span="12">
                    <p>今日门店充值</p>
                    <p>￥130,000.00</p>
                  </el-col>
                  <el-col :span="12">
                    <p>今日门店充值</p>
                    <p>￥130,000.00</p>
                  </el-col>
                </el-row>
                <el-row :gutter="5">
                  <el-col :span="12">
                    <p>今日门店充值</p>
                    <p>￥130,000.00</p>
                  </el-col>
                  <el-col :span="12">
                    <p>今日门店充值</p>
                    <p>￥130,000.00</p>
                  </el-col>
                </el-row>
              </li>
            </ul>
            <p class="text-align">{{currentDay}}</p>
            <ul class="date-main clearfix">
              <li>日</li>
              <li>一</li>
              <li>二</li>
              <li>三</li>
              <li>四</li>
              <li>五</li>
              <li>六</li>
              <li v-for="(item, index) in currentMonth" :class="item.Cur" :style="'color:'+item.theme" :key="index">{{item.day}}</li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <Panel CustmerClass="panel-fix m-t-10" :border="true">
      <template slot="header">近十天销售情况</template>
      <template slot="body">
        <img src="/static/images/report.png" width="100%" style="max-width:1019px" alt="">
      </template>
    </Panel> -->
    <div class="sale-msg">
      <div class="sale-heard">近十天销售情况</div>
      <div class="sale-body">
        <img src="/static/images/report.png" width="100%" style="max-width:1019px" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import Panel from '@/components/panel.vue'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      today: {
        week: '星期一',
        day: new Date().getDate()
      },
      currentMonth: [],
      currentDay: dayjs(new Date()).format('YYYY[年]M[月]')
    }
  },
  mounted() {
    switch (parseInt(new Date().getDay())) {
      case 1:
        this.today.week = '星期一'
        break
      case 2:
        this.today.week = '星期二'
        break
      case 3:
        this.today.week = '星期三'
        break
      case 4:
        this.today.week = '星期四'
        break
      case 5:
        this.today.week = '星期五'
        break
      case 6:
        this.today.week = '星期六'
        break
      default:
        this.today.week = '星期日'
        break
    }
    this.getCurrenMonth()
  },
  methods: {
    getCurrenMonth() {
      const d = new Date()
      const curMonthDays = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0
      ).getDate()
      const preMonthDays = new Date(d.getFullYear(), d.getMonth(), 0).getDate()
      const starDay =
        new Date(d.getFullYear(), d.getMonth(), 1).getDay() == 0
          ? 7
          : new Date(d.getFullYear(), d.getMonth(), 1).getDay()

      for (let i = preMonthDays - starDay + 1; i < preMonthDays + 1; i++) {
        this.currentMonth.push({
          day: i, theme: '#ccc' 
        })
      }

      for (let i = 1; i < curMonthDays + 1; i++) {
        if (i == d.getDate()) {
          this.currentMonth.push({
            day: i, Cur: 'cur' 
          })
        } else {
          this.currentMonth.push({
            day: i 
          })
        }
      }
      const len = 42 - this.currentMonth.length
      for (let i = 1; i < len + 1; i++) {
        this.currentMonth.push({
          day: i, theme: '#ccc' 
        })
      }
    }
  },
  components: {
    Panel
  }
}
</script>
<style lang="scss" scoped>
.text-align {
  text-align: center;
  font-size: 14px;
}

.date-main {
  margin: 8px;
  li {
    float: left;
    display: inline;
    width: 14.28%;
    line-height: 24px;
    text-align: center;
    &.cur {
      background: #39a0e5;
      color: #fff;
      border-radius: 5px;
    }
  }
}

.fast-list {
  li {
    float: left;
    margin-right: 40px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    img {
      display: block;
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }
  }
}

.recharge-total {
  background: #fff;
  padding: 10px;
  li {
    float: left;
    display: inline;
    &:last-child {
      width: calc(100% - 90px);
      word-break: break-all;
      word-wrap: break-word;
      text-align: center;
      > div {
        &:first-child {
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 10px;
          padding-bottom: 10px;
        }
      }
      p {
        line-height: 1.2;
        &:last-child {
          color: #e08120;
        }
      }
    }
    &.today {
      margin-right: 10px;
      overflow: hidden;
      border-radius: 5px;

      span {
        display: block;
        &:first-child {
          background: #39a0e5;
          color: #fff;
          padding: 8px 17px;
        }
        &:last-child {
          padding: 8px 15px;
          text-align: center;
          font-size: 36px;
          color: #999;
          border: 1px solid #ddd;
          background: #f5f5f5;
          border-radius: 0 0 5px 5px;
        }
      }
    }
  }
}

.p-t-10 {
  padding-top: 10px;
}
.border-1px {
  border: 1px solid #e5e5e5;
}
.sale-msg {
  margin-top: 10px;
  .sale-heard {
    font-size: 14px;
    padding: 10px 15px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #777777;
    font-weight: 600;
    background: #f5f5f5;
  }
  .sale-body {
    padding: 15px;
  }
}
.p-x-10 {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
