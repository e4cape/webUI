<template>
  <el-dialog title="取消审核" :visible.sync="visible" width="750px">
    <el-form label-width="80px">
      <el-row v-if="data.length === 1">
        <el-col :span="10">
          <el-form-item label="单据编号：">
            <span :title="data[0].orderNumber" class="orderNumber">{{data[0].orderNumber}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="创建：">
            <span class="orderNumber">{{data[0].CreateUser}} {{data[0].CreateTime | filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="取消原因：">
        <el-input v-model="Note" placeholder="取消审核原因备注" :maxlength="200" name="auditReson" @blur="Note = Note.trim()"></el-input>
      </el-form-item>
      <el-form-item>
        <span>取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        name="bntConfirm"
        type="primary"
        @click="confirmObsolete"
        :loading="$store.getters.is_loading"
        size="mini"
      >确定</el-button>
      <el-button name="btnClose" size="mini" @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
export default {
  props: {
    visibleCan: Boolean,
    data: Array,
  },
  data() {
    return {
      visible: this.visibleCan,
      Note: ''
    }
  },
  watch: {
    visible() {
      this.$emit('visbleColse')
    },
  },
  mounted() {
  },
  methods: {
    confirmObsolete() {
      this.$store.commit('SET_BTN_LOADING', true)
      this.$emit('confirmCancel', this.Note)
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.orderNumber {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
