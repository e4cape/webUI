<template>
  <div class="content">
    <!-- @module 筛选条件 -->
    <el-form :model="searchForm" lable-width="120px" class="item-lh-26" :inline="true" ref="search">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnAddNew" type="primary" @click="addNewShow = true">新建礼品</el-button>
          <el-dropdown name="btnCommand" trigger="hover" @command="commandBatch">
            <el-button>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="on">批量上架</el-dropdown-item>
              <el-dropdown-item command="off">批量下架</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-dropdown name="btnSearchState" @command="(v) => searchStateChange(v,'onlineStatus')">
              <el-button  type="default" style="width: 100px">
                {{activeState}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="''">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="item in onlineType.Types" :key="item.key" :command="item.key">{{item.title}}</el-dropdown-item>
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
            <el-cascader name="categoryId" :options="[allCategory, ...categoryList]" v-model="searchForm.categoryId" :props="{value:'categoryId',label:'categoryName',children:'items'}" change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select name="status" filterable v-model="searchForm.status" placeholder="状态">
              <el-option label="所有状态" :value="''"></el-option>
              <el-option v-for="item in giftStatusType.Types" :key="item.key" :label="item.title" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货号/条码：" prop="barCode">
            <el-input name="barCode" v-model="searchForm.barCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="货号/条码"></el-input>
          </el-form-item>
          <el-form-item label="礼品名称：" prop="giftName">
            <el-input name="giftName" v-model="searchForm.giftName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="礼品名称"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker name="createTime"  type="daterange" v-model="searchForm.createTime" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="lastTime">
            <el-date-picker name="lastTime"  type="daterange" v-model="searchForm.lastTime" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- End 筛选条件 -->
    <!-- @module 数据表格 -->
    <el-table :data="dataList" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @selection-change="selectionChange" @sort-change="sortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="giftName" label="礼品名称" min-width="280" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="gift-info-cell">
            <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl" alt="" class="m-r-5">
            <div v-text="scope.row.giftName"></div>
            <div v-text="scope.row.barCode"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryPathText" label="分类" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="retailPrice" label="零售价格" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
         <span v-text="scope.row.retailPrice"></span>
        </template>
      </el-table-column>
      <el-table-column prop="exchange" label="兑换方式" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <p v-if="scope.row.score">积分：<span v-text="scope.row.score"></span></p>
          <p v-if="scope.row.goldenRice">礼金：<span v-text="scope.row.goldenRice"></span></p>
        </template>
      </el-table-column>
      <el-table-column prop="orderQty" label="销量" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="lastTime" label="最后操作时间" width="150" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.lastTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="onlineStatusText" label="状态" width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.checkNote" placement="top" effect="light" v-if="scope.row.checkNote && (scope.row.status == giftStatusType.Returned || scope.row.status == giftStatusType.Invalid)">
            <span :class="{'red': scope.row.checkNote}">{{scope.row.statusText}}</span>
          </el-tooltip>
          <p v-text="scope.row.statusText" v-else></p>
          <p v-text="scope.row.onlineStatusText"></p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="170">
        <template slot-scope="scope">
          <el-button name="btnGiftDetail" type="text" @click="giftDetail(scope.row.giftId)">
            查看
          </el-button>
          <el-button name="btnGiftUp" type="text" @click="giftOnShelves(scope.row.storeGiftId)" v-if="scope.row.status == giftStatusType.Pass && (scope.row.onlineStatus == onlineType.OffShelves || scope.row.onlineStatus+'' === onlineType.WaitShelves)">
            上架
          </el-button>
          <el-button name="btnGiftDown" type="text" @click="giftOffShelvesOrDelete([scope.row.storeGiftId],1)" v-if="scope.row.status == giftStatusType.Pass && scope.row.onlineStatus == onlineType.OnShelves">
            下架
          </el-button>
          <el-button name="btnGiftEdit" type="text" @click="$router.push({path:'/gift/giftManage/selfGiftEdit',query:{storeGiftId:scope.row.storeGiftId}})" v-if="scope.row.status == giftStatusType.Returned || scope.row.status == giftStatusType.Pending || scope.row.status == giftStatusType.Draft">
            编辑
          </el-button>
          <el-button name="btnGiftAudit" type="text" @click="giftCheck(scope.row.storeGiftId)" v-if="scope.row.status == giftStatusType.Pending">
            审核
          </el-button>
          <el-button name="btnGiftUnAudit" type="text" @click="giftPassCancel(scope.row.storeGiftId)" v-if="scope.row.status == giftStatusType.Pass && (scope.row.onlineStatus == onlineType.WaitShelves || scope.row.onlineStatus == onlineType.OffShelves)">
            取消审核
          </el-button>
          <el-button  name="btnGiftNuffily" type="text" @click="giftDelete(scope.row.storeGiftId)" v-if="scope.row.status == giftStatusType.Draft">
            作废
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
    <!-- @ 上架 -->
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
                <el-checkbox v-model="onShelvesChooseScroe">积分</el-checkbox>
                <el-input name="score" v-model="onShelvesInfo.score" @keyup.native="onShelvesInfo.score = $root.toFixed(onShelvesInfo.score, 0)" :maxlength="9" :disabled="!onShelvesChooseScroe" style="width: 80px!important;"></el-input>
              </div>
              <div>
                <el-checkbox v-model="onShelvesChooseGoldenRice">礼金</el-checkbox>
                <el-input name="goldenRice" v-model="onShelvesInfo.goldenRice" @keyup.native="onShelvesInfo.goldenRice = $root.toFixed(onShelvesInfo.goldenRice, 0)" :maxlength="9" :disabled="!onShelvesChooseGoldenRice" style="width: 80px!important;"></el-input>
              </div>
              <p>1-999999999的整数，如果选择两种，用户可以使用任意一种方式兑换</p>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnGiftConfirm" type="primary" @click="giftOnShelvesConfirm">确 定</el-button>
        <el-button name="btnGiftCancel" @click="onShelvesShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 上架 -->
    <!-- @ 新建礼品选择分类-->
    <el-dialog title="新建礼品" :visible.sync="addNewShow" width="750px" :before-close="addNewCancel">
      <cascader-list :data="categoryList" @confirm="confirmAddNew" @cancel="addNewShow = false" ref="cascaderList"></cascader-list>
    </el-dialog>
    <!-- End 新建礼品选择分类 -->
    <!-- @ 审核-->
    <el-dialog title="审核" :visible.sync="checkInfoShow" width="750px">
      <div class="onShelves-dialog" v-loading="dialogLoading" element-loading-text="拼命加载中">
        <div>
          <img :src="$root.settings.DOMAIN_IMAGE + checkInfo.imageUrl" alt="">
        </div>
        <div>
          <h4 v-text="checkInfo.giftName"></h4>
          <p v-text="checkInfo.mktTitle"></p>
          <div class="price">
            <div>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}} <span v-text="checkInfo.wholesalePrice"></span></div>
            <div>建议零售价： <span v-text="checkInfo.retailPrice"></span></div>
            <div>积分： <span v-text="checkInfo.score"></span></div>
            <div>礼金： <span v-text="checkInfo.goldenRice"></span></div>
          </div>
          <div>
            <span style="line-height:33px">审核结果：</span>
            <el-radio-group name="checkStatus" v-model="checkStatus" style="padding-top:2px;line-hegiht:33px">
              <el-radio :label="giftStatusType.Pass">审核通过</el-radio>
              <el-radio :label="giftStatusType.Returned">审核退回
                <el-input v-model="checkMessage" placeholder="退回原因备注" style="width:190px" class="m-l-10" maxlength="50" v-if="checkStatus === giftStatusType.Returned"></el-input>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnGiftConfirm" type="primary" @click="giftCheckConfirm">确 定</el-button>
        <el-button name="btnGiftCancel" @click="checkInfoShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 审核 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import cascaderList from '@/components/gifting/cascaderList.vue'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  GiftStatus, OnlineStatus, GiftTypes 
} from '@/enums/gifting.js'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_GIFT_SEARCH,
  GIFTING_API_GIFT_OFFSHELFOPERATIONBYAGENT,
  GIFTING_API_GIFT_BATCHOPERATIONBYAGENT,
  GIFTING_API_GIFT_GETONSHELFBYAGENT,
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_GIFT_GETAUDITDETAILBYSTORE,
  GIFTING_API_GIFT_SAVEAUDIT,
  GIFTING_API_GIFT_CANCELAUDIT,
  GIFTING_API_GIFT_NULLIFYBYSTORE,
  GIFTING_API_GIFT_BATCHOPERATIONBYSTORE
} from '@/apis/gifting'
import { YNStatus } from '@/enums/common'
export default {
  data() {
    return {
      giftType: GiftTypes,
      onlineType: OnlineStatus,
      giftStatusType: GiftStatus,
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
        createTime: [],
        lastTime: [],
        barCode: '',
        status: '',
        giftName: '',
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
      onShelvesShow: false,
      onShelvesInfo: {
        score: '',
        goldenRice: ''
      },
      onShelvesChooseScroe: false,
      onShelvesChooseGoldenRice: false,
      selectedItems: [],
      total: 0,
      addNewShow: false,
      checkInfoShow: false,
      checkInfo: {
      },
      checkStatus: '2',
      checkStoreGiftId: '',
      checkMessage: ''
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/giftManage/selfGiftManage',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query || {
      }
      this.parameter.onlineStatus = query.onlineStatus || ''
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
      this.parameter.categoryId = query.categoryId
      this.parameter.status = query.status || ''
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
    initGiftStatusType() {
      let typesArr = OnlineStatus.Types.filter(
        v =>
          !(
            v.key === OnlineStatus.SupplierOffShelves ||
            v.key === OnlineStatus.StationOffShelves
          )
      )
      this.onlineType = Object.assign({
      }, OnlineStatus, {
        Types: typesArr 
      })
    },
    getData() {
      let parameter = Object.assign({
      }, this.searchForm, this.parameter, {
        giftType: this.giftType.Self,
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
        if (res.data.Code === 'CORRECT') {
          this.dataList = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
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
      this.searchForm.pageIndex = '1'
      this.parameter = Object.assign({
      }, this.searchForm)
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
      this.parameter[k] = v
      this.initRoute()
    },
    confirmAddNew(v) {
      this.$router.push({
        path: '/gift/giftManage/addNewGift',
        query: {
          categoryId: v 
        }
      })
    },
    addNewCancel() {
      this.$refs['cascaderList'].cancel()
    },
    commandBatch(command) {
      if (!this.selectedItems.length) {
        this.$message.error('请先选择，再操作！')
        return
      }
      if (
        this.selectedItems.some(v => v.status + '' !== this.giftStatusType.Pass)
      ) {
        this.$message.error('所选项的状态需均为"审核通过"才能做批量操作')
        return
      }
      let params = this.selectedItems.filter(v => v.onlineStatus !== null)
      if (params.length === 0) {
        this.$message.error('"审核通过"状态的项需有上架状态才能做批量操作')
        return
      }
      let type = 0
      if (command === 'on') {
        params = params.filter(
          v => v.onlineStatus + '' !== this.onlineType.OnShelves
        )
        if (params.length === 0) {
          this.$message.error('所选项均为已上架状态，无法批量上架！')
          return
        }
        params = params.map(v => v.storeGiftId)
        GIFTING_API_GIFT_BATCHOPERATIONBYSTORE({
          storeGiftIds: params,
          operationType: 0
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('操作成功')
            this.onSearch()
          }
        })
      }
      if (command === 'off') {
        // if (this.selectedItems.some(v => v.onlineStatus === 0)) {
        //   this.$message.error('所选项中有"未上架"状态，无法批量下架！')
        //   return
        // }
        type = 1
        params = this.selectedItems.filter(
          v => v.onlineStatus + '' === this.onlineType.OnShelves
        )
        if (params.length !== this.selectedItems.length) {
          this.$message.error('所选项中有无法下架的状态，无法批量下架！')
          return
        }
        params = params.map(v => v.storeGiftId)
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
      this.detailInfo = {
      }
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
          this.onSearch()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    giftOffShelvesOrDelete(ids, type) {
      const typeObj = {
        1: '下架', 2: '作废' 
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
              this.onSearch()
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
            message: '已取消下架'
          })
        })
    },
    giftCheck(storeId) {
      GIFTING_API_GIFT_GETAUDITDETAILBYSTORE(storeId).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.checkInfo = res.data.Data
          this.checkInfoShow = true
          this.checkStatus = this.giftStatusType.Pass
          this.checkStoreGiftId = storeId
          this.checkMessage = ''
        } else {
          this.$message.error(res.data.Message)
          return
        }
      })
    },
    giftCheckConfirm() {
      let checkNote =
        this.checkStatus === this.giftStatusType.Pass ? '' : this.checkMessage
      GIFTING_API_GIFT_SAVEAUDIT(
        Object.assign({
        }, this.checkInfo, {
          status: this.checkStatus,
          checkNote,
          storeGiftId: this.checkStoreGiftId
        })
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功')
          this.checkInfoShow = false
          this.onSearch()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    giftPassCancel(id) {
      this.$confirm('确定取消审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          GIFTING_API_GIFT_CANCELAUDIT(id).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('操作成功')
              this.onSearch()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    giftDelete(id) {
      this.$confirm('确定作废操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          GIFTING_API_GIFT_NULLIFYBYSTORE(id).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('操作成功')
              this.onSearch()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
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
    this.initGiftStatusType()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel,
    cascaderList,
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
