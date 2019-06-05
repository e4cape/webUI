<template>
  <div class="card-preview">
    <div
      class="card"
      :style="{backgroundColor:bgcColor.Types[cardData.BackgRoundColor]||'#aaa'}"
    >
      <img
        class="img-bg"
        v-if="cardData.bgType==3||!cardData.bgType&&cardData.BackgRoundUrl"
        :src="cardBgiUrl"
        alt=""
      >
      <div class="card-content">
        <div class="top">
          <div class="left">
            <img
              class="log"
              :src="logoImage&&$root.settings.DOMAIN_IMG_FILE+logoImage.replace('{0}', '80x80')"
              alt=""
            >
            <div>
              <p>{{cardData.ShortName}}</p>
              <p>{{cardData.CardTitle}}</p>
            </div>
          </div>
          <div class="card_qrcode"></div>
        </div>
        <div class="card-code">1897 8235 236</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { SCORING_API_SECURITY_STOREDETAIL } from '@/apis/scoring'
import { BackgRoundColor } from '@/enums/component'
export default {
  props: {
    cardData: {
      type: Object
    },
    cardBgiUrl: {
      type: String
    },
    logoImage: {
      type: String
    }
  },
  data() {
    return {
      color: '#aaa',
      storeInfo: {},
      bgcColor: BackgRoundColor
    }
  },
  methods: {
    // getStoreDetail() {
    //   SCORING_API_SECURITY_STOREDETAIL().then(res => {
    //     if (res.data.Code === 'CORRECT') {
    //       this.storeInfo = res.data.Data
    //       this.storeInfo.ImageUrl = this.storeInfo.ImageUrl.replace('{0}', '80x80')
    //     }
    //   })
    // }
  },
  created() {
    // this.getStoreDetail()
  }
}
</script>

<style lang="scss" scoped>
.card-preview {
  position: relative;
  width: 362px;
  height: 641px;
  background: url(/static/images/membercard_bg.png) no-repeat;
  .card {
    position: absolute;
    top: 78px;
    left: 20px;
    width: 319px;
    height: 189px;
    border-radius: 10px;
    .img-bg {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      vertical-align: middle;
    }
    .card-content {
      position: absolute;
      top: 0;
      left: 0;
      padding: 19px 26px 0 22px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      z-index: 99;

      .top {
        display: flex;
        height: 44px;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          flex: 1;
          height: 44px;
          align-items: center;
          .log {
            margin-right: 13px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }
          div {
            width: 0%;
            flex: 1;
            p {
              padding-right: 5px;
              height: 16px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #fff;
            }
          }
        }

        .card_qrcode {
          width: 32px;
          height: 32px;
          background: url(/static/images/membercard_icon1.png) no-repeat;
        }
      }
      .card-code {
        position: absolute;
        bottom: 20px;
        left: 22px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>
