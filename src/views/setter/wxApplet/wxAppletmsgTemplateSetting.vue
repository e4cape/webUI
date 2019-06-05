<template>
  <div>
    <h2 class="box-title">模板消息</h2>
    <div class="tab-box p-10">
      <el-table
        :data="tableData"
        v-loading="$store.getters.tb_loading"
      >
        <el-table-column
          prop="TemplateName"
          label="模板类型"
        ></el-table-column>
        <el-table-column
          prop="TemplateNo"
          label="ID"
        ></el-table-column>
        <el-table-column
          prop="IsAdd"
          label="是已添加"
          :formatter="formatData"
        >
          <template slot-scope="scope">
            {{scope.row.IsAdd? '已添加' : '未添加'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              name="formatPreview"
              type="text"
              @click="showMsg(scoped.row.TemplateSendType)"
            >格式预览</el-button>
            <el-button
              name="addFormat"
              v-if="!scoped.row.IsAdd"
              type="text"
              @click="addMsgTemplate(scoped.row)"
            >添加</el-button>
            <el-button
              name="cancelFormat"
              v-else
              type="text"
              @click="delMsgTemplate(scoped.row)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="模板消息格式预览"
      width="25%"
      :visible.sync="dialogReleaseVisible"
      :before-close="handleClose"
    >
      <div class="prompt-text">
        <span style="line-height: 2">已下仅为消息格式，数据为虚拟数据。</span>
      </div>
      <div class="detail-box">
        <div class="box-header">
          <img
            src="/static/images/head-portrait.png"
            alt=""
          ><span>事业合伙人1</span>
        </div>
        <div class="box-content">
          <div class="box-content-t">
            <p class="font-14">{{TemplateSendType.Types[currentStatus]}}</p>
            <p class="color-b1 font-10">xxxx年xx月</p>
          </div>
          <div class="box-content-c">
            <div
              v-if="TemplateSendType.Integral == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">会员昵称</span><span>tql007</span>
            </div>
            <div
              v-if="TemplateSendType.Cancel == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">取消原因</span><span>用户自己取消</span>
            </div>
            <div
              v-if="TemplateSendType.Cancel == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">取消时间</span><span>2018-07-05 15:12:00</span>
            </div>
            <div
              v-if="TemplateSendType.Integral != currentStatus&&TemplateSendType.Bargain != currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">订单编号</span><span>2018062731231231231</span>
            </div>
            <div
              v-if="TemplateSendType.Success == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">订单时间</span><span>2018年7月5日15:10:00</span>
            </div>
            <div class="list-sty font-10">
              <span class="color-b1">商品名称</span><span>天使的守候</span>
            </div>
            <div
              v-if="TemplateSendType.Success == currentStatus||TemplateSendType.Cancel == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">订单金额</span><span>1000元</span>
            </div>
            <div
              v-if="TemplateSendType.Success == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">支付时间</span><span>2018年7月5日15 15:30</span>
            </div>
            <div
              v-if="TemplateSendType.Send == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">物流公司</span><span>顺丰</span>
            </div>
            <div
              v-if="TemplateSendType.Send == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">物流单号</span><span>SF123456789</span>
            </div>
            <div
              v-if="TemplateSendType.Collage == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">拼团结果</span><span>您的拼团已结束，点击查看拼团结果</span>
            </div>
            <div
              v-if="TemplateSendType.Bargain == currentStatus||TemplateSendType.Bargain == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">商品原价</span><span>1000元</span>
            </div>
            <div
              v-if="TemplateSendType.Bargain == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">砍价进度</span><span>已有5人砍价</span>
            </div>
            <div
              v-if="TemplateSendType.Bargain == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">当前价格</span><span>800元</span>
            </div>
            <div
              v-if="TemplateSendType.Bargain == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">剩余时间</span><span>20时35分18秒</span>
            </div>
            <div
              v-if="TemplateSendType.Integral == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">消费时间</span><span>2018-07-05 15:09:00</span>
            </div>
            <div
              v-if="TemplateSendType.Integral == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">剩余积分</span><span>900分</span>
            </div>
            <div
              v-if="TemplateSendType.Integral == currentStatus"
              class="list-sty font-10"
            >
              <span class="color-b1">消费积分</span><span>100分</span>
            </div>
          </div>
        </div>
        <div class="box-footer">
          <span class="to-left">查看详情</span><i class="el-icon-arrow-right to-right p-r-15 p-t-10"></i>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="close"
          type="primary"
          @click="handleClose"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MARKETING_API_WX_APPLET_WXAPRIVATETEMPLATE, // 小程序 - 配置模版消息(列表)
  MARKETING_API_WX_APPLET_WXASETPERSONTEMPLATE, // 小程序 - 配置模版消息(保存)
  MARKETING_API_WX_APPLET_WXADELPRIVATETEMPLATE // 小程序 - 删除模版消息
} from '@/apis/marketing.js'

import { TemplateSendType } from '@/enums/component.js'

export default {
  data() {
    return {
      tableData: [],
      formInline: {
        CompanyCode: '',
        CompanyName: ''
      },
      AuthorizerId: '',
      shopData: {
        Subset: [
          {
            CompanyCode: '',
            CompanyName: ''
          }
        ]
      },
      currentStatus: '',
      TemplateSendType: TemplateSendType,
      dialogReleaseVisible: false
    }
  },
  mounted() {
    this.AuthorizerId = this.$route.query.authorizerId
    this.getList()
  },
  methods: {
    getList() {
      this.$store.commit('SET_TB_LOADING', true)
      MARKETING_API_WX_APPLET_WXAPRIVATETEMPLATE({
        AuthorizerId: this.AuthorizerId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data
        }

        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    showMsg(status) {
      this.dialogReleaseVisible = true
      this.currentStatus = status
    },
    addMsgTemplate(data) {
      const param = {
        TemplateSendType: data.TemplateSendType,
        TemplateNO: data.TemplateNo,
        AuthorizerId: this.AuthorizerId
      }
      MARKETING_API_WX_APPLET_WXASETPERSONTEMPLATE(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '添加模板成功！'
          })
          this.getList()
        }
      })
    },
    delMsgTemplate(data) {
      const param = {
        TemplateNo: data.TemplateNo,
        AuthorizerId: this.AuthorizerId
      }
      MARKETING_API_WX_APPLET_WXADELPRIVATETEMPLATE(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '取消模板成功！'
          })
          this.getList()
        }
      })
    },
    handleClose() {
      this.dialogReleaseVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-box {
  .point {
    display: inline-block;
    margin-left: 10px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0e67cd;
  }
  .point-title {
    margin-left: 5px;
  }
}
.prompt-text {
  width: 300px;
  margin: 0 auto;
}
.detail-box {
  width: 300px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  .box-header {
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #ddd;
    img {
      margin: 0 15px 0 25px;
      vertical-align: middle;
      width: 30px;
      height: 30px;
    }
  }
  .box-content {
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid #ddd;
    .box-content-t {
      line-height: 23px;
      padding-bottom: 10px;
    }
    .box-content-c {
      padding: 30px 0;
      line-height: 23px;
      .list-sty {
        overflow: hidden;
        word-wrap: break-word;
        word-break: normal;
        span {
          &:nth-of-type(1) {
            // display: inline-block;
            float: left;
            box-sizing: border-box;
            width: 25%;
          }
          &:nth-of-type(2) {
            float: left;
            // display: inline-block;
            // word-wrap: break-word;
            // word-break: normal;
            width: 75%;
          }
        }
      }
    }
  }
  .box-footer {
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    padding-left: 10px;
  }
}
.to-left {
  float: left;
}
.to-right {
  float: right;
}
.color-b1 {
  color: #b1b1b1;
}
.font-10 {
  font-size: 10px;
}
.font-14 {
  font-size: 14px;
}
.box-title {
  // background: #f5f5f5;
  // height: 38px;
  // text-indent: 20px;
  // font: 14px/38px Microsoft YaHei,simsun;
  // border-top: 1px solid #ddd;
  // border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #777777;
  background: #f5f5f5;
  margin: 0;
  padding: 10px 0 10px 30px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.p-b-15 {
  padding-bottom: 15px;
}
.border-b-1px {
  border-bottom: 1px solid #ddd;
}
</style>
