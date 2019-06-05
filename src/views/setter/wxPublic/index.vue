<template>
  <div class="content">
    <el-form @keyup.enter.native="onSearch" :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch('true')" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="StatusChoose" v-model="form.Status" @change="onSearch">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in PaymentAuthorizerStatus.TypeArray" :value="item.KeyId" :label="item.Value" :key="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="EnglishID">
            <el-input name="englishIDSearch" v-model="form.EnglishID" placeholder="授权门店编号">
              <el-button name="onSearch" @click="onSearch('false')" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="授权门店编号：" prop="EnglishID">
            <el-input name="EnglishID" v-model="form.EnglishID"></el-input>
          </el-form-item>
          <el-form-item label="授权门店名称：" prop="StoreTitle">
            <el-input name="StoreTitle" v-model="form.StoreTitle"></el-input>
          </el-form-item>
          <el-form-item label="公众号昵称：" prop="NickName">
            <el-input name="NickName" v-model="form.NickName"></el-input>
          </el-form-item>
          <el-form-item label="授权角色序号：" prop="CharacterId">
            <el-input name="CharacterId" v-model="form.CharacterId"></el-input>
          </el-form-item>
          <el-form-item label="授权状态：" prop="Status">
            <el-select name="Status" v-model="form.Status">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in PaymentAuthorizerStatus.TypeArray" :value="item.KeyId" :label="item.Value" :key="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小程序名称：" prop="AppletTitle">
            <el-input name="AppletTitle" v-model="form.AppletTitle"></el-input>
          </el-form-item>
          <el-form-item label="小程序状态：" prop="UnStatus">
            <el-select name="UnStatus" v-model="form.UnStatus">
              <el-option label="全部" :value="-1"></el-option>
              <el-option v-for="item in WxAppletUnStatus.TypeArray" :value="item.KeyId" :label="item.Value" :key="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column fixed label="授权序号" width="200" :formatter="formatter" prop="AuthorizerId"></el-table-column>
      <el-table-column width="100" label="授权角色序号" prop="CharacterId" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" label="授权门店编号" prop="EnglishID" show-overflow-tooltip></el-table-column>
      <el-table-column width="120" label="授权门店名称" prop="StoreTitle" show-overflow-tooltip></el-table-column>
      <el-table-column width="120" label="公众号昵称" prop="NickName" show-overflow-tooltip></el-table-column>
      <el-table-column width="150" label="最近更新时间" prop="LastTime" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" label="授权状态" :formatter="formatter" prop="Status" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" label="小程序状态" :formatter="formatter" prop="UnStatus" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" label="小程序名称" :formatter="formatter" prop="AppletTitle" show-overflow-tooltip></el-table-column>
      <el-table-column width="150" label="微信平台ID" prop="OpenAppId" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="560">
        <template slot-scope="scoped">
          <el-button name="wxDiyReply" @click="$router.push({path: `/setter/wxpublic/replyedit?authorizerId=${scoped.row.AuthorizerId}`})" type="text">微信自定义回复消息</el-button>
          <el-button name="wxDiyMenu" @click="$router.push({path: `/setter/wxpublic/menuedit?authorizerId=${scoped.row.AuthorizerId}&UnStatus=${scoped.row.UnStatus}`})" type="text">微信自定义菜单</el-button>
          <el-button name="authorizerCencel" v-if="scoped.row.Status==PaymentAuthorizerStatus.Auth" @click="Abando($event,scoped.row.AuthorizerId,scoped.$index)" type="text">取消授权</el-button>
          <el-button name="relateMiniProgram" v-if="scoped.row.UnStatus!=WxAppletUnStatus.Related" @click="RelationApplet($event,scoped.row.AuthorizerAppId,scoped.row.AuthorizerId)" type="text">关联小程序</el-button>
          <el-button name="refreshRelationStatus" v-if="scoped.row.UnStatus!=WxAppletUnStatus.Related" @click="RefreshApplet(scoped.row.AuthorizerId,scoped.row.AppId)" type="text">刷新关联状态</el-button>
          <el-button name="refreshWxVIPCard" @click="RefreshWxCard(scoped.row.AuthorizerId,scoped.row.AppId)" type="text">刷新微信会员卡</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <el-dialog title="关联小程序" width="25%" :visible.sync="dialogRelationVisible" :before-close="handleClose" center>
      <el-form ref="relationData" :rules="rule" :model="relationData" label-width="100px">
        <el-form-item prop="AppId" label="AppId：">
          <el-input name="AppId" type="text" v-model="relationData.AppId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="relateCancel" @click="handleClose">取 消</el-button>
        <el-button name="relateConfirm" type="primary" @click="relationSub('relationData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_AUTHORDELETE, // 微信管理 - 微信公众号设置(删除)
  MARKETING_API_WX_APPLET_CHECKAPPLET, //  小程序 - 检测关联小程序
  MARKETING_API_WX_APPLET_BINDWXAMPLINK, // 小程序 - 关联小程序
  // MARKETING_API_WX_APPLET_UNBINDWXAMPLINK, // 小程序 - 解除关联小程序
  MARKETING_API_WX_APPLET_GETWXAMPLINKSTATUS, // 小程序 - 查询小程序关联状态
  MARKETING_API_WEB_CHAT_UPDATEISOPENCARD, // 微信公众号设置(刷新卡券开通状态)
  MARKETING_API_WEB_CHAT_AUTHORIZERLIST // 微信管理 - 微信公众号设置(列表)
} from '@/apis/marketing.js'

import { CharacterType, YNStatus } from '@/enums/common.js'
import { WxAppletUnStatus } from '@/enums/component.js'
import { PaymentAuthorizerStatus } from '@/enums/payment.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      form: {
        UnStatus: -1,
        EnglishID: '',
        StoreTitle: '',
        NickName: '',
        CharacterId: '',
        Status: 0,
        AppletTitle: '',
        PageIndex: 1,
        PageSize: 20,
        IsAsced: YNStatus.No
      },
      total: 0,
      parameter: {},
      relationData: {},
      CharacterType,
      rule: {
        AppId: [
          {
            required: true,
            message: 'AppId不能为空！',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度最多50 个字符',
            trigger: 'blur'
          }
        ]
      },
      PaymentAuthorizerStatus,
      WxAppletUnStatus,
      tableData: [],
      curAuthorizerId: '',
      dialogRelationVisible: false
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameter.EnglishID = query.EnglishID || ''
      this.parameter.StoreTitle = query.StoreTitle || ''
      this.parameter.NickName = query.NickName || ''
      this.parameter.CharacterId = query.CharacterId || ''
      this.parameter.Status = query.Status > 0 ? query.Status : 0
      this.parameter.AppletTitle = query.AppletTitle || ''
      this.parameter.UnStatus = query.UnStatus > -1 ? query.UnStatus : -1
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/wxpublic/index',
        query: this.parameter
      })
    },
    onSearch(flag) {
      // 搜索相关
      if (flag == 'true') {
        this.form.IsAsced = YNStatus.Yes
      } else {
        this.form.IsAsced = YNStatus.No
      }
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch('true')
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MARKETING_API_WEB_CHAT_AUTHORIZERLIST(this.form)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.total = res.data.Data.Count
            this.tableData = res.data.Data.Rows
          }
          this.$store.commit('SET_TB_LOADING', false)
        })
        .catch(() => {
          this.$store.commit('SET_TB_LOADING', false)
        })
    },
    Abando(e, id) {
      e.currentTarget.blur()
      this.$confirm(
        '警告：取消授权将清除授权数据，确定要取消授权吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$store.commit('SET_TB_LOADING', true)
          MARKETING_API_WEB_CHAT_AUTHORDELETE({
            AuthorizerId: id
          })
            .then(res => {
              this.$store.commit('SET_TB_LOADING', false)
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '取消授权成功!'
                })
                this.getData()
                // this.tableData.splice(i, 1)
                // window.location.reload()
              }
              // this.tableData[i].Status = PaymentAuthorizerStatus.Unauth
              // this.$set(this.tableData[i], 'Status', this.tableData[i].Status)
            })
            .catch(() => {
              this.$store.commit('SET_TB_LOADING', false)
            })
        })
        .catch(() => { })
    },
    handleClose() {
      this.$refs.relationData.resetFields()
      this.dialogRelationVisible = false
    },
    RelationApplet(e, AuthorizerAppId, AuthorizerId) {
      e.currentTarget.blur()
      MARKETING_API_WX_APPLET_CHECKAPPLET({
        AuthorizerAppId
      }).then(res => {
        if (res.data.Code == 'ERROR') {
          this.$message.closeAll()
          this.$confirm('此小程序已绑定其它商户账号，是否确认关联', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.curAuthorizerId = AuthorizerId
              this.dialogRelationVisible = true
            })
            .catch(() => { })
        } else {
          this.curAuthorizerId = AuthorizerId
          this.dialogRelationVisible = true
        }
      })
    },
    relationSub(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          let obj = Object.assign(
            {},
            {
              AuthorizerId: this.curAuthorizerId
            },
            {
              AppId: this.relationData.AppId
            }
          )
          MARKETING_API_WX_APPLET_BINDWXAMPLINK(obj).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: '关联小程序成功！'
              })
              this.dialogRelationVisible = false
              this.relationData = {}
              this.getData()
            }
          })
        }
      })
    },
    /* UnRelationApplet(e,id) {
      e.currentTarget.blur()
      this.$confirm('你确定要取消关联小程序吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_TB_LOADING', true)
          let obj = Object.assign(
            {},
            {
              AuthorizerId: id
            }
          )
          MARKETING_API_WX_APPLET_UNBINDWXAMPLINK(obj).then(res => {
            this.$store.commit('SET_TB_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '取消关联成功!'
              })
              this.getData()
            }
          })
        })
        .catch(() => {
          this.$store.commit('SET_TB_LOADING', false)
        })
    }, */
    // 刷新关联状态
    RefreshApplet(id) {
      this.$store.commit('SET_TB_LOADING', true)
      let obj = Object.assign(
        {},
        {
          AuthorizerId: id
        }
      )
      MARKETING_API_WX_APPLET_GETWXAMPLINKSTATUS(obj).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '刷新关联状态成功！'
          })
          this.getData()
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 刷新微信会员卡
    RefreshWxCard(id) {
      this.$store.commit('SET_TB_LOADING', true)
      MARKETING_API_WEB_CHAT_UPDATEISOPENCARD({
        AuthorizerId: id
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '刷新微信会员卡开通状态成功！'
          })
          this.getData()
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    formatter(row, column) {
      let tpr
      switch (column.property) {
        case 'Status':
          tpr = PaymentAuthorizerStatus.Types[row[column.property]]
          break
        case 'AppletTitle':
          tpr = row[column.property] ? row[column.property] : '-'
          break
        case 'UnStatus':
          tpr = this.WxAppletUnStatus.Types[row[column.property]]
          break
        case 'AuthorizerId':
          tpr =
            row.CharacterType == this.CharacterType.Company
              ? row[column.property] + ' (总部授权)'
              : row[column.property] + ' (门店授权)'
          break
        default:
      }
      return tpr
    },
    sizeChange(value) {
      // 切换每页显示数
      this.parameter.PageSize = value
      this.parameter.PageIndex = 1
      this.initRoute()
    },
    currentChange(value) {
      // 切换当前页
      this.parameter.PageIndex = value
      this.initRoute()
    }
  }
}
</script>
