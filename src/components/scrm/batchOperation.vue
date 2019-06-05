<template>
  <div>
    <el-dialog class="batchDialog" :title="title" :visible.sync="visible" width="500px" @close="cancelSetting('batchSetting')">
      <el-form :model="batchSetting" ref="batchSetting">
        <el-form-item prop="settingOption" v-if="type != 3">
          <el-select name="settingOption" v-model="batchSetting.settingOption" placeholder="请选择" filterable>
            <el-option label="请选择" value></el-option>
            <el-option v-for="item in batchOption" :key="item.settingOptionId" :label="item.displayName" :value="item.settingOptionId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 3" prop="memberTagIds">
          <el-select name="memberTagIds" v-model="batchSetting.memberTagIds" @change="memberTagChages" multiple placeholder="请选择" filterable>
            <el-option v-for="item in batchOption" :key="item.settingMemberTagId" :label="item.name" :value="item.settingMemberTagId"></el-option>
          </el-select>
          <i class="icon-set" @click="openSettingVisible"></i>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnConfirm" type="primary" @click="confirmSetting('batchSetting')">确 定</el-button>
        <el-button name="btnCancel" @click="cancelSetting('batchSetting')">取 消</el-button>
      </div>
    </el-dialog>
    <popup-Table
      :memberTagIds="this.batchSetting.memberTagIds"
      :gradeVisible="gradeVisible"
      :title="settingTitle"
      :leftTitle="leftTitle"
      :rightTitle="rightTitle"
      :settingData="settingData"
      v-on:confirmClick="confirmClick"
      v-on:closeClick="closeClick"
      :type="modalType"
    />
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_MEMBER_BATCHSETMEMBERTAGS,
  MEMBERSHIP_API_MEMBER_BATCHSETMEMBERLEVEL,
  MEMBERSHIP_API_MEMBER_BATCHSETMEMBERGROUP,
  MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS
} from '@/apis/membership.js'
import popupTable from '@/components/scrm/popupTable'
export default {
  props: {
    batchVisible: Boolean,
    title: String,
    // batchOption: Array,
    selected: Array,
    type: String
  },
  components: {
    popupTable
  },
  data() {
    return {
      visible: this.batchVisible,
      batchSetting: {
        settingOption: '',
        memberTagIds: [],
        settingMemberTags: []
      },
      gradeVisible: false, // 自定义标签弹窗
      settingTitle: '',
      leftTitle: '',
      rightTitle: '',
      modalType: '',
      settingData: {
      },
      multipleOptions: [],
      batchOption: []
    }
  },
  methods: {
    confirmSetting(formName) {
      const arr = this.selected.map(item => item.memberId)
      if (this.type == 1) {
        const para = {
          memberIdList: arr,
          settingOptionGroupId: this.batchSetting.settingOption
        }
        MEMBERSHIP_API_MEMBER_BATCHSETMEMBERGROUP(para).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$refs[formName].resetFields()
            this.$message({
              showClose: true,
              message: '批量设置成功',
              type: 'success'
            })
            this.$emit('batchConfirm', false)
          }
        })
      }
      if (this.type == 2) {
        const para = {
          memberIdList: arr,
          settingOptionLevelId: this.batchSetting.settingOption
        }
        MEMBERSHIP_API_MEMBER_BATCHSETMEMBERLEVEL(para).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$refs[formName].resetFields()
            this.$emit('batchConfirm', false)
            this.$message({
              showClose: true,
              message: '批量设置成功',
              type: 'success'
            })
          }
        })
      }
      if (this.type == 3) {
        const para = {
          memberSNList: arr,
          settingMemberTags: this.batchSetting.settingMemberTags
        }
        MEMBERSHIP_API_MEMBER_BATCHSETMEMBERTAGS(para).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$refs[formName].resetFields()
            this.$emit('batchConfirm', false)
            this.$message({
              showClose: true,
              message: '批量设置成功',
              type: 'success'
            })
          }
        })
      }
    },
    getMemberTagObj(val, opt) {
      return val.map(value => {
        for (var itm of opt) {
          if (itm.settingMemberTagId == value) {
            return itm
          }
        }
        return null
      })
    },
    memberTagChages(val) {
      const arr = this.getMemberTagObj(val, this.batchOption)
      this.batchSetting.settingMemberTags = arr
    },
    cancelSetting(formName) {
      this.$refs[formName].resetFields()
      this.$emit('closeClick', false)
    },
    openSettingVisible() {
      this.getClientLabelOptionList()
      this.settingTitle = '标签设置'
      this.leftTitle = '项目'
      this.rightTitle = '操作'
      this.gradeVisible = true
      this.modalType = 3
    },
    reasonChange(data) {
      this.batchOption = data
    },
    confirmClick(val) {
      this.gradeVisible = val
      this.getClientLabelOptionList()
    },
    closeClick(val) {
      this.gradeVisible = val
    },
    // 获取客户标签下拉列表
    getClientLabelOptionList() {
      MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          const arr = []
          res.data.Data.forEach(item => {
            arr.push({ name: item.name, settingMemberTagId: item.settingMemberTagId })
          })
          this.batchOption = arr
          const obj = {
            data: arr
          }
          this.settingData = obj
        }
      })
    },
    // 获取客户分组下拉列表
    getClientGroupList() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.batchOption = res.data.Data
        }
      })
    },
    // 获取会员等级下拉列表
    getMemberLevels() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.batchOption = res.data.Data
        }
      })
    }
  },
  mounted() {
    if (this.type == 1) {
      this.getClientGroupList()
    }
    if (this.type == 2) {
      this.getMemberLevels()
    }
    if (this.type == 3) {
      this.getClientLabelOptionList()
    }
  },
  watch: {
    batchVisible(val) {
      this.visible = val
      if (val && this.type == 1) {
        this.getClientGroupList()
      }
      if (val && this.type == 2) {
        this.getMemberLevels()
      }
      if (val && this.type == 3) {
        this.getClientLabelOptionList()
      }
    }
    // type(val,oldVal) {

    // },
    // deep: true
  }
}
</script>

<style scoped lang="scss">
.batchDialog {
  /deep/ .el-dialog__body {
    padding: 50px 0 !important;
    text-align: center;
  }
  .icon-set {
    font-size: 17px;
    position: absolute;
    top: 6px;
    margin-left: 7px;
    color: #399fe5;
    cursor: pointer;
  }
}
</style>