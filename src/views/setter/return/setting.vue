<template>
  <div class="content">
    <ul class="return-settings">
      <li>
        <h3><span>1、未使用卡券抵扣商品金额的消费单</span></h3>
        <p>退货后，其参与的营销产品所获收益将作废。（营销产品所获收益包括：鼓励金、置换金、购物金、抵用金等）</p>
      </li>

      <li>
        <h3><span>2、已经使用卡券抵扣商品金额的消费单</span></h3>
        <p>退货后，只退还实际支付金额，用作抵扣的卡券将被扣除不再返还（因卡券编码已使用），且新获得的营销产品 收益将作废。 在规定退货期限内退货的单，平台将返还平台提点；超过规定退货期限退货的单，平台将不返还平台提点。</p>
      </li>
      <li>
        <h3><span>3、在规定退货期限内退货的消费单</span></h3>
        <p>在规定退货期限内退货的单，平台将返还平台提点；超过规定退货期限退货的单，平台将不返还平台提点。</p>
      </li>
      <li>
        <h3><span>4、退货期限设置</span></h3>
        <div class="setting">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item>
              从销售之日起，
              <el-form-item style="display:inline-block" prop="days">
                <el-input class="w-238" name="days" v-model="form.days" :disabled="isDisabled"></el-input>
              </el-form-item>
              天内可以退货，最长不超过30天
              <el-button name="Edit" type="primary" v-if="!isEdit" @click="Edit">编辑</el-button>
              <el-button name="save" type="primary" v-if="isEdit" @click="onSubmit" v-loading="isloading">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import {
  MARKETING_API_RETURN_SETTINGDETAIL, MARKETING_API_RETURN_SETTINGUPDATE 
} from '@/apis/marketing'
export default {
  data() {
    return {
      isEdit: false,
      isDisabled: true,
      isloading: false,
      form: {
        days: ''
      },
      rules: {
        days: [
          {
            required: true, message: '不能为空！', trriger: 'blur' 
          }, {
            validator: this.intValid,  trriger: 'blur' 
          }
        ]
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    Edit() {
      this.isEdit = true
      this.isDisabled = false
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.isloading = true
          MARKETING_API_RETURN_SETTINGUPDATE(this.form.days).then(res => {
            this.isloading = false
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              this.isEdit = false
              this.isDisabled = true
            }
          })
        }
      })
    },
    getDetail() {
      this.isloading = false
      MARKETING_API_RETURN_SETTINGDETAIL().then(res => {
        this.isloading = false
        if (res.data.Code == 'CORRECT') {
          if (res.data.Data) {
            this.form.days = res.data.Data
          }
        }
      })
    },
    intValid(rule, value, callback) {
      const flag = /^[1-9]\d*$/.test(value)
      if (!flag) {
        callback(new Error('输入有误！'))
      } else {
        if (value > 30) {
          callback(new Error('退货时间不在设置范围内！'))
        } else {
          callback()
        }
      }
    },
  }
}

</script>
<style lang="scss">
.content {
  width: 100%;
  .return-settings {
  margin: 0 auto;
  width: 900px;
  li {
    &:first-child {
      padding-top: 20px;
    }
    margin-bottom: 30px;
    h3 {
      
      height: 30px;
      font-size: 12px;
      font-weight: 700;
      line-height: 30px;
      color: #777;
      span {
        padding: 0 10px;
        display: inline-block;
        background-color: #f5f5f5;
      }
    }
    p,.setting{
      padding-top: 10px;
      padding-left: 20px;
      line-height: 1.5;
    }
  }
}
}
</style>
