<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看赠送单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" class="tc state-img">
                  <img src="../../../assets/images/draft.png" v-if="detail.status == giftStatus.Draft">
                  <img src="../../../assets/images/auditing.png" v-if="detail.status == giftStatus.Pending">
                  <img src="../../../assets/images/audited.png" v-if="detail.status == giftStatus.Pass">
                  <img src="../../../assets/images/auditBack.png" v-if="detail.status == giftStatus.Returned">
                  <img src="../../../assets/images/abandon.png" v-if="detail.status == giftStatus.Cancel || detail.status == giftStatus.Invalid ">
                  <div>{{detail.status | giftTitle}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.giveCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.createUser}}&nbsp;&nbsp;{{detail.createTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.statusText}}</td>
              </tr>
              <tr>
                <td class="tit">赠送原因：</td>
                <td class="note" colspan="5">{{detail.settingOptionName}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.remark}}</td>
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
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                客户总数：
                <b class="num">{{total}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <!-- @module 数据表格 -->
        <el-table :data="memberData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="aliasName" label="基本信息" min-width="300" show-overflow-tooltip>
            <template slot-scope="scope">
              <user-info :scope="scope.row.member" :isLink="true"/>
            </template>
          </el-table-column>
          <el-table-column prop="expendPrice" label="累计消费金额" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="expendLast" label="最近消费日期" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.expandLast | filterDate }}</template>
          </el-table-column>
          <el-table-column prop="score" label="赠送积分" min-width="120"></el-table-column>
          <el-table-column prop="scoreExpireDays" label="积分有效期 (天)" min-width="120"></el-table-column>
          <el-table-column prop="goldenRice" label="赠送礼金" min-width="120"></el-table-column>
          <el-table-column prop="goldenRiceExpireDays" label="礼金有效期 (天)" min-width="120"></el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <el-row class="m-x-10">
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </el-row>
      </div>
    </div>
    <div class="buttons" v-if="!isOneNumberManyShopCompany">
      <div v-if="canEdit">
        <router-link :to="{path: '/market/score/manual/edit', query:{id: detail.giveId}}">
          <el-button name="btnEdit" size="mini" type="primary">编辑</el-button>
        </router-link>
        <el-button name="btnInvalid" type="danger" size="mini" @click="iOpen = true">作废</el-button>
      </div>
      <div v-else-if="canCheck">
        <el-button name="btnAudit" type="primary" size="mini" @click="cOpen = true">审核</el-button>
      </div>
      <el-button name="btnBack" size="mini" @click="$router.back()">返回</el-button>
    </div>
    <!-- @module Dialog·审核 -->

    <!-- 作废 -->
    <el-dialog title="作废" :visible.sync="iOpen" width="700px">
      <el-form ref="invalidForm" :model="invalidModel">
        <div>
          <div class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{detail.giveCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{detail.createUser}} {{detail.createTime}}</span>
            </div>
          </div>
          <div style="margin-bottom: 20px; display: flex;">
            <div class="modal-label">作废原因:</div>
            <div class="flex-center" style="flex:1;">
              <el-input name="inputCheckNote" v-model="invalidModel.checkNote"></el-input>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnOnInvalidConfirm" type="primary" @click="onInvalidConfirm">确 定</el-button>
        <el-button name="btnResetInvalidForm" @click="resetInvalidForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 作废 -->

    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="cOpen" width="650px">
      <el-form ref="checkForm" :model="checkModel">
        <div>
          <div class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{detail.giveCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{detail.createUser}} {{detail.createTime}}</span>
            </div>
          </div>
          <div style="margin-bottom: 20px; display: flex;">
            <div class="modal-label" style="padding-top: 8px;">审核结果:</div>
            <div class="flex-center">
              <el-radio-group name="radioGroupStatus" v-model="checkModel.status">
                <el-radio name="radioPass" :label="checkResult.pass" class="modal-radio">审核通过</el-radio>
                <el-radio name="radioReturned" :label="checkResult.returned" class="modal-radio">
                  <span>
                    <span>审核退回</span>
                    <el-input name="inputCheckNotes" v-model="checkModel.checkNote" style="width:calc( 100% - 60px) !important; margin-left: 10px" v-if="checkModel.status === checkResult. returned"></el-input>
                  </span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnOnCheck" type="primary" @click="onCheck">确 定</el-button>
        <el-button name="btnResetCheckForm" @click="resetCheckForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 审核 -->
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_MANUALORDER_GETINFO,
  MEMBERSHIP_API_MANUALORDER_GETITEM,
  MEMBERSHIP_API_MANUALORDER_SAVEAUDIT
} from '../../../apis/membership'
import {
  GiftStatus
} from '../../../enums/membership'
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
      size: 20,
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
      MEMBERSHIP_API_MANUALORDER_GETITEM({
        giveId: this.getId(),
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memberData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onInvalidConfirm() {
      this.$refs.invalidForm.validate(async v => {
        if (!v) {
          return false
        }
        try {
          const codeList = [this.detail]
          const res = await MEMBERSHIP_API_MANUALORDER_SAVEAUDIT({
            orderIdCodeList: codeList,
            status: GiftStatus.Invalid,
            ...this.invalidModel
          }).then(res => res.data.Data)
          if (res) {
            this.$message.success('操作成功!')
            this.getInfo()
            this.iOpen = false
          }
        } catch (e) {
          console.error(e)
        }
      })
    },
    getInfo() {
      MEMBERSHIP_API_MANUALORDER_GETINFO(this.getId()).then(res => {
        this.detail = res.data.Data
      })
    },
    resetCheckForm() {
      this.cOpen = false
      this.$refs.checkForm.resetFields()
    },
    onCheck() {
      this.$refs.checkForm.validate(async v => {
        if (!v) {
          return false
        }
        try {
          const codeList = [this.detail]
          const res = await MEMBERSHIP_API_MANUALORDER_SAVEAUDIT({
            orderIdCodeList: codeList,
            ...this.checkModel
          })
          if (res.data.Code === 'CORRECT') {
            this.getInfo()
            this.cOpen = false
          }
        } catch (e) {
          console.error(e)
        }
      })
    }
  },
  mounted() {
    this.getInfo()
    this.getData()
  },
  filters: {
    giftTitle(val) {
      if (!val) {
        return ''
      }
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
</style>

