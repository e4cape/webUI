<template>
  <!-- @module Dialog·打印 -->
  <el-dialog title="打印" :visible="visible" @update:visible="$emit('update:visible', $event)">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-form-item label="打印模板：">
          <el-select name="printingId" v-model="printingId">
            <el-option v-for="(item, index) in modules" :key="index" :value="item.Id" :label="item.Value"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item label="打印方式：">
        <el-radio-group v-model="printType">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio name="printpdf" label="printpdf">PDF打印</el-radio>
              <em>（推荐，在线生成PDF文件打印，内容多时可能需要花费一点时间）</em>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio name="printhtml" label="printhtml">浏览器直接打印</el-radio>
              <em>（响应速度快，但格式可能出现异常，不建议用于标签打印）</em>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <span>注：打印前请设置好打印机，标签打印机请在打印机设置中设置好标签尺寸及标签类型。</span>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnPrint" type="primary" @click="print">确 定</el-button>
      <el-button name="btnCancel" @click="$emit('update:visible', false)">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·打印 -->
</template>

<script>
import { YNStatus } from '@/enums/common.js'

import { MERCHANT_API_DROPDOWN_PRINTINGLIST } from '@/apis/merchant.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    conditions: {
      type: String,
      default: ''
    },
    printingType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      printType: 'printpdf', // 打印方式
      printingId: '', // 打印模板
      pariningTypes: '', // 打印模版类型
      modules: []
    }
  },
  methods: {
    print() {
      if (!this.printingId) {
        this.$message.error('请选择打印模板')
        return false
      }
      let url =
        this.$root.settings.DOMAIN_PRINT +
        '/home/' +
        this.printType +
        '?IsPrint=true&PrintingId=' +
        this.printingId +
        '&PrintingType=' +
        this.printingType +
        '&Conditions=' +
        this.conditions
      console.log(url)
      this.$emit('update:visible', false)
      window.open(url)
    },
    getModules() {
      MERCHANT_API_DROPDOWN_PRINTINGLIST({ PrintingType: this.printingType }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.modules = res.data.Data.Rows.filter(item => item.State === YNStatus.Yes)
          this.printingId = (this.modules.length && this.modules[0].Id) || 0
        }
      })
    }
  },
  mounted () {
    this.getModules()
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
</style>
