<template>
  <div>
    <p style="font-size: 14px; margin: 10px 0; font-weight: bold; text-align: right;">注：修改流程后仅用于新的货品入库，已经添加的单据按照原来的流程入库</p>
    <div class="panel flow-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <!--@moudle 流程 -->
      <div v-for="(item,key) in dataList" :key="key">
        <h3 class="title">{{orderType.Types[item.OrderType]}}</h3>
        <div class="flow-wrap">
          <div class="item">{{item.OrderType == orderType.Goods ? '成品到货单': item.OrderType == orderType.Half ? '半成品分秤' : item.OrderType == orderType.Junk ? '旧货转成品' : '-'}}</div>
          <div class="arrow main-in">
            <div class="triangle"></div>
            <div class="dash">
              <span>检验中心</span>
            </div>
          </div>
          <div class="item">
            成品质检
            <el-switch v-model="dataList[key].QualityState" :active-value="enableState.Enable" :inactive-value="enableState.Disable" @change="v => changeStatus(v,key,'QualityState')"></el-switch>
          </div>
          <div class="arrow middle">
            <div class="triangle"></div>
            <div class="line-y">
              <div class="top">
                <div class="arrow short">
                  <div class="triangle"></div>
                </div>
                <div class="item">
                  成品鉴定送验
                  <el-switch v-model="dataList[key].SendState" :active-value="enableState.Enable" :inactive-value="enableState.Disable" @change="v => changeStatus(v,key,'SendState')"></el-switch>
                </div>
                <div class="arrow short">
                  <div class="triangle"></div>
                </div>
                <div class="item">
                  成品证书录入
                  <el-switch v-model="dataList[key].CertState" :active-value="enableState.Enable" :inactive-value="enableState.Disable" @change="v => changeStatus(v,key,'CertState')"></el-switch>
                </div>
                <div class="arrow short-end">
                  <div class="line-y-end"></div>
                </div>
              </div>
              <div class="bottom">
                <div class="arrow middle">
                  <div class="triangle"></div>
                </div>
                <div class="item">
                  成品核价
                  <el-switch v-model="dataList[key].PriceState" :active-value="enableState.Enable" :inactive-value="enableState.Disable" @change="v => changeStatus(v,key,'PriceState')"></el-switch>
                </div>
                <div class="arrow long-end"></div>
              </div>
            </div>
          </div>
          <div class="item">
            成品资料完善
            <el-switch v-model="dataList[key].InfoState" :active-value="enableState.Enable" :inactive-value="enableState.Disable" @change="v => changeStatus(v,key,'InfoState')"></el-switch>
          </div>
          <div class="arrow long main-out">
            <div class="triangle"></div>
            <div class="item">成品进货入库</div>
          </div>
        </div>
      </div>
      <!-- @end 流程 -->
    </div>
    <div class="p-10 no-data panel" v-if="!$store.getters.tb_loading && dataList.length == 0">
      <i class="el-icon-info m-r-10"></i>获取数据失败
    </div>
  </div>
</template>

<script>
import { EnableState } from '@/enums/common.js'
import { SettingGoodsIntakeOrderType } from '@/enums/stocking.js'
import {
  STOCKING_API_SETTING_GOODS_INTAKE_GETS,
  STOCKING_API_SETTING_GOODS_INTAKE_UPDATE
} from '@/apis/stocking.js'
export default {
  data () {
    return {
      dataList: [],
      enableState: EnableState,
      orderType: SettingGoodsIntakeOrderType
    }
  },
  methods: {
    changeStatus (v, i, n) {
      let params = {}
      params.CharacterId = this.dataList[i].CharacterId
      params.OrderType = this.dataList[i].OrderType
      params[n] = v
      STOCKING_API_SETTING_GOODS_INTAKE_UPDATE(params).then(res => {
        if (res.data.Code !== 'CORRECT') {
          this.getStatus()
        }
      })
    },
    getStatus () {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTING_GOODS_INTAKE_GETS().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$store.commit('SET_TB_LOADING', false)
          this.dataList = res.data.Data.Rows
        }
      })
    }
  },
  mounted () {
    this.getStatus()
  }
}
</script>

<style lang="scss" scoped>
h3.title {
  font-size: 24px;
  font-weight: 700;
  margin: 40px 20px 20px 10px;
}
.flow-wrap {
  padding: 170px 10px;
  overflow: hidden;
  .item {
    vertical-align: middle;
    position: relative;
    display: inline-block;
    text-align: center;
    margin: 0 20px;
    width: 120px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border: 1px solid #badcf3;
    .el-switch {
      position: absolute;
      bottom: -35px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .arrow {
    vertical-align: middle;
    position: relative;
    display: inline-block;
    height: 4px;
    background: #95c2e1;
    &.short {
      width: 55px;
    }
    &.middle {
      width: 150px;
    }
    &.long {
      width: 200px;
    }
    &.short-end {
      width: 30px;
      > .line-y-end {
        transform: translateX(26px);
        position: relative;
        top: 0;
        right: 0;
        width: 4px;
        height: 180px;
        background: #95c2e1;
      }
    }
    &.long-end {
      width: 150px;
    }
    &.main-in {
      width: 60px;
      > .dash {
        position: absolute;
        top: 50%;
        left: 30px;
        transform: translateY(-50%);
        width: 670px;
        height: 320px;
        border: 1px dashed #badcf3;
        > span {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-weight: 700;
          color: #999999;
          font-size: 14px;
        }
      }
    }
    &.main-out > .item {
      position: absolute;
      margin: 0;
      top: 50%;
      right: -140px;
      transform: translateY(-50%);
    }
    > .triangle {
      position: absolute;
      right: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-left: 12px solid #95c2e1;
      border-bottom: 6px solid transparent;
    }
    > .line-y {
      position: absolute;
      left: 0;
      top: 50%;
      width: 4px;
      height: 180px;
      transform: translateY(-50%);
      background: #95c2e1;
      > .top,
      > .bottom {
        position: absolute;
        left: 0;
        width: 460px;
        height: 32px;
      }
      > .top {
        top: 0;
        transform: translateY(-50%);
      }
      > .bottom {
        bottom: 0;
        transform: translateY(50%);
      }
    }
  }
}
.no-data {
  color: #aaaaaa;
}
.flow-border {
  padding-bottom: 20px;
  min-height: 100px;
}
</style>
