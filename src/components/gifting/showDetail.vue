<template>
  <div class="show-detail">
    <div class="details">
      <el-carousel indicator-position="outside" trigger="click" v-if="data.arrayImageUrls">
        <el-carousel-item v-for="(item,index) in data.arrayImageUrls" :key="index">
          <img :src="$root.settings.DOMAIN_IMAGE + item" alt width="375" height="375">
        </el-carousel-item>
      </el-carousel>
      <div class="title">{{data.giftName}}</div>
      <p class="discript">{{data.mktTitle}}</p>
      <ul class="num-show">
        <li>
          {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}
          <span class="text-danger num">{{data.wholesalePrice || '-'}}</span>
        </li>
        <li v-if="$store.getters.user_session.CharacterType != characterType.Store">
          建议零售价：
          <span class="text-danger num">￥{{data.retailPrice || '-'}}</span>
        </li>
        <li v-else>
          零售价：
          <span class="text-danger num">￥{{data.retailPrice || '-'}}</span>
        </li>
        <template v-if="$store.getters.user_session.CharacterType != characterType.Lingcb">
          <li v-for="(item,index) in data.scoreTypes" :key="index">
            <span class="tag">{{item.scoreTypeText}}</span>
            <span class="num">￥{{item.salePrice}}</span>
          </li>
        </template>
      </ul>
      <div class="size" v-if="data.giftAttrs && data.giftAttrs.length">
        <div v-for="(item,index) in data.giftAttrs" :key="index">
          {{item.name}}：
          <span v-for="(v,i) in item.giftAttrItems" :key="i">{{v.val}}</span>
        </div>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="礼品详情" name="1">
          <div v-html="data.description"></div>
        </el-tab-pane>
        <el-tab-pane label="规格描述" name="2">
          <ul class="arguments-list">
            <li v-for="(item,index) in data.giftParams" :key="index">
              <div>{{item.name}}</div>
              <span>{{item.val}}</span>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { CharacterType } from '@/enums/common.js'
export default {
  props: {
    data: { type: Object }
  },
  data() {
    return {
      activeTab: '1',
      characterType: CharacterType,
    }
  },
  mounted() {
  },
  methods: {
    initActiveTab() {
      this.activeTab = '1'
    }
  },
}
</script>
<style lang="scss">
.show-detail {
  .el-tab-pane {
    word-break: break-all;
    p {
      img {
        width: 100% !important;
        height: auto;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.show-detail {
  background: #eee;
  border: 1px solid #ddd;
  padding: 10px;
  > .details {
    width: 375px;
    max-height: 590px;
    overflow-y: auto;
    padding-bottom: 10px;
    background-color: #fff;
    /deep/ .el-carousel__container {
      height: 375px !important;
    }
    > .title {
      font-size: 20px;
      padding: 10px;
    }
    > .discript {
      line-height: 18px;
      padding: 10px;
      padding-top: 0;
      color: #aaa;
    }
    > .num-show {
      width: 100%;
      padding: 0 15px 10px 15px;
      overflow: hidden;
      border-bottom: 3px solid #eee;
      > li {
        float: left;
        width: 50%;
        padding: 5px;
        font-size: 10px;
        color: #aaa;
        > .tag {
          border: 1px solid #ddd;
          background-color: #f5f5f5;
          padding: 2px 4px;
          margin-right: 5px;
          border-radius: 4px;
        }
        > .num {
          font-size: 16px;
          color: #ff8b00;
        }
      }
    }
    > .size {
      padding: 10px;
      padding-left: 20px;
      font-size: 10px;
      color: #aaa;
      border-bottom: 3px solid #eee;
      > div {
        padding-bottom: 5px;
        > span {
          display: inline-block;
          padding: 5px;
          margin: 2px;
          background: #f5f5f5;
          color: #333;
        }
      }
    }
    /deep/ .el-tabs__nav {
      width: 100%;
      > .el-tabs__item {
        width: 50%;
        text-align: center;
      }
    }
    .el-tab-pane .arguments-list {
      width: 100%;
      > li {
        position: relative;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        &:first-child {
          border-top: 1px solid #ddd;
        }
        > div {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 100px;
          background-color: #f5f5f5;
          margin-right: 10px;
          padding: 4px 10px;
          border-right: 1px solid #ddd;
          border-left: 1px solid #ddd;
          word-break: break-all;
        }
        > span {
          display: block;
          width: 100%;
          padding: 4px 10px 4px 110px;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
