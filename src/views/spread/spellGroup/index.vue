<template>
  <div class="content">
    <div class="active-create" v-if="powers">
      <el-button name="btnCreateActive" style="width: 120px" type="primary" @click="$router.push({path: '/spread/activitySpellGroup/spellGroupEdit'})">创建活动</el-button>
    </div>
    <div class="active-title">
      <div class="explain">
        <div class="img"><img src="@/assets/images/pin.png" alt=""></div>
        <div class="message">
          <div class="title">拼团</div>
          <div class="active-messages">让用户邀请好友一起参与活动，让活动裂变，让更多人参与！</div>
        </div>
      </div>
    </div>
    
    <!-- 搜索条件 -->
    <el-form :model="queryForm" label-position="right" label-width="100px" :inline="true" class="item-lh-26 spread-active el-form--inline">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="活动时间：">
            <el-date-picker name="CreateTime" v-model="queryForm.CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange"  ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input name="CollageTitle" v-model="queryForm.CollageTitle" :maxlength="50" @keyup.enter.native="spellGroupSearch"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select name="State" placeholder="全部" v-model="queryForm.State" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in collageBasicState.Types">
                <el-option v-if="index != collageBasicState.Deleted" :key="index" :label="item" :value="String(index)"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button name="btnSpellGroupSearch" type="primary" @click="spellGroupSearch">搜索</el-button>
          <el-button name="btnSpellGroupReset" @click="spellGroupReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    
    <!-- Data Table -->
    <el-table  class="tabs-tb" :data="spellGroupData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CollageId" label="ID" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CollageTitle" label="活动名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Time" label="活动时间" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.Btime}}-{{scope.row.Etime}}
        </template>
      </el-table-column>
      <el-table-column prop="ItemQty" label="商品数" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="活动状态" width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.State === collageBasicState.Published ? (Date.parse(nowDate) > Date.parse(scope.row.Etime) ? '已发布(已结束)' : Date.parse(scope.row.Btime) > Date.parse(nowDate) ? '已发布(未开始)' : '已发布(已开始)') : collageBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="218">
        <template slot-scope="scope">
          <router-link name="spellGroupCheck" :to="{path:'/spread/activitySpellGroup/spellGroupCheck',query:{id:scope.row.CollageId}}" class="btn-link el-button el-button--text">详情</router-link>
          <template v-if="powers">
            <router-link name="spellGroupEdit" v-if="scope.row.State === collageBasicState.Wait" :to="{path:'/spread/activitySpellGroup/spellGroupEdit',query:{id:scope.row.CollageId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button name="btnSpellGroupPush" type="text" v-if="scope.row.State === collageBasicState.Wait" @click="spellGroupPush(scope.row, scope.row.CollageId)">发布</el-button>
            <el-button name="btnShowQrcode" type="text" v-if="scope.row.State !== collageBasicState.Deleted && scope.row.State != collageBasicState.Wait" @click="showQrcode(scope.row.AppletImageUrl, scope.row.CollageId, spreadType.Collage)">二维码</el-button>
            <el-button name="btnSpellGroupDel" type="text" v-if="scope.row.State === collageBasicState.Wait && scope.row.State != collageBasicState.Published" @click="spellGroupDel(scope.row.CollageId)">删除</el-button>
            <el-button name="btnSpellGroupRevoke" type="text" v-if="scope.row.State === collageBasicState.Published && Date.parse(scope.row.Etime) > Date.parse(nowDate)" @click="spellGroupRevoke(scope.row.CollageId)">撤回</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="spellGroupTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
    <qrcode v-if="qrcodeVisible" :qrcodeVisible="qrcodeVisible" :data="codeData" @qrcodeClose="qrcodeClose"></qrcode>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import qrcode from '@/components/spread/qrcode'
import {
  CollageBasicState, SpreadType
} from '@/enums/spread'
import { CompanyBasicWechatSettingType } from '@/enums/membership'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SPREAD_API_COLLAGE_SEARCH,
  SPREAD_API_COLLAGE_PUBLISH,
  SPREAD_API_COLLAGE_DELETE,
  SPREAD_API_COLLAGE_REVOKE
} from '@/apis/spread'
export default {
  data () {
    return {
      spreadType: SpreadType,
      characterType: CharacterType,
      collageBasicState: CollageBasicState,
      queryForm: {
        CollageTitle: '',
        CreateTime: '',
        OrderBy: 0,
        State: '0',
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      spellGroupData: [],
      spellGroupTotal: 0,
      nowDate: new Date(),
      qrcodeVisible: false,
      codeData: {
      },
      powers:  (this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Company && this.$store.getters.user_session.CharacterType == CharacterType.Company) || (this.$store.getters.user_session.CharacterType == CharacterType.Store && this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Store)
    }
  },
  methods: {
    init () {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, {
        CollageTitle: '',
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
    spellGroupReset () {
      this.queryForm = {
        CollageTitle: '',
        CreateTime: '',
        OrderBy: 0,
        State: '0',
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.spellGroupSearch()
    },
    spellGroupSearch () {
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
      this.parameters.CreateTime = this.parameters
        .CreateTime
        ? this.parameters.CreateTime
        : ''
      this.queryForm = Object.assign(
        this.queryForm,
        this.parameters,
        {
          BTime: this.parameters.CreateTime[0] || '1900-01-01',
          ETime: this.parameters.CreateTime[1] || '1900-01-01'
        }
      )
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_SEARCH(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.spellGroupData = res.data.Data.rows
          this.spellGroupTotal = res.data.Data.total
        }
      })
    },
    spellGroupPush (obj, id) {
      this.$confirm('确定要发布该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (Date.parse(obj.Etime) <= Date.parse(this.nowDate)) {
            this.$message.error('活动时间已过，请修改活动时间')
            return false
          } else if (!obj.ItemQty) {
            this.$message.error('请先添加商品')
            return false
          }
          this.$store.commit('SET_FULL_LOADING', true)
          SPREAD_API_COLLAGE_PUBLISH({
            CollageId: id
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message.success(res.data.Message)
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message.warning('已取消')
        })
    },
    spellGroupDel (id) {
      this.$confirm('删除后不能恢复，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          SPREAD_API_COLLAGE_DELETE({
            CollageId: id
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
        })
        .catch(() => {
          this.$message.warning('已取消')
        })
    },
    spellGroupRevoke (id) {
      this.$confirm('活动还没结束，确定要撤回吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          SPREAD_API_COLLAGE_REVOKE({
            CollageId: id
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message.success(res.data.Message)
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message.warning('已取消')
        })
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
    pagination,
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
.list-query-form.no-border-bottom {
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
