<template>
  <div class="content">
    <!-- @module 筛选条件 -->
    <el-form :model="searchForm" lable-width="120px" class="item-lh-26" :inline="true" ref="search">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnLinkCloud" type="primary" @click="$router.push('/gift/giftManage/chooseFromCloud')">从礼品库选择</el-button>
          <el-button name="btnLinkManage" @click="$router.push('/gift/giftManage/selfGiftManage')">自营礼品管理</el-button>
          <el-dropdown name="btnCommand" trigger="hover" @command="commandBatch">
            <el-button>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="on">批量上架</el-dropdown-item>
              <el-dropdown-item command="off">批量下架</el-dropdown-item>
              <el-dropdown-item command="delete">批量移除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-dropdown name="btnSearchState" @command="(v) => searchStateChange(v,'onlineStatus')">
              <el-button type="default">
                {{activeState}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="''">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="(item,index) in onlineType.Types" :key="index" :command="item.key">{{item.title}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input name="giftName" v-model="searchForm.giftName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="礼品名称">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="分类：" prop="categoryId">
            <el-cascader  name="categoryId" :options="[allCategory, ...categoryList]" v-model="searchForm.categoryId" :props="{value:'categoryId',label:'categoryName',children:'items'}" change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="货号/条码：" prop="barCode">
            <el-input name="barCode" v-model="searchForm.barCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="货号/条码"></el-input>
          </el-form-item>
          <el-form-item label="礼品名称：" prop="giftName">
            <el-input name="giftName" v-model="searchForm.giftName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="礼品名称"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker name="createTime"  type="daterange" v-model="searchForm.createTime" :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="lastTime">
            <el-date-picker name="lastTime" type="daterange" v-model="searchForm.lastTime" :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- End 筛选条件 -->
    <!-- @module 数据表格 -->
    <el-table :data="dataList" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @selection-change="selectionChange" @sort-change="sortChange">
      <el-table-column type="selection" width="55" fixed></el-table-column>
      <el-table-column prop="giftName" label="礼品名称" min-width="280" fixed show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="gift-info-cell">
            <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl" alt="" class="m-r-5">
            <div v-text="scope.row.giftName"></div>
            <div v-text="scope.row.barCode"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryPathText" label="分类" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="价格" width="210" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span>{{scope.row.wholesalePrice || '-'}}</span></p>
          <p>建议零售价：<span>{{scope.row.retailPrice || '-'}}</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="exchange" label="兑换方式" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <p v-if="scope.row.score">积分：<span v-text="scope.row.score"></span></p>
          <p v-if="scope.row.goldenRice">礼金：<span v-text="scope.row.goldenRice"></span></p>
        </template>
      </el-table-column>
      <el-table-column prop="orderQty" label="销量" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="lastTime" label="最后操作时间" width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.lastTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="onlineStatusText" label="状态" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button name="btnCheck" type="text" @click="giftDetail(scope.row.giftId)">
            查看
          </el-button>
          <el-button name="btnUp" type="text" v-if="scope.row.onlineStatus + '' === onlineType.WaitShelves || scope.row.onlineStatus + '' === onlineType.OffShelves" @click="giftOnShelves(scope.row.storeGiftId)">
            上架
          </el-button>
          <el-button name="btnDown" type="text" v-if="scope.row.onlineStatus + '' === onlineType.OnShelves" @click="giftOffShelvesOrDelete([scope.row.storeGiftId],1)">
            下架
          </el-button>
          <el-button name="btnEdit" type="text" v-if="scope.row.onlineStatus + '' != onlineType.SupplierOffShelves && scope.row.onlineStatus + '' != onlineType.StationOffShelves" @click="$router.push({path:'/gift/giftManage/giftEdit',query:{storeGiftId:scope.row.storeGiftId}})">
            编辑
          </el-button>
          <el-button name="btnDelete" type="text" v-if="scope.row.onlineStatus + '' !== onlineType.OnShelves" @click="giftOffShelvesOrDelete([scope.row.storeGiftId],2)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 数据表格 -->
    <!-- @module 查看礼品 -->
    <el-dialog title="查看礼品" :visible.sync="detailShow" :before-close="detailShowCancel" width="458px" v-loading="dialogLoading" element-loading-text="拼命加载中">
      <show-detail :data="detailInfo" ref="showDetail"></show-detail>
    </el-dialog>
    <!-- @module 查看礼品 -->
    <!-- End 上架 -->
    <el-dialog title="上架" :visible.sync="onShelvesShow" width="750px" @close="giftOnShelvesCancel">
      <div class="onShelves-dialog" v-loading="dialogLoading" element-loading-text="拼命加载中">
        <div>
          <img :src="$root.settings.DOMAIN_IMAGE + onShelvesInfo.imageUrl" alt="">
        </div>
        <div>
          <h4 v-text="onShelvesInfo.giftName"></h4>
          <p v-text="onShelvesInfo.mktTitle"></p>
          <div class="price">
            <div>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}} <span v-text="onShelvesInfo.wholesalePrice"></span></div>
            <div>建议零售价： <span v-text="onShelvesInfo.retailPrice"></span></div>
          </div>
          <div class="exchange">
            <span>兑换方式</span>
            <div>
              <div>
                <el-checkbox name="onShelvesChooseScroe" v-model="onShelvesChooseScroe">积分</el-checkbox>
                <el-input name="score" v-model="onShelvesInfo.score" :maxlength="9" @keyup.native="onShelvesInfo.score = $root.toFixed(onShelvesInfo.score, 0)" :disabled="!onShelvesChooseScroe" style="width: 80px!important;"></el-input>
              </div>
              <div>
                <el-checkbox name="onShelvesChooseGoldenRice" v-model="onShelvesChooseGoldenRice">礼金</el-checkbox>
                <el-input name="goldenRice" v-model="onShelvesInfo.goldenRice" :maxlength="9" @keyup.native="onShelvesInfo.goldenRice = $root.toFixed(onShelvesInfo.goldenRice, 0)" :disabled="!onShelvesChooseGoldenRice" style="width: 80px!important;"></el-input>
              </div>
              <p>1-999999999的整数，如果选择两种，用户可以使用任意一种方式兑换</p>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="giftOnShelvesConfirm">确 定</el-button>
        <el-button name="btnCancel" @click="onShelvesShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 上架 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  OnlineStatus, GiftTypes 
} from '@/enums/gifting.js'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_GIFT_SEARCH,
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_GIFT_GETONSHELFBYAGENT,
  GIFTING_API_GIFT_BATCHOPERATIONBYAGENT,
  GIFTING_API_GIFT_OFFSHELFOPERATIONBYAGENT
} from '@/apis/gifting'
export default {
  data() {
    return {
      characterType: CharacterType,
      onlineType: OnlineStatus,
      giftType: GiftTypes,
      activeState: '所有状态',
      parameter: {
      },
      dataList: [],
      allCategory: {
        categoryId: '',
        categoryName: '所有分类',
        items: ''
      },
      searchForm: {
        onlineStatus: '',
        categoryId: [''],
        barCode: '',
        giftName: '',
        createTime: [],
        lastTime: [],
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      },
      categoryList: [],
      dialogLoading: false,
      detailInfo: {
      },
      detailShow: false,
      activeTab: '1',
      onShelvesShow: false,
      onShelvesInfo: {
        score: '',
        goldenRice: ''
      },
      onShelvesChooseScroe: false,
      onShelvesChooseGoldenRice: false,
      selectedItems: [],
      total: 0
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/giftManage/index',
        query:  this.parameter
      })
    },
    init() {
      let query = this.$route.query || {
      }
      if (!query.categoryId) {
        query.categoryId = ['']
      } else {
        if (query.categoryId instanceof Array) {
          if (query.categoryId[0] === '') {
            query.categoryId = ['']
          } else {
            query.categoryId = query.categoryId.map(v => parseInt(v))
          }
        } else {
          query.categoryId = [].concat(parseInt(query.categoryId))
        }
      }
      // console.log(query)
      this.parameter.categoryId = query.categoryId
      this.parameter.onlineStatus = query.onlineStatus || ''
      this.parameter.barCode = query.barCode || ''
      this.parameter.giftName = query.giftName || ''
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.lastTime = query.lastTime || ['', '']
      this.parameter.orderField = query.orderField || 'createTime'
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.searchForm = Object.assign({
      }, this.parameter)
      this.getData()
      this.activeState = !query.onlineStatus
        ? '所有状态'
        : this.onlineType.Types.filter(
          item => item.key === query.onlineStatus
        )[0].title
    },
    async getCategory() {
      let data = await GIFTING_API_CATEGORY_SEARCH()
      this.categoryList = data.data.Data
    },
    // initGiftStatusType() {
    //   let typesArr = OnlineStatus.Types.filter(
    //     v => v.key !== OnlineStatus.StationOffShelves
    //   )
    //   this.onlineType = Object.assign({}, OnlineStatus, { Types: typesArr })
    // },
    getData() {
      let parameter = Object.assign({
      }, this.searchForm, this.parameter, {
        giftType: this.giftType.Agent,
        createTimeStart: this.parameter.createTime[0],
        createTimeEnd: this.parameter.createTime[1],
        lastTimeStart: this.parameter.lastTime[0],
        lastTimeEnd: this.parameter.lastTime[1]
      })
      parameter.categoryId = !parameter.categoryId[0]
        ? ''
        : this.parameter.categoryId.map(v => parseInt(v))
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_GIFT_SEARCH(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.dataList = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      this.searchForm.pageIndex = 1
      this.searchForm.isSenior = true
      this.parameter = JSON.parse(JSON.stringify(this.searchForm))
      if (
        JSON.stringify(this.$route.query) == JSON.stringify(this.searchForm)
      ) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.createTime = ''
      this.lastTime = ''
      this.onSearch()
    },
    searchStateChange(v, k) {
      this.parameter.pageIndex = 1
      this.parameter[k] = v
      this.initRoute()
    },
    commandBatch(command) {
      if (!this.selectedItems.length) {
        this.$message.error('请先选择，再操作！')
        return
      }
      let type = 0
      if (command === 'on') {
        let params = this.selectedItems.filter(
          v => v.onlineStatus + '' !== this.onlineType.OnShelves
        )
        if (params.length === 0) {
          this.$message.error('所选项均为"已上架"状态，无法批量上架！')
          return
        }
        if (
          this.selectedItems.some(
            v => v.onlineStatus + '' === this.onlineType.SupplierOffShelves || v.onlineStatus + '' === this.onlineType.StationOffShelves || v.onlineStatus + '' === this.onlineType.OnShelves
          )
        ) {
          return this.$message.error('所选项中有无法上架的状态，无法批量上架！')
        }
        params = params.map(v => v.storeGiftId)
        this.$router.push({
          path: '/gift/giftManage/onShelvesBatch',
          query: {
            ids: params 
          }
        })
      }
      if (command === 'off') {
        // if (
        //   this.selectedItems.some(
        //     v => v.onlineStatus + '' === this.onlineType.WaitShelves
        //   )
        // ) {
        //   this.$message.error('所选项中有"未上架"状态，无法批量下架！')
        //   return
        // }
        type = 1
        let params = this.selectedItems.filter(
          v => v.onlineStatus + '' === this.onlineType.OnShelves
        )
        if (params.length !== this.selectedItems.length) {
          this.$message.error('所选项中有无法下架的状态，无法批量下架！')
          return
        }
        params = params.map(v => v.storeGiftId)
        this.giftOffShelvesOrDelete(params, type)
      }
      if (command === 'delete') {
        type = 2
        if (
          this.selectedItems.some(
            v => v.onlineStatus + '' === this.onlineType.OnShelves
          )
        ) {
          this.$message.error('所选项中有"已上架"状态，无法批量移除！')
          return
        }
        let params = this.selectedItems.map(v => v.storeGiftId)
        this.giftOffShelvesOrDelete(params, type)
      }
    },
    giftDetail(v) {
      this.dialogLoading = true
      this.detailShow = true
      GIFTING_API_GIFT_GETDETAILBYSTORE(v).then(res => {
        this.dialogLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailInfo = res.data.Data
        }
      })
    },
    detailShowCancel(done) {
      this.$refs['showDetail'].initActiveTab()
      done()
      this.detailInfo = ''
    },
    giftOnShelves(storeGiftId) {
      this.onShelvesShow = true
      this.dialogLoading = true
      GIFTING_API_GIFT_GETONSHELFBYAGENT([storeGiftId]).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.onShelvesInfo = res.data.Data[0]
          this.dialogLoading = false
          this.$nextTick(() => {
            if (this.onShelvesInfo.scoreType === 3) {
              this.onShelvesChooseScroe = true
              this.onShelvesChooseGoldenRice = true
            } else if (this.onShelvesInfo.scoreType === 1) {
              this.onShelvesChooseScroe = true
            } else if (this.onShelvesInfo.scoreType === 2) {
              this.onShelvesChooseGoldenRice = true
            }
          })
        }
      })
    },
    giftOnShelvesCancel(done) {
      this.onShelvesInfo = {
        score: '',
        goldenRice: ''
      }
      this.onShelvesChooseScroe = false
      this.onShelvesChooseGoldenRice = false
      done && done()
    },
    giftOnShelvesConfirm() {
      let item = {
      }
      item.storeGiftId = this.onShelvesInfo.storeGiftId
      item.goldenRice = this.onShelvesInfo.goldenRice
      item.score = this.onShelvesInfo.score
      item.scoreType = ''
      if (this.onShelvesChooseScroe && this.onShelvesChooseGoldenRice) {
        item.scoreType = 3
        if (!item.goldenRice || !item.score || Number(item.score) < 1 || Number(item.goldenRice) < 1) {
          this.$message.error('积分或礼金不能小于1！')
          return
        }
      } else if (this.onShelvesChooseScroe && !this.onShelvesChooseGoldenRice) {
        item.scoreType = 1
        if (!item.score || Number(item.score) < 1) {
          this.$message.error('积分不能小于1！')
          return
        }
      } else if (!this.onShelvesChooseScroe && this.onShelvesChooseGoldenRice) {
        item.scoreType = 2
        if (!item.goldenRice || Number(item.goldenRice) < 1) {
          this.$message.error('礼金不能小于1！')
          return
        }
      }
      if (!item.scoreType) {
        this.$message.error('兑换方式至少选择一种！')
        return
      }
      let params = {
        items: [item], operationType: 0 
      }
      GIFTING_API_GIFT_BATCHOPERATIONBYAGENT(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('上架成功！')
          this.onShelvesShow = false
          this.getData()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    giftOffShelvesOrDelete(ids, type) {
      const typeObj = {
        1: '下架', 2: '移除' 
      }
      this.$confirm('确认' + typeObj[type] + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          GIFTING_API_GIFT_OFFSHELFOPERATIONBYAGENT({
            storeGiftIds: ids,
            operationType: type
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message({
                type: 'success',
                message: typeObj[type] + '成功!'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + typeObj[type]
          })
        })
    },
    selectionChange(v) {
      this.selectedItems = v
    },
    sortChange(v) {
      this.parameter.orderType = v.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.parameter.orderField = v.prop || ''
      this.initRoute()
    }
  },
  mounted() {
    this.getCategory()
    this.init()
    // this.initGiftStatusType()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel,
    showDetail
  }
}
</script>

<style lang="scss" scoped>
.onShelves-dialog {
  overflow: hidden;
  > div {
    &:first-child {
      float: left;
      > img {
        width: 220px;
        height: 220px;
      }
    }
    &:nth-child(2) {
      padding-left: 230px;
      > h4 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      > p {
        color: #aaa;
        line-height: 18px;
      }
      > .price {
        background-color: #f5f5f5;
        padding: 10px;
        overflow: hidden;
        margin: 10px 0;
        > div {
          float: left;
          width: 50%;
          font-size: 12px;
          > span {
            color: #de2a29;
            font-size: 18px;
          }
        }
      }
      > .exchange {
        overflow: hidden;
        > span {
          float: left;
          width: 60px;
          padding-top: 5px;
        }
        > div {
          padding-left: 70px;
          > div {
            margin-bottom: 10px;
          }
          > p {
            color: #aaa;
            font-size: 12px;
          }
        }
      }
    }
  }
}
.gift-info-cell {
  position: relative;
  padding-left: 60px;
  height: 50px;
  line-height: 25px;
  > img {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 50px;
  }
}
</style>
