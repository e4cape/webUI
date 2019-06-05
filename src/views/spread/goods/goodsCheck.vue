<template>
  <div class="content">
    <el-form label-position="right" class="check-goods m-t-20" label-width="133px" ref="formName" :model="form" show-message>
      <el-form-item label="商品编码">
        <span>{{form.ProductId}}</span>
      </el-form-item>
      <el-form-item label="商品首图：" class="imgs-master">
        <img v-if="form.ImageUrl" :src="$root.settings.DOMAIN_IMAGE + form.ImageUrl.replace('{0}','1080x0')" alt="">
      </el-form-item>
      <el-form-item label="商品主图：" class="imgs">
        <img v-for="(item,index) in ImageUrlsList" :key="index" :src="item.url" alt="">
      </el-form-item>
      <el-form-item label="货号：">
        <span>{{form.StyleNumber}}</span>
      </el-form-item>
      <el-form-item label="商品名称：">
        <span>{{form.ProductName}}</span>
      </el-form-item>
      <el-form-item label="商品类型：">
        <span>{{form.ProductType == productType.Virtual? '虚拟商品' :productType.Types[form.ProductType]}}</span><span v-if="form.ProductType == productType.Virtual">[{{form.CouponId}}]</span>
      </el-form-item>
      <el-form-item label="商品分类：">
        <span>{{productBasicPrimeType.Types[form.PrimeType]}}</span>
      </el-form-item>

      <el-form-item v-if="form.PrimeType == 0 || form.PrimeType == productBasicPrimeType.Other" label="规格：" prop="ProductSpec">
        <span>{{form.ProductSpec}}</span>
      </el-form-item>
      <div v-else>
        <el-form-item label="材质：">
          <span>{{$store.getters.materialType.Types[form.MaterialType]}}</span>
        </el-form-item>
        
        <el-form-item label="品类：">
          <span>{{$store.getters.categoryType.Types[form.CategoryType]}}</span>
        </el-form-item>
        
        <el-form-item label="成色：">
          <span>{{$store.getters.goldType.Types[form.GoldType]}}</span>
        </el-form-item>
        
        <el-form-item label="总重量（g）：">
          <span>{{form.Weight}}</span>
        </el-form-item>
        
        <el-form-item label="净金重（g）：">
          <span>{{form.GoldWeight}}</span>
        </el-form-item>
        
        <el-form-item label="手寸（#）：">
          <span>{{form.HandSize}}</span>
        </el-form-item>
        
        <el-form-item label="长度（cm）：">
          <span>{{form.Length}}</span>
        </el-form-item>
        
        <el-form-item label="内径（cm）：">
          <span>{{form.InnerSize}}</span>
        </el-form-item>
        
        <el-form-item label="尺寸（cm）：">
          <span>{{form.Size}}</span>
        </el-form-item>
        
        <el-form-item v-if="form.PrimeType == productBasicPrimeType.UnGold" label="主石信息：" prop="StoneMaster">
          <span>{{form.StoneMaster}}</span>
        </el-form-item>
        
        <el-form-item v-if="form.PrimeType == productBasicPrimeType.UnGold" label="副石信息：" prop="StoneBranch">
          <span>{{form.StoneBranch}}</span>
        </el-form-item>
      </div>          

      <el-form-item label="原价：">
        <span>￥{{form.LabelPrice}}</span>
      </el-form-item>
      <el-form-item label="售价：">
        <span>￥{{form.SalePrice}}</span>
      </el-form-item>
      <el-form-item label="可用库存：">
        <span>{{form.AvailableQty}}</span>
      </el-form-item>          
      <el-form-item label="商品详情：">
        <div style="width: 600px;">
          <div v-html="form.Note" class="edit-detail"></div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  SPREAD_API_SPR_DETAIL
} from '@/apis/spread'
import {
  ProductBasicPrimeType, ProductType
} from '@/enums/spread'
export default {
  data () {
    return {
      productBasicPrimeType: ProductBasicPrimeType,
      productType: ProductType,
      ImageUrlsList: [],
      form: {
        ProductName: '',
        ImageUrl: '',
        ImageUrls: '',
        StyleNumber: '',
        ProductSpec: '',
        PrimeType: 0,
        MaterialType: '',
        CategoryType: '',
        GoldType: '',
        Weight: '',
        GoldWeight: '',
        HandSize: '',
        Length: '',
        InnerSize: '',
        StoneMaster: '',
        StoneBranch: '',
        Size: '',
        LabelPrice: '',
        SalePrice: '',
        AvailableQty: '',
        Note: ''
      },
      productId: ''
    }
  },
  methods: {
    init () {
      let query = this.$route.query
      if (query.id) {
        this.productId = query.id
        this.getDetail()
      } else {
        this.$message.error('数据错误')
        this.$router.push({
          path: '/goods/index' 
        })
      }
    },
    getDetail () {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPR_DETAIL({
        productId: this.productId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          let ImageUrls = res.data.Data.ImageUrls.split(',')
          ImageUrls.forEach(item => {
            this.ImageUrlsList.push({
              name: item,
              url:
                this.$root.settings.DOMAIN_IMAGE + item.replace('{0}', '1080x0')
            })
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  beforeMount () {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_CATEGORY_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
  },
  mounted () {
    this.init()
  },
  watch: {
  }
}
</script>
<style lang="scss">
.fontred {
  margin: 0;
  line-height: 20px;
  margin-top: -10px;
  color: #999;
  clear: both;
}
.el-form-item__content {
  .alertS {
    font-size: 12px;
    color: #d1d1d1;
  }
}
.alertS {
  font-size: 12px;
  color: #d1d1d1;
}
.nextStep {
  span {
    color: #fff !important;
  }
}
.next-step {
  margin-top: 10px;
}
.el-upload__tip {
  height: 20px;
  line-height: 20px;
}
.el-upload--picture-card {
  width: 375px;
}
.el-upload-list {
  .el-upload-list__item-actions,
  .el-upload-list__item {
    width: 375px;
    height: 150px;
  }
}
.imgs {
  img {
    display: block;
    float: left;
    margin: 2px;
    line-height: 0;
    width: 150px;
    height: 150px;
  }
}
.imgs-master img {
    display: block;
    margin: 2px;
    line-height: 0;
    width: 150px;
    height: 150px;
    // border: 1px #0094ff dashed;
}
.check-goods .el-form-item {
  margin-bottom: 0px;
}
.edit-detail {
  ul {list-style-type: disc !important;} 
  ol {list-style-type: decimal !important;} 
  ul, ol {
    display: block !important;
    margin-block-start: 1em !important;
    margin-block-end: 1em !important;
    margin-inline-start: 0px !important;
    margin-inline-end: 0px !important;
    padding-inline-start: 40px !important;
  }
}
</style>
