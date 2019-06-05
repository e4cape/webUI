<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox" v-if="!isOneNumberManyShopCompany">
          <el-button name="btnNew" type="primary" @click="eOpen = true">新建</el-button>
          <el-dropdown @command="handleCommand" name="dropdownBatchOperate">
            <el-button type="primary">
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
            <el-select name="selectStatus" v-model="queryForm.status" placeholder="所有状态" @change="onStatusChange" filterable>
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in deductOrderStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deductCode">
            <el-input name="inputDeductCode" v-model="queryForm.deductCode" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="单据编号：" prop="settingOptionId">
            <el-input name="inputDeductCode" v-model="queryForm.deductCode" placeholder="单据编号" @keyup.enter.native="onSearch"></el-input>
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
              <el-option v-for="(item,index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间:" prop="createTime" name="datePickerCreateTime">
            <el-date-picker v-model="queryForm.createTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerLastTime" label="最后操作时间:" prop="lastTime">
            <el-date-picker v-model="queryForm.lastTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="门店：" prop="storeName" v-if="isOneNumberManyShopCompany">
            <el-select v-model="queryForm.characterId" placeholder="所有门店">
              <el-option v-for="item in $store.getters.stores" :key="item.CharacterId" :label="item.Value" :value="parseInt(item.CharacterId)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格   -->
    <el-table :data="data" @selection-change="selectionChange" ref="adTable" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="40" fixed="left" :selectable="canSelect"></el-table-column>
      <el-table-column prop="deductCode" sortable="custom" label="单据编号" width="180" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column v-if="isOneNumberManyShopCompany" prop="storeName" label="门店" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="settingOptionName" label="扣减原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" sortable="custom" label="创建时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.createTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="score" label="扣减积分" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goldenRice" label="扣减礼金" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemAmt" label="人数" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastTime" sortable="custom" label="最后操作时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.lastTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" min-width="80">
        <template slot-scope="scope">
          <el-tooltip placement="top-start" v-if="scope.row.checkNote" :content="scope.row.checkNote">
            <div :style="statusStyle(scope.row)">{{scope.row.statusText}}</div>
          </el-tooltip>
          <div v-else :class="{red: needShowTooltip(scope.row)}">{{scope.row.statusText}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <router-link name="linkCheck" :to="{path:'/market/abatement/abatementCheck',query:{id: scope.row.deductCode}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="!isOneNumberManyShopCompany">
            <template v-if="scope.row.status == deductOrderStatus.Draft || scope.row.status == deductOrderStatus.Returned">
              <router-link name="linkEdit" :to="{path:'/market/abatement/abatementEdit',query:{id:scope.row.deductCode}}" class="btn-link el-button el-button--text">编辑</router-link>
              <el-button name="linkInvalid" type="text" @click="onInvalid(scope.row)">作废</el-button>
            </template>
            <el-button name="linkAudit" v-if="scope.row.status == deductOrderStatus.Pending" type="text" @click="onAudit(scope.row)">审核</el-button>
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
              <span style="color: red;">*</span> 扣减原因
            </div>
            <div class="flex-center">
              <el-form-item prop="settingOptionId" style="margin-bottom: 0;" :rules="[{ required:true, message:'请选择原因' }]">
                <el-select name="selectSettingOptionId" v-model="newModel.settingOptionId" placeholder="扣减原因">
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
                <el-input name="inputRemark" type="textarea" :maxLength="100" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="newModel.remark"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onNew" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button @click="resetNewForm">取 消</el-button>
      </span>
    </el-dialog>
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <el-dialog title="审核" :visible.sync="cOpen" width="700px">
      <el-form ref="checkForm" :model="checkModel">
        <div>
          <div v-if="selectItems.length == 1" class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{selectItems[0].deductCode}}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{selectItems[0].createUser}} {{selectItems[0].createTime}}</span>
            </div>
          </div>
          <div style="margin-bottom: 20px; display: flex;">
            <div class="modal-label" style="padding-top: 8px;">审核结果:</div>
            <div class="flex-center">
              <el-radio-group v-model="checkModel.status">
                <el-radio :label="checkResult.pass" class="modal-radio">审核通过</el-radio>
                <el-radio :label="checkResult.returned" class="modal-radio">
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
        <el-button type="primary" @click="onCheck" :loading="isConfirming">确 定</el-button>
        <el-button @click="resetCheckForm">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="作废" v-loading="isConfirming" :visible.sync="iOpen" width="700px">
      <el-form ref="invalidForm" :model="invalidModel">
        <div>
          <div v-if="selectItems.length && selectItems.length == 1" class="modal-line">
            <div>
              <span class="form-label">单据编号:</span>
              <span>{{selectItems[0].deductCode }}</span>
            </div>
            <div>
              <span class="form-label">创建:</span>
              <span>{{selectItems[0].createUser}} {{selectItems[0].createTime}}</span>
            </div>
          </div>
          <div style="margin-bottom: 20px; display: flex;">
            <div class="modal-label is-requery">作废原因:</div>
            <div class="flex-center" style="flex:1;">
              <el-input name="inputCheckNote" v-model="invalidModel.checkNote" :maxlength="50"></el-input>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onInvalidConfirm" :loading="isConfirming">确 定</el-button>
        <el-button @click="resetInvalidForm">取 消</el-button>
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
  DeductOrderStatus
} from '@/enums/membership'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SecurityUserState
} from '@/enums/merchant.js'
import {
  MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERLIST,
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_DEDUCTORDER_AUDITRETURN,
  MEMBERSHIP_API_DEDUCTORDER_AUDIT,
  MEMBERSHIP_API_DEDUCTORDER_CREATE,
  MEMBERSHIP_API_DEDUCTORDER_INVALID
} from '@/apis/membership'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import manage from '@/components/scrm/memberDictManage'

export default {
  data() {
    const data = {
      characterType: CharacterType,
      checkResult: {
        pass: DeductOrderStatus.Pass,
        returned: DeductOrderStatus.Returned
      },
      securityUserState: SecurityUserState,
      checkModel: {
        status: DeductOrderStatus.Pass
      },
      invalidModel: {
      },
      optionType: SettingOptionTypes.DeductScoreCause,
      newModel: {
      },
      apiKey: 'SCORERECORD_GETGIVESCORE',
      scoreExpireTypes: ScoreExpireTypes,
      giveScoreStatus: GiveScoreStatus,
      settingOptionTypes: SettingOptionTypes,
      scoreTypes: ScoreTypes,
      deductOrderStatus: DeductOrderStatus,
      queryForm: {
        characterId: 0,
        createUserId: '',
        createTime: '',
        deductCode: '',
        lastTime: '',
        status: '',
        settingOptionId: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20,
        storeName: ''
      },
      parameters: {
      },
      data: [],
      total: 0,
      options: [],
      selectItems: [],
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
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(
        {
          characterId: 0,
          createUserId: '',
          createTime: '',
          deductCode: '',
          lastTime: '',
          status: '',
          settingOptionId: '',
          orderField: '',
          orderType: YNStatus.No,
          pageIndex: 1,
          pageSize: 20,
          storeName: ''
        },
        this.queryForm,
        query
      )
      this.getData()
    },
    canSelect(row) {
      const {
        status
      } = row
      return String(status) === DeductOrderStatus.Pending
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.createTime || ['', '']
      let lastTime = this.parameters.lastTime || ['', '']
      let param = Object.assign({}, this.parameters, {
        createTimeStart: createTime[0],
        createTimeEnd: createTime[1],
        lastTimeStart: lastTime[0],
        lastTimeEnd: lastTime[1],
        characterId: this.parameters.characterId || '' // characterId == 0无法搜索到数据
      })
      MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERLIST(param).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.data = res.data.Data.rows || []
            this.total = res.data.Data.total || 0
          }
          this.$store.commit('SET_TB_LOADING', false) // table loading
        }
      )
    },
    sortChange(sort) {
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      // 重置表单
      this.queryForm = {
        characterId: '',
        createUserId: '',
        createTime: '',
        deductCode: '',
        lastTime: '',
        status: '',
        settingOptionId: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20,
        storeName: ''
      }
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
        path: this.$router.path, query: this.parameters
      })
    },
    handleCommand() {
      if (!this.selectItems.length) {
        return this.$message.warning('请选择要批量操作的单据.')
      }
      this.singleCheck = false
      this.cOpen = true
    },
    selectionChange(val) {
      this.selectItems = val
    },
    resetNewForm() {
      this.eOpen = false
      this.$refs.newForm.resetFields()
    },
    resetCheckForm() {
      this.cOpen = false
      this.selectItems = []
      this.$refs.adTable.clearSelection()
      this.$refs.checkForm.resetFields()
    },
    resetInvalidForm() {
      this.iOpen = false
      this.selectItems = []
      this.$refs.adTable.clearSelection()
      this.$refs.invalidForm.resetFields()
    },
    onCheck() {
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
          let deductCodes = []
          this.selectItems.forEach(item => {
            deductCodes.push(item.deductCode)
          })
          MEMBERSHIP_API_DEDUCTORDER_AUDIT({
            deductCodes: deductCodes
          })
            .then(res => {
              this.isConfirming = false
              if (res.data.Code === 'CORRECT') {
                this.init()
                this.selectItems = []
                this.checkModel.status = ''
                this.cOpen = false
              }
            })
            .catch(() => {
              this.isConfirming = false
            })
        } else {
          let arr = []
          this.selectItems.forEach(item => {
            arr.push({
              deductCode: item.deductCode,
              checkNote: this.checkModel.checkNote
            })
          })
          MEMBERSHIP_API_DEDUCTORDER_AUDITRETURN(arr)
            .then(res => {
              this.isConfirming = false
              if (res.data.Code === 'CORRECT') {
                this.init()
                this.selectItems = []
                this.checkModel.status = ''
                this.checkModel.checkNote = ''
                this.cOpen = false
              }
            })
            .catch(() => {
              this.isConfirming = false
            })
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
          this.$store.commit('SET_BTN_LOADING', true)
          const res = await MEMBERSHIP_API_DEDUCTORDER_CREATE(this.newModel)
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$router.push({
              path: '/market/abatement/abatementEdit',
              query: {
                id: res.data.Data.deductCode
              }
            })
          }
        } catch (e) {
          this.$store.commit('SET_BTN_LOADING', false)
        }
      })
    },
    onReasonChange(e) {
      this.options = e
    },
    onInvalid(dt) {
      this.selectItems = [dt]
      this.iOpen = true
    },
    onAudit(dt) {
      this.selectItems = [dt]
      this.singleCheck = true
      this.cOpen = true
    },
    onInvalidConfirm() {
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
          deductCode: this.selectItems[0].deductCode,
          ...this.invalidModel
        })
          .then(res => {
            this.isConfirming = false
            if (res.data.Code === 'CORRECT') {
              this.$message.success('操作成功!')
              this.init()
              this.iOpen = false
            } else {
              this.$message.error(res.data.Message)
            }
          })
          .catch(() => {
            this.isConfirming = false
          })
      })
    },
    needShowTooltip(data) {
      const {
        status: s
      } = data
      return (
        s === parseInt(DeductOrderStatus.Invalid) ||
        s === parseInt(DeductOrderStatus.Returned)
      )
    },
    canShowTooltip(data) {
      const {
        checkNote
      } = data
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
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
    this.$store.dispatch('GET_USERS_DROPLIST') // 用户下拉
    this.$store.dispatch('GET_STORES_DROPLIST') // 门店下拉，总部端用
    MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
      type: this.optionType
    }).then(res => {
      if (res.data.Code === 'CORRECT') {
        this.options = res.data.Data
      }
    })
  },
  filters: {
    filterGivingClazz(value) {
      const v = String(value)
      return ScoreTypes.Types.find(({
        key
      }) => key === v).title
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
