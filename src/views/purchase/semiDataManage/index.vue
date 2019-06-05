<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button
            type="primary"
            v-if="kindTypes.length === 0"
            @click="$message.warning('请行在“系统设置”的“科目设置”中添加种类')"
          >新建</el-button>
          <el-button
            type="primary"
            v-else-if="kindTypes.length === 1"
            @click="createSemiProduct(kindTypes[0].Id)"
          >新建</el-button>
          <el-dropdown name="createSemiProduct" @command="createSemiProduct" v-else>
            <span class="el-dropdown-link">
              <el-button type="primary">
                新建
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in kindTypes"
                :command="item.Id"
                :key="item.Id"
              >{{item.Value}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select
              name="State"
              v-model="queryForm.State"
              placeholder="所有状态"
              @change="onSearch"
              :filterable="true"
            >
              <el-option label="所有状态" :value="''"></el-option>
              <el-option
                v-for="item in enableState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="HalfName">
            <el-input
              name="HalfName"
              v-model="queryForm.HalfName"
              placeholder="半成品名称"
              maxlength="30"
              @keyup.enter.native="onSearch"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="种类：" prop="KindTypeEk">
            <el-select
              name="KindTypeEk"
              v-model="queryForm.KindTypeEk"
              placeholder="所有种类"
              :filterable="true"
            >
              <el-option label="所有种类" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.kindType.TypeArray"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类：" prop="HalfClassDk">
            <el-select
              name="HalfClassDk"
              v-model="queryForm.HalfClassDk"
              placeholder="所有分类"
              :filterable="true"
            >
              <el-option label="所有分类" :value="''"></el-option>
              <el-option
                v-for="item in halfClassify"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType">
            <el-select
              name="GoldType"
              v-model="queryForm.GoldType"
              placeholder="所有成色"
              :filterable="true"
            >
              <el-option label="所有成色" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.goldType.TypeArray"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryType">
            <el-select
              name="CategoryType"
              v-model="queryForm.CategoryType"
              placeholder="所有品类"
              :filterable="true"
            >
              <el-option label="所有品类" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.categoryType.TypeArray"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="半成品名称：" prop="HalfName">
            <el-input
              name="HalfName"
              v-model="queryForm.HalfName"
              maxlength="30"
              @keyup.enter.native="onSearch"
              @blur="queryForm.HalfName = queryForm.HalfName.trim()"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              type="daterange"
              v-model="queryForm.CreateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="LastTime">
            <el-date-picker
              name="LastTime"
              type="daterange"
              v-model="queryForm.LastTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      @sort-change="sortChange"
    >
      <el-table-column prop="HalfName" fixed label="半成品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="HalfClassDv" label="半成品分类" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KindTypeEv" label="种类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
      </el-table-column>
      <el-table-column prop="CategoryType" label="品类" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$store.getters.categoryType.Types[scope.row.CategoryType]}}</template>
      </el-table-column>
      <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column
        prop="LastTime"
        label="最后操作时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.LastTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="State" fixed="right" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.State | findKey(enableState)"
          >{{enableState.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140">
        <template slot-scope="scope">
          <el-button name="btnEdit" type="text" @click="editData(scope.row)">编辑</el-button>
          <el-button
            name="btnDisable"
            type="text"
            @click="disable(scope.row.HalfId)"
            v-if="scope.row.State == enableState.Enable"
          >停用</el-button>
          <el-button
            name="btnEnable"
            type="text"
            @click="enable(scope.row.HalfId)"
            v-if="scope.row.State == enableState.Disable"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- 分页 -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- End 分页 -->
    <!-- 新建/编辑 -->
    <el-dialog
      :title="`${title}半成品(${typeValue})`"
      :visible.sync="formVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="100px" :rules="formRules" ref="form">
        <el-form-item label="半成品名称：" prop="HalfName">
          <el-input
            name="HalfName"
            v-model="form.HalfName"
            maxlength="20"
            @blur="form.HalfName = form.HalfName.trim()"
          ></el-input>20个字以内，不能重复
        </el-form-item>
        <el-form-item label="半成品分类：" prop="HalfClassDk">
          <el-select filterable name="HalfClassDk" v-model="form.HalfClassDk">
            <el-option
              v-for="item in halfClassify"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
          <el-button
            name="btnSemiClassify"
            type="text"
            class="semiClassify"
            @click="semiClassifyVisible = true"
          >
            <i class="icon-set"></i>
          </el-button>
        </el-form-item>
        <el-form-item label="成色：" prop="GoldType">
          <el-select filterable name="GoldType" v-model="form.GoldType">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in goldTypes"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品类：" prop="CategoryType">
          <el-select filterable name="CategoryType" v-model="form.CategoryType">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in categoryTypes"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>、
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" v-model="form.Note" maxlength="100"></el-input>100个字以内
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="handelList('form')">保存</el-button>
        <el-button name="btnClose" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 新建/编辑 -->
    <dict-manage
      v-if="semiClassifyVisible"
      :visible.sync="semiClassifyVisible"
      :dicts="halfClassify"
      :dialogTitle="'半成品分类'"
      :dictType="SettingDictionaryDictType.HalfBasicHalfClass"
      @listenDictSave="getHalfClass"
    ></dict-manage>
  </el-row>
</template>

<script>
import { SettingDictionaryDictType } from '@/enums/stocking'
import { EnableState, YNStatus } from '@/enums/common'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import {
  STOCKING_API_HALF_BASIC_GETS,
  STOCKING_API_HALF_BASIC_CREATE,
  STOCKING_API_HALF_BASIC_ENABLE,
  STOCKING_API_HALF_BASIC_DISABLE,
  STOCKING_API_HALF_BASIC_GET,
  STOCKING_API_HALF_BASIC_UPDATE
} from '@/apis/stocking'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'

export default {
  data() {
    return {
      SettingDictionaryDictType,
      YNStatus,
      enableState: EnableState,
      queryForm: {
        HalfName: '',
        KindTypeEk: '',
        HalfClassDk: '',
        CategoryType: '',
        GoldType: '',
        CreateTime: '',
        LastTime: '',
        State: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      parameter: {},
      form: {
        HalfName: '',
        KindTypeEk: '',
        KindTypeEv: '',
        HalfClassDk: '',
        HalfClassDv: '',
        CategoryType: 0,
        GoldType: 0,
        Note: ''
      },
      title: '新建',
      typeValue: '',
      isEdit: false,
      formVisible: false, // 新建/编辑弹窗
      formRules: {
        HalfName: {
          required: true,
          message: '请填写半成品名称',
          trigger: 'change'
        },
        HalfClassDk: {
          required: true,
          message: '请选择半成品分类',
          trigger: 'change'
        }
      },
      semiClassifyVisible: false, // 半成品分类
      halfClassify: [],
      kindTypes: [],
      goldTypes: [],
      categoryTypes: []
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.State = query.State || ''
      this.parameter.KindTypeEk = query.KindTypeEk || ''
      this.parameter.HalfClassDk = query.HalfClassDk || ''
      this.parameter.CategoryType = query.CategoryType || ''
      this.parameter.GoldType = query.GoldType || ''
      this.parameter.HalfName = query.HalfName || ''
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.LastTime = query.LastTime || []
      this.parameter.OrderBy = query.OrderBy || 0
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        CreateTime1: this.parameter.CreateTime[0],
        CreateTime2: this.parameter.CreateTime[1],
        LastTime1: this.parameter.LastTime[0],
        LastTime2: this.parameter.LastTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_BASIC_GETS(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.data = res.data.Data.Rows || []
        }
      })
    },
    createSemiProduct(command) {
      this.typeValue = `${this.$store.getters.kindType.Types[command]}`
      this.form.KindTypeEk = command * 1
      this.form.KindTypeEv = this.$store.getters.kindType.Types[command]
      this.title = '新建'
      ;(this.isEdit = false), (this.formVisible = true)
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.formVisible = false
    },
    handelList(formName) {
      // 新建
      let api, str
      this.halfClassify.some(item => {
        if (item.Id === this.form.HalfClassDk) {
          this.form.HalfClassDv = item.Value
        }
      })
      api = this.isEdit
        ? STOCKING_API_HALF_BASIC_UPDATE
        : STOCKING_API_HALF_BASIC_CREATE
      str = this.isEdit ? '编辑' : '新建'
      this.$refs[formName].validate(valid => {
        if (valid) {
          api(this.form).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.formVisible = false
              this.$message.success(`${str}成功`)
              this.$refs['form'].resetFields()
              this.getData()
            }
          })
        } else {
          return false
        }
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameter = Object.assign({}, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    sortChange(sort) {
      // 表单排序
      this.queryForm.OrderBy = sort.prop === 'CreateTime' ? 0 : 1
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    editData(row) {
      this.title = '编辑'
      this.typeValue = row.KindTypeEv
      this.formVisible = true
      this.isEdit = true
      STOCKING_API_HALF_BASIC_GET({
        HalfId: row.HalfId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data || []
        }
      })
    },
    disable(id) {
      STOCKING_API_HALF_BASIC_DISABLE({
        HalfId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('停用成功')
          this.getData()
        }
      })
    },
    enable(id) {
      STOCKING_API_HALF_BASIC_ENABLE({
        HalfId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('启用成功')
          this.getData()
        }
      })
    },
    listenDictDialog() {
      this.semiClassifyVisible = false
      this.getHalfClass()
    },
    // 获取半成品分类下拉
    getHalfClass() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfBasicHalfClass,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.halfClassify = res.data.Data.Rows || []
        }
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_KIND_TYPE').then(res => {
        this.kindTypes = res.filter(item => {
          if (item.State === YNStatus.Yes) {
            return item
          }
        })
      })
      this.$store.dispatch('GET_GOLD_TYPE').then(res => {
        this.goldTypes = res.TypeArray.filter(item => {
          if (item.State === YNStatus.Yes) {
            return item
          }
        })
      })
      this.$store.dispatch('GET_CATEGORY_TYPE').then(res => {
        this.categoryTypes = res.TypeArray.filter(item => {
          if (item.State === YNStatus.Yes) {
            return item
          }
        })
      })
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.getHalfClass()
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    dictManage
  },
  watch: {
    $route: 'init'
  }
}
</script>

<style lang="scss" scoped>
.semiClassify {
  font-size: 18px;
  vertical-align: -webkit-baseline-middle;
  padding-top: 2px;
  padding-left: 5px;
}
</style>
