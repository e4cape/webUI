<template>
  <div>
    <el-form :model="searchForm" lable-width="120px" class="item-lh-26" :inline="true" ref="search" :rules="queryRules">
      <search-panel  @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown name="btnDropdown" trigger="hover" @command="chooseBatch">
            <el-button type="primary">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">选择全部</el-dropdown-item>
              <el-dropdown-item command="current">选择当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button name="btnBack" @click="$router.back(-1)" class="m-l-10">返回</el-button>
          <el-checkbox name="selected" v-model="searchForm.selected" class="m-l-10" @change="(v) => searchStateChange(v,'selected')" style="line-height:28px">不查看已选择礼品</el-checkbox>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="giftName" placeholder="礼品名称" v-model="searchForm.giftName" @keyup.enter.native="onSearch" :maxlength="25" >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="礼品分类：" prop="categoryId">
            <el-cascader
              name="categoryId"
              :options="[allCategory, ...categoryList]"
              v-model="searchForm.categoryId"
              :props="{value:'categoryId',label:'categoryName',children:'items'}"
              change-on-select
             >
            </el-cascader>
          </el-form-item>
          <el-form-item label="货号/条码：" prop="barCode">
            <el-input name="barCode" v-model="searchForm.barCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="货号/条码"></el-input>
          </el-form-item>
          <el-form-item label="礼品名称：" prop="giftName">
            <el-input name="barCode"  v-model="searchForm.giftName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="礼品名称"></el-input>
          </el-form-item>
          <el-form-item :label="isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'">
            <el-row :gutter="0">
              <el-col :span="11">
                <el-form-item prop="wholesalePriceMin" class="inline no-margin">
                  <el-input name="wholesalePriceMin"  v-model="searchForm.wholesalePriceMin" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="tc">-</el-col>
              <el-col :span="11">
                <el-form-item prop="wholesalePriceMax" class="inline no-margin">
                  <el-input name="wholesalePriceMax" v-model="searchForm.wholesalePriceMax" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="建议零售价：">
            <el-row :gutter="0">
              <el-col :span="11">
                <el-form-item prop="retailPriceMin" class="inline no-margin">
                  <el-input name="retailPriceMin" v-model="searchForm.retailPriceMin" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="tc">-</el-col>
              <el-col :span="11">
                <el-form-item prop="retailPriceMax" class="inline no-margin">
                  <el-input name="retailPriceMax" v-model="searchForm.retailPriceMax" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker name="createTime" type="daterange" v-model="searchForm.createTime" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <div class="panel clearfix" v-if="dataList.length">
        <div class="rank-row">
          <el-radio-group name="showType" class="check-group fr" v-model="showType">
            <el-radio-button :label="1"><i class="icon-image m-r-5"></i>大图</el-radio-button>
            <el-radio-button :label="2"><i class="icon-list m-r-5"></i>列表</el-radio-button>
          </el-radio-group>
          <div class="rank-button" @click.stop="changeOrder('createTime')">
            按创建时间
            <span name="btnChangeOrder1" class="el-icon-caret-top" :class="{'active':searchForm.orderField === 'createTime' && searchForm.orderType == YNStatus.Yes}" @click.stop="changeOrder('createTime',1)"></span>
            <span  name="btnChangeOrder2" class="el-icon-caret-bottom" :class="{'active':searchForm.orderField === 'createTime' && searchForm.orderType == YNStatus.No}"  @click.stop="changeOrder('createTime',0)"></span>
          </div>
          <div class="rank-button" @click.stop="changeOrder('orderQty')">
            按销量
            <span  name="btnChangeOrder3" class="el-icon-caret-top" :class="{'active':searchForm.orderField === 'orderQty' && searchForm.orderType == YNStatus.Yes}" @click.stop="changeOrder('orderQty',1)"></span>
            <span name="btnChangeOrder4" class="el-icon-caret-bottom" :class="{'active':searchForm.orderField === 'orderQty' && searchForm.orderType == YNStatus.No}" @click.stop="changeOrder('orderQty',0)"></span>
          </div>
          <!-- <div class="rank-button" @click.stop="changeOrder('shelfQty')"> -->
            <!-- 按上架量 -->
            <!-- 16215 <span class="el-icon-caret-top" :class="{'active':searchForm.orderField === 'shelfQty' && searchForm.orderType == 1}" @click.stop="changeOrder('shelfQty',1)"></span>
            <span class="el-icon-caret-bottom" :class="{'active':searchForm.orderField === 'shelfQty' && searchForm.orderType == 0}"  @click.stop="changeOrder('shelfQty',0)"></span> -->
          <!-- </div> -->
          <div class="rank-button" @click.stop="changeOrder('wholesalePrice')">
            按{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价': '批发价'}}
            <span  name="btnChangeOrder5" class="el-icon-caret-top" :class="{'active':searchForm.orderField === 'wholesalePrice' && searchForm.orderType == YNStatus.Yes}"  @click.stop="changeOrder('wholesalePrice',1)"></span>
            <span name="btnChangeOrder6" class="el-icon-caret-bottom" :class="{'active':searchForm.orderField === 'wholesalePrice' && searchForm.orderType == YNStatus.No}"  @click.stop="changeOrder('wholesalePrice',0)"></span>
          </div>
          <div class="rank-button" @click.stop="changeOrder('retailPrice')">
            按零售价
            <span name="btnChangeOrder7" class="el-icon-caret-top" :class="{'active':searchForm.orderField === 'retailPrice' && searchForm.orderType == YNStatus.Yes}" @click.stop="changeOrder('retailPrice',1)"></span>
            <span name="btnChangeOrder8" class="el-icon-caret-bottom" :class="{'active':searchForm.orderField === 'retailPrice' && searchForm.orderType == YNStatus.No}" @click.stop="changeOrder('retailPrice',0)"></span>
          </div>
          <!-- <el-row :gutter="20">
            <el-col :span="4" v-for="(item, index) in columns" :key="index">
              <div class="recommend-item">{{item.name}}</div>
            </el-col>
          </el-row> -->
          <div class="recommend">
            <div
              name="recommendItem"
              class="recommend-item"
              v-for="(item, index) in columns"
              :key="index"
              @click="$router.push({path: '/gift/giftManage/costEffective', query: {settingOptionId: item.settingOptionId}})">
              <img class="recommend-img" src="@/assets/images/recommend.png" alt="">
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="data-list" :class="{'list-show':showType === 2}" id="dataList">
          <div class="item" v-for="(item,index) in dataList" :key="index">
            <div class="img-box">
              <img :src="$root.settings.DOMAIN_IMAGE + item.imageUrl" alt="" @click="giftDetail(item)" v-if="item.imageUrl" style="background-color:#fff">
              <img src="../../../assets/images/pic.jpg" alt="" @click="giftDetail(item)" v-else>
            </div>
            <p v-text="item.giftName"></p>
            <div class="price">
              <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span v-text="item.wholesalePrice"></span></p>
              <p>建议零售价：<span v-text="item.retailPrice"></span></p>
              <div class="choose">
                <el-button name="btnSelected" :loading="$store.getters.is_loading" :type="item.isSelected === 0 ? '' : 'primary'" :disabled="item.isSelected === 0" @click="addGift(item.giftId)">{{item.isSelected === 1?'选择':'已选'}}</el-button>
              </div>
            </div>
          </div>
        </div>
        <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
      <div class="tc" v-if="!dataList.length && !$store.getters.tb_loading">
        - 暂无数据 -
      </div>
    </div>
    <!-- @ module 查看礼品 -->
    <el-dialog title="查看礼品" :visible.sync="detailShow" :before-close="detailShowCancel" width="458px">
      <show-detail :data="detailInfo" ref="showDetail"></show-detail>
    </el-dialog>
    <!-- @ END 查看礼品 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_GIFT_SEARCHWAREHOUSE,
  GIFTING_API_GIFT_ADDWAREHOUSE,
  GIFTING_API_GIFT_GETNOTSELECTEDGIFTIDS,
  GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER,
  GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS
} from '@/apis/gifting'
import { YNStatus } from '@/enums/common'
export default {
  data(){
    return{
      YNStatus,
      searchForm: {
        giftName: '',
        barCode: '',
        categoryId: [''],
        wholesalePriceMax: '',
        wholesalePriceMin:'',
        retailPriceMax: '',
        retailPriceMin: '',
        createTime: [],
        selected: true,
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex:1,
        pageSize:10
      },
      allCategory: {
        categoryId: '',
        categoryName: '所有分类',
        items: '',
      },
      categoryList: [],
      showType: 1, // 1大图 2列表
      dataList: [],
      total:10,
      parameter:{
      },
      queryRules: {
        retailPriceMin: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^-?(\d+|\d+.?\d+)$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入数字'))
              } else if (value && this.searchForm.retailPriceMax && this.searchForm.retailPriceMax && parseFloat(value) > parseFloat(this.searchForm.retailPriceMax)) {
                callback(new Error())
              } else if (value) {
                this.searchForm.retailPriceMin = parseFloat(this.searchForm.retailPriceMin).toFixed(2)
              }
              callback()
            }
          }
        ],
        retailPriceMax: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^-?(\d+|\d+.?\d+)$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入数字'))
              } else if (value && this.searchForm.retailPriceMin && this.searchForm.retailPriceMin && parseFloat(value) < parseFloat(this.searchForm.retailPriceMin)) {
                callback(new Error())
              } else if (value) {
                this.searchForm.retailPriceMax = parseFloat(this.searchForm.retailPriceMax).toFixed(2)
              }
              callback()
            }
          }
        ],
        wholesalePriceMin: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^-?(\d+|\d+.?\d+)$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入数字'))
              } else if (value && this.searchForm.wholesalePriceMax && this.searchForm.wholesalePriceMax && parseFloat(value) > parseFloat(this.searchForm.wholesalePriceMax)) {
                callback(new Error())
              } else if (value) {
                this.searchForm.wholesalePriceMin = parseFloat(this.searchForm.wholesalePriceMin).toFixed(2)
              }
              callback()
            }
          }
        ],
        wholesalePriceMax: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^-?(\d+|\d+.?\d+)$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入数字'))
              } else if (value && this.searchForm.wholesalePriceMin && this.searchForm.wholesalePriceMin && parseFloat(value) < parseFloat(this.searchForm.wholesalePriceMin)) {
                callback(new Error())
              } else if (value) {
                this.searchForm.wholesalePriceMax = parseFloat(this.searchForm.wholesalePriceMax).toFixed(2)
              }
              callback()
            }
          }
        ]
      },
      detailShow:false,
      detailInfo: {
      },
      chooseChecked:false,
      columns: []
    }
  },
  methods:{
    initRoute() {
      this.$router.replace({
        path: '/gift/giftManage/chooseFromCloud', query: JSON.parse(JSON.stringify(this.parameter)) 
      })
    },
    init(){
      let query = this.$route.query || {
      }
      if(!query.categoryId){
        query.categoryId = ['']
      }else{
        if( query.categoryId instanceof Array) {
          if(query.categoryId[0] === ''){
            query.categoryId = ['']
          }else{
            query.categoryId = query.categoryId.map(v => parseInt(v))
          }
        }else{
          query.categoryId = [].concat(parseInt(query.categoryId))
        }
      }
      this.parameter.categoryId = query.categoryId
      this.parameter.giftName = query.giftName || ''
      this.parameter.barCode = query.barCode || ''
      this.parameter.wholesalePriceMax = query.wholesalePriceMax || ''
      this.parameter.wholesalePriceMin = query.wholesalePriceMin || ''
      this.parameter.retailPriceMax = query.retailPriceMax || ''
      this.parameter.retailPriceMin = query.retailPriceMin || ''
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.selected = (query.selected === 'false'|| query.selected === false) ? false : true
      this.parameter.orderField = query.orderField || 'lastTime'
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 10
      this.searchForm = Object.assign({
      },this.parameter)
      this.getData()
    },
    getData(){
      let parameter = Object.assign({
      },this.searchForm, this.parameter, {
        createTimeStart: this.parameter.createTime[0],
        createTimeEnd: this.parameter.createTime[1]
      })
      parameter.categoryId = !parameter.categoryId[0] ? '' : this.parameter.categoryId.map(v=> parseInt(v))
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_GIFT_SEARCHWAREHOUSE(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code === 'CORRECT'){
          this.dataList = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    async getCategory() {
      let data = await GIFTING_API_CATEGORY_SEARCH()
      this.categoryList = data.data.Data
    },
    chooseBatch(v) {
      if(this.chooseChecked){
        this.$message.error('你的操作太快了，歇会吧')
        return
      }
      this.chooseChecked = true
      if(v === 'all') {
        let parameter = JSON.parse(JSON.stringify(Object.assign({
        },this.searchForm, this.parameter, {
          createTimeStart: this.parameter.createTime[0],
          createTimeEnd: this.parameter.createTime[1]
        })))
        parameter.categoryId = !parameter.categoryId[0] ? '' : this.parameter.categoryId.map(v=> parseInt(v))
        delete parameter.pageIndex
        delete parameter.pageSize
        GIFTING_API_GIFT_GETNOTSELECTEDGIFTIDS(parameter).then(res => {
          this.chooseChecked = false
          if(res.data.Code === 'CORRECT'){
            let notSelectArray = res.data.Data
            if(notSelectArray.length > 0){
              this.$confirm('根据当前查询结果，共选择 '+ notSelectArray.length +' 件新货品。确定全部选择？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.addGift(notSelectArray)
              }).catch(() => {
                this.$message.error('取消选择全部')
              })
            } else {
              this.$message.error('没有可以选择的礼品了')
            }
          }else {
            this.$message.error(res.data.Message)
          }
        }).catch(() => {
          this.chooseChecked = false
        })
      }
      if (v === 'current') {
        let currentFilterArray = this.dataList.filter(v => v.isSelected === 1)
        if (currentFilterArray.length === 0){
          this.chooseChecked = false
          this.$message.error('当前没有可以选择的礼品了')
        } else {
          this.chooseChecked = false
          this.$confirm('根据当前页的查询结果，共选择 '+ currentFilterArray.length +' 件新货品。确定选择？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addGift(currentFilterArray.map(v => v.giftId))
          }).catch(() => {
            this.$message.error('取消选择')
          })
        }
      }
    },
    currentChange (val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange (val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch () {
      this.$refs['search'].validate((valid) => {
        if (!valid) {
          this.$message.error('请按正确的格式搜索')
          return
        }
        this.searchForm.pageIndex = '1'
        this.parameter = Object.assign({
        },this.searchForm)
        if (JSON.stringify(this.$route.query) == JSON.stringify(this.searchForm)) {
          this.getData()
        } else {
          this.initRoute()
        }
      })
    },
    onReset () {
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    searchStateChange (v, k) {
      this.parameter[k] = v
      this.onSearch()
    },
    changeOrder(name,v) {
      this.searchForm.orderField = name
      if(arguments.length === 1) {
        if(!parseInt(this.searchForm.orderType)){
          this.searchForm.orderType = YNStatus.Yes
        }else{
          this.searchForm.orderType = YNStatus.No
        }
      } else {
        this.searchForm.orderType = v
      }
      this.parameter.orderField = this.searchForm.orderField
      this.parameter.orderType = this.searchForm.orderType
      this.parameter.pageIndex = 1
      this.initRoute()
    },
    addGift(ids){
      if(this.chooseChecked){
        this.$message.error('你的操作太快了，休息一下吧')
        return
      }
      this.chooseChecked = true
      let params = []
      if(ids instanceof Array){
        params = ids
      } else {
        params.push(ids)
      }
      this.$store.commit('SET_BTN_LOADING', true)
      GIFTING_API_GIFT_ADDWAREHOUSE(params).then(res => {
        this.chooseChecked = false
        if(res.data.Code === 'CORRECT'){
          this.$message.success('已添加成功')
          this.getData()
        }else{
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      }).catch(() => {
        this.chooseChecked = false
      })
    },
    giftDetail(v) {
      if (!v.giftId) {return false}
      GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER({
        giftId: v.giftId
      }).then((res) => {
        if(res.data.Code === 'CORRECT'){
          this.detailShow = true
          this.detailInfo = res.data.Data
          this.getData()
        }else{
          this.$message.error(res.data.Message)
        }
      })
    },
    detailShowCancel(done) {
      this.$refs['showDetail'].initActiveTab()
      done()
      this.detailInfo = {
      }
    },
    getColumns() {
      GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.columns = res.data.Data
        }
      })
    }
  },
  mounted(){
    this.getCategory()
    this.getColumns()
    this.init()
  },
  watch: {
    $route:'init',
  },
  components:{
    pagination,
    searchPanel,
    showDetail
  }
}
</script>

<style lang="scss" scoped>
.rank-row{
  padding:10px;
  .rank-button{
    cursor: pointer;
    margin-right: 5px;
    border:1px solid #ddd;
    display: inline-block;
    position: relative;
    line-height: 20px;
    padding: 1px 15px 1px 6px;
    color: #555;
    >span{
      position:absolute;
      right: 2px;
      &:first-child{
        top:1px;
      }
      &:last-child{
        bottom:1px;
      }
      &.active{
        color: #007ed5;
      }
    }
  }
  /deep/ .check-group{
    .el-radio-button__inner{
      padding:5px 10px;
      font-size: 12px;
    }
  }
}
.data-list{
  border-top:1px solid #ddd;
  >.item{
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd; 
    display: inline-block;
    width: 20%;
    padding:10px;
    &:nth-child(5n){
      border-right: none;
    }
    >.img-box{
      width:100%;
      height:0px;
      padding-bottom:100%;
      position:relative;
      background: #cfe1eb url('../../../assets/images/pic.jpg') center center no-repeat;
      >img{
        width:100%;
        height:100%;
        position:absolute;
      }
    }
    >p{
      margin: 10px 0;
      height: 24px;
      color:#555;
      display:-webkit-box;
      overflow:hidden;
      white-space:normal!important;
      text-overflow:ellipsis;
      word-wrap:break-word;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
    }
    >.price{
      border-top: 1px dashed #ddd;
      position: relative;
      >p{
        padding-top: 10px;
        >span{
          color:#f5222d;
          font-weight: 700;
          font-size: 16px;
        }
      }
      >.choose{
        position: absolute;
        margin-top:5px;
        top:50%;
        right:0;
        transform: translateY(-50%);
        >.el-button {
          padding: 6px 10px;
        }
      }
    }
  }
  &.list-show{
    >.item{
      width: 100%;
      position: relative;
      border-right: 0;
      min-height: 80px;
      >.img-box{
        width: 120px;
        height: 120px;
        padding: 0;
        position: static;
        background-size: cover;
        >img{
          width: 100%;
          height: 100%;
          position: static;
        }
      }
      >p{
        position: absolute;
        right: 280px;
        left: 140px;
        top:10px;
      }
      >.price{
        border:0;
        position: absolute;
        top:50%;
        right:10px;
        width: 260px;
        transform: translateY(-50%);
      }
    }
  }
}
.recommend {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  .recommend-item {
    width: 200px;
    border: 1px solid #ddd;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    margin-top: 10px;
    cursor: pointer;
    position: relative;
    color: #555;
    margin-left: 10px;
    .recommend-img {
      position: absolute;
      top: -1px;
      left: -1px;
    }
  }
  .recommend-item:first-child {
    margin-left: 0;
  }
}
.el-row /deep/ .el-form-item__error {
  display: none !important;
}
</style>
