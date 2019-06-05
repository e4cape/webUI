<template>
  <div class="content">
    <div class="border-1px">
      <div class="created-box">
        <div class="preview m-r-20">
          <preview
            :cardData="form"
            :cardBgiUrl="cardBgiUrl"
            :logoImage="logoImage"
          ></preview>
        </div>
        <div
          class="create-form"
          v-loading="uploading"
        >
          <el-form
            :model="form"
            ref="createForm"
            label-width="100px"
            :rules="createRules"
          >
            <div class="card-item-title">基本信息</div>
            <el-form-item label="卡片背景">
              <el-radio-group
                name="radioGroupBgType"
                v-model="bgType"
              >
                <el-radio :label="1">颜色</el-radio>
                <el-radio :label="3">图片</el-radio>
              </el-radio-group>
              <div v-if="bgType == 1">
                <el-color-picker
                  name="colorPickerBgcChange"
                  v-model="backgroundColor"
                  :predefine="backgRoundColorList"
                  popper-class="color-define"
                  @change="bgcChange"
                  color-format="hex"
                >
                </el-color-picker>
              </div>
              <div v-else>
                <uploadImgByBtn
                  :Root="$root.filePaths.SCORING_WXCARD"
                  @uploadSucc="uploadSucc"
                >上传图片</uploadImgByBtn>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >建议：像素1000*600，格式：jpg、png、jpeg，大小：1M以内</div>
                <img
                  class="upload-img"
                  :src="cardBgiUrl"
                  alt=""
                >
              </div>
            </el-form-item>
            <el-form-item
              label="卡片名称"
              prop="CardTitle"
            >
              <el-input
                name="inputCardTitle"
                v-model="form.CardTitle"
                style="max-width:312px"
                maxlength="9"
                placeholder="必填，最多9个汉字或等量字符"
              ></el-input>
              <span> {{form.CardTitle.length}}/9</span>
            </el-form-item>
            <div class="card-item-title">会员卡详情</div>
            <el-form-item
              label="特权说明"
              prop="PrerogAtive"
            >
              <el-input
                name="inputPrerogAtive"
                v-model="form.PrerogAtive"
                type="textarea"
                style="max-width:312px"
                :maxlength="1024"
                :rows="4"
                placeholder="必填，最多1024个汉字或等量字符"
              ></el-input>
              <span> {{form.PrerogAtive.length}}/1024</span>
            </el-form-item>
            <el-form-item label="使用须知">
              <el-input
                name="inputDescription"
                v-model="form.Description"
                type="textarea"
                style="max-width:312px"
                :maxlength="300"
                :rows="4"
                placeholder="非必填，最多300个汉字或等量字符"
              ></el-input>
              <span> {{form.Description.length}}/300</span>
            </el-form-item>
            <el-form-item>
              <el-button
                name="btnSubmit"
                type="primary"
                @click="submit"
                :loading="$store.getters.is_loading"
              >提交</el-button>
              <el-button
                name="btnCancel"
                @click="$router.push('/member/card/detail')"
              >取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {
  SCORING_API_WX_CARD_USERCARDDETAIL, // 会员卡管理 - 会员卡
  SCORING_API_WX_CARD_CREATEUSERCARD, // 会员卡管理 - 创建会员卡
  SCORING_API_WX_CARD_MODIFYUSERCARD // 会员卡管理 - 修改会员卡
} from '@/apis/scoring'

import { BackgRoundColor } from '@/enums/component'

import { DOMAIN_IMAGE, DOMAIN_TEMP } from '@/configs/appSettings'

import uploadImgByBtn from '@/components/common/uploadImgByBtn'
import preview from './preview'

export default {
  components: {
    preview,
    uploadImgByBtn
  },
  data() {
    return {
      DOMAIN_IMAGE,
      DOMAIN_TEMP,
      backgroundColor: BackgRoundColor.Types[BackgRoundColor.Color010],
      bgType: 1,
      form: {
        BackgRoundColor: BackgRoundColor.Color010,
        BackgRoundUrl: '',
        CardTitle: '',
        PrerogAtive: '',
        Description: ''
      },
      logoImage: '',
      cardBgiUrl: '',
      createRules: {
        CardTitle: [
          {
            required: true,
            message: '请输入卡片名称'
          }
        ],
        PrerogAtive: [
          {
            required: true,
            message: '请输入特权说明'
          },
          {
            max: 1024,
            message: '长度不超过 1024 个字符'
          }
        ]
      },
      backgRoundColorList: [],
      isLoading: true,
      uploading: false
    }
  },
  created() {
    this.init()
    this.getEnums()
  },
  methods: {
    init() {
      this.isLoading = true
      SCORING_API_WX_CARD_USERCARDDETAIL().then(res => {
        if (res.data.Code === 'CORRECT') {
          let memberBasic = res.data.Data.MemberBasic
          if (memberBasic) {
            this.form = Object.assign({}, this.form, memberBasic)
            this.logoImage = res.data.Data.LogoImage || ''
            /* this.form.BackgRoundColor = memberBasic.BackgRoundColor
            this.form.BackgRoundUrl = memberBasic.BackgRoundUrl
            this.form.CardTitle = memberBasic.CardTitle
            this.form.PrerogAtive = memberBasic.PrerogAtive
            this.form.Description = memberBasic.Description */
            if (memberBasic.BackgRoundUrl) {
              this.bgType = 3
            } else {
              this.bgType = 1
            }
            /* this.cardBgiUrl =
              DOMAIN_IMAGE + this.form.BackgRoundUrl.replace('{0}', '1000x600') */
            if (memberBasic.BackgRoundUrl) {
              this.cardBgiUrl =
                this.$root.settings.DOMAIN_IMG_FILE + memberBasic.BackgRoundUrl
            }
            this.backgroundColor =
              BackgRoundColor.Types[memberBasic.BackgRoundColor]
          }
        }
      })
    },
    submit() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          if (this.bgType == 3 && !this.form.BackgRoundUrl) {
            this.$message({
              type: 'warning',
              message: '请上传图片'
            })
          } else {
            if (this.bgType == 1) {
              this.form.BackgRoundUrl = ''
            }
            this.$store.commit('SET_BTN_LOADING', true)
            const { BackgRoundColor } = this.form
            if (this.form.CardId) {
              SCORING_API_WX_CARD_MODIFYUSERCARD(
                Object.assign({}, this.form, {
                  BackgRoundColor: +BackgRoundColor
                })
              ).then(res => {
                if (res.data.Code === 'CORRECT') {
                  this.$router.push('/member/card/detail')
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
            } else {
              SCORING_API_WX_CARD_CREATEUSERCARD(
                Object.assign({}, this.form, {
                  BackgRoundColor: +BackgRoundColor
                })
              ).then(res => {
                if (res.data.Code === 'CORRECT') {
                  this.$router.push('/member/card/detail')
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
            }
          }
        }
      })
    },
    bgcChange(val) {
      for (let key in BackgRoundColor.Types) {
        if (val == BackgRoundColor.Types[key].toUpperCase()) {
          this.form.BackgRoundColor = key
        }
      }
    },
    getEnums() {
      for (let key in BackgRoundColor.Types) {
        this.backgRoundColorList.push(BackgRoundColor.Types[key])
      }
    },
    // 修改图片
    uploadSucc(ImageUrl) {
      this.cardBgiUrl = this.$root.settings.DOMAIN_IMG_FILE + ImageUrl
      this.form.BackgRoundUrl = ImageUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.created-box {
  padding: 22px 30px;
  display: flex;
  .create-form {
    flex: 1;
    .card-item-title {
      margin-bottom: 20px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: bold;
      color: #006db8;
      border-bottom: 2px solid #4e9ace;
    }
    .upload-img {
      width: 180px;
      height: 107px;
    }
    .text {
      color: #999;
      font-size: 12px;
    }
    .conditions {
      // max-width: 400px;
      p {
        padding-left: 13px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #ddd;
        background-color: #f5f5f5;
      }
      .item {
        display: flex;
        justify-content: space-around;
        border: 1px solid #ddd;
        border-top: none;
        span {
          flex: 1;
          padding: 0 10px;
          text-align: center;
          &:first-child {
            border-right: 1px solid #ddd;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.color-define {
  .el-color-dropdown__main-wrapper {
    display: none !important;
  }
  .el-color-dropdown__btns {
    .el-input {
      display: none;
    }
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
}
</style>

