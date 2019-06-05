<template>
  <div class="content">
    <!-- @module Panel -->
        <!-- 搜索条件 -->
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox" v-if="powers">
          <el-form-item>
            <el-button name="btnAddGoods" type="primary" @click="$router.push({path: '/spread/goods/goodsCreate'})" style="width:130px;">添加商品</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="ProductName" v-model="queryForm.ProductName" placeholder="请输入关键字" @keyup.enter.native="onSearch">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="关键字：" prop="orderId">
            <el-input name="ProductName" v-model="queryForm.ProductName" placeholder="商品名称" @keyup.enter.native="onSearch" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="商品类型：">
            <el-select name="ProductType" v-model="queryForm.ProductType" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in productType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select name="PrimeType" v-model="queryForm.PrimeType" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in productBasicPrimeType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
      <!-- END 搜索条件 -->
      <!-- Data Table -->
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" key="datalist">
      <el-table-column prop="ProductId" label="商品编码" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StyleNumber" label="货号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Arround" label="商品类型" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{productType.Types[scope.row.ProductType]}}
        </template>
      </el-table-column>
      <el-table-column prop="Arround" label="商品分类" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{productBasicPrimeType.Types[scope.row.PrimeType]}}
        </template>
      </el-table-column>
      <el-table-column prop="LabelPrice" label="原价" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          ￥{{scope.row.LabelPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="SalePrice" label="售价" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          ￥{{scope.row.SalePrice}}
        </template>
      </el-table-column>
      <el-table-column prop="AvailableQty" label="可用库存" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <router-link name="goodsCheck" :to="{path:'/spread/goods/goodsCheck',query:{id:scope.row.ProductId}}" class="btn-link el-button el-button--text">详情</router-link>
          <template v-if="powers">
            <router-link name="goodsEdit" :to="{path:'/spread/goods/goodsEdit',query:{id:scope.row.ProductId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button name="btnDeleteGoods" type="text" @click="deleteGoods(scope.row.ProductId)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import {
  ProductBasicPrimeType, ProductType
} from '@/enums/spread'
import { CompanyBasicWechatSettingType } from '@/enums/membership'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SPREAD_API_SPR_SEARCH, SPREAD_API_SPR_DELETE
} from '@/apis/spread'
export default {
  data () {
    return {
      productBasicPrimeType: ProductBasicPrimeType,
      characterType: CharacterType,
      productType: ProductType,
      total: 0,
      data: [],
      queryForm: {
        ProductName: '',
        PrimeType: '0',
        ProductType: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      powers:  (this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Company && this.$store.getters.user_session.CharacterType == CharacterType.Company) || (this.$store.getters.user_session.CharacterType == CharacterType.Store && this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Store)
    }
  },
  methods: {
    init () {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, {
        ProductName: '',
        PrimeType: '0',
        ProductType: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, query)
      this.getData()
    },
    onReset () {
      this.queryForm = {
        ProductName: '',
        PrimeType: '0',
        OrderBy: 0,
        ProductType: '0',
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.onSearch()
    },
    onSearch () {
      this.queryForm.PageIndex = 1
      this.parameters = Object.assign({
      }, this.queryForm)
      this.initRoute()
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
    getData () {
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      this.queryForm.ProductName = this.queryForm.ProductName.replace(/\s+/g, '')
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPR_SEARCH(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    deleteGoods (id) {
      this.$confirm('删除该活动商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SPREAD_API_SPR_DELETE(id).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters 
      })
    }
  },
  beforeMount () {
    this.init()
  },
  mounted () {},
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel
  }
}
</script>
<style lang="scss">
</style>
