<template>
  <div class="content">
    <div class="active-create" v-if="powers">
      <el-button name="btnCreateActive" style="width: 120px" type="primary" @click="$router.push({path: '/spread/activityBargain/bargainEdit'})">创建活动</el-button>
    </div>
    <div class="active-title">
      <div class="explain">
        <div class="img"><img src="@/assets/images/kan.png" alt=""></div>
        <div class="message">
          <div class="title">砍价</div>
          <div class="active-messages">让用户邀请好友为其砍价，实现活动裂变！</div>
        </div>
      </div>
    </div>
    <!-- 搜索条件 -->
    <el-form :model="queryForm" label-position="right" label-width="100px" :inline="true" class="item-lh-26 spread-active el-form--inline">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="活动时间：">
            <el-date-picker name="CreateTime" :unlink-panels="true" :picker-options="$root.datePickerOptions" type="daterange" v-model="queryForm.CreateTime"  ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input name="BargainTitle" v-model="queryForm.BargainTitle" :maxlength="50" @keyup.enter.native="bargainSearch"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select name="State" placeholder="全部" v-model="queryForm.State" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in bargainBasicState.Types" v-if="index != bargainBasicState.Deleted" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button name="btnBargainSearch" type="primary" @click="bargainSearch">搜索</el-button>
          <el-button name="btnBargainReset" @click="bargainReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    
    <!-- Data Table -->
    <el-table  class="tabs-tb" :data="bargainData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="BargainId" label="ID" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BargainTitle" label="活动名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Time" label="活动时间" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.Btime}} - {{scope.row.Etime}}
        </template>
      </el-table-column>
      <el-table-column prop="ItemQty" label="商品数" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="State" label="活动状态" width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.State === bargainBasicState.Published ? (Date.parse(nowDate) > Date.parse(scope.row.Etime) ? '已发布(已结束)' : Date.parse(scope.row.Btime) > Date.parse(nowDate) ? '已发布(未开始)' : '已发布(已开始)') : bargainBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="218">
        <template slot-scope="scope">
          <router-link name="bargainCheck" :to="{path:'/spread/activityBargain/bargainCheck',query:{id:scope.row.BargainId}}" class="btn-link el-button el-button--text">详情</router-link>
          <template v-if="powers">
            <router-link name="bargainEdit" v-if="scope.row.State === bargainBasicState.Wait" :to="{path:'/spread/activityBargain/bargainEdit',query:{id:scope.row.BargainId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button name="btnBargainPush" type="text" v-if="scope.row.State === bargainBasicState.Wait" @click="bargainPush(scope.row, scope.row.BargainId)">发布</el-button>
            <el-button name="btnShowQrcode" type="text" v-if="scope.row.State !== bargainBasicState.Deleted && scope.row.State != bargainBasicState.Wait" @click="showQrcode(scope.row.AppletImageUrl, scope.row.BargainId, spreadType.Bargain)">二维码</el-button>
            <el-button name="btnBargainDel" type="text" v-if="scope.row.State === bargainBasicState.Wait && scope.row.State != bargainBasicState.Published" @click="bargainDel(scope.row.BargainId)">删除</el-button>
            <el-button name="btnBargainRevoke" type="text" v-if="scope.row.State === bargainBasicState.Published && Date.parse(scope.row.Etime) > Date.parse(nowDate)" @click="bargainRevoke(scope.row.BargainId)">撤回</el-button>
          </template>  
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination1 :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="bargainTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination1>
    </div>
    <!-- 分页 end -->
    <qrcode v-if="qrcodeVisible" :qrcodeVisible="qrcodeVisible" :data="codeData" @qrcodeClose="qrcodeClose"></qrcode>
  </div>
</template>

<script>
import pagination1 from '@/components/pagination'
import qrcode from '@/components/spread/qrcode'
import {
  SeckillBasicState, CollageBasicState, BargainBasicState, SpreadType} from '@/enums/spread'
import { CompanyBasicWechatSettingType } from '@/enums/membership'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SPREAD_API_BARGAIN_SEARCH,
  SPREAD_API_BARGAIN_PUBLISH,
  SPREAD_API_BARGAIN_DELETE,
  SPREAD_API_BARGAIN_REVOKE
} from '@/apis/spread'
export default {
  data () {
    return {
      spreadType: SpreadType,
      characterType: CharacterType,
      seckillBasicState: SeckillBasicState,
      bargainBasicState: BargainBasicState,
      collageBasicState: CollageBasicState,
      queryForm: {
        BargainTitle: '',
        CreateTime: '',
        OrderBy: 0,
        State: '0',
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      bargainData: [],
      bargainTotal: 0,
      nowDate: new Date(),
      qrcodeVisible: false,
      codeData: {
      },
      powers: (this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Company && this.$store.getters.user_session.CharacterType == CharacterType.Company) || (this.$store.getters.user_session.CharacterType == CharacterType.Store && this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Store)
    }
  },
  methods: {
    init () {
      let query = JSON.parse(JSON.stringify(this.$route.query || {
      }))
      this.queryForm = Object.assign({
      }, this.queryForm, {
        BargainTitle: '',
        CreateTime: '',
        OrderBy: 0,
        State: '0',
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, query)
      !(this.$store.getters.user_session.CharacterType == CharacterType.Store || this.$store.getters.user_session.CharacterType == CharacterType.Company) ? this.$router.replace({
        path: '/noauthorized'
      }) : this.getData()
    },
    bargainReset() {
      this.queryForm = {
        BargainTitle: '',
        CreateTime: '',
        OrderBy: 0,
        State: '0',
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.bargainSearch()
    },
    bargainSearch () {
      this.queryForm.PageIndex = 1
      this.parameters = Object.assign({
      }, this.queryForm)
      this.initRoute()
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
    getData () {
      this.parameters.CreateTime = this.parameters.CreateTime
        ? this.parameters.CreateTime
        : ''
      this.queryForm = Object.assign(
        this.queryForm,
        this.parameters,
        {
          CreateTime1: this.parameters.CreateTime[0] || '1900-01-01',
          CreateTime2: this.parameters.CreateTime[1] || '1900-01-01'
        }
      )
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_BARGAIN_SEARCH(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.bargainData = res.data.Data.rows
          this.bargainTotal = res.data.Data.total
        }
      })
    },
    bargainPush (obj, id) {
      this.$confirm('确定要发布该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (Date.parse(obj.Etime) <= Date.parse(this.nowDate)) {
          this.$message.error('活动时间已过，请修改活动时间')
          return false
        } else if (!obj.ItemQty) {
          this.$message.error('请先添加商品')
          return false
        }
        this.$store.commit('SET_FULL_LOADING', true)
        SPREAD_API_BARGAIN_PUBLISH({
          BargainId: id
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.getData()
            this.$message.success(res.data.Message)
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }).catch(() => {})
    },
    bargainDel (id) {
      this.$confirm('删除后不能恢复，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        SPREAD_API_BARGAIN_DELETE({
          BargainId: id
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.getData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }).catch(() => {})
    },
    bargainRevoke (id) {
      this.$confirm('活动还没结束，确定要撤回吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        SPREAD_API_BARGAIN_REVOKE({
          BargainId: id
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.getData()
            this.$message.success(res.data.Message)
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }).catch(() => {})
    },
    showQrcode (url, id, type) {
      this.qrcodeVisible = true
      this.codeData = {
        url: url,
        id: id,
        type: type
      }
    },
    qrcodeClose () {
      this.qrcodeVisible = false
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameters))
      })
    }
  },
  beforeMount () {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination1,
    qrcode
  }
}
</script>
<style lang="scss" scoped>
.active-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  .explain {
    display: flex;
    justify-content: flex-start;
    flex: 1;
    .img {
      display: block;
      width: 50px;
      height: 50px;
      img {
        width: 100%;
      }
    }
    .message {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 10px;
      .title {
        font-size: 14px;
        line-height: 28px;
      }
      .active-messages {
        text-align: start;
      }
    }
  }
  .active-create {
    width: 100px;
  }
}
/deep/ .list-query-form.no-border-bottom {
  margin-top: 16px;
  border-top: 1px solid #ddd;
  border-bottom: none !important;
}
.list-query-form {
  height: auto;
  padding: 10px 0;
}
.spread-active /deep/ .el-form-item__label{
  font-size: 12px;
}
.spread-active /deep/ .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>
