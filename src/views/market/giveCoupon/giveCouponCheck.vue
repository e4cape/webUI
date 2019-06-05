<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看赠送单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table
            cellpadding="0"
            cellspacing="0"
          >
            <tbody>
              <tr>
                <td
                  rowspan="6"
                  class="tc state-img"
                >
                  <img
                    src="../../../assets/images/draft.png"
                    v-if="detail.status == giveCouponStatus.Draft"
                  >
                  <img
                    src="../../../assets/images/auditing.png"
                    v-if="detail.status == giveCouponStatus.Pending"
                  >
                  <img
                    src="../../../assets/images/audited.png"
                    v-if="detail.status == giveCouponStatus.Pass"
                  >
                  <img
                    src="../../../assets/images/auditBack.png"
                    v-if="detail.status == giveCouponStatus.Returned"
                  >
                  <img
                    src="../../../assets/images/abandon.png"
                    v-if="detail.status == giveCouponStatus.Cancel || detail.status == giveCouponStatus.Invalid "
                  >
                  <div>{{detail.statusText}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.giveId}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.createUser}}&nbsp;&nbsp;{{detail.createTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.status == giveCouponStatus.Pass || detail.State == giveCouponStatus.Returned ? detail.checkUser + ' ' + detail.checkTime : '-'}}</td>
              </tr>
              <tr>
                <td class="tit">赠送原因：</td>
                <td>{{detail.settingOptionName }}</td>
                <td class="tit">备注：</td>
                <td
                  class="note"
                  colspan="3"
                >{{detail.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="panel-bd">
          <!-- @module 数据表格 -->
          <el-table
            :data="data"
            v-loading="$store.getters.tb_loading"
            element-loading-text="拼命加载中"
          >
            <el-table-column
              prop="memberId"
              label="基本信息"
              min-width="320"
              show-overflow-tooltip
              fixed="left"
            >
              <template slot-scope="scope">
                <user-Info :scope="scope.row"></user-Info>
              </template>
            </el-table-column>
            <el-table-column
              prop="birthday"
              label="出生日期"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="dateOfBirthText"
              label="生日"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="subscrTime"
              label="关注时间"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="joinTime"
              label="入会日期"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="expendLast"
              label="最近消费日期"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <pagination
            :pg="queryForm.pageIndex"
            :size="queryForm.pageSize"
            :total="total"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></pagination>
        </div>
      </div>
    </div>

    <el-row class="buttons">
      <el-col
        :span="12"
        class="tl"
        style="display: flex"
      >
        <div
          v-if="canEdit"
          style="margin-right: 10px"
        >
          <router-link :to="{path: '/market/giveCoupon/giveCouponEdit', query:{id: detail.giveId}}">
            <el-button
              name="btnEdit"
              size="mini"
              type="primary"
            >
              编辑
            </el-button>
          </router-link>
          <el-button
            name="btnInvalid"
            type="danger"
            @click="giveCouponInvalid"
          >作废</el-button>
        </div>
        <div
          v-else-if="canCheck"
          style="margin-right: 10px;"
        >
          <el-button
            name="btnAudit"
            type="primary"
            @click="auditgiveCoupon"
          >审核</el-button>
        </div>
        <router-link
          name="linkBack"
          :to="{path:'/market/giveCoupon/index'}"
          class="el-button btn-reset el-button--default el-button--mini"
        >返回</router-link>
      </el-col>
    </el-row>
    <giveCoupon-audit
      title="审核"
      :visible.sync="auditDialog"
      :data="detail"
      @success="onSuccess"
    />
  </div>
</template>

<script>
import BasicEdit from './giveCouponBasicEdit'
import userInfo from '@/components/scrm/userInfo.vue'
import giveCouponCreate from './giveCouponCreate'
import giveCouponAudit from './giveCouponAudit'
import pagination from '@/components/pagination'
import selectMembers from '@/components/scrm/selectMembers'
import {
  MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPON,
  MEMBERSHIP_API_GIVECOUPON_GETGIVEITEMS,
  MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS,
  MEMBERSHIP_API_VISITTASK_ADDVISITMEMBESFROMTAGGROUP,
  MEMBERSHIP_API_GIVECOUPON_INVALID
} from '@/apis/membership'
import {
  GiveCouponStatus
} from '@/enums/membership.js'

export default {
  data() {
    return {
      giveCouponStatus: GiveCouponStatus,
      beforeCreateDialog: false,
      data: [], // 货品数据
      total: 0, // 总数据条数
      auditDialog: false,
      queryForm: {
        giveId: '',
        pageSize: 20, // 分页数据条数
        pageIndex: 1, // 当前页面位置
        code: ''
      },
      parameters: {
      },
      couponCreateRow: {
      },
      selectMemberVisible: false, // 选择客户弹窗
      multiCodeVisible: false, // 批量录入条码弹窗
      allWidthTagsDialog: false, // 从数据库挖掘导入
      editDialog: false, // 修改基本信息对话框
      detail: {
      },
      editForm: {
      },
      allWidthTagsList: [],
      searchTags: '',
      noPhone: true,
      goodsId: '', // 选中的货品id
      purchaseTakeVisible: false // 提取成品采购入库单
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.queryForm.giveId = query.id || 0
      if (!this.queryForm.giveId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getCoupon()
        this.getAllWidthTags()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPON({
        giveId: this.queryForm.giveId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editForm = Object.assign({
          }, res.data.Data)
        }
      })
    },
    getCoupon() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      MEMBERSHIP_API_GIVECOUPON_GETGIVEITEMS({
        giveId: this.queryForm.giveId,
        keyword: this.queryForm.code,
        PageIndex: this.queryForm.pageIndex,
        PageSize: this.queryForm.pageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.total = res.data.Data.total || 0
          this.goodsId = this.data && this.data.length && this.data[0].GoodsId
        }
      })
    },
    getAllWidthTags() {
      MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allWidthTagsList = res.data.Data
        }
      })
    },
    rowSelect(itemId) {
      this.goodsId = itemId
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.pageIndex = val
      this.getCoupon()
    },
    onSuccess() {
      this.init()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageIndex = 1
      this.queryForm.pageSize = val
      this.getCoupon()
    },
    importTags() {
      MEMBERSHIP_API_VISITTASK_ADDVISITMEMBESFROMTAGGROUP({
        exceptEmptyMobile: this.noPhone,
        settingTagGroupId: this.settingTagGroupId,
        visitTaskId: this.visitTaskId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getDetail()
          this.getCoupon()
          this.allWidthTagsDialog = false
        }
      })
    },
    resetForm() {
      this.noPhone = true
      this.searchTags = ''
    },
    listenAddMember(data) {
      this.addMember(data)
    },
    listenMultiCodeEnter(codes) {
      if (codes.length) {
        this.addMember(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    codeEnter() {
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    rowClick(row) {
      this.handleSelectionChange(false, row)
    },
    handleSelectionChange(selection, row) {
      if (row) {
        this.$refs.tagsTable.clearSelection()
        this.$refs.tagsTable.toggleRowSelection(row)
        this.settingTagGroupId = row.settingTagGroupId
      }
    },
    sortChange() {
      this.allWidthTagsList = this.allWidthTagsList.reverse()
    },
    listenEditDialog(form, flag) {
      if (flag) {
        this.detail = Object.assign(this.detail, form)
      } else {
        this.editForm = Object.assign({
        }, this.detail)
      }
      this.editDialog = false
    },
    takeOrder(command) {
      if (command === 'purchase') {
        this.purchaseTakeVisible = true
      }
    },
    listenCreateDialog(obj) {
      this.beforeCreateDialog = false
      if (obj) {
        this.editDialog = true
        this.couponCreateRow = obj
      }
    },
    listenSelectMemDialog() {
      this.selectMemberVisible = false
    },
    editClickDialog() {
      this.beforeCreateDialog = true
      this.couponCreateRow = {
      }
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters 
      })
    },
    auditgiveCoupon() {
      this.auditDialog = true
    },
    giveCouponInvalid() {
      const id = this.detail.giveId
      this.$confirm('确定作废此赠送券？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(11)
          MEMBERSHIP_API_GIVECOUPON_INVALID({
            giveId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('作废成功')
              this.init()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    canEdit() {
      const {
        status = 1 
      } = this.detail

      return [GiveCouponStatus.Draft, GiveCouponStatus.Returned].some(
        s => s == status
      )
    },
    canCheck() {
      const {
        status = 1 
      } = this.detail
      return ![GiveCouponStatus.Invalid, GiveCouponStatus.Pass].some(
        s => s == status
      )
    }
  },
  components: {
    BasicEdit,
    userInfo,
    pagination,
    giveCouponCreate,
    giveCouponAudit,
    selectMembers
  }
}
</script>

<style lang="scss">
@import '../../../assets/sass/erp/purchase.scss';
</style>
<style lang="scss" scoped>
.code-input {
  margin-right: 10px;
  vertical-align: middle;
}
.good-num {
  width: 40px;
}
.qty {
  width: 60px;
}
</style>
