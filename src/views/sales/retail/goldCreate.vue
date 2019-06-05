
<template>
  <div class="createGold">
    <el-dialog :title="`${JSON.stringify(junkData) === '{}' ? '新建':'编辑'}${isGold === YNStatus.Yes ? '素金' : '非素' }`" @close="reset" :visible="visible" @update:visible="$emit('update:visible', $event)">
      <el-form ref="createForm" :model="queryForm" label-width="110px" :rules="rules">
        <el-form-item label="图片" class="image-label">
          <el-upload
            class="good-uploader"
            :action="uploadUrl"
            :data="{Root: $root.filePaths.STOCKING_SALE + '/Retail'}"
            :headers="{'access-token': $store.getters.access_token}"
            :show-file-list="false"
            accept="image/png, image/jpeg, image/jpg"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="queryForm.ImageUrl"
              :src="queryForm.ImageUrl.slice(0,4) === 'http'? queryForm.ImageUrl : $root.settings.DOMAIN_IMG_FILE + queryForm.ImageUrl.replace('{0}', '150x150')"
              class="avatar"
            >
            <el-button type="primary" name="btn-upload">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item prop="IsOurStore" label="是否本店售出" required>
          <el-radio-group v-model="queryForm.IsOurStore" name="IsOurStore">
            <el-radio :label="YNStatus.No">否</el-radio>
            <el-radio :label="YNStatus.Yes">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原条码" prop="StoreBarCode">
          <el-input v-model="queryForm.StoreBarCode" placeholder="输入库存货品的条码,敲回车可带入货品信息" ref="StoreBarCode" :maxlength="50" @keyup.enter.native="$refs.StoreBarCode.blur(), searchGoldCode" @blur="searchGoldCode" name="StoreBarCode"></el-input>
        </el-form-item>
        <el-form-item label="成色" prop="GoldType">
          <el-select v-model="queryForm.GoldType" placeholder="请选择" @change="changeName1" name="GoldType">
            <el-option label="请选择" :value="0"></el-option>
            <template v-for="(item,index) in this.$store.getters.goldType.TypeArray">
              <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="材质" prop="MaterialType">
          <el-select v-model="queryForm.MaterialType" placeholder="请选择" @change="changeName2" name="MaterialType">
            <el-option label="请选择" :value="0"></el-option>
            <template v-for="(item,index) in $store.getters.materialType.TypeArray">
              <el-option
                v-if="(item.Id < MaterialType.Diamond && item.Id !== MaterialType.HardGold3D || isGold === YNStatus.No)&&item.State === YNStatus.Yes"
                :key="index"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="品类" prop="CategoryType">
          <el-select v-model="queryForm.CategoryType" placeholder="请选择" @change="changeName3" name="CategoryType">
            <el-option label="请选择" :value="0"></el-option>
            <template v-for="(item,index) in $store.getters.categoryType.TypeArray">
              <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="旧货名称" prop="JunkName">
          <el-input v-model="queryForm.JunkName" :maxlength="50" name="JunkName"></el-input>
        </el-form-item>
        <el-form-item label="金重(g)" prop="GoldWeight">
          <el-input
            v-model="queryForm.GoldWeight"
            :maxlength="10"
            @keyup.native="queryForm.GoldWeight = $root.toFixed(queryForm.GoldWeight, 3)"
            @blur="getRecallFee"
            @keyup.enter.native="getRecallFee"
            name="GoldWeight"
          ></el-input>
        </el-form-item>
        <template v-if="isGold === YNStatus.No">
          <el-form-item label="货重(g)" prop="Weight">
            <el-input v-model="queryForm.Weight" @keyup.native="queryForm.Weight = $root.toFixed(queryForm.Weight, 3)" :maxlength="10" name="Weight"></el-input>
          </el-form-item>
          <el-form-item label="主石重(ct)" prop="StoneWeight">
            <el-input v-model="queryForm.StoneWeight" @keyup.native="queryForm.StoneWeight = $root.toFixed(queryForm.StoneWeight, 3)" :maxlength="10" name="StoneWeight"></el-input>
          </el-form-item>
          <el-form-item label="主石颜色">
            <el-select v-model="queryForm.StoneColor" placeholder="请选择" name="StoneColor">
              <el-option label="请选择" :value="0"></el-option>
              <el-option v-for="(item,index)  in StoneColor.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主石净度">
            <el-select v-model="queryForm.StoneClarity" placeholder="请选择" name="StoneClarity">
              <el-option label="请选择" :value="0"></el-option>
              <el-option v-for="(item,index)  in StoneClarity.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主石切工">
            <el-select v-model="queryForm.StoneCut" placeholder="请选择" name="StoneCut">
              <el-option label="请选择" :value="0"></el-option>
              <el-option v-for="(item,index)  in StoneCut.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="回收金价(元/g)" prop="RecallGoldPrice"  v-if="isGold === YNStatus.Yes">
          <el-input
            v-model="queryForm.RecallGoldPrice"
            :maxlength="10"
            @keyup.native="queryForm.RecallGoldPrice = $root.toFixed(queryForm.RecallGoldPrice, 2)"
            @blur="changeRecallGoldPrice"
            name="RecallGoldPrice"
          ></el-input>
        </el-form-item>
        <el-form-item label="回收金额(元)" prop="RecallPrice">
          <el-input
            v-model="queryForm.RecallPrice"
            :maxlength="10"
            @keyup.native="queryForm.RecallPrice = $root.toFixed(queryForm.RecallPrice, 2)"
            @blur="getMathPrice('RecallPrice')"
            name="RecallPrice"
          ></el-input>
        </el-form-item>
        <el-form-item label="回收工费(元)" prop="RecallFee">
          <el-input v-model="queryForm.RecallFee" :maxlength="10" @keyup.native="queryForm.RecallFee = $root.toFixed(queryForm.RecallFee, 2)" @blur="getMathPrice('RecallFee')" name="RecallFee"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="Note" class="font12">
          <el-input type="textarea" :rows="2" :maxlength="200" placeholder="请输入备注内容" v-model="queryForm.Note" name="Note"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="createJunk" :loading="$store.getters.is_loading" name="btn-save">保存</el-button>
          <el-button @click="$emit('update:visible', false)" name="btn-cancel">取消</el-button>
          <!--  -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import { SettingParameterIgnoreUnit, SettingParameterIgnoreType, SettingGpriceRecallType } from '@/enums/merchant.js'
import { MaterialType, StoneColor, StoneCut, StoneClarity } from '@/enums/stocking.js'
import { RetailOrderBackProductSourceType } from '@/enums/order.js'
// import { JunkBasicSourceType } from '@/enums/marketing.js'

import { MERCHANT_API_SETTING_GPRICE_GET } from '@/apis/merchant.js'
import { STOCKING_API_GOODS_BASIC_FIND } from '@/apis/stocking.js'
import { junkRules } from '@/rules/erp/junkCreate.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    inputType: {
      type: Object,
      default() {
        return {}
      }
    },
    isGold: {
      type: Number,
      default: 0
    },
    junkData: {
      type: Object,
      default() {
        return {}
      }
    },

  },
  data() {
    return {
      YNStatus,
      MaterialType,
      StoneColor,
      StoneCut,
      StoneClarity,
      RetailOrderBackProductSourceType,
      SettingGpriceRecallType,
      SettingParameterIgnoreType,
      SettingParameterIgnoreUnit,
      queryForm: {
        IsOurStore: YNStatus.No,
        JunkCode: '',
        JunkName: '',
        StoreBarCode: '',
        IsGold: '',
        GoodsId: '',
        ImageUrl: '',
        CategoryType: 0,
        MaterialType: 0,
        GoldType: 0,
        GoldWeight: '',
        StoneWeight: '',
        Weight: '',
        StoneColor: 0,
        StoneClarity: 0,
        StoneCut: 0,
        RecallGoldPrice: '',
        RecallPrice: '',
        RecallFee: '',
        SourceType: RetailOrderBackProductSourceType.Manual,
        Note: ''
      },
      isUpload: false,
      RecallType: '', // 旧货回收工费类型
      RecallFee: 0, // 回收工费
      defaultName: {
        one: '',
        two: '',
        three: ''
      },
      rules: junkRules,
      uploadUrl: this.$root.settings.DOMAIN_APIS.Common + '/Upload/File/Image', // 上传货品图片地址
      tofixedNumber: 2,
      fixedNumber: 1,
      upOrDown: () => { }
    }
  },
  methods: {
    getInputTypeFn() {
      // 获取四舍五入
      this.tofixedNumber =
        this.inputType.IgnoreUnit ===
          this.SettingParameterIgnoreUnit.Unit1
          ? 0
          : this.inputType.IgnoreUnit ===
            this.SettingParameterIgnoreUnit.Unit3
            ? 1
            : 2
      this.fixedNumber =
        this.inputType.IgnoreUnit ===
          this.SettingParameterIgnoreUnit.Unit1
          ? 1
          : this.inputType.IgnoreUnit ===
            this.SettingParameterIgnoreUnit.Unit3
            ? 10
            : 100
      if (
        this.inputType.IgnoreType ===
        this.SettingParameterIgnoreType.Type1
      ) {
        // 只舍不入
        this.upOrDown = function (n) {
          let num = n * this.fixedNumber
          return Math.floor(num) / this.fixedNumber
        }
      } else if (
        this.inputType.IgnoreType ===
        this.SettingParameterIgnoreType.Type3
      ) {
        // 只入不舍
        this.upOrDown = function (n) {
          let num = n * this.fixedNumber
          return Math.ceil(num) / this.fixedNumber
        }
      } else {
        // 四舍五入
        this.upOrDown = function (n) {
          let num = n * this.fixedNumber
          return Math.round(num) / this.fixedNumber
        }
      }
    },
    getMathPrice(val) {
      // 返回四舍五入参数
      if (!this.queryForm[val]) {
        this.queryForm[val] = 0
        return false
      }
      this.queryForm[val] =
        this.upOrDown(Number(this.queryForm[val])).toFixed(this.tofixedNumber) -
        0
    },
    createJunk() {
      // 点击创建按钮
      this.$refs['createForm'].validate(valid => {
        if (!valid) {
          return false
        } else if (this.queryForm.RecallFee >= this.queryForm.RecallPrice) {
          this.$message.error('回收金额必须大于回收工费')
          return
        }
        this.$store.commit('SET_BTN_LOADING', true)
        this.queryForm.GoldWeight = this.queryForm.GoldWeight || 0
        this.queryForm.RecallGoldPrice = this.queryForm.RecallGoldPrice || 0
        this.queryForm.RecallPrice = this.queryForm.RecallPrice || 0
        this.queryForm.RecallFee = this.queryForm.RecallFee || 0

        this.$emit('closeDialog', { ...this.queryForm })
        this.$emit('update:visible', false)
        // 数据传输
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    handleAvatarSuccess(res) {
      if (res.Code === 'CORRECT') {
        this.isUpload = true
        this.queryForm.ImageUrl = res.Data.Key
      } else {
        this.$message.error(res.Message)
      }
    },
    // 上传图片校验
    beforeAvatarUpload(file) {
      let imgTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (imgTypes.indexOf(file.type) === -1) {
        this.$message.error('请选择png,jpg格式图片上传!')
        return false
      } else {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
          return false
        }
      }
      return true
    },
    searchGoldCode() {
      // 搜索旧货源码
      if (this.queryForm.IsOurStore === YNStatus.No || this.queryForm.StoreBarCode.length === 0
      ) {
        return false
      }
      STOCKING_API_GOODS_BASIC_FIND({
        BarCode: this.queryForm.StoreBarCode,
        // PageIndex: 1,
        // Pagesize: 20,
        // State: JunkTraceState.Storaged,
        // IsGold: this.isGold
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data
          if (this.queryForm.IsOurStore === YNStatus.Yes) {
            this.queryForm.GoodsId = data.GoodsId
          }
          // this.queryForm.JunkCode = data.JunkCode
          this.queryForm.JunkName = data.GoodsName
          // this.queryForm.ImageUrl = data.ImageUrl
          // this.queryForm.MaterialType = data.MaterialType || 0
          this.queryForm.CategoryType = this.$store.getters.categoryType.TypeArray.some(item => item.State === YNStatus.Yes && item.Id === data.CategoryType) ?  data.CategoryType : 0
          this.queryForm.GoldType = this.$store.getters.goldType.TypeArray.some(item => item.State === YNStatus.Yes && item.Id === data.GoldType) ? data.GoldType : 0
          this.queryForm.GoldWeight = this.$root.toFloat(data.GoldWeight, 3)
          this.queryForm.StoneWeight = this.$root.toFloat(data.Stone1Weight, 3)
          this.queryForm.Weight = this.$root.toFloat(data.Weight, 3)
          this.queryForm.RecallGoldPrice = this.$root.toFloat(data.RecallGoldPrice)
          this.queryForm.RecallPrice = this.$root.toFloat(data.RecallPrice)
          this.queryForm.RecallFee = this.$root.toFloat(data.RecallFee)
          this.queryForm.StoneColor = data.Stone1Color || 0
          this.queryForm.StoneClarity = data.Stone1Clarity || 0
          this.queryForm.StoneCut = data.Stone1Cut || 0
          if ((this.queryForm.IsGold  === YNStatus.No || data.MaterialType < MaterialType.Diamond && data.MaterialType !== MaterialType.HardGold3D)&&this.$store.getters.materialType.TypeArray.some(item => item.State === YNStatus.Yes && item.Id === data.MaterialType)) {
            this.queryForm.MaterialType = data.MaterialType
          } else {
            this.queryForm.MaterialType = 0
          }
          this.getRecallFee()
        }
      })
    },
    changeName1(value) {
      this.defaultName.one = this.$store.getters.goldType.Types[value]
      this.queryForm.JunkName = this.defaultName.one + this.defaultName.two + this.defaultName.three
      if (this.isGold === YNStatus.No) {
        return
      }
      this.getGoldPrice()
    },
    changeName2(value) {

      if (this.queryForm.IsOurStore === YNStatus.No) {
        this.defaultName.two = this.$store.getters.materialType.Types[value]
        this.queryForm.JunkName = this.defaultName.one + this.defaultName.two + this.defaultName.three
      }
    },
    changeName3(value) {
      if (this.queryForm.IsOurStore === YNStatus.No) {
        this.defaultName.three = this.$store.getters.categoryType.Types[value]
        this.queryForm.JunkName = this.defaultName.one + this.defaultName.two + this.defaultName.three
      }
    },
    reset() {

      this.$refs.createForm.resetFields()
      this.queryForm.ImageUrl = ''
      this.queryForm.StoneColor = 0
      this.queryForm.StoneClarity = 0
      this.queryForm.StoneCut = 0
      this.defaultName = {
        one: '',
        two: '',
        three: ''
      }
    },
    getGoldPrice() {
      if (this.queryForm.GoldType === 0) {
        this.RecallFee = 0
        this.queryForm.RecallFee = 0
        this.queryForm.RecallPrice = 0
        this.queryForm.RecallGoldPrice = 0
        return false
      }
      MERCHANT_API_SETTING_GPRICE_GET({
        GoldType: this.queryForm.GoldType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.RecallType = res.data.Data.RecallType
          this.queryForm.RecallGoldPrice = this.$root.toFloat(res.data.Data.Jprice)
          this.queryForm.RecallFee = this.$root.toFloat(res.data.Data.RecallFee)
          this.RecallFee = this.$root.toFloat(res.data.Data.RecallFee)
          this.getRecallFee()
        }
      })
    },
    getRecallFee() {
      // 生成回收工费
      if (!this.queryForm.GoldWeight) {
        this.queryForm.GoldWeight = 0
      }
      !this.queryForm.RecallGoldPrice
        ? (this.queryForm.RecallGoldPrice = 0)
        : ''
      this.queryForm.RecallPrice =
        this.upOrDown(
          Math.round(
            (Math.round(
              parseFloat(this.queryForm.GoldWeight) *
              parseFloat(this.queryForm.RecallGoldPrice) *
              1000
            ) /
              1000) *
            100
          ) / 100
        ).toFixed(this.tofixedNumber) - 0
      if (!this.RecallFee) {
        return false
      }
      if (this.RecallType === SettingGpriceRecallType.GramOf) {
        this.queryForm.RecallFee =
          this.upOrDown(this.queryForm.GoldWeight * this.RecallFee).toFixed(
            this.tofixedNumber
          ) - 0
      } else {
        this.queryForm.RecallFee = this.RecallFee
      }
    },
    changeRecallGoldPrice() {
      if (!Number(this.queryForm.RecallGoldPrice)) {
        this.queryForm.RecallPrice = 0
        return false
      }
      if (this.queryForm.GoldWeight && this.queryForm.RecallGoldPrice) {
        this.queryForm.RecallPrice =
          this.upOrDown(
            Math.round(
              (Math.round(
                parseFloat(this.queryForm.GoldWeight) *
                parseFloat(this.queryForm.RecallGoldPrice) *
                1000
              ) /
                1000) *
              100
            ) / 100
          ).toFixed(this.tofixedNumber) - 0
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getInputTypeFn()
        this.queryForm.IsGold  = this.isGold
      }
    },
    // isGold(val) {
    //   this.queryForm.IsGold  = val
    // },
    junkData(val) {
      if (JSON.stringify(val) !== '{}') {
        this.queryForm = { ...val }
        this.defaultName.one = this.$store.getters.goldType.Types[val.GoldType]
        this.defaultName.two = this.$store.getters.materialType.Types[val.MaterialType]
        this.defaultName.three = this.$store.getters.categoryType.Types[val.CategoryType]
      }
    },
    // 'queryForm.GoldType': 'getGoldPrice',
    // 'queryForm.GoldWeight': 'getRecallFee',
    // 'queryForm.RecallGoldPrice'() {

    // }
  }
}
</script>
<style lang="scss" scoped="true">
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
.createGold {
  min-width: 900px;
  .inputAndImg {
    .fl {
      width: 50%;
    }
    .el-input {
      width: 280px;
    }
  }

  .el-form-item__content .btn-primary span {
    color: #fff;
  }
  .createGold_input {
    width: 300px;
  }
  .image_head img {
    width: 50px;
    height: 50px;
    float: left;
    border: 1px solid #ededed;
    border-radius: 50%;
    margin-right: 10px;
  }
  .image_head p {
    height: 50px;
    float: left;
    line-height: 25px;
    margin: 0;
  }
  .image_head span {
    display: block;
    font-size: 14px;
  }
  .image-label .el-form-item__label {
    line-height: 120px !important;
    height: 150px !important;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .el-upload:hover {
      border-color: #20a0ff;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .el-form-item__label {
    min-width: 160px;
  }
}
</style>