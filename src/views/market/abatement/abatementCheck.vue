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
                    v-if="detail.status == giftStatus.Draft"
                  >
                  <img
                    src="../../../assets/images/auditing.png"
                    v-if="detail.status == giftStatus.Pending"
                  >
                  <img
                    src="../../../assets/images/audited.png"
                    v-if="detail.status == giftStatus.Pass"
                  >
                  <img
                    src="../../../assets/images/auditBack.png"
                    v-if="detail.status == giftStatus.Returned"
                  >
                  <img
                    src="../../../assets/images/abandon.png"
                    v-if="detail.status == giftStatus.Cancel || detail.status == giftStatus.Invalid "
                  >
                  <div>{{detail.status | giftTitle}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.deductCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.createUser}}&nbsp;&nbsp;{{detail.createTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.statusText}}</td>
              </tr>
              <tr>
                <td class="tit">赠送原因：</td>
                <td
                  class="note"
                  colspan="5"
                >{{detail.settingOptionName}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td
                  class="note"
                  colspan="5"
                >{{detail.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">客户列表</span>
            </el-col>
            <el-col
              :span="12"
              class="tr"
            >
              <span class="detail-info-num-item">客户总数：
                <b class="num">{{total}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <!-- @module 数据表格 -->
        <el-table
          :data="memberData"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <el-table-column
            prop="aliasName"
            label="基本信息"
            min-width="300"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <user-info
                :scope="scope.row.member"
                :isLink="true"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="扣减积分"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="goldenRice"
            label="扣减礼金"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination
          :pg="pg"
          :size="size"
          :total="total"
          @currentChange="pageChange"
          @sizeChange="pageSizeChange"
        ></pagination>
      </div>
    </div>
    <div class="buttons">
      <div v-if="canEdit && !isOneNumberManyShopCompany">
        <!--一号多店的公司没有操作-->
        <router-link :to="{path: '/market/abatement/abatementEdit', query:{id: detail.deductCode}}">
          <el-button
            name="btnEdit"
            type="primary"
          >编辑</el-button>
        </router-link>
        <el-button
          name="btnInvalid"
          type="danger"
          @click="iOpen = true"
        >作废</el-button>
      </div>
      <div v-else-if="canCheck && !isOneNumberManyShopCompany">
        <el-button
          name="btnAudit"
          type="primary"
          @click="cOpen = true"
        >审核</el-button>
      </div>
      <el-button
        name="btnBack"
        @click="$router.back()"
      >返回</el-button>
    </div>
    <!-- @module Dialog·审核 -->
    <!-- 作废 -->
    <el-dialog
      title="作废"
      :visible.sync="iOpen"
      width="700px"
    >
      <el-form
        ref="invalidForm"
        :model="invalidModel"
      >
        <div>
          <div class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{detail.deductCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{detail.createUser}} {{detail.createTime}}</span>
            </div>
          </div>
          <div style="margin-bottom: 20px; display: flex;">
            <div class="modal-label is-requery">作废原因:</div>
            <div
              class="flex-center"
              style="flex:1;"
            >
              <el-input
                name="inputCheckNote"
                v-model="invalidModel.checkNote"
                :maxlength="50"
              ></el-input>
            </div>
          </div>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnInvalidSure"
          type="primary"
          @click="onInvalidConfirm"
        >确 定</el-button>
        <el-button
          name="btnInvalidCancel"
          @click="resetInvalidForm"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 作废 -->
    <!-- 审核 -->
    <el-dialog
      title="审核"
      :visible.sync="cOpen"
      width="700px"
    >
      <el-form
        ref="checkForm"
        :model="checkModel"
      >
        <div>
          <div class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{detail.deductCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{detail.createUser}} {{detail.createTime}}</span>
            </div>
          </div>
          <div style="margin-bottom: 20px; display: flex;">
            <div
              class="modal-label"
              style="padding-top: 8px;"
            >审核结果:</div>
            <div class="flex-center">
              <el-radio-group v-model="checkModel.status">
                <el-radio
                  :label="checkResult.pass"
                  class="modal-radio"
                >审核通过</el-radio>
                <el-radio
                  :label="checkResult.returned"
                  class="modal-radio"
                >
                  <span>
                    <span>审核退回</span>
                    <el-input
                      v-model="checkModel.checkNote"
                      :maxlength="50"
                      style="width:calc( 100% - 60px) !important; margin-left: 10px"
                      v-if="checkModel.status === checkResult. returned"
                    ></el-input>
                  </span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnAuditSure"
          type="primary"
          @click="onCheck"
        >确 定</el-button>
        <el-button
          name="btnAuditCancel"
          @click="resetCheckForm"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 审核 -->
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERITEMS,
  MEMBERSHIP_API_DEDUCTORDER_AUDITRETURN,
  MEMBERSHIP_API_DEDUCTORDER_AUDIT,
  MEMBERSHIP_API_DEDUCTORDER_INVALID
} from '@/apis/membership'
import { YNStatus } from '@/enums/common'
import {
  GiftStatus 
} from '@/enums/membership'
import UserInfo from '@/components/scrm/userInfo'
import pagination from '@/components/pagination.vue'

export default {
  components: {
    pagination,
    UserInfo
  },
  data() {
    return {
      checkResult: {
        pass: GiftStatus.Pass,
        returned: GiftStatus.Returned
      },
      giftStatus: GiftStatus,
      detail: {
        status: 0
      }, // 明细
      memberData: [], // 会员数据
      pg: 1,
      size: 10,
      total: 0,
      invalidModel: {
      }, // 作废
      iOpen: false,
      checkModel: {
        status: GiftStatus.Pass
      }, // 审核,
      cOpen: false
    }
  },
  computed: {
    canEdit() {
      const {
        status = 1 
      } = this.detail

      return [GiftStatus.Draft, GiftStatus.Returned].some(s => s == status)
    },
    canCheck() {
      const {
        status = 1 
      } = this.detail
      return ![GiftStatus.Invalid, GiftStatus.Pass].some(s => s == status)
    }
  },
  methods: {
    resetInvalidForm() {
      this.iOpen = false
      this.$refs.invalidForm.resetFields()
    },
    getId() {
      return this.$route.query.id
    },
    pageChange(val) {
      this.pg = val
      this.getData()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERITEMS({
        deductCode: this.getId(),
        orderField: 'deductCode',
        orderType: YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.memberData = res.data.Data.items.rows
          this.total = res.data.Data.items.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onInvalidConfirm() {
      if (this.isConfirming) {
        return
      }
      if (
        !this.invalidModel.checkNote ||
        !(this.invalidModel.checkNote + '').trim()
      ) {
        this.$message.error('请输入作废原因')
        return
      }
      this.$refs.invalidForm.validate(async v => {
        if (!v) {
          return false
        }
        this.isConfirming = true
        MEMBERSHIP_API_DEDUCTORDER_INVALID({
          deductCode: this.detail.deductCode,
          ...this.invalidModel
        }).then(res => {
          if (res) {
            this.$message.success('操作成功!')
            this.$router.push({
              path: '/market/abatement/index' 
            })
          }
        })
      })
    },
    resetCheckForm() {
      this.cOpen = false
      this.$refs.checkForm.resetFields()
    },
    onCheck() {
      if (this.isConfirming) {
        return
      }
      if (
        (!this.checkModel.checkNote ||
          !(this.checkModel.checkNote + '').trim()) &&
        this.checkModel.status == this.checkResult.returned
      ) {
        this.$message.error('请输入审核退回原因')
        return
      }
      this.isConfirming = true
      this.$refs.checkForm.validate(async v => {
        if (!v) {
          return false
        }
        if (this.checkModel.status === this.checkResult.pass) {
          MEMBERSHIP_API_DEDUCTORDER_AUDIT({
            deductCodes: [this.detail.deductCode]
          })
            .then(res => {
              this.isConfirming = false
              if (res.data.Code === 'CORRECT') {
                this.$message.success('提交成功')
                this.$router.push({
                  path: '/market/abatement/index' 
                })
              }
            })
            .catch(() => {
              this.isConfirming = false
            })
        } else {
          MEMBERSHIP_API_DEDUCTORDER_AUDITRETURN([
            {
              deductCode: this.detail.deductCode,
              checkNote: this.checkModel.checkNote
            }
          ])
            .then(res => {
              this.isConfirming = false
              if (res.data.Code === 'CORRECT') {
                this.$message.success('提交成功')
                this.$router.push({
                  path: '/market/abatement/index' 
                })
              }
            })
            .catch(() => {
              this.isConfirming = false
            })
        }
      })
    }
  },
  mounted() {
    this.getData()
  },
  filters: {
    giftTitle(val) {
      return GiftStatus.Types.find(({
        key 
      }) => key === String(val)).title
    }
  }
}
</script>

<style lang="scss" scoped>
.form-label {
  display: inline-block;
  margin-right: 10px;
  min-width: 80px;
  text-align: right;
}

.flex-center {
  display: flex;
  align-items: center;
}

.modal-label {
  margin-right: 10px;
  min-width: 80px;
  text-align: right;
}

.modal-radio {
  display: block;
  line-height: 30px;
  height: 30px;
  margin-left: 0;
}
.modal-line {
  display: flex;
  line-height: 30px;
  height: 30px;
  & > div {
    flex: 1;
  }
}
.buttons {
  display: flex;
  & > :nth-child(n) {
    margin-right: 10px;
  }
}
.is-requery {
  position: relative;
  &::before {
    content: '*';
    display: block;
    position: absolute;
    left: 10px;
    top: 4px;
    color: red;
  }
}
</style>

