<template>
  <div>
    <el-dialog title="导出(选择数据)" class="export-wrap" :visible.sync="visible" @close="$emit('listenExportDialog')" width="680px">
      <el-row>
        <el-col :span="21">
          <el-transfer 
          filterable 
          v-model="exportValue" 
          @change="changeData"
          :data="exportData"></el-transfer>
        </el-col>
        <el-col :span="3">
          <!-- <el-button class="block m-b-10 m-t-100">上移</el-button>
          <el-button class="block">下移</el-button> -->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="m-r-10" @click="downLoadData" name="btnCheckGold">确定</el-button>
        <el-button @click="visible=false" name="btnPrint">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_TRACE_EXPORT
} from '@/apis/stocking.js'
export default {
  // exportType  区分导出查询当前页和导出所有页（PageSize=0表示所有）
  props: {
    exportDialog: Boolean,
    data: Array,
    exportType: Object,
    searchData: Object,
    listenExportDialog: Boolean,
  },
  data() {
    return {
      YNStatus,
      exportValue: [],
      ExportColumns: [],
      exportData: this.data,
      visible: this.exportDialog,
      rightBox: [] // 选中的字段
    }
  },
  methods: {
    downLoadData() {
      if(this.rightBox.length>0){
        for(let i=0; i<this.exportData.length; i++){
          for(let j=0; j<this.rightBox.length; j++){
            if(this.exportData[i].key == this.rightBox[j]){
              console.log(this.exportData[i].label)
              this.ExportColumns.push({
                FieldEnName: this.exportData[i].key,
                FieldCnName: this.exportData[i].label
              })
            }
          }
        }

        this.$emit('listenPrintDialog', this.ExportColumns)
        this.searchData.JunkId = Number(this.searchData.JunkId)||0
        this.searchData.SourceType = Number(this.searchData.SourceType)||0
        this.searchData.MaterialType = Number(this.searchData.MaterialType)||0
        this.searchData.CategoryType = Number(this.searchData.CategoryType)||0
        this.searchData.GoldType = Number(this.searchData.GoldType)||0
        this.searchData.GoldWeight1 = Number(this.searchData.GoldWeight1)||0
        this.searchData.GoldWeight2 = Number(this.searchData.GoldWeight2)||0
        this.searchData.IsGold = Number(this.searchData.IsGold)||0
        this.searchData.RecallGoldPrice1 = Number(this.searchData.RecallGoldPrice1)||0
        this.searchData.RecallGoldPrice2 = Number(this.searchData.RecallGoldPrice2)||0
        this.searchData.RecallPrice1 = Number(this.searchData.RecallPrice1)||0
        this.searchData.RecallPrice2 = Number(this.searchData.RecallPrice2)||0
        this.searchData.OrderBy = Number(this.searchData.OrderBy)
        this.searchData.IsAsced = Number(this.searchData.IsAsced)
        this.searchData.PageIndex = Number(this.searchData.PageIndex)
        this.searchData.PageSize = Number(this.searchData.PageSize)

        this.searchData = Object.assign({}, this.searchData, {ExportColumns: this.ExportColumns})
        STOCKING_API_JUNK_TRACE_EXPORT(this.searchData).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.visible = false
            window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }else{
        this.$message.error('导出字段不能为空！')
      }
    },
    changeData(a){
      // 选中的字段
      this.rightBox = a
    },
  },
}
</script>
