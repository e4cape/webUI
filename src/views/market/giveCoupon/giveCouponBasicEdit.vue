<template>
  <div>
    <!-- @module Dialog·新建成品退货出库单 -->
    <el-dialog
      :title="title"
      :visible.sync="visible"
    >
      <el-form
        label-position="right"
        label-width="100px"
        :model="editForm"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item
          label="赠送原因"
          prop="settingOptionId"
        >
          <el-select
            name="selectSettingOptionId"
            v-model="editForm.settingOptionId"
            filterable
            placeholder="全部"
          >
            <el-option
              v-for="(item, index) in couponReasons"
              :key="index"
              :label="item.name"
              :value="item.settingOptionId"
            ></el-option>
          </el-select>
          <span
            name="clickReasonDialog"
            class="icon-set-item"
            @click="reasonDialog=true"
          >
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            name="inputRemark"
            type="textarea"
            v-model="editForm.remark"
            :maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnEditCoupon"
          type="primary"
          @click="editCoupon"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          name="btnCancel"
          @click="visible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品采购入库单 -->
    <!-- @module Dialog·新建赠送原因 -->
    <dict-manage
      v-if="reasonDialog"
      :dictDialog="reasonDialog"
      :dicts="couponReasons"
      :dialogTitle="'赠送原因'"
      :dictType="settingOptionTypes.GiveCouponCause"
      @listenDictDialog="listenDictDialog"
      @listenDictSave="listenDictSave"
    ></dict-manage>
    <!-- End Dialog·新建赠送原因  -->
  </div>
</template>
<script>
import {
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_GIVECOUPON_CREATE,
  MEMBERSHIP_API_GIVECOUPON_UPDATE,
  MEMBERSHIP_API_GIVECOUPON_CREATECOUPONBYTAGGROUP
} from '@/apis/membership'
import {
  SettingOptionTypes 
} from '@/enums/membership.js'
import dictManage from '@/components/scrm/dictManage'
export default {
  props: [
    'editDialog',
    'editForm',
    'isCreate',
    'couponCreateRow',
    'title',
    'dataMiningMsg'
  ],
  data() {
    return {
      settingOptionTypes: SettingOptionTypes,
      visible: this.editDialog,
      success: false,
      rules: {
        settingOptionId: [
          {
            type: 'string',
            required: true,
            message: '请选择赠送原因',
            trigger: 'change'
          }
        ]
      },
      reasonDialog: false,
      couponReasons: []
    }
  },
  methods: {
    editCoupon() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          // 数据挖掘按分组赠送优惠券
          if (this.dataMiningMsg && this.dataMiningMsg.settingTagGroupId) {
            const {
              settingTagGroupId, exceptEmptyMobile 
            } = this.dataMiningMsg
            MEMBERSHIP_API_GIVECOUPON_CREATECOUPONBYTAGGROUP(
              Object.assign(this.editForm, {
                settingOptionName: this.getReasonsValue(
                  this.editForm.settingOptionId
                ),
                couponId: this.couponCreateRow.CouponId,
                couponName: this.couponCreateRow.CouponName,
                settingTagGroupId,
                exceptEmptyMobile
              })
            ).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$store.commit('SET_BTN_LOADING', false)
                this.$router.push({
                  path: `/market/giveCoupon/giveCouponEdit?id=${res.data.Data}`
                })
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          } else {
            // 其它
            let api = this.isCreate
              ? MEMBERSHIP_API_GIVECOUPON_CREATE
              : MEMBERSHIP_API_GIVECOUPON_UPDATE
            api(
              Object.assign(this.editForm, {
                settingOptionName: this.getReasonsValue(
                  this.editForm.settingOptionId
                ),
                couponId: this.couponCreateRow.CouponId,
                couponName: this.couponCreateRow.CouponName
              })
            ).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: this.isCreate ? '创建成功' : '修改成功',
                  type: 'success'
                })
                this.$store.commit('SET_BTN_LOADING', false)
                this.success = true
                this.visible = false
                this.$router.push({
                  path: `/market/giveCoupon/giveCouponEdit?id=${res.data.Data}`
                })
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          }
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getReasons() {
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
        type: SettingOptionTypes.GiveCouponCause
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.couponReasons = res.data.Data
        }
      })
    },
    getReasonsValue(id) {
      let result = ''
      this.couponReasons.forEach(item => {
        if (item.settingOptionId == id) {
          result = item.name
        }
      })
      return result
    },
    listenDictDialog() {
      this.reasonDialog = false
      this.getReasons()
    },
    listenDictSave() {
      this.getReasons()
    }
  },
  mounted() {
    this.getReasons()
  },
  watch: {
    visible() {
      this.$emit('listenEditDialog', this.editForm, this.success)
    }
  },
  components: {
    dictManage
  }
}
</script>
