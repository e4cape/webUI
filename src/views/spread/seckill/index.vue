<template>
  <div class="content">
    <div class="active-create" v-if="powers">
      <el-button name="btnSeckillEdit" style="width: 120px" type="primary" @click="$router.push({path: '/spread/activitySeckill/seckillEdit'})">创建活动</el-button>
    </div>
    <div class="active-title">
      <div class="explain">
        <div class="img"><img src="@/assets/images/miao.png" alt=""></div>
        <div class="message">
          <div class="title">定期秒杀，积聚人气</div>
          <div class="active-messages red">说明：秒杀活动开始后，系统每天会以匿名的方式虚拟增加秒杀订单显示在买家端，营造秒杀氛围吸引买家参与活动，商家只需向真实付款的买家发货，特此说明！</div>
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
            <el-input name="SeckillTitle" v-model="queryForm.SeckillTitle" :maxlength="50" @keyup.enter.native="seckillSearch"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select name="State" placeholder="全部" v-model="queryForm.State" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in seckillBasicState.Types" v-if="index != seckillBasicState.Deleted" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button name="btnSeckillSearch" type="primary" @click="seckillSearch">搜索</el-button>
          <el-button name="btnSeckillReset" @click="seckillReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    <!-- Data Table -->
    <el-table  class="tabs-tb" :data="seckillData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="SeckillId" label="ID" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SeckillTitle" label="活动名称" min-width="100"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="Time" label="活动时间" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.Btime}}-{{scope.row.Etime}}
        </template>
      </el-table-column>
      <el-table-column prop="ItemQty" label="商品数" width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="活动状态" width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.State === seckillBasicState.Published ? (Date.parse(nowDate) > Date.parse(scope.row.Etime) ? '已发布(已结束)' : Date.parse(scope.row.Btime) > Date.parse(nowDate) ? '已发布(未开始)' :'已发布(已开始)') : seckillBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="218">
        <template slot-scope="scope">
            <router-link name="seckillCheck" :to="{path:'/spread/activitySeckill/seckillCheck',query:{id:scope.row.SeckillId}}" class="btn-link el-button el-button--text">详情</router-link>
            <template v-if="powers">
              <router-link name="seckillEdit" v-if="scope.row.State === seckillBasicState.Wait" :to="{path:'/spread/activitySeckill/seckillEdit',query:{id:scope.row.SeckillId}}" class="btn-link el-button el-button--text">编辑</router-link>
              <el-button name="btnSeckillPush" type="text" v-if="scope.row.State === seckillBasicState.Wait" @click="seckillPush(scope.row, scope.row.SeckillId)">发布</el-button>
              <el-button name="btnShowQrcode" type="text" v-if="scope.row.State !== seckillBasicState.Deleted && scope.row.State != seckillBasicState.Wait" @click="showQrcode(scope.row.AppletImageUrl, scope.row.SeckillId, spreadType.Seckill)">二维码</el-button>
              <el-button name="btnSeckillDel" type="text" v-if="scope.row.State === seckillBasicState.Wait && scope.row.State != seckillBasicState.Published" @click="seckillDel(scope.row.SeckillId)">删除</el-button>
              <el-button name="btnSeckillRevoke" type="text" v-if="scope.row.State === seckillBasicState.Published && Date.parse(scope.row.Etime) > Date.parse(nowDate)" @click="seckillRevoke(scope.row.SeckillId)">撤回</el-button>
            </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="seckillTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
    <qrcode v-if="qrcodeVisible" :qrcodeVisible="qrcodeVisible" :data="codeData" @qrcodeClose="qrcodeClose"></qrcode>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import qrcode from '@/components/spread/qrcode'
import {
  SeckillBasicState,
  SpreadType
} from '@/enums/spread'
import { CompanyBasicWechatSettingType } from '@/enums/membership'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SPREAD_API_SECKILL_SEARCH,
  SPREAD_API_SECKILL_PUBLISH,
  SPREAD_API_SECKILL_DELETE,
  SPREAD_API_SECKILL_REVOKE
} from '@/apis/spread'
export default {
  data() {
    return {
      spreadType: SpreadType,
      characterType: CharacterType,
      seckillBasicState: SeckillBasicState,
      queryForm: {
        SeckillTitle: '',
        CreateTime: '',
        State: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      seckillData: [],
      seckillTotal: 0,
      nowDate: new Date(),
      qrcodeVisible: false,
      codeData: {
      },
      powers:  (this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Company && this.$store.getters.user_session.CharacterType == CharacterType.Company) || (this.$store.getters.user_session.CharacterType == CharacterType.Store && this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Store)
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, {
        SeckillTitle: '',
        CreateTime: '',
        State: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, query)
      !(this.$store.getters.user_session.CharacterType == CharacterType.Store || this.$store.getters.user_session.CharacterType == CharacterType.Company)
        ? this.$router.replace({
          path: '/noauthorized' 
        })
        : this.getData()
    },
    seckillReset () {
      this.queryForm = {
        SeckillTitle: '',
        CreateTime: '',
        State: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.seckillSearch()
    },
    seckillSearch() {
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
    getData() {
      this.parameters.CreateTime = this.parameters.CreateTime
        ? this.parameters.CreateTime
        : ''
      this.queryForm = Object.assign(this.queryForm, this.parameters, {
        CreateTime1: this.parameters.CreateTime[0] || '1900-01-01',
        CreateTime2: this.parameters.CreateTime[1] || '1900-01-01'
      })
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SECKILL_SEARCH(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.seckillData = res.data.Data.rows
          this.seckillTotal = res.data.Data.total
        }
      })
    },
    seckillPush(obj, id) {
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
          SPREAD_API_SECKILL_PUBLISH({
            SeckillId: id
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
    seckillDel(id) {
      this.$confirm('删除后不能恢复，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          SPREAD_API_SECKILL_DELETE({
            SeckillId: id
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
    seckillRevoke(id) {
      this.$confirm('活动还没结束，确定要撤回吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          SPREAD_API_SECKILL_REVOKE({
            SeckillId: id
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
    showQrcode(url, id, type) {
      this.qrcodeVisible = true
      this.codeData = {
        url: url,
        id: id,
        type: type
      }
    },
    qrcodeClose() {
      this.qrcodeVisible = false
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameters)) 
      })
    }
  },
  beforeMount() {
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
