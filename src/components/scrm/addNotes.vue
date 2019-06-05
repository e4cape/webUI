<template>
  <div>
    <!-- 添加备注 -->
    <el-dialog title="添加备注" :visible.sync="visible" class="elDialog" @close="resetForm('addRemarkForm')">
      <div class="leftModal addRemarkModal">
        <div class="usersInfo">
          <user-Info :scope="currUserInfo" :isLink="false"></user-Info>
        </div>
        <div class="title">备注</div>
        <el-form :model="addRemarkForm" :rules="addRemarkRule" ref="addRemarkForm" class="returnRecordForm">
          <el-form-item prop="content">
            <el-input name="content" type="textarea" v-model="addRemarkForm.content" placeholder="请输入备注内容，最多200字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span="20">
              <el-form-item prop="settingOptionId">
                <el-select name="settingOptionId" class="settingSelect" @change="settingChang" v-model="addRemarkForm.settingOptionId" placeholder="选择备注项目" required filterable>
                  <el-option v-for="item in remarkOptions" :key="item.settingOptionId" :label="item.name" :value="item.settingOptionId"></el-option>
                </el-select>
                <i class="icon-set" size="small" @click="dictsDialog = true"></i>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button name="btnSubmit" style="float: right" type="primary" @click="submitAddRemark('addRemarkForm')" :loading="loading">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="recordList">
          <ul class="entry-record-lists" v-if="addRemarkData.length != 0">
            <li v-for="(item, index) in addRemarkData" :key="index">
              <div class="entry-record-lists-hd">
                <div class="left">{{item.createTime}} {{item.createUser}}</div>
                <a name="btnDel" class="right" @click="onDeleteRemarkClick(item.memberRemarkId)">
                  <i class="el-icon-delete"></i>
                  删除记录
                </a>
              </div>
              <div class="bd">【{{item.settingOptionName}}】{{item.content}}</div>
            </li>
          </ul>
          <div v-else class="entry-record-b-box">暂无备注记录</div>
        </div>
      </div>
    </el-dialog>
    <!-- 新建修改原因 -->
    <member-dict-manage prop="name" :optionType="settingOptionTypes.MemberRemark" :items="remarkOptions" :visible.sync="dictsDialog" @reason-change="reasonChange"></member-dict-manage>
    <!-- end 新建修改原因 -->
  </div>
</template>
<script>
import {
  MEMBERSHIP_API_MEMBERREMARK_DELETEMEMBERREMARK,
  MEMBERSHIP_API_MEMBERREMARK_CREATEMEMBERREMARK,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_MEMBERREMARK_GETMEMBERREMARKLIST
} from '@/apis/membership.js'
import MemberDictManage from '@/components/scrm/memberDictManage'
import {
  SettingOptionTypes
} from '@/enums/membership.js'
import userInfo from '@/components/scrm/userInfo.vue'
export default {
  props: {
    addRemarkVisible: Boolean,
    currUserInfo: Object,
  },
  components: {
    userInfo,
    MemberDictManage
  },
  data() {
    return {
      remarkOptions: [], // 备注项目下拉列表
      addRemarkForm: {
        content: '',
        settingOptionId: '',
        settingOptionName: ''
      }, // 添加备注信息
      addRemarkData: [], // 备注列表
      visible: this.addRemarkVisible,
      settingOptionTypes: SettingOptionTypes,
      addRemarkRule: {
        content: [
          {
            required: true, message: '请填写备注内容', trigger: 'blur'
          },
          {
            min: 0, max: 200, message: '长度在200个字符', trigger: 'blur'
          }
        ],
        settingOptionId: [
          {
            required: true, message: '请选择备注项目', trigger: 'change'
          }
        ]
      }, // 添加备注校验
      dictsDialog: false,
      loading: false, // 按钮loading效果
    }
  },
  methods: {
    // 提交添加备注
    submitAddRemark(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const para = {
            ...this.addRemarkForm,
            memberId: this.currUserInfo.memberId,
            aliasName: this.currUserInfo.aliasName,
            trueName: this.currUserInfo.trueName
          }
          this.loading = true
          MEMBERSHIP_API_MEMBERREMARK_CREATEMEMBERREMARK(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.$message({
                showClose: true,
                message: '成功添加备注',
                type: 'success'
              })
              this.getMemberRemarkList()
              this.loading = false
            }
          })
        }
      })
    },
    // 删除添加备注记录
    onDeleteRemarkClick(memberRemarkId) {
      const para = {
        memberRemarkId
      }
      MEMBERSHIP_API_MEMBERREMARK_DELETEMEMBERREMARK(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            showClose: true,
            message: '成功删除备注',
            type: 'success'
          })
          this.getMemberRemarkList()
        }
      })
    },
    // 选择备注项目
    settingChang(val) {
      const obj = this.remarkOptions.find((item) => {
        return item.settingOptionId === val
      })
      this.addRemarkForm.settingOptionName = obj.name
    },
    // 获取备注项目下拉列表
    getRemarkOptions() {
      const para = {
        type: this.settingOptionTypes.MemberRemark
      }
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.remarkOptions = res.data.Data
        }
      })
    },
    // 获取用户备注列表
    getMemberRemarkList() {
      const para = {
        memberId: this.currUserInfo.memberId
      }
      MEMBERSHIP_API_MEMBERREMARK_GETMEMBERREMARKLIST(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.addRemarkData = res.data.Data
        }
      })
    },
    // modal关闭前重置form的值
    resetForm(formName) {
      this.$emit('closeClick', false)
      this.$refs[formName].resetFields()
    },
    reasonChange(data) {
      this.remarkOptions = data
    },
  },
  watch: {
    addRemarkVisible(val) {
      this.visible = val
      if (val) {
        this.getMemberRemarkList()
        this.getRemarkOptions()
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
.addRemarkModal {
  border-right: none;
}
.elDialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog {
    min-width: 750px;
  }
}
.entry-record-b-box {
  height: 339px;
  line-height: 339px;
  margin-top: 10px;
  border-top: 1px solid $d;
  text-align: center;
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
        font-size: 12px;
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
.icon-set {
  font-size: 17px;
  position: absolute;
  top: 6px;
  margin-left: 7px;
  color: #399fe5;
  cursor: pointer;
}
</style>

