<template>
  <div class="content-view">
    <ul class="tabs border-b-1px">
      <li
        name="tab0"
        class="tab"
        @click="changTabs(true)"
        :class="{'active': isDraft}"
      >草稿箱</li>
      <li
        name="tab1"
        class="tab"
        @click="changTabs(false)"
        :class="{'active': !isDraft}"
      >小程序模板库</li>
    </ul>
    <div class="border-x-1px p-y-10 p-l-10">
      <p v-if="isDraft">每个小程序只保留最新一次的上传记录</p>
      <p v-else>最多可添加50个，还可以添加{{50 - (tableData.length&&tableData.length?tableData.length : '0')}}个</p>
    </div>
    <div class="table-box border-top-1px">
      <el-table
        :data="tableData"
        v-loading="isLoading"
        :default-sort="{prop: 'create_time', order: 'descending'}"
      >
        <el-table-column
          prop="user_version"
          label="版本号"
        ></el-table-column>
        <el-table-column
          prop="user_desc"
          label="描述"
        ></el-table-column>
        <el-table-column
          v-if="!isDraft"
          prop="template_id"
          label="TemplateID"
        ></el-table-column>
        <!-- <el-table-column v-else prop="draft_id" label="TemplateID"></el-table-column> -->
        <el-table-column
          prop="create_time"
          label="添加到模板库时间"
          :formatter="formatData"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              name="showDetail"
              type="text"
              v-if="!isDraft"
              @click="showDetail(scoped.row)"
            >详情</el-button>
            <el-button
              name="AddTemplate"
              v-if="isDraft"
              type="text"
              @click="AddTemplate($event,scoped.row.draft_id)"
            >添加到模板库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="模板消息预览"
      :visible.sync="dialogReleaseVisible"
      width="30%"
      :before-close="handleClose"
      center
    >
      <el-row>
        <el-col
          class="text-center"
          :span="6"
        >版本号</el-col>
        <el-col
          class="no-wrap"
          :span="18"
        >{{detailData.user_version}}</el-col>
      </el-row>
      <el-row>
        <el-col
          class="text-center"
          :span="6"
        >描述</el-col>
        <el-col
          class="no-wrap"
          :span="18"
        >{{detailData.user_desc}}</el-col>
      </el-row>
      <el-row>
        <el-col
          class="text-center"
          :span="6"
        >TemplateID</el-col>
        <el-col
          class="no-wrap"
          :span="18"
        >{{detailData.template_id}}</el-col>
      </el-row>
      <el-row>
        <el-col
          class="text-center"
          :span="6"
        >添加时间</el-col>
        <el-col
          class="no-wrap"
          :span="18"
        >{{dayjs(detailData.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</el-col>
      </el-row>
      <div
        slot="footer"
        class="dialog-footer del-btn"
      >
        <el-button
          name="releaseClose"
          ype="primary"
          @click="handleClose"
        >关闭</el-button>
        <el-button
          name="deleteTemplate"
          class="btn-color-r"
          @click="deleteTemplate(detailData.template_id)"
        >从模板中删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  MARKETING_API_WX_APPLET_ADDTOTEMPLATE, // 小程序 - 将草稿箱的草稿选为小程序代码模版
  // MARKETING_API_ORDER_RECHARGE_BASIC_AUDIT, // 充值单 - 审核(主键行锁)
  MARKETING_API_WX_APPLET_DELETETEMPLATE, // 小程序 - 删除指定小程序代码模版
  MARKETING_API_WX_APPLET_GETTEMPLATEDRAFTLIST, // 小程序 - 获取草稿箱内的所有临时代码草稿
  MARKETING_API_WX_APPLET_GETTEMPLATELIST //  小程序 - 获取代码模版库中的所有小程序代码模版
} from '@/apis/marketing.js'

import { PaymentType } from '@/enums/common.js'

import {
  RechargeOrderResultStatus,
  RechargeOrderStatus
} from '@/enums/marketing.js'

export default {
  data() {
    return {
      formInline: {
        Status: '0'
      },
      isLoading: true,
      createTime: [],
      tableData: [],
      detailData: {},
      RechargeOrderStatus,
      RechargeOrderResultStatus,
      PaymentType: PaymentType,
      page: {
        PageIndex: 1,
        PageSize: 10
      },
      dayjs,
      isDraft: true,
      dialogReleaseVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    changTabs(flag) {
      this.isDraft = flag
      this.getList()
    },
    AddTemplate(e, id) {
      e.currentTarget.blur()
      this.$confirm('是否确认添加模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_WX_APPLET_ADDTOTEMPLATE({
            draftId: id
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
            }
          })
        })
        .catch(() => {})
    },
    deleteTemplate(id) {
      MARKETING_API_WX_APPLET_DELETETEMPLATE({
        templateId: id + ''
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '模板消息删除成功！'
          })
          this.dialogReleaseVisible = false
          this.getList()
        }
      })
    },
    showDetail(data) {
      this.detailData = data
      this.dialogReleaseVisible = true
    },
    /* Audit(e,id) {
      e.currentTarget.blur()
      this.$confirm('是否确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        // MARKETING_API_ORDER_RECHARGE_BASIC_AUDIT({
          OrderId: id
        }).then(res => {
          this.isLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            window.location.reload()
          }
        })
      })
    }, */
    getList() {
      this.isLoading = true
      if (this.isDraft) {
        MARKETING_API_WX_APPLET_GETTEMPLATEDRAFTLIST()
          .then(res => {
            if (res.data.Code == 'CORRECT') {
              this.tableData = res.data.Data || []
            }
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          })
      } else {
        MARKETING_API_WX_APPLET_GETTEMPLATELIST()
          .then(res => {
            if (res.data.Code == 'CORRECT') {
              this.tableData = res.data.Data || []
            }
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    },
    handleClose() {
      this.dialogReleaseVisible = false
    },
    formatData(row, column) {
      switch (column.property) {
        case 'create_time':
          return dayjs(row[column.property] * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        default:
      }
    }
  }
}
</script>
<style lang="scss">
.table-box {
  .el-table--border {
    border-top: none;
  }
}
</style>
<style lang="scss" scoped>
.no-wrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.border-b-1px {
  border-bottom: 1px solid #e5e5e5;
}
</style>
