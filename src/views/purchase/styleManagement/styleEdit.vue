<template>
  <div v-loading="isLoading">
    <div class="title">
      <h3>基本信息</h3>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="款号：" prop="StyleCode">
        <el-input name="styleNum" v-model="form.StyleCode" @blur="form.StyleCode = form.StyleCode.trim()" style="width:410px" :disabled="id ? true : false" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="款式名称：" prop="StyleName">
        <el-input name="StyleName" v-model="form.StyleName" @blur="form.StyleName = form.StyleName.trim()" style="width:410px" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="种类：" prop="KindTypeEk">
        <el-select filterable name="KindTypeEk" v-model="form.KindTypeEk" placeholder="请选择" @change="kindChange">
          <template v-for="(v,i) in kind">
            <el-option v-if="v.State === YNStatus.Yes" :key="i" :label="v.Value" :value="v.Id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="品类：" prop="CategoryTypeEk">
        <el-select filterable name="CategoryTypeEk" v-model="form.CategoryTypeEk" placeholder="请选择" @change="categoryChange">
          <el-option label="请选择" :value="0"></el-option>
          <template v-for="(v,i) in category">
            <el-option v-if="v.State === YNStatus.Yes" :key="i" :label="v.Value" :value="v.Id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="新款日期：" prop="UpperTime">
        <el-date-picker v-model="form.UpperTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="模版来源：">
        <el-select filterable name="brandId" v-model="form.TemplateType" placeholder="请选择">
          <el-option label="请选择" :value="0"></el-option>
          <el-option v-for="(v,i) in templateType.TypeArray" :key="i" :label="v.Value" :value="v.KeyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金重(g)：">
        <div class="dynamic">
          <div v-for="(item,index) in GWeights" :key="index">
            <el-input
              name="specificationVal"
              @keyup.native="GWeights[index]['weight']=$root.toFixed(GWeights[index]['weight'],3)"
              v-model="GWeights[index]['weight']"
              style="width:120px"
              maxlength="15"
            ></el-input>
            <el-button name="btnSpecificationDisabled" type="danger" icon="el-icon-delete" circle v-if="GWeights.length > 1" @click="deleteRows('GWeights', index)"></el-button>
          </div>
          <el-button name="btnDisabled" type="primary" icon="el-icon-plus" circle @click="addRows('GWeights', 'object')"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="主石重(ct)：">
        <div class="dynamic">
          <div v-for="(item,index) in SWeights" :key="index">
            <el-input
              name="specificationVal"
              @keyup.native="SWeights[index]['weight']=$root.toFixed(SWeights[index]['weight'],3)"
              v-model="SWeights[index]['weight']"
              style="width:120px"
              maxlength="15"
            ></el-input>
            <el-button name="btnSpecificationDisabled" type="danger" icon="el-icon-delete" circle v-if="SWeights.length > 1" @click="deleteRows('SWeights', index)"></el-button>
          </div>
          <el-button name="btnDisabled" type="primary" icon="el-icon-plus" circle @click="addRows('SWeights', 'object')"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="主石颜色：">
        <div class="dynamic">
          <div v-for="(item,index) in SColor" :key="index">
            <el-input name="specificationVal" v-model="SColor[index]" @blur="SColor[index] = SColor[index].trim()" style="width:120px" maxlength="15"></el-input>
            <el-button name="btnSpecificationDisabled" type="danger" icon="el-icon-delete" circle v-if="SColor.length > 1" @click="deleteRows('SColor', index)"></el-button>
          </div>
          <el-button name="btnDisabled" type="primary" icon="el-icon-plus" circle @click="addRows('SColor')"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="主石净度：">
        <div class="dynamic">
          <div v-for="(item,index) in SClaritys" :key="index">
            <el-input name="specificationVal" v-model="SClaritys[index]" @blur="SClaritys[index] = SClaritys[index].trim()" style="width:120px" maxlength="15"></el-input>
            <el-button name="btnSpecificationDisabled" type="danger" icon="el-icon-delete" circle v-if="SClaritys.length > 1" @click="deleteRows('SClaritys', index)"></el-button>
          </div>
          <el-button name="btnDisabled" type="primary" icon="el-icon-plus" circle @click="addRows('SClaritys')"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="尺寸：">
        <div class="dynamic">
          <div v-for="(item,index) in Size" :key="index">
            <el-input name="specificationVal" v-model="Size[index]" @blur="Size[index] = Size[index].trim()" style="width:120px" maxlength="15"></el-input>
            <el-button name="btnSpecificationDisabled" type="danger" icon="el-icon-delete" circle v-if="Size.length > 1" @click="deleteRows('Size', index)"></el-button>
          </div>
          <el-button name="btnDisabled" type="primary" icon="el-icon-plus" circle @click="addRows('Size')"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="商品图片：" prop="required" :show-message="arrayImageUrls.length < 1">
        <div class="clearfix">
          <template v-if="arrayImageUrls.length">
            <div class="goods-imgs" v-for="(item, index) in arrayImageUrls" :key="index">
              <img class="goods-img" :src="item.indexOf('http') > -1 ? item : $root.settings.DOMAIN_IMG_FILE + item">
              <div class="main-tip" v-if="item === form.ImageUrl">主图</div>
              <div class="hover-here">
                <i class="icon-set" title="设置为主图" name="btnSetMain" @click="setMain(index)" v-if="item !== form.ImageUrl"></i>
                <i class="el-icon-view" title="查看图片" name="btnCheckImg" @click="checkImg(index)"></i>
                <i class="el-icon-delete" title="删除此图" name="btnRemoveImg" @click="removeImg(index)"></i>
              </div>
            </div>
          </template>
          <div v-if="arrayImageUrls.length < 5" class="img-uploader" @click="iClick">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <input name="file" type="file" id="imgUploaderInput" style="display: none;" accept="image/jpg, image/jpeg, image/png" @change="uploadChange">
          </div>
        </div>
        <div class="em">最多5张，单张不超过2M，可上传JPG/JPEG/PNG格式的图片</div>
      </el-form-item>
      <el-form-item label="描述：" prop="Description">
        <el-input name="Description" v-model="form.Description" style="width:410px" maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <div class="title" v-if="$store.getters.user_session.CharacterType === characterType.Company">
      <h3>关联供应商</h3>
    </div>
    <el-form ref="parameterForm" :model="form" :rules="rules" v-if="isShow && $store.getters.user_session.CharacterType === characterType.Company">
      <el-table :data="form.StylePartners" style="width: 100%">
        <el-table-column prop="PartnerId" label="供应商名称" width="180">
          <template slot="header"><span class="red">*</span>供应商名称</template>
          <template slot-scope="scope">
            <el-form-item :prop="'StylePartners.' + scope.$index + '.PartnerId'" :inline-message="true" :rules="rules.PartnerId">
              <el-select filterable name="PartnerId" v-model="scope.row.PartnerId" placeholder="请选择">
                <template v-for="(v,i) in supplierList">
                  <el-option v-if="v.State === YNStatus.Yes && (v.PartnerType == partnerType.Merchant || v.PartnerType == partnerType.Supplier)" :key="i" :label="v.Value" :value="Number(v.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="LastStyleCode" label="供应商款号">
          <template slot="header"><span class="red">*</span>供应商款号</template>
          <template slot-scope="scope">
            <el-form-item :prop="'StylePartners.' + scope.$index + '.LastStyleCode'" :inline-message="true" :rules="rules.LastStyleCode">
              <el-input name="LastStyleCode" v-model.trim="scope.row.LastStyleCode" maxlength="30"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="PurchaseType" label="进货方式">
          <template slot="header"><span class="red">*</span>进货方式</template>
          <template slot-scope="scope">
            <el-form-item :prop="'StylePartners.' + scope.$index + '.PurchaseType'" :inline-message="true" :rules="rules.PurchaseType">
              <el-select filterable name="PurchaseType" v-model="scope.row.PurchaseType" placeholder="请选择">
                <el-option  :label="purchaseType.Types[purchaseType.Purchase]" :value="Number(purchaseType.Purchase)"></el-option>
                <el-option  :label="purchaseType.Types[purchaseType.WeiwStuff]" :value="Number(purchaseType.WeiwStuff)"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="SettleType" label="结算方式">
          <template slot-scope="scope">
            <el-form-item :prop="'StylePartners.' + scope.$index + '.SettleType'" :inline-message="true">
              <el-select filterable name="SettleType" v-model="scope.row.SettleType" placeholder="请选择">
                <el-option label="请选择" :value="0"></el-option>
                <el-option v-for="(v,i) in settleType.TypeArray" :key="i" :label="v.Value" :value="Number(v.KeyId)"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="ReferPrice" label="参考进货价/工费">
          <template slot-scope="scope">
            <el-form-item :inline-message="true">
              <el-input name="ReferPrice" v-model="scope.row.ReferPrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="Note" label="备注">
          <template slot-scope="scope">
            <el-form-item :inline-message="true">
              <el-input name="Note" v-model="scope.row.Note" @blur="scope.row.Note = scope.row.Note.trim()" :maxlength="50"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="contral" label="操作" width="80">
          <template slot-scope="scope">
            <span class="el-button el-button--text el-button--mini" @click="deleteSupplier(scope)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span class="el-button el-button--text el-button--mini p-10" @click="addSupplier">添加</span>
    <div class="title">
      <h3>商品详情</h3>
    </div>
    <div>
      <editor @listenEditerChange="listenEditerChange" :Note="form.Note"></editor>
    </div>
    <div class="p-10">
      <el-button name="btnSubmit" type="primary" :loading="$store.getters.is_loading" @click="submit">保存</el-button>
      <el-button name="btnCancel" @click="$router.back(-1)">取消</el-button>
    </div>
    <img-cropper v-if="cropperVisible" :cropperVisible="cropperVisible" :imgSize="imgSize" :url="cropperUrl" @listenCropper="listenCropper"></img-cropper>
    <img-check v-if="checkImgVisible" :checkImgVisible="checkImgVisible" :url="$root.settings.DOMAIN_IMG_FILE + checkImgUrl" @listenUrlCheck="checkImgVisible = false"></img-check>
  </div>
</template>

<script>
import editor from '@/components/common/editor'
import imgCropper from '@/components/spread/imgCropper'
import imgCheck from '@/views/spread/goods/imgCheck'
import { COMMON_API_IMAGE_UPLOAD64TOOSS } from '@/apis/common'
import {
  STOCKING_API_STYLE_BASIC_GET,
  STOCKING_API_STYLE_BASIC_CREATE,
  STOCKING_API_STYLE_PARTNER_GETS,
  STOCKING_API_STYLE_BASIC_UPDATE
} from '@/apis/stocking'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST
} from '@/apis/merchant'
import {
  SettingEnumeratorEnumeratorType,
  StyleBasicTemplateType,
  StylePartnerSettleType
} from '@/enums/stocking'
import { PurchaseType, CharacterType, YNStatus, PartnerType } from '@/enums/common'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      YNStatus,
      partnerType: PartnerType,
      form: {
        StyleCode: '',
        StyleName: '',
        KindTypeEk: null,
        CategoryTypeEk: null,
        UpperTime: '',
        TemplateType: null,
        GoldWeights: '',
        StoneWeights: '',
        StoneColors: '',
        StoneClaritys: '',
        Sizes: '',
        Description: '',
        Note: '',
        ImageUrl: '',
        ImageUrls: '',
        StylePartners: []
      },
      StylePartners: [],
      characterType: CharacterType,
      templateType: StyleBasicTemplateType, // 模板来源
      settleType: StylePartnerSettleType, // 结算方式下拉
      purchaseType: PurchaseType, // 进货方式下拉
      kind: [], // 种类下拉
      category: [], // 品类下拉
      supplierList: [], // 供应商下拉
      checkImgVisible: false,
      cropperVisible: false,
      brandList: [],
      isEdit: true,
      parameterObj: {
        list: [
          {
            name: '',
            val: ''
          }
        ]
      },
      html: '',
      editorText: '',
      rules: {
        StyleCode: [
          {
            required: true,
            message: '请输入款号',
            trigger: 'blur'
          }
        ],
        StyleName: [
          {
            required: true,
            message: '请输入款式名称',
            trigger: 'blur'
          }
        ],
        KindTypeEk: [
          {
            required: true,
            message: '请选择种类',
            trigger: 'change'
          }
        ],
        PartnerId: [
          {
            required: true,
            message: '请选择供应商名称',
            trigger: 'change'
          }
        ],
        LastStyleCode: [
          {
            required: true,
            message: '请输入供应商款号',
            trigger: 'blur'
          }
        ],
        PurchaseType: [
          {
            required: true,
            message: '请选择进货方式',
            trigger: 'change'
          }
        ],
        ReferPrice: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入非负数字'))
              } else if (
                value != '' &&
                !/^(?!0(\.0{1,2})?$)(([1-9]\d{0,8})|0)(\.\d{1,2})?$/.test(value)
              ) {
                callback(new Error('输入有误'))
              }
              callback()
            }
          }
        ]
      },
      arrayImageUrls: [],
      GWeights: [
        {
          weight: ''
        },
        {
          weight: ''
        }
      ],
      SWeights: [
        {
          weight: ''
        },
        {
          weight: ''
        }
      ],
      SColor: ['', ''],
      SClaritys: ['', ''],
      Size: ['', ''],
      isShow: false,
      id: null,
      isLoading: false,
    }
  },
  methods: {
    init() {
      this.id = Number(this.$route.query.StyleId) || 0
      if (this.id) {
        STOCKING_API_STYLE_BASIC_GET({
          StyleId: this.$route.query.StyleId
        }).then(res => {
          const data = {
            ...res.data.Data,
            UpperTime: this.dataFilterData(res.data.Data.UpperTime),
            StylePartners: []
          }
          this.form = data
          this.GWeights = this.returnArr(data.GoldWeights)
          this.SWeights = this.returnArr(data.StoneWeights)
          this.SColor = data.StoneColors.split(',')
          this.SClaritys = data.StoneClaritys.split(',')
          this.Size = data.Sizes.split(',')
          this.arrayImageUrls = data.ImageUrls.length > 0 ? data.ImageUrls.split(',') : []
          if (
            this.$store.getters.user_session.CharacterType ===
            CharacterType.Company
          ) {
            STOCKING_API_STYLE_PARTNER_GETS({
              StyleId: this.$route.query.StyleId
            }).then(res => {
              this.form.StylePartners = res.data.Data
                ? res.data.Data.map(item => {
                  const obj = {
                    ...item,
                    ReferPrice: this.$root.toFloat(item.ReferPrice),
                    isNew: false
                  }
                  return obj
                })
                : []
              this.StylePartners = res.data.Data ? res.data.Data.map(item => {
                const obj = {
                  ...item,
                  ReferPrice: this.$root.toFloat(item.ReferPrice),
                }
                return obj
              })
                : []
              this.isShow = true
            })
          }
        })
      } else {
        this.isShow = true
      }
    },
    returnArr(string) {
      let arr = []
      if(!string || !string.length) {
        return [
          {
            weight: ''
          },
          {
            weight: ''
          }
        ]
      } else {
        string.substring(0, string.length - 1).split(',').forEach(res => {
          arr.push({ weight: res })
        })
      }
      return arr
    },
    listenEditerChange(obj) {
      this.form.Note = obj.html
      this.editorText = obj.text
    },
    dataFilterData(value) {
      const ignore = ['1900', '9999']
      if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
        return ''
      } else {
        return value
      }
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$refs['parameterForm'].validate(val => {
            if (val) {
              this.$store.commit('SET_BTN_LOADING', true) // table loading
              let GoldWeights = ''
              let StoneClaritys = this.SClaritys.join(',')
              let StoneColors = this.SColor.join(',')
              let StoneWeights = ''
              let Sizes = this.Size.join(',')
              this.GWeights.map((item,index) => {
                if (item.weight !== '') {
                  if(this.GWeights.length === index + 1) {
                    GoldWeights = `${GoldWeights}${item['weight']}`
                  } else {
                    GoldWeights = `${GoldWeights}${item['weight']},`
                  }
                }
              })
              // this.SClaritys.map(item => {
              //   if (item !== '') {
              //     StoneClaritys = `${StoneClaritys}${item},`
              //   }
              // })
              // this.SColor.map(item => {
              //   if (item !== '') {
              //     StoneColors = `${StoneColors}${item},`
              //   }
              // })
              this.SWeights.map((item, index) => {
                if (item.weight !== '') {
                  if(this.SWeights.length === index + 1) {
                    StoneWeights = `${StoneWeights}${item['weight']}`
                  } else {
                    StoneWeights = `${StoneWeights}${item['weight']},`
                  }
                }
              })
              // this.Size.map(item => {
              //   if (item !== '') {
              //     Sizes = `${Sizes}${item},`
              //   }
              // })
              const para = {
                ...this.form,
                GoldWeights: GoldWeights,
                StoneClaritys: StoneClaritys,
                StoneColors: StoneColors,
                StoneWeights: StoneWeights,
                Sizes: Sizes,
                UpperTime:
                  this.form.UpperTime != ''
                    ? dayjs(this.form.UpperTime).format('YYYY-MM-DD')
                    : ''
              }
              para.StylePartners = this.form.StylePartners.map(item => {
                const obj = {
                  ...item,
                  ReferPrice: this.$root.toInt(item.ReferPrice)
                }
                return obj
              })
              let image = this.arrayImageUrls.join(',')
              para.ImageUrls = image || '/default/goods/150x150.jpg'
              para.ImageUrl = para.ImageUrl || '/default/goods/150x150.jpg'
              if (this.id) {
                para.StyleId = this.id
                this.StylePartners.map(item => {
                  const isExist = para.StylePartners.find(items => items.RelatedId === item.RelatedId)
                  if(!isExist) {
                    const obj = {
                      ...item,
                      ReferPrice: this.$root.toInt(item.ReferPrice)
                    }
                    para.StylePartners.push(obj)
                  }
                })
                STOCKING_API_STYLE_BASIC_UPDATE(para).then(res => {
                  this.$store.commit('SET_BTN_LOADING', false)
                  if (res.data.Code === 'CORRECT') {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.$router.back(-1)
                  }
                })
              } else {
                STOCKING_API_STYLE_BASIC_CREATE(para).then(res => {
                  this.$store.commit('SET_BTN_LOADING', false)
                  if (res.data.Code === 'CORRECT') {
                    this.$message({
                      message: '创建成功',
                      type: 'success'
                    })
                    this.$router.back(-1)
                  }
                   
                })
              }
            }
          })
        }
      })
    },
    categoryChange() {
      this.category.map(item => {
        if (item.Id == this.form.CategoryTypeEk) {
          this.form.CategoryTypeEv = item.Value
        }
      })
    },
    kindChange() {
      this.kind.map(item => {
        if (item.Id == this.form.KindTypeEk) {
          this.form.KindTypeEv = item.Value
        }
      })
    },
    setMain(index) {
      let temp = this.arrayImageUrls[index]
      this.form.ImageUrl = this.arrayImageUrls[index]
      this.arrayImageUrls.splice(index, 1)
      this.arrayImageUrls.unshift(temp)
    },
    checkImg(index) {
      this.checkImgUrl = this.arrayImageUrls[index]
      this.checkImgVisible = true
    },
    removeImg(index) {
      this.$confirm('是否删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const currentImgUrl = this.arrayImageUrls[index]
        this.arrayImageUrls.splice(index, 1)
        if (currentImgUrl === this.form.ImageUrl) {
          this.form.ImageUrl =
            this.arrayImageUrls.length === 0
              ? ''
              : (this.form.ImageUrl = this.arrayImageUrls[0])
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    iClick() {
      document.getElementById('imgUploaderInput').click()
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
          document.getElementById('imgUploaderInput').value = ''
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
        }
      })
    },
    // 获取品类
    getCategory() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.CategoryType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.category = res.data.Data.Rows
        }
      })
    },
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierList = res.data.Data.Rows
        }
      })
    },
    addRows(val, type) {
      this[val].push(type == 'object' ? { weight: '' } : '')
    },
    deleteRows(val, index) {
      this[val].splice(index, 1)
    },
    listenCropper(files) {
      this.cropperVisible = false
      this.isLoading = true
      const param = {
        Base64Str: files,
        Root: this.$root.filePaths.COLLEGE_INFAST
      }
      COMMON_API_IMAGE_UPLOAD64TOOSS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.arrayImageUrls.push(res.data.Data.Path)
          this.form.ImageUrl =
            this.arrayImageUrls.length && this.arrayImageUrls[0]
        }
        this.isLoading = false
        this.cropperVisible = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    addSupplier() {
      const obj = {
        PartnerId: null,
        LastStyleCode: '',
        PurchaseType: null,
        SettleType: null,
        ReferPrice: null,
        Note: '',
        State: YNStatus.Yes,
        isNew: true
      }
      let form = this.form
      form.StylePartners.push(obj)
      this.form = Object.assign({}, this.form, form)
    },
    deleteSupplier(scope) {
      let form = this.form
      form.StylePartners.splice(scope.$index, 1)
      if(!scope.row.isNew) {
        this.StylePartners.map(item => {
          if(item.RelatedId === scope.row.RelatedId) {
            item.State = YNStatus.No
          }
        })
      }
      this.form = Object.assign({}, this.form, form)
    }
  },
  mounted() {
    this.init()
    this.getKind()
    this.getCategory()
    this.getSupplierList()
  },
  components: {
    editor,
    imgCropper,
    imgCheck
  }
}
</script>
<style lang="scss">
.el-form-item {
  .el-form-item__content {
    .el-form-item__error {
      position: absolute !important;
      top: 30px;
      left: 0;
    }
  }
}
</style>

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
  div {
    display: inline-block;
  }
}
.img-list-item {
  display: inline-block;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  border: 1px solid #ddd;
  position: relative;
  top: 0;
  left: 0;
  margin-right: 10px;
  > img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 5px;
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
</style>
