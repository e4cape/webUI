<template>
  <div>
    <!-- 回访记录 -->
    <el-dialog title="添加回访记录" :visible.sync="visible" class="elDialog" @close="resetForm('returnRecordForm')">
      <el-row>
        <el-col :span="16">
          <div class="leftModal">
            <div class="usersInfo">
              <user-Info :scope="currUserInfo" :isLink="false"></user-Info>
            </div>
            <div class="title">回访记录</div>
            <el-form :model="returnRecordForm" :rules="returnRecordRule" ref="returnRecordForm" class="returnRecordForm">
              <el-form-item prop="content">
                <el-input name="content" type="textarea" v-model="returnRecordForm.content" placeholder="请输入回访内容，最多200字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-col :span="20">
                  <el-form-item prop="settingOptionMethodId">
                    <el-select name="settingOptionMethodId" class="settingSelect" v-model="returnRecordForm.settingOptionMethodId" @change="settingReturnRecordChang" placeholder="选择回访方式">
                      <el-option v-for="item in visitBookTypeOptions" :key="item.settingOptionId" :label="item.name" :value="item.settingOptionId"></el-option>
                    </el-select>
                    <i name="btnOpen" class="icon-set" size="small" @click="openSetting"></i>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button name="btnSubmit" style="float: right" type="primary" @click="submitReturn('returnRecordForm')" :loading="loading">提交</el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <div class="recordList">
              <ul class="entry-record-lists" v-if="returnRecordData.length != 0">
                <li v-for="(item, index) in returnRecordData" :key="index">
                  <div class="entry-record-lists-hd">
                    <div class="left">{{item.createTime}} {{item.createUser}}</div>
                    <a name="btnDel" class="right" @click="onDeleteRecordClick(item.visitLogId)">
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
        </el-col>
        <el-col :span="8">
          <div class="rvr-word">
            <div class="rvr-word-t">
              <div class="title">回访话术</div>
              <div class="rvr-word-search">
                <el-form :model="speechForm" ref="speechForm">
                  <el-col :span="10">
                    <el-form-item prop="settingOptionId">
                      <el-select name="settingOptionId" v-model="speechForm.settingOptionId" placeholder="请选择" @change="speechSubmit('speechForm')" class="rvr-mode">
                        <el-option label="所有类型" value="_ALL"></el-option>
                        <el-option v-for="item in returnSpeechOptions" :key="item.settingOptionId" :label="item.name" :value="item.settingOptionId"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-form-item prop="keyword">
                      <span>
                        <el-input name="keyword" v-model="speechForm.keyword" placeholder="请输入内容" @keyup.enter.native="speechSubmit('speechForm')"></el-input>
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
    </el-dialog>
    <!-- 新建修改原因 -->
    <member-dict-manage prop="name" :optionType="settingOptionTypes.VisitMethod" :items="visitBookTypeOptions" :visible.sync="dictsDialog" @reason-change="reasonChange"></member-dict-manage>
    <!-- end 新建修改原因 -->
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_VISITLOG_GETVISITLOGS,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_VISITLOG_CREATE,
  MEMBERSHIP_API_VISITLOG_DELETE,
  MEMBERSHIP_API_VISITBOOK_SEARCHFORVISITLOG
} from '@/apis/membership.js'
import userInfo from '@/components/scrm/userInfo.vue'
import MemberDictManage from '@/components/scrm/memberDictManage'
import {
  SettingOptionTypes
} from '@/enums/membership.js'
export default {
  props: {
    currUserInfo: {
      type: Object
    },
    returnRecordVisible: {
      type: Boolean
    }
  },
  components: {
    userInfo,
    MemberDictManage
  },
  data() {
    return {
      dictsDialog: false,
      loading: false,
      visible: this.returnRecordVisible,
      settingOptionTypes: SettingOptionTypes,
      returnRecordRule: {
        content: [
          {
            required: true, message: '请填写回访内容', trigger: 'blur'
          },
          {
            min: 0, max: 200, message: '长度在200个字符', trigger: 'blur'
          }
        ],
        settingOptionMethodId: [
          {
            required: true, message: '请选择回访方式', trigger: 'change'
          }
        ]
      }, // 创建回访记录校验
      returnRecordForm: {
        content: '',
        settingOptionMethodId: '',
        settingOptionMethodName: ''
      }, // 创建回访记录对象
      returnRecordData: [], // 回访记录
      wordSearchList: [], // 回访话术列表
      speechForm: {
        settingOptionId: '_ALL',
        keyword: '',
      }, // 回访话术搜索条件
      visitBookTypeOptions: [], // 回访方式下拉列表
      returnSpeechOptions: [], // 回访话术下拉列表
    }
  },
  methods: {
    openSetting() {
      this.dictsDialog = true
    },
    // 获取回访记录列表
    getReturnRecordList() {
      const para = {
        memberId: this.currUserInfo.memberId
      }
      MEMBERSHIP_API_VISITLOG_GETVISITLOGS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnRecordData = res.data.Data
        }
      })
    },
    // 选择回访方式
    settingReturnRecordChang(val) {
      const obj = this.visitBookTypeOptions.find((item) => {
        return item.settingOptionId === val
      })
      this.returnRecordForm.settingOptionMethodName = obj.name
    },
    // 获取回访方式下拉列表
    getVisitBookTypeOptions() {
      const para = {
        type: this.settingOptionTypes.VisitMethod
      }
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.visitBookTypeOptions = res.data.Data
        }
      })
    },
    // 创建回访方式记录
    submitReturn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const para = {
            ...this.returnRecordForm,
            memberId: this.currUserInfo.memberId
          }
          this.loading = true
          MEMBERSHIP_API_VISITLOG_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.$message({
                showClose: true,
                message: '成功添加回访记录',
                type: 'success'
              })
              this.getReturnRecordList()
              this.loading = false
            }
          })
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
        type: this.settingOptionTypes.VisitBookType
      }
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnSpeechOptions = res.data.Data
        }
      })
    },
    reasonChange(data) {
      console.log('我是data', data)
      this.visitBookTypeOptions = data
    },
    // 搜索回访话术
    speechSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getReturnSpeechList()
        }
      })
    },
    // 回访话术请求数据
    getReturnSpeechList() {
      const para = {
        ...this.speechForm,
        settingOptionId: this.speechForm.settingOptionId == '_ALL' ? '' : this.speechForm.settingOptionId,
        pageSize: 1000,
        pageIndex: 1
      }
      MEMBERSHIP_API_VISITBOOK_SEARCHFORVISITLOG(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.wordSearchList = res.data.Data.rows
        }
      })
    },
    resetForm(formName) {
      this.$emit('closeClick', false)
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    returnRecordVisible(val) {
      this.visible = val
      if (val) {
        this.getVisitBookTypeOptions()
        this.getReturnRecordList()
        this.getReturnSpeech()
        this.getReturnSpeechList()
      }
    },
  }
}
</script>

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
    padding-left: 15px;
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
      height: 325px;
      padding: 0 15px;
      border-top: 1px solid $d;
      margin-bottom: 0;
      overflow: auto;
      li {
        border-top: 1px dashed $d;
        &:first-child {
          border-top: 1px dashed $w;
        }
      }
      .entry-record-lists-hd {
        position: relative;
        padding: 15px 0 10px;
        font-size: 12px;
        a {
          position: absolute;
          top: 15px;
          right: 0;
        }
      }
      .bd {
        padding-bottom: 10px;
        font-size: 12px;
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
    height: 510px;
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
        min-height: 50px;
        padding: 10px 0 5px 40px;
        b {
          position: absolute;
          top: 10px;
          left: 0;
          width: 37px;
          height: 37px;
          line-height: 37px;
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
        font-size: 12px;
        margin-top: 5px;
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

