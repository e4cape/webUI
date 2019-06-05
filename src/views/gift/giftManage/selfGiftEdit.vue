<template>
  <div>
    <div class="title">
      <h3>基本信息</h3>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="fix-w">
      <el-form-item label="礼品分类：" prop="categoryId">
        <el-cascader name="categoryId" :options="categoryList" v-model="form.categoryId" :props="{value:'categoryId',label:'categoryName',children:'items'}" :disabled="!isEdit">
        </el-cascader>
        <span name="btnIsEdit" @click="isEdit = true" v-if="!isEdit" class="el-button el-button--text el-button--mini">编辑</span>
      </el-form-item>
      <el-form-item label="礼品名称：" prop="giftName">
        <el-input name="giftName" v-model="form.giftName" maxlength="20"></el-input>
        <span class="em">20字以内</span>
      </el-form-item>
      <el-form-item label="营销标题：">
        <el-input name="mktTitle" v-model="form.mktTitle" maxlength="50"></el-input>
        <span class="em">50字以内</span>
      </el-form-item>
      <el-form-item :label="isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'">
        <el-input name="wholesalePrice" v-model="form.wholesalePrice" :maxlength="8" @keyup.native="form.wholesalePrice = $root.toFixed(form.wholesalePrice, 2)"></el-input>
        <span class="em">0-999999的数字</span>
      </el-form-item>
      <el-form-item label="零售价：">
        <el-input name="retailPrice" v-model="form.retailPrice" :maxlength="8" @keyup.native="form.retailPrice = $root.toFixed(form.retailPrice, 2)"></el-input>
        <span class="em">0-999999的数字</span>
      </el-form-item>
      <el-form-item label="兑换方式：" prop="required">
        <el-checkbox-group name="type" v-model="form.type" :min="1" :max="2" style="display:inline-block">
          <el-checkbox label="1">
            <span class="m-r-10">积分</span>
            <el-form-item prop="score" style="display:inline-block;margin:0" :show-message="form.type.some(v => v === '1')">
              <el-input name="score" v-model="form.score" :maxlength="6" :disabled="!form.type.some(v => v === '1')" @keyup.native="form.score = $root.toFixed(form.score, 0)" style="width: 100px!important;"></el-input>
            </el-form-item>
          </el-checkbox>
          <el-checkbox label="2">
            <span class="m-r-10">礼金</span>
            <el-form-item prop="goldenRice" style="display:inline-block;margin:0" :show-message="form.type.some(v => v === '2')">
              <el-input  name="goldenRice" v-model="form.goldenRice" :maxlength="6" :disabled="!form.type.some(v => v === '2')" @keyup.native="form.goldenRice = $root.toFixed(form.goldenRice, 0)" style="width: 100px!important;"></el-input>
            </el-form-item>
          </el-checkbox>
        </el-checkbox-group>
        <span class="em">1-999999的整数，如果选择两种，用户可以使用任意一种方式兑换</span>
      </el-form-item>
      <el-form-item label="货号/条码：" prop="barCode">
        <el-input name="barCode"  v-model="form.barCode" maxlength="20"></el-input>
        <span class="em">20个字符以内，限英文字符和数字</span>
      </el-form-item>
      <el-form-item label="品牌：">
        <el-select name="brandId" filterable v-model="form.brandId" placeholder="请选择品牌">
          <el-option label="请选择" :value="''"></el-option>
          <el-option v-for="(v,i) in brandList" :key="i" :label="v.cnName" :value="v.brandId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片：" prop="imgUrl" :show-message="form.arrayImageUrls.length < 1">
        <div class="clearfix">
          <div class="goods-imgs" v-for="(item, index) in form.arrayImageUrls" :key="index">
            <img class="goods-img" :src="$root.settings.DOMAIN_IMAGE + item" alt="">
            <div class="main-tip" v-if="item === form.imageUrl">主图</div>
            <div class="hover-here">
              <i name="btnSetMain" class="icon-set" title="设置为主图" @click="setMain(index)" v-if="item !== form.imageUrl"></i>
              <i name="btnCheckImg" class="el-icon-view" title="查看图片" @click="checkImg(index)"></i>
              <i name="btnRemoveImg" class="el-icon-delete" title="删除此图" @click="removeImg(index)"></i>
            </div>
          </div>
          <div v-if="form.arrayImageUrls.length < 5" class="img-uploader" name="btnImgClick" @click="iClick">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <input btn="btnFile" type="file" id="imgUploaderInput" style="display: none;" accept="image/jpg,image/jpeg,image/png" @change="uploadChange">
          </div>
        </div>
        <div class="em">最多5张，单张不超过2M，可上传JPG/JPEG/PNG格式的图片</div>
      </el-form-item>
    </el-form>
    <div class="title">
      <h3>商品规格</h3>
      <span class="em">如果有多种规格和样式请录入以下规格信息，只有一种规格无须录入</span>
    </div>
    <div class="dynamic">
      <div>
        <el-input name="specificationName" v-model="specificationName" style="width:100px" maxlength="10" placeholder="规格"></el-input>
        <span>:</span>
      </div>
      <div>
        <div v-for="(item,index) in specificationList" :key="index">
          <el-input  name="specificationVal" v-model="item.val" style="width:120px" maxlength="15"></el-input>
          <el-button name="btnDeleteSpecificationVal" type="danger" icon="el-icon-delete" circle @click="deleteDynamicItem(index,1)" v-if="specificationList.length > 1"></el-button>
        </div>
        <el-button name="btnAddSpecificationVal"  type="primary" icon="el-icon-plus" circle @click="addDynamicItem(1)"></el-button>
      </div>
    </div>
    <div class="dynamic">
      <div>
        <el-input name="styleName" v-model="styleName" style="width:100px" maxlength="10" placeholder="样式"></el-input>
        <span>:</span>
      </div>
      <div>
        <div v-for="(item,index) in styleList" :key="index">
          <el-input name="styleVal" v-model="item.val" style="width:120px" maxlength="15"></el-input>
          <el-button name="btnRemoveStyleVal" type="danger" icon="el-icon-delete" circle @click="deleteDynamicItem(index,2)" v-if="styleList.length > 1"></el-button>
        </div>
        <el-button name="btnAddStyle" type="primary" icon="el-icon-plus" circle @click="addDynamicItem(2)"></el-button>
      </div>
    </div>
    <div class="title">
      <h3>规格参数</h3>
      <span class="em">可录入上市时间、适用人群、工艺、商品尺寸、材质等具体参数</span>
    </div>
    <el-form ref="parameterForm" :model="parameterObj">
      <el-table :data="parameterObj.list" empty-text="无规格参数" style="width: 100%">
        <el-table-column prop="name" label="参数名称" width="180">
          <template slot-scope="scope">
            <el-input name="name" v-model="scope.row.name" style="width:160px" maxlength="20"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="val" label="参数值/描述">
          <template slot-scope="scope">
            <el-form-item :prop="'list.'+ scope.$index +'.val'" :rules="rules.parameterVal" :inline-message="true" style="margin:0">
              <el-input name="parameterVal" v-model="scope.row.val" style="width:600px" maxlength="100" placeholder="50个汉字或100个英文字符以内"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="contral" label="操作" width="80">
          <template slot-scope="scope">
            <span name="btnDeleteParameter" class="el-button el-button--text el-button--mini" @click="deleteParameterList(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span name="btnAddParameter" class="el-button el-button--text el-button--mini p-10" @click="addParameterList">添加参数</span>
    <div class="title">
      <h3>商品详情</h3>
    </div>
    <div>
      <editor @listenEditerChange="listenEditerChange" :Note="html"></editor>
    </div>
    <div class="p-10">
      <el-button name="btnSubmit" :loading="$store.getters.is_loading" type="primary" @click="submit(1)">提交审核</el-button>
      <el-button name="btnSave" :loading="$store.getters.is_loading" @click="submit(0)">保存</el-button>
      <el-button name="btnCancel" @click="$router.back(-1)">取消</el-button>
    </div>
    <img-cropper v-if="cropperVisible" :cropperVisible="cropperVisible" :imgSize="imgSize" :url="cropperUrl" @listenCropper="listenCropper"></img-cropper>
    <img-check v-if="checkImgVisible" :checkImgVisible="checkImgVisible" :url="$root.settings.DOMAIN_IMAGE + checkImgUrl" @listenUrlCheck="checkImgVisible = false"></img-check>
  </div>
</template>

<script>
import editor from '@/components/spread/editor'
import imgCropper from '@/components/spread/imgCropper'
import imgCheck from '@/views/spread/goods/imgCheck'
import axios from 'axios'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_BRAND_GETBINDLIST,
  GIFTING_API_GIFT_SAVEUPDATEBYSTORE,
  GIFTING_API_GIFT_GETGIFTWITHATTRS
} from '@/apis/gifting'
import {
  ImageUploadPaths 
} from '@/enums/gifting'
export default {
  data() {
    var checkCategoryId = (r, v, callback) => {
      if (v instanceof Array && v[0] !== 0) {
        callback()
      } else {
        callback(new Error('请选择礼品分类'))
      }
    }
    var checkNumEnglish = (r, v, callback) => {
      if (v === '') {
        callback()
      } else {
        if (/^\w+$/.test(v)) {
          callback()
        } else {
          callback(new Error('只能输入数字、英文字母、下划线'))
        }
      }
    }
    var checkScore = (r, v, callback) => {
      if (!v && this.form.type.some(t => t === '1')) {
        callback(new Error('请输入积分'))
        return
      } else if (v && (v < 1 || v > 999999)) {
        callback(new Error('请输入1-999999的整数'))
        return
      }
      callback()
    }
    var checkGoldenRice = (r, v, callback) => {
      if (!v && this.form.type.some(t => t === '2')) {
        callback(new Error('请输入礼金'))
      } else if (v && (v < 1 || v > 999999)) {
        callback(new Error('请输入1-999999的整数'))
        return
      }
      callback()
    }
    var unValidator = (r, v, callback) => {
      callback()
    }
    var checkParameterVal = (r, v, callback) => {
      if ((v + '').replace(/[\u4E00-\u6FA5]/g, '**').length > 100) {
        callback(new Error('50个汉字或100个英文字符以内'))
      } else {
        callback()
      }
    }
    var checkUrl = (r, v, callback) => {
      if (this.form.arrayImageUrls.length > 0) {
        callback()
      } else {
        callback(new Error('至少上传一张图片'))
      }
    }
    return {
      imageUploadPaths: ImageUploadPaths,
      form: {
        type: ['1'],
        categoryId: [],
        categoryId1: '',
        categoryId2: '',
        brandId: '',
        giftName: '',
        mktTitle: '',
        scoreType: '',
        score: '',
        wholesalePrice: '',
        goldenRice: '',
        arrayImageUrls: [],
        imageUrl: '',
        barCode: '',
        description: '',
        giftSubmitType: '',
        giftAttrs: '',
        giftParams: '',
        retailPrice: '',
      },
      categoryList: [],
      brandList: [],
      isEdit: false,
      parameterObj: {
        list: [
          {
            name: '',
            val: ''
          }
        ]
      },
      specificationName: '',
      specificationList: [
        {
          val: ''
        }
      ],
      styleName: '',
      styleList: [
        {
          val: ''
        }
      ],
      html: '',
      editorText: '',
      rules: {
        categoryId: [
          {
            required: true, validator: checkCategoryId, trigger: 'change' 
          }
        ],
        giftName: [
          {
            required: true, message: '请输入礼品名称', trigger: 'change' 
          }
        ],
        score: [
          {
            validator: checkScore, trigger: 'change' 
          }
        ],
        goldenRice: [
          {
            validator: checkGoldenRice, trigger: 'change' 
          }
        ],
        barCode: [
          {
            required: false, validator: checkNumEnglish, trigger: 'change' 
          }
        ],
        required: [
          {
            required: true, validator: unValidator, trigger: 'change' 
          }
        ],
        parameterVal: [
          {
            validator: checkParameterVal, trigger: 'change' 
          }
        ],
        imgUrl: [
          {
            required: true, validator: checkUrl, trigger: 'change' 
          }
        ],
        wholesalePrice: [
          {
            validator: (r, v, callback) => {
              if (!v && v > 999999) {
                callback(new Error('请输入0-999999的数字'))
                return
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        retailPrice: [
          {
            validator: (r, v, callback) => {
              if (!v && v > 999999) {
                callback(new Error('请输入0-999999的数字'))
                return
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      checkImgUrl: '',
      checkImgVisible: false,
      cropperVisible: false,
      imgSize: {
      },
      cropperUrl: '',
    }
  },
  methods: {
    init() {
      !this.$route.query.storeGiftId && this.$router.back(-1)
      GIFTING_API_GIFT_GETGIFTWITHATTRS(this.$route.query.storeGiftId).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            const data = res.data.Data
            this.form = Object.assign(this.form, data)
            this.html = this.form.description
            let arrTmp = []
            if (data.categoryId1 !== '') {
              arrTmp.push(data.categoryId1)
              arrTmp.push(data.categoryId2)
            }
            this.form.categoryId = arrTmp
            let arrTmpType = []
            if (!data.scoreType) {
              arrTmpType = ['1']
            } else {
              if (data.scoreType === 3) {
                arrTmpType = ['1', '2']
              } else {
                arrTmpType.push(data.scoreType + '')
              }
            }
            this.form.type = arrTmpType
            this.form.arrayImageUrls = data.arrayImageUrls || []
            this.parameterObj.list = data.giftParams
            if (data.giftAttrs) {
              if (data.giftAttrs.length === 2) {
                this.specificationList = data.giftAttrs[0].giftAttrItems.map(
                  v => Object.assign({
                  }, {
                    val: v.val 
                  })
                )
                this.specificationName = data.giftAttrs[0].name
                this.styleList = data.giftAttrs[1].giftAttrItems.map(v =>
                  Object.assign({
                  }, {
                    val: v.val 
                  })
                )
                this.styleName = data.giftAttrs[1].name
              } else if (data.giftAttrs.length === 1) {
                this.specificationList = data.giftAttrs[0].giftAttrItems.map(
                  v => Object.assign({
                  }, {
                    val: v.val 
                  })
                )
                this.specificationName = data.giftAttrs[0].name
              }
            }
          }
        }
      )
    },
    async getCategory() {
      let dataAll = await Promise.all([
        GIFTING_API_CATEGORY_SEARCH(),
        GIFTING_API_BRAND_GETBINDLIST({
        })
      ])
      this.categoryList = dataAll[0].data.Data.map(item =>
        Object.assign(item, {
          disabled: Boolean(!item.items) 
        })
      )
      this.brandList = dataAll[1].data.Data
    },
    deleteParameterList(v) {
      this.parameterObj.list.splice(v, 1)
    },
    addParameterList() {
      this.parameterObj.list.push({
        name: '',
        value: ''
      })
    },
    addDynamicItem(v) {
      if (v === 1) {
        this.specificationList.push({
          val: '' 
        })
        return
      }
      if (v === 2) {
        this.styleList.push({
          val: '' 
        })
      }
    },
    deleteDynamicItem(index, v) {
      if (v === 1) {
        this.specificationList.splice(index, 1)
        return
      }
      if (v === 2) {
        this.styleList.splice(index, 1)
      }
    },
    listenEditerChange(obj) {
      this.form.description = obj.html
      this.editorText = obj.text
    },
    setMain(index) {
      let temp = this.form.arrayImageUrls[index]
      this.form.imageUrl = this.form.arrayImageUrls[index]
      this.form.arrayImageUrls.splice(index, 1)
      this.form.arrayImageUrls.unshift(temp)
    },
    iClick() {
      document.getElementById('imgUploaderInput').click()
    },
    checkImg(index) {
      this.checkImgUrl = this.form.arrayImageUrls[index]
      this.checkImgVisible = true
    },
    removeImg(index) {
      this.$confirm('是否删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const currentImgUrl = this.form.arrayImageUrls[index]
        this.form.arrayImageUrls.splice(index, 1)
        if (currentImgUrl === this.form.imageUrl) {
          this.form.imageUrl =
            this.form.arrayImageUrls.length === 0
              ? ''
              : (this.form.imageUrl = this.form.arrayImageUrls[0])
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    uploadChange(e) {
      var vm = this
      var reader = new FileReader()
      reader.onload = (function() {
        return function(e) {
          const isLt2M = e.total / 1024 / 1024 < 2
          if (!isLt2M) {
            vm.$message.error('上传图片大小不能超过 2MB!')
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
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
      document.getElementById('imgUploaderInput').value = ''
    },
    listenCropper(url) {
      this.cropperVisible = false
      if (!url) {
        return
      }
      var arr = (url + '').split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n] = bstr.charCodeAt(n)
        n -= 1
      }
      var ext = mime.replace('image/', '.')
      const d = new Date()
      var fileName =
        'giftImgSelf' +
        d.getFullYear() +
        '_' +
        (d.getMonth() + 1) +
        '_' +
        d.getDate() +
        '_' +
        d.getHours() +
        '_' +
        d.getMinutes() +
        '_' +
        d.getSeconds() +
        '_' +
        Math.random()
          .toString(12)
          .substring(2) +
        ext
      let file = new File([u8arr], fileName, {
        type: mime 
      })
      let fd = new FormData()
      fd.append('file', file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios
        .post(
          `${
            this.$root.settings.DOMAIN_APIS.Gifting
          }/api/Uploader/UploadImageAsync/?pathType=${
            this.imageUploadPaths.Gift
          }`,
          fd,
          config
        )
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('上传成功')
            setTimeout(() => {
              this.form.arrayImageUrls.push(res.data.Data[0])
              this.form.imageUrl = this.form.imageUrl || res.data.Data[0]
            }, 1000)
          } else {
            this.$message.error(res.data.Message)
          }
        })
    },
    submit(giftSubmitType) {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.$message.error('请按正确的格式填写')
          return
        }
        if (
          this.specificationList.some(v => v.val !== '') &&
          !this.specificationName
        ) {
          this.$message.error('商品规格有值，需填写规格名称')
          return
        }
        if (this.styleList.some(v => v.val !== '') && !this.styleName) {
          this.$message.error('商品样式有值，需填写样式名称')
          return
        }
        if (this.parameterObj.list.some(v => v.val !== '' && v.name === '')) {
          this.$message.error('规格参数值/描述有值，需填写参数名称')
          return
        }
        let params = Object.assign({
        }, this.form)
        if (params.categoryId.length === 2) {
          params.categoryId1 = params.categoryId[0]
          params.categoryId2 = params.categoryId[1]
        } else if (params.categoryId.length === 1) {
          params.categoryId1 = params.categoryId[0]
          params.categoryId2 = ''
        } else {
          params.categoryId1 = ''
          params.categoryId2 = ''
        }
        params.score = this.form.score || ''
        params.goldenRice = this.form.goldenRice || ''
        if (params.type.length === 2) {
          params.scoreType = '3'
        } else if (params.type.length === 1) {
          params.scoreType = params.type[0]
          params.scoreType === '1'
            ? (params.goldenRice = '')
            : (params.score = '')
        } else {
          params.scoreType = ''
          params.score = ''
          params.goldenRice = ''
        }
        params.giftSubmitType = giftSubmitType
        params.giftAttrs = [
          {
            name: '', giftAttrItems: [], theplaceholder: '规格' 
          },
          {
            name: '', giftAttrItems: [], theplaceholder: '样式' 
          }
        ]
        if (this.specificationList.some(v => v.val !== '')) {
          params.giftAttrs[0].name = this.specificationName
          params.giftAttrs[0].giftAttrItems = this.specificationList.filter(
            v => v.val !== ''
          )
        }
        if (this.styleList.some(v => v.val !== '')) {
          params.giftAttrs[1].name = this.styleName
          params.giftAttrs[1].giftAttrItems = this.styleList.filter(
            v => v.val !== ''
          )
        }
        let tmpArray = this.parameterObj.list.filter(v => v.val !== '')
        params.giftParams = !tmpArray.length
          ? [
            {
              name: '', val: '' 
            }
          ]
          : tmpArray
        this.$store.commit('SET_BTN_LOADING', true)
        GIFTING_API_GIFT_SAVEUPDATEBYSTORE(params).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已成功修改礼品')
            this.$router.back(-1)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      })
    }
  },
  mounted() {
    this.getCategory()
    this.init()
  },
  components: {
    editor,
    imgCropper,
    imgCheck
  }
}
</script>

<style lang="scss" scoped>
.title {
  border-bottom: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  > h3 {
    display: inline-block;
    font-size: 20px;
  }
}
.em {
  color: #aaa;
  padding-left: 5px;
}
.dynamic {
  position: relative;
  left: 0;
  top: 0;
  > div:first-child {
    position: absolute;
    top: 0;
    left: 10px;
    > span {
      margin-left: 5px;
    }
  }
  > div:last-child {
    > div {
      display: inline-block;
      margin-left: 10px;
      margin-bottom: 10px;
    }
    padding-left: 120px;
  }
}
.goods-imgs {
  position: relative;
  float: left;
  width: 200px;
  height: 200px;
  margin: 10px;
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
  > .main-tip {
    color: #fff;
    padding: 0 8px;
    font-size: 12px;
    line-height: 18px;
    background: #399fe5;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 5px 0 0 0;
    z-index: 10;
  }
  > .hover-here {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    > i {
      color: #f5f5f5;
      padding: 4px;
      cursor: pointer;
      font-size: 18px;
      margin: 2px;
    }
  }
  &:hover .hover-here {
    display: block;
  }
}
.img-uploader {
  position: relative;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  width: 200px;
  height: 200px;
  border: #d9d9d9 1px dotted;
  border-radius: 5px;
  &:hover {
    border: #409eff 1px dotted;
  }
  > i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }
}
</style>
