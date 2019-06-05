<template>
  <div class="content p-b-20">
    <header v-if="characterType !== CharacterType.Lingcb">
      <div class="introduce">
        <i></i>
        <p>
          <span>排队取金</span>
          <span>指商家从每一单非素销售额中拿出一部分折算成黄金奖励给购买非素排队轮候的客户，客户到店可以领取等量黄金或补差额购买超出部分黄金，也可将领取的黄金折算成现金购买非素商品。是一种高效的非转素、素转非的营销活动。补录和手工录入销售单、小程序订单、赠品单不参加排队取金活动。</span>
        </p>
      </div>
      <div class="create-description">
        <p class="title">
          <i class="icon-list m-r-10"></i>活动创建说明
        </p>
        <el-row type="flex" :gutter="20">
          <el-col :span="6" tag="div" class="description-item">
            <p>商家建立黄金池</p>
            <div>从每一单非素销售金额中拿出一定比例折算为黄金作为黄金池，用于奖励消费非素的客户。</div>
          </el-col>
          <el-col :span="6" tag="div" class="description-item">
            <p>客户排队领黄金</p>
            <div>客户购买非素商品后，即可获得排队取金资格并按其购买金额的一定比例领取等价黄金。</div>
          </el-col>
          <el-col :span="6" tag="div" class="description-item">
            <p>轮候与黄金发放</p>
            <div>黄金池内黄金达到轮候客户领奖黄金数量时系统自动发放，以此类推。</div>
          </el-col>
          <el-col :span="6" tag="div" class="description-item">
            <p>客户使用领取的黄金</p>
            <div>领到的黄金，可到店提取等量克重的实物黄金商品或用于抵扣购买非素类的商品金额。</div>
          </el-col>
        </el-row>
      </div>
      <div class="return-description">
        <p class="title">
          <i class="icon-list m-r-10"></i>退货说明
        </p>
        <ul>
          <li>1、消费时参加了排队取金，若退货则自动取消排队资格，无法继续领黄金。</li>
          <li>2、退货后排在其后面的排位自动上升。</li>
          <li>3、已领到的黄金若贡献者中有人退货，系统会自动从领取的黄金中扣除退货贡献者贡献的黄金数。</li>
          <li>4、已领取且使用，贡献者退货不会对已领取且已使用的顾客产生影响。</li>
        </ul>
      </div>
    </header>
    <header v-else>
      <el-form :model="form" ref="search" @keyup.enter.native="search" lable-width="120px" class="item-lh-26 p-t-10" :inline="true">
        <el-row type="flex" class="search-box">
          <el-col class="search-form">
            <el-form-item label="活动时间" prop="ActivityStart">
              <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" v-model="form.activityTimeRange" :clearable="false" @change="dateChange"/>
            </el-form-item>
            <el-form-item label="活动ID" prop="QueueId">
              <el-input name="inputQueueId" v-model="form.QueueId"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="CheckStatus">
              <el-select name="selectCheckStatus" v-model="form.CheckStatus">
                <el-option :value="0" label="全部"></el-option>
                <el-option v-for="(value, key) in QueueReceiveGoldStatus.Types" :key="key" :value="parseInt(key)" :label="value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司编码" prop="CompanyCode">
              <el-input name="inputCompanyCode" v-model="form.CompanyCode"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="CompanyName">
              <el-input name="inputCompanyName" v-model="form.CompanyName"></el-input>
            </el-form-item>
            <el-form-item label="门店编码" prop="StoreCode">
              <el-input name="inputStoreCode" v-model="form.StoreCode"></el-input>
            </el-form-item>
            <el-form-item label="门店名称" prop="StoreName">
              <el-input name="inputStoreName" v-model="form.StoreName"></el-input>
            </el-form-item>
          </el-col>
          <div class="search-btn">
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
            <el-button name="btnExportList" type="default" @click="reset">重置</el-button>
            <el-button name="btnExportList" type="default" @click="exportList">导出Excel</el-button>
          </div>
        </el-row>
      </el-form>
    </header>
    <main class="p-y-10" style="display:block">
      <div class="create m-b-10" v-if="characterType === CharacterType.Company || characterType ===  CharacterType.Store && wechatSettingType === CompanyBasicWechatSettingType.Store">
        <router-link to="/market/lineupgold/create">
          <el-button name="btnCreate" type="primary" class="m-r-20">创建</el-button>
        </router-link>
      </div>
      <el-table :data="tableData" v-loading="tableLoading">
        <template v-if="characterType === CharacterType.Lingcb">
          <el-table-column prop="CompanyCode" label="公司编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CompanyName" label="公司名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StoreCode" label="门店编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StoreName" label="门店名称" width="200" show-overflow-tooltip></el-table-column>
        </template>
        <el-table-column prop="QueueId" label="活动ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ActivityStart" label="活动时间" :formatter="formatter" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="参与条件" v-if="characterType !== CharacterType.Lingcb">
          <template slot-scope="scope">
            <el-button name="btnShowMaterials" type="text" @click="showMaterials(scope.row.MaterialTypes)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="NotReceiveQry" label="未领奖" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ReceiveQry" label="已领奖" show-overflow-tooltip></el-table-column>
        <el-table-column label="总参与" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.NotReceiveQry + scope.row.ReceiveQry}}</template>
        </el-table-column>
        <el-table-column prop="CheckStatus" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.CheckStatus | findKey(QueueReceiveGoldStatus)">{{QueueReceiveGoldStatus.Types[scope.row.CheckStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="characterType ===  CharacterType.Lingcb ? 'auto' : 120">
          <template slot-scope="scope">
            <template v-if="characterType === CharacterType.Company || characterType === CharacterType.Store && wechatSettingType === CompanyBasicWechatSettingType.Store">
              <el-button name="btnAudit" type="text" @click="dialogAudit = true, actionParam.QueueId = scope.row.QueueId" v-if="scope.row.CheckStatus === QueueReceiveGoldStatus.Origin">审核</el-button>
              <el-button
                name="btnModify"
                type="text"
                v-if="scope.row.CheckStatus === QueueReceiveGoldStatus.Origin || scope.row.CheckStatus === QueueReceiveGoldStatus.NotStart"
                @click="$router.push('/market/lineupgold/edit/' + scope.row.QueueId)"
              >修改</el-button>
              <el-button name="btnStop" type="text" @click="terminal(scope.row.QueueId)" v-if="scope.row.CheckStatus === QueueReceiveGoldStatus.Start">终止</el-button>
            </template>
            <el-button name="btnDetail" type="text" @click="$router.push('/market/lineupgold/detail/' + scope.row.QueueId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </main>
    <el-dialog title="参与条件" :visible.sync="dialogMaterials">
      <p style="line-height: 1.5">{{showMaterialTypes}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnDialogMaterials" @click="dialogMaterials = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="审核" :visible.sync="dialogAudit" width="500px" @open="isAudit = YNStatus.Yes, actionParam.CheckNote = ''">
      <div v-loading="dialogAuditLoading">
        <p class="p-b-5">
          <el-radio name="radioIsAuditYes" v-model="isAudit" :label="YNStatus.Yes">审核通过</el-radio>
        </p>
        <p class="p-b-5">
          <el-radio name="radioIsAuditNo" v-model="isAudit" :label="YNStatus.No">审核退回</el-radio>
        </p>
        <div v-if="isAudit === YNStatus.No" style="padding-left:24px; display: flex; align-items: flex-end;">
          <el-input name="inputCheckNote" v-model="actionParam.CheckNote" type="textarea" :maxlength="50" placeholder="输入审核退回原因（必填）"></el-input>
          <p style="padding-left:10px;white-space: nowrap;color:#999">{{actionParam.CheckNote.length}}/50</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAuditOrAbandon" type="primary" @click="auditOrAbandon">确定</el-button>
        <el-button name="btnCancel" @click="dialogAudit = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueueReceiveGoldStatus,
} from '@/enums/marketing.js'
import {
  YNStatus,
  CharacterType
} from '@/enums/common'
import {
  CompanyBasicWechatSettingType
} from '@/enums/spread'
import {
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GETS,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_AUDIT,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ABANDON,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_TERMINAL,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_LISTEXPORT
} from '@/apis/marketing'
import pagination from '@/components/pagination.vue'
import dayjs from 'dayjs'
export default {
  components: {
    pagination
  },
  data() {
    return {
      YNStatus,
      CharacterType,
      QueueReceiveGoldStatus,
      CompanyBasicWechatSettingType,
      total: 0,
      tableData: [],
      tableLoading: true,
      dialogMaterials: false,
      showMaterialTypes: '',
      dialogAudit: false,
      dialogAuditLoading: false,
      isAudit: '',
      parameter: {
      },
      form: {
        activityTimeRange: [],
        ActivityStart: '',
        ActivityStop: '',
        QueueId: '',
        CheckStatus: 0,
        CompanyCode: '',
        StoreCode: '',
        StoreName: '',
        PageIndex: 1,
        PageSize: 20,
        IsAsced: YNStatus.No
      },
      actionParam: {
        QueueId: '',
        CheckNote: ''
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return parseInt(this.$store.getters.wechatSettingType)
    },
    materialType() {
      return this.$store.getters.materialType.Types
    }
  },
  watch: {
    $route: 'init'
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
  },
  mounted() {
    this.init()
  },
  methods: {
    dateChange(value) {
      if (value) {
        this.form.ActivityStart = dayjs(new Date(value[0])).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.form.ActivityStop = dayjs(new Date(value[1])).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    showMaterials(val) {
      this.dialogMaterials = true
      this.showMaterialTypes = val
        .split(',')
        .map(val => this.materialType[val])
        .join('，')
    },
    handleActivityTimeRange(val) {
      if (val) {
        this.form.ActivityStart = val[0]
        this.form.ActivityStop = val[1]
      } else {
        this.form.ActivityStart = ''
        this.form.ActivityStop = ''
      }
    },
    exportList() {
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_LISTEXPORT(this.parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    auditOrAbandon() {
      this.dialogAuditLoading = true
      let params = Object.assign({}, this.actionParam)
      params.CharacterId = this.$store.getters.user_session.CharacterId
      params.CheckUserId = this.$store.getters.user_session.CheckUserId
      params.CheckUser = this.$store.getters.user_session.CheckUser
      if (this.isAudit === YNStatus.Yes) {
        params.CheckNote = ''
        MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_AUDIT(params).then(res => {
          this.dialogAuditLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
            this.dialogAudit = false
            this.getData()
          }
        })
      } else {
        if (this.actionParam.CheckNote) {
          MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ABANDON(params).then(res => {
            this.dialogAuditLoading = false
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.dialogAudit = false
              this.getData()
            }
          })
        } else {
          this.dialogAuditLoading = false
          this.$message.warning('请输入审核回退原因')
        }
      }
    },
    terminal(id) {
      this.actionParam.QueueId = id
      this.$confirm(
        '<p>确定要终止活动吗？</p><p>终止活动后，新产生的销售单将不能再参与活动！已参与未领取的排队者排队自动作废。</p>',
        '终止',
        {
          iconClass: 'el-icon-warning terminal-icon',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_TERMINAL(this.actionParam).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success(res.data.Message)
                this.dialogAudit = false
                this.getData()
              }
            }
          )
        })
        .catch(() => { })
    },
    getData() {
      this.tableLoading = true
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GETS(this.parameter).then(res => {
        this.tableLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.activityTimeRange = [query.ActivityStart || '', query.ActivityStop || '']
      this.form.ActivityStart = query.ActivityStart || ''
      this.form.ActivityStop = query.ActivityStop || ''
      this.form.QueueId = query.QueueId || ''
      this.form.CheckStatus = parseInt(query.CheckStatus) || 0
      this.form.CompanyCode = query.CompanyCode || ''
      this.form.compantName = query.compantName || ''
      this.form.StoreCode = query.StoreCode || ''
      this.form.StoreName = query.StoreName || ''
      this.form.PageIndex = parseInt(query.PageIndex) || 1
      this.form.PageSize = parseInt(query.PageSize) || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path, query: this.parameter
      })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = {
        ...this.form
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    formatter(row, column, cellValue) {
      return (!cellValue || !row.ActivityStop) ? '-' : (
        this.$options.filters.filterDate(cellValue) +
        '~' +
        (row.ActivityStop.substr(0, 4) !== '2100'
          ? this.$options.filters.filterDate(row.ActivityStop)
          : '不限结束日期')
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.search-btn {
  width: 240px !important;
}
.search-form {
  width: 1%;
  height: 100%;
  flex: 1;
}
.introduce {
  display: flex;
  padding-top: 18px;
  padding-bottom: 20px;
  align-items: center;
  i {
    margin-right: 15px;
    width: 50px;
    height: 50px;
    background: url('../../../assets/images/lineup_gold_icon.png') no-repeat;
  }
  p {
    flex: 1;
    span {
      display: block;
      &:first-child {
        font-size: 14px;
        line-height: 24px;
        font-weight: bold;
        color: #4b8ab5;
      }
      &:last-child {
        line-height: 1.5;
        color: #333;
      }
    }
  }
}
.create-description .title,
.return-description .title {
  padding-bottom: 15px;
  font-weight: bold;
  color: #333333;
  i {
    color: #399fe5;
  }
}
.create-description {
  margin-bottom: 20px;
  .description-item {
    display: flex;
    flex-direction: column;
    max-width: 260px;
    p {
      line-height: 32px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      background-color: #83b6ea;
      color: #fff;
    }
    & > div {
      flex: auto;
      // flex-basis: auto;
      padding: 10px 24px;
      background-color: #f5f5f5;
      line-height: 1.5;
      color: #777;
    }
  }
}
.return-description {
  position: relative;
  margin-bottom: 20px;
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    height: 1px;
    width: 100%;
    background-color: #e5e5e5;
  }
  li {
    color: #777;
    line-height: 1.5;
  }
}
.top {
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e5e5;
  font-weight: bold;
  font-size: 14px;
}
.bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 60px;
  background-color: #399fe5;
  text-align: center;
  color: #fff;
  p:first-child {
    font-weight: bold;
    line-height: 1.5;
  }
}
</style>
<style lang="scss">
.terminal-icon {
  top: 10px;
  transform: translateY(0);
}
</style>

