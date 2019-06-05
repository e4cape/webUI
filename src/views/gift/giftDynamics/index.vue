<template>
  <div
    class="gift-dynamics"
    id="gift-dynamics"
    ref="scrollContainer"
  >
    <ul class="gift-lists">
      <li
        v-for="(item,idx) in giftDynamicsArr"
        :key="idx"
      >
        <img
          name="btnGetDetail"
          :src="$root.settings.DOMAIN_IMAGE + item.imageUrl"
          @click="giftDetail(item.giftId)"
          alt=""
        >
        <div
          name="btnGetDetail"
          class="title"
          @click="giftDetail(item.giftId)"
        >{{item.giftName}}</div>
        <div class="desc">{{item.mktTitle}}</div>
        <div class="line"></div>
        <div>
          <div class="price-choosebtn">
            <div class="price1">
              <span>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}</span>
              <b>{{item.wholesalePrice}}</b>
            </div>
            <div class="price2">
              <span>建议零售价：</span>
              <b>{{item.retailPrice}}</b>
            </div>
            <div class="choosebtn">
              <el-button
                name="btnIsup"
                v-if="item.onlineStatus == EnumOnlineStatus.OnShelves"
                type="text"
                class="sp"
              >已上架</el-button>
              <el-button
                v-else
                name="btnUp"
                type="primary"
                @click="giftOnShelves(item.giftId)"
              >上架</el-button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <mugen-scroll
      :handler="getDatas"
      :should-handle="!scrollIf"
      scroll-container="scrollContainer"
    >
      <div
        v-if="loadingsIf"
        class="loadings"
      >
        <i class="el-icon-loading"></i>正在努力加载，请稍候...
      </div>
    </mugen-scroll>
    <el-dialog title="上架" :visible.sync="visibleOnShelves" width="750px">
      <div class="onShelves-dialog">
        <div>
          <img
            :src="$root.settings.DOMAIN_IMAGE + onShelvesInfo.imageUrl"
            alt=""
          >
        </div>
        <div>
          <h4 v-text="onShelvesInfo.giftName"></h4>
          <p v-text="onShelvesInfo.mktTitle"></p>
          <div class="price">
            <div>
              {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}
              <span v-text="onShelvesInfo.wholesalePrice"></span>
            </div>
            <div>
              建议零售价：
              <span v-text="onShelvesInfo.retailPrice"></span>
            </div>
          </div>
          <div class="exchange">
            <span>兑换方式</span>
            <div>
              <div>
                <el-checkbox name="scoreCheckIf" v-model="scoreCheckIf">积分</el-checkbox>
                <el-input
                  name="score"
                  class="m-l-10"
                  v-model="score"
                  :maxlength="9"
                  @keyup.native="score = $root.toFixed(score, 0)"
                  :disabled="!scoreCheckIf"
                  style="width: 80px!important;"
                ></el-input>
              </div>
              <div>
                <el-checkbox name="goldenRiceCheckIf" v-model="goldenRiceCheckIf">礼金</el-checkbox>
                <el-input
                  name="goldenRice" 
                  class="m-l-10"
                  v-model="goldenRice"
                  :maxlength="9"
                  @keyup.native="goldenRice = $root.toFixed(goldenRice, 0)"
                  :disabled="!goldenRiceCheckIf"
                  style="width: 80px!important;"
                ></el-input>
              </div>
              <p>1-999999999的整数，如果选择两种，用户可以使用任意一种方式兑换</p>
            </div>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnSave" 
          type="primary"
          @click="giftOnShelvesConfirm"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button name="btnCancel"  @click="visibleOnShelves = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看礼品" :visible.sync="detailShow" :before-close="detailShowCancel" width="458px" v-loading="dialogLoading" element-loading-text="拼命加载中">
      <show-detail :data="detailInfo" ref="showDetail"></show-detail>
    </el-dialog>
  </div>
</template>
<script>
import MugenScroll from 'vue-mugen-scroll'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  GIFTING_API_GIFT_SEARCHDYNAMIC,
  GIFTING_API_GIFT_SELECTONSHELF,
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_GIFT_GETGIFTONSHELFSETTINGBYGIFTID,
} from '@/apis/gifting'
import {
  OnlineStatus 
} from '@/enums/gifting'
export default {
  data() {
    return {
      giftDynamicsArr: [], // 礼品动态数据
      scrollIf: false, // 是否滚动状态
      loadingsIf: false, // 是否显示加载中
      scrollContainer: true, // 滚动加载容器
      dialogLoading: false,
      detailInfo: {
      },
      detailShow: false,
      pageIndex: 1,
      pageSize: 10,
      // 上架
      visibleOnShelves: false, // 显隐
      scoreCheckIf: false, // 积分选中否
      goldenRiceCheckIf: false, // 礼金选中否
      onShelvesInfo: {
      }, // 上架信息
      score: '', // 积分值
      goldenRice: '' // 礼金值
    }
  },
  computed: {
    EnumOnlineStatus() {
      return OnlineStatus
    }
  },
  mounted() {
    const h = document.body.clientHeight - 70
    document.getElementById('gift-dynamics').style.height = h + 'px'
  },
  methods: {
    getDatas() {
      this.scrollIf = true
      this.loadingsIf = true
      const param = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      GIFTING_API_GIFT_SEARCHDYNAMIC(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.giftDynamicsArr = [
            ...this.giftDynamicsArr,
            ...res.data.Data.rows
          ]
          this.pageIndex += 1
          if (this.giftDynamicsArr.length >= res.data.Data.total) {
            this.loadingsIf = false
            return
          }
        }
        this.scrollIf = false
      })
    },
    getData() {
      this.scrollIf = true
      this.loadingsIf = true
      const param = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      GIFTING_API_GIFT_SEARCHDYNAMIC(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.giftDynamicsArr = res.data.Data.rows
          this.pageIndex += 1
          if (this.giftDynamicsArr.length >= res.data.Data.total) {
            this.loadingsIf = false
            return
          }
        }
        this.scrollIf = false
      })
    },
    // 上架
    // -打开
    giftOnShelves(giftId) {
      this.visibleOnShelves = true
      this.scoreCheckIf = false
      this.goldenRiceCheckIf = false
      this.score = ''
      this.goldenRice = ''
      GIFTING_API_GIFT_GETGIFTONSHELFSETTINGBYGIFTID({
        giftId: giftId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          var data = this.giftDynamicsArr.filter(
            item => item.giftId == giftId
          )[0]
          if (res.data.Data == null) {
            this.onShelvesInfo = data
          } else {
            this.onShelvesInfo = Object.assign({
            } , data, res.data.Data, )
            if (res.data.Data.scoreType == 1) {
              this.scoreCheckIf = true
              this.score = res.data.Data.score
            } else if(res.data.Data.scoreType == 2) {
              this.goldenRiceCheckIf = true
              this.goldenRice = res.data.Data.goldenRice
            } else if(res.data.Data.scoreType == 3) {
              this.scoreCheckIf = true
              this.goldenRiceCheckIf = true
              this.goldenRice = res.data.Data.goldenRice
              this.score = res.data.Data.score
            }
          }
        }
      })
    },
    // -上架提交
    giftOnShelvesConfirm() {
      let scoreType = ''
      if (this.scoreCheckIf && this.goldenRiceCheckIf) {
        scoreType = 3
        if (!this.goldenRice || !this.score || Number(this.score) < 1 || Number(this.goldenRice) < 1 ) {
          this.$message.error('积分或礼金不能小于1！')
          return
        }
      } else if (this.scoreCheckIf && !this.goldenRiceCheckIf) {
        scoreType = 1
        if (!this.score || Number(this.score) < 1 ) {
          this.$message.error('积分不能小于1！')
          return
        }
      } else if (!this.scoreCheckIf && this.goldenRiceCheckIf) {
        scoreType = 2
        if (!this.goldenRice || Number(this.goldenRice) < 1 ) {
          this.$message.error('礼金不能为小于1！')
          return
        }
      }
      if (!scoreType) {
        this.$message.error('兑换方式至少选择一种！')
        return
      }
      this.$store.commit('SET_BTN_LOADING', true)
      const param = {
        giftId: this.onShelvesInfo.giftId,
        scoreType,
        goldenRice: this.goldenRice,
        score: this.score
      }
      GIFTING_API_GIFT_SELECTONSHELF(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('上架成功！')
          this.pageIndex = 1
          this.getData()
        }
        this.visibleOnShelves = false
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    giftDetail(v) {
      this.dialogLoading = true
      this.detailShow = true
      GIFTING_API_GIFT_GETDETAILBYSTORE(v).then(res => {
        this.dialogLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailInfo = res.data.Data
        }
      })
    },
    detailShowCancel(done) {
      this.$refs['showDetail'].initActiveTab()
      done()
      this.detailInfo = {
      }
    }
  },
  components: {
    MugenScroll,
    showDetail
  }
}
</script>
<style lang="scss" scoped>
.gift-dynamics {
  overflow-y: auto;
  .gift-lists {
    border-top: 1px solid $border-color;
    border-left: 1px solid $border-color;
    margin: 0;
    overflow: auto;
    li {
      float: left;
      width: 20%;
      display: block;
      padding: 10px 10px 13px;
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      img {
        display: block;
        width: 100%;
      }
      .title {
        height: 60px;
        line-height: 23px;
        padding: 12px 0 4px;
        overflow: hidden;
        color: $font-color;
      }
      .desc {
        height: 54px;
        line-height: 18px;
        padding-bottom: 15px;
        overflow: hidden;
        color: $gray;
        font-size: 12px;
        word-break: break-all;
      }
      .line {
        border-top: 1px dashed $border-color;
        margin: 10px 0;
      }
      .price-choosebtn {
        position: relative;
        .price2 {
          line-height: 1;
          span {
            display: inline-block;
            width: 75px;
            text-align: right;
            font-size: 12px;
          }
          b {
            color: red;
          }
        }
        .price1 {
          @extend .price2;
          margin-bottom: 10px;
        }
        .choosebtn {
          position: absolute;
          top: 50%;
          right: 0;
          margin-top: -14px;
          .sp {
            cursor: default;
          }
        }
      }
    }
  }
}
.loadings {
  height: 100px;
  line-height: 100px;
  text-align: center;
}

@media (max-width: 1560px) {
  .gift-lists {
    li {
      width: 25% !important;
    }
  }
}

@media (max-width: 1240px) {
  .gift-lists {
    li {
      width: 33.333333333% !important;
    }
  }
}

.onShelves-dialog {
  overflow: hidden;
  > div {
    &:first-child {
      float: left;
      > img {
        width: 220px;
        height: 220px;
      }
    }
    &:nth-child(2) {
      padding-left: 230px;
      > h4 {
        font-size: 16px;
        margin-bottom: 10px;
      }
      > p {
        color: #aaa;
        font-size: 12px;
        line-height: 18px;
      }
      > .price {
        background-color: #f5f5f5;
        padding: 10px;
        overflow: hidden;
        margin: 10px 0;
        > div {
          float: left;
          width: 50%;
          font-size: 12px;
          > span {
            color: #de2a29;
            font-size: 16px;
          }
        }
      }
      > .exchange {
        overflow: hidden;
        > span {
          float: left;
          width: 60px;
          padding-top: 5px;
          font-size: 12px;
        }
        > div {
          padding-left: 70px;
          > div {
            margin-bottom: 10px;
          }
          > p {
            color: #aaa;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>

