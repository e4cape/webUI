<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑赠送单</span>
        <el-button name="btnUopen" type="text" class="title title-change" @click="uOpen = true">修改</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
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
        <div class="checkPage-hd selection">
          <div>
            <el-button name="btnUserOpen" @click="userOpen = true" type="primary" size="mini">选择客户</el-button>
            <el-button name="btnDataOpen" @click="dataOpen = true" type="primary" size="mini">从数据挖掘导入</el-button>
            <el-input name="inputKey" type="primary" v-model="key" placeholder="会员卡号/姓名/手机号码" @keyup.native.enter="getData" size="mini"></el-input>
          </div>
          <div>
            <el-popover name="popoverScoreOpen" width="160" @after-leave="onPopoFormClose('scoreForm')" v-model="scoreOpen">
              <el-form ref="scoreForm" :model="scoreModel" :rules="unitScoreRules">
                <el-form-item prop="score" label="赠送积分">
                  <el-input-number name="inputNumberScore" :min="0" :max="inputMax" :step="1" :precision="0" v-model="scoreModel.score"></el-input-number>
                </el-form-item>
                <el-form-item prop="days" label="有效期(天)">
                  <el-input-number name="inputNumberDays" :min="0" :max="inputMax" :step="1" :precision="0" v-model="scoreModel.days"></el-input-number>
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0">
                <el-button name="btnOnScoreClose" size="mini" type="text" @click="onScoreClose">取消</el-button>
                <el-button name="btnOnScoreConfirm" type="primary" size="mini" @click="onScoreConfirm">确定</el-button>
              </div>
              <el-button name="btnReference" type="text" slot="reference">统一赠送积分</el-button>
            </el-popover>
            <el-popover name="popoverGoldOpen" width="160" @after-leave="onPopoFormClose('goldForm')" v-model="goldOpen">
              <el-form ref="goldForm" :model="goldModel" :rules="unitGoldRules">
                <el-form-item prop="score" label="赠送礼金">
                  <el-input-number name="inputNumberScores" :min="0" :max="inputMax" :step="1" :precision="0" v-model="goldModel.score"></el-input-number>
                </el-form-item>
                <el-form-item prop="days" label="有效期(天)">
                  <el-input-number name="inputNumberDayss" :min="0" :max="inputMax" :step="1" :precision="0" v-model="goldModel.days"></el-input-number>
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0">
                <el-button name="btnOnGoldClose" size="mini" type="text" @click="onGoldClose">取消</el-button>
                <el-button name="btnOnGoldConfirm" type="primary" size="mini" @click="onGoldConfirm">确定</el-button>
              </div>
              <el-button name="btnReferences" type="text" slot="reference">统一赠送礼金</el-button>
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
          <el-table-column prop="expendPrice" label="累计消费金额" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="expendLast" label="最近消费日期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="expendLast" label="赠送积分" min-width="120">
            <template slot-scope="scope">
              <el-input name="GoldWeight" :maxlength="9" v-model="scope.row.score" @keyup.native="scope.row.score = $root.toFixed(scope.row.score)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expendLast" label="积分有效期 (天)" min-width="120">
            <template slot-scope="scope">
              <el-input name="GoldWeight" :maxlength="9" v-model="scope.row.scoreExpireDays" @keyup.native="scope.row.scoreExpireDays = $root.toFixed(scope.row.scoreExpireDays)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expendLast" label="赠送礼金" min-width="120">
            <template slot-scope="scope">
              <el-input name="GoldWeight" :maxlength="9" v-model="scope.row.goldenRice" @keyup.native="scope.row.goldenRice = $root.toFixed(scope.row.goldenRice)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expendLast" label="礼金有效期 (天)" min-width="120">
            <template slot-scope="scope">
              <el-input name="GoldWeight" :maxlength="9" v-model="scope.row.goldenRiceExpireDays" @keyup.native="scope.row.goldenRiceExpireDays = $root.toFixed(scope.row.goldenRiceExpireDays)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button name="btnSaveColumn" @click="saveColumn(scope.row)" size="mini" type="text">保存</el-button>
              <el-popover width="260" :value="deleteOpen === scope.row.itemId">
                <div>
                  <i class="el-icon-warning icon-warning"></i> 你确定要删除这个客户吗?
                </div>
                <div style="text-align: right; margin: 0; margin-top: 10px;">
                  <el-button name="btnDeleteOpen" size="mini" type="text" @click="deleteOpen = null">取消</el-button>
                  <el-button name="btnDeleteColumn" type="primary" size="mini" @click="deleteColumn(scope.row)">确定</el-button>
                </div>
                <el-button name="btnDeleteOpens" @click="deleteOpen = scope.row.itemId" slot="reference" size="mini" type="text">删除</el-button>
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
      <el-button name="btnSaveCheck" type="primary" :disabled="memberData.length === 0" size="mini" :loading="loading" @click="saveCheck">提交审核</el-button>
      <el-button name="btnBack" size="mini" @click="$router.back()">返回</el-button>
    </div>
    <!-- @module Dialog·审核 -->
    <select-data-member @success="getData" :id="giveId" :visible.sync="dataOpen"/>

    <!-- 修改 info -->
    <manage prop="name" :optionType="optionType" :items="options" :visible.sync="manageOpen" @reason-change="onReasonChange"/>

    <el-dialog title="更新" :visible.sync="uOpen" width="40%">
      <el-form ref="updateForm" :model="updateModel">
        <div>
          <div class="flex-center" style="margin-bottom: 20px;">
            <div class="modal-label">
              <span style="color: red;">*</span> 赠送原因
            </div>
            <div class="flex-center">
              <el-form-item prop="settingOptionId" style="margin-bottom: 0;" :rules="[{ required:true, message:'请选择原因' }]">
                <el-select name="selectSettingOptionId" v-model="updateModel.settingOptionId" placeholder="赠送原因">
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
                <el-input name="inputRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="updateModel.remark" maxlength="100"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnOnUpdate" type="primary" :loading="updatingInfo" @click="onUpdate">确 定</el-button>
        <el-button @click="resetUpdateForm">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改 info  end -->

    <!-- 选择用户 -->
    <select-member @listenAddMember="onAddMember" v-if="userOpen" :selectMemberVisible="true" @listenSelectMemDialog="userOpen = $event"/>
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_MANUALORDER_GETINFO,
  MEMBERSHIP_API_MANUALORDER_GETITEM,
  MEMBERSHIP_API_MANUALORDER_COMMIT,
  MEMBERSHIP_API_MANUALORDER_BATCHUPDATEBYORDERID,
  MEMBERSHIP_API_MANUALORDER_UPDATEITEM,
  MEMBERSHIP_API_MANUALORDER_DELETEITEM,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_MANUALORDER_UPDATE,
  MEMBERSHIP_API_MANUALORDER_BATCHIMPORTMEMBER
} from '../../../apis/membership'
import {
  GiftStatus, SettingOptionTypes
} from '../../../enums/membership'
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
      giveId: '',
      inputMax: 1000000,
      checkResult: {
        pass: GiftStatus.Pass,
        returned: GiftStatus.Returned
      },
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
      scoreModel: {
        scoreType: '1'
      },
      goldModel: {
        scoreType: '2'
      },
      rules: [
        {
          required: true,
          message: '项目不能为空'
        }
      ],
      unitGoldRules: {
        score: [
          {
            required: true,
            message: '赠送礼金不能为空'
          }
        ],
        days: [
          {
            required: true,
            message: '有效天数不能为空'
          }
        ]
      },
      unitScoreRules: {
        score: [
          {
            required: true,
            message: '赠送积分不能为空'
          }
        ],
        days: [
          {
            required: true,
            message: '有效天数不能为空'
          }
        ]
      },
      goldOpen: false,
      scoreOpen: false,
      deleteOpen: false, // 修改 modal
      optionType: SettingOptionTypes.GiveScoreCause,
      options: [],
      uOpen: false, // 更新 modal 开关
      updatingInfo: false, // 更新 info 中
      manageOpen: false, // manage 开关
      updateModel: {},
      loading: false
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
    onPopoFormClose(formName) {
      const form = this.$refs[formName]
      form.resetFields()
    },
    onAddMember(params) {
      this.loading = true
      MEMBERSHIP_API_MANUALORDER_BATCHIMPORTMEMBER({
        giveId: this.giveId,
        childs: params.map(p => ({
          ...p,
          giveId: this.giveId
        }))
      }).then(res => {
        const {
          Code
        } = res.data
        if (Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
        }
        this.loading = false
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
      MEMBERSHIP_API_MANUALORDER_UPDATE({
        ...this.updateModel,
        settingOptionName: found.name
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('操作成功!')
            this.getInfo()
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
      this.$refs.goldForm.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.memberData.some((m) => m.score === 0) && this.goldModel.score === 0) {
          this.$message.warning('赠送积分或赠送礼金至少赠送一个，不能全为0')
          return false
        }
        MEMBERSHIP_API_MANUALORDER_BATCHUPDATEBYORDERID({
          ...this.goldModel,
          giveId: this.giveId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('操作成功!')
            this.getData()
            this.onGoldClose()
          }
        })
      })
    },
    onGoldClose() {
      this.goldModel = {
        scoreType: '2'
      }
      this.goldOpen = false
    },
    onScoreConfirm() {
      this.$refs.scoreForm.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.memberData.some((m) => m.goldenRice === 0) && this.scoreModel.score === 0) {
          this.$message.warning('赠送积分或赠送礼金至少赠送一个，不能全为0')
          return false
        }
        MEMBERSHIP_API_MANUALORDER_BATCHUPDATEBYORDERID({
          ...this.scoreModel,
          giveId: this.giveId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('操作成功!')
            this.getData()
            this.onScoreClose()
          }
        })
      })
    },
    onScoreClose() {
      this.scoreModel = {
        scoreType: '1'
      }
      this.scoreOpen = false
    },
    saveCheck() {
      if (this.loading) {
        return
      }
      this.loading = true
      MEMBERSHIP_API_MANUALORDER_COMMIT(this.giveId).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('提交审核成功!')
            setTimeout(() => {
              this.$router.back()
              this.loading = false
            }, 1000)
          } else {
            this.loading = false
          }
        },
        () => {
          this.loading = false
        }
      )
    },
    resetInvalidForm() {
      this.iOpen = false
      this.$refs.invalidForm.resetFields()
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
        giveId: this.giveId,
        PageIndex: this.pg,
        PageSize: this.size,
        key: this.key
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memberData = res.data.Data.rows.map(item => {
            let useObj = item
            Object.keys(item).forEach(key => {
              if (item[key] === null) {
                useObj[key] = undefined
              }
            })
            return useObj
          })
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getInfo() {
      MEMBERSHIP_API_MANUALORDER_GETINFO(this.giveId).then(res => {
        this.detail = res.data.Data
      })
    },
    deleteColumn(data) {
      MEMBERSHIP_API_MANUALORDER_DELETEITEM([data.itemId]).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
          this.deleteOpen = null
        }
      })
    },
    saveColumn(data) {
      this.$store.commit('SET_TB_LOADING', true)
      MEMBERSHIP_API_MANUALORDER_UPDATEITEM({
        giveId: this.giveId,
        items: [data]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('保存成功!')
          const index = this.memberData.findIndex(v => v.itemId === data.itemId)
          this.memberData.splice(index, 1, data)
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    }
  },
  mounted() {
    this.giveId = this.$route.query.id
    this.getInfo()
    this.getData()

    MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
      type: 7
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
.panel .panel-hd .title-change {
  color: $light-blue !important;
  float: right;
  line-height: 25px;
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
</style>

