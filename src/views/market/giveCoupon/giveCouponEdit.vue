<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑赠送单</span>
        <span class="fr title">
          <el-button
            name="btnEdit"
            type="text"
            @click="editClickDialog"
          >
            <span>编辑</span>
          </el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table
            cellpadding="0"
            cellspacing="0"
          >
            <tbody>
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
          <div class="p-10">
            <el-button
              name="btnSelectMemberVisible"
              type="primary"
              @click="selectMemberVisible=true"
            >选择客户</el-button>
            <el-button
              name="btnAllWidthTagsDialog"
              @click="allWidthTagsDialog=true"
            >从数据挖掘导入</el-button>
            <el-input
              name="inputCode"
              v-model="queryForm.code"
              class="code code-input"
              placeholder="客户ID/会员卡号/姓名/手机号码"
              :maxlength="50"
              @keyup.enter.native="codeEnter"
            ></el-input>
          </div>
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
                <user-Info
                  :scope="scope.row"
                  :isLink="false"
                ></user-Info>
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
            <el-table-column
              label="操作"
              width="60"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  name="btnDeleteCoupon"
                  type="text"
                  @click="deleteCoupon(scope.row.itemId)"
                >删除</el-button>
              </template>
            </el-table-column>
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
      >
        <el-button
          name="btnOrderSubmit"
          type="primary"
          @click="orderSubmit"
          :loading="$store.getters.is_loading"
        >提交审核</el-button>
        <router-link
          name="linkBack"
          :to="{path:'/market/giveCoupon/index'}"
          class="el-button btn-reset el-button--default el-button--mini"
        >返回</router-link>
      </el-col>
    </el-row>

    <!-- @module Dialog·修改退货单基本信息-->
    <basic-edit
      title="修改赠送优惠券原因"
      v-if="editDialog"
      :editDialog="editDialog"
      :editForm="editForm"
      :isCreate="false"
      :couponCreateRow="couponCreateRow"
      @listenEditDialog="listenEditDialog"
    ></basic-edit>
    <!-- End Dialog·修改退货单基本信息 -->

    <!-- @module Dialog·新建 -->
    <giveCoupon-create
      title="编辑"
      v-if="beforeCreateDialog"
      :beforeCreateDialog="beforeCreateDialog"
      @listenCreateDialog="listenCreateDialog"
    ></giveCoupon-create>
    <!-- End Dialog·新建 -->
    <!-- @module Dialog·选择客户 -->
    <select-members
      title="选择客户"
      v-if="selectMemberVisible"
      :selectMemberVisible="selectMemberVisible"
      @listenSelectMemDialog="listenSelectMemDialog"
      @listenAddMember="listenAddMember"
    ></select-members>
    <!-- End Dialog·选择客户 -->

    <!-- 数据挖掘导入 -->

    <el-dialog
      title="从数据挖掘导入"
      :visible.sync="allWidthTagsDialog"
      @close="resetForm"
    >
      <el-row class="p-10">
        <el-col :span="12">
          <el-input
            name="inputSearchTags"
            placeholder="数据分组名称"
            v-model="searchTags"
            clearable
          ></el-input>
        </el-col>
        <el-col
          :span="8"
          style="line-height:28px; margin-left:10px;"
        >
          <el-checkbox
            name="checkboxNoPhone"
            v-model="noPhone"
          >不导入无手机号码客户</el-checkbox>
        </el-col>
      </el-row>
      <el-table
        class="visitTaskTagsTable"
        :data="filteredTags"
        ref="tagsTable"
        @row-click="rowClick"
        @sort-change="sortChange"
        v-loading="$store.getters.tb_loading"
        @select="handleSelectionChange"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="数据分组"
          sortable="custom"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="tagsText"
          label="标签"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnImportTags"
          type="primary"
          @click="importTags"
          :loading="isImporting"
        >确 定</el-button>
        <el-button
          name="btnCancel"
          @click="allWidthTagsDialog = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 数据挖掘导入 -->

  </div>
</template>

<script>
import BasicEdit from './giveCouponBasicEdit'
import userInfo from '@/components/scrm/userInfo.vue'
import giveCouponCreate from './giveCouponCreate'
import pagination from '@/components/pagination'
import selectMembers from '@/components/scrm/selectMembers'
import {
  MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPON,
  MEMBERSHIP_API_GIVECOUPON_GETGIVEITEMS,
  MEMBERSHIP_API_GIVECOUPON_ADDMEMBERS,
  MEMBERSHIP_API_GIVECOUPON_ADDMEMBERSFROMTAGGROUP,
  MEMBERSHIP_API_GIVECOUPON_DELETE,
  MEMBERSHIP_API_GIVECOUPON_SUBMITAUDIT,
  MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS
} from '@/apis/membership'
import {
  GiveCouponStatus
} from '@/enums/membership.js'
import {
  debounce 
} from 'lodash'

export default {
  data() {
    return {
      giveCouponStatus: GiveCouponStatus,
      beforeCreateDialog: false,
      data: [], // 货品数据
      total: 0, // 总数据条数
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
      allWidthTagsDialog: false, // 从数据挖掘导入
      editDialog: false, // 修改基本信息对话框
      detail: {
      },
      editForm: {
      },
      allWidthTagsList: [],
      searchTags: '',
      noPhone: true,
      goodsId: '', // 选中的货品id
      purchaseTakeVisible: false, // 提取成品采购入库单
      isImporting: false
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
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageIndex = 1
      this.queryForm.pageSize = val
      this.getCoupon()
    },
    orderSubmit() {
      if (!this.data.length) {
        this.$message('请选择客户', 'error')
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        MEMBERSHIP_API_GIVECOUPON_SUBMITAUDIT({
          giveId: this.queryForm.giveId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push({
              path: '/market/giveCoupon/index' 
            })
          } else {
            let mArr = res.data.Message.split('<br/>')
            if (mArr.length > 1) {
              const h = this.$createElement
              let message = []
              mArr.forEach(item => {
                message.push(h('p', null, item))
              })
              this.$msgbox({
                title: '消息',
                message: h('div', null, message),
                confirmButtonText: '确定'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    deleteCoupon(id) {
      this.$confirm('确定删除此客户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          MEMBERSHIP_API_GIVECOUPON_DELETE(id).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '删除成功!',
                type: 'success'
              })
              if (this.data.length === 1) {
                this.queryForm.pageIndex = 1
              }
              this.getCoupon()
              this.getDetail()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async importTags() {
      if (this.isImporting) {
        return
      }
      this.isImporting = true
      await MEMBERSHIP_API_GIVECOUPON_ADDMEMBERSFROMTAGGROUP({
        exceptEmptyMobile: this.noPhone,
        settingTagGroupId: this.settingTagGroupId,
        giveId: this.queryForm.giveId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getDetail()
          this.getCoupon()
          this.allWidthTagsDialog = false
        }
      })
      this.isImporting = false
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
      this.getCoupon()
    },
    addMember(members) {
      MEMBERSHIP_API_GIVECOUPON_ADDMEMBERS({
        giveId: this.queryForm.giveId,
        members: members
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.getCoupon()
          this.getDetail()
          this.code = ''
          this.multiCodeVisible = false
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
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
    }
  },
  computed: {
    filteredTags() {
      return this.allWidthTagsList.filter(({
        name 
      }) => {
        return name.indexOf(this.searchTags) > -1
      })
    }
  },
  beforeMount() {
    this.getAllWidthTags = debounce(this.getAllWidthTags, 250)
  },
  mounted() {
    this.init()
  },
  watch: {
  },
  components: {
    BasicEdit,
    userInfo,
    pagination,
    giveCouponCreate,
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
