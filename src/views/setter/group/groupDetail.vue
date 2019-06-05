<template>
  <div>
    <el-form
      label-position="right"
      class="fix-w"
      label-width="120px"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item
        :label="!isDetail ? '上传LOGO：' : '集团LOGO：' "
        prop="ImageUrl"
      >
        <img
          v-if="isDetail"
          :src="form.ImageUrl ? DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0') : form.ImageUrl"
          width="240"
          height="120"
          class="m-b-10"
        >
        <uploadImg
          v-else
          :uploadImageUrl="form.ImageUrl ? DOMAIN_IMG_FILE + form.ImageUrl : form.ImageUrl"
          :Root="SETTING_GROUP"
          @uploadSucc="uploadSucc"
          :uploadImgLoading="uploadImgLoading"
          @uploadImgLoadingChange="uploadImgLoadingChange"
          :style="{width:'240px',height: '120px'}"
        ></uploadImg>
      </el-form-item>
      <el-form-item
        label="集团编号："
        prop="GroupCode"
      >
        <span>{{form.GroupCode}}</span>
      </el-form-item>
      <el-form-item
        label="集团名称："
        prop="GroupName"
      >
        <span>{{form.GroupName}}</span>
      </el-form-item>
      <el-form-item
        label="集团简称："
        prop="ShortName"
      >
        <el-input
          name="ShortName"
          v-if="!isDetail"
          v-model="form.ShortName"
          @blur="form.ShortName=form.ShortName.trim()"
        ></el-input>
        <span v-else>{{form.ShortName}}</span>
      </el-form-item>
      <el-form-item
        label="类型/套餐："
        prop="PackId"
      >
        <el-select
          v-if="!isDetail"
          name="PackId"
          v-model="form.PackId"
          filterable
        >
          <el-option
            v-for="item in packList"
            :key="item.value"
            :value="item.Id"
            :label="item.Value"
          ></el-option>
        </el-select>
        <span v-else>{{form.PackName}}</span>
      </el-form-item>
      <el-form-item
        label="管理员账号："
        prop="LoginId"
      >
        <!-- <el-input name="LoginId" v-if="!isDetail" v-model="form.LoginId"></el-input> -->
        <span>{{form.AdministratorId}}</span>
      </el-form-item>
      <el-form-item
        label="所属地区："
        prop="selectArea"
        class="is-required"
      >
        <el-cascader
          v-if="!isDetail"
          ref="cascader1"
          v-model="form.selectArea"
          :options="$store.getters.areas"
          filterable
          @change="adressChange1"
          class="w-238"
        ></el-cascader>
        <span v-else>{{form.AddressExt}}</span>
      </el-form-item>
      <el-form-item
        label="详细地址："
        prop="Address"
      >
        <el-input
          name="Address"
          v-if="!isDetail"
          v-model="form.Address"
          @blur="form.Address=form.Address.trim()"
        ></el-input>
        <span v-else>{{form.Address}}</span>
      </el-form-item>
      <el-form-item
        label="营业执照："
        prop="BusinessLicense"
      >
        <el-input
          name="BusinessLicense"
          v-if="!isDetail"
          v-model="form.BusinessLicense"
          @blur="form.BusinessLicense=form.BusinessLicense.trim()"
        ></el-input>
        <span v-else>{{form.BusinessLicense}}</span>
      </el-form-item>
      <el-form-item
        label="集团电话："
        prop="Phone"
      >
        <el-input
          name="Phone"
          v-if="!isDetail"
          v-model="form.Phone"
          @blur="form.Phone=form.Phone.trim()"
        ></el-input>
        <span v-else>{{form.Phone}}</span>
      </el-form-item>
      <el-form-item
        label="联系人："
        prop="Contact"
      >
        <el-input
          name="Contact"
          v-if="!isDetail"
          v-model="form.Contact"
          @blur="form.Contact=form.Contact.trim()"
        ></el-input>
        <span v-else>{{form.Contact}}</span>
      </el-form-item>
      <el-form-item
        label="联系人手机："
        prop="Mobile"
      >
        <el-input
          name="Mobile"
          v-if="!isDetail"
          v-model="form.Mobile"
          @blur="form.Mobile=form.Mobile.trim()"
        ></el-input>
        <span v-else>{{form.Mobile}}</span>
      </el-form-item>
      <el-form-item
        label="QQ："
        prop="QQ"
      >
        <el-input
          name="QQ"
          v-if="!isDetail"
          v-model="form.QQ"
        ></el-input>
        <span v-else>{{form.QQ}}</span>
      </el-form-item>
      <el-form-item
        label="微信："
        prop="Wechart"
      >
        <el-input
          name="Wechart"
          v-if="!isDetail"
          v-model="form.Wechart"
        ></el-input>
        <span v-else>{{form.Wechart}}</span>
      </el-form-item>
      <el-form-item
        label="邮箱："
        prop="Email"
      >
        <el-input
          name="Email"
          v-if="!isDetail"
          v-model="form.Email"
        ></el-input>
        <span v-else>{{form.Email}}</span>
      </el-form-item>
      <el-form-item
        label="银行账号："
        prop="AccountCode"
      >
        <el-input
          name="AccountCode"
          v-if="!isDetail"
          v-model="form.AccountCode"
        ></el-input>
        <span v-else>{{form.AccountCode}}</span>
      </el-form-item>
      <el-form-item
        label="开户行："
        prop="BankName"
      >
        <el-input
          name="BankName"
          v-if="!isDetail"
          v-model="form.BankName"
        ></el-input>
        <span v-else>{{form.BankName}}</span>
      </el-form-item>
      <el-form-item
        label="开户人："
        prop="Surname"
      >
        <el-input
          name="Surname"
          v-if="!isDetail"
          v-model="form.Surname"
        ></el-input>
        <span v-else>{{form.Surname}}</span>
      </el-form-item>
      <el-form-item
        label="集团简介："
        prop="Introduction"
      >
        <el-input
          name="Introduction"
          v-if="!isDetail"
          class="w-238"
          v-model="form.Introduction"
          type="textarea"
        ></el-input>
        <span v-else>{{form.Introduction}}</span>
      </el-form-item>
      <el-form-item
        class="relation-css"
        label="关联商户："
      >
        <template>
          <el-button
            name="choseCompany"
            v-if="!isDetail"
            type="text"
            @click="choseCompany(true)"
          >选择</el-button>
          <el-table
            v-loading="isLoading"
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
              width="160"
              prop="CreateTime"
            >
              <template slot-scope="scoped">{{scoped.row.CreateTime | filterDate}}</template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="地区"
              width="200"
              prop="AddressExt"
              :formatter="formatter"
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
            <el-table-column
              v-if="!isDetail"
              label="操作"
            >
              <template slot-scope="scoped">
                <el-button
                  name="cancelRelation"
                  v-if="scoped.row.MapType === groupCompanyMapType.Relation"
                  type="text"
                  @click="cancelRelation($event,scoped.row.CompanyId, scoped.$index)"
                >取消关联</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button
          name="onSubmit"
          v-if="!isStopGroup"
          type="primary"
          @click="onSubmit('form')"
        >{{isDetail? '编辑': '保存'}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="关联商户"
      :visible.sync="dialogFormVisible"
      width="1024px"
    >
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
                  ref="cascader2"
                  :options="$store.getters.areas"
                  filterable
                  change-on-select
                  placeholder="选择地区"
                ></el-cascader>
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
                name="onSearch"
                type="primary"
                @click="onSearch"
              >搜索</el-button>
              <el-button
                name="onReset"
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
            width="200"
            prop="CreateTime"
          >
            <template slot-scope="scoped">{{scoped.row.CreateTime | filterDate}}</template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="地区"
            width="200"
            prop="AddressExt"
            :formatter="formatter"
          ></el-table-column>
          <el-table-column
            label="门店数量"
            prop="StoreAmount"
          ></el-table-column>
          <el-table-column
            label="状态"
            prop="State"
            :formatter="formatter"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
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
    </el-dialog>
  </div>
</template>
<script>
import { SETTING_GROUP } from '@/configs/filePaths.js'
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { EnableState, CharacterType, YNStatus } from '@/enums/common.js'
import { GroupCompanyMapType } from '@/enums/merchant.js'
import {
  MERCHANT_API_GROUP_BASIC_GET, // 集团服务 - 加载
  MERCHANT_API_GROUP_BASIC_UPDATE, // 集团服务 - 更新
  MERCHANT_API_GROUP_BASIC_MAPS, // 集团服务 - 关联商户
  MERCHANT_API_GROUP_BASIC_CANCELMAPS, // 集团服务 - 取消关联商户
  MERCHANT_API_COMPANY_BASIC_GETS, // 商户服务 - 检索
  MERCHANT_API_DROPDOWN_PACKBASICLIST, // 套餐 - 列表(下拉)
  MERCHANT_API_COMPANY_BASIC_GETMAPS // 集团加载 - 关联商户列表
} from '@/apis/merchant.js'

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
      imageUrl: '',
      formData: {
        Area: ['', '', ''],
        CompanyCode: '',
        CompanyName: '',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      rules: {
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
        PackId: [
          {
            required: true,
            message: '类型/套餐不能为空！',
            trigger: 'blur'
          }
        ],
        LoginId: [
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
          // { required: true, message: "初始密码不能为空！", trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '密码5-20个字符',
            trigger: 'blur'
          }
        ],
        ProvinceId: [
          {
            required: true,
            message: '所属地区不能为空！',
            trigger: 'change'
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
        Phone: [
          {
            required: true,
            message: '集团电话不能为空！',
            trigger: 'blur'
          }
          // { validator: phone, trigger: 'blur'}
        ],
        selectArea: [
          {
            validator: (rule, value, callback) => {
              if (!value || !value[0] || !value[0].length) {
                callback('请选择所属地区')
              }
              callback()
            },
            trigger: 'change'
          }
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
      packList: [],
      form: {
        GroupCode: '',
        GroupName: '',
        ShortName: '',
        LoginId: '',
        Password: '',
        Address: '',
        selectArea: [],
        BusinessLicense: '',
        CompanyBasics: [],
        Phone: '',
        Contact: '',
        Mobile: '',
        QQ: '',
        Wechart: '',
        Email: '',
        AccountCode: '',
        BankName: '',
        Surname: '',
        Introduction: '',
        PackName: ''
      },
      ProvinceId: [],
      shopData: [],
      State: EnableState,
      groupCompanyMapType: GroupCompanyMapType,
      tableData: [],
      CharacterType,
      isDetail: true,
      dialogFormVisible: false,
      cities: '',
      isTemporary: false,
      temporaryImg: '',
      isStopGroup: false,
      isLoading: false
    }
  },
  created() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    if (this.$route.query.state === '2') {
      this.isDetail = false
    }
    if (this.$route.query.isStopGroup === 'true') {
      this.isStopGroup = true
    }
    this.getList()
    this.getCompany()
  },
  methods: {
    getPackList(id) {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: this.CharacterType.Group
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.packList = res.data.Data.Rows
          this.form.PackId = id
          this.getPackName(id)
        }
      })
    },
    getPackName(id) {
      // 获取套餐name
      this.packList.forEach(item => {
        if (item.Id == id) {
          this.form.PackName = item.Value
          this.$set(this.form, 'PackName', this.form.PackName)
        }
      })
    },
    onSearch() {
      // 搜索相关
      this.formData.PageIndex = 1
      this.choseCompany()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.choseCompany()
    },
    getList() {
      this.uploadImgLoading = true
      MERCHANT_API_GROUP_BASIC_GET({
        GroupId: this.$route.query.GroupId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.form = Object.assign({}, this.form, res.data.Data)
          this.form.ImageHiddenUrl = this.form.ImageUrl
          this.form.PackId = ''
          this.form.AddressExt =
            res.data.Data.ProvinceName +
            '、' +
            res.data.Data.CityName +
            '、' +
            res.data.Data.TownName
          this.form.LoginId = res.data.Data.AdministratorId
          // 地址赋值
          this.$set(this.form, 'selectArea', [
            this.form.ProvinceId.toString(),
            this.form.CityId.toString(),
            this.form.TownId.toString()
          ])
          this.getPackList(res.data.Data.PackId)
        }
        this.uploadImgLoading = false
      })
    },
    getCompany() {
      this.isLoading = true
      // 获取集团所有关联的商户
      let obj = {
        PageIndex: 1,
        PageSize: 10000,
        GroupId: this.$route.query.GroupId,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        MapType: 0
      }
      MERCHANT_API_COMPANY_BASIC_GETMAPS(obj)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.form.CompanyBasics = res.data.Data.Rows || []
          }
          this.isLoading = false
        })
        .catch(() => (this.isLoading = false))
    },
    // 保存修改
    onSubmit(formData) {
      if (!this.isDetail) {
        this.$refs[formData].validate(valid => {
          if (valid) {
            delete this.form.CompanyBasics
            MERCHANT_API_GROUP_BASIC_UPDATE(this.form).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.isTemporary = false
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.$router.push({
                  path: '/setter/group/index'
                })
              }
            })
          }
        })
      } else {
        this.$router.push({
          path: `/setter/group/edit?GroupId=${
            this.$route.query.GroupId
          }&state=2`
        })
        this.isDetail = false
      }
    },
    formatter(row, col) {
      var value = null
      switch (col.property) {
        case 'AddressExt':
          value = row.ProvinceName + '、' + row.CityName + '、' + row.TownName
          break
        case 'State':
          value = this.State.Types[row.State]
          break
        default:
          value = row[col.property]
          break
      }
      return value
    },
    // 关联商户
    choseCompany() {
      this.dialogFormVisible = true
      this.$store.commit('SET_TB_LOADING', true)
      const { Area } = this.formData
      const param = Object.assign({}, this.formData, {
        ProvinceId: +Area[0],
        CityId: +Area[1] || 0,
        TownId: +Area[2] || 0
      })
      MERCHANT_API_COMPANY_BASIC_GETS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.shopData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
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
        let CompanyLists = []
        CompanyLists.push(this.shopData[i].CompanyId)
        let obj = Object.assign(
          {},
          {
            GroupId: parseInt(this.$route.query.GroupId)
          },
          {
            CompanyIds: CompanyLists
          }
        )
        MERCHANT_API_GROUP_BASIC_MAPS(obj).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '添加商户成功',
              type: 'success'
            })
            this.form.CompanyBasics.push(this.shopData[i])
          }
        })
      }
    },
    adressChange1() {
      var cityName = this.$refs.cascader1.currentLabels
      var cityIds = this.$refs.cascader1.currentValue

      this.form.ProvinceId = cityIds[0]
      this.form.CityId = cityIds[1]
      this.form.TownId = cityIds[2]

      this.form.ProvinceName = cityName[0]
      this.form.CityName = cityName[1]
      this.form.TownName = cityName[2]
    },
    // 翻页
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
          MERCHANT_API_GROUP_BASIC_CANCELMAPS(
            Object.assign(
              {},
              {
                CompanyIds: CompanyLists,
                GroupId: parseInt(this.$route.query.GroupId)
              }
            )
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '取消关联成功!'
              })
              this.form.CompanyBasics.splice(i, 1)
            }
          })
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
        this.getCompany()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  // background: #4C4C4C;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #a6965b;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}

.company-logo {
  // position: absolute;
  // left: 0px;
  // top: 0px;
  text-align: center;
  width: 100px;
  margin-left: 80px;
}
.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #4c4c4c;
  line-height: 100px;
}
.bg-logo {
  color: #a6965b;
  font-size: 28px;
}
.to-center {
  margin: 0 auto;
}
.w400 {
  width: 400px;
}
.m-l-120 {
  margin-left: 120px;
}
.btn-w {
  width: 200px;
}
.w-238 {
  width: 238px;
}
</style>
<style lang="scss">
.el-form-item {
  margin-bottom: 10px;
}
.relation-css .el-form-item__content {
  line-height: 1;
}
.relation-css .el-table__empty-block {
  display: none;
}
.w815 {
  width: 815px;
}

.dialog-content-p .el-dialog--center .el-dialog__body {
  padding: 20px;
  height: 350px;
  overflow: auto;
}
</style>

