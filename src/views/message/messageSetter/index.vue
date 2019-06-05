<template>
  <el-row>
    <el-row class="m-y-10 tr">
      <el-button type="primary" name="btnLinkMessageIndex" size="small" @click="$router.push({path:'/message/messageOrder/index'})">充值记录</el-button>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="platformName" label="SP名称" width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="templateTypeText" label="帐户类型" width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="account" label="帐号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="url" label="SP网址" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <a name="btnLinkOtherUrl" :href="scope.row.url" target="_bank">{{scope.row.url}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="短信余额（条）" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="pendingSendCount" label="待发送短信（条）" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalSendCount" label="累计发送短信（条）" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="warnCount" label="余额预警" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="red">≤{{scope.row.warnCount}}时预警</span>
        </template>
      </el-table-column>
      <el-table-column label="设置" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnSetWarnCount" type="text" @click="setWarnCount(scope.row)">预警设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @module 预警设置 -->
    <el-dialog title="预警设置" width="500px" :visible.sync="warnCountVisible"  @close="resetWarnCountForm">
      <el-form class="fix-w" label-position="right" label-width="100px" :model="warnCountForm" :rules="warnCountRules" ref="warnCountForm">
        <el-form-item label="短信余额≤" prop="warnCount">
          <el-input name="btnSMSBalance" v-model="warnCountForm.warnCount" :maxlength="9">
            <template slot="append">条</template>
          </el-input>
        </el-form-item>
        <el-form-item label="预警通知手机" prop="warnMobile">
          <el-input name="btnNoticePhone" v-model="warnCountForm.warnMobile" :maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnDefindSet" type="primary" @click="saveWarnCount" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancelSet" @click="resetWarnCountForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 预警设置 -->
  </el-row>
</template>
<script>
import {
  MESSAGE_API_SETTINGCHANNEL_GETSETTINGCHANNELS,
  MESSAGE_API_SETTINGCHANNEL_SAVEWARN
} from '@/apis/message'
import {
  mobileValid, integerValid 
} from '@/rules/formValidate'
export default {
  data() {
    return {
      data: [],
      warnCountVisible: false,
      warnCountForm: {
      },
      warnCountRules: {
        warnCount: [
          {
            required: true,
            message: '请输入短信余额预警值',
            trigger: 'change'
          },
          {
            validator: integerValid,
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (value < 1000) {
                callback(new Error('请输入大于等于1000的正整数'))
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        warnMobile: [
          {
            required: true,
            message: '请输入预警手机号',
            trigger: 'change'
          },
          {
            validator: mobileValid,
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_SETTINGCHANNEL_GETSETTINGCHANNELS().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    setWarnCount(item) {
      this.warnCountForm = {
        ...item 
      }
      this.warnCountVisible = true
    },
    saveWarnCount() {
      this.$refs['warnCountForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MESSAGE_API_SETTINGCHANNEL_SAVEWARN(this.warnCountForm).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('设置成功！')
              this.resetWarnCountForm()
              this.getData()
            }
          })
        }
      })
    },
    resetWarnCountForm() {
      this.$refs['warnCountForm'].resetFields()
      this.warnCountVisible = false
    }
  },
  beforeMount() {
    this.getData()
  },
  mounted() {},
  watch: {
  },
  components: {
  }
}
</script>
