<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loadingIf" label-width="80px">
      <el-form-item label="短信模板">
        <el-select name="templateId" v-model="ruleForm.templateId" @change="templateChange" placeholder="请选择">
          <el-option v-for="item in templateArr" :key="item.templateId" :value="item.templateId" :label="item.templateName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信内容">
        <el-input name="templateContent" type="textarea" v-model="ruleForm.templateContent" disabled></el-input>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-radio-group name="sendType" v-model="ruleForm.sendType" class="radio">
          <el-radio :label="1">审核后立即发送</el-radio>
          <el-radio :label="2">定时发送</el-radio>
        </el-radio-group>
        <el-date-picker
          name="sendTime"
          v-if="ruleForm.sendType == 2"
          type="datetime"
          v-model="ruleForm.sendTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="m-l-10"
          placeholder="选择日期时间"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注">
        <el-input name="remark" v-model="ruleForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnSubmit" type="primary" @click="submitForm" :loading="$store.getters.is_loading">保 存</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  MEMBERSHIP_API_MESSAGETASK_CREATE,
  MEMBERSHIP_API_MESSAGETASK_CREATEWITHDATAGROUP,
  MEMBERSHIP_API_MESSAGETASK_UPDATE
} from '@/apis/membership'
import {
  MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST
} from '@/apis/message'
export default {
  props: {
    visiblemsgMarketingModal: {
      type: Boolean
    },
    title: {
      type: String
    },
    settingTagGroupId: {
      type: Number
    },
    exceptEmptyMobile: {
      type: String
    },
    messageTaskId: {
      type: Number
    },
    smsMarketingInfo: {
      type: Object
    }
  },
  data() {
    return {
      loadingIf: false,
      templateArr: [],
      visible: this.visiblemsgMarketingModal,
      ruleForm: {
        templateId: '',
        templateType: '',
        templateName: '',
        signature: '',
        templateContent: '',
        sendType: 1,
        sendTime: '',
        remark: ''
      },
      rules: {
        templateId: [
          {
            required: true, message: '请选择短信模板'
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisiblemsgMarketingModal')
    }
  },
  beforeMount() {
    this.getTemplateList()
    if (this.smsMarketingInfo) {
      // 修改营销短信时
      this.ruleForm.templateId = this.smsMarketingInfo.templateId
      this.ruleForm.templateType = this.smsMarketingInfo.templateType
      this.ruleForm.templateName = this.smsMarketingInfo.templateName
      this.ruleForm.templateContent = this.smsMarketingInfo.templateContent
      this.ruleForm.sendType = this.smsMarketingInfo.sendType
      this.ruleForm.sendTime = this.smsMarketingInfo.sendTime
      this.ruleForm.remark = this.smsMarketingInfo.remark
    }
  },
  methods: {
    // 获取模板下拉列表
    getTemplateList() {
      this.loadingIf = true
      const param = {
        templateType: ''
      }
      MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          const dataArr = res.data.Data
          this.templateArr = dataArr
        }
        this.loadingIf = false
      })
    },
    templateChange(e) {
      const arr = this.templateArr.filter(item => item.templateId == e)[0]
      this.ruleForm.templateId = e
      this.ruleForm.templateType = arr.templateType
      this.ruleForm.templateName = arr.templateName
      this.ruleForm.signature = arr.signature
      this.ruleForm.templateContent = arr.templateContent
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const {
            templateId,
            templateType,
            templateName,
            signature,
            templateContent,
            sendType,
            sendTime,
            remark
          } = this.ruleForm
          if (sendType == 2 && !sendTime) {
            this.$message.error('请选择定时发送的时间')
          } else {
            let param = {
              templateId,
              templateType,
              templateName,
              signature,
              templateContent,
              sendType,
              sendTime,
              remark
            }
            this.$store.commit('SET_BTN_LOADING', true)
            if (this.title == '发送营销短信') {
              param = Object.assign({}, param, { settingTagGroupId: this.settingTagGroupId, exceptEmptyMobile: this.exceptEmptyMobile })
              MEMBERSHIP_API_MESSAGETASK_CREATEWITHDATAGROUP(param).then(
                res => {
                  if (res.data.Code == 'CORRECT') {
                    this.visible = false
                    this.$message({
                      message: '发送成功',
                      type: 'success'
                    })
                    this.$router.push(`/market/customerMarketing/smsMarketingEdit?id=${res.data.Data}`
                    )
                  }
                  this.$store.commit('SET_BTN_LOADING', false)
                }
              )
            } else if (this.title == '新建营销短信') {
              MEMBERSHIP_API_MESSAGETASK_CREATE(param).then(res => {
                if (res.data.Code == 'CORRECT') {
                  this.visible = false
                  this.$message({
                    message: '新建成功',
                    type: 'success'
                  })
                  this.$router.push(`/market/customerMarketing/smsMarketingEdit?id=${res.data.Data}`
                  )
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
            } else {
              // 修改营销短信
              param = Object.assign({}, param, { messageTaskId: this.messageTaskId })
              MEMBERSHIP_API_MESSAGETASK_UPDATE(param).then(res => {
                if (res.data.Code == 'CORRECT') {
                  this.visible = false
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
            }
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>