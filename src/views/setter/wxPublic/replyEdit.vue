<template>
  <div>
    <el-button
      name="attentionAutoReply"
      type="primary"
      icon="fa fa-plus"
      @click="toRuleCreate()"
    >被关注自动回复</el-button>
    <el-button
      name="keywordAutoReply"
      type="primary"
      icon="fa fa-plus"
      @click="$router.push(`/setter/wxpublic/rulecreatebykeyword${authorizerId ? ('?authorizerId=' + authorizerId) : ''}`)"
    >关键字自动回复</el-button>
    <panel
      :border="true"
      CustmerClass="m-t-10 fix-panel fz-14"
      v-loading="isLoading"
    >
      <template slot="header">审核消息</template>
      <template slot="body">
        门店微信登录：
        <span>{{DOMAIN_BASE.store}}</span>
        <span v-if="authorizerId">?authorizerid={{(this.$store.getters['user_session'].CharacterType == CharacterType.Lingcb) ? ($route.query.authorizerId) : authorizerId}}</span>
      </template>
    </panel>
    <el-table
      :data="tableData"
      v-loading="isLoading"
      class="m-t-10"
    >
      <el-table-column
        label="回复类型"
        :formatter="formatter"
        prop="ReplyType"
      ></el-table-column>
      <el-table-column
        label="规则名称 "
        prop="RuleTitle"
      ></el-table-column>
      <el-table-column
        label="触发事件"
        :formatter="formatter"
        prop="EventType"
      ></el-table-column>
      <el-table-column
        label="匹配模式"
        :formatter="formatter"
        prop="MatchType"
      ></el-table-column>
      <el-table-column
        label="回复模式"
        :formatter="formatter"
        prop="ModeType"
      ></el-table-column>
      <el-table-column
        label="关键字"
        prop="Keywords"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            name="editByKeywork"
            type="text"
            v-if="scoped.row.ReplyType!=WxReplyType.Subscribe"
            @click="$router.push({path:'/setter/wxpublic/ruleeditbykeyword',query:{authorizerId:authorizerId,RuleId:scoped.row.RuleId}})"
          >编辑</el-button>
          <el-button
            name="editBySubscribe"
            type="text"
            v-else
            @click="$router.push({path:'/setter/wxpublic/ruleeditbysubscribe',query:{authorizerId:authorizerId,RuleId:scoped.row.RuleId}})"
          >编辑</el-button>
          <el-button
            name="delete"
            type="text"
            @click="Abandon($event,scoped.row.RuleId,scoped.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_REPLYLIST, // 微信管理 - 回复消息规则(列表)
  MARKETING_API_WEB_CHAT_RULEDELETE, // 微信管理 - 回复规则(删除)
  MARKETING_API_WEB_CHAT_GETAUTHORIZERID // 微信管理 - 获取授权序号
} from '@/apis/marketing.js'
import { CharacterType } from '@/enums/common'
import {
  WxEventType,
  WxReplyType,
  WxMatchType,
  WxModeType
} from '@/enums/component.js'
import { DOMAIN_BASE } from '@/configs/appSettings.js'
import Panel from '@/components/panel.vue'
export default {
  data() {
    return {
      isLoading: false,
      tableData: [],
      WxReplyType,
      DOMAIN_BASE,
      CharacterType,
      authorizerId: ''
    }
  },
  // 菜单高亮
  beforeRouteEnter(to, from, next) {
    let character = JSON.parse(decodeURIComponent(localStorage.userInfo))
      .CharacterType
    if (character == CharacterType.Lingcb) {
      to.meta.parentPath = '/setter/wxpublic/index'
    }
    next()
  },
  components: {
    Panel
  },
  methods: {
    toRuleCreate() {
      this.$router.push(
        `/setter/wxpublic/rulecreatebysubscribe${
          this.authorizerId ? '?authorizerId=' + this.authorizerId : ''
        }`
      )
    },
    async getList() {
      this.isLoading = true
      const res = await MARKETING_API_WEB_CHAT_GETAUTHORIZERID()
      if (res.data.Code === 'CORRECT') {
        this.authorizerId = this.authorizerId
          ? this.authorizerId
          : res.data.Data.AuthorizerId || ''
        if (this.authorizerId) {
          MARKETING_API_WEB_CHAT_REPLYLIST({
            AuthorizerId: this.authorizerId
          }).then(res => {
            this.isLoading = false
            if (res.data.Code == 'CORRECT') {
              this.tableData = res.data.Data
            }
          })
        } else {
          this.isLoading = false
        }
      }
    },
    Abandon(e, RuleId, i) {
      e.currentTarget.blur()
      this.$confirm('是否确认删除该规则！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isLoading = true
          MARKETING_API_WEB_CHAT_RULEDELETE({ RuleId }).then(res => {
            this.isLoading = false
            if (res.data.Code == 'CORRECT') {
              this.tableData.splice(i, 1)
              this.$message({
                type: 'success',
                message: res.data.Message
              })
            }
          })
        })
        .catch(() => {})
    },
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'ReplyType':
          tpr = WxReplyType.Types[arguments[2]]
          break
        case 'EventType':
          tpr = WxEventType.Types[arguments[2]]
          break
        case 'MatchType':
          tpr =
            arguments[0].ReplyType != WxReplyType.Subscribe
              ? WxMatchType.Types[arguments[2]]
              : '-'
          break
        case 'ModeType':
          tpr =
            arguments[0].ReplyType != WxReplyType.Subscribe
              ? WxModeType.Types[arguments[2]]
              : '-'
          break
        default:
      }
      return tpr
    }
  },
  mounted() {
    this.authorizerId = this.$route.query.authorizerId
    this.getList()
  }
}
</script>
<style lang="scss">
.fz-14 {
  .panel-header {
    font-size: 14px !important;
  }
}
</style>
