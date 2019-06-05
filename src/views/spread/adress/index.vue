<template>
  <div class="content">
    <!-- 搜索条件 -->
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnCreate" type="primary" @click="createDialog = true" style="width:130px;">添加地址</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="Name" v-model="queryForm.Name" placeholder="请输入门店名称" @keyup.enter.native="onSearch">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="门店名称：">
            <el-input name="Name" v-model="queryForm.Name" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="区域：">
            <el-cascader name="Areas" :options="$store.getters.areas" v-model="queryForm.Areas" ref="cascader" placeholder="所有地区" change-on-select @change="citiChange"></el-cascader>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- END 搜索条件 -->
    <!-- Data Table -->
    <el-table :data="dataList" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column prop="AddressId" label="NO." sortable="custom" width="100" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="Name" label="门店名称" width="180" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="Phone" label="电话" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Contact" label="联系人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Mobile" label="手机" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Address" label="地址" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ProvinceName + '/' + scope.row.CityName +'/'+ scope.row.TownName + '/' + scope.row.Address}}</template>
      </el-table-column>
      <!-- <el-table-column prop="CreateTime" label="创建时间"  min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人"  min-width="80" show-overflow-tooltip></el-table-column>-->
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button name="btnEditAddress" type="text" @click="editAddress(scope.row)">编辑</el-button>
          <el-button name="btnDelete" type="text" :key="scope.row.AddressId" @click="deleteAddress(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
    <!-- 新建地址 -->
    <addressCreate v-if="createDialog" :createDialog="createDialog" @closeDialog="listenCreateDialog"></addressCreate>
    <!-- end 新建地址 -->
    <!-- 编辑地址 -->
    <addressEdit v-if="editDialog" :AddressId="AddressId" :editDialog="editDialog" @closeDialog="listenEditDialog"></addressEdit>
    <!-- end 编辑地址 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import addressCreate from './adressCreate'
import addressEdit from './adressEdit'
import searchPanel from '@/components/searchPanel.vue'
import {
  SPREAD_API_SPR_SEARCHADDRS,
  SPREAD_API_SPR_ADDRDELETE
} from '@/apis/spread.js'
import { YNStatus } from '@/enums/common'
export default {
  data() {
    return {
      areas: [],
      queryForm: {
        Areas: [],
        Name: '', // String: '', // 门店名称
        ProvinceId: '', // Int32: '', // 省份序号
        CityId: '', // Int32: '', // 城市序号
        TownId: '', // Int32: '', // 区/镇序号
        OrderBy: '2', // Int32: '', // 排序字段(0 = 创建时间
        IsAsc: YNStatus.No, // Int32: '', // 是否升序(枚举)
        PageIndex: 1, // Int32: '', // 当前页码
        PageSize: 20 // Int32: '', // 每页?条
      },
      parameters: {},
      dataList: [],
      total: 0,
      AddressId: '',
      createDialog: false,
      editDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          Areas: [],
          Name: '', // String 门店名称
          ProvinceId: '', // Int32 省份序号
          CityId: '', // Int32: 城市序号
          TownId: '', // Int32 区/镇序号
          OrderBy: 2, // Int32 排序字段(0 = 创建时间
          IsAsc: YNStatus.No, // Int32 是否升序(枚举)
          PageIndex: 1, // Int32 当前页码
          PageSize: 20 // Int32 每页?条
        },
        query
      )
      this.getData()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = Object.assign({}, this.queryForm)
      this.initRoute()
    },
    onReset() {
      this.queryForm = {
        Areas: [],
        Name: '', // String 门店名称
        ProvinceId: '', // Int32 省份序号
        CityId: '', // Int32: 城市序号
        TownId: '', // Int32 区/镇序号
        OrderBy: 2, // Int32 排序字段(0 = 创建时间
        IsAsc: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32 当前页码
        PageSize: 20 // Int32 每页?条
      }
      this.parameters = {}
      this.onSearch()
    },
    sortChange(sort) {
      // (0= 编号，1=开店时间,2=门店编码)
      switch (sort.prop) {
        case 'AddressId':
          this.queryForm.OrderBy = 2
          break
        default:
          break
      }
      if (!sort.order) {
        this.queryForm.IsAsc = YNStatus.No
      } else {
        this.queryForm.IsAsc =
          sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      }
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let params = {
        Name: this.queryForm.Name, // String  门店名称
        ProvinceId: this.queryForm.ProvinceId || 0, // Int32  省份序号
        CityId: this.queryForm.CityId || 0, // Int32  城市序号
        TownId: this.queryForm.TownId || 0, // Int32  区/镇序号
        OrderBy: this.queryForm.OrderBy, // Int32  排序字段(0 = 创建时间
        IsAsc: this.queryForm.IsAsc, // Int32  是否升序(枚举)
        PageIndex: this.queryForm.PageIndex, // Int32  当前页码
        PageSize: this.queryForm.PageSize // Int32  每页?条
      }
      SPREAD_API_SPR_SEARCHADDRS(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dataList = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    citiChange(e) {
      this.queryForm.ProvinceId = parseInt(e[0])
      this.queryForm.CityId = parseInt(e[1])
      this.queryForm.TownId = parseInt(e[2])
    },
    toCreateAddress() {
      this.createDialog = true
    },
    editAddress(row) {
      this.editDialog = true
      this.AddressId = row.AddressId
    },
    listenEditDialog(success) {
      if (success) {
        this.getData()
      }
      this.editDialog = false
    },
    listenCreateDialog(success) {
      if (success) {
        this.getData()
      }
      this.createDialog = false
    },
    deleteAddress(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          SPREAD_API_SPR_ADDRDELETE(
            row.AddressId
          )
            .then(res => {
              this.$store.commit('SET_FULL_LOADING', false)
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.queryForm.PageIndex = 1
                this.getData()
              } else {
                this.$message.error(res.data.Message)
              }
            })
            .catch(() => {
              this.$store.commit('SET_FULL_LOADING', false)
            })
        })
        .catch(() => {})
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    addressCreate,
    addressEdit,
    searchPanel
  }
}
</script>
<style lang="scss">
</style>
