<template>
  <div class="content">
    <el-row>
      <el-col :span="6">
        <!-- 修改头像 -->
        <div style=" padding: 10px">
          <uploadImg
            :styleObj="{
                margin: '0 auto',
                width: '120px',
                height: '120px',
                border: 'solid 1px #ddd',
                borderRadius:' 50%',
                overflow: 'hidden'}"
            :uploadImageUrl="form.ImageUrl ? DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0') : form.ImageUrl"
            :Root="SETTING_STORE"
            @uploadSucc="(url) => {this.form.ImageUrl = url}"
          ></uploadImg>
        </div>
        <!-- 员工账号 -->
        <p class="user-id">员工账号：{{this.$store.getters.user_session.LoginId}}</p>
      </el-col>
      <el-col :span="10">
        <!-- 表单内容 -->
        <el-form
          class="user-form fix-w"
          :model="form"
          label-width="100px"
          label-position="right"
          :rules="rules"
          ref="userForm"
        >
          <el-form-item
            label="昵称"
            prop="AliasName"
          >
            <el-input
              name="AliasName"
              v-model="form.AliasName"
              @blur="form.AliasName=form.AliasName.trim()"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="真实姓名"
            prop="TrueName"
          >
            <el-input
              name="TrueName"
              v-model="form.TrueName"
              @blur="form.TrueName=form.TrueName.trim()"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group
              name="SexyType"
              v-model="form.SexyType"
            >
              <el-radio
                v-for="(item,index) in sexyType.Types"
                :key="index"
                :label="parseInt(index)"
              >{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="部门"
            v-if="$store.getters.user_session.CharacterType == characterType.Store"
          >
            <el-input
              name="Department"
              disabled
              v-model="form.Department"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="职位"
            v-if="$store.getters.user_session.CharacterType == characterType.Store"
          >
            <el-input
              name="Position"
              disabled
              v-model="form.Position"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="工号">
            <el-input
              name="JobCode"
              v-model="form.JobCode"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input
              name="Mobile"
              v-model="form.Mobile"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ">
            <el-input
              name="QQ"
              v-model="form.QQ"
              :maxlength="12"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信">
            <el-input
              name="Wechart"
              v-model="form.Wechart"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="Email"
          >
            <el-input
              name="Email"
              v-model="form.Email"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="住址">
            <el-input
              name="CurrAddr"
              v-model="form.CurrAddr"
              :maxlength="150"
            ></el-input>
          </el-form-item>
          <el-form-item label="入职时间">
            <el-input
              name="SignedTime"
              format="yyyy-MM-dd"
              v-model="form.SignedTime"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button
              name="save"
              type="primary"
              @click="editUserData($event)"
              :loading="$store.getters.is_loading"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- End 个人设置表单 -->
  </div>
</template>

<script>
import { SETTING_STORE } from '@/configs/filePaths.js'
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { SexyType, CharacterType } from '@/enums/common'
import {
  MERCHANT_API_SECURITY_VITA_GET,
  MERCHANT_API_SECURITY_VITA_UPDATE
} from '@/apis/merchant'
import dayjs from 'dayjs'

import uploadImg from '@/components/common/uploadImg.vue'
export default {
  data() {
    return {
      SETTING_STORE,
      DOMAIN_IMG_FILE,
      characterType: CharacterType,
      positions: [],
      departments: [],
      sexyType: SexyType,
      form: {
        ImageUrl: ''
      },
      rules: {
        Email: {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur,change'
        },
        AliasName: {
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        },
        TrueName: {
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }
      }
    }
  },
  components: {
    uploadImg
  },
  methods: {
    // 获取个人信息
    getUserData() {
      MERCHANT_API_SECURITY_VITA_GET({
        UserId: this.$store.getters.user_session.UserId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          let value = this.form.SignedTime || '1900/01/01 00:00:00'
          this.form.SignedTime =
            !value ||
            value === '1900/01/01 00:00:00' ||
            value === '1900-01-01 00:00:00.000000' ||
            value === '9999/12/31 23:59:59'
              ? ''
              : dayjs(value).format('YYYY-MM-DD')
        }
      })
    },
    // 保存个人信息
    editUserData(e) {
      e.currentTarget.blur()
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          this.$confirm('是否保存修改?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$store.commit('SET_BTN_LOADING', true)
              MERCHANT_API_SECURITY_VITA_UPDATE(this.form).then(res => {
                this.$store.commit('SET_BTN_LOADING', false)
                if (res.data.Code === 'CORRECT') {
                  this.$message.success(res.data.Message)
                  this.$root.getUserInfo()
                } else {
                  this.$message.error(res.data.Message)
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
            })
            .catch(() => {
              this.$store.commit('SET_BTN_LOADING', false)
            })
        }
      })
    }
  },
  mounted() {
    this.getUserData()
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader {
  position: relative;
  display: block;
  z-index: 9;
  margin: 40px auto 20px;
  width: 120px;
  height: 120px;
  border: solid 1px #ddd;
  border-radius: 50%;
  overflow: hidden;
  .uploader {
    width: 120px;
    height: 120px;
    margin-top: 0;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 100%;
      min-height: 100%;
      z-index: 5;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #007ed5;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.user-id {
  font-size: 14px;
  color: #333;
  text-align: center;
}
.user-form {
  margin-top: 40px;
}
.btn-primary {
  display: block;
  margin: 22px 0 22px 100px;
}
</style>
