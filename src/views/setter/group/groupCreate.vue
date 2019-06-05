<template>
  <div class="content-view p-b-50">
    <el-form
      label-position="right"
      class="fix-w"
      label-width="120px"
      :model="form"
      v-loading="isLoading"
      :rules="rules"
      ref="form"
    >
      <div class="upload-logo">
        <el-form-item
          label="上传LOGO："
          prop="ImageUrl"
        >
          <uploadImg
            :uploadImageUrl="form.ImageUrl ? DOMAIN_IMG_FILE + form.ImageUrl : form.ImageUrl"
            :Root="SETTING_GROUP"
            @uploadSucc="uploadSucc"
            :uploadImgLoading="uploadImgLoading"
            @uploadImgLoadingChange="uploadImgLoadingChange"
            :styleObj="{width:'240px',height:'120px'}"
          ></uploadImg>
        </el-form-item>
        <el-form-item
          label="集团编号："
          prop="GroupCode"
        >
          <el-input
            name="GroupCode"
            v-model="form.GroupCode"
            @blur="form.GroupCode=form.GroupCode.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="集团名称："
          prop="GroupName"
        >
          <el-input
            name="GroupName"
            v-model="form.GroupName"
            @blur="form.GroupName=form.GroupName.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="集团简称："
          prop="ShortName"
        >
          <el-input
            name="ShortName"
            v-model="form.ShortName"
            @blur="form.ShortName=form.ShortName.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="类型/套餐："
          prop="PackId"
        >
          <el-select
            name="PackId"
            v-model="form.PackId"
            filterable
          >
            <el-option
              v-for="item in packList"
              :key="item.value"
              :value="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="管理员账号："
          prop="AdministratorId"
        >
          <el-input
            name="UserName"
            :maxlength="50"
            v-model="form.AdministratorId"
            @blur="form.AdministratorId=form.AdministratorId.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="初始密码："
          prop="Password"
        >
          <el-input
            name="Password"
            v-model="form.Password"
            @blur="form.Password=form.Password.trim()"
            :maxlength="20"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属地区："
          prop="selectArea"
        >
          <el-cascader
            filterable
            v-model="form.selectArea"
            ref="cascader"
            :options="$store.getters.areas"
            @change="adressChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址："
          prop="Address"
        >
          <el-input
            name="Address"
            v-model="form.Address"
            @blur="form.Address=form.Address.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="营业执照："
          prop="BusinessLicense"
        >
          <el-input
            name="BusinessLicense"
            v-model="form.BusinessLicense"
            @blur="form.BusinessLicense=form.BusinessLicense.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="集团电话："
          prop="Phone"
        >
          <el-input
            name="Phone"
            v-model="form.Phone"
            @blur="form.Phone=form.Phone.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人："
          prop="Contact"
        >
          <el-input
            name="Contact"
            v-model="form.Contact"
            @blur="form.Contact=form.Contact.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人手机："
          prop="Mobile"
        >
          <el-input
            name="Mobile"
            v-model="form.Mobile"
            @blur="form.Mobile=form.Mobile.trim()"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="QQ："
          prop="QQ"
        >
          <el-input
            name="QQ"
            v-model="form.QQ"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="微信："
          prop="Wechart"
        >
          <el-input
            name="Wechart"
            v-model="form.Wechart"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱："
          prop="Email"
        >
          <el-input
            name="Email"
            v-model="form.Email"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="银行账号："
          prop="AccountCode"
        >
          <el-input
            name="AccountCode"
            v-model="form.AccountCode"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开户行："
          prop="BankName"
        >
          <el-input
            name="BankName"
            v-model="form.BankName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开户人："
          prop="Surname"
        >
          <el-input
            name="Surname"
            v-model="form.Surname"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="集团简介："
          prop="Introduction"
        >
          <el-input
            name="Introduction"
            v-model="form.Introduction"
            class
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="relation-css"
          label="关联商户："
        >
          <template>
            <el-button
              name="choseCompany"
              type="text"
              @click="choseCompany(true)"
            >选择</el-button>
            <el-table
              :data="form.CompanyBasics"
              class="m-t-10 w815"
            >
              <el-table-column
                show-overflow-tooltip
                label="公司编码"
                prop="CompanyCode"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="公司名称"
                prop="CompanyName"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="创建日期"
                prop="CreateTime"
              >
                <template slot-scope="scoped">{{scoped.row.CreateTime | filterDate}}</template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="地区"
                prop="AddressExt"
              ></el-table-column>
              <el-table-column
                label="商户数量"
                prop="StoreAmount"
              ></el-table-column>
              <el-table-column
                label="状态"
                prop="State"
                :formatter="formatter"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <span
                    class="table-tool"
                    @click="cancelRelation($event,scoped.row.CompanyId, scoped.$index)"
                  >取消关联</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button
            name="save"
            type="primary"
            @click="onSubmit('form')"
          >保存</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog
      title="关联商户"
      :visible.sync="dialogFormVisible"
      width="1024px"
    >
      <!-- 弹窗内容 start-->
      <div>
        <el-form
          :model="formData"
          ref="search"
          lable-width="120px"
          @keyup.enter.native="onSearch"
          class="item-lh-26"
          :inline="true"
        >
          <el-row
            class="search-box"
            type="flex"
          >
            <el-col>
              <el-form-item
                label="所在地区："
                prop="Area"
              >
                <el-cascader
                  v-model="formData.Area"
                  :options="$store.getters.areas"
                  filterable
                  change-on-select
                  @change="adressChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item
                v-show="false"
                prop="ProvinceId"
              >
                <el-input
                  name="ProvinceId"
                  v-model="formData.ProvinceId"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-show="false"
                prop="CityId"
              >
                <el-input
                  name="CityId"
                  v-model="formData.CityId"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="公司编码："
                prop="CompanyCode"
              >
                <el-input
                  name="CompanyCode"
                  v-model="formData.CompanyCode"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="公司名称："
                prop="CompanyName"
              >
                <el-input
                  name="CompanyName"
                  v-model="formData.CompanyName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="search-btn btn-w">
              <el-button
                name="search"
                type="primary"
                @click="onSearch"
              >搜索</el-button>
              <el-button
                name="reset"
                type="default"
                @click="onReset"
              >重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          class="m-t-10"
          :data="shopData"
          v-loading="$store.getters.tb_loading"
        >
          <el-table-column
            show-overflow-tooltip
            label="公司编号"
            width="150"
            prop="CompanyCode"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="公司名称"
            width="160"
            prop="CompanyName"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="创建日期"
            width="160"
            prop="CreateTime"
            :formatter="formatter"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="地区"
            width="180"
            prop="AddressExt"
            :formatter="formatter"
          ></el-table-column>
          <el-table-column
            label="门店数量"
            width="100"
            prop="StoreAmount"
          ></el-table-column>
          <el-table-column
            label="状态"
            prop="State"
            :formatter="formatter"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="scoped">
              <!-- <span class="table-tool" @click="addShop(scoped.row.CompanyId, scoped.$index)">添加</span> -->
              <el-button
                name="addShop"
                type="text"
                @click="addShop(scoped.row.CompanyId, scoped.$index)"
              >添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pg="formData.PageIndex"
          :size="formData.PageSize"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></pagination>
      </div>
      <!-- 弹窗内容 end-->
      <!-- 按钮 start-->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button name="dialogConfirm" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button name="dialogCancel" @click="dialogFormVisible = false">取 消</el-button>
      </div>-->
      <!-- 按钮 end-->
    </el-dialog>
  </div>
</template>
<script>
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import {
  MERCHANT_API_DROPDOWN_PACKBASICLIST, // 套餐 - 列表(下拉)
  MERCHANT_API_GROUP_BASIC_CREATE, // 集团服务 - 创建
  MERCHANT_API_COMPANY_BASIC_GETS // 商户服务 - 检索
} from '@/apis/merchant.js'
import { CharacterType, EnableState } from '@/enums/common.js'
import { SETTING_GROUP } from '@/configs/filePaths.js'

import pagination from '@/components/pagination.vue'
import uploadImg from '@/components/common/uploadImg.vue'
export default {
  components: {
    pagination,
    uploadImg
  },
  data() {
    var checkNum = (rule, value, callback) => {
      const reg = /^([0-9]{0,50})$/g
      if (!reg.test(value)) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    }
    return {
      uploadImgLoading: false,
      DOMAIN_IMG_FILE,
      SETTING_GROUP,
      isLoading: false,
      rules: {
        PackId: [
          {
            required: true,
            message: '类型/套餐不能为空！',
            trigger: 'change'
          }
        ],
        GroupCode: [
          {
            required: true,
            message: '集团编码不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ],
        GroupName: [
          {
            required: true,
            message: '集团名称不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ],
        ShortName: [
          {
            required: true,
            message: '集团简称不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ],
        AdministratorId: [
          {
            required: true,
            message: '管理员账号不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ],
        Password: [
          {
            required: true,
            message: '初始密码不能为空！'
          },
          {
            min: 5,
            max: 20,
            message: '密码5-20个字符'
          }
        ],
        Address: [
          {
            required: true,
            message: '详细地址不能为空！',
            trigger: 'blur'
          }
        ],
        BusinessLicense: [
          {
            required: true,
            message: '集团执照不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ],
        selectArea: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value || !value[0] || !value[0].length) {
                callback('请选择所属地区')
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        Phone: [
          {
            required: true,
            message: '集团电话不能为空！',
            trigger: 'blur'
          }
          // { validator: phone, trigger: 'blur'}
        ],
        Contact: [
          {
            required: true,
            message: '联系人不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ],
        Mobile: [
          {
            required: true,
            message: '联系人手机不能为空！',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 11,
            message: '手机号6到11位',
            trigger: 'blur'
          },
          {
            validator: checkNum,
            trigger: 'blur'
          }
        ],
        QQ: [
          {
            max: 20,
            message: 'QQ最多20位',
            trigger: 'blur'
          },
          {
            validator: checkNum,
            trigger: 'blur'
          }
        ],
        Wechart: [
          {
            max: 30,
            message: '微信最多30位',
            trigger: 'blur'
          }
        ],
        Email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '邮箱最多30个字符',
            trigger: 'blur'
          }
        ]
      },
      form: {
        selectArea: [],
        PackId: '',
        ImageUrl: '',
        GroupCode: '',
        GroupName: '',
        ShortName: '',
        AdministratorId: '',
        Password: '',
        Address: '',
        ProvinceId: '',
        ProvinceName: '',
        CityId: '',
        CityName: '',
        TownId: '',
        TownName: '',
        BusinessLicense: '',
        BusinessUrl: '',
        CompanyBasics: [],
        Phone: '',
        Contact: '',
        Mobile: '',
        QQ: '',
        Wechart: '',
        Email: '',
        SexyType: 0,
        AccountCode: '',
        BankName: '',
        Surname: '',
        Introduction: '',
        CompanyIds: []
      },
      EnableState: EnableState,
      AddresOption: [],
      ProvinceId: [],
      formData: {
        Area: ['', '', ''],
        CompanyId: '',
        GroupId: '',
        CompanyCode: '',
        CompanyName: '',
        SourceType: '',
        ProvinceId: '',
        CityId: '',
        Contact: '',
        Mobile: '',
        Phone: '',
        CreateTime1: '',
        CreateTime2: '',
        OrderBy: '',
        IsAsc: '',
        State: '',
        MapType: '',
        PageIndex: 1,
        PageSize: 10
      },
      props: {
        value: 'value',
        label: 'text',
        children: 'children'
      },
      State: {
        '1': '已启用',
        '2': '已停用'
      },
      tableData: [],
      dialogFormVisible: false,
      CharacterType,
      shopData: [],
      packList: [],
      total: 0
    }
  },
  mounted() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.getPackList()
  },
  methods: {
    getPackList() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: this.CharacterType.Group
      }).then(res => {
        res.data.Data.Rows.forEach(item => {
          this.packList.push({
            value: item.Id,
            name: item.Value
          })
        })
      })
    },
    onSearch() {
      // 搜索相关
      this.formData.pageIndex = 1
      this.getList()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.getList()
    },
    // ...mapGetters(['GET_SITE']),
    validator(rule, value, callback) {
      let reg = null
      switch (rule.field) {
        case 'Mobile':
          reg = new RegExp('^([1]{1}[0-9]{10})?$')
          break
        case 'Phone':
          reg = new RegExp('^(((0d{2,3})-?)(d{7,8})(-(d{3,}))?)?$') // g
          break
        case 'Email':
          reg = new RegExp(
            '^((([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+.+)|([A-Za-z0-9]+++))*[A-Za-z0-9]+@((w+-+)|(w+.))*w{1,63}.[a-zA-Z]{2,6})?$',
            'g'
          ) // g
          break
        default:
          reg = new RegExp(
            '^(?!(0[0-9]|0.00|^0.0$))[+]?(([d]{0,9}[.]{1}[d]{1,2})|([1-9][0-9]{0,8}))$',
            'g'
          ) // g;
          break
      }
      const flag = reg.test(value)
      if (!flag) {
        callback(new Error('请正确输入！'))
      } else {
        callback()
      }
    },
    adressChange(value) {
      // 选择省市区后执行将cityname赋值给form
      var cityName = this.$refs.cascader.currentLabels
      this.form.ProvinceName = cityName[0]
      this.form.CityName = cityName[1]
      this.form.TownName = cityName[2]
      if (!this.dialogFormVisible) {
        if (value.length > 0) {
          // 获取选中序号对应的地名
          this.form.ProvinceId = Number(value[0])
          this.form.CityId = Number(value[1])
          this.form.TownId = Number(value[2])
          for (let i = 0; i < this.AddresOption.length; i++) {
            if (this.AddresOption[i].value === value[0]) {
              this.form.ProvinceName = this.AddresOption[i].label
              for (let j = 0; j < this.AddresOption[i].children.length; j++) {
                if (this.AddresOption[i].children[j].value === value[1]) {
                  this.form.CityName = this.AddresOption[i].children[j].label
                  for (
                    let k = 0;
                    k < this.AddresOption[i].children[j].children.length;
                    k++
                  ) {
                    if (
                      this.AddresOption[i].children[j].children[k].value ===
                      value[2]
                    ) {
                      this.form.TownName = this.AddresOption[i].children[
                        j
                      ].children[k].label
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    formatter(row, col) {
      var value = null
      switch (col.property) {
        case 'CreateTime':
          value = row.CreateTime
          break
        case 'AddressExt':
          value = row.ProvinceName + '、' + row.CityName + '、' + row.TownName
          break
        case 'State':
          value = this.EnableState.Types[row.State]
          break
        default:
          value = row[col.property]
          break
      }
      return value
    },
    addShop(id, i) {
      let flag = false
      if (this.form.CompanyBasics.length > 0) {
        this.form.CompanyBasics.forEach(item => {
          if (item.CompanyCode === this.shopData[i].CompanyCode) {
            flag = true
          }
        })
      }
      if (flag) {
        this.$message({
          message: '已添加此商户',
          type: 'warning'
        })
      } else {
        this.form.CompanyBasics.push(this.shopData[i])
        this.form.CompanyIds.push(this.shopData[i].CompanyId)
        this.$message({
          message: '添加商户成功',
          type: 'success'
        })
      }
    },
    onSubmit(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          if (
            !this.form.CityName ||
            !this.form.TownName ||
            !this.form.ProvinceName
          ) {
            this.$message.error('地区需要精确到省市区!')
            return false
          }
          this.isLoading = true
          delete this.form.CompanyBasics
          MERCHANT_API_GROUP_BASIC_CREATE(this.form).then(res => {
            this.isLoading = false
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              this.$router.push({
                path: '/setter/group/index'
              })
            }
          })
        }
      })
    },

    // 关联商户
    choseCompany(flag) {
      this.dialogFormVisible = true
      if (!flag) {
        this.formData.Area = ['', '', '']
      } else {
        this.formData.PageIndex = 1
        this.formData.PageSize = 20
      }
      this.getList()
    },
    getList() {
      this.$store.commit('SET_TB_LOADING', true)
      const { Area } = this.formData
      const param = Object.assign({}, this.formData, {
        ProvinceId: '' + Area[0],
        CityId: '' + Area[1] || 0,
        TownId: '' + Area[2] || 0
      })
      MERCHANT_API_COMPANY_BASIC_GETS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.shopData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sizeChange(value) {
      // 切换每页显示数
      this.formData.PageSize = value
      this.formData.PageIndex = 1
      this.choseCompany()
    },
    currentChange(value) {
      // 切换当前页
      this.formData.PageIndex = value

      this.choseCompany()
    },
    cancelRelation(e, id, i) {
      e.currentTarget.blur()
      this.$confirm('是否取消关联?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const CompanyLists = []
          CompanyLists.push(id)
          // this.isLoading = true
          this.form.CompanyBasics.splice(i, 1)
          this.form.CompanyIds.splice(i, 1)
        })
        .catch(() => {})
    },
    // 图片上传
    uploadSucc(Key) {
      this.form.ImageUrl = Key
    },
    uploadImgLoadingChange(v) {
      this.uploadImgLoading = v
    }
  },
  watch: {
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) {
        this.formData.Area = ['', '', '']
        this.formData.CompanyName = ''
        this.formData.CompanyCode = ''
        this.formData.PageIndex = 1
        this.formData.PageSize = 20
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.w815 {
  width: 815px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100px;
    height: 100px;
  }
}
.btn-w {
  width: 200px;
}
</style>
<style lang="scss">
.relation-css .el-form-item__content {
  line-height: 1;
}
.relation-css .el-table__empty-block {
  display: none;
}
.dialog-content-p .el-dialog--center .el-dialog__body {
  padding: 20px;
  height: 350px;
  overflow: auto;
}
</style>

