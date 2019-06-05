<template>
  <!-- 编辑会员资料 -->
  <el-dialog
    :title="operating ? '新建线下会员' : '编辑会员资料'"
    :visible.sync="visible"
    class="elDialog"
    @close="closeEditClient('editClientForm')"
  >
    <el-form
      :model="currUserInfos"
      ref="editClientForm"
      label-width="100px"
      class="editClientForm"
      :rules="entryRecordRules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="会员卡号"
            prop="vipCardNo"
          >
            <el-input
              name="vipCardNo"
              :disabled="hasVipCardNo"
              v-model="currUserInfos.vipCardNo"
              placeholder="请输入会员卡号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="姓名"
            prop="trueName"
          >
            <el-input
              name="trueName"
              v-model="currUserInfos.trueName"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="mobile"
            label="手机"
            required
          >
            <el-input
              name="mobile"
              v-model="currUserInfos.mobile"
              placeholder="请输入手机"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="昵称"
            prop="aliasName"
          >
            <el-input
              name="aliasName"
              v-model="currUserInfos.aliasName"
              placeholder="请输入昵称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="性别"
            prop="sexyType"
          >
            <el-select
              name="sexyType"
              v-model="currUserInfos.sexyType"
              placeholder="请选择"
              filterable
            >
              <el-option
                label="男"
                :value="1"
              ></el-option>
              <el-option
                label="女"
                :value="3"
              ></el-option>
              <el-option
                label="无"
                :value="5"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="地区"
            prop="areaArr"
          >
            <el-cascader
              name="areaArr"
              :options="area"
              v-model="currUserInfos.areaArr"
              @change="areaChange"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期">
            <el-date-picker
              name="birthday"
              v-model="currUserInfos.birthday"
              :picker-options="pickerOptions"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              @change="birthdayChange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日">
            <el-col :span="16">
              <el-cascader
                name="dateOfBirthArray"
                :options="date"
                v-model="currUserInfos.dateOfBirthArray"
                style="margin-right: 10px"
              ></el-cascader>
            </el-col>
            <el-col :span="6">
              <el-checkbox
                name="lunarCalendar"
                v-model="currUserInfos.lunarCalendar"
              >农历</el-checkbox>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isOffline"
        >
          <el-form-item
            label="入会时间"
            prop="joinTime"
          >
            <el-date-picker
              name="joinTime"
              v-model="currUserInfos.joinTime"
              :unlink-panels="true"
              :picker-options="pickerOptions"
              type="date"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="婚姻状况"
            prop="marriageStatus"
          >
            <el-select v-model="currUserInfos.marriageStatus">
              <el-option
                v-for="(item, index) in marriageStatus.Types"
                :value="Number(item.key)"
                :label="item.title"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="纪念日"
            prop="commemorate"
          >
            <el-date-picker
              name="commemorate "
              v-model="currUserInfos.commemorate"
              :unlink-panels="true"
              :picker-options="pickerOptions"
              type="date"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="QQ"
            prop="qq"
          >
            <el-input
              name="qq"
              maxlength="30"
              v-model="currUserInfos.qq"
              placeholder="请输入QQ号码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input
              name="email"
              maxlength="30"
              v-model="currUserInfos.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="会员等级"
            prop="settingOptionLevelId"
          >
            <el-select
              name="settingOptionLevelId"
              v-model="currUserInfos.settingOptionLevelId"
              placeholder="请选择"
              filterable
            >
              <el-option
                label="请选择"
                value="0"
              ></el-option>
              <el-option
                v-for="item in level"
                :key="item.settingOptionId"
                :label="item.displayName"
                :value="item.settingOptionId"
              ></el-option>
            </el-select>
            <i
              name="btnOpenLevelModal"
              class="icon-set"
              @click="openLevelModal"
            ></i>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="客户分组"
            prop="settingOptionGroupId"
          >
            <el-select
              name="settingOptionGroupId"
              filterable
              v-model="currUserInfos.settingOptionGroupId"
              placeholder="请选择"
            >
              <el-option
                label="请选择"
                value="0"
              ></el-option>
              <el-option
                v-for="item in grade"
                :key="item.settingOptionId"
                :label="item.displayName"
                :value="item.settingOptionId"
              ></el-option>
            </el-select>
            <i
              name="btnOpenGroupsModal"
              class="icon-set"
              @click="openGroupsModal"
            ></i>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isOffline"
        >
          <el-form-item
            label="历史积分"
            prop="historyScore"
          >
            <el-input-number
              name="historyScore"
              v-model="currUserInfos.historyScore"
              controls-position="right"
              placeholder="请输入历史积分"
              :step="1"
              :min="0"
              :max="9999999"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isOffline"
        >
          <el-form-item label="积分有效日期">
            <el-date-picker
              name="scoreExpireTime"
              v-model="currUserInfos.scoreExpireTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="客户标签"
            prop="memberTagIds"
          >
            <el-select
              name="memberTagIds"
              v-model="currUserInfos.memberTagIds"
              @change="memberTagChages"
              multiple
              filterable
              placeholder="请选择"
            >
              <!-- <el-option label="请选择" :value="0"></el-option> -->
              <el-option
                v-for="item in multipleOptions"
                :key="item.settingMemberTagId"
                :label="item.name"
                :value="item.settingMemberTagId"
              ></el-option>
            </el-select>
            <i
              name="btnOpenLabelModal"
              class="icon-set"
              @click="openLabelModal"
            ></i>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              name="remark"
              type="textarea"
              class="remarkText"
              v-model="currUserInfos.remark"
              placeholder="请输入进店后跟进内容，最多200字"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 弹窗内容 end-->
    <!-- 按钮 start-->
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnEdit"
        v-if="!operating"
        type="primary"
        @click="submitEditClient('editClientForm')"
      >确 定</el-button>
      <el-button
        name="btnNew"
        v-if="operating"
        type="primary"
        :loading="btnLoading"
        @click="submitNewClient('editClientForm')"
      >确 定</el-button>
      <el-button
        name="btnClose"
        @click="closeEditClient('editClientForm')"
      >取 消</el-button>
    </div>
    <!-- 按钮 end-->
  </el-dialog>
</template>

<script>
import Md from '@/datas/date/md.js'
import {
  MEMBERSHIP_API_SETTINGAREA_GETAREAS,
  MEMBERSHIP_API_MEMBER_UPDATEMEMBER,
  MEMBERSHIP_API_MEMBER_CREATEMEMBER,
  MEMBERSHIP_API_MEMBER_GETMEMBERTAGS
} from '@/apis/membership.js'
import { MarriageStatus } from '@/enums/membership'
import dayjs from 'dayjs'
export default {
  props: {
    currUserInfo: {
      type: Object,
      default: new Object()
    },
    editClientVisible: {
      type: Boolean,
      default: false
    },
    level: {
      type: Array,
      default: new Array()
    },
    grade: {
      type: Array,
      default: new Array()
    },
    multipleOptions: {
      type: Array,
      default: new Array()
    },
    type: {
      type: Number,
      default: 0
    },
    isOffline: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      visible: this.editClientVisible,
      area: [], // 地区
      date: Md, // 日期(月/日)
      operating: this.type || 0,
      oldMobile: '',
      marriageStatus: MarriageStatus,
      hasVipCardNo: false, // 判断当前是否有会员卡号
      btnLoading: false,
      entryRecordRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'change'
          },
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            min: 0,
            max: 200,
            message: '备注必须在200字符以内',
            trigger: 'change'
          }
        ],
        vipCardNo: [
          {
            min: 0,
            max: 50,
            message: '卡号必须在50字以内',
            trigger: 'change'
          }
        ],
        aliasName: [
          {
            min: 0,
            max: 20,
            message: '昵称必须在20字以内',
            trigger: 'change'
          }
        ],
        qq: [
          {
            // 验证QQ号码
            validator: (rule, value, callback) => {
              const pomis = /^[1-9][0-9]{4,}$/
              if (!pomis.test(value) && value) {
                callback(new Error('qq号码有误'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        trueName: [
          {
            min: 0,
            max: 10,
            message: '姓名必须在10个字以内',
            trigger: 'change'
          }
        ],
        joinTime: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      }, // 校验
      pickerOptions: {
        disabledDate(date) {
          let now = new Date()
          return (
            Date.parse(date) >
              Date.parse(
                now.getFullYear() +
                  '/' +
                  (now.getMonth() + 1) +
                  '/' +
                  now.getDate()
              ) || date.getTime() < new Date('1900-01-01').getTime()
          )
        }
      }
    }
  },
  computed: {
    currUserInfos() {
      const { commemorate, birthday } = this.currUserInfo
      return Object.assign(this.currUserInfo, {
        commemorate: commemorate == '1900-01-01 00:00:00' ? '' : commemorate,
        birthday: birthday == '1900-01-01 00:00:00' ? '' : birthday
      })
    }
  },
  methods: {
    // 获取地址下拉
    getAreaList() {
      MEMBERSHIP_API_SETTINGAREA_GETAREAS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.area = res.data.Data
        }
      })
    },
    // 地址发生改变
    areaChange(val) {
      if (val[0] != '') {
        const arr = this.getCascaderObj(val, this.area)
        this.currUserInfos.provinceName = arr[0].label
        this.currUserInfos.cityName = arr[1].label
        this.currUserInfos.townName = arr[2].label
        this.currUserInfos.provinceId = parseInt(arr[0].value)
        this.currUserInfos.cityId = parseInt(arr[1].value)
        this.currUserInfos.townId = parseInt(arr[2].value)
      }
    },
    getCascaderObj(val, opt) {
      return val.map(value => {
        for (var itm of opt) {
          if (itm.value == value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    // 编辑客户资料出生日期发生改变
    birthdayChange(val) {
      const month = dayjs(val).format('MM')
      const day = dayjs(val).format('DD')
      const arr = []
      arr.push(month, day)
      this.currUserInfos.dateOfBirthArray = arr
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
      const arr = this.getMemberTagObj(val, this.multipleOptions)
      this.currUserInfos.settingMemberTags = arr
    },
    // modal关闭前重置form的值
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开会员等级设置弹窗
    openLevelModal() {
      this.$emit('openLevel')
    },
    openGroupsModal() {
      this.$emit('openGroup')
    },
    openLabelModal() {
      this.$emit('openLabel')
    },
    // 编辑客户资料确认提交
    submitEditClient(formName) {
      if (
        this.operating &&
        this.currUserInfos.scoreExpireTime &&
        this.currUserInfos.scoreExpireTime < new Date()
      ) {
        return this.$message.error('积分有效期必须大于今天')
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.currUserInfos.settingMemberTags = this.getMemberTagObj(
            this.currUserInfos.memberTagIds,
            this.multipleOptions
          )
          this.currUserInfos.marriageStatus = this.currUserInfos.marriageStatus
            ? this.currUserInfos.marriageStatus
            : 1
          const para = {
            ...this.currUserInfos,
            lunarCalendar: this.currUserInfos.lunarCalendar ? 1 : 0,
            birthday: this.currUserInfos.birthday
              ? dayjs(this.currUserInfos.birthday).format('YYYY-MM-DD')
              : '1900-01-01',
            commemorate: this.currUserInfos.commemorate
              ? dayjs(this.currUserInfos.commemorate).format('YYYY-MM-DD')
              : '1900-01-01',
            mobile:
              this.currUserInfos.mobile != this.oldMobile
                ? this.currUserInfos.mobile
                : '',
            vipCardNo: this.hasVipCardNo ? '' : this.currUserInfos.vipCardNo
          }
          MEMBERSHIP_API_MEMBER_UPDATEMEMBER(para).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$emit('confirmClick', false)
            }
          })
        }
      })
    },
    // 获取用户标签
    getMemebrLabel() {
      if (this.operating) {
        return
      }
      MEMBERSHIP_API_MEMBER_GETMEMBERTAGS({
        memberId: this.currUserInfos.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.currUserInfos.memberTagIds = res.data.Data.memberTags.map(
            item => item.settingMemberTagId
          )
        }
      })
    },
    // 新建会员
    submitNewClient(formName) {
      if (
        this.currUserInfos.scoreExpireTime &&
        this.currUserInfos.scoreExpireTime < new Date()
      ) {
        return this.$message.error('积分有效期必须大于今天')
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.currUserInfos.marriageStatus =
            this.currUserInfos.marriageStatus === ''
              ? 1
              : this.currUserInfos.marriageStatus
          const para = {
            ...this.currUserInfos,
            lunarCalendar: this.currUserInfos.lunarCalendar ? 1 : 0,
            birthday: this.currUserInfos.birthday
              ? dayjs(this.currUserInfos.birthday).format('YYYY-MM-DD')
              : ''
          }
          this.btnLoading = true
          MEMBERSHIP_API_MEMBER_CREATEMEMBER(para).then(res => {
            this.btnLoading = false
            if (res.data.Code == 'CORRECT') {
              this.$message({
                showClose: true,
                message: '新建会员成功',
                type: 'success'
              })
              this.$emit('confirmClick', false)
            }
          })
        }
      })
    },
    closeEditClient(formName) {
      // this.visible = false
      this.$emit('closeClick', false)
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    this.oldMobile = this.currUserInfos.mobile
  },
  watch: {
    editClientVisible(val) {
      this.oldMobile = ''
      this.visible = val
      if (this.currUserInfos.vipCardNo) {
        this.hasVipCardNo = true
      } else {
        this.hasVipCardNo = false
      }
      if (val) {
        // 转换 “婚姻状况” 的类型 number => string
        this.oldMobile = this.currUserInfos.mobile
        this.getMemebrLabel()
        this.getAreaList()
      }
    },
    type(val) {
      this.operating = val
    },
    'currUserInfos.historyScore': function(val) {
      const index = String(val).indexOf('.')
      if (index > -1) {
        this.$nextTick(() => {
          this.currUserInfos.historyScore = String(val).substr(0, index)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.elDialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog {
    min-width: 750px;
  }
}
.editClientForm {
  padding-top: 15px;
  padding-right: 90px;
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

