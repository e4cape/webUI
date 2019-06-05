<template>
  <el-dialog title="导入货品" :visible="visible" width="600px" @update:visible="$emit('update:visible', $event)">
    <table class="expand-talble">
      <tr>
        <th style="color: red;">失败原因</th>
      </tr>
      <tr v-for="(item, index) in data" :key="index">
        <td>{{item}}</td>
      </tr>
    </table>
    <div slot="footer">
      <el-button name="btnClose" @click.native="$emit('update:visible', false)">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    errorInfo: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      data: []
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
    this.data = JSON.parse(this.errorInfo)
  }
}
</script>

<style lang="scss" scoped>
.expand-talble {
  width: 400px;
  margin: 0 auto;
  padding: 0 140px;
  border: 1px solid #dfe6ec;
  text-align: center;
  border-collapse: collapse;
  line-height: 26px;
  th,
  td {
    padding: 5px;
    border: 1px solid #dfe6ec;
    font-size: 12px;
    // text-align: center;
  }
}
</style>
