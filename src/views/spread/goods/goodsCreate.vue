<template>
  <div class="content">
    <el-form label-position="right" class="m-t-20 fix-w" label-width="133px" ref="formName" :model="form" :rules="rules" show-message>
      <el-form-item label="商品首图：" class="is-required from-m-0">
        <div name="flileImg" class="banner-uploader" @click="iClick('flileImg')">
          <img v-if="form.BannerUrl || isUpload" :src="isUpload ? base64Img : $root.settings.DOMAIN_IMAGE + form.BannerUrl.replace('{0}','1080x0')" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <input name="upMasterChange" type="file" id="flileImg" style="display: none;" accept="image/jpg, image/jpeg, image/png" @change="upMasterChange">
        </div>
      </el-form-item>
      <el-form-item label>
        <div class="upload_tip">建议尺寸：750*750</div>
      </el-form-item>
      <el-form-item label="商品主图：" class="is-required from-m-0">
        <div class="goods-imgs" v-for="(item, index) in ImageUrlsList" :key="index">
          <img name="checkImg" class="goods-img" :src="item" alt @click="checkImg(index)">
          <img name="removeImg" class="delimg" src="@/assets/images/delimg.png" @click="removeImg(index)">
        </div>
        <div name="flileImg1" v-if="ImageUrlsList.length < 4" class="banner-uploader banner-goods" @click="iClick('flileImg1')">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <input name="uploadChange" type="file" id="flileImg1" style="display: none;" accept="image/jpg, image/jpeg, image/png" @change="uploadChange">
        </div>
      </el-form-item>
      <el-form-item label>
        <div class="upload_tip">支持JPG、PNG格式，建议尺寸为：750*750，最多上传4张，每张大小不超过200Kb</div>
      </el-form-item>
      <el-form-item label="货号：" prop="StyleNumber">
        <el-input name="StyleNumber" :maxlength="30" v-model="form.StyleNumber"></el-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="ProductName">
        <el-input name="ProductName" :maxlength="50" v-model="form.ProductName"></el-input>
      </el-form-item>
      <el-form-item label="商品类型：">
        <el-radio-group name="ProductType" v-model="form.ProductType" @change="productTypeChange">
          <el-radio :label="parseInt(productType.Entity)">
            <span>实物货品</span>
          </el-radio>
          <el-radio :label="parseInt(productType.Virtual)">
            <span class="m-r-5">电子可售卡券</span>
            <el-select name="CouponId" v-if="form.ProductType == productType.Virtual" placeholder="请选择可售卡券" v-model="form.CouponId" filterable>
              <el-option v-for="(item,index) in couponList" :key="index" :label="item.CouponId +'  （'+ item.CouponName + '）'" :value="item.CouponId"></el-option>
            </el-select>
            <span class="m-l-5" v-if="form.ProductType == productType.Virtual">必填，请选择电子可售卡券</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品分类：" prop="PrimeType" class="is-required">
        <el-select name="PrimeType" :disabled="form.ProductType == productType.Virtual" placeholder="请选择" @change="form.MaterialType = 0" v-model="form.PrimeType" :filterable="true">
          <el-option label="请选择" :value="0"></el-option>
          <el-option v-for="(item,index) in productBasicPrimeType.Types" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.PrimeType == 0 || form.PrimeType == productBasicPrimeType.Other" label="规格：" prop="ProductSpec">
        <el-input name="ProductSpec" :maxlength="30" v-model="form.ProductSpec"></el-input>
      </el-form-item>
      <template v-else>
        <el-form-item label="材质：" class="is-required" prop="MaterialType">
          <el-select name="MaterialType" placeholder="请选择" v-model="form.MaterialType" :filterable="true">
            <el-option label="请选择" :value="0"></el-option>
            <template v-for="(item,index) in $store.getters.materialType.TypeArray">
              <el-option
                v-if="(form.PrimeType == productBasicPrimeType.Golded && parseInt(item.Id) < 11 && parseInt(item.Id) != materialType.HardGold3D) || form.PrimeType == productBasicPrimeType.UnGold"
                :key="index"
                :label="item.Value"
                :value="parseInt(item.Id)"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="品类：" prop="CategoryType">
          <el-select name="CategoryType" placeholder="请选择" v-model="form.CategoryType" :filterable="true">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item,index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成色：" :class="form.PrimeType == productBasicPrimeType.Golded ? 'is-required':''" prop="GoldType">
          <el-select name="GoldType" placeholder="请选择" v-model="form.GoldType" :filterable="true">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item,index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="parseInt(item.Id)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="总重量（g）：" prop="Weight">
          <el-input name="Weight" :maxlength="9" v-model="form.Weight" @keyup.native="form.Weight = $root.toFixed(form.Weight, 3)"></el-input>
        </el-form-item>

        <el-form-item label="净金重（g）：" :class="form.PrimeType == productBasicPrimeType.Golded ? 'is-required':''" prop="GoldWeight">
          <el-input name="GoldWeight" :maxlength="9" v-model="form.GoldWeight" @keyup.native="form.GoldWeight = $root.toFixed(form.GoldWeight, 3)"></el-input>
        </el-form-item>

        <el-form-item label="手寸（#）：" prop="HandSize">
          <el-input name="HandSize" :maxlength="9" v-model="form.HandSize" @keyup.native="form.HandSize = $root.toFixed(form.HandSize, 2)"></el-input>
        </el-form-item>

        <el-form-item label="长度（cm）：" prop="Length">
          <el-input name="Length" :maxlength="9" v-model="form.Length" @keyup.native="form.Length = $root.toFixed(form.Length, 2)"></el-input>
        </el-form-item>

        <el-form-item label="内径（cm）：" prop="InnerSize">
          <el-input name="InnerSize" :maxlength="9" v-model="form.InnerSize" @keyup.native="form.InnerSize = $root.toFixed(form.InnerSize, 2)"></el-input>
        </el-form-item>

        <el-form-item label="尺寸（cm）：" prop="Size">
          <el-input name="Size" :maxlength="9" v-model="form.Size" @keyup.native="form.Size = $root.toFixed(form.Size, 2)"></el-input>
        </el-form-item>

        <el-form-item v-if="form.PrimeType == productBasicPrimeType.UnGold" label="主石信息：" prop="StoneMaster">
          <el-input name="StoneMaster" :maxlength="30" v-model="form.StoneMaster"></el-input>
        </el-form-item>

        <el-form-item v-if="form.PrimeType == productBasicPrimeType.UnGold" label="副石信息：" prop="StoneBranch">
          <el-input name="StoneBranch" :maxlength="30" v-model="form.StoneBranch"></el-input>
        </el-form-item>
      </template>

      <el-form-item label="原价：" prop="LabelPrice">
        <el-input name="LabelPrice" :maxlength="9" v-model="form.LabelPrice" @keyup.native="form.LabelPrice = $root.toFixed(form.LabelPrice, 2)"></el-input>
      </el-form-item>
      <el-form-item label="售价：" prop="SalePrice">
        <el-input name="SalePrice" :maxlength="9" v-model="form.SalePrice" @keyup.native="form.SalePrice = $root.toFixed(form.SalePrice, 2)"></el-input>
      </el-form-item>
      <el-form-item label="可用库存：" prop="AvailableQty" class="is-required">
        <el-input name="AvailableQty" :maxlength="9" v-model="form.AvailableQty" @keyup.native="form.AvailableQty = $root.toFixed(form.AvailableQty, 0)"></el-input>
      </el-form-item>
      <el-form-item label="商品详情：" prop="FlagshipType">
        <div style="width: 600px;">
          <editor @listenEditerChange="listenEditerChange" :Note="html"></editor>
          <div class="maxlength" v-if="editorText.length">
            <span :class="editorText.length > 500 ? 'red': ''">{{ editorText.length }}</span>
            <span>/500</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item label>
        <el-button name="btnSaveCreate" type="primary" @click="saveCreate" :loading="$store.getters.is_loading">保存</el-button>
        <el-button name="btnCancel" @click="$router.push({path: '/spread/goods/index'})">取消</el-button>
      </el-form-item>
    </el-form>

    <img-cropper v-if="cropperVisible" :cropperVisible="cropperVisible" :imgSize="imgSize" :url="cropperUrl" @listenCropper="listenCropper"></img-cropper>
    <img-check v-if="checkImgVisible" :checkImgVisible="checkImgVisible" :url="checkImgUrl" @listenUrlCheck="listenUrlCheck"></img-check>
  </div>
</template>
<script>
import editor from '@/components/spread/editor'
import imgCropper from '@/components/spread/imgCropper'
import imgCheck from './imgCheck'
import {
  ProductBasicPrimeType,
  UploadFileType,
  ProductType,
  MaterialType
} from '@/enums/spread'
import {
  CouponSaleType,
  CouponLaunchStatus,
  CouponAuditStatus
} from '@/enums/scoring'
import {
  SPREAD_API_UPLOAD_FILEBASE64,
  SPREAD_API_SPR_CREATE
} from '@/apis/spread'
import { SCORING_API_COUPON_BASIC_GETS } from '@/apis/scoring'
export default {
  data() {
    return {
      productType: ProductType,
      materialType: MaterialType,
      productBasicPrimeType: ProductBasicPrimeType,
      headers: {
        'access-token': this.$store.getters.access_token
      },
      rules: {
        ProductName: {
          required: true,
          message: '请输入商品名称',
          trigger: 'change'
        },
        PrimeType: {
          validator: (rule, value, callback) => {
            if (value <= 0 || !value) {
              callback('请选择商品分类')
            } else {
              callback()
            }
          },
          trigger: 'change'
        },
        LabelPrice: [
          {
            required: true,
            message: '请输入原价',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (isNaN(value - 0)) {
                callback('请输入数字')
              } else if (!value || !(value - 0)) {
                callback('原价不能为零')
              } else if (value > 999999) {
                callback('原价不能大于999999')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        SalePrice: [
          {
            required: true,
            message: '请输入售价',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (isNaN(value - 0)) {
                callback('请输入数字')
              } else if (!value || !(value - 0)) {
                callback('售价不能为零')
              } else if (value > 999999) {
                callback('售价不能大于999999')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        MaterialType: {
          validator: (rule, value, callback) => {
            if (
              (parseInt(this.form.PrimeType) === ProductBasicPrimeType.Golded ||
                parseInt(this.form.PrimeType) ===
                  ProductBasicPrimeType.UnGold) &&
              !value
            ) {
              callback('请选择材质')
            } else {
              callback()
            }
          },
          trigger: 'change'
        },
        GoldType: {
          validator: (rule, value, callback) => {
            if (
              parseInt(this.form.PrimeType) === ProductBasicPrimeType.Golded &&
              !value
            ) {
              callback('请选择成色')
            } else {
              callback()
            }
          },
          trigger: 'change'
        },
        GoldWeight: {
          validator: (rule, value, callback) => {
            if (
              (!value || !(value - 0)) &&
              parseInt(this.form.PrimeType) === ProductBasicPrimeType.Golded
            ) {
              callback('请输入净金重')
            } else if (
              isNaN(value - 0) &&
              parseInt(this.form.PrimeType) === ProductBasicPrimeType.Golded
            ) {
              callback('请输入数字')
            } else {
              callback()
            }
          },
          trigger: 'change'
        },
        AvailableQty: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback('请输入库存')
              } else if (isNaN(value - 0) && value) {
                callback('请输入数字')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      imgurlup:
        this.$root.settings.DOMAIN_APIS.Spread +
        '/api/Upload/File?id=' +
        UploadFileType.SpreadProductImageUrl,
      ImageUrlsList: [],
      couponList: [], // 可售卡券列表
      isUpload: false,
      imgSize: {},
      base64Img: '',
      form: {
        ProductName: '',
        CouponId: '',
        ProductType: ProductType.Entity,
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
      activeName: 'goodsCreate',
      html: '',
      cropperVisible: false,
      urlUpload: '',
      editorText: '',
      checkImgUrl: '',
      checkImgVisible: false
    }
  },
  methods: {
    saveCreate() {
      if (
        !this.form.ImageUrls.split(',').length ||
        !this.form.ImageUrls.length
      ) {
        this.$message.error('请先上传商品图片')
        return false
      } else if (!this.form.ImageUrl) {
        this.$message.error('请先上传默认主图')
        return false
      } else if (this.editorText.length > 500) {
        this.$message.warning('活动说明文字过长')
        return false
      } else if (
        this.form.ProductType == ProductType.Virtual &&
        !this.form.CouponId
      ) {
        this.$message.warning('请输入电子可售卡券')
      }
      this.$refs['formName'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let param = Object.assign({}, this.form, {
            ProductId: this.productId,
            ProductName: this.form.ProductName.trim()
          })
          SPREAD_API_SPR_CREATE(param).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('添加成功')
              this.$router.push({
                path: '/spread/goods/index'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    upMasterChange(e) {
      var vm = this
      var reader = new FileReader()
      reader.onload = (function() {
        return function(e) {
          const isLt2M = e.total / 1024 < 200
          if (!isLt2M) {
            vm.$message.error('上传活动商品图片大小不能超过 200Kb!')
            document.getElementById('flileImg').value = ''
            return false
          }
          if (
            this.result.indexOf('image/jpeg') === -1 &&
            this.result.indexOf('image/png') === -1 &&
            this.result.indexOf('image/jpg') === -1
          ) {
            vm.$message.error('请上传正确文件')
            return false
          }
          vm.cropperVisible = true
          vm.cropperUrl = this.result
          vm.imgSize = {
            width: 750,
            height: 750,
            type: 'master'
          }
          document.getElementById('flileImg').value = ''
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    iClick(id) {
      document.getElementById(id).click()
    },
    uploadChange(e) {
      var vm = this
      var reader = new FileReader()
      reader.onload = (function() {
        return function(e) {
          const isLt2M = e.total / 1024 < 200
          if (!isLt2M) {
            vm.$message.error('上传活动商品图片大小不能超过 200Kb!')
            document.getElementById('flileImg1').value = ''
            return false
          }
          if (
            this.result.indexOf('image/jpeg') === -1 &&
            this.result.indexOf('image/png') === -1 &&
            this.result.indexOf('image/jpg') === -1
          ) {
            vm.$message.error('请上传正确文件')
            return false
          }
          vm.cropperVisible = true
          vm.cropperUrl = this.result
          vm.imgSize = {
            width: 750,
            height: 750,
            type: 'goods'
          }
          document.getElementById('flileImg1').value = ''
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    removeImg(index) {
      this.$confirm('是否删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ImageUrls = this.form.ImageUrls.length
            ? this.form.ImageUrls.split(',')
            : []
          this.ImageUrlsList.splice(index, 1)
          ImageUrls.splice(index, 1)
          this.form.ImageUrls = ImageUrls.join(',')
        })
        .catch(() => {})
    },
    checkImg(index) {
      this.checkImgUrl = this.ImageUrlsList[index]
      this.checkImgVisible = true
    },
    listenUrlCheck() {
      this.checkImgVisible = false
    },
    listenEditerChange(obj) {
      this.form.Note = obj.html
      this.editorText = obj.text
    },
    listenCropper(url, imgSize) {
      if (url) {
        let param = url + ''
        if (this.ImageUrlsList.length >= 4 && imgSize.type !== 'master') {
          this.$message.error('最多上传四张图片')
          return false
        }
        SPREAD_API_UPLOAD_FILEBASE64(
          param.replace('data:image/png;base64,', '')
        ).then(res => {
          if (res.data.Code === 'CORRECT') {
            if (imgSize.type === 'master') {
              this.form.ImageUrl = res.data.Data.Path
              this.base64Img = url
              this.isUpload = true
            } else {
              let ImageUrls = this.form.ImageUrls.length
                ? this.form.ImageUrls.split(',')
                : []
              this.ImageUrlsList.push(url)
              ImageUrls.push(res.data.Data.Path)
              this.form.ImageUrls = ImageUrls.join(',')
            }
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }
      this.cropperVisible = false
    },
    getCouponSales() {
      SCORING_API_COUPON_BASIC_GETS({
        CouponSaleType: CouponSaleType.Online,
        CouponLaunchStatus: CouponLaunchStatus.Audit,
        CheckStatus: CouponAuditStatus.Audit,
        PageIndex: 1,
        PageSize: 99999
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.couponList = res.data.Data.Rows
        }
      })
    },
    productTypeChange() {
      if (this.form.ProductType == ProductType.Virtual) {
        this.form.PrimeType = ProductBasicPrimeType.Other + ''
      }
    }
  },
  beforeMount() {
    this.getCouponSales()
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_CATEGORY_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
  },
  watch: {},
  components: {
    editor,
    imgCropper,
    imgCheck
  }
}
</script>
<style lang="scss" scoped>
.fontred {
  margin: 0;
  line-height: 20px;
  margin-top: -10px;
  color: #999;
  clear: both;
}
/deep/ .el-form-item__content {
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
.el-upload-list /deep/ {
  .el-upload-list__item-actions,
  .el-upload-list__item {
    width: 375px;
    height: 150px;
  }
}
.banner-master /deep/ {
  .avatar-uploader-icon,
  .el-upload .avatar {
    width: 375px;
  }
}
.banner-goods {
  height: 200px;
  .el-upload /deep/ {
    height: 200px;
    .avatar-uploader-icon {
      height: 200px;
      line-height: 200px;
    }
  }
}
.banner-uploader {
  position: relative;
  width: 200px;
  height: 200px;
  border: #d9d9d9 1px dotted;
  border-radius: 5px;
  &:hover {
    border: #409eff 1px dotted;
  }
  img {
    width: 100%;
  }
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }
}
.banner-goods {
  float: left;
  width: 200px;
  height: 200px;
  margin: 10px 10px 10px 0;
}

.goods-imgs {
  position: relative;
  float: left;
  width: 200px;
  height: 200px;
  margin: 10px 10px 10px 0;
  .delimg {
    position: absolute;
    right: -8px;
    top: -6px;
  }
  .goods-img {
    width: 100%;
    height: 100%;
    transition: opacity 0.4s;
    border-radius: 5px;
    border: 1px #d9d9d9 dashed;
    ::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
    }
  }
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 26px;
    color: #000;
    opacity: 0;
    transition: opacity 0.4s;
  }
}
.upload_tip {
  height: 10px;
  color: #9e9e9e;
}
.el-form .from-m-0 {
  margin-bottom: 0;
}
</style>
