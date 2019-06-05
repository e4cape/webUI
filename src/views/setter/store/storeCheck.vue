<template>
  <div class="content">
    <div class="tabs">
      <span
        class="tab"
        :class="{'active': activeIndex == 0}"
        @click="activeIndex = 0"
      >基础资料</span>
      <span
        class="tab"
        :class="{'active': activeIndex == 1}"
        @click="activeIndex = 1"
      >账户余额</span>
      <span
        class="tab"
        :class="{'active': activeIndex == 2}"
        @click="activeIndex = 2"
      >开通日志</span>
    </div>
    <div class="panel">
      <el-row v-if="activeIndex == 0">
        <el-col :span="12">
          <el-form
            label-position="right"
            label-width="113px"
            :model="form"
          >
            <el-form-item
              label="归属公司："
              prop="CompanyId"
              v-if="this.$store.getters.user_session.CharacterType != characterType.Company"
            >
              <el-select
                name="CompanyName"
                v-model="form.CompanyId"
                disabled
                filterable
              >
                <el-option
                  v-for="item in  $store.getters.company_and_stores"
                  :key="item.Id"
                  :label="item.Value"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="门店编码："
            >
              <span>{{form.StoreCode}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="门店名称："
            >
              <span>{{form.StoreName}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="门店简称："
            >
              <span>{{form.ShortName}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="门店类型："
            >
              <span>{{storeType.Types[form.StoreType]}}</span>
            </el-form-item>
            <el-form-item
              v-if="form.StoreType > storeType.Direct"
              class="my-form-item"
              label="所属加盟商："
            >
              <span>{{form.PartnerName}}</span>
            </el-form-item>
            <el-form-item label="类型/套餐：">
              <span>{{form.PackName}}</span>
            </el-form-item>
            <el-form-item label="系统版本：">
              <span class="m-r-5">{{StorePackageType.Types[form.PackageType]}}</span>
              <span v-if="form.PackageType == StorePackageType.Date || form.PackageType == StorePackageType.Try">{{form.Expireb | filterDate}}~{{form.Expiree | filterDate}}</span>
              <span
                class="m-l-5"
                v-if="form.PackageType == StorePackageType.Date"
              >金额：{{$root.toFloat(form.Price)}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="开店时间："
            >
              <span>{{form.OpenTime | filterDate}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="管理员账户："
            >
              <span>{{form.AdministratorId}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="所属区域："
            >
              <span>{{form.ProvinceName + form.CityName + form.TownName}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="详细地址："
            >
              <span>{{form.Address}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="营业执照："
            >
              <span>{{form.BusinessLicense}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="主营品类："
            >
              <el-checkbox-group
                name="FlagshipType"
                v-model="form.FlagshipType"
                cla
              >
                <el-checkbox
                  v-for="(item,index) in storeBasicFlagshipType.Types"
                  :key="index"
                  :label="item"
                  disabled
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="销售方式："
            >
              <el-radio-group
                name="BusinessType"
                v-model="form.BusinessType"
              >
                <el-radio
                  v-for="(item,index) in storeBasicBusinessType.Types"
                  :key="index"
                  :label="index"
                  disabled
                >{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="门店电话："
            >
              <span>{{form.Phone}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="联系人："
            >
              <span>{{form.Contact}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="联系人手机："
            >
              <span>{{form.Mobile}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="QQ："
            >
              <span>{{form.QQ}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="微信："
            >
              <span>{{form.Wechart}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="邮箱："
            >
              <span>{{form.Email}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="银行账号："
            >
              <span>{{form.AccountCode}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="开户行："
            >
              <span>{{form.BankName}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item"
              label="开户人："
            >
              <span>{{form.Surname}}</span>
            </el-form-item>
            <el-form-item
              class="my-form-item wrap"
              label="门店简介："
            >
              <span>{{form.WxNote}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col
          :span="12"
          class="tc"
        >
          <div class="logoImg">
            <img
              v-if="form.ImageUrl"
              :src="$root.settings.DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0')"
              style="width: 240px;"
            >
          </div>
          <div
            class="logoImg"
            v-if="multiType == companyBasicMountType.Store"
          >
            <img
              v-if="form.CSWXUrl"
              :src="$root.settings.DOMAIN_IMG_FILE + form.CSWXUrl.replace('{0}', '300x300')"
              style="width: 190px;"
            >
          </div>
        </el-col>
      </el-row>
      <div
        class="valid"
        v-if="activeIndex == 1"
      >
        <div class="lable-checkStore">
          <span>消费余额：</span>
          <span>{{$root.toFloat(detailSumm.ValidCash)}}</span>
        </div>
        <div class="lable-checkStore">
          <span>赠送余额：</span>
          <span>{{$root.toFloat(detailSumm.ValidFree)}}</span>
        </div>
      </div>
      <div v-if="activeIndex == 2">
        <el-table
          :data="openLogData"
          v-loading="$store.getters.is_loading"
          @sort-change="sortChange"
          id="pricelist"
        >
          <el-table-column
            prop="CreateTime"
            label="操作时间"
            sortable="custom"
          >
            <template slot-scope="scope">
              <div>{{scope.row.CreateTime | filterDateMinutes}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateUser"
            label="操作人"
          ></el-table-column>
          <el-table-column
            prop="PackageType"
            label="开通方式"
            min-width="120"
          >
            <template slot-scope="scope">{{StorePackageType.Types[scope.row.PackageType]}}</template>
          </el-table-column>
          <el-table-column
            label="开通时间"
            prop="Expireb"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                style="margin-left: 5px"
                v-if="scope.row.PackageType == StorePackageType.Date || scope.row.PackageType == StorePackageType.Try"
              >{{ scope.row.Expireb | filterDate}}--{{ scope.row.Expiree | filterDate}}</span>
              <span
                style="margin-left: 5px"
                v-else
              >--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="Price"
            label="金额"
          >
            <template slot-scope="scope">{{scope.row.PackageType == StorePackageType.Date ? $root.toFloat(scope.row.Price) : '--'}}</template>
          </el-table-column>
        </el-table>
        <!-- @module 分页组件 -->
        <pagination
          :pg="pg"
          :size="size"
          :total="total"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></pagination>
        <!-- End 分页组件 -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  MERCHANT_API_STORE_BASIC_REQ, //  门店基本资料 - 检索
  MERCHANT_API_DROPDOWN_PACKBASICLIST, // 套餐 - 列表(下拉)
  MERCHANT_API_SECURITY_CPACK_LOG_GETS // 套餐开通日志 - 检索
} from '@/apis/merchant'
import {
  MARKETING_API_BALANCE_STORE_GET // 账户余额(详细)
} from '@/apis/marketing'

import { CharacterType, YNStatus, StoreType } from '@/enums/common'
import { StorePackageType } from '@/enums/marketing'
import {
  CompanyBasicMountType,
  StoreBasicBusinessType,
  StoreBasicFlagshipType
} from '@/enums/merchant'

import pagination from '@/components/pagination'
export default {
  data() {
    return {
      characterType: CharacterType,
      StorePackageType,
      storeType: StoreType,
      companyBasicMountType: CompanyBasicMountType,
      storeBasicBusinessType: StoreBasicBusinessType, // 销售方式
      storeBasicFlagshipType: StoreBasicFlagshipType, // 主营品类
      flagshipType: [],
      storeId: '',
      characterId: '',
      multiType: '',
      activeIndex: 0,
      detailSumm: {},
      form: {}, // 接收表单里面的参数
      rules: {}, // 接收表单验证的规则
      options: [],
      companyList: [], // 公司列表
      packBasicList: [],
      openLogData: [],
      pg: 1,
      size: 20,
      IsAsced: YNStatus.No,
      OrderBy: 0,
      total: 0
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.characterId = query.characterId
      this.multiType = query.type
      this.storeId = query.id
      if (!this.storeId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError() {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/setter/store/index'
        })
      })
    },
    getPackBasicList() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Store
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let packBasicList = []
          res.data.Data &&
            res.data.Data.Rows.forEach(item => {
              if (
                item.MultiType == this.$store.getters.wechatSettingType ||
                this.$store.getters.wechatSettingType == 0
              ) {
                packBasicList.push(item)
              }
            })
          this.packBasicList = packBasicList
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getBalanceDetail() {
      MARKETING_API_BALANCE_STORE_GET({
        CharacterId:
          this.$store.getters.user_session.CharacterType != CharacterType.Store
            ? this.characterId
            : 0
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detailSumm = res.data.Data
        }
      })
    },
    getDetail() {
      MERCHANT_API_STORE_BASIC_REQ({
        StoreId: this.storeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.form.BusinessType = this.form.BusinessType + ''
          this.$set(
            this.form,
            'sysPackTime',
            res.data.Data.Expireb
              ? [res.data.Data.Expireb, res.data.Data.Expiree]
              : []
          )
          this.form.FlagshipType = this.form.FlagshipType.split(',')
        }
      })
    },
    getOpenLog() {
      MERCHANT_API_SECURITY_CPACK_LOG_GETS({
        CharacterId: this.characterId,
        PageIndex: this.pg,
        PageSize: this.size,
        OrderBy: this.OrderBy,
        IsAsced: this.IsAsced
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count || 0
          this.openLogData = res.data.Data.Rows
        }
      })
    },
    sortChange(sort) {
      // 排序字段(0=操作时间)
      switch (sort.prop) {
        case 'SignedTime':
          this.OrderBy = 0
          break
        default:
          this.OrderBy = 0
          break
      }
      this.IsAsced = sort.order === 'ascending' ? YNStatus.No : YNStatus.Yes
      this.pg = 1
      this.getOpenLog()
    },
    currentChange(val) {
      // 切换当前页
      this.pg = val
      this.getOpenLog()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pg = 1
      this.size = val
      this.getOpenLog()
    },
    activeIndexChange() {
      if (this.activeIndex == 1 && !this.detailSumm.ValidCash) {
        this.getBalanceDetail()
      } else if (this.activeIndex == 2 && !this.openLogData.length) {
        this.getOpenLog()
      }
    }
  },
  mounted() {
    this.getPackBasicList()
    this.init()
    this.$store.getters.user_session.CharacterType == CharacterType.Lingcb &&
      this.$store.dispatch('GET_COMPANYS_DROPLIST')
  },
  watch: {
    activeIndex: 'activeIndexChange'
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-right: 10px;
}
.valid {
  line-height: 30px;
  padding: 0 10px;
  color: #333;
}
.panel {
  padding-top: 10px;
}
.init-margin /deep/ .el-radio + .el-radio {
  margin-left: 10px;
}
.wrap /deep/ .el-form-item__content {
  word-break: break-all;
}
.logoImg {
  margin-top: 40px;
}
</style>
