<template>
  <el-dialog :title="title" :visible.sync="visible" width="450px">
    <el-form
      :label-position="'right'"
      label-width="100px"
      ref="newStyleOrder"
      :model="orderForm"
      :rules="rule"
    >
      <el-form-item label="业务日期：" prop="ActualDate">
        <el-date-picker
          :clearable="false"
          type="date"
          placeholder="选择日期"
          v-model="orderForm.ActualDate"
          style="width: 100%;"
          :picker-options="$store.getters.businessDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="期望到货日期：" prop="date">
        <el-date-picker
          name="ForwdDate"
          v-model="orderForm.ForwdDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="orderForm.Note" :maxlength="200" name="Note" style="width: 300px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="saveForm('newStyleOrder')"
        :loading="$store.getters.is_loading"
        name="btnEditModify"
      >保存</el-button>
      <el-button @click="visible = false" name="btnCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
export default {
  props: {
    title: {
      type: String,
      default: '新建款式需求单'
    },
    demandListVisible: {
      type: Boolean
    },
    orderForms: {
      type: Object
    },
  },
  data() {
    return {
      visible: this.demandListVisible,
      // orderForm: this.orderForms || {
      //   ActualDate: dayjs().format('YYYY-MM-DD'),
      //   ForwdDate: '',
      //   Note: ''
      // },
      orderForm: {
        ActualDate: dayjs().format('YYYY-MM-DD'),
        ForwdDate: '',
        Note: ''
      },
      rule: {
        ActualDate: [
          { required: true, message: '请选择业务时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
    }
  },
  methods: {
    saveForm(formName) {
      console.log(this.orderForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('confirmCreate', this.orderForm)
        } else {
          return false
        }
      })
    }
  },
  mounted(){
    
    const ignore = ['1900', '9999']
    if(ignore.indexOf(dayjs(this.orderForms.ForwdDate).format('YYYY')) > -1){
      this.orderForms.ForwdDate = ''
    }
    console.log('this.orderForms', this.orderForms)
    this.orderForm = this.orderForms
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    visible() {
      this.$emit('colseDemandList')
    }
  }
}
</script>

<style lang="scss">
</style>
