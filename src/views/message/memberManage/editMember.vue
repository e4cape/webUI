<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="panel-tag">
      <span>修改会员资料</span>
      <el-button name="btnLinkBack" @click="$router.back()" class="el-back" type="text">返回</el-button>
    </div>
    <div class="panel-bd" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-form :model="memberInfo" ref="memberRules" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="姓名：" prop="name">
          <el-input name="btnEditMemberName" v-model="memberInfo.name" placeholder="请输入2-10个汉字或4-16个字符"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sexType">
          <el-radio-group name="btnEditMemberSexType" v-model="memberInfo.sexType">
            <el-radio v-for="item in sexyTypes.Types" :key="item.key" :label="parseInt(item.key)">{{item.title}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日：" prop="birthday">
          <el-date-picker
            v-model="memberInfo.birthday"
            name="btnEditMemberBirthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机：" prop="mobile">
          <el-input name="btnEditMemberMobile" v-model="memberInfo.mobile" placeholder="请输入11个数字"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input name="btnEditMemberAddress" v-model="memberInfo.address" placeholder="请输入2-50个汉字或4-10个字符"></el-input>
        </el-form-item>
        <el-form-item label="所购商品1：" prop="goods1">
          <el-input name="btnEditMemberGoods1" v-model="memberInfo.goods1"></el-input>
        </el-form-item>
        <el-form-item label="商品品类：" prop="catagory1">
          <el-input name="btnEditMemberCatagory1" v-model="memberInfo.catagory1"></el-input>
        </el-form-item>
        <el-form-item label="购买日期：" prop="buyDate1">
          <el-date-picker
            v-model="memberInfo.buyDate1"
            name="btnEditMemberBuyDate1"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所购商品2：" prop="goods2">
          <el-input name="btnEditMemberGoods2" v-model="memberInfo.goods2"></el-input>
        </el-form-item>
        <el-form-item label="商品品类：" prop="catagory2">
          <el-input name="btnEditMemberCatagory2" v-model="memberInfo.catagory2"></el-input>
        </el-form-item>
        <el-form-item label="购买日期：" prop="buyDate2 ">
          <el-date-picker
            v-model="memberInfo.buyDate2"
            name="btnEditMemberBuyDate2"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-row style="margin: 20px; margin-left: 133px; text-align: left; border: 0;">
        <el-button type="primary" name="btnEditMemberSave" @click="save('memberRules')" :loading="$store.getters.is_loading">保存</el-button>
        <el-button name="btnEditMemberCancel" @click="$router.push('/message/memberManage/index')">取消</el-button>
      </el-row>
    </div>
    <!-- End panel -->
  </div>
  
</template>

<script>
import {
  MESSAGE_API_MEMBERSHIP_GETMEMBERSHIPDETAIL, MESSAGE_API_MEMBERSHIP_UPDATEMEMBERSHIP 
} from '@/apis/message.js'
import {
  SexyTypes
} from '@/enums/message'
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'))
      }
      if (/^(?!\d{4,16}$)(?:[a-z\d-]{4,16}|[\u4E00-\u9FA5]{2,10})$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入2-10个汉字或4-16个字符'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机不能为空'))
      }
      if (/^1\d{10}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入1开头的11个数字'))
      }
    }
    return {
      membershipId: 0,
      sexyTypes: SexyTypes,
      memberInfo: {
        name: '',
        mobile: ''
      },
      rules: {
        name: {
          validator: checkName, trigger: 'blur', required: true 
        },
        mobile: {
          validator: checkMobile, trigger: 'blur', required: true 
        }
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
    save (formName) {
      this.$store.commit('SET_BTN_LOADING', true)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          MESSAGE_API_MEMBERSHIP_UPDATEMEMBERSHIP(this.memberInfo).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push('/message/memberManage/index')
            }
          })
        } else {
          this.$store.commit('SET_BTN_LOADING', false)
          return this.$message.error('保存失败')
        }
      })
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
  padding: 20px 10px;
}
.el-back {
  position: absolute;
  right: 25px;
  z-index: 10;
  background: transparent;
}
</style>
