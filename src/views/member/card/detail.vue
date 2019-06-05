<template>
  <div class="content">
    <div
      v-loading="isLoading"
      style="minHeight:200px"
    >
      <div v-if="!isLoading">
        <div v-if="hadCard">
          <div
            style="border: 1px solid #e5e5e5"
            class="p-10"
          >
            <el-row
              type="flex"
              style="align-items: center"
            >
              <el-col :span="6">
                <p>会员卡ID：{{cardDetail.CardCode}}</p>
              </el-col>
              <el-col :span="6">
                <el-button
                  name="btnGetWxCardQrCode"
                  type="primary"
                  @click="getWxCardQrCode"
                >投放</el-button>
                <el-button
                  name="btnModify"
                  @click="$router.push('/member/card/edit')"
                  v-if="characterType == CharacterType.Company||wechatSettingType == CompanyBasicMountType.Store"
                >修改</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="card-detail p-t-10">
            <preview
              :cardData="cardDetail"
              :cardBgiUrl="cardBgiUrl"
              :logoImage="logoImage"
              class="m-r-10"
            ></preview>
            <div
              class="right p-10"
              style="border: 1px solid #e5e5e5"
            >
              <div>
                <p>卡片背景：</p>
                <p v-if="!cardDetail.BackgRoundUrl">颜色
                  <span
                    class="m-l-10 p-x-20"
                    :style="{backgroundColor:bgcColor.Types[cardDetail.BackgRoundColor]}"
                  ></span>
                </p>
                <p
                  v-else
                  style="display:flex"
                >图片 <img
                    class="card-bg"
                    v-if="cardDetail.BackgRoundUrl"
                    :src="cardBgiUrl"
                    alt=""
                  ></p>
              </div>
              <div class="p-t-10">
                <p>卡片名称：</p>
                <p>{{cardDetail.CardTitle}}</p>
              </div>
              <div class="p-t-10">
                <p>特权说明：</p>
                <p>{{cardDetail.PrerogAtive}}</p>
              </div>
              <div class="p-t-10">
                <p>使用须知：</p>
                <p>{{cardDetail.Description}}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="no-created-box"
          v-else
        >
          <div class="card"></div>
          <p class="p-y-10">抱歉，您还没有创建微信会员卡！</p>
          <div>
            <el-button
              name="btnCreateMembercard"
              type="primary"
              @click="createMembercard"
              v-if="characterType == CharacterType.Company||wechatSettingType == CompanyBasicMountType.Store"
            >立即创建</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="投放"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <div v-loading="dialogLoading">
        <div
          class="p-y-10"
          style="text-align: center"
        >
          <p>可将二维码置于台卡或宣传海报上，引导客户扫码领卡</p>
          <div class="p-t-10">
            <img
              ref="qrCode"
              :src="link"
              alt=""
              style="width:200px;height:200px"
            >
          </div>
          <div>若需保存二维码，请点击鼠标右键将其另存为图片</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import {
  SCORING_API_WX_CARD_USERCARDDETAIL //  会员卡管理 - 会员卡
} from '@/apis/scoring'

import { CharacterType } from '@/enums/common'
import { CompanyBasicMountType } from '@/enums/merchant'
import { BackgRoundColor } from '@/enums/component'

import { DOMAIN_APIS, DOMAIN_BASE } from '@/configs/appSettings'
import preview from './preview'
export default {
  components: {
    preview
  },
  data() {
    return {
      CharacterType,
      CompanyBasicMountType,
      bgcColor: BackgRoundColor,
      logoImage: '',
      cardBgiUrl: '',
      hadCard: false,
      cardDetail: {},
      isLoading: true,
      dialogVisible: false,
      link: '',
      dialogLoading: false
    }
  },
  created() {
    this.getCardDetail()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  methods: {
    createMembercard() {
      this.$router.push('/member/card/create')
    },
    getCardDetail() {
      this.isLoading = true
      SCORING_API_WX_CARD_USERCARDDETAIL()
        .then(res => {
          if (res.data.Data.IsCreate) {
            this.hadCard = true
            this.cardDetail = res.data.Data.MemberBasic
            this.logoImage = res.data.Data.LogoImage || ''
            if (this.cardDetail.BackgRoundUrl) {
              this.cardBgiUrl =
                this.$root.settings.DOMAIN_IMG_FILE +
                this.cardDetail.BackgRoundUrl.replace('{0}', '1000x600')
            }
          } else {
            this.hadCard = false
          }
          this.isLoading = false
        })
        .catch(() => (this.isLoading = false))
    },
    getWxCardQrCode() {
      this.dialogVisible = true
      this.dialogLoading = true
      const { AuthorizerId, CardCode } = this.cardDetail
      axios
        .get(
          `${
            DOMAIN_APIS.Cloudcomponentapi
          }/api/authorizeror/sendwxcardqrcode?AuthorizerId=${AuthorizerId}&CardCode=${CardCode}&URL=${
            DOMAIN_BASE.cardVip
          }`
        )
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.link = res.data.Data && res.data.Data.qrcode_url
          } else {
            this.$message({
              type: 'warning',
              message: res.data.Message
            })
          }
          this.dialogLoading = false
        })
        .catch(err => {
          this.dialogLoading = false
          throw err
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.card-detail {
  display: flex;
  .right {
    flex: 1;
    > div {
      display: flex;
      p {
        &:first-child {
          width: 80px;
        }
        &:last-child {
          width: 1%;
          flex: 1;
          word-break: break-all;
        }
      }
      .card-bg {
        margin-left: 10px;
        width: 319px;
        height: 189px;
        border-radius: 10px;
      }
    }
  }
}
.no-created-box {
  margin: 0 auto;
  padding: 60px 0;
  width: 400px;
  text-align: center;
  .card {
    width: 100%;
    height: 240px;
    // border-radius: 10px;
    // background-color: #333;
    background: url(/static/images/membercard_icon3.png) no-repeat;
  }
}
</style>

