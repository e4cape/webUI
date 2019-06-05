<template>
  <!-- @ 审核-->
  <el-dialog title="审核" :visible.sync="visible" width="750px" @close="giftColse">
    <div class="onShelves-dialog">
      <div>
        <img :src="$root.settings.DOMAIN_IMAGE + detail.imageUrl" alt>
      </div>
      <div>
        <h4 v-text="detail.giftName"></h4>
        <p v-text="detail.mktTitle"></p>
        <div class="price">
          <div>
            {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}
            <span v-text="detail.wholesalePrice"></span>
          </div>
          <div>
            建议零售价：
            <span v-text="detail.retailPrice"></span>
          </div>
        </div>
        <div>
          <span style="line-height:33px">审核结果：</span>
          <el-radio-group name="status" v-model="params.status" style="padding-top:2px;line-hegiht:33px">
            <el-radio :label="giftStatusType.Pass">审核通过</el-radio>
            <el-radio :label="giftStatusType.Returned">
              审核退回
              <el-input name="checkNote" v-model="params.checkNote" placeholder="退回原因备注" style="width:190px" class="m-l-10" maxlength="100" v-if="params.status === giftStatusType.Returned"></el-input>
            </el-radio>
          </el-radio-group>
        </div>
        <div v-if="params.status +'' === giftStatusType.Pass && $store.getters.user_session.CharacterType != characterType.Lingcb">
          <i style="color:#de2a29">*</i>
          <span style="line-height:33px">{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}</span>
          <el-input name="wholesalePrice" style="width:200px;" v-model="params.wholesalePrice" :maxlength="9" @keyup.native="params.wholesalePrice = $root.toFixed(params.wholesalePrice, 2)"></el-input>
          <span style="line-height:33px; font-size: 12px; margin-left: 15px">(必填，与珠宝商结算的价格)</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnConfirm" type="primary" @click="giftCheckConfirm">确 定</el-button>
      <el-button name="btnCancel" @click="giftColse">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End 审核 -->
</template>

<script>
import {
  GiftStatus, OnlineStatus
} from '@/enums/gifting.js'
import { CharacterType } from '@/enums/common.js'
import {
  GIFTING_API_GIFT_SAVEAUDIT
} from '@/apis/gifting'
export default {
  props: {
    reviewVisible: {
      default: false,
      type: Boolean
    },
    checkInfo: {
      default: new Object(),
      type: Object
    }
  },
  data() {
    return {
      detail: this.checkInfo,
      visible: this.reviewVisible,
      giftStatusType: GiftStatus,
      characterType: CharacterType,
      onlineType: OnlineStatus,
      params: {
        giftId: '',
        checkNote: '',
        wholesalePrice: '',
        status: GiftStatus.Pass
      }
    }
  },
  methods: {
    giftCheckConfirm() {
      this.params.giftId = this.detail.giftId || ''
      if (!this.params.status) {
        this.$message.error('请选择审核结果')
        return
      }
      if (this.params.status === this.giftStatusType.Pass && this.$store.getters.user_session.CharacterType != CharacterType.Lingcb && (!this.params.wholesalePrice && this.params.wholesalePrice !== 0)) {
        this.$message.error('请输入批发价')
        return
      }
      GIFTING_API_GIFT_SAVEAUDIT(this.params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功')
          this.$emit('confirmClick', false)
        }
      })
    },
    giftColse() {
      this.$emit('closeClick', false)
    }
  },
  watch: {
    reviewVisible(val) {
      this.visible = val
    },
  }
}
</script>

<style lang="scss" scoped>
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
        font-size: 24px;
        margin-bottom: 10px;
      }
      > p {
        line-height: 18px !important;
        color: #aaa;
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
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
