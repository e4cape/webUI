<template>
  <div>
    <div class="title"><h3>基本信息</h3></div>
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="礼品分类：" prop="categoryId">
        <el-cascader
          name="categoryId"
          :options="categoryList"
          v-model="form.categoryId"
          :props="{value:'categoryId',label:'categoryName',children:'items'}"
          :disabled="isEdit"
          >
        </el-cascader>
        <!-- <span @click="isEdit = true" v-if="!isEdit" class="el-button el-button--text el-button--mini">编辑</span> -->
      </el-form-item>
      <el-form-item label="礼品名称：" prop="required">
        <el-input  name="giftName" v-model="form.giftName" style="width:410px" maxlength="20" disabled></el-input>
        <span class="em">20字以内</span>
      </el-form-item>
      <el-form-item label="营销标题：">
        <el-input name="mktTitle" v-model="form.mktTitle" style="width:410px" maxlength="50"></el-input>
        <span class="em">50字以内</span>
      </el-form-item>
      <el-form-item :label="isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'">
        <el-input-number name="wholesalePrice" v-model="form.wholesalePrice" controls-position="right" :min="1" :max="999999999" disabled></el-input-number>
        <span class="em">0-999999的数字</span>
      </el-form-item>
      <el-form-item label="零售价：">
        <el-input-number  name="retailPrice" v-model="form.retailPrice" controls-position="right" :min="1" :max="999999999" disabled></el-input-number>
        <span class="em">0-999999的数字</span>
      </el-form-item>
      <el-form-item label="兑换方式：" prop="required">
        <el-checkbox-group 
          name="type"
          v-model="form.type"
          :min="1"
          :max="2"
          style="display:inline-block">
          <el-checkbox :label="'1'">
            <span class="m-r-10">积分</span>
            <el-form-item prop="score" style="display:inline-block;margin:0" :show-message="form.type.some(v => v === '1')">
              <el-input name="score" v-model="form.score" @keyup.native="form.score = $root.toFixed(form.score, 0)" :maxlength="9" :disabled="!form.type.some(v => v === '1')"></el-input>
            </el-form-item>
          </el-checkbox>
          <el-checkbox :label="'2'">
            <span class="m-r-10">礼金</span>
            <el-form-item prop="goldenRice" style="display:inline-block;margin:0" :show-message="form.type.some(v => v === '2')">
              <el-input name="goldenRice" v-model="form.goldenRice" @keyup.native="form.goldenRice = $root.toFixed(form.goldenRice, 0)" :maxlength="9" :disabled="!form.type.some(v => v === '2')"></el-input>
            </el-form-item>
          </el-checkbox>
        </el-checkbox-group>
        <span class="em">1-999999999的整数，如果选择两种，用户可以使用任意一种方式兑换</span>
      </el-form-item>
      <el-form-item label="货号/条码：">
        <el-input name="barCode" v-model="form.barCode" style="width:410px" maxlength="20" disabled></el-input>
        <span class="em">20个字符以内，限英文字符和数字</span>
      </el-form-item>
      <el-form-item label="品牌：" >
        <el-select name="brandId" filterable v-model="form.brandId" disabled placeholder="请选择品牌">
          <el-option
            v-for="(v,i) in brandList"
            :key="i"
            :label="v.cnName"
            :value="v.brandId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片：" prop="required" :show-message="form.arrayImageUrls.length < 1">
        <div class="clearfix">
          <div class="img-list-item fl" v-for="(item, index) in form.arrayImageUrls" :key="index">
            <img :src="$root.settings.DOMAIN_IMAGE + item" alt="">
            <div class="main-tip" v-if="item === form.imageUrl">主图</div>
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
        <el-input name="specificationName" v-model="specificationName" style="width:100px" maxlength="10" placeholder="规格" disabled></el-input>
        <span>:</span>
      </div>
      <div>
        <div v-for="(item,index) in specificationList" :key="index">
          <el-input name="specificationVal" v-model="item.val" style="width:120px" maxlength="15" disabled></el-input>
          <el-button name="btnSpecificationDisabled" type="danger" icon="el-icon-delete" circle disabled v-if="specificationList.length > 1"></el-button>
        </div>
        <el-button name="btnDisabled" type="primary" icon="el-icon-plus" circle disabled></el-button>
      </div>
    </div>
    <div class="dynamic">
      <div>
        <el-input name="styleName" v-model="styleName" style="width:100px" maxlength="10" placeholder="样式" disabled></el-input>
        <span>:</span>
      </div>
      <div>
        <div v-for="(item,index) in styleList" :key="index">
          <el-input name="styleVal" v-model="item.val" style="width:120px" maxlength="15" disabled></el-input>
          <el-button name="btnStyleDisabled" type="danger" icon="el-icon-delete" circle disabled v-if="styleList.length > 1"></el-button>
        </div>
        <el-button name="btnAddDisabled" type="primary" icon="el-icon-plus" circle @click="addDynamicItem(2)" disabled></el-button>
      </div>
    </div>
    <div class="title">
      <h3>规格参数</h3>
      <span class="em">可录入上市时间、适用人群、工艺、商品尺寸、材质等具体参数</span>
    </div>
    <el-form ref="parameterForm" :model="parameterObj">
      <el-table
        :data="parameterObj.list"
        empty-text="无规格参数"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="参数名称"
          width="180">
          <template slot-scope="scope">
            <el-input name="name" v-model="scope.row.name" style="width:160px" maxlength="20" disabled></el-input>            
          </template>
        </el-table-column>
        <el-table-column
          prop="val"
          label="参数值/描述"
          >
          <template slot-scope="scope">
            <el-form-item :prop="'list.'+ scope.$index +'.val'" :rules="rules.parameterVal" :inline-message="true" style="margin:0">
              <el-input name="parameterVal" v-model="scope.row.val" style="width:600px" maxlength="102" placeholder="50个汉字或100个英文字符以内" disabled></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="contral"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <span class="el-button el-button--text el-button--mini">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span class="el-button el-button--text el-button--mini p-10">添加参数</span>
    <div class="title">
      <h3>商品详情</h3>
    </div>
    <div>
      <editor @listenEditerChange="listenEditerChange" :Note="html" ref="editor"></editor>
    </div>
    <div class="p-10">
      <el-button name="btnSubmitAndUp" :loading="$store.getters.is_loading" type="primary" @click="submit(1)">保存并上架</el-button>
      <el-button name="btnSubmit" :loading="$store.getters.is_loading" @click="submit(0)">保存</el-button>
      <el-button name="btnCancel" @click="$router.back(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import editor from '@/components/spread/editor'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_BRAND_GETBINDLIST,
  GIFTING_API_GIFT_SAVEUPDATEBYAGENT,
  GIFTING_API_GIFT_GETGIFTWITHATTRS,
} from '@/apis/gifting'
import {
  ImageUploadPaths
} from '@/enums/gifting'
export default {
  data() {
    return {
      imageUploadPaths:ImageUploadPaths,
      form:{
        type:['1'],
        categoryId:[],
        categoryId1:'',
        categoryId2:'',
        brandId:'',
        giftName:'',
        mktTitle:'',
        score: '',
        goldenRice: '',
        scoreType:'',
        arrayImageUrls:[],
        imageUrl:'',
        barCode:'',
        description:'',
        giftSubmitType :'',
        giftAttrs:'',
        giftParams:'',
      },
      categoryList: [],
      brandList: [],
      isEdit:true,
      parameterObj:{
        list:[
          {
            name:'',
            val:''
          }
        ]
      },
      specificationName:'',
      specificationList:[
        {
          val:''
        }
      ],
      styleName: '',
      styleList:[
        {
          val:''
        }
      ],
      html:'',
      editorText:'',
      rules: {
        categoryId: [
          {
            required: true, validator: this.checkCategoryId, trigger: 'blur' 
          }
        ],
        score: [
          {
            validator: this.checkScore, trigger: 'blur' 
          }
        ],
        goldenRice: [
          {
            validator: this.checkGoldenRice, trigger: 'blur' 
          }
        ],
        required:[
          {
            required: true,validator: this.unValidator,trigger: 'blur' 
          }
        ],
      }
    }
  },
  methods: {
    init(){
      !this.$route.query.storeGiftId && this.$router.back(-1)
      GIFTING_API_GIFT_GETGIFTWITHATTRS(this.$route.query.storeGiftId).then(res=>{
        if(res.data.Code === 'CORRECT') {
          const data = res.data.Data
          this.form = Object.assign(this.form, data)
          this.html = this.form.description
          let arrTmp = []
          if(data.categoryId1 !== ''){
            arrTmp.push(data.categoryId1)
            arrTmp.push(data.categoryId2)
          }
          this.form.categoryId = arrTmp
          let arrTmpType = []
          if(!data.scoreType){
            arrTmpType = ['1']
          }else{
            if(data.scoreType === 3){
              arrTmpType = ['1','2']
            }else{
              arrTmpType.push(data.scoreType + '')
            }
          }
          this.form.type = arrTmpType
          this.form.arrayImageUrls = data.arrayImageUrls || []
          this.parameterObj.list = data.giftParams
          if(data.giftAttrs){
            if(data.giftAttrs.length === 2){
              this.specificationList = data.giftAttrs[0].giftAttrItems.map(v => Object.assign({
              },{
                val:v.val
              }))
              this.specificationName = data.giftAttrs[0].name
              this.styleList = data.giftAttrs[1].giftAttrItems.map(v => Object.assign({
              },{
                val:v.val
              }))
              this.styleName = data.giftAttrs[1].name
            }else if (data.giftAttrs.length === 1){
              this.specificationList = data.giftAttrs[0].giftAttrItems.map(v => Object.assign({
              },{
                val:v.val
              }))
              this.specificationName = data.giftAttrs[0].name
            }
          }
        }
      })
    },
    async getCategory() {
      let dataAll = await Promise.all([
        GIFTING_API_CATEGORY_SEARCH(),GIFTING_API_BRAND_GETBINDLIST({
        })
      ])
      this.categoryList = dataAll[0].data.Data.map(item => Object.assign(item, {
        disabled: Boolean(!item.items)
      }))
      this.brandList = dataAll[1].data.Data
    },
    listenEditerChange (obj) {
      this.form.description = obj.html
      this.editorText = obj.text
    },
    submit(giftSubmitType){
      if (this.form.type.length === 1) {
        if (this.form.type[0] == 1) {
          this.rules.goldenRice = null
        } else {
          this.rules.score = null
        }
      } else {
        this.rules.score = [
          {
            validator: this.checkScore, trigger: 'blur' 
          }
        ]
        this.rules.goldenRice = [
          {
            validator: this.checkGoldenRice, trigger: 'blur' 
          }
        ]
      }
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('请按正确的格式填写')
          return
        }
        let params = Object.assign({
        },this.form)
        params.storeGiftId = this.$route.query.storeGiftId
        if(params.categoryId.length === 2){
          params.categoryId1 = params.categoryId[0]
          params.categoryId2 = params.categoryId[1]
        } else if (params.categoryId.length === 1){
          params.categoryId1 = params.categoryId[0]
          params.categoryId2 = ''
        } else {
          params.categoryId1 = ''
          params.categoryId2 = ''
        }
        params.score = this.form.score || ''
        params.goldenRice = this.form.goldenRice || ''
        if(params.type.length === 2){
          params.scoreType = '3'
        }else if (params.type.length === 1){
          params.scoreType = params.type[0]
          params.scoreType === '1' ? params.goldenRice = '' : params.score = ''
        }else{
          params.scoreType = ''
          params.score = ''
          params.goldenRice = ''
        }
        params.giftSubmitType  = giftSubmitType
        if(this.specificationList.some(v => v.val !== '')){
          params.giftAttrs[0].name = this.specificationName
          params.giftAttrs[0].giftAttrItems = this.specificationList.filter(v => v.val !== '')
        }
        if(this.styleList.some(v => v.val !== '')){
          params.giftAttrs[1].name = this.styleName
          params.giftAttrs[1].giftAttrItems = this.styleList.filter(v => v.val !== '')
        }
        let tmpArray = this.parameterObj.list.filter(v => v.val !== '')
        params.giftParams = !tmpArray.length ? [
          {
            name: '', val: ''
          }
        ] : tmpArray
        this.$store.commit('SET_BTN_LOADING', true)
        GIFTING_API_GIFT_SAVEUPDATEBYAGENT(params).then(res => {
          if(res.data.Code === 'CORRECT'){
            this.$message.success('已成功修改礼品')
            this.$router.back(-1)
          }else{
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      })
    },
    checkCategoryId(r,v,callback) {
      if(v instanceof Array && v[0] !== 0){
        callback()
      }else{
        callback(new Error('请选择礼品分类'))
      }
    },
    checkScore(r, v, callback) {
      if (!v && this.form.type.some(t => t === '1')) {
        callback(new Error('请输入积分'))
        return
      } else if (v && v < 1 || v > 999999) {
        callback(new Error('请输入1-999999的整数'))
        return
      }
      callback()
    },
    checkGoldenRice(r, v, callback) {
      if (!v && this.form.type.some(t => t === '2')) {
        callback(new Error('请输入礼金'))
      } else if (v && v < 1 || v > 999999) {
        callback(new Error('请输入1-999999的整数'))
        return
      }
      callback()
    },
    unValidator(r,v,callback) {
      callback()
    }
  },
  mounted () {
    this.getCategory()
    this.init()
    this.$refs.editor.editor.$textElem.attr('contenteditable', false)
  },
  components: {
    editor
  }
}
</script>

<style lang="scss" scoped>
.title{
  border-bottom: 1px solid #ddd;
  padding:10px;
  margin-bottom: 10px;
  >h3{
    display: inline-block;
    font-size: 20px;
  }
}
.em{
  color:#aaa;
  padding-left: 5px;
}
.dynamic{
  position: relative;
  left: 0;
  top:0;
  >div:first-child{
    position: absolute;
    top:0;
    left: 10px;
    >span{
      margin-left: 5px;
    }
  }
  >div:last-child{
    >div{
      display: inline-block;
      margin-left: 10px;
      margin-bottom: 10px;
    }
    padding-left: 120px;
  }
}
.img-list-item{
  display: inline-block;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  border: 1px solid #ddd;
  position: relative;
  top:0;
  left: 0;
  margin-right: 10px;
  >img{
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  >.main-tip{
    color:#fff;
    padding: 0 8px;
    font-size: 12px;
    line-height: 18px;
    background: #399fe5;
    position: absolute;
    left: 0;
    top:0;
    border-radius: 5px 0 0 0;
    z-index: 10;
  }
}
</style>
