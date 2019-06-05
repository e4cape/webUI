<template>
  <!-- dialog 批量录入条码 -->
  <el-dialog title="批量录入条码" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="resetForm">
    <el-row>
      <el-col :span="12">
        <el-input type="textarea" class="code" :rows="18" v-model="codes" name="codes"></el-input>
      </el-col>
      <el-col :span="12" class="multi-tips">
        <p class="m-b-10">1、每行一个条码</p>
        <p class="m-b-10">2、条码后可以加数量，用逗号隔开，例如：10001,5</p>
        <p class="m-b-10">3、支持扫描枪录入</p>
        <p class="m-b-10">4、推荐使用带存储的扫描枪快速导入条码</p>
        <p class="red m-b-10">5、请在英文输入法状态下使用扫码枪进行扫码录入</p>
        <p>
          <el-button type="text" @click="clearCodes" name="btnClearCodes">清空条码</el-button>
        </p>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="enterCodes" :loading="$store.getters.is_loading" name="btnEnterCodes">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancelCodes">取 消</el-button>
    </div>
  </el-dialog>
  <!-- End 批量录入条码 -->
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      codes: '',
      result: []
    }
  },
  methods: {
    enterCodes() {
      if (this.codes) {
        this.result = [] // 清空条码集
        let codeArr = this.codes.split('\n')
        codeArr.forEach(item => {
          let iArr = item.split(/,|，/)
          iArr[0] &&
            this.result.push({
              BarCode: iArr[0],
              Quantity: parseInt(iArr[1]) || 1
            })
        })
        if (
          this.result.some(
            item => item.Quantity <= 0 || !/^[1-9]\d{0,7}$/.test(item.Quantity)
          )
        ) {
          this.$message.warning('请正确输入数量')
          return false
        }
        this.$emit('listenMultiCodeEnter', this.result)
        this.$store.commit('SET_BTN_LOADING', true)
      } else {
        this.$message({
          message: '请先录入条码',
          type: 'warning'
        })
      }
    },
    clearCodes() {
      this.$confirm('确定清空所有条码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.codes = ''
          this.result = [] // 清空条码集
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    resetForm() {
      this.codes = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.multi-tips {
  padding-left: 10px;
  text-align: left;
}
</style>
