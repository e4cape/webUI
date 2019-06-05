<template>
  <div class="content-view m-x-20 p-t-20 dialog-setting p-b-50 border-1px">
    <div>
      <el-form ref="form" label-width="120px">
        <el-form-item label="角色序号：">
          <span>{{$route.query.CharacterId}}</span>
        </el-form-item>
        <el-form-item label="门店名称：" v-if="isStore">
          <span>{{$route.query.StoreTitle}}</span>
        </el-form-item>
        <el-form-item label="商户名称：" v-else>
          <span>{{$route.query.CompanyTitle}}</span>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs type="card" v-loading="isLoading" v-model="activeName">
      <el-tab-pane v-for="(item,index) in Detail" :key="index" :label="WxTemplateType.Types[item.TemplateType]" :name="''+index" class="m-l-20">
        <el-form ref="formMoney" label-width="120px">
          <el-form-item label="微信模板ID：">
            <span>{{item.TemplateNO}}</span>
          </el-form-item>
          <el-form-item label="模板类型：">
            <span>{{WxTemplateType.Types[item.TemplateType]}}</span>
          </el-form-item>
          <el-form-item label="模板内容：">
            <span v-html="item.TemplateNote"></span>
          </el-form-item>
          <el-form-item v-if="item.TemplateType != WxTemplateType.Overdue" label="发送设置：">
            <span>{{WxSendType.Types[item.SendType]}}</span>
          </el-form-item>
          <el-form-item label="发送时间：" v-if="item.SendType==WxSendType.Immediately && item.TemplateType != WxTemplateType.Overdue">
            <span>即时发送</span>
          </el-form-item>

          <el-form-item label="发送时间：" v-else-if="item.SendType==WxSendType.Timing && item.TemplateType != WxTemplateType.Overdue">
            <span>{{dayjs(new Date(item.SendTime)).format('YYYY-MM-DD')}}</span>
          </el-form-item>
          <el-form-item label="发送时间：" v-else-if="item.TemplateType != WxTemplateType.Overdue">
            <span>消费单提交后 {{item.SubmitDay}} 天发送,下次发送间隔 {{item.IntervalDay}} 天</span>
          </el-form-item>
          <el-form-item label="创建时间：">
            <span>{{dayjs(new Date(item.CreateTime)).format('YYYY-MM-DD')}}</span>
          </el-form-item>
          <el-form-item label="创建人：">
            <span>{{item.CreateUser}}</span>
          </el-form-item>
          <el-form-item>
            <el-button
              name="templateEdit"
              type="primary"
              v-if="item.TemplateType !== WxTemplateType.Overdue&&item.TemplateType !== WxTemplateType.Consumption && item.TemplateType !== WxTemplateType.MemberCard&&item.SendType !== WxSendType.Immediately"
              @click="showSet(item.TemplateId,item.SendType,item)"
            >修改发送设置</el-button>
            <el-button name="templateDelete" @click="deleteTemplate($event,item.TemplateId, index)">删除</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="发送设置" :visible.sync="dialogFormVisible">
      <el-form :model="formRecharge" :rules="rules" ref="formRecharge" class="send-style" label-width="120px">
        <el-form-item label="发送设置：" prop="SendType">
          <el-select name="SendType" class="w-238" v-model="formRecharge.SendType" placeholder="请选择">
            <el-option v-for="item in WxSendTypeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formRecharge.SendType === WxSendType.Timing" label="发送时间" prop="SendTime" key="SendTime">
          <el-date-picker name="SendTime" v-model="formRecharge.SendTime" type="date" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="formRecharge.SendType === WxSendType.Regular" class="items-send" key="SubmitDay">
          <span>消费单提交后</span>
          <el-form-item prop="SubmitDay" class="mb0">
            <el-input name="SubmitDay" class="w-80" v-model="formRecharge.SubmitDay"></el-input>
          </el-form-item>
          <span>天发送，下次发送间隔</span>
          <el-form-item prop="IntervalDay" class="mb0">
            <el-input name="IntervalDay" class="w-80" v-model="formRecharge.IntervalDay"></el-input>
          </el-form-item>
          <span>天。</span>
          <span v-if="formRecharge.TemplateType == WxTemplateType.Gains">收益提醒间隔不能小于7天</span>
          <span v-if="formRecharge.TemplateType == WxTemplateType.Maintenance">保养提醒间隔不能小于60天</span>
          <!-- <span>天，发送时间</span> -->
          <!-- <el-form-item prop="SendTime" class="mb0">
            <el-time-picker name="SendTime" class="w-183" value-format="HH:mm:ss" v-model="formRecharge.SendTime" placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="confirm" type="primary" @click="onSubmit" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="cancel" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  MARKETING_API_WEB_CHAT_STORETEMPLATEDETAIL, //  微信管理 - 消息模版(详细)
  MARKETING_API_WEB_CHAT_TEMPLATEDELETE, // 微信管理 - 消息模版(删除)
  MARKETING_API_WEB_CHAT_TEMPLATEUPDATE // 微信管理 - 消息模版(更新)
} from '@/apis/marketing.js'

import { EnableState } from '@/enums/common'
import { WxTemplateType, WxSendType } from '@/enums/component.js'

export default {
  data() {
    return {
      dayjs,
      WxTemplateType: WxTemplateType,
      WxSendType: WxSendType,
      EnableState: EnableState,
      WxSendTypeOpt: [],
      Detail: [],
      isLoading: false,
      activeName: '0',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        SendType: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        SendTime: [
          {
            required: true,
            message: '不能为空！',
            trigger: 'change'
          }
        ],
        SubmitDay: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            validator: this.validator
          }
        ],
        IntervalDay: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            validator: this.validator1
          }
        ]
      },
      dialogFormVisible: false,
      formRecharge: {
        SendType: '',
        SendTime: ''
      },
      settingSend: '2',

      sendDate: '',
      isStore: false
    }
  },
  mounted() {
    this.isStore = this.$route.query.isStore == 'false' ? false : true
    this.templateStates = [0, 1, 2, 3]
    this.getEnums()
    this.getDetail()
  },

  methods: {
    intFloatTest(num) {
      const reg = /^(?!(0[0-9]$))[+]?[1-9]{1}[0-9]{0,8}$/g
      return reg.test(num)
    },
    validator(rule, value, callback) {
      if (!this.intFloatTest(value)) {
        callback(new Error('请正确输入！'))
      } else {
        callback()
      }
    },
    validator1(rule, value, callback) {
      if (!this.intFloatTest(value)) {
        callback(new Error('请正确输入！'))
      } else if (this.formRecharge.SendType == this.WxSendType.Regular) {
        if (this.formRecharge.TemplateType == this.WxTemplateType.Gains) {
          if (value < 7) {
            callback(new Error('请正确输入！'))
          } else {
            callback()
          }
        }
        if (this.formRecharge.TemplateType == WxTemplateType.Maintenance) {
          if (value < 60) {
            callback(new Error('请正确输入！'))
          } else {
            callback()
          }
        }
        callback()
      }
    },
    getEnums() {
      for (let item in WxSendType.Types) {
        if (item != WxSendType.Immediately) {
          this.WxSendTypeOpt.push({
            label: WxSendType.Types[item],
            value: parseInt(item)
          })
        }
      }
    },
    showSet(id, SendType, item) {
      this.dialogFormVisible = true

      this.formRecharge = Object.assign({}, item)
      if (SendType == this.WxSendType.Regular) {
        // this.formRecharge.SendTime = new Date('2018-06-13 ' + this.formRecharge.SendTime)
        this.formRecharge.SendTime = ''
      } else {
        this.formRecharge.SendTime = new Date(this.formRecharge.SendTime)
      }
    },
    deleteTemplate(e, TemplateId, i) {
      e.currentTarget.blur()
      this.$confirm('是否确认删除此模板！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isLoading = true
          MARKETING_API_WEB_CHAT_TEMPLATEDELETE({
            TemplateId
          })
            .then(res => {
              this.isLoading = false
              if (res.data.Code == 'CORRECT') {
                this.Detail.splice(i, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (this.Detail.length == 0) {
                  this.$router.push('/setter/wxpublic/wxtemplatelist')
                  return false
                }
                this.activeName = '0'

                this.getEnums()
                this.getDetail()
              }
            })
            .catch(() => {
              this.isLoading = false
            })
        })
        .catch(() => { })
    },
    getDetail() {
      MARKETING_API_WEB_CHAT_STORETEMPLATEDETAIL({
        CharacterId: this.$route.query.CharacterId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.Detail = res.data.Data
        }

        this.isLoading = false
      })
    },
    onSubmit() {
      this.$refs['formRecharge'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          if (this.WxSendType.Regular == this.formRecharge.SendType) {
            // this.formRecharge.SendTime = dayjs(new Date(this.formRecharge.SendTime)).format('HH:mm:ss')
            this.formRecharge.SendTime = ''
          } else {
            this.formRecharge.SubmitDay = ''
            this.formRecharge.IntervalDay = ''
          }

          MARKETING_API_WEB_CHAT_TEMPLATEUPDATE(
            Object.assign({}, this.formRecharge, {
              SubmitDay: +this.formRecharge.SubmitDay,
              IntervalDay: +this.formRecharge.IntervalDay
            })
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存成功！')
              window.location.reload()
              this.dialogFormVisible = false
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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

.inline-b {
  display: inline-block;
  width: 200px;
  height: 28px;
}

.mb0 {
  display: inline-block;
}

.w-80 {
  width: 80px;
}
</style>
<style lang="scss">
.dialog-setting {
  .el-tabs__nav-scroll {
    padding-left: 20px;
  }

  .el-tabs__item {
    padding: 0 20px !important;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 20px !important;
  }
}

.send-style {
  .el-date-editor--date {
    width: 238px;
  }
}
</style>
