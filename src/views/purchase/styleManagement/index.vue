<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable name="State" v-model="queryForm.State" placeholder="所有状态" @change="onSearch">
              <el-option label="所有状态" value="0"></el-option>
              <el-option
                v-for="(item,index) in styleBasicState.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleName">
            <el-input
              name="StyleName"
              v-model="queryForm.StyleName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="款式名称"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template
          slot="btnBox"
          v-if="$store.getters.user_session.CharacterType === characterType.Company"
        >
          <el-form-item>
            <el-button name="createShop" @click="styleLink" type="primary" icon="fa fa-plus">新建款式</el-button>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有种类：" prop="KindTypeEk">
            <el-select filterable name="KindTypeEk" v-model="queryForm.KindTypeEk" placeholder="所有种类">
              <el-option label="所有种类" value="0"></el-option>
              <el-option
                v-for="(item,index) in kind"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有品类：" prop="CategoryTypeEk">
            <el-select filterable name="CategoryTypeEk" v-model="queryForm.CategoryTypeEk" placeholder="所有品类">
              <el-option label="所有品类" value="0"></el-option>
              <el-option
                v-for="(item, index) in category"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input
              name="StyleCode"
              v-model="queryForm.StyleCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="StyleName" label="款式名称：">
            <el-input
              name="StyleName"
              v-model="queryForm.StyleName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              @change="createDateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="CodeNote" label="供应商款号：" v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-input
              name="CodeNote"
              v-model="queryForm.CodeNote"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="模版来源：" prop="TemplateType">
            <el-select
              filterable
              name="TemplateType"
              v-model="queryForm.TemplateType"
              placeholder="全部"
              @change="onSearch"
            >
              <el-option label="全部" value="0"></el-option>
              <el-option
                v-for="(item, index) in styleBasicTemplateType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新款日期：" prop="UpperTime">
            <el-date-picker
              name="UpperTime"
              v-model="queryForm.UpperTime"
              @change="upperDateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              @change="checkDateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table
      :data="data"
      row-key="RowIndex"
      :expand-row-keys="expandRows"
      @expand-change="expandRow"
      @sort-change="querySort"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column type="expand" fixed v-if="$store.getters.user_session.CharacterType === characterType.Company">
        <template slot-scope="scope">
          <table class="expand-talble" v-if="scope.row.children">
            <thead>
              <tr>
                <th>供应商名称</th>
                <th>供应商款号</th>
                <th>进货方式</th>
                <th>结算方式</th>
                <th>参考进货价/工费</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(child,index) in scope.row.children" :key="index">
                <td>{{child.PartnerName}}</td>
                <td>{{child.LastStyleCode}}</td>
                <td>{{purchaseType.Types[child.PurchaseType]}}</td>
                <td>{{stylePartnerSettleType.Types[child.SettleType]}}</td>
                <td>{{$root.toFloat(child.ReferPrice)}}</td>
                <td>{{child.Note}}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
      <el-table-column label="款式" min-width="140" show-overflow-tooltip fixed>
        <template slot-scope="scope">
          <div class="gift-info-cell" @click="showDetailDialog(scope.row.StyleId)">
            <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl !== ''">
              <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5">
              <div class="fl item-img" slot="reference">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5 butHand">
              </div>
            </el-popover>
            <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
            <div v-text="scope.row.StyleName" class="btn-link el-button--text butHand"></div>
            <div v-text="scope.row.StyleCode" class="btn-link el-button--text butHand"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CategoryTypeEv" label="品类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="模版来源" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{styleBasicTemplateType.Types[scope.row.TemplateType]}}</template>
      </el-table-column>
      <el-table-column
        prop="UpperTime"
        label="新款日期"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.UpperTime | filterDate }}</template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column label="最后操作时间" min-width="150" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <span>{{styleBasicState.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <router-link
            :to="{path:'/purchase/styleManagement/viewStyles',query:{ StyleId:scope.row.StyleId }}"
            class="btn-link el-button el-button--text"
          >查看</router-link> -->
          <el-button name="btnShowDetail" type="text" @click="showDetailDialog(scope.row.StyleId)">查看</el-button>
          <template v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-button name="btnEditDetail" type="text" @click="editStyle(scope.row.StyleId)">编辑</el-button>
            <el-button
              name="btnShelfDetail"
              type="text"
              @click="shelfStyle(scope.row.StyleId)"
              v-if="scope.row.State == styleBasicState.Wait"
            >上架</el-button>
            <el-button
              name="btnoBtainedDetail"
              type="text"
              @click="obtainedStyle(scope.row.StyleId)"
              v-if="scope.row.State == styleBasicState.Done"
            >下架</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- end 货品详情-->
  </el-row>
</template>

<script>
import { CharacterType, YNStatus, PurchaseType } from '@/enums/common.js'
import {
  StyleBasicState,
  StyleBasicTemplateType,
  SettingEnumeratorEnumeratorType,
  StylePartnerSettleType
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_BASIC_GETS,
  STOCKING_API_STYLE_PARTNER_GETS,
  STOCKING_API_STYLE_BASIC_DONE,
  STOCKING_API_STYLE_BASIC_WAIT
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
export default {
  data() {
    return {
      YNStatus,
      stylePartnerSettleType: StylePartnerSettleType, // 结算方式
      purchaseType: PurchaseType, // 进货方式
      characterType: CharacterType,
      styleBasicState: StyleBasicState, // 上架状态
      styleBasicTemplateType: StyleBasicTemplateType, // 模版来源
      kind: [], // 种类下拉
      category: [], // 品类下拉
      queryForm: {
        // 查询表单数据
        State: '0',
        KindTypeEk: '0',
        CategoryTypeEk: '0',
        StyleCode: '',
        StyleName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CodeNote: '',
        TemplateType: '0',
        UpperTime: [],
        UpperTime1: '',
        UpperTime2: '',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      dialogtotal: 0, // total
      expandRows: [],
      parameters: {}
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            State: '0',
            KindTypeEk: '0',
            CategoryTypeEk: '0',
            StyleCode: '',
            StyleName: '',
            CreateTime1: '',
            CreateTime2: '',
            CodeNote: '',
            TemplateType: '0',
            UpperTime1: '',
            UpperTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            IsAsced: this.YNStatus.No,
            OrderBy: 0,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_STYLE_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.data.map((item, i) => {
            item.RowIndex = i
          })
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    styleLink() {
      this.$router.push('/purchase/styleManagement/styleEdit')
    },
    editStyle(id) {
      this.$router.push({
        path: '/purchase/styleManagement/styleEdit',
        query: {
          StyleId: id
        }
      })
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
        }
      })
    },
    // 获取品类
    getCategory() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.CategoryType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.category = res.data.Data.Rows
        }
      })
    },
    createDateChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    upperDateChange(value) {
      if (value) {
        this.queryForm.UpperTime1 = value[0]
        this.queryForm.UpperTime2 = value[1]
      } else {
        this.queryForm.UpperTime1 = ''
        this.queryForm.UpperTime2 = ''
      }
    },
    checkDateChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    expandRow(row) {
      if (this.expandRows.indexOf(row.RowIndex) === -1) {
        this.expandRows = [row.RowIndex]
        if (!row.children) {
          STOCKING_API_STYLE_PARTNER_GETS({
            StyleId: row.StyleId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              row.children = res.data.Data
              this.$set(this.data, row.RowIndex, row)
            }
          })
        }
      } else {
        this.expandRows = []
      }
    },
    showDetailDialog(id) {
      this.$router.push({
        path: '/purchase/styleManagement/viewStyles',
        query: {
          StyleId: id
        }
      })
    },
    // 上架
    shelfStyle(id) {
      this.$confirm('确定上架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_STYLE_BASIC_DONE({
          StyleId: id
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '上架成功!'
            })
            this.onSearch()
          }
        })
      })
    },
    // 下架
    obtainedStyle(id) {
      this.$confirm('确定下架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_STYLE_BASIC_WAIT({
          StyleId: id
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.onSearch()
            this.$message({
              type: 'success',
              message: '下架成功!'
            })
          }
        })
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.UpperTime1 = ''
      this.queryForm.UpperTime2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'UpperTime':
          this.queryForm.OrderBy = 1
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    }
  },
  created() {},
  mounted() {
    this.getCategory()
    this.getKind()
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination
  }
}
</script>

<style lang="scss" scoped>
.expand-talble {
  width: 650px;
  margin: 0 auto;
  line-height: 26px;
  border-collapse: collapse;
  text-align: center;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  th,
  td {
    text-align: center;
  }
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.butHand {
  cursor: pointer;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
