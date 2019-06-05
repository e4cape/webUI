<template>
  <div class="content">
    <ul class="tabs border-b-1px">
      <li
        class="tab"
        :class="{'active': typeList}"
        @click="changeTabs(true)"
      >类型管理</li>
      <li
        class="tab"
        :class="{'active': !typeList}"
        @click="changeTabs(false)"
      >样式管理</li>
    </ul>
    <el-table
      v-if="typeList"
      class="m-t-10"
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="ID"
        prop="TypeId"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="卡券类型"
        prop="TypeName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="可否销售"
        prop="IsSale"
        :formatter="formatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="可否转赠"
        prop="IsGive"
        :formatter="formatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="可使用人"
        prop="AvailableUsers"
        :formatter="formatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            name="btnSettingCard"
            type="text"
            @click="settingCard(scoped.row)"
          >设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <coupontemplate v-else></coupontemplate>
    <el-dialog
      title="修改类型"
      width="410px"
      :visible.sync="DaialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        :model="DaialogForm"
        :rules="rule1"
        ref="DaialogForm"
        label-width="110px"
      >
        <el-form-item label="卡券类型：">
          <span>{{DaialogForm.TypeName}}</span>
        </el-form-item>
        <el-form-item
          label="可否转赠："
          prop="IsGive"
        >
          <el-radio-group
            name="radioGroupIsGive"
            v-model="DaialogForm.IsGive"
            @change="IsShardChange"
          >
            <el-radio :label="YNStatus.Yes">是</el-radio>
            <el-radio :label="YNStatus.No">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="可使用人："
          prop="AllUser"
        >
          <el-checkbox-group
            name="checkboxGroupAllUser"
            :min="1"
            v-model="DaialogForm.AllUser"
          >
            <el-checkbox :label="CouponAvailableType.Self">领取人</el-checkbox>
            <el-checkbox
              :disabled="DaialogForm.IsGive==YNStatus.Yes"
              :label="CouponAvailableType.Other"
              v-if="DaialogForm.IsGive==YNStatus.Yes"
            >被转赠人</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnCreateCoupon"
          :loading="loadingBtn"
          type="primary"
          @click="createCoupon('DaialogForm')"
        >确定</el-button>
        <el-button
          name="btnHandleClose"
          @click="handleClose"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  SCORING_API_COUPON_SETTING_TYPE_GETS, // 优惠券 - 检索(平台端)
  SCORING_API_COUPON_SETTING_TYPE_UPDATE // 优惠券 - 更新
} from '@/apis/scoring.js'

import { YNStatus } from '@/enums/common'

import {
  CouponAvailableType,
  CouponTypeStatus,
  CouponSettingType
} from '@/enums/scoring.js'

import coupontemplate from './couponTemplate'
export default {
  components: {
    coupontemplate
  },
  data() {
    return {
      activeIndex: '1',
      form: {
        TypeName: '',
        Status: ''
      },
      tableData: [],
      page: {
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      typeList: true,
      DaialogForm: {
        TypeName: '',
        IsGive: YNStatus.Yes,
        AllUser: [CouponAvailableType.Self, CouponAvailableType.Other]
      },
      rule1: {
        TypeName: [
          {
            required: true,
            message: '卡券类型不能为空',
            trigger: 'blur'
          },
          {
            max: 8,
            message: '卡券类型长度最多8个字',
            trigger: 'blur'
          }
        ]
      },
      DaialogFormVisible: false,
      isLoading: false,
      loadingBtn: false,
      YNStatus,
      CouponAvailableType,
      CouponTypeStatus,
      currentTypeId: ''
    }
  },
  watch: {
    typeList(value) {
      if (value) {
        this.getList()
      }
    }
  },
  mounted() {
    if (this.$route.query.state == 2) {
      this.typeList = false
    }
    this.getList()
  },
  methods: {
    changeTabs(flag) {
      if (flag) {
        this.typeList = true
        this.$router.push({
          path: '/market/coupon/coupontypelist?state=1'
        })
      } else {
        this.typeList = false
        this.$router.push({
          path: '/market/coupon/coupontypelist?state=2'
        })
      }
    },
    settingCard(data) {
      this.DaialogForm.AllUser = []
      this.DaialogFormVisible = true
      this.DaialogForm.TypeName = data.TypeName
      this.DaialogForm.IsGive = data.IsGive
      data.AvailableUsers.split(',').forEach(m => {
        this.DaialogForm.AllUser.push(parseInt(m))
      })
      // this.DaialogForm.AllUser = data.AvailableUsers.split(',')
      this.currentTypeId = data.TypeId
    },
    IsShardChange(val) {
      if (val == YNStatus.Yes) {
        this.DaialogForm.AllUser = [
          CouponAvailableType.Self,
          CouponAvailableType.Other
        ]
      } else {
        this.DaialogForm.AllUser = [CouponAvailableType.Self]
      }
    },
    getList() {
      this.$store.commit('SET_TB_LOADING', true)
      let obj = Object.assign({}, this.form, this.page, {
        IsAsced: 1
      })
      SCORING_API_COUPON_SETTING_TYPE_GETS(obj).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.page.total = res.data.Data.TotalItemCount
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    Enable(id) {
      this.API_COUPON_TYPEENABLE(id).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '启用成功！'
          })
          this.getList()
        }
      })
    },
    Disable(id) {
      this.API_COUPON_TYPEDISABLE(id).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '停用成功！'
          })
          this.getList()
        }
      })
    },
    createCoupon(formName) {
      this.$refs[formName].validate(valid => {
        this.loadingBtn = true
        if (valid) {
          let obj = {}
          obj.TypeId = this.currentTypeId
          obj.TypeName = this.DaialogForm.TypeName
          obj.IsGive = this.DaialogForm.IsGive
          obj.AvailableUsers = this.DaialogForm.AllUser.join(',')
          SCORING_API_COUPON_SETTING_TYPE_UPDATE(obj).then(res => {
            this.loadingBtn = false
            if (res.data.Code == 'CORRECT') {
              this.DaialogFormVisible = false
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.$refs.DaialogForm.resetFields()
              this.$refs.DaialogForm.clearValidate()
              this.getList()
            }
          })
        } else {
          this.loadingBtn = false
        }
      })
    },
    handleClose() {
      this.$refs.DaialogForm.resetFields()
      this.DaialogFormVisible = false
      this.loadingBtn = false
      /* switch (key) {
        case value:
          break

        default:
          break
      } */
    },
    formatter(row, col) {
      switch (col.property) {
        case 'IsSale': {
          return row.TypeId == CouponSettingType.Sale
            ? YNStatus.Types[YNStatus.Yes]
            : YNStatus.Types[YNStatus.No]
        }
        case 'IsGive': {
          return YNStatus.Types[row[col.property]]
        }
        case 'AvailableUsers': {
          let arr1 = row[col.property].split(',')
          let arr2 = []
          arr1.forEach(m => {
            arr2.push(CouponAvailableType.Types[m])
          })
          return arr2.join('、')
        }
        case 'Status': {
          return CouponTypeStatus.Types[row[col.property]]
        }
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.border-b-1px {
  border-bottom: 1px solid #e5e5e5;
}
</style>

