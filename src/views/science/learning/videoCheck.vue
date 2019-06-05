<template>
  <div class="content" v-loading="fullLoading">
    <div class="learning-header">
      <div class="left">
        <div class="check-title">
          <span class="title" v-if="detail.CourseTitle">{{detail.CourseTitle}}</span>
          <!-- <i class="icon-zan" :class="{red: !toLiked}"></i>
          <span class="num">{{likeDetail.LikeAmt}}</span>
          <el-button type="text" v-if="toLiked" @click="toLike">赞一下</el-button>
          <el-button type="text" v-else>已赞</el-button> -->
        </div>
        <div class="check-recom">{{detail.CourseNote}}</div>
      </div>
      <div class="check-active">
        <div v-if="detail.IsPaper == yNStatus.Yes && selfPower.PackId >= detail.PackId && (selfPower.PackState != characterPackState.Expire || detail.PackId == 1)">
          <el-button type="primary" v-if="haveDate > -600 && nowCourseId == detail.CourseId" @click="$router.push({path: '/science/examination?id=' + nowPaperId})">继续考试</el-button>
          <el-button type="primary" v-else-if="myResult.PassState != employeeExamPaperPassState.Passed" @click="examVisble=true"><i class="icon-examina m-r-10"></i>考试</el-button>
          <el-button v-else type="primary" @click="examVisble = true"><i class="icon-examina m-r-10"></i>重新考试</el-button>
          <el-button class="w-b" @click="checkVisible = true">查看排名</el-button>
        </div>
      </div>
    </div>
    <div class="no-vip" v-if="selfPower && selfPower.PackName && detail.PackName && selfPower.PackId < detail.PackId || (detail.PackId != 1 && selfPower.PackState == characterPackState.Expire)">
      <i class="el-icon-warning"></i>
      <div v-if="selfPower.PackId < detail.PackId">
        <div class="vip-message">
          <span>浏览该内容需要</span>
          <span>{{detail.PackName}}</span>
        </div>
        <div class="vip-message">
          <span>您所在的门店当前的套餐为</span>
          <span>{{selfPower.PackName}}{{(detail.PackId != 1 && selfPower.PackState == characterPackState.Expire) ? '(已到期)' : ''}}</span>
        </div>
        <div class="vip-message">
          <span>请升级套餐！</span>
        </div>
        <el-button type="primary" @click="collegeUpVisible = true">立即升级</el-button>
      </div>
      <div v-else>
        <div class="vip-message">
          <span>您在科技院的套餐</span>
          <span>{{selfPower.PackName}}</span>
          <span>已到期！</span>
        </div>
        <div class="vip-message">
          <span>目前只能浏览免费资源，请续费！</span>
        </div>
        <el-button type="primary" @click="collegeRecVisible = true">立即续费</el-button>
        <el-button type="primary" @click="collegeUpVisible = true">立即升级</el-button>
      </div>
    </div>
    <div class="play-check" v-else>
      <div class="video-left" v-if="videoOption.playAuth && detail.CourseType == infrastCourseType.Video" v-loading="loadingIf">
        <aliPlayer :vid="videoOption.vid" :cover="videoOption.cover" :playauth="videoOption.playAuth" :height="videoOption.height"></aliPlayer>
      </div>
      <div v-else class="video-left" v-html="detail.Content"></div>
      <div class="video-right">
        <div class="performance" v-if="myResult && myResult.PaperAmt">
          <span>
            <span class="gray">我的考试次数：</span>
            <span>{{myResult.PaperAmt}}</span>
          </span>
          <span>
            <span class="gray">考试成绩：</span>
            <span>{{myResult.Score}}分</span>
          </span>
          <span>
            <span class="gray">考试结果：</span>
            <el-tag type="warning" v-if="myResult.PassState == employeeExamPaperPassState.Passed">合格</el-tag>
            <el-tag type="danger" v-else-if="myResult.PassState == employeeExamPaperPassState.Unpass">不合格</el-tag>
          </span>
        </div>
        <el-radio-group v-model="active" @change="getCardsData">
          <el-radio-button :label="1">热门课程</el-radio-button>
          <el-radio-button :label="2">最新课程</el-radio-button>
          <el-radio-button :label="3">我的必修课</el-radio-button>
        </el-radio-group>
        <div class="learing-items" v-loading="cardLoading">
          <div class="item" v-for="(card, index) in cardData" :key="index">
            <router-link class="img" :to="'/science/videoCheck?id=' + card.CourseId + '&name=' + (card.CourseType == infrastCourseType.Video ? '视频' : '文章')">
              <div class="back-img" :style="`background-image: url(${card.ImageUrl ? (card.ImageUrl.indexOf('http') > -1 ? '' :  $root.settings.DOMAIN_IMG_FILE) + card.ImageUrl : '@/assets/images/nopage.jpg'});`"></div>
              <i class="icon-play" v-if="card.CourseType == infrastCourseType.Video"></i>
              <span v-if="selfPower.PackId < card.PackId">{{card.PackName}}</span>
            </router-link>
            <div class="l-right">
              <div class="title">{{card.CourseTitle}}</div>
              <p class="note">{{card.CourseNote}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 科技院升级套餐 -->
    <el-dialog title="升级" :visible.sync="collegeUpVisible" width="700px" custom-class="informs">
      <div class="strong">您正在进行科技院升级操作</div>
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="collegeUpFrom" ref="form">
        <el-form-item label="升级套餐：">
          <el-radio-group v-model="collegeUpFrom.PackId" @change="getCollegePackDetail(collegeUpFrom.PackId)">
            <template v-for="(item, index) in collegePackList">
              <el-radio-button :label="item.PackId" v-if="item.PackId > selfPower.PackId" :key="index">{{item.PackName}}</el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐说明：">
          <p style="width: calc(100% - 30px);">{{collegeUpFrom.text}}</p>
        </el-form-item>
        <el-form-item label="续费时长：">
          <el-radio-group v-model="collegeUpFrom.Year">
            <el-radio-button :label="index" :key="index" v-for="(item,index) in continueTimeUpDetail.Prices">{{item.Year}}年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐金额：" v-if="continueTimeUpDetail.Prices">
          <span style="text-decoration: line-through;" v-if="startPrice != endRank" class="m-r-5 other-price">￥{{startPrice}}</span>
          <span class="other-price">￥{{endRank}}</span>
        </el-form-item>
        <el-form-item label v-if="continueTimeUpDetail.Prices && continueTimeUpDetail.Prices[collegeUpFrom.Year].Rank != 10">
          <span class="green">{{spare}}</span>
        </el-form-item>
        <el-form-item label="原套餐抵扣：" v-if="deduction > 0">
          <span class="other-price">￥{{deduction}}</span>
        </el-form-item>
        <el-form-item label="应付金额：" v-if="continueTimeUpDetail.Prices">
          <span class="red-price">￥{{actualPay}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="collegeToUpPay(packOrderBasicOrderType.Upgrade)">立即支付</el-button>
        <el-button @click="collegeUpVisible =  false">取消</el-button>
      </div>
    </el-dialog>
<!-- 科技院续费 -->
    <el-dialog title="充值" :visible.sync="collegeRecVisible" width="600px" custom-class="informs">
      <div class="strong">您正在进行科技院续费操作</div>
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="collegeVouFrom" ref="form">
        <el-form-item label="当前套餐：">
          <el-tag type="success">{{selfPower.PackName}}</el-tag>
          <el-button type="text" class="m-l-10" @click="collegeUpVisible =  true">升级套餐</el-button>
        </el-form-item>
        <el-form-item label="续费时长：" prop="Year">
          <el-radio-group v-model="collegeVouFrom.Year">
            <el-radio-button :label="item.Year" :key="index" v-for="(item,index) in continueTimeDetail.Prices">{{item.Year}}年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐金额：">
          <span style="text-decoration: line-through;" v-if="xfStartPrice != xfEndRank" class="m-r-5 ther-price">￥{{xfStartPrice}}</span>
          <span class="other-price">￥{{xfEndRank}}</span>
        </el-form-item>
        <el-form-item label v-if="parseInt(xfStartPrice) > parseInt(xfEndRank)">
          <span class="green">￥{{xfSpare}}</span>
        </el-form-item>
        <el-form-item label="应付金额：">
          <span class="red-price">￥{{xfEndRank}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="collegeToUpPay(packOrderBasicOrderType.Renew)">确定</el-button>
        <el-button @click="collegeRecVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="充值二维码" :visible.sync="qrCodeVisible" width="400px" custom-class="informs">
      <div class="qrcode-box">
        <div class="pay-price">应付金额：￥{{qrCodeInfo.amount}}</div>
        <div class="qrcode">
          <img class="pay" :src="qrCodeInfo.qrCode" alt>
          <img src="@/assets/images/pay1.png" alt>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="getQueryOrder">完成支付</el-button>
        <el-button @click="qrCodeVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <exam-check v-if="checkVisible" :detail="detail" :checkVisible="checkVisible" @listenCheckVisible="listenCheckVisible"></exam-check>

    <beforeExam v-if="examVisble" :examVisble="examVisble" :haveExam="{haveDate: haveDate, nowPaperId: nowPaperId, nowCourseId: nowCourseId}" :examDetail="detail" @listenVisible="listenVisible"></beforeExam>
  </div>
</template>
<script>
import {
  InfrastCourseType,
  EmployeeExamPaperPassState,
  PackOrderBasicOrderType,
  InfrastCourseChannelType,
  CharacterPackState
} from '@/enums/science'
import { COMMON_API_VOD_PLAY } from '@/apis/common' // 获取(播放凭证)
import { YNStatus, PaymentType } from '@/enums/common'
import {
  COLLEGE_API_INFRASTCOURSEBASIC_CACHE,
  COLLEGE_API_EMPLOYEEEXAMBASIC_GET,
  COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM,
  COLLEGE_API_INFRASTCOURSETALLY_LIKEAMT,
  COLLEGE_API_INFRASTCOURSETALLY_LIKE,
  COLLEGE_API_CHARACTERPACK_GETBYSTORE,
  COLLEGE_API_SETTINGPACK_GET,
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST,
  COLLEGE_API_PACKORDERBASIC_CREATEBYSTORE,
  COLLEGE_API_EMPLOYEEEXAMPAPER_REQ,
  COLLEGE_API_EMPLOYEEEXAMBASIC_CREATE,
  COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE,
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE,
  COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE,
  COLLEGE_API_PACKORDERBASIC_CALLBACK
} from '@/apis/science'
import examCheck from '@/views/science/requiredSetting/examCheck'
import beforeExam from '../beforeExam'
import aliPlayer from '@/components/college/video'
import {
  setTimeout, setInterval, clearInterval 
} from 'timers'
import { Promise } from 'q'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      characterPackState: CharacterPackState,
      packOrderBasicOrderType: PackOrderBasicOrderType,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      examVisble: false,
      likeDetail: {
        LikeAmt: 0
      },
      cardData: [],
      cardLoading: false,
      active: 1,
      haveDate: -99999,
      qrCodeVisible: false, // 支付弹窗扫码
      qrCodeInfo: {
        amount: '',
        qrCode: '',
        orderId: '',
        type: ''
      }, // 弹窗显示二维码等信息
      collegeVouFrom: {
        Year: 0
      }, // 续费
      collegeUpFrom: {
        PackId: '',
        Year: 0,
        text: ''
      }, // 科技院升级数据
      collegePackList: [],
      continueTimeUpDetail: {},
      continueTimeDetail: {}, // 科技院充值的续费数据
      toLiked: true,
      collegeUpVisible: false, // 升级
      collegeRecVisible: false, // 续费
      loadingIf: false,
      videoOption: {
        playAuth: '',
        vid: '',
        cover: '',
        height: '600px'
      },
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
      detail: {},
      myResult: {},
      selfPower: {
        Days: '',
        DiffPrice: '',
        PerPrice: ''
      },
      fullLoading: false,
      timer: null,
      nowPaperId: '',
      nowCourseId: '',
      infrastCourseType: InfrastCourseType,
      checkVisible: false
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
      return ((prices[index].Price) / 10000).toFixed(2)
    },
    endRank() {
      // 折后价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return ((prices[index].Price - prices[index].CouponPrice) / 10000).toFixed(2)
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
        (prices[index].Price - prices[index].CouponPrice - this.selfPower.SurplusPrice) / 10000
      ).toFixed(2)
    },
    xfSpare() {
      let obj = this.continueTimeDetail.Prices ? this.continueTimeDetail.Prices.find(item => {
        return item.Year == this.collegeVouFrom.Year
      }) : {Price: 0, Rank: 0}
      return `${obj.Rank}折，节省￥${((10 - obj.Rank) / 10 * obj.Price / 10000).toFixed(2)}`
    },
    xfStartPrice() {
      let obj = this.continueTimeDetail.Prices ? this.continueTimeDetail.Prices.find(item => {
        return item.Year == this.collegeVouFrom.Year
      }) : {Price: 0}
      return (obj.Price / 10000).toFixed(2)
    },
    xfEndRank() {
      let obj = this.continueTimeDetail.Prices ? this.continueTimeDetail.Prices.find(item => {
        return item.Year == this.collegeVouFrom.Year
      }) : {Price: 0, Rank: 0}
      return ((obj.Rank / 10) * obj.Price / 10000).toFixed(2)
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      if (query.id) {
        this.getDetail()
        // this.getLikeAmt() 点赞的暂时不做
        this.getKs() // 真正进行的考试信息
      } else {
        this.$router.back()
      }
    },
    getSelfPower() {
      COLLEGE_API_CHARACTERPACK_GETBYSTORE().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            this.selfPower = res.data.Data
            this.getCollegePackDetail(res.data.Data.PackId, result => {
              result.Prices = JSON.parse(result.Prices)
              this.continueTimeDetail = result
              this.collegeVouFrom.Year = result.Prices[0].Year
            })
            if (res.data.Data.PaperId >= this.detail.PaperId) { // 套餐等级足够，就请求下面接口
              this.getLearning(this.detail.CourseId)
            }
          }
        }
      })
    },
    getCardsData() {
      let apiName = this.active != 3 ? (this.detail.ChannelType == InfrastCourseChannelType.System ? COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE : COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE) : COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE
      let param = {
        CourseTitle: '',
        SmallId: 0,
        LargeId: 0,
        Orderby: this.active == 1 ? 1 : 0 , // 最新最火
        PageIndex: 1,
        PageSize: 5
      }
      if (this.active == 3) {
        param = {
          CourseTitle: '',
          State: 0,
          PageIndex: 1,
          PageSize: 5
        }
      }
      // apiName = COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE
      this.cardLoading = true
      apiName(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.cardData = res.data.Data.Subset
        }
        this.cardLoading = false
      }).catch(() => {
        this.cardLoading = false
      })
    },
    async getDetail() {
      this.fullLoading = true
      let res = await Promise.all([COLLEGE_API_INFRASTCOURSEBASIC_CACHE({CourseId: this.$route.query.id}), COLLEGE_API_CHARACTERPACK_GETBYSTORE()])
      setTimeout(() => {
        this.fullLoading = false
      }, 300)
      if (res[0].data.Code === 'CORRECT') {
        this.detail = res[0].data.Data
        this.videoOption.cover =
          this.$root.settings.DOMAIN_IMG_FILE + res[0].data.Data.ImageUrl
        if (
          res[0].data.Data.CourseType === InfrastCourseType.Video &&
          res[0].data.Data.VideoCode
        ) {
          this.videoOption.playAuth = ''
          this.getVideoPlayAuth(res[0].data.Data.VideoCode) // 报权限问题
        }
        if (this.detail.IsPaper == YNStatus.Yes) {
          this.getBasic()
        }
      } else {
        this.$router.back()
      }
      if (res[1].data.Code === 'CORRECT') {
        if (res[1].data.Data) {
          this.selfPower = res[1].data.Data
          this.getCollegePackDetail(res[1].data.Data.PackId, result => {
            result.Prices = JSON.parse(result.Prices)
            this.continueTimeDetail = result
            this.collegeVouFrom.Year = result.Prices[0].Year
          })
        }
      } else {
        return
      }
      if (res[1].data.Data.PackId >= res[0].data.Data.PackId) { // 套餐等级足够，就请求下面接口
        this.getLearning(res[0].data.Data.CourseId)
        this.getCardsData()
      }
    },
    getLearning(courseId) {
      COLLEGE_API_EMPLOYEEEXAMBASIC_CREATE({CourseId: courseId}).then(() => {})
    },
    getVideoPlayAuth(vid) {
      this.loadingIf = true
      COMMON_API_VOD_PLAY({ VideoId: vid })
        .then(res => {
          this.loadingIf = false
          if (res.data.Code == 'CORRECT') {
            this.videoOption.playAuth = res.data.Data.PlayAuth
            this.videoOption.vid = res.data.Data.VedioId
          }
        })
        .catch(() => {
          this.loadingIf = true
        })
    },
    getBasic() {
      COLLEGE_API_EMPLOYEEEXAMBASIC_GET({
        CourseId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            this.myResult = res.data.Data
          } else {
            this.myResult = {
              PaperAmt: ''
            }
          }
        }
      })
    },
    getLikeAmt() {
      COLLEGE_API_INFRASTCOURSETALLY_LIKEAMT({
        id: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.likeDetail = res.data.Data
        }
      })
    },
    toLike() {
      if (sessionStorage['like-' + this.$route.query.id]) {
        this.$message.error('请勿重复点赞！')
      } else {
        COLLEGE_API_INFRASTCOURSETALLY_LIKE({ CourseId: this.$route.query.id }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.likeDetail.LikeAmt += 1
            this.toLiked = false
            sessionStorage[
              'like-' + this.$route.query.id
            ] = this.likeDetail.LikeAmt
          }
        })
      }
    },
    againExam() {
      COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM({ CourseId: this.$route.query.id}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push({
            path: '/science/examination?id=' + res.data.Data
          })
        }
      })
    },
    listenCheckVisible() {
      this.checkVisible = false
    },
    listenVisible() {
      this.examVisble = false
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
          this.qrCodeInfo.amount = this.$root.toFixed(res.data.Data.PaidPrice / 10000, 2)
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
    getKs() {
      // 获取考试信息
      COLLEGE_API_EMPLOYEEEXAMPAPER_REQ().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data || !res.data.Data.PaperId) {
            return // 没有正在考试的课程
          }
          this.nowPaperId = res.data.Data.PaperId
          this.nowCourseId = res.data.Data.CourseId
          this.haveDate = (Date.parse(res.data.Data.Expiree) - Date.parse(res.data.Data.NowTime)) / 1000
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
          this.haveDate = haveDate
          clearInterval(this.timer)
          return
        }
        haveDate = haveDate - 1
      }, 1000)
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    collegeUpVisible: 'getCollegePackList',
    '$route': 'init'
  },
  components: {
    examCheck,
    beforeExam,
    aliPlayer
  }
}
</script>
<style lang="scss" scoped>
.breadcrumb {
  height: 40px;
  line-height: 36px;
  color: #999999;
  border-bottom: 1px solid #e5e5e5;
}
.learning-header {
  display: flex;
  margin-bottom: 8px;
  .left {
    width: calc(100% - 290px);
  }
  .check-title {
    padding-top: 4px;
    .title {
      color: #333;
      font-size: 16px;
      font-weight: 600;
      padding-right: 20px;
      height: 36px;
      line-height: 36px;
      vertical-align: middle;
    }
    i.icon-zan {
      color: #ddd;
      font-size: 16px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .num {
      vertical-align: middle;
      color: #777;
      margin-right: 20px;
    }
  }
  .check-recom {
    line-height: 24px;
    font-size: 12px;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #777;
  }
  .check-active {
    width: 290px;
    margin-top: 9px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    i {
      font-size: 24px;
      vertical-align: middle;
    }
    .el-button {
      width: 140px;
      /deep/ span {
        vertical-align: middle;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
      }
      &.el-button--default {
        color: #2e98e1;
      }
    }
  }
}
.play-check {
  display: flex;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  padding-top: 15px;
  .video-left {
    width: calc(100% - 420px);
    min-height: 400px;
    overflow: hidden;
  }
  .video-right {
    margin-left: 20px;
    width: 400px;
    .el-radio-group {
      margin: 0!important;
      margin-bottom: -1px!important; // 将下边框与下面div的上边框重合
    }
    /deep/ .el-radio-group {
      display: flex;
      // justify-content: center;
      margin: 15px auto 20px;
    }
  }
}
.red {
  color: red !important;
}
.no-vip {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  padding-top: 115px;
  & > i {
    font-size: 50px;
    color: #da0000;
    margin-right: 24px;
  }
  .vip-message {
    padding-bottom: 13px;
    font-size: 14px;
    span {
      color: #414141;
      padding-right: 5px;
      &:nth-child(2) {
        color: #ffa200;
      }
    }
  }
}
.strong {
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  line-height: 30px;
  text-align: center;
  color: #ffa200;
  margin: 10px;
}
.learing-items {
  width: 100%;
  border: 1px solid #e5e5e5;
  padding: 10px;
  .item {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    overflow: hidden;
    .img {
      position: relative;
      width: 160px;
      height: 90px;
      overflow: hidden;
      .back-img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        transition: all 0.4s;
        background-size: 100% 100%;
      }
      i {
        position: absolute;
        font-size: 120px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        opacity: 0;
        transition: all 0.4s;
      }
      span {
        position: absolute;
        top: 0;
        right: 10px;
        padding: 7px 10px;
        color: #fff;
        background-color: #ffa200;
        border-radius: 0 0 2px 2px;
      }
      &:hover {
        .back-img {
          transform: translate(-50%, -50%) scale(1.1);
        }
        i {
          opacity: 1;
          font-size: 60px;
        }
      }
    }
    .l-right {
      padding-left: 12px;
      width: calc(100% - 160px);
      height: 90px;
      .title {
        font-size: 12px;
        color: #333;
        height: 22px;
        line-height: 22px;
      }
      .note {
        display: block;
        color: #bbb;
        font-size: 12px;
        width: 100%;
        line-height: 18px;
        word-break: break-all;
        word-break: break-word; /* IE */
        word-wrap: break-word; /* IE */
        white-space: pre-wrap; /* css-3 */
        white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
        white-space: -pre-wrap; /* Opera 4-6 */
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
.w-b {
  background-color: #fff;
}
.performance {
  display: flex;
  height: 40px;
  justify-content: space-around;
  align-items: center;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  span.gray {
    color: #777;
    font-weight: normal;
  }
  span {
    font-weight: 600;
  }
  &>span {
    margin-right: 10px;
  }
  /deep/ .el-tag {
    border-radius: 0;
  }
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

