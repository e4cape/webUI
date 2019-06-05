<template>
  <div class="content">
    <!-- @module Panel -->
    <el-form
      :model="form"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"
              type="primary"
              @click="$router.push({path: '/setter/company/companyCreate'})"
            >新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-dropdown @command="selectState">
              <el-button type="default">
                {{EnableState.Types[form.State] || '所有状态'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">所有状态</el-dropdown-item>
                <el-dropdown-item
                  v-for="item in EnableState.TypeArray"
                  :key="item.KeyId"
                  :command="item.KeyId"
                >{{item.Value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item prop="CompanyCode">
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
              placeholder="请输入公司编码"
              @keyup.enter.native="onSearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            prop="Area"
            label="地区："
          >
            <el-cascader
              filterable
              :options="$store.getters.areas"
              change-on-select
              ref="cascader"
              v-model="form.Area"
              placeholder="选择地区"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            prop="CompanyCode"
            label="公司编码："
          >
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
              @keyup.enter.native="onSearch"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="CompanyName"
            label="公司名称："
          >
            <el-input
              name="CompanyName"
              v-model="form.CompanyName"
              @keyup.enter.native="onSearch"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="CreateTime"
            label="创建日期："
          >
            <el-date-picker
              name="CreateTime"
              type="daterange"
              v-model="form.CreateTime"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :unlink-panels="true"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            prop="Phone"
            label="公司电话："
          >
            <el-input
              name="Phone"
              v-model="form.Phone"
              @keyup.enter.native="onSearch"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="Contact"
            label="联系人："
          >
            <el-input
              name="Contact"
              v-model="form.Contact"
              @keyup.enter.native="onSearch"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="Mobile"
            label="联系人手机："
          >
            <el-input
              name="Mobile"
              v-model="form.Mobile"
              @keyup.enter.native="onSearch"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="PackId"
            label="类型/套餐："
          >
            <el-select
              name="PackId"
              v-model="form.PackId"
              clearable
              placeholder="请选择"
              filterable
            >
              <el-option
                label="全部"
                value
              ></el-option>
              <el-option
                v-for="item in packList"
                :key="item.value"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="来源："
            prop="SourceType"
            v-if="$store.getters.user_session.CharacterType != characterType.Group"
          >
            <el-select
              name="SourceType"
              v-model="form.SourceType"
              placeholder="所有类型"
            >
              <el-option
                label="所有类型"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in companyBasicSourceType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      @sort-change="sortChange"
    >
      <el-table-column
        show-overflow-tooltip
        prop="CompanyCode"
        label="公司编码"
        min-width="120"
        sortable="custom"
        fixed
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="CompanyName"
        label="公司名称"
        min-width="100"
        fixed
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="PackName"
        label="类型/套餐"
        min-width="100"
        fixed
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="CreateTime"
        label="创建日期"
        min-width="120"
        sortable="custom"
      >
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDate }}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="Phone"
        label="公司电话"
        min-width="100"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="ProvinceName"
        label="地区"
        min-width="100"
      >
        <template slot-scope="scope">{{scope.row.ProvinceName + scope.row.CityName + scope.row.TownName}}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="Contact"
        label="联系人"
        min-width="100"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="Mobile"
        label="联系人手机"
        min-width="100"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="StoreAmount"
        label="门店数量"
        min-width="100"
      ></el-table-column>
      <el-table-column
        v-if="$store.getters.user_session.CharacterType != characterType.Group"
        show-overflow-tooltip
        prop="SourceType"
        label="来源"
        min-width="100"
      >
        <template slot-scope="scope">{{scope.row.SourceType == 0 ? '-' : companyBasicSourceType.Types[scope.row.SourceType] }}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="MountWechat"
        label="微信管理"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.MountWechat == 0 ? '' : companyBasicMountType.Company === scope.row.MountWechat ? '总部统一设置' : '在门店设置'}}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="MountPayment"
        label="支付授权"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.MountPayment == 0 ? '' : companyBasicMountType.Company === scope.row.MountPayment ? '总部统一设置' : '在门店设置'}}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="State"
        label="状态"
        min-width="80"
        fixed="right"
      >
        <template slot-scope="scope">{{ scope.row.State === EnableState.Enable ? '已启用' : '已停用'}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        :min-width="$store.getters.user_session.CharacterType == characterType.Lingcb ? '250' : '50'"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            name="companyCheckLink"
            :to="{path:'/setter/company/companyCheck',query:{id:scope.row.CompanyId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <template v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
            <router-link
              name="companyEditLink"
              :to="{path:'/setter/company/companyEdit',query:{id:scope.row.CompanyId}}"
              class="btn-link el-button el-button--text"
            >修改</router-link>
            <el-button
              type="text"
              name="storeOpenLink"
              class="btn-link"
              @click="storeOpen($event,scope.row.CompanyId)"
              v-if="scope.row.State === EnableState.Disable"
            >启用</el-button>
            <el-button
              type="text"
              name="storeStopLink"
              class="btn-link"
              @click="storeStop($event,scope.row.CompanyId)"
              v-if="scope.row.State === EnableState.Enable"
            >停用</el-button>
            <el-button
              type="text"
              name="isWechartLink"
              class="btn-link"
              @click="isWechart(scope.row)"
              v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"
            >新建门店</el-button>
            <el-button
              type="text"
              name="insertPassportBeforeLink"
              class="btn-link"
              @click="insertPassportBefore(scope.row)"
            >重置密码</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <pagination
      :pg="form.PageIndex"
      :size="form.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- End 分页组件 -->
    <el-dialog
      title="重置管理员密码"
      width="500px"
      :visible.sync="visible"
      custom-class="department-dialog"
    >
      <el-form
        @submit.native.prevent
        label-width="110px"
        :model="row"
        ref="form"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              v-if="row.AdministratorId"
              label="管理员账号："
              prop="Department"
            >
              <span>{{row.AdministratorId}}</span>
            </el-form-item>
            <el-form-item
              label="新密码："
              prop="Department"
            >
              <el-input
                type="password"
                v-model="loginpass"
                :maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="insertPassport"
          type="primary"
          :loading="$store.getters.is_loading"
          @click="insertPassport($event)"
        >确 定</el-button>
        <el-button
          name="cancelPassport"
          @click="visible =  false"
        >取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="在创建门店前，请完善一下信息："
      :visible.sync="createVisible"
      custom-class="create-store"
    >
      <div class="label-dialog">微信管理：</div>
      <el-radio-group
        class="radio-group-dialog"
        v-model="mountWechat"
      >
        <el-radio :label="companyBasicMountType.Store">在门店设置</el-radio>
        <el-radio :label="companyBasicMountType.Company">在总部统一设置</el-radio>
        <span>（所有门店使用同一个公众号）</span>
      </el-radio-group>
      <div class="label-dialog">支付授权：</div>
      <el-radio-group
        class="radio-group-dialog"
        v-model="mountWechat"
      >
        <el-radio :label="companyBasicMountType.Store">在门店设置</el-radio>
        <el-radio :label="companyBasicMountType.Company">在总部统一设置</el-radio>
        <span>（所有门店使用同一个支付接口）</span>
      </el-radio-group>
      <div class="label-dialog">
        <span>类型/套餐：</span>
        <el-select
          name="createStorePackId"
          v-model="createStorePackId"
          clearable
          placeholder="请选择"
          filterable
        >
          <template v-for="item in packList">
            <el-option
              :key="item.value"
              v-if="item.MultiType != mountWechat || !mountWechat"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </template>
        </el-select>
      </div>
      <div class="red-dialog m-t-10">注：以上设置在保存后不能修改，请谨慎操作！</div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="createStore"
          type="primary"
          @click="createStore"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          name="cancel"
          @click="createVisible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  MERCHANT_API_COMPANY_BASIC_GETS, // 商户服务 - 检索
  MERCHANT_API_COMPANY_BASIC_ENABLE, // 商户服务 - 启用
  MERCHANT_API_COMPANY_BASIC_DISABLE, // 商户服务 - 停用
  MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT, // 用户账号服务 - 修改密码(平台)
  MERCHANT_API_DROPDOWN_PACKBASICLIST, //  套餐 - 列表(下拉)
  MERCHANT_API_COMPANY_BASIC_UPDATEMOUNT // 商户服务 - 更新Mount
} from '@/apis/merchant'

import { CharacterType, YNStatus, EnableState } from '@/enums/common.js'
import { CompanyBasicSourceType, CompanyBasicMountType } from '@/enums/merchant'

import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      characterType: CharacterType,
      EnableState: EnableState,
      companyBasicMountType: CompanyBasicMountType,
      companyBasicSourceType: CompanyBasicSourceType,
      companyList: [], // 公司列表
      packList: [], // 套餐列表
      form: {
        // 公司查询表单
        PackId: '',
        CompanyId: '', // 商户序号
        CompanyCode: '', // 公司编码
        CompanyName: '', // 公司名称
        SourceType: 0, // 注册来源类型(枚举)
        Area: ['', '', ''], // 省市区
        Contact: '', // 联系人
        Mobile: '', // 联系人手机
        Phone: '', // 公司电话
        CreateTime: [], // 创建日期
        OrderBy: 0, // 排序字段(0=创建日期, 1=商户编码)
        IsAsced: YNStatus.No, // 是否升序(枚举)
        State: 0, // 商户状态(枚举)
        PageIndex: 1, // 当前页码
        PageSize: 20 // 每页?条
      },
      total: 0,
      parameter: {},
      row: {},
      loginpass: '',
      visible: false,
      createVisible: false,
      mountWechat: '',
      createStorePackId: '',
      tableData: []
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameter.PackId = query.PackId || ''
      this.parameter.CompanyId = query.CompanyId || ''
      this.parameter.CompanyName = query.CompanyName || ''
      this.parameter.SourceType = query.SourceType > 0 ? query.SourceType : 0
      this.parameter.Area = query.Area || ['', '', '']
      this.parameter.Contact = query.Contact || ''
      this.parameter.Mobile = query.Mobile || ''
      this.parameter.Phone = query.Phone || ''
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.OrderBy = query.OrderBy || 0
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.State = query.State > 0 ? query.State : 0
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    // 获取公司列表信息
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      const { CreateTime, Area, SourceType } = this.parameter
      let parameter = Object.assign(this.form, this.parameter, {
        CreateTime1: CreateTime[0],
        CreateTime2: CreateTime[1],
        ProvinceId: +Area[0],
        CityId: +Area[1],
        TownId: +Area[2] || 0,
        SourceType: +SourceType,
        OrderBy: this.form.OrderBy
      })
      MERCHANT_API_COMPANY_BASIC_GETS(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 查询公司信息
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.form))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    selectState(value) {
      this.form.State = value
      this.onSearch()
    },
    // 重置查询表单
    onReset() {
      this.$refs.search.resetFields()
      this.onSearch()
    },
    insertPassportBefore(row) {
      this.row = row
      this.visible = true
    },
    insertPassport(e) {
      e.currentTarget.blur()
      if (this.loginpass.length < 5 || this.loginpass.length > 20) {
        this.$message.error('密码长度为5-20位字符')
        return
      }
      this.$confirm('是否重置管理员密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT({
            CharacterId: this.row.CharacterId,
            LoginId: this.row.AdministratorId,
            Loginpass2: this.loginpass
          }).then(res => {
            this.visible = false
            if (res.data.Code === 'CORRECT') {
              this.$message.success('重置成功')
              this.loginpass = ''
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.loginpass = ''
        })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    sortChange(sort) {
      // (0= 创建日期，1=商户编码)
      switch (sort.prop) {
        case 'CreateTime':
          this.form.OrderBy = 0
          break
        case 'CompanyCode':
          this.form.OrderBy = 1
          break
        default:
          this.form.OrderBy = 0
          break
      }
      if (!sort.order) {
        this.form.IsAsced = YNStatus.No
      } else {
        this.form.IsAsced =
          sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      }
      this.onSearch()
    },
    // 开业大吉
    storeOpen(e, CompanyId) {
      e.currentTarget.blur()
      this.$confirm('是否将该公司启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_COMPANY_BASIC_ENABLE({
            CompanyId: CompanyId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('启用成功')
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    // 停业大吉
    storeStop(e, CompanyId) {
      e.currentTarget.blur()
      this.$confirm('是否将该公司停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_COMPANY_BASIC_DISABLE({
            CompanyId: CompanyId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('停用成功')
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    isWechart(row) {
      if (row.PackId && row.MountWechat && row.MountPayment) {
        this.$router.push({
          path: '/setter/store/storeCreate',
          query: {
            id: row.CompanyId,
            type: row.MountWechat,
            characterId: row.CharacterId
          }
        })
      } else {
        this.row = row
        this.createVisible = true
      }
    },
    createStore() {
      let row = this.row
      MERCHANT_API_COMPANY_BASIC_UPDATEMOUNT({
        CompanyId: row.CompanyId,
        PackId: this.createStorePackId,
        MountWechat: this.mountWechat,
        MountPayment: this.mountWechat
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push({
            path: '/setter/store/storeCreate',
            query: {
              id: row.CompanyId,
              type: row.MultiType,
              sType: this.mountWechat
            }
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    initRoute() {
      this.$router.replace({
        query: this.parameter
      })
    },
    wechatSettingTypeChange() {
      let createStorePackId = ''
      this.packList.forEach(item => {
        if (
          item.IsDefault == YNStatus.Yes &&
          this.mountWechat != item.MultiType
        ) {
          createStorePackId = item.PackId
        }
      })
      this.createStorePackId = createStorePackId
    },
    getPackList() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Company
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packList = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.getPackList()
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.$store.dispatch('GET_COMPANYS_DROPLIST', YNStatus.No)
    this.init()
  },
  components: {
    pagination,
    searchPanel
  },
  watch: {
    $route: 'init',
    mountWechat: 'wechatSettingTypeChange'
  }
}
</script>
<style lang="scss">
@import '../../../assets/sass/system.scss';
.btn-link {
  font-family: sans-serif !important;
  font-size: 12px !important;
}
</style>

