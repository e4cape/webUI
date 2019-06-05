
<template>
  <div class="content">
    <div class="my-status">
      <div class="notbegun">
        <span>未开始</span>
        <span>{{summary.NotYetAmt || 0}}</span>
      </div>
      <div class="going">
        <span>进行中</span>
        <span>{{summary.OnGoingAmt || 0}}</span>
      </div>
      <div class="finish">
        <span>已完成</span>
        <span>{{summary.FinishAmt || 0}}</span>
      </div>
    </div>
    <div class="buttons">
      <el-radio-group
        style="margin-top: -1px;"
        v-model="queryForm.State"
        @change="onSearch"
      >
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="employeeExamBasicState.Notyet">未开始</el-radio-button>
        <el-radio-button :label="employeeExamBasicState.Ongoing">进行中</el-radio-button>
        <el-radio-button :label="employeeExamBasicState.Finish">已完成</el-radio-button>
      </el-radio-group>
      <el-input
        class="m-l-5"
        style="width: 200px;"
        v-model="queryForm.CourseTitle"
        placeholder="请输入搜索内容回车进行搜索"
        @keyup.enter.native="onSearch"
      ></el-input>
    </div>

    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="AddressId"
        align="center"
        label="课程"
        width="650"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div class="course">
            <router-link
              :to="'/science/videoCheck?id=' + scope.row.CourseId + '&name=' + (scope.row.CourseType == infrastCourseType.Video ? '视频' : '文章')"
              class="course-img"
            >
              <img
                v-if="scope.row.ImageUrl"
                :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl"
                alt
              >
              <img
                v-else
                src="@/assets/images/nopage.jpg"
                alt
              >
              <span v-if="selfPower.PackId < scope.row.PackId">{{scope.row.PackName}}</span>
            </router-link>
            <div class="course-message">
              <div class="title">{{scope.row.CourseTitle}}</div>
              <div class="message">{{scope.row.CourseNote}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="Name"
        align="center"
        label="是否需要考试"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <strong class="strong">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</strong>
          <div
            class="message"
            v-if="scope.row.IsPaper == yNStatus.Yes"
          >总分{{scope.row.TotalScore}}，合格{{scope.row.PassScore}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="PaperAmt"
        align="center"
        label="考试次数"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Score"
        align="center"
        label="考试成绩"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div
            class="force-wrap"
            v-if="scope.row.IsPaper == yNStatus.Yes"
          >
            <div>{{scope.row.Score}}</div>
            <div class="message">{{employeeExamPaperPassState.Types[scope.row.PassState]}}</div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Mobile"
        align="center"
        label="状态"
        min-width="100"
        show-overflow-tooltip
        fixed="right"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.State == employeeExamBasicState.Finish"
            class="finish"
          >已完成</span>
          <span
            v-else-if="scope.row.State == employeeExamBasicState.Notyet"
            class="notbegun"
          >未开始</span>
          <span
            v-else-if="scope.row.State == employeeExamBasicState.Ongoing"
            class="going"
          >进行中</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Mobile"
        align="center"
        label="操作"
        min-width="100"
        show-overflow-tooltip
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="force-wrap">
            <el-button
              type="primary"
              @click="$router.push({path: '/science/videoCheck?id=' + scope.row.CourseId + '&name=' + (scope.row.CourseType == infrastCourseType.Video ? '视频' : '文章')})"
            >学习</el-button>
            <template v-if="scope.row.IsPaper == yNStatus.Yes && scope.row.State != employeeExamBasicState.Notyet">
              <el-button
                v-if="nowCourseId == scope.row.CourseId && parseInt(haveDate) > -600"
                @click="examBegin($event,scope.row, nowPaperId)"
              >继续考试</el-button>
              <el-button
                v-else
                @click="examBegin($event,scope.row)"
              >{{scope.row.PassState != employeeExamPaperPassState.Passed ? '考试' : '重新考试'}}</el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <div class="p10">
      <pagination
        :pg="queryForm.PageIndex"
        :size="queryForm.PageSize"
        :total="total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
    </div>
    <!-- End 分页组件 -->

    <!-- 科技院升级套餐 -->
    <el-dialog
      title="升级"
      :visible.sync="collegeUpVisible"
      width="700px"
      custom-class="informs"
    >
      <div class="h2">您正在进行科技院升级操作</div>
      <el-form
        label-width="130px"
        style="margin-top: 10px;"
        :rules="rules"
        :model="collegeUpFrom"
        ref="form"
      >
        <el-form-item label="升级套餐：">
          <el-radio-group
            v-model="collegeUpFrom.PackId"
            @change="getCollegePackDetail(collegeUpFrom.PackId)"
          >
            <template v-for="(item, index) in collegePackList">
              <el-radio-button
                :label="item.PackId"
                v-if="item.PackId > selfPower.PackId"
                :key="index"
              >{{item.PackName}}</el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐说明：">
          <p style="width: calc(100% - 30px);">{{collegeUpFrom.text}}</p>
        </el-form-item>
        <el-form-item label="续费时长：">
          <el-radio-group v-model="collegeUpFrom.Year">
            <el-radio-button
              :label="index"
              :key="index"
              v-for="(item,index) in continueTimeUpDetail.Prices"
            >{{item.Year}}年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="套餐金额："
          v-if="continueTimeUpDetail.Prices"
        >
          <span
            style="text-decoration: line-through;"
            v-if="startPrice != endRank"
            class="m-r-5 other-price"
          >￥{{startPrice}}</span>
          <span class="other-price">￥{{endRank}}</span>
        </el-form-item>
        <el-form-item
          label
          v-if="continueTimeUpDetail.Prices && continueTimeUpDetail.Prices[collegeUpFrom.Year].Rank != 10"
        >
          <span class="green">{{spare}}</span>
        </el-form-item>
        <el-form-item
          label="原套餐抵扣："
          v-if="deduction > 0"
        >
          <span class="other-price">￥{{deduction}}</span>
        </el-form-item>
        <el-form-item
          label="应付金额："
          v-if="continueTimeUpDetail.Prices"
        >
          <span class="red-price">￥{{actualPay}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="$store.getters.is_loading"
          @click="collegeToUpPay(packOrderBasicOrderType.Upgrade)"
        >立即支付</el-button>
        <el-button @click="collegeUpVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 科技院续费 -->
    <el-dialog
      title="充值"
      :visible.sync="collegeRecVisible"
      width="600px"
      custom-class="informs"
    >
      <div class="h2">您正在进行科技院续费操作</div>
      <el-form
        label-width="130px"
        style="margin-top: 10px;"
        :rules="rules"
        :model="collegeVouFrom"
        ref="form"
      >
        <el-form-item label="当前套餐：">
          <el-tag type="success">{{selfPower.PackName}}</el-tag>
          <el-button
            type="text"
            class="m-l-10"
            @click="collegeUpVisible =  true"
          >升级套餐</el-button>
        </el-form-item>
        <el-form-item
          label="续费时长："
          prop="Year"
        >
          <el-radio-group v-model="collegeVouFrom.Year">
            <el-radio-button
              :label="item.Year"
              :key="index"
              v-for="(item,index) in continueTimeDetail.Prices"
            >{{item.Year}}年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐金额：">
          <span
            style="text-decoration: line-through;"
            v-if="xfStartPrice != xfEndRank"
            class="m-r-5 other-price"
          >￥{{xfStartPrice}}</span>
          <span class="other-price">￥{{xfEndRank}}</span>
        </el-form-item>
        <el-form-item
          label
          v-if="parseInt(xfStartPrice) > parseInt(xfEndRank)"
        >
          <span class="green">￥{{xfSpare}}</span>
        </el-form-item>
        <el-form-item label="应付金额：">
          <span class="red-price">￥{{xfEndRank}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="$store.getters.is_loading"
          @click="collegeToUpPay(packOrderBasicOrderType.Renew)"
        >确定</el-button>
        <el-button @click="collegeRecVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="充值二维码"
      :visible.sync="qrCodeVisible"
      width="400px"
      custom-class="informs"
    >
      <div class="qrcode-box">
        <div class="pay-price">应付金额：￥{{qrCodeInfo.amount}}</div>
        <div class="qrcode">
          <img
            class="pay"
            :src="qrCodeInfo.qrCode"
            alt
          >
          <img
            src="@/assets/images/pay1.png"
            alt
          >
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="$store.getters.is_loading"
          @click="getQueryOrder"
        >完成支付</el-button>
        <el-button @click="qrCodeVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <beforeExam
      v-if="examVisble"
      :examVisble="examVisble"
      :haveExam="{haveDate: haveDate, nowPaperId: nowPaperId, nowCourseId: nowCourseId}"
      :examDetail="examDetail"
      @listenVisible="listenVisible"
    ></beforeExam>
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import beforeExam from '../beforeExam'

import { YNStatus, PaymentType } from '@/enums/common'
import {
  InfrastCourseType,
  EmployeeExamPaperPassState,
  EmployeeExamBasicState,
  PackOrderBasicOrderType,
  CharacterPackState
} from '@/enums/science'
import {
  COLLEGE_API_CHARACTERSOLUTIONITEM_SUMMARY,
  COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE,
  COLLEGE_API_EMPLOYEEEXAMPAPER_REQ,
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST,
  COLLEGE_API_SETTINGPACK_GET,
  COLLEGE_API_CHARACTERPACK_GETBYSTORE,
  COLLEGE_API_PACKORDERBASIC_CREATEBYSTORE,
  COLLEGE_API_PACKORDERBASIC_CALLBACK
} from '@/apis/science'

export default {
  data() {
    return {
      yNStatus: YNStatus,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      infrastCourseType: InfrastCourseType,
      employeeExamBasicState: EmployeeExamBasicState,
      packOrderBasicOrderType: PackOrderBasicOrderType,
      employeeState: 0,
      total: 0,
      data: [],
      qrCodeVisible: false, // 支付弹窗扫码
      qrCodeInfo: {
        amount: '',
        qrCode: '',
        orderId: '',
        type: ''
      }, // 弹窗显示二维码等信息
      queryForm: {
        PageIndex: 1,
        PageSize: 10,
        State: 0,
        CourseTitle: ''
      },
      parameters: {},
      rules: {
        count: {
          required: true,
          message: '请选择套餐',
          trigger: 'change'
        },
        Year: {
          required: true,
          message: '请选择续费时长',
          trigger: 'change'
        }
      },
      timer: null,
      examCourseId: '',
      examVisble: false,
      collegeUpVisible: false, // 升级弹窗
      collegeRecVisible: false, // 续费弹窗
      examDetail: {},
      selfPower: {}, // 当前套餐
      continueTimeUpDetail: {},
      continueTimeDetail: {}, // 科技院充值的续费数据
      collegePackList: [],
      collegeUpFrom: {
        PackId: '',
        Year: 0,
        text: ''
      }, // 科技院升级数据
      collegeVouFrom: {
        Year: 0
      }, // 科技院续费
      summary: {
        finishAmt: 0,
        notYetAmt: 0,
        onGoingAmt: 0,
        totalAmt: 3
      },
      haveDate: -99999,
      nowCourseId: '',
      nowPaperId: ''
    }
  },
  computed: {
    spare() {
      // 打折信息
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return (
        prices[index].Rank +
        '折，节省￥' +
        (prices[index].CouponPrice / 10000).toFixed(2)
      )
    },
    startPrice() {
      // 套餐原价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return (prices[index].Price / 10000).toFixed(2)
    },
    endRank() {
      // 折后价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return (
        (prices[index].Price - prices[index].CouponPrice) /
        10000
      ).toFixed(2)
    },
    deduction() {
      // 抵扣价格
      // 到期天数*每日平摊+结余差额
      let price = (this.selfPower.SurplusPrice / 10000).toFixed(2)
      return price > 0 ? price : 0
    },
    actualPay() {
      // 最终价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return (
        (prices[index].Price -
          prices[index].CouponPrice -
          this.selfPower.SurplusPrice) /
        10000
      ).toFixed(2)
    },
    xfSpare() {
      let obj = this.continueTimeDetail.Prices
        ? this.continueTimeDetail.Prices.find(item => {
          return item.Year == this.collegeVouFrom.Year
        })
        : { Price: 0, Rank: 0 }
      return `${obj.Rank}折，节省￥${(
        (((10 - obj.Rank) / 10) * obj.Price) /
        10000
      ).toFixed(2)}`
    },
    xfStartPrice() {
      let obj = this.continueTimeDetail.Prices
        ? this.continueTimeDetail.Prices.find(item => {
          return item.Year == this.collegeVouFrom.Year
        })
        : { Price: 0 }
      return (obj.Price / 10000).toFixed(2)
    },
    xfEndRank() {
      let obj = this.continueTimeDetail.Prices
        ? this.continueTimeDetail.Prices.find(item => {
          return item.Year == this.collegeVouFrom.Year
        })
        : { Price: 0, Rank: 0 }
      return (((obj.Rank / 10) * obj.Price) / 10000).toFixed(2)
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          PageIndex: 1,
          PageSize: 10,
          State: 0,
          CourseTitle: ''
        },
        query
      )
      this.getKs()
      this.getData()
      this.getSelfPower()
    },
    getSelfPower() {
      COLLEGE_API_CHARACTERPACK_GETBYSTORE().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            this.selfPower = res.data.Data
          }
        }
      })
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    examBegin(e, row, id) {
      e.currentTarget.blur()
      if (id) {
        this.$router.push({
          path: '/science/examination?id=' + this.nowPaperId
        })
      } else if (
        row.PackId != 1 &&
        this.selfPower.PackState == CharacterPackState.Expire
      ) {
        this.$confirm('您的套餐已到期，是否续费？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.collegeRecVisible = true
          })
          .catch(() => {})
      } else if (row.PackId <= this.selfPower.PackId) {
        this.examVisble = true
        this.examDetail = row
      } else {
        this.$confirm(
          '您的套餐等级不够，不能参加这个考试，是否升级套餐？',
          '提示',
          {
            confirmButtonText: '是',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.collegeUpVisible = true
          })
          .catch(() => {})
      }
    },
    listenVisible() {
      this.examVisble = false
    },
    getSummary() {
      COLLEGE_API_CHARACTERSOLUTIONITEM_SUMMARY().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
        }
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.data = res.data.Data.Subset
        }
      })
    },
    collegeToUpPay(type) {
      // 科技院（升级套餐/续费）支付请求
      if (type == PackOrderBasicOrderType.Upgrade && this.actualPay < 0) {
        this.$message.error('应付金额不能为负数！')
        return
      }
      let param = {}
      if (type == PackOrderBasicOrderType.Upgrade) {
        param = {
          OrderType: PackOrderBasicOrderType.Upgrade, // 需要amy提供方案判断那个套餐是免费的，当前的套餐为免费且升级操作需要用首次购买枚举PackOrderBasicOrderType.First
          PackId: this.collegeUpFrom.PackId,
          Years: this.continueTimeUpDetail.Prices[this.collegeUpFrom.Year].Year,
          PaymentType: PaymentType.WechatPay
        }
      } else {
        param = {
          OrderType: PackOrderBasicOrderType.Renew, // 枚举续费
          PackId: this.selfPower.PackId, // 当前套餐id
          Years: this.collegeVouFrom.Year, // 续费时长
          PaymentType: PaymentType.WechatPay // 支付方式
        }
      }
      COLLEGE_API_PACKORDERBASIC_CREATEBYSTORE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          // this.qrCodeInfo.type = 'college'
          this.qrCodeInfo.amount = this.$root.toFixed(
            res.data.Data.PaidPrice / 10000,
            2
          )
          this.qrCodeInfo.qrCode = res.data.Data.QrCode
          this.qrCodeInfo.orderId = res.data.Data.OrderId
          this.qrCodeVisible = true
        }
      })
    },
    getQueryOrder() {
      this.qrCodeVisible = false
      COLLEGE_API_PACKORDERBASIC_CALLBACK({
        OrderNo: this.qrCodeInfo.orderId
      }).then(res => {
        this.getSelfPower()
        if (res.data.Code === 'CORRECT') {
          this.$message.success('支付成功')
          // if (res.data.Data.status == 1) {
          //   this.$message.error('待支付')
          // } else {
          //   this.$message.success('支付成功，' + res.data.Data['暂时没有字段'] + '元')
          // }
        }
      })
    },
    getKs() {
      // 获取考试信息
      COLLEGE_API_EMPLOYEEEXAMPAPER_REQ().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data || !res.data.Data.PaperId) {
            return // 没有正在考试的课程
          }
          this.nowPaperId = res.data.Data.PaperId
          this.nowCourseId = res.data.Data.CourseId
          this.haveDate =
            (Date.parse(res.data.Data.Expiree) -
              Date.parse(res.data.Data.NowTime)) /
            1000
          if (this.haveDate > -600) {
            this.countDown(this.haveDate)
          }
        }
      })
    },
    countDown(haveDate) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (haveDate <= -600) {
          // 十分钟交卷时间
          this.haveDate = haveDate
          clearInterval(this.timer)
          return
        }
        haveDate = haveDate - 1
      }, 1000)
    },
    getCollegePackList() {
      // 科技院套餐列表
      if (this.collegePackList.length) {
        return
      }
      COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.collegePackList = res.data.Data.Subset
          if (res.data.Data.Subset.length > 0) {
            let fristItem = res.data.Data.Subset.find(pack => {
              return pack.PackId > this.selfPower.PackId
            })
            this.collegeUpFrom.PackId = fristItem.PackId
            this.getCollegePackDetail(fristItem.PackId)
          }
        }
      })
    },
    getCollegePackDetail(id, back) {
      // 科技院套餐下面的升级续费价格
      COLLEGE_API_SETTINGPACK_GET({
        PackId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (back) {
            back(res.data.Data)
          } else {
            this.collegeUpFrom.text = res.data.Data.Note
            res.data.Data.Prices = JSON.parse(res.data.Data.Prices || {})
            this.collegeUpFrom.Year = 0
            this.continueTimeUpDetail = res.data.Data
          }
        }
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    }
  },
  mounted() {
    this.getSummary()
    this.init()
  },
  watch: {
    $route: 'init',
    collegeUpVisible: 'getCollegePackList'
  },
  components: {
    pagination,
    beforeExam
  }
}
</script>
<style lang="scss" scoped>
.buttons {
  width: 100%;
  border-top: 1px solid #e5e5e5;
}
.my-status {
  display: flex;
  // justify-content: center;
  padding: 34px 0;
  .notbegun,
  .going,
  .finish {
    display: flex;
    width: 160px;
    align-items: center;
    flex-direction: column;
    span {
      font-size: 46px;
      &:first-child {
        font-size: 18px;
        line-height: 34px;
      }
    }
  }
}

.notbegun {
  color: #da0000;
}
.going {
  color: #ffa200;
}
.finish {
  color: #399fe5;
}
.course {
  display: flex;
  .course-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    width: 240px;
    height: 135px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      top: 0;
      right: 20px;
      padding: 4px 10px;
      color: #fff;
      background-color: #ffa200;
      border-radius: 0 0 2px 2px;
    }
  }
  .course-message {
    width: calc(100% - 260px);
    text-align: left;
    max-height: 135px;
    .title {
      width: 100%;
      font-size: 14px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      color: #333;
      text-overflow: ellipsis;
    }
    .message {
      width: 100%;
      margin-top: 2px;
      color: #777;
      word-break: break-all;
      word-break: break-word; /* IE */
      word-wrap: break-word; /* IE */
      white-space: pre-wrap; /* css-3 */
      white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
      white-space: -pre-wrap; /* Opera 4-6 */
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
.force-wrap {
  display: flex;
  height: 70px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .el-button {
    margin: 0;
    width: 80px;
    &:last-child {
      margin-top: 10px;
    }
  }
}
.strong {
  font-weight: 600;
}
.h2 {
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  line-height: 30px;
  text-align: center;
  color: #ffa200;
  margin: 10px;
}
.red-price {
  font-size: 14px;
  font-weight: 600;
  color: #da0000;
}
.other-price {
  font-size: 14px;
  color: #777;
  font-weight: 600;
}
</style>

