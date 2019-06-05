
<template  >
  <div class="content">
    <div class="tabs">
      <div class="tab" :class="{active: isFirstTab}" @click="isFirstTab = true">退货单详情</div>
      <div class="tab" :class="{active: !isFirstTab}" @click="isFirstTab = false">消费单详情</div>
    </div>
    <div class="main-content">
      <ul class="list" v-if="isFirstTab" v-loading="isLoading">
        <li>
          <span>退货单号：</span>
          <span>{{detail.ReturnCode}}</span>
        </li>
        <li>
          <span>状态：</span>
          <span>{{RetailOrderReturnState.Types[detail.RState]}}</span>
        </li>
        <li>
          <span>提交日期：</span>
          <span>{{detail.RCreateTime | filterDate}}</span>
        </li>
        <li>
          <span>创建人：</span>
          <span>{{detail.RCreateUser}}</span>
        </li>
        <li>
          <span>退货原因：</span>
          <span>{{detail.RNote}}</span>
        </li>
        <li>
          <span>应退金额：</span>
          <span>￥{{$root.toFloat(detail.RAwaitPrice)}}</span>
        </li>
        <li>
          <span>实退金额：</span>
          <span>￥{{$root.toFloat(detail.ReturnPrice)}}</span>
        </li>
      </ul>
      <div v-else>
        <expend-detail></expend-detail>
      </div>
    </div>
  </div>
</template>
<script>
import expendDetail from '../expend/detail'
import {
  RetailOrderReturnState
} from '@/enums/order.js'
import {
  ORDER_API_RETAIL_ORDER_RETURN_GET
} from '@/apis/order'
import dayjs from 'dayjs'
export default {
  components: {
    expendDetail
  },
  data() {
    return {
      RetailOrderReturnState,
      detail: {
      },
      dayjs,
      isFirstTab: true,
      isLoading: false
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.isLoading = true
      ORDER_API_RETAIL_ORDER_RETURN_GET({
        ReturnCode: this.$route.query.ReturnCode
      }).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped="true">
.main-content {
  padding: 10px;
  border: 1px solid #e5e5e5;
  .list {
    color: #333;
    li {
      display: flex;
      line-height: 24px;
      span {
        &:first-child {
          width: 80px;
          text-align: right;
        }
      }
    }
  }
}
</style>