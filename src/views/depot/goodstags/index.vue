<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="createNew" type="primary" @click="createDialog = true">新建</el-button>
          <el-button name="toSomeUpdate" @click="importPurchaseDialog=true">批量导入</el-button>
          <el-button name="toSomeUpdate" @click="toSomeUpdate">批量更新</el-button>
          <el-button name="refash" @click="init">刷新</el-button>
          <el-dropdown>
            <el-button>
              导出
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" @click="exportVisible=true">导出已选</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text">导出查询结果</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="m-l-10">更新列表</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="State" v-model="queryForm.State" placeholder="所有状态" filterable>
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in goodsTagsStates.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="LabelCode">
            <el-input name="LabelCode" v-model="queryForm.LabelCode" placeholder="标签编号" @keyup.enter.native="onSearch">
              <el-button name="search" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="位置：" prop="DeskId">
            <el-select name="DeskId" v-model="queryForm.DeskId" placeholder="所有位置" :filterable="true">
              <el-option label="所有位置" value="0"></el-option>
              <el-option v-for="item in desks" :key="item.value" :label="item.DeskName" :value="item.DeskId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板：" prop="PrintingId">
            <el-select name="PrintingId" v-model="queryForm.PrintingId" placeholder="所有模板" :filterable="true">
              <el-option label="所有模板" :value="''"></el-option>
              <el-option v-for="(item, index) in templateList" :key="index" :value="item.PrintingId" :label="item.PrintingName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签编号：" prop="LabelCode">
            <el-input name="LabelCode" v-model="queryForm.LabelCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="基站编号：" prop="StationCode">
            <el-input name="StationCode" v-model="queryForm.StationCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="货品条码：" prop="StoreBarCode">
            <el-input name="StoreBarCode" v-model="queryForm.StoreBarCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="货品名称：" prop="GoodsName">
            <el-input name="GoodsName" v-model="queryForm.GoodsName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="货品更新时间：" prop="LastGoodsTime">
            <el-date-picker name="LastGoodsTime" v-model="queryForm.LastGoodsTime" :unlink-panels="true" type="daterange"></el-date-picker>
          </el-form-item>
          <el-form-item label="标签更新时间：" prop="LastTime">
            <el-date-picker name="LastTime" v-model="queryForm.LastTime" :unlink-panels="true" type="daterange"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- 表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="ImageUrl" label="标签图片" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover placement="right-start" width="250" trigger="hover">
            <img :src="$root.settings.DOMAIN_IMAGE + scope.row.ImageUrl.replace('{0}','bzn')" alt>
            <img slot="reference" class="tagImg" :src="$root.settings.DOMAIN_IMAGE + scope.row.ImageUrl.replace('{0}','bzn')" alt>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="LabelCode" label="标签编号" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StationCode" label="基站编号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreBarCode" label="货品条码" sortable="custom" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="init-button-text" name="showDetailDialog" @click="showDetailDialog(scope.row.GoodsId)">{{scope.row.StoreBarCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="DeskName" label="标签位置" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.DeskName}}</template>
      </el-table-column>
      <el-table-column prop="PrintingName" label="显示模板" min-width="120" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column  prop="LastGoodsTime" label="货品更新时间" sortable="custom" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.LastGoodsTime | filterDateMinutes}}
          </template>
      </el-table-column>-->
      <el-table-column prop="LastPrintingTime" label="标签更新时间" sortable="custom" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.State === goodsTagsStates.None">-</span>
          <span v-else>{{scope.row.LastTime | filterDateMinutes}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">{{goodsTagsStates.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column prop="State" label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button name="toCheck" type="text" @click="toCheck(scope.row)">查看</el-button>
            <el-button name="toUpdate" v-if="scope.row.State > goodsTagsStates.Delete" type="text" @click="toUpdate(scope.row)">更新</el-button>
            <el-button name="toEdit" v-if="scope.row.State > goodsTagsStates.Delete" type="text" @click="toEdit(scope.row)">编辑</el-button>
            <el-button name="toAbandon" v-if="scope.row.State > goodsTagsStates.Delete" type="text" @click="toAbandon(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- end  表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·打印 -->
    <!-- <print-order title="打印" v-if="printDialog"  :visible.sync="printDialog"  :conditions="encodeURIComponent(JSON.stringify({GoodsId: goodsId}))" :printingType="storeSettingPrintingTypes.StockingCloudJunkPrintOrder" @listenPrintDialog="printDialog = false"></print-order> -->
    <!-- End Dialog·打印 -->

    <!-- @module Dialog·新建 -->
    <goodStagsCreate v-if="createDialog" :createDialog="createDialog" :templateList="templateList" :desks="desks" @listenAllDialog="listenAllDialog"></goodStagsCreate>
    <!-- End Dialog·新建 -->

    <!-- @module Dialog·查看 -->
    <goodStagsCheck v-if="checkDialog" :checkDialog="checkDialog" :selections="selections" :templateList="templateList" :desks="desks" @listenAllDialog="listenAllDialog"></goodStagsCheck>
    <!-- End Dialog·查看 -->

    <!-- @module Dialog·修改 -->
    <goodStagsEdit v-if="editDialog" :editDialog="editDialog" :selections="selections" :templateList="templateList" :desks="desks" @listenAllDialog="listenAllDialog"></goodStagsEdit>
    <!-- End Dialog·修改 -->

    <!-- dialog 货品详情 -->
    <good-detail v-if="goodDetailDialog.visible" :data="goodDetailDialog" @listenGoodDetailDialog="listenGoodDetailDialog"></good-detail>
    <!-- end 货品详情-->

    <!-- @module 导入货品 -->
    <el-dialog v-if="importPurchaseDialog" class="import-purchase-dialog" title="导入货品" :visible.sync="importPurchaseDialog" :close-on-click-modal="false" :close-on-press-escape="false" size="tiny">
      <div class="download-modflie">
        <el-button name="getTemplate" type="text" @click="getTemplate">下载模板文件</el-button>
      </div>
      <el-upload
        name="fileUploader"
        class="upload-demo"
        drag
        accept=".xls, .xlsx"
        :file-list="fileList"
        :on-success="uploaderSuccess"
        :on-error="uploaderError"
        :on-remove="removeFile"
        :action="$root.settings.DOMAIN_APIS + '/api/Upload/File/' + $root.enums.UploadFileType.PurchaseOrderBasic"
        ref="uploader"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">1、仅支持.xls和.xlsx的Excel文件。</div>
        <div class="el-upload__tip" slot="tip">2、仅支持Excel文件中第一个表格的数据导入。</div>
        <div class="el-upload__tip" slot="tip">3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</div>
        <div class="el-upload__tip" slot="tip">4、请先下载模板文件填写后再导入。</div>
        <div class="el-upload__tip" slot="tip">5、上传多个文件时，默认使用最后一个文件。</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button name="submit" type="primary" @click="importData">提交</el-button>
        <el-button name="cancel" @click="importPurchaseDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 导入货品 -->

    <!-- 导出 -->
    <el-dialog title="导出" :visible.sync="exportVisible">
      <p class="m-b-10">请选择需要导出的数据：</p>
      <el-transfer v-model="value1" :data="data"></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button name="submit" type="primary">确定</el-button>
        <el-button name="cancel" @click="importPurchaseDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GoodsTagsState, StoreSettingPrintingType } from '@/enums/merchant.js'
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_DESK_DESKDROPDOWNLIST,
  STOCKING_API_GOODSTAGS_LIST,
  STOCKING_API_GOODSTAGS_UPDATETAGS,
  STOCKING_API_GOODSTAGS_DELETE,
  STOCKING_API_PURCHASE_TEMPLETIMPORT,
  STOCKING_API_PURCHASE_TEMPLETDOWNLOAD
} from '@/apis/stocking.js'
import { MERCHANT_API_SETTING_PRINTING_GETS } from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import goodStagsCheck from './goodstagsCheck'
import goodStagsCreate from './goodstagsCreate'
import goodStagsEdit from './goodstagsEdit'
import goodDetail from '@/components/erp/goodDetail'

export default {
  data() {
    return {
      YNStatus,
      goodsTagsStates: GoodsTagsState,
      storeSettingPrintingTypes: StoreSettingPrintingType,
      data: [],
      desks: [],
      templateList: [],
      total: 0,
      queryForm: {
        CompanyId: '', // Int64: '', // 商户序号
        StoreId: '', // Int64: '', // 门店序号
        EquipId: '', // String: '', // 设备序号
        LabelCode: '', // String: '', // 标签编号
        StationCode: '', // String: '', // 基站编码
        TagCode: '', // String: '', // 标签编号(通讯)
        StoreBarCode: '', // String: '', // 条码
        GoodsName: '', // String: '', // 货品名称
        DeskId: '', // Int64: '', // 柜台序号
        PrintingId: '', // String: '', // 模板序号
        LastTime1: '', // DateTime: '', // 更新时间(开始)
        LastTime2: '', // DateTime: '', // 更新时间(结束)
        LastGoodsTime1: '', // DateTime: '', // 货品更新时间(开始)
        LastGoodsTime2: '', // DateTime: '', // 货品更新时间(结束)
        State: '0', // 状态(枚举)
        OrderBy: '4', // 排序字段(0=创建时间)
        IsAsc: YNStatus.No, // 是否升序
        PageIndex: '1', // 当前页码
        PageSize: '20', // 每页?条
        LastTime: [],
        LastGoodsTime: []
      },
      printDialog: false,
      selections: [], // 选中元素
      goodsId: '', // 打印使用ID
      fileList: [],
      parameters: {},
      goodDetailDialog: {},
      createDialog: false,
      editDialog: false,
      checkDialog: false,
      abandonDialog: false,
      importPurchaseDialog: false,
      exportVisible: false,
      tagId: ''
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
              CompanyId: '', // Int64: '', // 商户序号
              StoreId: '', // Int64: '', // 门店序号
              EquipId: '', // String: '', // 设备序号
              LabelCode: '', // String: '', // 标签编号
              StationCode: '', // String: '', // 基站编码
              TagCode: '', // String: '', // 标签编号(通讯)
              StoreBarCode: '', // String: '', // 条码
              GoodsName: '', // String: '', // 货品名称
              DeskId: '', // Int64: '', // 柜台序号
              PrintingId: '', // String: '', // 模板序号
              LastTime1: '', // DateTime: '', // 更新时间(开始)
              LastTime2: '', // DateTime: '', // 更新时间(结束)
              LastGoodsTime1: '', // DateTime: '', // 货品更新时间(开始)
              LastGoodsTime2: '', // DateTime: '', // 货品更新时间(结束)
              State: '0', // 状态(枚举)
              OrderBy: '4', // 排序字段(0=创建时间)
              IsAsc: YNStatus.No, // 是否升序
              PageIndex: '1', // 当前页码
              PageSize: '20', // 每页?条
              LastTime: [],
              LastGoodsTime: []
            }
      this.parameters = Object.assign({}, query)
      this.parameters.LastTime = query.LastTime || []
      this.parameters.LastGoodsTime = query.LastGoodsTime || []
      this.getData()
    },
    getDesks() {
      STOCKING_API_DESK_DESKDROPDOWNLIST({
        PageIndex: 1,
        PageSize: 1000
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.desks = res.data.Data
        }
      })
    },
    getTemplateList() {
      MERCHANT_API_SETTING_PRINTING_GETS({
        PrintingType: this.storeSettingPrintingTypes.StockingCloudGoodsTags,
        PageIndex: 1,
        PageSize: 1000
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.templateList = res.data.Data.Rows
        }
      })
    },
    getData() {
      // 获取旧货库存列表
      this.$store.commit('SET_TB_LOADING', true)
      let LastTime = this.parameters.LastTime.length
        ? this.parameters.LastTime
        : ['1900-01-01 0:00:00', '1900-01-01 0:00:00']
      let LastGoodsTime = this.parameters.LastGoodsTime.length
        ? this.parameters.LastGoodsTime
        : ['1900-01-01 0:00:00', '1900-01-01 0:00:00']
      let param = {
        LastTime1: LastTime[0],
        LastTime2: LastTime[1],
        LastGoodsTime1: LastGoodsTime[0],
        LastGoodsTime2: LastGoodsTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)

      STOCKING_API_GOODSTAGS_LIST(this.queryForm).then(res => {
        let result = res.data
        if (result.Code === 'CORRECT') {
          this.data = result.Data.rows
          this.total = result.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // downLoad(command) {
    //   // 导出按钮
    //   this.$store.commit('SET_FULL_LOADING', true)
    //   if (command === 'loadData') {
    //     this.downLoadData()
    //   }
    // },
    // downLoadData() {
    //   // 导出全部
    //   let apiName = 'API_JUNK_EXPORT'
    //   if (this.total > 10000) {
    //     apiName = 'API_JUNK_QUEUE'
    //   }
    //   this[apiName](
    //     Object.assign(
    //       {
    //         IsAsc: this.isAsc
    //       },
    //       this.queryForm
    //     )
    //   ).then(res => {
    //     this.$store.commit('SET_FULL_LOADING', false)
    //     if (res.data.Code === 'CORRECT') {
    //       if (this.total > 10000) {
    //         this.$confirm(
    //           '数据量较大，导出任务在后台执行，请稍后到“我的下载”去下载',
    //           '提示',
    //           {
    //             confirmButtonText: '关闭',
    //             showCancelButton: false,
    //             type: 'warning'
    //           }
    //         )
    //         return false
    //       }
    //       window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data.FilePath)
    //     } else {
    //       this.$message.error(res.data.Message)
    //     }
    //   })
    // },
    sortChange(sort) {
      // 排序
      switch (sort.prop) {
        case 'LabelCode':
          this.this.queryFrom.OrderBy = 1
          break
        case 'StoreBarCode':
          this.this.queryFrom.OrderBy = 2
          break
        case 'LastPrintingTime':
          this.this.queryFrom.OrderBy = 0
          break
        case 'LastGoodsTime':
          this.this.queryFrom.OrderBy = 3
          break
        default:
          this.this.queryFrom.OrderBy = 4
          break
      }
      this.queryFrom.IsAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    listenAllDialog(type, success) {
      this[type] = false
      if (success) {
        this.getData()
      }
    },
    getTemplate() {
      STOCKING_API_PURCHASE_TEMPLETDOWNLOAD({}).then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data
          let filename = '成品入库模板.xlsx'
          let blob = this.b64toBlob(
            data.substr(0, data.length),
            'application/xlsx'
          )
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename)
          } else {
            let btnDownload = document.createElement('a')
            btnDownload.download = filename
            btnDownload.href = URL.createObjectURL(blob)
            if (navigator.userAgent.indexOf('Firefox') > -1) {
              var evt = document.createEvent('MouseEvents')
              evt.initEvent('click', true, true)
              btnDownload.dispatchEvent(evt)
            } else {
              btnDownload.click()
            }
          }
        }
      })
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 1024
      let byteCharacters = window.atob(b64Data)
      let byteArrays = []
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize)
        let byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        let byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      let blob = new Blob(byteArrays, {
        type: contentType
      })
      return blob
    },
    importData() {
      if (this.filePath) {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_PURCHASE_TEMPLETIMPORT({
          InnId: this.InnId,
          FilePath: this.filePath
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.getData() // 更新货品
            this.importPurchaseDialog = false
          } else {
            let mArr = res.data.Message.split('<br/>')
            if (mArr.length > 1) {
              const h = this.$createElement
              let message = []
              mArr.forEach(item => {
                message.push(h('p', null, item))
              })
              this.$msgbox({
                title: '消息',
                message: h('div', null, message),
                confirmButtonText: '确定'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      } else {
        this.$message('请先上传Excel文件', 'error')
      }
    },
    uploaderSuccess(response, file) {
      if (response.Code === 'CORRECT') {
        this.fileList = [
          {
            name: file.name
          }
        ]
        this.filePath = response.Data.Path
      } else {
        this.$message.error(response.Message)
      }
    },
    uploaderError() {
      this.$message('上传失败', 'error')
    },
    removeFile() {
      this.filePath = ''
      this.fileList = []
    },
    toAbandon(row) {
      // 删除
      this.selections = [row]
      this.$confirm('您正在进行删除操作，删除后不可恢复！确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODSTAGS_DELETE(this.selections[0].TagId).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toCheck(row) {
      // 查看
      this.selections = [row]
      this.checkDialog = true
    },
    toEdit(row) {
      // 修改
      this.selections = [row]
      this.editDialog = true
    },
    toSomeUpdate() {
      if (!this.selections.length) {
        this.$message.error('请选择要更新的标签')
        return false
      }
      this.toUpdate()
    },
    toUpdate(row) {
      // 更新
      this.selections = row ? [row] : this.selections
      let arr = this.selections.map(item => {
        return item.TagId
      })
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_GOODSTAGS_UPDATETAGS(arr.join(',')).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.init()
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  mounted() {
    this.init()
    this.getDesks()
    this.getTemplateList()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    goodStagsCheck,
    goodStagsCreate,
    goodStagsEdit,
    goodDetail
  }
}
</script>

<style lang="scss"  scoped>
@media screen and (max-width: 1460px) {
  .panel-hd.retrive .el-select {
    width: 95px;
  }
}
@media screen and (max-width: 1333px) {
  .panel-hd.retrive .title {
    padding: 0 7px;
  }
}

.el-button--success {
  color: #fff;
  border-color: #67c23a !important;
}
.tagImg {
  width: 100%;
  height: 36px;
  vertical-align: middle;
}
</style>
