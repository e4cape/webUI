<template>
  <div class="content-view">
    <div class="border-1px p-20">
      <el-form class="input-w248 input-w248" v-model="form" label-width="150px">
        <el-form-item label="产品名称：">
          <span>{{form.MarproTitle}}</span>
        </el-form-item>
        <el-form-item label="参与条件：">
          <span>{{MaterialTypeLists}}</span>
        </el-form-item>
        <el-form-item label="卡券类型：">
          <span>{{form.CouponNote}}</span>
        </el-form-item>
        <el-form-item label="收益对应跳转：">
          <span>{{CouponTypes.Types[form.JumpType]}}</span>
        </el-form-item>
        <el-form-item label="活动规则：">
          <span v-html="form.Note"></span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>{{form.CreateTime}}</span>
        </el-form-item>
        <el-form-item label="创建人员：">
          <span>{{form.CreateUser}}</span>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="$router.push({path: `/market/marketproduct/edit?MarproId=${$route.query.MarproId}&state=2`})" name="btnEdit">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { MaterialType } from '@/enums/stocking.js'
import { CouponType } from '@/enums/marketing.js'
import { MARKETING_API_MARKET_PRODUCT_GET } from '@/apis/marketing.js'
export default {
  data() {
    return {
      form: '',
      CouponTypes: CouponType,
      rules: [],
      MaterialTypeLists: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      MARKETING_API_MARKET_PRODUCT_GET({
        MarproId: this.$route.query.MarproId
      }).then(res => {
        let MaterialTypes = []
        res.data.Data.MaterialTypes.split(',').forEach(m => {
          MaterialTypes.push(MaterialType.Types[m])
          this.MaterialTypeLists = MaterialTypes.join('、')
        })
        this.form = res.data.Data
        this.form.CouponNote = this.form.CouponNote.replace(
          /\\<br\\ \/\\>/g,
          ''
        )
        this.form.Note = this.form.Note.split('；').join('；<br/>')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-input .el-input {
  width: 248px;
}
.border-b-1px {
  border-bottom: 1px solid #ddd;
}
</style>
<style lang="scss">
.el-form-item {
  margin-bottom: 10px;
}
.el-tabs__nav-scroll {
  padding-left: 20px;
}
.el-tabs__item {
  padding: 0 20px !important;
}
.el-checkbox + .el-checkbox {
  margin-left: 20px !important;
}
.input-w248 .el-input {
  width: 248px;
}
.mk-open {
  width: 180px;
  .el-input {
    width: 120px !important;
  }
}
</style>

