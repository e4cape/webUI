<template>
  <div>
    <el-dialog title="查看电子标签" :visible.sync="visible">
      <div class="m10 details-table-dialog">
        <table class="details-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">标签编号：</td>
              <td class="note">{{detail.LabelCode}}</td>
            </tr>
            <tr>
              <td class="tit">基站编号：</td>
              <td class="note">{{detail.StationCode}}</td>
            </tr>
            <tr>
              <td class="tit">货品条码：</td>
              <td class="note">{{detail.StoreBarCode}}</td>
            </tr>
            <tr>
              <td class="tit">货品名称：</td>
              <td class="note">{{detail.GoodsName}}</td>
            </tr>
            <tr>
              <td class="tit">显示模板：</td>
              <td class="note">{{detail.PrintingName}}</td>
            </tr>
            <tr>
              <td class="tit">标签位置：</td>
              <td class="note">{{detail.DeskName}}</td>
            </tr>
            <tr v-if="detail.ImageUrl">
              <td class="tit">标签预览：</td>
              <td class="note td_img"><img :src="$root.settings.DOMAIN_IMAGE + detail.ImageUrl.replace('{0}','bzn')" alt=""></td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  STOCKING_API_GOODSTAGS_DETAIL 
} from '@/apis/stocking.js'

export default {
  data() {
    return {
      visible: this.checkDialog,
      success: false,
      queryForm: {
      },
      dialogSelectGoodsVisible: false,
      detail: {
      }
    }
  },
  props: ['checkDialog', 'selections'],
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      STOCKING_API_GOODSTAGS_DETAIL({
        tagId: this.selections[0].TagId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    }
  },
  watch: {
    visible() {
      this.$emit('listenAllDialog', 'checkDialog', this.success)
    }
  }
}
</script>

<style scoped>
.el-form-item__content .el-button--text span {
  color: #409eff !important;
}
.details-table td {
  min-width: 140px;
}
.details-table tr .td_img img {
  width: 100% !important;
  height: auto !important;
}
</style>

