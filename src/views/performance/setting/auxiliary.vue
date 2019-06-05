<template>
  <div class="content">
    <h2 class="p-x-20 t-t">辅助销售说明</h2>
    <div class="p-20 fz14 bd-1">
      <p>1、辅助销售：是指销售员A协助或帮助销售员B，完成对销售员B的客户的销售工作，最终达成交易的一种销售行为。</p>
      <p>2、辅助销售交易成功后，企业可根据自身规定设置主、辅销售人员是否共享销售业绩及共享业绩时主、辅销售人员的分配比例。</p>
    </div>
    <h2 class="p-x-20 t-t m-t-10">辅助销售设置</h2>
    <el-table :data="tableData" v-if="!Edit" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column  prop="MasterRate" label="主销分配比例">
      </el-table-column>
      <el-table-column  prop="SlaveRate" label="辅销分配比例">
      </el-table-column>
      <el-table-column >
        <template>
          <el-button name="btnEdit" type="primary" @click="Edit=true" title="暂未开放">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="Edit">
      <el-col :span="24" class="bd-1">
        <div class="w400 p-y-10">
          <el-form :model="form" ref="form" :rules="rules" label-width="150px">
            <el-form-item prop="MasterRate" label="主销分配比例：">
              <el-input name="MasterRate" v-model="form.MasterRate" @keyup.native="form.MasterRate=$root.toFixed(form.MasterRate, 2)">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="SlaveRate" label="辅销分配比例：">
              <el-input name="SlaveRate" v-model="form.SlaveRate" @keyup.native="form.SlaveRate=$root.toFixed(form.SlaveRate, 2)">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button name="btnSave" type="primary"  @click="SaveEdit('form')" :loading="loading">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  KPIS_API_SETTING_GUIDE_RATE_GET,KPIS_API_SETTING_GUIDE_RATE_UPDATE
} from '@/apis/performance'
export default {
  data() {
    return {
      form: {
      },
      tableData: [],
      Edit: false,
      rules: {
        MasterRate: [
          {
            validator: this.SelfValidateRage 
          }
        ],
        SlaveRate: [
          {
            validator: this.SelfValidateRage 
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      KPIS_API_SETTING_GUIDE_RATE_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code === 'CORRECT'){
          this.form = res.data.Data
          this.form.MasterRate = res.data.Data.MasterRate / 100
          this.form.SlaveRate = res.data.Data.SlaveRate / 100
          this.tableData.push(res.data.Data)
        }
      })
    },
    SelfValidateRage(rule, value, callback) {
      const reg = new RegExp(/^(?!^0[0-9]+|0\.0{1,2}$)[0-9][0-9]?(\.[0-9]{1,2})?$|^(100|100\.0{1,2})$/, 'g')
      const flag = reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!flag) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    SaveEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (parseFloat(this.form.MasterRate) + parseFloat(this.form.SlaveRate) === 100) {
            this.loading = true
            const obj = {
              MasterRate: this.form.MasterRate * 100,
              SlaveRate: this.form.SlaveRate * 100
            }
            KPIS_API_SETTING_GUIDE_RATE_UPDATE(obj).then(res => {
              this.loading = false
              if (res.data.Code === 'CORRECT') {
                this.$message.success('设置成功！')
                this.tableData = [this.form]
                this.Edit = false
              }
            })
          } else {
            this.$message({
              message: '主销辅销比例之和应为100%！',
              type: 'warning'
            })
          }
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    this.getData()
  }
}

</script>
<style lang="scss" scoped>
.t-t{background: #6dafdc;color: #fff;height: 40px;line-height: 40px;font-size: 14px;}
.fz14 {
  font-size: 14px;
}

.w400 {
  width: 400px;
}

.bd-1 {
  line-height: 1.5;
  border: 1px #ddd solid;
}
</style>

