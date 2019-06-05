<template>
  <div class="content">
    <el-row :gutter="20">
      <el-col style="width: 180px;">
        <div class="panel">
          <div class="subject-title">单据列表</div>
          <div
            :name="item.Value"
            class="subject"
            :class="item.KeyId == currentOrderType ? 'active-subject': ''"
            @click="changeCurrentOrderType(item.KeyId)"
            v-for="item in orderType.TypeArray"
            :key="item.KeyId"
          >{{item.Value}}</div>
        </div>
      </el-col>
      <el-col style="width: calc(100% - 180px);">
        <div class="panel">
          <div class="panel-hd">
            <div class="title">{{orderType.Types[currentOrderType]}}</div>
          </div>
          <div class="panel-bd p-5">
            <div class="main-show clearfix m-t-10">
              <div
                class="panel fl list"
                v-if="radioIndex == largeType.Goods"
              >
                <div class="subject-title">货品种类</div>
                <div
                  :name="item.Value"
                  class="subject"
                  :class="item.KeyId == categoryType ? 'active-subject': ''"
                  @click="changeCategory(item.KeyId)"
                  v-for="item in categoryList"
                  :key="item.KeyId"
                >{{item.Value}}</div>
              </div>
              <!-- 表格 -->
              <div :class="['fl','main',radioIndex == largeType.Goods ? 'main-r' : '']">
                <div
                  class="tabs"
                  v-if="tabTitles.length > 0"
                >
                  <span
                    name="tab"
                    class="tab"
                    v-for="item in tabTitles"
                    :key="item.KeyId"
                    :class="{'active': tabIndex == item.KeyId}"
                    @click="tabChange(item.KeyId)"
                  >{{item.Value}}</span>
                </div>
                <el-table
                  :data="dataList  | calculationMethod"
                  class="purchase-table"
                  key="tab1"
                  v-loading="$store.getters.tb_loading"
                  element-loading-text="拼命加载中"
                  v-if="tabIndex != 99999"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    prop="FieldCnName"
                    label="属性名称"
                    show-overflow-tooltip
                    min-width="90"
                  ></el-table-column>
                  <el-table-column
                    prop="FieldType"
                    label="类型"
                    min-width="60"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">{{fieldType.Types[scope.row.FieldType]}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="IsEnable"
                    label="是否启用"
                    min-width="70"
                  >
                    <template slot-scope="scope">
                      <el-switch
                        name="IsEnable"
                        :disabled="scope.row.IsDefault === enableState.Enable"
                        v-model="scope.row.IsEnable"
                        active-text
                        inactive-text
                        :active-value="enableState.Enable"
                        :inactive-value="enableState.Disable"
                        @change="(v) => changeState(v, scope.row.FieldId, 'IsEnable')"
                      ></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="IsRequired"
                    label="是否必填"
                    min-width="70"
                    v-if="!(tabIndex == smallType.MainStone || this.tabIndex == smallType.SlaveStone)"
                  >
                    <template slot-scope="scope">
                      <el-switch
                        name="IsRequired"
                        :disabled="scope.row.IsDefault === enableState.Enable"
                        v-model="scope.row.IsRequired"
                        active-text
                        inactive-text
                        :active-value="enableState.Enable"
                        :inactive-value="enableState.Disable"
                        @change="(v) => changeState(v, scope.row.FieldId,'IsRequired')"
                      ></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="IsDefault"
                    label="强制必填"
                    min-width="70"
                    v-if="!(tabIndex == smallType.MainStone || this.tabIndex == smallType.SlaveStone) && $store.getters.user_session.CharacterType == characterType.Lingcb"
                  >
                    <template slot-scope="scope">
                      <el-switch
                        name="IsDefault"
                        v-model="scope.row.IsDefault"
                        active-text
                        inactive-text
                        :active-value="enableState.Enable"
                        :inactive-value="enableState.Disable"
                        @change="(v) => changeState(v, scope.row.FieldId,'IsDefault')"
                      ></el-switch>
                    </template>
                  </el-table-column>
                  <!-- @ TODO: 下期打开 -->
                  <!-- <el-table-column prop="IsListable" label="列表显示" min-width="85">
                    <template slot="header">
                      <span class="m-r-5">列表显示</span>
                      <el-tooltip effect="light" content="开启后，在查询列表中显示，关闭后不显示" placement="top">
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-switch
                        name="IsListable"
                        :disabled="scope.row.IsListable === enableState.Disabled"
                        v-model="scope.row.IsListable"
                        active-text
                        inactive-text
                        :active-value="enableState.Enable"
                        :inactive-value="enableState.Disable"
                        @change="(v) => changeState(v, scope.row.FieldId,'IsListable')"
                      ></el-switch>
                    </template>
                  </el-table-column>-->
                  <el-table-column
                    prop="rank"
                    label="顺序"
                    min-width="160"
                  >
                    <template slot-scope="scope">
                      <div class="rank-btn-group">
                        <span
                          name="rank"
                          class="rank-btn"
                          v-for="(clazz, index) in scope.row.rank	"
                          :key="index"
                          :class="clazz"
                          @click="sorting(clazz,scope.row)"
                        ></span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- @ TODO: 下期打开 -->
                <!-- <div
                  class="panel p-10"
                  v-else
                >
                  <div class="m-b-10 clearfix">
                    <el-button
                      type="primary"
                      @click="showDialog(0)"
                    >新建</el-button>
                    <em class="fr">注：先计算靠前的项目，然后按顺序逐个计算，靠前项目的计算公式不要包含靠后的项目</em>
                  </div>
                  <el-table
                    :data="calcList | calculationMethod"
                    class="purchase-table"
                    key="tab2"
                    v-loading="$store.getters.tb_loading"
                    element-loading-text="拼命加载中"
                  >
                    <el-table-column
                      prop="FormulaLeftCn"
                      label="计算项目"
                      min-width="80"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      prop="FormulaStrCn"
                      label="计算公式"
                      min-width="220"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      prop="rank"
                      label="顺序"
                      width="160"
                    >
                      <template slot-scope="scope">
                        <div class="rank-btn-group">
                          <span
                            name="rank"
                            class="rank-btn"
                            v-for="(clazz, index) in scope.row.rank"
                            :key="index"
                            :class="clazz"
                            @click="sorting(clazz,scope.row)"
                          ></span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="contral"
                      label="操作"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          @click="showDialog(1,scope.row)"
                        >编辑</el-button>
                        <el-button
                          type="text"
                          @click="del($event,scope.row.FormulaId)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div> -->
              </div>
              <!-- END 表格 -->
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- @dialog 新建公式 -->
    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '公式'"
      :visible.sync="dialogVisible"
      :before-close="beforeClose"
    >
      <div class="create-dialog clearfix">
        <div class="left">
          <div class="title">数据列表</div>
          <div class="search">
            <el-input
              placeholder="输入名称搜索"
              v-model="searchName"
              @input="search"
            ></el-input>
          </div>
          <div class="staff-wrap">
            <div
              class="staff"
              :class="activeData == item.FieldId ? 'active': ''"
              v-for="(item,index) in searchList"
              :key="index"
              @click="clickData(item.FieldId,item.FieldCnName)"
            >{{item.FieldCnName}}</div>
          </div>
        </div>
        <div class="right">
          <el-form
            label-position="top"
            label-width="80px"
            :model="dialogForm"
            :rules="rules"
            ref="dialogForm"
          >
            <el-form-item
              label="计算项目"
              prop="FormulaLeftCn"
            >
              <el-select
                filterable
                v-model="dialogForm.FormulaLeftCn"
                placeholder="请选择计算项目"
                @change="changeProject"
                :loading="dialogLoading"
                :disabled="isEdit"
              >
                <el-option
                  :value="item.FieldCnName"
                  v-for="(item,key) in chooseList"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="计算公式"
              prop="FormulaStrCn"
            >
              <el-input
                type="textarea"
                v-model="dialogForm.FormulaStrCn"
                rows="12"
                resize="none"
                placeholder="请从左侧数据列表选择到以下公式框内，最多200个字符"
                maxlength="200"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save"
          :loading="$store.getters.is_loading"
        >保 存</el-button>
      </div>
    </el-dialog>
    <!-- @END 新建公式 -->
  </div>
</template>

<script>
import { EnableState, SortType, CharacterType } from '@/enums/common.js'
import {
  SettingEnumeratorEnumeratorType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldType
} from '@/enums/stocking.js'
import {
  STOCKING_API_SETTING_ENUMERATOR_GETS,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_SETTING_FORMULA_GETS,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_SORT,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_UPDATE,
  STOCKING_API_SETTING_FORMULA_CREATE,
  STOCKING_API_SETTING_FORMULA_UPDATE,
  STOCKING_API_SETTING_FORMULA_DELETE,
  STOCKING_API_SETTING_FORMULA_SORT
} from '@/apis/stocking.js'
export default {
  data() {
    return {
      currentOrderType: 0,
      radioIndex: 0,
      radioList: [],
      enableState: EnableState,
      sortType: SortType,
      characterType: CharacterType,
      categoryList: [],
      enumType: SettingEnumeratorEnumeratorType,
      orderType: SettingCustomizedFieldOrderType,
      smallType: SettingCustomizedFieldSmallType,
      largeType: SettingCustomizedFieldLargeType,
      fieldType: SettingCustomizedFieldType,
      categoryType: 0,
      dataList: [],
      tabTitles: [],
      tabFormula: {
        KeyId: 99999,
        Value: '计算公式'
      },
      tabIndex: 0,
      calcList: [],
      parameters: {},
      hasSmall: false,
      dialogVisible: false,
      isEdit: false,
      editFormulaId: 0,
      dialogLoading: false,
      dialogForm: {
        FormulaLeftEn: '',
        FormulaLeftCn: '',
        FormulaStrEn: '',
        FormulaStrCn: ''
      },
      searchName: '',
      chooseList: [],
      searchList: [],
      activeData: 0,
      rules: {
        FormulaLeftCn: [
          {
            required: true,
            message: '请选择计算项目',
            trigger: 'change'
          }
        ],
        FormulaStrCn: [
          {
            required: true,
            message: '请填写计算公式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getCategoryList() {
      let res = await STOCKING_API_SETTING_ENUMERATOR_GETS({
        EnumeratorType: this.enumType.KindType,
        IsEnable: EnableState.Enable,
        PageIndex: 1,
        PageSize: 99999
      })
      if (res.data.Code == 'CORRECT') {
        let tmpArr = res.data.Data.Rows || []
        this.categoryList = tmpArr.map(v => {
          let obj = {}
          obj.KeyId = v.EnumeratorKey
          obj.Value = v.EnumeratorVal
          return obj
        })
      }
    },
    init() {
      this.dataList = []
      this.calcList = []
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            currentOrderType: 0,
            radioIndex: this.largeType.Goods,
            categoryType: 0,
            tabIndex: 0
            // radioIndex: 0
          }
      this.parameters = Object.assign({}, query)
      this.radioIndex =
        this.parameters.radioIndex > 0
          ? this.parameters.radioIndex
          : this.radioList[0].KeyId || 0
      this.currentOrderType =
        parseInt(this.parameters.currentOrderType) ||
        this.orderType.TypeArray[0].KeyId ||
        0
      this.categoryType = parseInt(this.parameters.categoryType)
        ? this.parameters.categoryType
        : this.categoryList.length > 0
          ? this.categoryList[0].KeyId
          : 0
      if (
        this.currentOrderType ==
          this.orderType.StockingCloudStuffPurchaseOrderBasic ||
        this.currentOrderType ==
          this.orderType.StockingCloudStuffIntakeOrderBasic
      ) {
        this.tabTitles = this.largeType.TypeArray.filter(
          v => v.KeyId !== this.largeType.Goods
        )
        this.hasSmall = false
        // this.radioIndex = 0
      } else if (
        this.currentOrderType ==
          this.orderType.StockingCloudGoodsArriveOrderBasic ||
        this.currentOrderType ==
          this.orderType.StockingCloudGoodsIntakeOrderBasic ||
        this.currentOrderType ==
          this.orderType.StockingCloudHalfChangeOrderBasic ||
        this.currentOrderType ==
          this.orderType.StockingCloudGoodsQualityOrderBasic2 ||
        this.currentOrderType ==
          this.orderType.StockingCloudGoodsQualityOrderBasic3
      ) {
        this.tabTitles = [
          ...this.smallType.TypeArray,
          // this.tabFormula
        ]
        this.hasSmall = true
      } else if (
        this.currentOrderType ==
        this.orderType.StockingCloudHalfIntakeOrderBasic
      ) {
        this.tabTitles = [
          ...this.radioList,
          // this.tabFormula
        ]
        this.hasSmall = false
        // this.radioIndex = 0
      } else if (
        this.currentOrderType ==
        this.orderType.StockingCloudGoodsQualityOrderBasic1
      ) {
        this.tabTitles = [...this.smallType.TypeArray]
        this.hasSmall = true
        // this.radioIndex = 0
      } else if (
        this.currentOrderType ==
          this.orderType.StockingCloudGoodsAllotOrderOutake &&
        this.radioIndex == this.largeType.Goods
      ) {
        this.tabTitles = [
          ...this.smallType.TypeArray.filter(
            v => v.KeyId === this.smallType.Basic
          ),
          // this.tabFormula
        ]
        this.hasSmall = true
      } else {
        // TODO: 3/25产品新增了3个单据列表 其中1个没有"计算公式"项 需做修改
        this.radioIndex = this.largeType.Goods
        this.tabTitles = [
          ...this.smallType.TypeArray, 
          // this.tabFormula
        ]
        this.hasSmall = true
      }
      if (
        this.parameters.tabIndex &&
        this.tabTitles.some(v => v.KeyId == this.parameters.tabIndex)
      ) {
        this.tabIndex = this.parameters.tabIndex
      } else {
        this.tabIndex = this.tabTitles.length > 0 ? this.tabTitles[0].KeyId : 0
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    getData() {
      let params = { OrderType: this.currentOrderType }
      this.$store.commit('SET_TB_LOADING', true)
      if (this.tabIndex == 99999) {
        if (this.radioIndex == this.largeType.Goods) {
          params.KindTypeEk = this.categoryType
        }
        STOCKING_API_SETTING_FORMULA_GETS(params).then(res => {
          this.$store.commit('SET_TB_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.calcList = res.data.Data.Rows || []
          }
        })
        return
      }
      if (this.radioIndex > 0) {
        params.LargeType = this.radioIndex
      }
      if (this.radioIndex == this.largeType.Goods) {
        params.KindTypeEk = this.categoryType
      }
      if (this.tabIndex > 0) {
        if (this.hasSmall) {
          params.SmallType = this.tabIndex
        } else {
          params.LargeType = this.tabIndex
        }
      }
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS(params).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.dataList = res.data.Data.Rows || []
        }
      })
    },
    changeCurrentOrderType(i) {
      this.currentOrderType = i
      this.parameters.currentOrderType = i
      // FIXME: 下期radioIndex需改成0;
      this.parameters.radioIndex = this.largeType.Goods
      this.parameters.categoryType = this.categoryList[0].KeyId || 0
      this.parameters.tabIndex = 0
      this.initRoute()
    },
    radioChange(v) {
      this.parameters.radioIndex = v
      this.initRoute()
    },
    changeCategory(i) {
      this.categoryType = i
      this.parameters.categoryType = i
      this.initRoute()
    },
    tabChange(i) {
      this.tabIndex = i
      this.parameters.tabIndex = i
      this.initRoute()
    },
    changeState(v, i, n) {
      let params = {
        FieldId: i
      }
      params[n] = v
      if(params.IsDefault === this.enableState.Enable){
        params.IsEnable = this.enableState.Enable
        params.IsRequired = this.enableState.Enable
      }
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_UPDATE(params).then(res => {
        if (res.data.Code !== 'CORRECT') {
          this.getData()
        }
      })
    },
    async isEnableUpdate(requestList) {
      await Promise.all(requestList)
      this.getData()
    },
    sorting(clazz, row) {
      var tosortType = ''
      switch (
        clazz // 排序计算
      ) {
        case 'to-first':
          tosortType = this.sortType.First
          break
        case 'to-prev':
          tosortType = this.sortType.Prev
          break
        case 'to-next':
          tosortType = this.sortType.Next
          break
        case 'to-last':
          tosortType = this.sortType.Last
          break
        default:
      }
      let apiName = STOCKING_API_SETTING_CUSTOMIZED_FIELD_SORT
      let params = {
        SortType: tosortType
      }
      if (this.tabIndex == 99999) {
        apiName = STOCKING_API_SETTING_FORMULA_SORT
        params.FormulaId = row.FormulaId
      } else {
        params.FieldId = row.FieldId
      }
      apiName(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getData()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    showDialog(isEdit, row) {
      this.isEdit = !!isEdit
      if (isEdit) {
        this.editFormulaId = row.FormulaId
      }
      this.dialogLoading = true
      this.getChooseList(row)
      this.dialogVisible = true
    },
    getChooseList(row) {
      let params = { OrderType: this.currentOrderType }
      if (this.radioIndex > 0) {
        params.LargeType = this.radioIndex
      }
      if (this.radioIndex == this.largeType.Goods) {
        params.KindTypeEk = this.categoryType
      }
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.chooseList = res.data.Data.Rows || []
          this.search()
          this.dialogLoading = false
          if (this.isEdit && row) {
            this.dialogForm.FormulaLeftEn = row.FormulaLeftEn
            this.dialogForm.FormulaLeftCn = row.FormulaLeftCn
            this.dialogForm.FormulaStrEn = row.FormulaStrEn
            this.dialogForm.FormulaStrCn = row.FormulaStrCn
          }
        }
      })
    },
    clickData(i, v) {
      this.activeData = i
      let res = this.dialogForm.FormulaStrCn
        ? this.dialogForm.FormulaStrCn + `{${v}}`
        : `{${v}}`
      if (res.length > 200) {
        this.$message.error('计算公式最多两百字符！')
        return
      }
      this.dialogForm.FormulaStrCn = res
    },
    search() {
      let query = this.searchName || ''
      this.searchList = this.chooseList.filter(
        item =>
          item.FieldCnName.indexOf(query) !== -1 &&
          item.FieldCnName !== this.dialogForm.FormulaLeftCn
      )
    },
    changeProject() {
      this.dialogForm.FormulaStrCn = ''
      this.dialogForm.FormulaStrEn = ''
      this.dialogForm.FormulaLeftEn = this.chooseList[
        this.chooseList.findIndex(
          v => v.FieldCnName === this.dialogForm.FormulaLeftCn
        )
      ].FieldEnName
      this.search()
    },
    save() {
      this.$refs['dialogForm'].validate(valid => {
        if (!valid) {
          return
        }
        let enStr = this.dialogForm.FormulaStrCn
        let cnSplit = enStr.match(/\{.*?\}/g)
        if (!cnSplit) {
          this.$message.error('计算公式需要从数据列表中至少选择一项！')
          return
        }
        let replaceItems = Array.from(new Set(cnSplit)).sort(
          (a, b) => b.length - a.length || a.localeCompare(b)
        )
        replaceItems.forEach(item => {
          let itemInside = item.replace('{', '').replace('}', '')
          let index = this.chooseList.findIndex(
            v => v.FieldCnName === itemInside
          )
          if (index < 0) {
            this.$message.error('请检查计算公式里的数据列表项是否正确！')
            return
          }
          const regArr = itemInside.split('')
          let regStr = ''
          for(const key in regArr){
            if(/\(|\)|\\|\/|\.|\+|\?|\^|\||\*|\$/.test(regArr[key])){
              regStr = regStr + '\\' + regArr[key]
            }else{
              regStr = regStr + regArr[key]
            }
          }
          enStr = enStr.replace(
            new RegExp(regStr, 'g'),
            this.chooseList[index].FieldEnName
          )
        })
        this.dialogForm.FormulaStrEn = enStr
        if (/[\u4e00-\u9fa5]/g.test(enStr)) {
          this.$message.error(
            '计算公式除了加入的数据列表项外不能输入其他中文！'
          )
          return
        }
        let apiName = STOCKING_API_SETTING_FORMULA_CREATE
        let params = Object.assign(
          {
            OrderType: parseInt(this.currentOrderType),
            KindTypeEk: this.categoryType
          },
          this.dialogForm
        )
        if (this.isEdit) {
          params.FormulaId = this.editFormulaId
          apiName = STOCKING_API_SETTING_FORMULA_UPDATE
        }
        this.$store.commit('SET_BTN_LOADING', true)
        apiName(params).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.dialogVisible = false
            this.getData()
          }
        })
      })
    },
    beforeClose(done) {
      this.dialogForm.FormulaLeftEn = ''
      this.dialogForm.FormulaLeftCn = ''
      this.dialogForm.FormulaStrCn = ''
      this.dialogForm.FormulaStrEn = ''
      this.editFormulaId = 0
      this.searchList = []
      this.chooseList = []
      done()
    },
    del(e, i) {
      e.currentTarget.blur()
      this.$confirm('此操作将永久删除该公式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_SETTING_FORMULA_DELETE({
          FormulaId: i
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getData()
          }
          this.dialogVisible = false
        })
      })
    }
  },
  filters: {
    calculationMethod(value) {
      // 重新计算数据格式
      value.map((text, index) => {
        text.RowIndex = index
        text.rank = ['to-first', 'to-prev', 'to-next', 'to-last']
      })
      if (value.length) {
        value[0].rank = ['to-next', 'to-last']
        if (value.length > 1) {
          value[value.length - 1].rank = ['to-first', 'to-prev']
        }
      }
      return value
    }
  },
  beforeMount() {
    // FIXME: 下期删除 @start--
    let tmpArr = SettingCustomizedFieldOrderType.TypeArray.filter(
      item =>
        item.KeyId !==
          SettingCustomizedFieldOrderType.StockingCloudStuffPurchaseOrderBasic &&
        item.KeyId !==
          SettingCustomizedFieldOrderType.StockingCloudHalfIntakeOrderBasic &&
        item.KeyId !==
          SettingCustomizedFieldOrderType.StockingCloudStuffIntakeOrderBasic
    )
    SettingCustomizedFieldOrderType.TypeArray = tmpArr
    this.orderType = SettingCustomizedFieldOrderType
    // 下期删除 @end--
    if (
      this.$store.getters.user_session.CharacterType === this.characterType.Store
    ) {
      this.orderType.TypeArray = SettingCustomizedFieldOrderType.TypeArray.filter(
        item =>
          item.KeyId ===
            SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic ||
          item.KeyId ===
            SettingCustomizedFieldOrderType.StockingCloudJunkChangeOrderBasic
      )
    }
    this.radioList = this.largeType.TypeArray.filter(
      item =>
        item.KeyId === this.largeType.Order ||
        item.KeyId === this.largeType.Goods
    )
  },
  mounted() {
    this.getCategoryList().then(() => {
      this.init()
    })
  },
  watch: {
    $route: 'init'
  }
}
</script>
<style lang="scss" scoped>
// new
/deep/ .el-button--primary.is-disabled {
  border: none !important;
}
.subject-title {
  background-color: #f2f2f2;
  border-bottom: 1px solid #ddd;
}
.subject,
.subject-title {
  width: 100%;
  height: 36px;
  color: #606266;
  font-size: 12px;
  line-height: 36px;
  text-align: center;
  border-color: #ddd;
}
.subject {
  font-size: 12px;
  cursor: Pointer;
}
.active-subject {
  background-color: #399fe5;
  color: #fff;
}
.panel .subject-panel {
  padding: 0;
}
.main-show {
  > .list {
    width: 180px;
  }
  > .main {
    width: 100%;
    padding: 0;
    .clearfix > em {
      line-height: 28px;
    }
  }
  > .main-r {
    width: calc(100% - 180px);
    padding-left: 20px;
  }
}
.rank-btn-group {
  .rank-btn.to-first {
    background-image: url(~@/assets/images/to-first.png);
  }
  .rank-btn.to-prev {
    background-image: url(~@/assets/images/to-prev.png);
  }
  .rank-btn.to-next {
    background-image: url(~@/assets/images/to-next.png);
  }
  .rank-btn.to-last {
    background-image: url(~@/assets/images/to-last.png);
  }
  .rank-btn {
    display: inline-block;
    margin: 0 5px;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-position: 50%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
.create-dialog {
  display: flex;
  width: 100%;
  padding: 10px;
  .left {
    width: 200px;
    border-top: 1px solid #e5e5e5;
    margin-right: 10px;
    & > div {
      height: 32px;
      line-height: 26px;
      border: 1px solid #e5e5e5;
      border-top: none;
    }
    .search {
      padding: 4px;
      height: 34px;
      /deep/ .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
      /deep/ .el-input {
        height: 24px;
      }
    }
    .staff-wrap {
      width: 100%;
      height: 285px;
      overflow: auto;
      .staff {
        width: 100%;
        padding-left: 10px;
        overflow: hidden;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.active {
          background-color: #399fe5;
          color: #fff;
        }
      }
    }
    .title {
      background-color: #f5f5f5;
      color: #777;
      font-weight: 600;
    }
  }
  .right {
    width: calc(100% - 210px);
  }
}
</style>

