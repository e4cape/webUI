<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox" v-if="!isOneNumberManyShopCompany">
          <el-button name="btnEopen" type="primary" @click="eOpen = true">新建</el-button>
          <el-dropdown name="dropdownHandleCommand" @command="handleCommand">
            <el-button name="btnBatchOperate" type="primary">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="#">批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="selectStatus" v-model="queryForm.status" placeholder="所有状态" @change="onStatusChange">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in giftStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="giveId">
            <el-input name="inputGiveId" v-model="queryForm.giveId" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="单据编号：" prop="giveId">
            <el-input name="inputGiveId" v-model="queryForm.giveId" placeholder="单据编号" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item label="赠送原因：" prop="settingOptionId">
            <el-select name="selectSettingOptionId" v-model="queryForm.settingOptionId" placeholder="赠送原因">
              <el-option label="所有原因" value></el-option>
              <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="String(item.settingOptionId)"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建人：" prop="createUserId" v-if="$store.getters.user_session.CharacterType === characterType.Store">
            <el-select name="selectCreateUserId" v-model="queryForm.createUserId" placeholder>
              <el-option label="全部" value></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>

          <el-form-item name="datePickerCreateTime" label="创建时间:" prop="createTime">
            <el-date-picker v-model="queryForm.createTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerLastTime" label="最后操作时间:" prop="lastTime">
            <el-date-picker v-model="queryForm.lastTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="门店" prop="storeName" v-if="isOneNumberManyShopCompany">
            <el-select name="selectStoreName" v-model="queryForm.CharacterId" placeholder="所有门店">
              <el-option v-for="item in $store.getters.stores" :key="item.CharacterId" :label="item.Value" :value="parseInt(item.CharacterId)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格   -->
    <el-table :data="data" @selection-change="selectionChange" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55" fixed="left" :selectable="canSelect"></el-table-column>
      <el-table-column prop="giveCode" sortable="custom" label="单据编号" min-width="160" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column v-if="isOneNumberManyShopCompany" prop="storeName" label="门店" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="settingOptionName" label="赠送原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" sortable="custom" label="创建时间" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="score" label="赠送积分" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goldenRice" label="赠送礼金" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemAmt" label="赠送人数" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastTime" sortable="custom" label="最后操作时间" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" label="状态" min-width="80">
        <template slot-scope="scope">
          <el-tooltip placement="top-start" v-if="scope.row.checkNote" :content="scope.row.checkNote">
            <div :style="statusStyle(scope.row)">{{scope.row.statusText}}</div>
          </el-tooltip>
          <div v-else :class="{red: needShowTooltip(scope.row)}">{{scope.row.statusText}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" name="linkCheck" @click="$router.push({path:'/market/score/manual/view',query:{id: scope.row.giveId}})">查看</el-button>
          <template v-if="!isOneNumberManyShopCompany">
            <template v-if="scope.row.status == giftStatus.Draft || scope.row.status == giftStatus.Returned">
              <el-button type="text" name="linkEdit" @click="$router.push({path:'/market/score/manual/edit',query:{id:scope.row.giveId}})">编辑</el-button>
              <el-button name="btnInvalid" type="text" @click="onInvalid(scope.row)">作废</el-button>
            </template>
            <template v-if="scope.row.status == giftStatus.Pending">
              <el-button name="btnAudit" type="text" @click="onAudit(scope.row)">审核</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <manage prop="name" :optionType="optionType" :items="options" :visible.sync="sOpen" @reason-change="onReasonChange"/>

    <el-dialog title="新建" :visible.sync="eOpen" width="40%">
      <el-form ref="newForm" :model="newModel">
        <div>
          <div class="flex-center" style="margin-bottom: 20px;">
            <div class="modal-label">
              <span style="color: red;">*</span> 赠送原因
            </div>
            <div class="flex-center">
              <el-form-item prop="settingOptionId" style="margin-bottom: 0;" :rules="[{ required:true, message:'请选择原因' }]">
                <el-select name="selectSettingOptionId" v-model="newModel.settingOptionId" placeholder="赠送原因">
                  <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="String(item.settingOptionId)"></el-option>
                </el-select>
              </el-form-item>
              <i class="el-icon-setting" style="font-size: 16px; margin-left: 10px;" @click="sOpen = true"></i>
            </div>
          </div>
          <div class="flex-center">
            <div class="modal-label">备注</div>
            <div>
              <el-form-item style="margin-bottom: 0;" label prop="remark">
                <el-input name="inputRemark" type="textarea" :maxLength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="newModel.remark"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnOnNew" type="primary" @click="onNew">确 定</el-button>
        <el-button name="btnResetNewForm" @click="resetNewForm">取 消</el-button>
      </span>
    </el-dialog>
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <el-dialog title="审核" v-loading="isConfirming" :visible.sync="cOpen" width="700px" @close="resetCheckForm">
      <el-form ref="checkForm" :model="checkModel">
        <div>
          <div v-if="!!selectItem" class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{selectItem.giveCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{selectItem.createUser}} {{selectItem.createTime}}</span>
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
                    <template v-if="checkModel.status === checkResult.returned">
                      <el-input :maxlength="50" v-model="checkModel.checkNote" style="width:calc( 100% - 60px) !important; margin-left: 10px"></el-input>
                      <span class="red">*</span>
                    </template>
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

    <el-dialog title="作废" v-loading="isConfirming" :visible.sync="iOpen" width="700px" @close="resetInvalidForm">
      <el-form ref="invalidForm" :model="invalidModel">
        <div>
          <div v-if="!!selectItem" class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{selectItem.giveCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{selectItem.createUser}} {{selectItem.createTime}}</span>
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
        <el-button name="resetInvalidForm" @click="resetInvalidForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  ScoreExpireTypes,
  GiveScoreStatus,
  SettingOptionTypes,
  ScoreTypes,
  GiftStatus
} from '@/enums/membership'

import { SecurityUserState } from '@/enums/merchant.js'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  MEMBERSHIP_API_MANUALORDER_GETLIST,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_MANUALORDER_SAVEAUDIT,
  MEMBERSHIP_API_MANUALORDER_CREATE
} from '@/apis/membership'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import manage from '@/components/scrm/memberDictManage'

export default {
  data() {
    const data = {
      characterType: CharacterType,
      selectItem: null,
      securityUserState: SecurityUserState,
      checkResult: {
        pass: GiftStatus.Pass,
        returned: GiftStatus.Returned
      },
      checkModel: {
        status: GiftStatus.Pass,
        checkNote: ''
      },
      invalidModel: {
        checkNote: ''
      },
      optionType: SettingOptionTypes.GiveScoreCause,
      newModel: {},
      apiKey: 'SCORERECORD_GETGIVESCORE',
      scoreExpireTypes: ScoreExpireTypes,
      giveScoreStatus: GiveScoreStatus,
      settingOptionTypes: SettingOptionTypes,
      scoreTypes: ScoreTypes,
      giftStatus: GiftStatus,
      queryForm: {
        giveId: '',
        characterId: '',
        createUserId: '',
        createTime: '',
        lastTime: '',
        status: '',
        settingOptionId: '',
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10,
        storeName: ''
      },
      parameters: {},
      data: [],
      total: 0,
      options: [],
      ss: [],
      eOpen: false, // 新建
      sOpen: false, // 控制 manage
      cOpen: false, // 审核
      iOpen: false, // 作废,
      isConfirming: false
    }
    return data
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(this.queryForm, {
        giveId: '',
        characterId: '',
        createUserId: '',
        createTime: '',
        lastTime: '',
        status: '',
        settingOptionId: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10,
        storeName: ''
      }, query)
      this.getData()
    },
    canSelect(row) {
      const { status } = row
      return String(status) === GiftStatus.Pending
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.queryForm.createTime || ['', '']
      let lastTime = this.queryForm.lastTime || ['', '']
      let param = {
        createTimeStart: createTime[0],
        createTimeEnd: createTime[1],
        lastTimeStart: lastTime[0],
        lastTimeEnd: lastTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)

      MEMBERSHIP_API_MANUALORDER_GETLIST(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.total = res.data.Data.total || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      this.queryForm.orderField = sort.prop || 'createTime'
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.queryForm.isSenior = true
      this.queryForm.status = ''
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.pageIndex = 1
      this.parameters.pageSize = val
      this.initRoute()
    },
    onStatusChange() {
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
      this.getData()
    },
    handleCommand() {
      if (!this.ss.length) {
        return this.$message.warning('请选择要批量操作的单据.')
      }
      this.singleCheck = false
      this.cOpen = true
    },
    selectionChange(val) {
      this.ss = val
    },
    resetNewForm() {
      this.eOpen = false
      this.$refs.newForm.resetFields()
    },
    resetCheckForm() {
      this.cOpen = false
      this.checkModel = {
        status: GiftStatus.Pass,
        checkNote: ''
      }
    },
    resetInvalidForm() {
      this.iOpen = false
      this.invalidModel = {
        checkNote: ''
      }
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
      const self = this
      this.isConfirming = true
      this.$refs.checkForm.validate(async v => {
        try {
          if (!v) {
            return false
          }
          const codeList = this.singleCheck ? [this.selectItem] : this.ss
          const res = await MEMBERSHIP_API_MANUALORDER_SAVEAUDIT({
            orderIdCodeList: codeList,
            ...this.checkModel
          }).then(res => res.data.Data)
          if (res) {
            self.init()
            self.cOpen = false
          }
        } catch (e) {
          console.error(e)
        } finally {
          self.isConfirming = false
        }
      })
    },
    onNew() {
      this.$refs.newForm.validate(async v => {
        if (!v) {
          return false
        }
        this.options.some(item => {
          if (item.settingOptionId === this.newModel.settingOptionId) {
            this.newModel.settingOptionName = item.name
          }
        })
        try {
          const res = await MEMBERSHIP_API_MANUALORDER_CREATE(this.newModel)
          if (res.data.Code === 'CORRECT') {
            this.$router.push({
              path: '/market/score/manual/edit',
              query: {
                id: res.data.Data.giveId
              }
            })
          }
        } catch (e) {
          console.error(e)
        }
      })
    },
    onReasonChange(e) {
      this.options = e
    },
    onInvalid(dt) {
      this.selectItem = dt
      this.iOpen = true
    },
    onAudit(dt) {
      this.selectItem = dt
      this.singleCheck = true
      this.cOpen = true
    },
    onInvalidConfirm() {
      if (this.isConfirming) {
        return
      }
      this.$refs.invalidForm.validate(async v => {
        if (!v) {
          return false
        }
        this.isConfirming = true
        try {
          const codeList = [this.selectItem]
          const res = await MEMBERSHIP_API_MANUALORDER_SAVEAUDIT({
            orderIdCodeList: codeList,
            status: GiftStatus.Invalid,
            ...this.invalidModel
          }).then(res => res.data.Data)
          if (res) {
            this.$message.success('操作成功!')
            this.init()
            this.iOpen = false
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.isConfirming = false
        }
      })
    },
    needShowTooltip(data) {
      const { status: s } = data
      return (
        s === parseInt(GiftStatus.Invalid) ||
        s === parseInt(GiftStatus.Returned)
      )
    },
    canShowTooltip(data) {
      const { checkNote } = data
      return this.needShowTooltip(data) && !!checkNote
    },
    statusStyle(data) {
      if (this.needShowTooltip(data)) {
        return 'color: red;'
      }
      return ''
    }
  },
  components: {
    searchPanel,
    pagination,
    manage
  },
  async mounted() {
    this.$store.dispatch('GET_STORES_DROPLIST')
    this.$store.dispatch('GET_USERS_DROPLIST')
    this.init()
    MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
      type: SettingOptionTypes.GiveScoreCause
    }).then(res => {
      this.options = res.data.Data
    })
  },
  watch: {
    $route: 'init'
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
</style>
