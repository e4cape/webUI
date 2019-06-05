<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">质检({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">来源</td>
                <td>{{GoodsQualityOrderBasicQualityType.Types[detail.QualityType]}}</td>
                <td class="tit">来源单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
              </tr>
              <tr>
                <td class="tit">完成时间</td>
                <td>{{detail.QualityTime | filterDateMinutes}}</td>
                <td class="tit"></td>
                <td></td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10" style="height:28px;">
          <div class="fr">
            <span class="detail-info-num-item">
              到货数量：
              <b class="num">{{detail.ArriveQty}}</b>
            </span>
            <span class="detail-info-num-item">
              次品数量：
              <b class="num">{{detail.WeekQty}}</b>
            </span>
          </div>
        </div>
        <div
          class="goods-wrapper"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>
                    <label
                      name="allChecked"
                      role="checkbox"
                      class="el-checkbox is-checked fl p-r-10"
                      aria-checked="true"
                    >
                      <!-- <span aria-checked="mixed" :class="['el-checkbox__input', allChecked ? 'is-checked': '', goodsData.length ? '' : 'is-disabled']">
                        <span class="el-checkbox__inner"></span>
                        <input name="allChecked" type="checkbox" class="el-checkbox__original" v-model="allChecked" :disabled="!goodsData.length" />
                      </span>-->
                    </label>
                    序号
                  </th>
                  <th>条码</th>
                  <th>货品名称</th>
                  <th>数量</th>
                  <th>次品</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  name="rowSelect"
                  v-for="(item, index) in goodsData"
                  :key="item.index"
                  :class="{active:item.ItemId === itemId}"
                  @click="rowSelect(item)"
                >
                  <td>
                    <div style="margin:0;width:28px;">
                      <!-- <label name="allCheckedList" role="checkbox" class="el-checkbox is-checked" aria-checked="true">
                        <span aria-checked="mixed" :class="['el-checkbox__input', allCheckedList[index]['checked'] ? ' is-checked': '']">
                          <input name="checkbox" type="checkbox" :checked="allCheckedList[index]['checked']" class="el-checkbox__original" @change="changeChecked(item, index)" />
                          <span class="el-checkbox__inner"></span>
                        </span>
                      </label>-->
                      &emsp;{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}
                    </div>
                  </td>
                  <td :title="item.StoreBarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td>{{item.Quantity}}</td>
                  <td>
                    <el-input-number
                      name="WeekQty"
                      v-model="item.WeekQty"
                      controls-position="right"
                      @change="handleChange(item)"
                      :min="0"
                    ></el-input-number>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select
                  filterable
                  v-model="parameters.PageSize"
                  placeholder="20"
                  name="pageSize"
                >
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="parameters.PageIndex === 1"
                    :class="{'isDisabled': parameters.PageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{parameters.PageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="parameters.PageIndex === pages"
                    :class="{'isDisabled': parameters.PageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
              </div>
              <goods-details :itemId="itemId" v-if="itemId" :apis="apis" :option="option"></goods-details>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button
        type="primary"
        @click="orderSubmit($event)"
        :loading="$store.getters.is_loading"
        name="orderSubmit"
      >完成并提交</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import {
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  GoodsQualityOrderBasicQualityType,
  GoodsQualityOrderBasicStepState
} from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEWEEKQTY,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH
} from '@/apis/stocking.js'
import goodsDetails from '@/components/purchase/goodsDetails'

export default {
  data() {
    return {
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      apis: STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
      detail: {}, // 基本信息
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      QualityId: '',
      goodsId: '', // 选中的货品id
      itemId: '',
      currentRow: [],
      allChecked: false,
      allCheckedList: [],
      option: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsQualityOrderBasic1,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0
      }
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.parameters.PageSize === 0
          ? Math.ceil(this.totalCount / this.parameters.PageSize)
          : parseInt(this.totalCount / this.parameters.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.option.KindTypeEk = this.detail.KindTypeEk
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData &&
            this.goodsData.length &&
            this.goodsData[0].QualityId
          this.itemId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.currentRow =
            this.goodsData && this.goodsData.length && this.goodsData[0]
          this.indexPageSize = this.parameters.PageSize
          this.indexPageIndex = this.parameters.PageIndex
          this.indexTotalCount = this.totalCount
          this.allCheckedList = res.data.Data.Rows || []
          this.goodsData.map((item, index) => {
            item.$index = index
            this.$set(
              this.allCheckedList,
              index,
              Object.assign(item, {
                checked: false
              })
            )
            return item
          })
        } else {
          this.$message.error('数据请求失败')
          this.goodsData = []
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    rowSelect(item) {
      this.goodsId = item.QualityId
      this.itemId = item.ItemId
      this.currentRow = item
    },
    prevPage() {
      this.parameters.PageIndex -= 1
    },
    nextPage() {
      this.parameters.PageIndex += 1
    },
    toCreateGoods() {
      if (!this.parameters.QualityId) {
        return false
      }
      this.$router.push({
        path: '/purchase/inspectionProduct/index'
      })
    },
    orderSubmit($event) {
      $event.currentTarget.blur()
      this.$confirm('是否提交质检?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.currentRow.WeekQty > this.currentRow.Quantity) {
            return this.$message.error('次品数量不能大于总数')
          }
          // STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEWEEKQTY({
          //   QualityId:  this.parameters.QualityId,
          //   Items: [{ItemId: this.currentRow.ItemId, WeekQty: this.currentRow.WeekQty}]
          // }).then(res => {
          //   if (res.data.Code === 'CORRECT') {
          //     STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
          //       QualityId: this.parameters.QualityId,
          //       QualityState: GoodsQualityOrderBasicStepState.Finish
          //     }).then(res => {
          //       if (res.data.Code === 'CORRECT') {
          //         this.$router.push('/purchase/inspectionProduct/index')
          //       }
          //     })
          //   } else {
          //     this.$message.error(res.data.Message)
          //   }
          // })
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.parameters.QualityId,
            QualityState: GoodsQualityOrderBasicStepState.Finish
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$router.push('/purchase/inspectionProduct/index')
            }
          })
        })
        .catch(() => {})
    },
    handleChange(item) {
      if (item.WeekQty > item.Quantity) {
        return this.$message.error('次品数量不能大于总数')
      }
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEWEEKQTY({
        QualityId: this.parameters.QualityId,
        Items: [{ ItemId: item.ItemId, WeekQty: item.WeekQty }]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.getDetail()
        }
      })
    },
    changeChecked(item, index) {
      this.$set(
        this.allCheckedList,
        index,
        Object.assign(item, {
          checked: !this.allCheckedList[index].checked
        })
      )
      this.getCheckedList()
    },
    getCheckedList() {}
  },
  mounted() {
    let query = this.$route.query
    this.parameters.QualityId = parseInt(query.id)
    if (!this.parameters.QualityId) {
      this.dataError()
    } else {
      this.getDetail()
    }
  },
  watch: {
    PageIndex: 'getGoods',
    PageSize() {
      this.parameters.PageIndex = 1
      this.getGoods()
    },
    allChecked(to) {
      this.allCheckedList.forEach(item => {
        item.checked = to
      })
      this.getCheckedList()
    }
  },
  components: {
    goodsDetails
  }
}
</script>

<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.import-purchase-dialog {
  .el-dialog {
    width: 418px;
  }
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .alert-modflie {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}
.goods-wrapper .goods-left .toolsbar {
  height: 32px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.matchup-title {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
}
.popover-header {
  display: flex;
  > span {
    color: #a89999;
    > &.title {
      color: #444;
    }
  }
}
.goods-wrapper .goods-left .goods-table tr :nth-child(4) {
  width: 12%;
}
.goods-wrapper .goods-left .goods-table tr > :nth-child(3) {
  padding: 0 2%;
  width: 25%;
}
.goods-wrapper .goods-left .goods-table tr > :first-child {
  width: 18%;
  padding-left: 2%;
}
.el-input-number--mini {
  width: 80px;
}
.popver-title {
  font-weight: 700;
}
.num-statistical {
  float: right;
  font-size: 14px;
  margin-top: 5px;
}
</style>
