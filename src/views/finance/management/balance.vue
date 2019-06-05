<template>
  <div class="contents">
    <store-count v-if="characterType==CharacterType.Store" ref="storeCount" @openDialog="openDialog" @showQrcode="showQrcode"></store-count>
    <company-count v-if="characterType == CharacterType.Company" ref="companyCount" @openDialog="openDialog" @showQrcode="showQrcode"></company-count>
    <el-dialog title="余额预警设置" :visible.sync="warnVisible">
      <el-form :model="form" ref="form" class="fix-w" label-width="80px" :rules="rules">
        <el-form-item label="消费余额" prop="alertCash">
          <el-input v-model="form.AlertCash" name="btnAlertCash"></el-input>最低不能低于2000元
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="aletUpdate" name="btnAletUpdate">确 定</el-button>
        <el-button @click="warnVisible = false" name="btnCancelSet">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="账户充值" :visible.sync="qrcodeVisible" width="300px">
      <div style="text-align:center">
        <img :src="qrCode" alt>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import storeCount from './storeCount'
import companyCount from './companyCount'
import { CharacterType } from '@/enums/common.js'
import { MARKETING_API_BALANCE_STORE_ALERTUPDATE } from '@/apis/marketing'

export default {
  components: {
    storeCount,
    companyCount
  },
  data() {
    return {
      CharacterType,
      warnVisible: false,
      qrcodeVisible: false,
      form: {
        CharacterId: this.$store.getters.user_session.CharacterId,
        AlertCash: 0
      },
      qrCode: '',
      rules: {
        AlertCash: [
          {
            required: true,
            message: '请输入消费预警金额',
            trriger: 'blur'
          },
          {
            validator: this.alertUpdateValid,
            trriger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    openDialog(val, id) {
      this.form.CharacterId = id || this.$store.getters.user_session.CharacterId
      this.warnVisible = val
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    aletUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.AlertCash = Number(this.form.AlertCash)
          MARKETING_API_BALANCE_STORE_ALERTUPDATE(this.form).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.warnVisible = false
              if (this.$refs.storeCount) {
                this.$refs.storeCount.getBalanceDetail()
              }
              if (this.$refs.companyCount) {
                this.$refs.companyCount.init()
              }
            }
          })
        } else {
          return false
        }
      })
    },
    showQrcode(val) {
      this.qrcodeVisible = true
      this.qrCode = val
    },
    alertUpdateValid(rule, value, callback) {
      let flag = /(?!0(\.0{1,2})?$)^([1-9]\d{0,8}|\d)(\.0{1,2})?$/.test(value)
      if (!flag) {
        callback(new Error('请输入整数'))
      } else if (parseInt(value) < 2000) {
        callback(new Error('金额最低不能低于2000元'))
      } else {
        callback()
      }
    }
  }
}
</script>