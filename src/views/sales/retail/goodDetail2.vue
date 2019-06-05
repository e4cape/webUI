
<template  >
  <el-dialog class="details-table-dialog" title="查看货品详情" top="0px" :visible="visible" @update:visible="$emit('update:visible', $event)" @open='getGoodDetail'>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 基本信息</div>
      </div>
      <div class="panel-bd">
        <table class="details-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">图片</td>
              <td>
                <img :src="detail.ImageUrl.slice(0,4) === 'http' ? detail.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (detail.ImageUrl ? detail.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')" alt>
              </td>
            </tr>
            <tr>
              <td class="tit">条码</td>
              <td>{{detail.StoreBarCode }}</td>
            </tr>
            <tr>
              <td class="tit">款号</td>
              <td>{{detail.StoreStyleNumber}}</td>
            </tr>
            <tr>
              <td class="tit">货品名称</td>
              <td>{{detail.GoodsName}}</td>
            </tr>
            <tr>
              <td class="tit">零售方式</td>
              <td>{{RetailType.Types[detail.RetailType]}}</td>
            </tr>
            <tr>
              <td class="tit">品类</td>
              <td>{{$store.getters.categoryType.Types[detail.CategoryType]}}</td>
            </tr>
            <tr>
              <td class="tit">材质</td>
              <td>{{$store.getters.materialType.Types[detail.MaterialType]}}</td>
            </tr>
            <tr>
              <td class="tit">成色</td>
              <td>{{$store.getters.goldType.Types[detail.GoldType]}}</td>
            </tr>
            <tr>
              <td class="tit">零售价/工费</td>
              <td>￥{{$root.toFloat(detail.RetailPrice)}}</td>
            </tr>
            <tr>
              <td class="tit">净金重(克)</td>
              <td>{{$root.toFloat(detail.GoldWeight)}}g</td>
            </tr>
            <tr>
              <td class="tit">标签售价</td>
              <td>￥{{$root.toFloat(detail.LabelPrice)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { RetailType } from '@/enums/stocking.js'
import { ORDER_API_RETAIL_ORDER_SELL_BASIC_GET } from '@/apis/order.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sellCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      RetailType: RetailType,
      detail: {
        ImageUrl: ''
      }
    }
  },
  methods: {
    getGoodDetail() {
      ORDER_API_RETAIL_ORDER_SELL_BASIC_GET({
        SellCode: this.sellCode
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_PAYMENT_TYPE')
      this.$store.dispatch('GET_SERIES_TYPE')
    },
  },
  created() {
  }
}
</script>