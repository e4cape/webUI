<template>
  <div>
    <el-dialog title="添加回访记录" :visible.sync="visible" class="elDialog visitRecordDialog" @close="resetForm('returnRecordForm')">
      <el-row style="font-size: 12px;">
        <div v-if="currUserInfoArr.length > 1" class="p-10 tc" style="border-bottom: 1px #e5e5e5 solid;">
          <el-button name="btnUserInfoIndexDown" :disabled="userInfoIndex == 1" @click="userInfoIndexDown">
            <i class="el-icon-arrow-left"></i>
          </el-button>
          <el-input name="inputUserInfoIndex" :style="'width: 40px;'" v-model="userInfoIndex"></el-input>
          <span>/ {{this.currUserInfoArr.length}}</span>
          <el-button name="btnUserInfoIndexUp" :disabled="userInfoIndex == this.currUserInfoArr.length" @click="userInfoIndexUp">
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <el-col :span="16">
          <div class="leftModal">
            <div class="usersInfo">
              <user-Info :scope="currUserInfo" :isLink="false"></user-Info>
            </div>
            <div class="title clearfix">
              <span class="fl">回访记录</span>
              <span class="fr" style="font-weight:normal;">{{currUserInfo.taskStatusText}}</span>
            </div>
            <el-form :model="returnRecordForm" :rules="returnRecordRule" ref="returnRecordForm" class="returnRecordForm" v-if="currUserInfo.taskStatus == visitMemberTaskStatus.Pending">
              <el-form-item prop="content">
                <el-input name="inputContent" type="textarea" v-model="returnRecordForm.content" placeholder="请输入回访内容，最多200字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-col :span="6" v-if="taskResults.length">
                  <el-form-item prop="resultValue">
                    <el-select name="selectResultValue" class="settingSelect" v-model="returnRecordForm.resultValue" placeholder="选择回访结果" :multiple="String(currUserInfo.markType) === '2'">
                      <el-option v-for="(item, index) in taskResults" :key="index" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="settingOptionMethodId">
                    <el-select name="selectSettingOptionMethodId" class="settingSelect" v-model="returnRecordForm.settingOptionMethodId" @change="settingReturnRecordChang" placeholder="选择回访方式">
                      <el-option v-for="(item, index) in visitBookTypeOptions" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
                    </el-select>
                    <i class="icon-set" size="small" @click="iOpen = true"></i>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="tr">
                  <el-button :loading="loading" name="btnSubmit" type="primary" @click="submitReturn('returnRecordForm', false)">提交</el-button>
                  <el-button :loading="endLoading" name="btn" type="btnSubmitFinish" @click="submitReturn('returnRecordForm', true)">提交并结束</el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <div class="recordList">
              <el-tabs v-model="activeName" @tab-click="getReturnRecordList" style="width: 100%;padding-left: 20px;" v-if="currUserInfo.taskStatus == visitMemberTaskStatus.Complete">
                <el-tab-pane label="本次回访" name="present">
                  <ul class="entry-record-lists" v-if="returnRecordData.length != 0">
                    <li v-for="(item, index) in returnRecordData" :key="index">
                      <div class="entry-record-lists-hd">
                        <div class="left">{{item.createTime}} {{item.createUser}}</div>
                        <a name="clickOnDeleteRecordClick" class="right" @click="onDeleteRecordClick(item.visitLogId)">
                          <i class="el-icon-delete"></i>
                          删除记录
                        </a>
                      </div>
                      <div class="bd">【{{item.settingOptionMethodName}}】{{item.content}}</div>
                    </li>
                  </ul>
                  <div v-else class="entry-record-b-box">暂无回访记录</div>
                </el-tab-pane>
                <el-tab-pane label="所有回访" name="allVisit">
                  <ul class="entry-record-lists" v-if="returnRecordData.length != 0">
                    <li v-for="(item, index) in returnRecordData" :key="index">
                      <div class="entry-record-lists-hd">
                        <div class="left">{{item.createTime}} {{item.createUser}}</div>
                        <a name="clickOnDeleteRecordClick" class="right" @click="onDeleteRecordClick(item.visitLogId)">
                          <i class="el-icon-delete"></i>
                          删除记录
                        </a>
                      </div>
                      <div class="bd">【{{item.settingOptionMethodName}}】{{item.content}}</div>
                    </li>
                  </ul>
                  <div v-else class="entry-record-b-box">暂无回访记录</div>
                </el-tab-pane>
              </el-tabs>
              <div v-else>
                <ul class="entry-record-lists" v-if="returnRecordData.length != 0">
                  <li v-for="(item, index) in returnRecordData" :key="index">
                    <div class="entry-record-lists-hd">
                      <div class="left">{{item.createTime}} {{item.createUser}}</div>
                      <a name="clickOnDeleteRecordClick" class="right" @click="onDeleteRecordClick(item.visitLogId)">
                        <i class="el-icon-delete"></i>
                        删除记录
                      </a>
                    </div>
                    <div class="bd">【{{item.settingOptionMethodName}}】{{item.content}}</div>
                  </li>
                </ul>
                <div v-else class="entry-record-b-box">暂无回访记录</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="rvr-word">
            <div class="rvr-word-t">
              <div class="title">回访话术</div>
              <div class="rvr-word-search">
                <el-form :model="speechForm" ref="speechForm">
                  <el-col :span="10">
                    <el-form-item prop="settingOptionId">
                      <el-select name="selectSettingOptionId" v-model="speechForm.settingOptionId" placeholder="请选择" @change="speechSubmit('speechForm')" class="rvr-mode">
                        <el-option label="所有类型" value="_ALL"></el-option>
                        <el-option v-for="item in returnSpeechOptions" :key="item.settingOptionId" :label="item.name" :value="item.settingOptionId"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-form-item prop="keyword">
                      <span>
                        <el-input name="inputKeyword" v-model="speechForm.keyword" placeholder="话术ID/主题" @keyup.enter.native="speechSubmit('speechForm')"></el-input>
                      </span>
                    </el-form-item>
                  </el-col>
                </el-form>
              </div>
            </div>
            <div class="rvr-word-b">
              <ul class="rvr-word-list">
                <li v-for="n in wordSearchList" :key="n.visitBookId">
                  <div class="hd">
                    <b>{{n.visitBookId}}</b>
                    <h6>{{n.subject}}</h6>
                    <p>
                      {{n.settingOptionName}}{{' '}}
                      {{n.lastTime || n.lastUser
                      ? `最后修改：${n.lastTime}/${n.lastUser}`
                      : ''}}
                    </p>
                  </div>
                  <div class="bd">{{n.content}}</div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSubmitReturnAndOver" type="primary" v-if="currUserInfo.taskStatus == visitMemberTaskStatus.Pending" @click="submitReturnAndOver" :loading="$store.getters.is_loading">结束回访</el-button>
        <el-button name="btnCancel" @click="visible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <manage prop="name" :dialogTitle="'回访方式'" :optionType="optionType" :items="visitBookTypeOptions" :visible.sync="iOpen" @reason-change="onReasonChange"/>
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_VISITLOG_GETVISITLOGS,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_VISITLOG_CREATE,
  MEMBERSHIP_API_VISITLOG_DELETE,
  MEMBERSHIP_API_VISITBOOK_SEARCHFORVISITLOG,
  MEMBERSHIP_API_VISITTASKEXCUTION_FINISH,
  MEMBERSHIP_API_VISITTASK_GETVISITTASKRESULTS
} from '@/apis/membership.js'
import userInfo from '@/components/scrm/userInfo.vue'
import {
  SettingOptionTypes,
  VisitTaskFinishStatus,
  VisitMemberTaskStatus
} from '@/enums/membership.js'
import manage from '@/components/scrm/memberDictManage'

export default {
  props: {
    currUserInfoArr: {
      default: new Array(),
      type: Array
    }, recordVisible: {
      default: false,
      type: Boolean
    },
    id: {
      default: '',
      type: String
    }
  },
  components: {
    userInfo,
    manage
  },
  data() {
    return {
      activeName: 'present',
      iOpen: false,
      visitTaskFinishStatus: VisitTaskFinishStatus,
      visitMemberTaskStatus: VisitMemberTaskStatus,
      visible: this.recordVisible,
      optionType: SettingOptionTypes.VisitMethod,
      currUserInfo: {
        taskStatusText: '',
        memberId: ''
      },
      userInfoIndex: 1,
      returnRecordRule: {
        content: [
          {
            required: true,
            message: '请填写回访内容',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 200,
            message: '长度在200个字符',
            trigger: 'blur'
          }
        ],
        settingReturn: [
          {
            required: true,
            message: '请选择活动区域',
            trigger: 'change'
          }
        ],
        settingOptionMethodId: [
          {
            required: true,
            message: '请选择回访方式',
            trigger: 'blur'
          }
        ],
        resultValue: [
          {
            required: true,
            message: '请选择回访结果',
            trigger: 'blur'
          }
        ]
      }, // 创建回访记录校验
      returnRecordForm: {
        content: '',
        settingOptionMethodId: '',
        settingOptionMethodName: '',
        resultValue: ''
      }, // 创建回访记录对象
      returnRecordData: [], // 回访记录
      taskResults: [], // 回访结果
      wordSearchList: [], // 回访话术列表
      speechForm: {
        settingOptionId: '_ALL',
        keyword: ''
      }, // 回访话术搜索条件
      visitBookTypeOptions: [], // 回访方式下拉列表
      returnSpeechOptions: [], // 回访话术下拉列表
      success: false,
      loading: false,
      endLoading: false
    }
  },

  beforeMount() {
    this.getVisitBookTypeOptions()
    this.getReturnSpeech()
    this.currUserInfo = this.currUserInfoArr[0]
  },
  mounted() {
    this.getReturnRecordList()
    this.getReturnSpeechList()
    this.getVisitTaskResults()
  },
  methods: {
    getVisitTaskResults() {
      MEMBERSHIP_API_VISITTASK_GETVISITTASKRESULTS(this.id).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.taskResults = res.data.Data
        }
      })
    },
    onReasonChange(items) {
      this.visitBookTypeOptions = items
    },
    // 获取回访记录列表
    getReturnRecordList(tab) {
      const para = {
        memberId: this.currUserInfo.memberId
      }
      if (!tab || tab.name != 'allVisit') {
        para.visitTaskId = this.id
      }

      MEMBERSHIP_API_VISITLOG_GETVISITLOGS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnRecordData = res.data.Data
        }
      })
    },
    // 选择回访方式
    settingReturnRecordChang(val) {
      const obj = this.visitBookTypeOptions.find(item => {
        return item.settingOptionId === val
      })
      this.returnRecordForm.settingOptionMethodName = obj.name
    },
    // 获取回访方式下拉列表
    getVisitBookTypeOptions() {
      const para = {
        type: SettingOptionTypes.VisitMethod
      }
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.visitBookTypeOptions = res.data.Data
        }
      })
    },
    // 创建回访方式记录
    submitReturn(formName, boolean) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { taskResults } = this
          let resultText = ''
          let { resultValue } = this.returnRecordForm
          if (Array.isArray(resultValue)) {
            resultText = taskResults
              .filter(v => resultValue.find(rv => rv === v.value))
              .map(v => v.text)
              .join(',')
            resultValue = resultValue.reduce((p, c) => {
              return p | c
            })
          } else if (taskResults.length) {
            resultText = this.taskResults.find(
              v => v.value === this.returnRecordForm.resultValue
            ).text
          } else {
            resultValue = 0
          }
          const para = {
            ...this.returnRecordForm,
            resultValue,
            resultText,
            memberId: this.currUserInfo.memberId,
            visitTaskId: this.id,
            visitMemberId: this.currUserInfo.visitMemberId
          }
          boolean ? (this.endLoading = true) : (this.loading = true)
          MEMBERSHIP_API_VISITLOG_CREATE(para).then(res => {
            this.loading = false
            this.endLoading = false
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.$message({
                showClose: true,
                message: '成功添加回访记录',
                type: 'success'
              })
              this.$emit('logged')
              if (boolean) {
                this.submitReturnAndOver()
                return false
              }
              this.getReturnRecordList()
              this.$refs[formName].resetFields()
            }
          })
        }
      })
    },
    // 回访结束
    submitReturnAndOver() {
      MEMBERSHIP_API_VISITTASKEXCUTION_FINISH({
        visitMemberId: this.currUserInfo.visitMemberId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getReturnRecordList()
          this.$emit('close')
          this.currUserInfoArr[
            this.userInfoIndex - 1
          ].taskStatus = this.visitMemberTaskStatus.Complete
          this.currUserInfoArr[this.userInfoIndex - 1].taskStatusText = '已完成'
          this.success = true
        }
      })
    },
    // 删除回访方式记录
    onDeleteRecordClick(visitLogId) {
      const para = {
        visitLogId
      }
      MEMBERSHIP_API_VISITLOG_DELETE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            showClose: true,
            message: '成功删除回访记录',
            type: 'success'
          })
          this.getReturnRecordList()
        }
      })
    },
    // 获取回访话术下拉列表
    getReturnSpeech() {
      const para = {
        type: SettingOptionTypes.VisitBookType
      }
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnSpeechOptions = res.data.Data
        }
      })
    },
    // 搜索回访话术
    speechSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getReturnSpeechList()
        }
      })
    },
    // 回访话术请求数据
    getReturnSpeechList() {
      const para = {
        ...this.speechForm,
        settingOptionId:
          this.speechForm.settingOptionId == '_ALL'
            ? ''
            : this.speechForm.settingOptionId,
        pageSize: 1000,
        pageIndex: 1
      }
      MEMBERSHIP_API_VISITBOOK_SEARCHFORVISITLOG(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.wordSearchList = res.data.Data.rows
        }
      })
    },
    resetForm() {
      this.$emit('closeClick', false)
    },
    userInfoIndexUp() {
      if (this.userInfoIndex == this.currUserInfoArr.length) {
        return false
      }
      this.userInfoIndex += 1
      this.$refs['returnRecordForm'].resetFields()
    },
    userInfoIndexDown() {
      if (this.userInfoIndex == 1) {
        return false
      }
      this.userInfoIndex -= 1
      this.$refs['returnRecordForm'].resetFields()
    }
  },
  watch: {
    userInfoIndex(val) {
      this.currUserInfo = this.currUserInfoArr[val - 1]
      this.getReturnRecordList()
      this.getReturnSpeechList()
    },
    visible(val) {
      if (!val) {
        this.$emit('closeClick', this.success)
      }
    }
  }
}
</script>
<style lang="scss">
.visitRecordDialog {
  .el-tabs__nav-wrap {
    width: 100%;
    padding-left: 20px;
  }
  .el-tabs__header {
    padding-right: 20px;
  }
}
</style>

<style scoped lang="scss">
$d: #ddd;
$w: #fff;
.usersInfo {
  padding: 10px;
}
.elDialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog {
    min-width: 750px;
  }
}
.icon-set {
  font-size: 17px;
  position: absolute;
  top: 6px;
  margin-left: 7px;
  color: #399fe5;
  cursor: pointer;
}
.leftModal {
  border-right: 1px solid $d;
  .title {
    height: 38px;
    line-height: 38px;
    padding: 0 15px;
    border-bottom: 1px solid $d;
    border-top: 1px solid $d;
    font-size: 14px;
    font-weight: bold;
    background: #f5f5f5;
  }
  .returnRecordForm {
    padding: 10px;
  }
  .settingSelect {
    float: left;
  }
  .recordList {
    padding: 0;
    .entry-record-lists {
      padding: 0 15px;
      width: 100%;
      height: 325px;
      margin-bottom: 0;
      overflow-y: auto;
      li {
        border-top: 1px dashed $d;
        &:first-child {
          border-top: 1px dashed $w;
        }
      }
      .entry-record-lists-hd {
        position: relative;
        padding: 15px 0 10px;
        a {
          position: absolute;
          top: 15px;
          right: 0;
        }
      }
      .bd {
        padding-bottom: 10px;
      }
    }
  }
}
.rvr-word {
  .rvr-word-t {
    padding: 0 10px 10px;
    border-bottom: 1px solid #ddd;
    background: #f5f5f5;
    .title {
      position: relative;
      height: 38px;
      line-height: 38px;
      padding-left: 15px;
      font-size: 14px;
      font-weight: bold;
      background: #f5f5f5;
      border-bottom: 0;
    }
    .rvr-word-search {
      overflow: hidden;
    }
  }
  .rvr-word-list {
    max-height: 367px;
    padding: 0 15px;
    margin-bottom: 0;
    overflow: auto;
    li {
      border-top: 1px dashed $d;
      &:first-child {
        border-top: 1px dashed $w;
      }
      .hd {
        position: relative;
        min-height: 60px;
        padding: 10px 0 5px 50px;
        b {
          position: absolute;
          top: 10px;
          left: 0;
          width: 45px;
          height: 45px;
          line-height: 45px;
          border-radius: 50%;
          font-size: 12px;
          text-align: center;
          color: $w;
          background: #61a9da;
        }
        h6 {
          line-height: 1;
          margin-bottom: 0;
          font-size: 12px;
        }
        p {
          line-height: 1.5;
          margin-top: 6px;
          color: #999;
          font-size: 12px;
        }
      }
      .bd {
        padding-bottom: 10px;
        word-break: break-all;
      }
    }
  }
}
.entry-record-b-box {
  height: 339px;
  line-height: 339px;
  margin-top: 10px;
  border-top: 1px solid #ddd;
  text-align: center;
}
</style>

