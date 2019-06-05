<template>
  <div>
    <el-alert title="" class="m-b-10" type="warning">
      <template>
        <p>说明：请在运营商后台财务管理下将订单明细数据整理后导入！
          <el-button name="btnDownLoad" type="text" @click="downLoadTemplate">下载模板</el-button>
        </p>
      </template>
    </el-alert>
    <el-form name="btnMessageOrderForm" :model="queryForm" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <search-panel name="btnSearchForm" @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnUploadOrder" type="primary" @click="uploadVisible = true">导入订单</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="orderNo">
            <el-input name="btnEnterOrderNum" v-model="queryForm.orderNo" placeholder="订单号" @keyup.native.enter="onSearch">
              <el-button name="btnClickSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch" prop="">
          <el-form-item label="订单号：" prop="orderNo">
            <el-input name="btnEnterOrderNo" v-model="queryForm.orderNo" @keyup.native.enter="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="下单时间：" prop="orderTime">
            <el-date-picker name="btnOrderTime" v-model="queryForm.orderTime" type="daterange" :unlink-panels="true" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="orderNo" label="订单号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsName" label="产品名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="discountPrice" label="优惠金额" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="actualPrice" label="实际金额" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderType" label="订单类型" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="smsCount" label="产品数量" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payType" label="支付方式" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="订单状态" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="invoice" label="是否开票" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnDeleteOrder" type="text" @click="deleteOrder(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- @module 导入货品 -->
    <el-dialog v-if="uploadVisible" width="700px" title="导入订单" :visible.sync="uploadVisible">
      <el-form name="btnUploadForm" :model="uploadForm" label-width="100px" :rules="uploadRules" ref="uploadForm" :inline="true" class="item-lh-26 p10">
        <el-form-item label="选择文件" prop="fileName">
          <el-upload name="btnUploadFile" ref="upload" accept=".xls,.xlsx" :action="$root.settings.DOMAIN_APIS.Message + '/api/Uploader/UploadToTempAsync'" :on-success="uploaderSuccess" :on-error="uploaderError">
            <el-button name="btnBrowse" slot="trigger" type="default">浏览</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnUpLoadData" type="primary" @click="uploadData">上传</el-button>
        <el-button name="btnUploadCancel" @click="uploadVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 导入货品 -->
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import SearchPanel from '@/components/searchPanel.vue'
import {
  TemplateTypes 
} from '@/enums/message'
import {
  MESSAGE_API_PLATFORMRECHARGE_SEARCHLIST,
  MESSAGE_API_SENDLOG_SEARCHTOTAL,
  MESSAGE_API_PLATFORMRECHARGE_SAVEUPLOADRECHARGE,
  MESSAGE_API_PLATFORMRECHARGE_DELETERECHARGE
} from '@/apis/message'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      templateTypes: TemplateTypes,
      queryForm: {
        orderNo: '',
        orderTime: '',
        pageIndex: 1,
        pageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {
      }, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      uploadVisible: false,
      uploadForm: {
        fileName: ''
      },
      uploadRules: {
        fileName: [
          {
            required: true,
            message: '请选择文件',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/message/messageOrder/index',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.orderNo = query.orderNo || ''
      this.parameter.orderTime = query.orderTime
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.getData()
    },
    getData() {
      let orderTime = this.parameter.orderTime || ['', '']
      this.$store.commit('SET_TB_LOADING', true)
      let parameter = Object.assign(this.queryForm, this.parameter, {
        startTime: orderTime[0],
        endTime: orderTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_PLATFORMRECHARGE_SEARCHLIST(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    downLoadTemplate() {
      window.open(
        this.$root.settings.DOMAIN_FILE + '/messageCloud/导入订单EXCEL模板.xlsx'
      )
    },
    deleteOrder(item) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MESSAGE_API_PLATFORMRECHARGE_DELETERECHARGE({
          id: item.orderId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('删除成功！')
            this.getData()
          } else {
            this.$message.error(res.data.Message)
          }
        })
      })
    },
    uploaderSuccess(response, file) {
      if (response.Code === 'CORRECT') {
        this.uploadForm.fileName = response.Data[0]
      }
    },
    uploaderError() {
      this.$message('上传失败', 'error')
    },
    uploadData() {
      this.$refs['uploadForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MESSAGE_API_PLATFORMRECHARGE_SAVEUPLOADRECHARGE(this.uploadForm).then(
            res => {
              this.$store.commit('SET_BTN_LOADING', false)
              if (res.data.Code === 'CORRECT') {
                this.$message.success('上传成功！')
                this.uploadVisible = false
                this.getData()
              }
            }
          )
        }
      })
    }
  },
  beforeMount() {
    this.init()
  },
  mounted() {},
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    SearchPanel
  }
}
</script>
