
<template  >
  <el-dialog :title="goldData.IsGold === YNStatus.Yes ? '查看素金' : '查看非素' " :visible="visible" @update:visible="$emit('update:visible', $event)" @open="getJunkData">
    <el-form ref="form" :model="goldData" label-width="120px" v-if="goldData">
      <el-form-item label="会员ID：">
        <p>{{checkInfo.vipDetail.MemberId}}</p>
      </el-form-item>
      <el-form-item label="手机号：">
        <p>{{checkInfo.vipDetail.Mobile}}</p>
      </el-form-item>
      <el-form-item label="图片：">
        <img style="width:150px;height:150px" :src="goldData.ImageUrl.slice(0,4) === 'http' ? goldData.ImageUrl :  $root.settings.DOMAIN_IMG_FILE + (goldData.ImageUrl ? goldData.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')" class="avatar">
      </el-form-item>
      <el-form-item label="旧货编号：">
        <p>{{goldData.JunkCode}}</p>
      </el-form-item>
      <el-form-item label="是否本店出售：">
        <p>{{goldData.IsOurStore === YNStatus.Yes ? '是' : '否'}}</p>
      </el-form-item>
      <el-form-item label="旧货名称：">
        <p>{{goldData.JunkName}}</p>
      </el-form-item>
      <el-form-item label="材质：">
        <p>{{ $store.getters.materialType.Types[goldData.MaterialType]}}</p>
      </el-form-item>
      <el-form-item label="品类：">
        <p>{{$store.getters.categoryType.Types[goldData.CategoryType]}}</p>
      </el-form-item>
      <el-form-item label="成色：">
        <p>{{$store.getters.goldType.Types[goldData.GoldType]}}</p>
      </el-form-item>
      <el-form-item label="金重(g)：">
        <p>{{$root.toFloat(goldData.GoldWeight,3)}}</p>
      </el-form-item>
      <el-form-item v-if="checkInfo.type" label="回收金价(元/g)：">
        <p>￥{{$root.toFloat(goldData.RecallGoldPrice)}}</p>
      </el-form-item>
      <!--  非素  -->
      <div v-if="goldData.IsGold !== YNStatus.Yes">
        <el-form-item label="货重(g)：">
          <p>{{$root.toFloat(goldData.Weight,3)}}</p>
        </el-form-item>
        <el-form-item label="主石重（ct）：">
          <p>{{$root.toFloat(goldData.StoneWeight,3)}}</p>
        </el-form-item>
        <el-form-item label="主石颜色：">
          <p>{{StoneColor.Types[goldData.StoneColor]}}</p>
        </el-form-item>
        <el-form-item label="主石净度：">
          <p>{{StoneClarity.Types[goldData.StoneClarity]}}</p>
        </el-form-item>
        <el-form-item label="主石切工：">
          <p>{{StoneCut.Types[goldData.StoneCut]}}</p>
        </el-form-item>
      </div>
      <!--  end  -->
      <el-form-item label="回收金额(元)：">
        <p>￥{{$root.toFloat(goldData.RecallPrice)}}</p>
      </el-form-item>
      <el-form-item label="回收工费(元)：">
        <p>￥{{$root.toFloat(goldData.RecallFee)}}</p>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  ORDER_API_RETAIL_ORDER_BACK_PRODUCT_GET
} from '@/apis/order.js'

import { YNStatus } from '@/enums/common.js'
import { StoneColor, StoneClarity, StoneCut } from '@/enums/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      YNStatus,
      goldData: '',
      StoneColor: StoneColor,
      StoneClarity: StoneClarity,
      StoneCut: StoneCut,
    }
  },
  methods: {
    getJunkData() {
      // 获取数据
      ORDER_API_RETAIL_ORDER_BACK_PRODUCT_GET({
        SequentialId: this.checkInfo.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goldData = res.data.Data
        }
      })
    }
  },
}
</script>
<style scoped="true">
.el-form-item {
  margin-bottom: 10px;
}
</style>