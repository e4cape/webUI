<template>
  <div>
    <div v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <div class="panel clearfix">
        <div class="panel-tag">
          <span>{{settingName}}</span>
          <el-button @click="$router.back()" class="el-back" type="text">返回</el-button>
        </div>
        <div class="rank-row">
          <template>
            <el-dropdown name="btnDropdown" trigger="hover" @command="chooseBatch">
              <el-button type="primary">
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">选择全部</el-dropdown-item>
                <el-dropdown-item command="current">选择当前页</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-checkbox name="unselected " v-model="searchForm.unselected" class="m-l-10" @change="(v) => searchStateChange(v,'selected')" style="line-height:28px">不查看已选择礼品</el-checkbox>
          </template>
          <el-radio-group name="showType" class="check-group fr" v-model="showType">
            <el-radio-button :label="1"><i class="icon-image m-r-5"></i>大图</el-radio-button>
            <el-radio-button :label="2"><i class="icon-list m-r-5"></i>列表</el-radio-button>
          </el-radio-group>
        </div>
        <div class="data-list" :class="{'list-show':showType === 2}" id="dataList" v-if="dataList.length">
          <div class="item" v-for="(item,index) in dataList" :key="index">
            <div class="img-box">
              <img name="giftDetail" :src="$root.settings.DOMAIN_IMAGE + item.imageUrl" @click="giftDetail(item)" v-if="item.imageUrl" style="background-color:#fff">
              <img name="giftDetail" src="../../../assets/images/pic.jpg" @click="giftDetail(item)" v-else>
            </div>
            <p v-text="item.giftName"></p>
            <div class="price">
              <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span v-text="item.wholesalePrice"></span></p>
              <p>建议零售价：<span v-text="item.retailPrice"></span></p>
              <div class="choose">
                <el-button
                  name="btnSelected"
                  :loading="$store.getters.is_loading"
                  :type="item.selected ? '' : 'primary'"
                  :disabled="item.selected"
                  @click="addGift(item.giftId)">
                  {{item.selected?'已选':'选择'}}
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
      <div class="tc p-10" v-if="!dataList.length && !$store.getters.tb_loading">
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
  GIFTING_API_GIFT_SEARCHWAREHOUSE,
  GIFTING_API_GIFT_ADDWAREHOUSE,
  GIFTING_API_PLATFORMRECOMMEND_GETPLATFORMRECOMMENDGIFTIDSBYSTORE,
  GIFTING_API_PLATFORMRECOMMEND_GETPLATFORMRECOMMENDGIFTSBYSTORE,
  GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER,
  GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS
} from '@/apis/gifting'
export default {
  data(){
    return{
      searchForm: {
        settingOptionId: '',
        unselected: true,
        pageIndex:1,
        pageSize:10
      },
      allCategory: {
        categoryId: '',
        categoryName: '所有分类',
        items: '',
      },
      showType: 1, // 1大图 2列表
      dataList: [],
      total:10,
      parameter:{
      },
      detailShow:false,
      detailInfo: {
      },
      chooseChecked:false,
      settingName: ''
    }
  },
  methods:{
    getColumns() {
      GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.some(item => {
            if (item.settingOptionId === this.searchForm.settingOptionId) {
              this.settingName = item.name
            }
          })
        }
      })
    },
    getData(){
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_PLATFORMRECOMMEND_GETPLATFORMRECOMMENDGIFTSBYSTORE(this.searchForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code === 'CORRECT'){
          this.dataList = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    chooseBatch(v) {
      if(this.chooseChecked){
        this.$message.error('你的操作太快了，歇会吧')
        return
      }
      this.chooseChecked = true
      if(v === 'all') {
        GIFTING_API_PLATFORMRECOMMEND_GETPLATFORMRECOMMENDGIFTIDSBYSTORE({
          settingOptionId: this.searchForm.settingOptionId
        }).then(res => {
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
                this.$message.info('取消选择全部')
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
        let currentFilterArray = this.dataList.filter(v => v.selected === false)
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
            this.$message.info('取消选择')
          })
        }
      }
    },
    currentChange (val) {
      // 切换当前页
      this.searchForm.pageIndex = val
      this.getData()
    },
    sizeChange (val) {
      // 切换每页显示条数
      this.searchForm.pageIndex = 1
      this.searchForm.pageSize = val
      this.getData()
    },
    searchStateChange (v, k) {
      this.searchForm[k] = v
      this.getData()
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
  },
  created() {
    this.searchForm.settingOptionId = this.$route.query.settingOptionId || ''
  },
  mounted(){
    this.getData()
    this.getColumns()
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
.panel {
  border-top: none;
}
.panel-tag {
  position: relative;
  .el-back {
    position: absolute;
    right: 25px;
    z-index: 10;
  }
}
.rank-row{
  padding:5px;
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
</style>
