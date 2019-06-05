<template>
  <div class="content">
    <!-- @module 筛选条件 -->
    <el-form :model="searchForm" lable-width="120px" class="item-lh-26" :inline="true" ref="search">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnAddNew" type="primary" @click="addNewShow = true" v-if="$store.getters.user_session.CharacterType == characterType.Supplier">新建</el-button>
          <el-dropdown name="btnCommand" trigger="hover" @command="commandBatch">
            <el-button>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="off">批量下架</el-dropdown-item>
              <el-dropdown-item command="on">批量恢复上架</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="onlineStatus">
            <el-dropdown name="btnSearchState" @command="(v) => searchStateChange(v,'onlineStatus')">
              <el-button type="default" style="width: 100px">
                {{activeState}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="''">所有状态</el-dropdown-item>
                <template v-for="item in onlineType.Types">
                  <el-dropdown-item :key="item.key" :command="item.key">{{item.title}}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input name="giftName" v-model="searchForm.giftName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="礼品名称">
              <el-button name="btnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="分类：" prop="categoryId">
            <el-cascader name="categoryId" :options="[allCategory, ...categoryList]" v-model="searchForm.categoryId" :props="{value:'categoryId',label:'categoryName',children:'items'}" change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select name="status" filterable v-model="searchForm.status" placeholder="请选择">
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
            <el-date-picker name="createTime" type="daterange" v-model="searchForm.createTime" unlink-panels :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="lastTime">
            <el-date-picker name="lastTime" type="daterange" v-model="searchForm.lastTime" unlink-panels :picker-options="$root.datePickerOptions"></el-date-picker>
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
      <el-table-column prop="supplierName" label="供应商" width="180" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="price" label="价格" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span>{{scope.row.wholesalePrice || '-'}}</span></p>
          <p>建议零售价：<span>{{scope.row.retailPrice || '-'}}</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="orderQty" label="销量" width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="lastTime" label="最后操作时间" width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.lastTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="onlineStatusText" label="状态" width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.status  == giftStatusType.Returned">
            <el-tooltip v-if="scope.row.checkNote" class="item" :content="scope.row.checkNote" placement="top" effect="light">
              <span > {{ scope.row.statusText }}</span>
            </el-tooltip>
            <span v-else > {{ scope.row.statusText }}</span>
          </template>
          <p v-else v-text="scope.row.statusText"></p>
          <p v-text="scope.row.onlineStatusText" v-if="$store.getters.user_session.CharacterType != characterType.Supplier || ($store.getters.user_session.CharacterType == characterType.Supplier && scope.row.status == giftStatusType.Pass)"></p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button name="btnGiftDetail" type="text" @click="giftDetailBySupplier(scope.row.giftId,scope.row)">
            {{$store.getters.user_session.CharacterType == characterType.Supplier ? '查看' : '详情'}}
          </el-button>
          <el-button name="btnGiftUp" type="text" v-if="($store.getters.user_session.CharacterType == characterType.Supplier) && scope.row.status == giftStatusType.Pass && (scope.row.onlineStatus == onlineType.WaitShelves || scope.row.onlineStatus == onlineType.OffShelves || scope.row.onlineStatus == onlineType.SupplierOffShelves)" @click="giftOnShelvesOrOffShelves(scope.row.giftId,0)">
            上架
          </el-button>
          <el-button name="btnGiftDown" type="text" v-if="$store.getters.user_session.CharacterType == characterType.Supplier && scope.row.onlineStatus == onlineType.OnShelves" @click="giftOnShelvesOrOffShelves(scope.row.giftId,1)">
            下架
          </el-button>
          <el-button name="btnGiftUpAgain" type="text" v-if="($store.getters.user_session.CharacterType == characterType.Lingcb && scope.row.status == giftStatusType.Pass && scope.row.onlineStatus == onlineType.StationOffShelves)" @click="paltShelves([scope.row.giftId], scope.row.giftId,0)">
            恢复上架
          </el-button>
          <el-button name="btnParentGiftDown" type="text" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb && scope.row.onlineStatus == onlineType.OnShelves" @click="paltShelves([scope.row.giftId], scope.row.giftId,1)">
            平台下架
          </el-button>
          <el-button  name="btnGiftEdit" type="text" v-if="$store.getters.user_session.CharacterType == characterType.Supplier && !(scope.row.onlineStatus == onlineType.SupplierOffShelves || scope.row.status == giftStatusType.Invalid || scope.row.status == giftStatusType.Pending || scope.row.status == giftStatusType.Pass)" @click="$router.push({path:'/gift/supplierGiftManage/editGift',query:{giftId:scope.row.giftId}})">
            编辑
          </el-button>
          <el-button name="btnGiftNullify" type="text" v-if="$store.getters.user_session.CharacterType == characterType.Supplier && (scope.row.status == giftStatusType.Draft || scope.row.status == giftStatusType.Returned)" @click="nullifyBySupplier(scope.row.giftId)">
            作废
          </el-button>
          <el-button name="btnGiftAudit" type="text" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb && scope.row.status == giftStatusType.Pending" @click="approved(scope.row)">
            审核
          </el-button>
          <el-button name="btnGiftCancelAudit" type="text" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb && scope.row.status == giftStatusType.Pass && scope.row.onlineStatus == onlineType.WaitShelves" @click="cellConfirmCancelReview(scope.row.giftId)">
            取消审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 数据表格 -->
    <!-- @module 查看礼品 -->
    <el-dialog title="查看礼品" :visible.sync="detailShow" :before-close="detailShowCancel" width="458px" v-loading="dialogLoading" element-loading-text="拼命加载中">
      <show-detail :data="detailInfo" ref="showDetail"></show-detail>
      <span slot="footer" class="dialog-footer" v-if="detailInfo && $store.getters.user_session.CharacterType == characterType.Lingcb">
        <el-button name="btnCheckParentDown" type="primary" v-if="tmpOnlineStatus == onlineType.OnShelves" @click="paltShelves([detailInfo.giftId],detailInfo.giftId,1,true)">
          平台下架
        </el-button>
        <el-button name="btnCheckParentUpAgain" type="primary" v-if="tmpStatus == giftStatusType.Pass && tmpOnlineStatus == onlineType.StationOffShelves" @click="paltShelves([detailInfo.giftId],detailInfo.giftId,0,true)">
          恢复上架
        </el-button>
        <el-button name="btnCheckAudit" type="primary" v-if="tmpStatus == giftStatusType.Pending" @click="approved(detailInfo)">
          审核
        </el-button>
        <el-button name="btnCheckCancelAudit" type="primary" v-if="tmpStatus == giftStatusType.Pass && tmpOnlineStatus == onlineType.WaitShelves" @click="cellConfirmCancelReview(detailInfo.giftId)">
          取消审核
        </el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="detailInfo && $store.getters.user_session.CharacterType == characterType.Supplier">
        <el-button name="btnChechUp" type="primary" v-if="tmpStatus == giftStatusType.Pass && tmpOnlineStatus == onlineType.SupplierOffShelves" @click="giftOnShelvesOrOffShelves(detailInfo.giftId,0)">
          上架
        </el-button>
        <el-button name="btnChechDown" v-if="tmpOnlineStatus == onlineType.OnShelves" @click="giftOnShelvesOrOffShelves(detailInfo.giftId,1)">
          下架
        </el-button>
      </span>
    </el-dialog>
    <!-- End 查看礼品 -->
    <!-- @ 新建礼品 -->
    <el-dialog title="新建礼品" :visible.sync="addNewShow" width="750px" :before-close="addNewCancel">
      <cascader-list :data="categoryList" @confirm="confirmAddNew" @cancel="addNewShow = false" ref="cascaderList"></cascader-list>
    </el-dialog>
    <!-- End 上架 -->
    <!-- @ 审核-->
    <gift-Review v-if="reviewVisible" :reviewVisible="reviewVisible" :checkInfo="checkInfo" @confirmClick="confirmReview" @closeClick="closeReview"></gift-Review>
    <!-- End 审核 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import cascaderList from '@/components/gifting/cascaderList.vue'
import giftReview from '@/components/gifting/giftReview.vue'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  OnlineStatus, GiftStatus 
} from '@/enums/gifting.js'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_GIFT_SEARCH,
  GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER,
  GIFTING_API_GIFT_ONSHELVESBYSUPPLIER,
  GIFTING_API_GIFT_NULLIFYBYSUPPLIER,
  GIFTING_API_GIFT_CANCELAUDITBYSTATION,
  GIFTING_API_GIFT_ONSHELVESBYSTATION
} from '@/apis/gifting'
export default {
  data() {
    return {
      characterType: CharacterType,
      giftStatusType: '',
      onlineType: '',
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
        status: '',
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
      tmpStatus: '',
      tmpOnlineStatus: '',
      detailShow: false,
      activeTab: '1',
      onShelvesInfo: {
        score: '',
        goldenRice: ''
      },
      onShelvesChooseScroe: false,
      onShelvesChooseGoldenRice: false,
      selectedItems: [],
      total: 0,
      addNewShow: false,
      reviewVisible: false, // 礼品审核弹窗
      checkInfo: {
      }, // 操作用户的信息
      giftTable: [], // 查看礼品规格描述
      auditGiftId: ''
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/supplierGiftManage/index',
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
      this.parameter.barCode = query.barCode || ''
      this.parameter.status = query.status || ''
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
    initOnlineStatus() {
      if (
        this.$store.getters.user_session.CharacterType ==
        this.characterType.Lingcb
      ) {
        let typesArr = OnlineStatus.Types.filter(
          v =>
            !(
              v.key === OnlineStatus.OffShelves
            )
        )
        this.onlineType = Object.assign({
        }, OnlineStatus, {
          Types: typesArr 
        })
        return
      }
      if (
        this.$store.getters.user_session.CharacterType ==
        this.characterType.Supplier
      ) {
        // 暂时关闭 平台下架
        let typesArr = []
        OnlineStatus.Types.forEach(v =>{
          if(v.key !== OnlineStatus.OffShelves){
            if(v.key === OnlineStatus.SupplierOffShelves){
              v.title = '已下架'
            }
            typesArr.push(v)
          }
        })
        this.onlineType = Object.assign({
        }, OnlineStatus, {
          Types: typesArr 
        })
        return
      }
      this.onlineType = OnlineStatus
    },
    initGiftStatusType() {
      if (
        this.$store.getters.user_session.CharacterType ==
        this.characterType.Lingcb
      ) {
        let typesArr = GiftStatus.Types.filter(
          v => !(v.key === GiftStatus.Draft || v.key === GiftStatus.Invalid)
        )
        this.giftStatusType = Object.assign({
        }, GiftStatus, {
          Types: typesArr 
        })
        return
      }
      this.giftStatusType = GiftStatus
    },
    confirmReview(val) {
      this.reviewVisible = val
      this.getDetail(this.auditGiftId)
      this.getData()

    },
    closeReview(val) {
      this.reviewVisible = val
    },
    getData() {
      let parameter = Object.assign({
      }, this.searchForm, this.parameter, {
        giftType: 1,
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
      // this.activeState = ''
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    searchStateChange(v, k) {
      this.parameter.pageIndex = 1
      this.parameter[k] = v
      this.initRoute()
    },
    confirmAddNew(v) {
      this.$router.push({
        path: '/gift/supplierGiftManage/addNewGift',
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
        this.selectedItems.some(v => v.status != this.giftStatusType.Pass)
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
        let params = this.selectedItems.filter(
          v => v.onlineStatus != this.onlineType.OnShelves
        )
        if (params.length === 0) {
          this.$message.error('所选项均为已上架状态，无法批量上架！')
          return
        }
      }
      if (command === 'off') {
        type = 1
        let params = this.selectedItems.filter(
          v => v.onlineStatus != this.onlineType.OffShelves
        )
        if (params.length === 0) {
          this.$message.error('所选项均为已下架状态，无法批量下架！')
          return
        }
      }
      params = params.map(v => v.giftId)
      if (this.$store.getters.user_session.CharacterType == this.characterType.Lingcb) {
        this.paltShelves(params,0, type, false)
      } else {
        this.giftOnShelvesOrOffShelves(params, type)
      }
    },
    giftDetailBySupplier(v, row) {
      this.dialogLoading = true
      this.detailShow = true
      this.tmpStatus = row.status
      this.tmpOnlineStatus = row.onlineStatus
      GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER(v).then(res => {
        this.dialogLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailInfo = res.data.Data
          const arr = []
          res.data.Data.giftParams.forEach(item => {
            const tabArr = [
              {
                title: item.name,
                content: item.val
              }
            ]
            arr.push(tabArr)
          })
          this.giftTable = arr
        }
      })
    },
    getDetail (id) {
      GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER(id).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tmpStatus = res.data.Data.status
          this.tmpOnlineStatus = res.data.Data.onlineStatus
        }
      })
    },
    detailShowCancel(done) {
      done()
      this.activeTab = '1'
      this.detailInfo = {
      }
    },
    paltShelves(giftIds, giftId, operationType, flag) {
      this.$confirm(`确认${operationType ? '下架' : '上架'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          GIFTING_API_GIFT_ONSHELVESBYSTATION({
            giftIds, operationType 
          }).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('操作成功')
                this.getData()
                if (flag) {
                  this.getDetail(giftId)
                }
              } else {
                this.$message.error(res.data.Message)
              }
            }
          )
        })
        .catch(() => {})
    },
    giftOnShelvesOrOffShelves(giftId, operationType) {
      this.$confirm(`确认${operationType ? '下架' : '上架'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let giftIds = []
          if (giftId instanceof Array) {
            giftIds = giftId
          } else {
            giftIds.push(giftId)
          }
          GIFTING_API_GIFT_ONSHELVESBYSUPPLIER({
            giftIds, operationType 
          }).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('操作成功')
                this.getData()
                if (!(giftId instanceof Array)) {
                  this.getDetail(giftId)
                }
              } else {
                this.$message.error(res.data.Message)
              }
            }
          )
        })
        .catch(() => {})
    },
    approved(giftInfo) {
      this.checkInfo = giftInfo
      this.reviewVisible = true
      this.auditGiftId = giftInfo.giftId
    },
    dialogApproved(giftInfo) {
      this.detailShow = false
      this.approved(giftInfo)
    },
    cancelReview(id) {
      GIFTING_API_GIFT_CANCELAUDITBYSTATION(id).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功')
          this.onSearch()
        }
      })
    },
    cellConfirmCancelReview(id) {
      this.$confirm('确认取消审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.cancelReview(id)
          this.getDetail(id)
        })
        .catch(() => {})
    },
    dialogCancelReview(id) {
      this.detailShow = false
      this.cancelReview(id)
    },
    nullifyBySupplier(id) {
      this.$confirm('确认作废吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          GIFTING_API_GIFT_NULLIFYBYSUPPLIER(id).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('操作成功')
              this.getData()
            }
          })
        })
        .catch(() => {})
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
    this.initOnlineStatus()
    this.initGiftStatusType()
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel,
    cascaderList,
    giftReview,
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
