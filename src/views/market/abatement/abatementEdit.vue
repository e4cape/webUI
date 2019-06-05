<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑赠送单</span>
        <el-button name="btnModify" type="text" class="title title-change" @click="uOpen = true">修改</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
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
                <td class="note" colspan="5">{{detail.settingOptionName}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd selection">
          <div>
            <el-button name="btnChooseCustomer" @click="userOpen = true" type="primary">选择客户</el-button>
            <el-button name="btnImportFromDataMining" @click="dataOpen = true" type="primary">从数据挖掘导入</el-button>
            <el-input name="inputSearch" type="primary" v-model="key" placeholder="会员卡号/姓名/手机号码" @keyup.native.enter="onSearch">选择客户</el-input>
          </div>
          <div>
            <el-popover width="160" v-model="scoreOpen" style="width: 200px!important;">
              <el-radio name="radioPopoverScoreReduce" v-model="scoreModel.type" label="1">
                <span class="m-r-5">扣减积分</span>
                <el-input
                  name="inputPopoverScore"
                  v-model="scoreModel.deductQty"
                  :maxlength="9"
                  @keyup.native="scoreModel.deductQty = $root.toFixed(scoreModel.deductQty, 0)"
                  style="width: 60px!important;"
                ></el-input>
              </el-radio>
              <br>
              <el-radio name="radioPopoverScoreEmpty" v-model="scoreModel.type" label="0" class="m-t-5">清空积分</el-radio>
              <div style="text-align: center; margin: 0; margin-top: 10px;">
                <el-button name="btnPopoverScoreCancel" type="text" @click="onScoreClose">取消</el-button>
                <el-button name="btnPopoverScoreSure" type="primary" @click="onScoreConfirm">确定</el-button>
              </div>
              <el-button name="btnUniteScore" type="text" class="m-r-5" slot="reference">统一扣减积分</el-button>
            </el-popover>
            <el-popover width="160" v-model="goldOpen">
              <el-radio name="radioPopoverGoldReduce" v-model="scoreModel.type" :label="'1'">
                <span class="m-r-5">扣减礼金</span>
                <el-input
                  name="inputPopoverGold"
                  v-model="scoreModel.deductQty"
                  :maxlength="9"
                  @keyup.native="scoreModel.deductQty = $root.toFixed(scoreModel.deductQty, 0)"
                  style="width: 60px!important;"
                ></el-input>
              </el-radio>
              <br>
              <el-radio name="radioPopoverGoldEmpty" v-model="scoreModel.type" :label="'0'" class="m-t-5">清空礼金</el-radio>
              <div style="text-align: center; margin: 0; margin-top: 10px;">
                <el-button name="btnPopoverGoldCancel" type="text" @click="onGoldClose">取消</el-button>
                <el-button name="btnPopoverGoldCancel" type="primary" @click="onGoldConfirm">确定</el-button>
              </div>
              <el-button name="btnUniteGold" type="text" slot="reference">统一扣减礼金</el-button>
            </el-popover>
          </div>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">客户列表</span>
            </el-col>
            <el-col :span="12" class="tr"></el-col>
          </el-row>
        </div>

        <!-- @module 数据表格 -->
        <el-table :data="memberData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="aliasName" label="基本信息" min-width="300" show-overflow-tooltip>
            <template slot-scope="scope">
              <user-info :scope="scope.row.member" :isLink="true"/>
            </template>
          </el-table-column>
          <el-table-column prop="currScore" label="当前积分" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="currGoldenRice" label="当前礼金" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="score" label="扣减积分" min-width="120">
            <template slot-scope="scope">
              <el-input name="inputScore" v-model="scope.row.score" @input="enableSubmit = false" @keyup.enter.native="updateQty(scope.row)" @blur="updateQty(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="goldenRice" label="扣减礼金" min-width="120">
            <template slot-scope="scope">
              <el-input name="inputGold" v-model="scope.row.goldenRice" @input="enableSubmit = false" @keyup.enter.native="updateQty(scope.row)" @blur="updateQty(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <!-- <el-button @click="saveColumn(scope.row)" type="text">保存</el-button> -->
              <el-popover width="260" :value="deleteOpen === scope.row.itemId">
                <div>
                  <i class="el-icon-warning icon-warning"></i> 你确定要删除这个客户吗?
                </div>
                <div style="text-align: right; margin: 0; margin-top: 10px;">
                  <el-button name="btnPopoverCancel" type="text" @click="deleteOpen = null">取消</el-button>
                  <el-button name="btnPopoverSure" type="primary" @click="deleteColumn(scope.row)">确定</el-button>
                </div>
                <el-button name="btnDel" @click="deleteOpen = scope.row.itemId" slot="reference" type="text">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button name="btnSaveCheck" type="primary" :disabled="memberData.length === 0" @click="saveCheck" :loading="isConfirming">{{enableSubmit?'提交审核':'保存'}}</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>
    <!-- @module Dialog·审核 -->
    <select-data-member @success="getData()" :id="getId()" :visible.sync="dataOpen"/>

    <!-- 修改 info -->
    <manage prop="name" :optionType="optionType" :items="options" :visible.sync="manageOpen" @reason-change="onReasonChange"/>

    <el-dialog title="更新" :visible.sync="uOpen" width="700px">
      <el-form ref="updateForm" :model="updateModel">
        <div>
          <div class="flex-center" style="margin-bottom: 20px;">
            <div class="modal-label">
              <span style="color: red;">*</span> 扣减原因
            </div>
            <div class="flex-center">
              <el-form-item prop="settingOptionId" style="margin-bottom: 0;" :rules="[{ required:true, message:'请选择原因' }]">
                <el-select name="selectSettingOptionId" v-model="updateModel.settingOptionId" placeholder="扣减原因">
                  <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="String(item.settingOptionId)"></el-option>
                </el-select>
              </el-form-item>
              <i class="el-icon-setting" style="color:#007ed5; font-size: 16px; margin-left: 10px;" @click="manageOpen = true"></i>
            </div>
          </div>
          <div class="flex-center">
            <div class="modal-label">备注</div>
            <div>
              <el-form-item style="margin-bottom: 0;" label prop="remark">
                <el-input name="inputRemark" type="textarea" :maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="updateModel.remark"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnUpdate" type="primary" :loading="updatingInfo" @click="onUpdate">确 定</el-button>
        <el-button name="btnUpdateCancel" @click="resetUpdateForm">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改 info  end -->
    <!-- 选择用户 -->
    <select-member @listenAddMember="onAddMember" v-if="userOpen" :selectMemberVisible="true" @listenSelectMemDialog="userOpen = $event"/>
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_DEDUCTORDER_SUBMIT,
  MEMBERSHIP_API_DEDUCTORDER_DELETEITEM,
  MEMBERSHIP_API_DEDUCTORDER_UPDATEDEDUCTORDERITEMS,
  MEMBERSHIP_API_DEDUCTORDER_UPDATEDEDUCTORDER,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_DEDUCTORDER_BATCHIMPORTMEMBER,
  MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERITEMS,
  MEMBERSHIP_API_DEDUCTORDER_BATCHUPDATEDEDUCTORDERITEMS
} from '@/apis/membership'
import { YNStatus } from '@/enums/common'
import {
  GiftStatus, SettingOptionTypes
} from '@/enums/membership'
import SelectDataMember from './selectMember'
import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import manage from '@/components/scrm/memberDictManage'
import {
  cloneDeep
} from 'lodash'
import SelectMember from '@/components/scrm/selectMembers'
export default {
  components: {
    pagination,
    SelectDataMember,
    SelectMember,
    userInfo,
    manage
  },
  data() {
    return {
      checkResult: {
        pass: GiftStatus.Pass,
        returned: GiftStatus.Returned
      },
      enableSubmit: true,
      key: '',
      giftStatus: GiftStatus,
      detail: {
      }, // 明细
      memberData: [], // 会员数据
      pg: 1,
      size: 10,
      total: 0,

      userOpen: false, // 选择用户开关
      dataOpen: false, // 数据挖掘开关,
      //  popover
      scoreModel: {
        type: '',
        deductQty: ''
      },
      rules: [
        {
          required: true,
          message: '项目不能为空'
        }
      ],
      goldOpen: false,
      scoreOpen: false,
      // popover end
      deleteOpen: false, // 修改 modal
      optionType: SettingOptionTypes.DeductScoreCause,
      options: [],
      uOpen: false, // 更新 modal 开关
      updatingInfo: false, // 更新 info 中
      manageOpen: false, // manage 开关
      updateModel: {
      }, // modal 的model
      isConfirming: false
    }
  },
  methods: {
    onAddMember(params) {
      this.loading = true
      let arr = []
      params.forEach(item => {
        arr.push({
          deductCode: this.getId(),
          memberId: item.memberId
        })
      })
      MEMBERSHIP_API_DEDUCTORDER_BATCHIMPORTMEMBER(arr).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
        }
      })
    },
    onReasonChange(data) {
      this.options = data
    },
    onUpdate() {
      this.updatingInfo = true
      const found = this.options.find(
        op => op.settingOptionId === this.updateModel.settingOptionId
      )
      MEMBERSHIP_API_DEDUCTORDER_UPDATEDEDUCTORDER({
        ...this.updateModel,
        settingOptionName: found.name
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('操作成功!')
            this.getData()
            this.resetUpdateForm()
          }
          this.updatingInfo = false
        })
        .catch(() => {
          this.updatingInfo = false
        })
    },
    resetUpdateForm() {
      this.updateModel = cloneDeep(this.detail)
      this.uOpen = false
    },
    onGoldConfirm() {
      let deductQty = this.scoreModel.type == 0 ? -1 : this.scoreModel.deductQty
      if (
        this.scoreModel.type == '1' &&
        (!deductQty || !deductQty.toString().trim())
      ) {
        this.$message.error('请输入统一扣减礼金')
        return
      } else if (this.scoreModel.type == '') {
        this.$message.error('请选择')
        return
      } else if (this.scoreModel.type == '1' && isNaN(deductQty)) {
        this.$message.error('请输入数字')
        return
      }
      this.scoreModel.deductQty = 0
      this.scoreModel.type = ''
      MEMBERSHIP_API_DEDUCTORDER_BATCHUPDATEDEDUCTORDERITEMS({
        deductCode: this.getId(),
        scoreType: '2',
        deductQty: deductQty
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
          this.onGoldClose()
        }
      })
    },
    onGoldClose() {
      this.scoreModel = {
        scoreType: '1',
        type: ''
      }
      this.goldOpen = false
    },
    onScoreConfirm() {
      let deductQty = this.scoreModel.type == 0 ? -1 : this.scoreModel.deductQty
      if (
        (this.scoreModel.type == '1' && !deductQty) ||
        !deductQty.toString().trim()
      ) {
        this.$message.error('请输入统一扣减积分')
        return
      } else if (this.scoreModel.type == '') {
        this.$message.error('请选择')
        return
      } else if (this.scoreModel.type == '1' && isNaN(deductQty)) {
        this.$message.error('请输入数字')
        return
      }
      this.scoreModel.deductQty = 0
      this.scoreModel.type = ''
      MEMBERSHIP_API_DEDUCTORDER_BATCHUPDATEDEDUCTORDERITEMS({
        deductCode: this.getId(),
        scoreType: '1',
        deductQty: deductQty
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
          this.onScoreClose()
        }
      })
    },
    onScoreClose() {
      this.scoreModel.deductQty = ''
      this.scoreModel.type = ''
      this.scoreOpen = false
    },
    saveCheck() {
      if (this.enableSubmit) {
        this.isConfirming = true
        MEMBERSHIP_API_DEDUCTORDER_SUBMIT(this.getId())
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('提交审核成功!')
              setTimeout(() => {
                this.$router.back()
                this.isConfirming = true
              }, 1000)
            } else {
              this.isConfirming = false
            }
          })
          .catch(() => {
            this.isConfirming = false
          })
      }
    },
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
        key: this.key,
        orderField: 'deductCode',
        orderType: YNStatus.No,
        pageIndex: this.pg,
        pageSize: this.size
      })
        .then(res => {
          this.$store.commit('SET_TB_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.detail = res.data.Data
            this.enableSubmit = true
            this.memberData = res.data.Data.items.rows
            this.total = res.data.Data.items.total
          }
        })
        .catch(() => {
          this.$store.commit('SET_TB_LOADING', false)
        })
    },

    onSearch(val) {
      const value = val.target.value
      this.searchValue = value
      this.getData()
    },
    deleteColumn(data) {
      MEMBERSHIP_API_DEDUCTORDER_DELETEITEM(data.itemId).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
          this.deleteOpen = null
        }
      })
    },
    updateQty(row) {
      if (
        (row.goldenRice && !/^\d+$/.test(row.goldenRice)) ||
        (row.score && !/^\d+$/.test(row.score))
      ) {
        this.$message({
          message: '请输入正整数',
          type: 'warning'
        })
      } else if (
        row.goldenRice > row.currGoldenRice ||
        row.score > row.currScore
      ) {
        this.$message({
          message: '请输入扣减的积分（礼金）小于当前的积分（礼金）',
          type: 'warning'
        })
      } else if (
        String(row.goldenRice).trim() == '' &&
        String(row.score).trim() == ''
      ) {
        this.$message({
          message: '积分和礼金必须设置一个',
          type: 'warning'
        })
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        MEMBERSHIP_API_DEDUCTORDER_UPDATEDEDUCTORDERITEMS({
          itemId: row.itemId,
          goldenRice: row.goldenRice,
          score: row.score
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getData()
          } else {
            this.enableSubmit = false
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    }
  },
  mounted() {
    this.getData()
    MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
      type: this.optionType
    })
      .then(res => res.data.Data)
      .then(res => {
        this.options = res
      })
  },
  filters: {
    giftTitle(val) {
      return GiftStatus.Types.find(({
        key
      }) => key === String(val)).title
    }
  },
  watch: {
    detail(val) {
      this.updateModel = cloneDeep(val)
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
.title-change {
  color: $light-blue !important;
  float: right;
}
.selection {
  display: flex;
  & > :first-child {
    flex: 1;
  }
  :global(.el-input) {
    margin-left: 10px;
    max-width: 200px;
  }
}
.icon-warning {
  color: $light-gold;
}
.icon-setting {
  color: $light-blue;
}
.content {
  min-width: 1250px;
}
</style>

