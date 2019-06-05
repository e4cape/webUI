<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="panel-tag">
      <span>会员详情</span>
      <el-button name="btnLinkBack" @click="$router.back()" class="el-back" type="text">返回</el-button>
    </div>
    <div class="panel-bd" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <!-- @module Tabs 标签页 -->
      <el-form :model="memberInfo" label-width="100px" label-position="right">
        <el-form-item label="ID：" prop="membershipId">{{memberInfo.membershipId}}</el-form-item>
        <el-form-item label="姓名：" prop="name">{{memberInfo.name}}</el-form-item>
        <el-form-item label="性别：" prop="sexTypeText">{{memberInfo.sexTypeText}}</el-form-item>
        <el-form-item label="生日：" prop="birthday">{{memberInfo.birthday}}</el-form-item>
        <el-form-item label="手机：" prop="mobile">{{memberInfo.mobile}}</el-form-item>
        <el-form-item label="地址：" prop="address">{{memberInfo.address}}</el-form-item>
        <el-form-item label="所购商品1：" prop="goods1">{{memberInfo.goods1}}</el-form-item>
        <el-form-item label="商品品类：" prop="catagory1">{{memberInfo.catagory1}}</el-form-item>
        <el-form-item label="购买日期：" prop="buyDate1">{{memberInfo.buyDate1}}</el-form-item>
        <el-form-item label="所购商品2：" prop="goods2">{{memberInfo.goods2}}</el-form-item>
        <el-form-item label="商品品类：" prop="catagory2">{{memberInfo.catagory2}}</el-form-item>
        <el-form-item label="购买日期：" prop="buyDate2 ">{{memberInfo.buyDate2}}</el-form-item>
        <el-form-item label="最后更新人：" prop="lastUser">{{memberInfo.lastUser}}</el-form-item>
        <el-form-item label="最后更新时间：" prop="lastTime">{{memberInfo.lastTime}}</el-form-item>
      </el-form>
      <!-- End Tabs 标签页 -->
    </div>
    <!-- End panel -->
  </div>
  
</template>

<script>
import {
  MESSAGE_API_MEMBERSHIP_GETMEMBERSHIPDETAIL 
} from '@/apis/message.js'
export default {
  data () {
    return {
      membershipId: 0,
      memberInfo: {
      }
    }
  },
  methods: {
    getData () {
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_MEMBERSHIP_GETMEMBERSHIPDETAIL({
        membershipId: this.membershipId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.memberInfo = res.data.Data
        }
      })
    },
    handleClick (tab, event) {
    },
    save () {
    }
  },
  mounted () {
    this.membershipId = parseInt(this.$route.query.membershipId) || 0
    this.getData()
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.panel-bd {
  padding: 0 10px;
}
.el-back {
  position: absolute;
  right: 25px;
  z-index: 10;
  background: transparent;
}
</style>
