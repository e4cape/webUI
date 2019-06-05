<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看维修单</span>
      </div>
      <div class="panel-bd">
        <div>
          <p class="p-10 clearfix" style="margin:0;">
            <span class="fl">单据编号：{{detail.RepairCode}}</span>
            <span class="fr init-button-text" @click="showLog">操作记录</span>
          </p>
        </div>
        <div class="p-10">
          <el-steps :active="parseInt(active)" align-center finish-status="success">
            <el-step title="新建" :description="active >= 1 ? description1 : ''"></el-step>
            <el-step title="维修处理" :description=" active >= 2 ? description2 : ''"></el-step>
            <el-step title="完成维修" :description="active >= 3 ? description3 : ''"></el-step>
            <el-step title="收款" :description="active >= 4 ? description4 : ''"></el-step>
            <el-step title="返还顾客" :description="active >= 5 ? description5 : ''"></el-step>
          </el-steps>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <span class="title">基本信息</span>
            </el-col>
          </el-row>
        </div>
        <!-- 信息 -->

        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">预计维修项目：</td>
                <td class="note" colspan="1">{{detail.RepairTypeDvs}}</td>
                <td class="tit">原销售单：</td>
                <td class="note" colspan="1">{{detail.SellCode}}</td>
                <td class="tit">会员ID：</td>
                <td class="note" colspan="1">{{detail.MemberId}}</td>
              </tr>
              <tr>
                <td class="tit">顾客名字：</td>
                <td class="note" colspan="1">{{detail.TrueName}}</td>
                <td class="tit">顾客手机：</td>
                <td class="note" colspan="1">{{detail.Mobile}}</td>
                <td class="tit">购买日期：</td>
                <td class="note" colspan="1">{{detail.RetailTime | filterDateMinutes}}</td>
              </tr>
              <tr>
                <td class="tit">取货方式：</td>
                <td class="note" colspan="1">{{ShippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">收货人姓名：</td>
                <td class="note" colspan="1">{{detail.ReceiptUser}}</td>
                <td class="tit">收货人手机：</td>
                <td class="note" colspan="1">{{detail.ReceiptPhone}}</td>
              </tr>
              <tr>
                <td class="tit">收货人地址：</td>
                <td class="note" colspan="1">{{detail.ProvinceName + '' + detail.CityName + '' + detail.TownName + '' + detail.Address }}</td>
                <td class="tit">快递公司：</td>
                <td class="note" colspan="1">{{ExpressType.Types[detail.ExpressType]}}</td>
                <td class="tit">快递单号：</td>
                <td class="note" colspan="1">{{detail.ExpressCode}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.ReceiptNote}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <span class="title">货品信息</span>
            </el-col>
          </el-row>
        </div>
        <!-- 货品信息 -->
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">货品条码：</td>
                <td class="note" colspan="1">{{detail.BarCode}}</td>
                <td class="tit">货品名称：</td>
                <td class="note" colspan="1">{{detail.GoodsName}}</td>
                <td class="tit">货重(g)：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.Weight,3)}}</td>
              </tr>
              <tr>
                <td class="tit">材质：</td>
                <td class="note" colspan="1">{{$store.getters.materialType.Types[detail.MaterialType]}}</td>
                <td class="tit">品类：</td>
                <td class="note" colspan="1">{{$store.getters.categoryType.Types[detail.CategoryType]}}</td>
                <td class="tit">成色：</td>
                <td class="note" colspan="1">{{$store.getters.goldType.Types[detail.GoldType]}}</td>
              </tr>
              <tr>
                <td class="tit">主石名称：</td>
                <td class="note" colspan="1">{{detail.StoneName}}</td>
                <td class="tit">主石重(ct)：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.StoneWeight,3)}}</td>
                <td class="tit">主石颜色：</td>
                <td class="note" colspan="1">{{StoneColor.Types[detail.StoneColor]}}</td>
              </tr>
              <tr>
                <td class="tit">主石净度：</td>
                <td class="note" colspan="1">{{StoneClarity.Types[detail.StoneClarity]}}</td>
                <td class="tit">主石切工：</td>
                <td class="note" colspan="1">{{StoneCut.Types[detail.StoneCut]}}</td>
                <td class="tit">货品估价(元)：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.PrePrice)}}</td>
              </tr>
              <tr>
                <td class="tit">故障描述</td>
                <td class="note" colspan="5">{{detail.FaultNote}}</td>
              </tr>
              <tr>
                <td class="tit">图片</td>
                <td class="note photoWapper clearfix" colspan="5">
                  <template v-for="(item, index) in photoList">
                    <img
                      v-if="item"
                      :key="index"
                      @click="showPhoto(item.slice(0,4)==='http'? item : $root.settings.DOMAIN_IMG_FILE + item.replace('{0}', '150x150'))"
                      :src="item.slice(0,4)==='http'? item : $root.settings.DOMAIN_IMG_FILE + item.replace('{0}', '150x150')"
                    >
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 维修信息 -->
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <span class="title">维修信息</span>
            </el-col>
          </el-row>
        </div>
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">维修地点：</td>
                <td
                  class="note"
                  colspan="1"
                >{{GoodsRepairOrderBasicPlaceType.Types[detail.PlaceType]}}{{(detail.PlaceType === GoodsRepairOrderBasicPlaceType.Factory ? detail.PartnerName ?'(' + detail.PartnerName +')' : detail.PartnerName : '' )}}</td>
                <td class="tit">实际维修项目：</td>
                <td class="note" colspan="1">{{detail.RepairTypeDvs}}</td>
                <td class="tit">预估维修费：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.PrepairPrice)}}</td>
              </tr>
              <tr>
                <td class="tit">实际维修费(元)：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.RepairPrice)}}</td>
                <td class="tit">实收款：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.PaidPrice)}}</td>
                <td class="tit">收款方式：</td>
                <td class="note" colspan="1">{{detail.PaymentTypeEv}}</td>
              </tr>
              <tr>
                <td class="tit">预计完成时间：</td>
                <td class="note" colspan="5">{{detail.PrepairTime | filterDateMinutes}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="buttons">
      <span v-if="detail.StepState === GoodsRepairOrderBasicStepState.Wait">
        <el-button type="primary" @click="toEdit" name="btnToEdit">修改</el-button>
        <el-button type="primary" @click="repairAbolish" name="btnRepairAbolish">删除</el-button>
        <el-button @click="toRepairChange" name="btnToRepairChange1">维修处理</el-button>
      </span>

      <span v-if="detail.StepState === GoodsRepairOrderBasicStepState.Repairing">
        <el-button type="primary" @click="toRepairChange" name="btnToRepairChange2">完成维修</el-button>
        <el-button @click="repairRevoke" name="btnRepairRevoke2">撤回维修处理</el-button>
      </span>

      <span v-if="detail.StepState === GoodsRepairOrderBasicStepState.Paid">
        <el-button type="primary" @click="toRepairChange" name="btnToRepairChange3">收款</el-button>
        <el-button @click="repairRevoke" name="btnRepairRevoke3">撤回完成维修</el-button>
      </span>

      <span v-if="detail.StepState === GoodsRepairOrderBasicStepState.Return">
        <el-button type="primary" @click="toRepairChange" name="btnToRepairChange4">返还顾客</el-button>
        <el-button @click="repairRevoke" name="btnRepairRevoke4">撤回收款</el-button>
      </span>
    </div>

    <!-- 操作日志 -->
    <el-dialog title="操作记录" :visible.sync="showLogDialog">
      <el-table :data="detail.Logs && JSON.parse(detail.Logs)" :default-sort="{prop: 'CheckTime', order: 'descending'}">
        <el-table-column sortable prop="CheckTime" label="操作时间" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckUser" label="操作人" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckType" label="操作类型" :formatter="formatter" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">{{GoodsRepairOrderBasicStepState.Types[scope.row.CheckState]}}</template>
        </el-table-column>
        <el-table-column prop="CheckNote" label="备注" min-width="180" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>

    <!-- @module Dialog·步骤 -->
    <repairStage :visible.sync="stageDialog" :repairState="detail" @listenstageDialog="getDetail"></repairStage>
    <!-- @module Dialog·步骤 -->

    <!-- @module Dialog·删除 -->
    <repair-abandon :visible.sync="abandonDialog" :selections="detail" @listenAbandonDialog="getDetail"></repair-abandon>
    <!-- End Dialog·删除 -->

    <!-- @module Dialog·撤回维修处理 -->
    <repair-revoke :visible.sync="revokeDialog" :selections="detail" @listenrevokeDialog="getDetail"></repair-revoke>
    <!-- End Dialog·撤回维修 -->

    <checkPhoto :visible.sync="photoDialog" :imgSrc="imgSrc"></checkPhoto>
  </div>
</template>

<script>
import { ShippingType, ExpressType } from '@/enums/common.js'
import { GoodsRepairOrderBasicPlaceType, GoodsRepairOrderBasicStepState, StoneColor, StoneClarity, StoneCut } from '@/enums/stocking.js'
import { STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GET } from '@/apis/stocking.js'

import repairStage from './repairStage.vue'
import repairAbandon from './repairAbandon.vue'
import repairRevoke from './repairRevoke.vue'
import checkPhoto from './checkPhoto.vue'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      data: [],
      repairState: '', // 当前状态
      active: '',
      repairId: '',
      reasonDialog: false,
      returnReasons: [],
      reasonName: '维修项目',
      GoodsRepairOrderBasicPlaceType,
      GoodsRepairOrderBasicStepState,
      ShippingType,
      ExpressType,
      StoneColor,
      StoneClarity,
      StoneCut,
      detail: {
      },
      pg: 1,
      size: 10,
      total: 0,
      showLogDialog: false,
      stageDialog: false,
      abandonDialog: false,
      revokeDialog: false,
      photoList: [],
      photoDialog: false,
      imgSrc: '',
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      description5: ''
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'CheckState':
          return GoodsRepairOrderBasicStepState.Types[val]
        default:
          return
      }
    },
    init() {
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.repairId = parseInt(this.$route.query.id)
        this.getDetail()
      }
    },
    dataError(msg) {
      // 错误返回
      this.$alert(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GET({ RepairId: this.repairId }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          res.data.Data.ImageUrls
            ? (this.photoList = res.data.Data.ImageUrls.split(','))
            : (this.photoList = [])
          switch (res.data.Data.StepState) {
            case this.GoodsRepairOrderBasicStepState.Wait:
              this.active = 1
              break
            case this.GoodsRepairOrderBasicStepState.Repairing:
              this.active = 2
              break
            case this.GoodsRepairOrderBasicStepState.Paid:
              this.active = 3
              break
            case this.GoodsRepairOrderBasicStepState.Return:
              this.active = 4
              break
            case this.GoodsRepairOrderBasicStepState.Finish:
              this.active = 5
              break
            default:
              this.active = 0
              break
          }

          this.detail.Logs && JSON.parse(this.detail.Logs).forEach(res => {
            switch (res.CheckState) {
              case this.GoodsRepairOrderBasicStepState.Wait:
                this.description1 = res.CheckUser + '' + this.$options.filters.filterDateMinutes(res.CheckTime)
                break
              case this.GoodsRepairOrderBasicStepState.Repairing:
                this.description2 = res.CheckUser + '' + this.$options.filters.filterDateMinutes(res.CheckTime)
                break
              case this.GoodsRepairOrderBasicStepState.Paid:
                this.description3 = res.CheckUser + '' + this.$options.filters.filterDateMinutes(res.CheckTime)
                break
              case this.GoodsRepairOrderBasicStepState.Return:
                this.description4 = res.CheckUser + '' + this.$options.filters.filterDateMinutes(res.CheckTime)
                break
              case this.GoodsRepairOrderBasicStepState.Finish:
                this.description5 = res.CheckUser + '' + this.$options.filters.filterDateMinutes(res.CheckTime)
                break
              default:
                break
            }
          })
        }
      })
    },
    toEdit() {
      this.$router.push({
        path: '/sales/repair/repairCreate',
        query: {
          id: this.repairId
        }
      })
    },
    showLog() {
      // 查看操作记录
      this.showLogDialog = true
    },

    repairAbolish(row) {
      // 删除
      this.repairState = row.repairId
      this.abandonDialog = true
    },
    listenPhotoDialog() {
      this.photoDialog = false
    },
    showPhoto(src) {
      console.log(src)
      this.photoDialog = true
      this.imgSrc = src
    },
    repairRevoke() {
      // 撤回金额
      this.revokeDialog2 = true
    },
    // changStart
    toRepairChange() {
      this.stageDialog = true
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE', 0)
      this.$store.dispatch('GET_CATEGORY_TYPE', 0)
      this.$store.dispatch('GET_GOLD_TYPE', 0)
      // this.$store.dispatch('GET_PAYMENT_TYPE', YNStatus.NO)
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    repairStage,
    repairAbandon,
    repairRevoke,
    checkPhoto
  }
}
</script>

<style lang="scss" scoped>
.checkPage-hd {
  padding-bottom: 0;
}
.photoWapper {
  padding: 5px;
  img {
    vertical-align: middle;
    width: 200px;
    height: auto;
    max-height: 150px;
    min-height: 150px;
  }
}
</style>
