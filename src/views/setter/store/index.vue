<template>
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-dropdown @command="selectState">
              <el-button type="default">
                {{storeBasicState.Types[form.State] || '所有状态'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="item in storeBasicState.TypeArray" :key="item.KeyId" :command="item.KeyId">{{item.Value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item prop="StoreCode">
            <el-input name="StoreCode" v-model="form.StoreCode" placeholder="请输入门店编码" @keyup.enter.native="onSearch">
              <el-button name="search" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="地区：" prop="Area">
            <el-cascader filterable :options="$store.getters.areas" change-on-select ref="cascader" v-model="form.Area" placeholder="选择地区"></el-cascader>
          </el-form-item>
          <el-form-item label="门店编码：" prop="StoreCode">
            <el-input name="StoreCode" v-model="form.StoreCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：" prop="StoreName">
            <el-input name="StoreName" v-model="form.StoreName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="开店时间：" prop="OpenTime">
            <el-date-picker
              name="OpenTime"
              type="daterange"
              v-model="form.OpenTime"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :unlink-panels="true"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="归属公司：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="CompanyId">
            <el-select filterable name="CompanyId" v-model="form.CompanyId" placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in $store.getters.company_and_stores" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司编码：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="CompanyCode">
            <el-input name="CompanyCode" v-model="form.CompanyCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="系统版本：" prop="PackageType">
            <el-select name="PackageType" v-model="form.PackageType" filterable placeholder="全部">
              <el-option v-for="item in storePackageType.TypeArray" :key="item.KeyId" :label="item.Value" :value="+item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店类型：" prop="StoreType">
            <el-select name="PackageType" v-model="form.StoreType" filterable placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in storeType.TypeArray" :key="item.KeyId" :label="item.Value" :value="+item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收银台：" prop="CashierAmount">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="CashierAmount1" class="inline no-margin">
                  <el-input name="CashierAmount1" v-model="form.CashierAmount1" @keyup.native="form.CashierAmount1 = form.CashierAmount1.replace(/\D/g, '')" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="tc">-</el-col>
              <el-col :span="11">
                <el-form-item prop="CashierAmount2" class="inline no-margin">
                  <el-input name="CashierAmount2" v-model="form.CashierAmount2" @keyup.native="form.CashierAmount2 = form.CashierAmount2.replace(/\D/g, '')" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="类型/套餐：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="PackId">
            <el-select name="PackId" v-model="form.PackId" clearable placeholder="请选择" filterable>
              <el-option label="全部" value></el-option>
              <el-option v-for="item in packList" :key="item.value" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
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
          <el-form-item label="到期日期：" prop="Expiree">
            <el-date-picker
              name="Expiree"
              type="daterange"
              v-model="form.Expiree"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column show-overflow-tooltip prop="StoreCode" label="门店编码" min-width="100" sortable="custom" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="StoreName" label="门店名称" min-width="100" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="StoreName" label="门店类型" min-width="100" fixed>
        <template slot-scope="scope">{{storeType.Types[scope.row.StoreType]}}</template>
        </el-table-column>
      <el-table-column show-overflow-tooltip prop="PackName" label="类型/套餐" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PackageType" label="系统版本" min-width="100">
        <template slot-scope="scope">{{storePackageType.Types[scope.row.PackageType]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="到期日期" min-width="100" sortable="custom">
        <template slot-scope="scope">{{ scope.row.Expiree | filterDate }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="CreateTime" label="创建时间" min-width="100" sortable="custom">
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDate }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="OpenTime" label="开店时间" min-width="100" sortable="custom">
        <template slot-scope="scope">{{ scope.row.OpenTime | filterDate }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" label="公司编码" min-width="200" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyName" label="归属公司" min-width="200" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ProvinceName" label="地区" min-width="100">
        <template slot-scope="scope">{{scope.row.ProvinceName + scope.row.CityName + scope.row.TownName}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="CashierAmount" label="收银台" min-width="70"></el-table-column>
      <el-table-column show-overflow-tooltip prop="State" label="状态" min-width="80" fixed="right">
        <template slot-scope="scope">{{storeBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column label="操作" :min-width="$store.getters.user_session.CharacterType == characterType.Lingcb ? '200' : '50'" fixed="right">
        <template slot-scope="scope">
          <router-link
            name="storeCheckLink"
            :to="{path:'/setter/store/storeCheck',query:{id:scope.row.StoreId, characterId: scope.row.CharacterId, type: scope.row.MountWechat}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <template v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
            <router-link name="storeEditLink" :to="{path:'/setter/store/storeEdit',query:{id:scope.row.StoreId, type: scope.row.MountWechat}}" class="btn-link el-button el-button--text">修改</router-link>
            <el-button name="storeOpen" type="text" class="btn-link" @click="storeOpen($event,scope.row.StoreId)" v-if="scope.row.State === storeBasicState.Close">开业</el-button>
            <el-button name="storeStop" type="text" class="btn-link" @click="storeStop($event,scope.row.StoreId)" v-if="scope.row.State === storeBasicState.Open">停业</el-button>
            <el-button name="insertPassportBefore" type="text" class="btn-link" @click="insertPassportBefore(scope.row)">重置密码</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <pagination :pg="form.PageIndex" :size="form.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页组件 -->
    <!-- End Panel -->
    <!-- End 分页组件 -->
    <el-dialog title="重置管理员密码" width="500px" :visible.sync="visible" custom-class="department-dialog">
      <el-form @submit.native.prevent label-width="110px" :model="row" ref="form">
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="row.AdministratorId" label="管理员账号：" prop="Department">
              <span>{{row.AdministratorId}}</span>
            </el-form-item>
            <el-form-item label="新密码：" prop="Department">
              <input name="newPassword" type="password" style="width: 0; height:0; display:none;" disabled>
              <el-input name="loginpass" type="password" autocomplete="new-password" v-model="loginpass" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="resetConfirm" type="primary" :loading="$store.getters.is_loading" @click="insertPassport($event)">确 定</el-button>
        <el-button name="resetCancel" @click="visible =  false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  MERCHANT_API_STORE_BASIC_GETS, // 门店基本资料 - 检索
  MERCHANT_API_STORE_BASIC_OPEN, //  门店基本资料 - 开业
  MERCHANT_API_STORE_BASIC_CLOSE, // 门店基本资料 - 停业
  MERCHANT_API_DROPDOWN_PACKBASICLIST, //  套餐 - 列表(下拉)
  MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT //  用户账号服务 - 修改密码(平台)
} from '@/apis/merchant'

import { CharacterType, YNStatus, StoreType } from '@/enums/common'
import { CompanyBasicMountType, StoreBasicState } from '@/enums/merchant'
import { StorePackageType } from '@/enums/marketing'

import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
export default {
  data () {
    return {
      characterType: CharacterType,
      storeBasicState: StoreBasicState,
      companyBasicMountType: CompanyBasicMountType,
      storeType: StoreType,
      // paymentSettingType: '',
      wechatSettingType: '',
      form: {
        // 门店查询表单
        OpenTime: [],
        CreateTime: [],
        Expiree: [],
        Area: ['', '', ''],
        CompanyId: 0,
        CompanyCode: '',
        StoreCode: '',
        StoreName: '',
        PageIndex: 1,
        PageSize: 20,
        State: '',
        PackId: '',
        IsAsced: YNStatus.No,
        OrderBy: 0,
        StoreType: 0,
        CashierAmount1: '',
        CashierAmount2: '',
        PackageType: 0,
        PerformanceCloudPackageType: '',
        ScoringCloudPackageType: '',
        MessageCloudPackageType: '',
        StockingCloudPackageType: ''
      },
      parameter: {},
      total: 0,
      data: [],
      visible: false,
      loginpass: '',
      row: {},
      packList: [], // 套餐列表
      storePackageType: StorePackageType,
      packageTypes: StorePackageType.Types
    }
  },
  methods: {
    init () {
      let query = this.$route.query
      this.parameter.OpenTime = query.OpenTime || []
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.Expiree = query.Expiree || []
      this.parameter.Area = query.Area || [0, 0, 0]
      this.parameter.CompanyId = +query.CompanyId || 0
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.StoreCode = query.StoreCode || ''
      this.parameter.StoreName = query.StoreName || ''
      this.parameter.StoreType = query.StoreType || 0
      this.parameter.PackId = query.PackId || ''
      this.parameter.CashierAmount1 = query.CashierAmount1 || ''
      this.parameter.CashierAmount2 = query.CashierAmount2 || ''
      this.parameter.PackageType = +query.PackageType || 0
      this.parameter.PerformanceCloudPackageType =
        query.PerformanceCloudPackageType || ''
      this.parameter.ScoringCloudPackageType =
        query.ScoringCloudPackageType || ''
      this.parameter.MessageCloudPackageType =
        query.MessageCloudPackageType || ''
      this.parameter.StockingCloudPackageType =
        query.StockingCloudPackageType || ''
      this.parameter.OrderBy = query.OrderBy || 0
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.State = query.State > 0 ? query.State : 0
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    // 获取门店信息
    getData () {
      this.$store.commit('SET_TB_LOADING', true)
      const { OpenTime, CreateTime, Expiree, Area } = this.parameter
      let parameter = Object.assign(this.form, this.parameter, {
        OpenTime1: OpenTime[0],
        OpenTime2: OpenTime[1],
        CreateTime1: CreateTime[0],
        CreateTime2: CreateTime[1],
        Expiree1: Expiree[0],
        Expiree2: Expiree[1],
        ProvinceId: Area[0],
        CityId: Area[1],
        TownId: Area[2],
        OrderBy: this.form.OrderBy
      })
      MERCHANT_API_STORE_BASIC_GETS(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 查询门店信息
    onSearch () {
      this.form.PageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.form))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    selectState (value) {
      this.form.State = value
      this.onSearch()
    },
    insertPassportBefore (row) {
      this.row = row
      this.visible = true
    },
    insertPassport (e) {
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
    // 重置查询表单
    onReset () {
      this.$refs.search.resetFields()
      this.onSearch()
    },
    getPackList () {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Store
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packList = res.data.Data.Rows
        }
      })
    },
    currentChange (val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange (val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    sortChange (sort) {
      // (0=创建时间,1=开店日期,2=门店编码,3=到期日期)
      switch (sort.prop) {
        case 'CreateTime':
          this.form.OrderBy = 0
          break
        case 'OpenTime':
          this.form.OrderBy = 1
          break
        case 'StoreCode':
          this.form.OrderBy = 2
          break
        case 'Expiree':
          this.form.OrderBy = 3
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
    // 开业
    storeOpen (e, storeId) {
      e.currentTarget.blur()
      this.$confirm('是否将该门店开业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_STORE_BASIC_OPEN({
            StoreId: storeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('开业成功')
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => { })
    },
    // 停业
    storeStop (e, storeId) {
      e.currentTarget.blur()
      this.$confirm('是否将该门店停业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_STORE_BASIC_CLOSE({
            StoreId: storeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('停业成功')
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => { })
    },
    initRoute () {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    }
  },
  mounted () {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.$store.getters.user_session.CharacterType == CharacterType.Lingcb &&
      this.$store.dispatch('GET_COMPANYS_DROPLIST')
    this.getPackList()
    this.$store.getters.user_session.CharacterType !== CharacterType.Store
      ? this.init()
      : this.$router.back()
  },
  components: {
    pagination,
    searchPanel
  },
  watch: {
    $route: 'init'
  }
}
</script>
<style lang="scss">
@import '../../../assets/sass/system.scss';
</style>

