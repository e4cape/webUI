<template>
  <div>
    <el-dialog title="选择旧货" @update:visible="$emit('update:visible', $event)" :visible="visible" @close="$emit('listenCreateDialog', success)">
      <div class="cj_head">
        <el-row :gutter="2">
          <el-col :span="4">
            <el-select v-model="junkGoldType" placeholder="所有类型" :filterable="true" name="junkGoldType">
              <el-option label="所有类型" value="0"> </el-option>
              <el-option v-for="(item, index) in YNStatus.Types" :key="index" :label="item=='是'?'素金':'非素'" :value="index"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="materialType" placeholder="所有材质" :filterable="true" name="materialType">
              <el-option label="所有材质" value="0"> </el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="categoryType" placeholder="所有品类" :filterable="true" name="categoryType"> 
              <el-option label="所有品类" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="goldType" placeholder="所有成色" :filterable="true" name="goldType">
              <el-option label="所有成色" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input width="100%" placeholder="输入旧货编号" v-model="queryForm.JunkCode" :maxlength="30" @keyup.enter.native="search" name="JunkCode">
              <el-button slot="append" @click="search" icon="el-icon-search" name="btnSearch"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div class="m-10"></div>
      <div class="panel-bd">
        <!-- 表格 -->
        <el-table :data="junkList" @selection-change="handleSelectionChange" @row-click="selectionChange" @sort-change="sortChange" highlight-current-row v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="JunkCode" label="旧货编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JunkName" label="旧货名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="IsGold" label="类型" min-width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.IsGold == YNStatus.Yes ?'素金':'非素'}}
            </template>
          </el-table-column>
          <el-table-column prop="MaterialType" label="材质" min-width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$store.getters.materialType.Types[scope.row.MaterialType]}}
            </template>
          </el-table-column>
          <el-table-column prop="CategoryType" label="品类" min-width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$store.getters.categoryType.Types[scope.row.CategoryType]}}
            </template>
          </el-table-column>
          <el-table-column prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$store.getters.goldType.Types[scope.row.GoldType]}}
            </template>
          </el-table-column>
          <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$root.toFloat(scope.row.GoldWeight, 3)}}
            </template>
          </el-table-column>
          <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$root.toFloat(scope.row.RecallGoldPrice)}}
            </template>
          </el-table-column>
          <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$root.toFloat(scope.row.RecallPrice)}}
            </template>
          </el-table-column>
          <el-table-column prop="CreateTime" label="回收时间" min-width="120" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.CreateTime | filterDateTime}}
            </template>
          </el-table-column>
        </el-table>
        <!-- end  表格 -->

        <!-- 分页 -->
        <div class="p-10">
          <pagination :pg="pg" :size="size" :total="total" @currentChange="detailPageChange" @sizeChange="detailPageSizeChange"></pagination>
        </div>
        <!-- 分页 end -->
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary btn" @click.native="selectAddJunk" name="btnSelectAddJunk">确认</el-button>
        <el-button @click="$emit('listenCreateDialog', success)" name="btnCancel">取消</el-button> -->
        <el-button type="primary" @click="selectAddJunk(false)" :loading="$store.getters.is_loading" name="btnselectAddJunk">添加</el-button>
        <el-button type="primary" @click="selectAddJunk(true)" :loading="$store.getters.is_loading" name="btnselectAddJunkAndClose">添加并关闭</el-button>
        <el-button @click="$emit('listenCreateDialog', success)" name="btnClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  JunkTraceState 
} from '@/enums/stocking.js'
import {
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_TRACE_GETS,
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_CREATE
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'

export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    PrintId: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      YNStatus,
      junkTraceState: JunkTraceState,
      junkList: [],
      selections: [],
      queryForm: {
        SourceType: '0', // 来源类型(枚举)
        IsGold: '0', // 是否素金
        MaterialType: '0', // 材质类型(枚举)
        CategoryType: '0', // 品类(枚举)
        GoldType: '0', // 成色(枚举)
        JunkCode: '', // 旧货编号
        JunkName: '', // 旧货名称
        StoreBarCode: '', // 门店条码
        GoldWeight1: '', // 金重
        GoldWeight2: '', // 金重
        RecallGoldPrice1: '', // 回收金价(元/g)
        RecallGoldPrice2: '', // 回收金价(元/g)
        RecallPrice1: '', // 回收金额
        RecallPrice2: '', // 回收金额
        CreateTime1: '1900-01-01',
        CreateTime2: '1900-01-01',
        MemberId: '', // 会员序号
        MemberCode: '', // 会员Id
        Mobile: '', // 会员手机
        State: JunkTraceState.Storaged, // 旧货状态(枚举)
        OrderBy: '0', // 排序字段(0=创建时间)
        IsAsced: YNStatus.No, // 是否升序
        PageIndex: '1', // 当前页码
        PageSize: '10' // 每页?条
      },
      junkGoldType: '',
      materialType: '', // 材质类型
      junkType: '', // 货物类型
      categoryType: '', // 品类
      goldType: '', // 色类
      stateItems: '',
      stateIndex: '0',
      orderBy: 0,
      goodId: '',
      total: 0,
      pg: '1',
      size: '10',
      success: false,
      parameters: {
      }
    }
  },
  methods: {
    init() {
      if (JSON.stringify(this.parameters) === '{}') {
        this.reset()
      } else {
        this.queryForm = Object.assign(this.queryForm, this.parameters)
        this.getJunkList()
      }
    },
    getJunkList() {
      this.queryForm.IsGold = this.junkGoldType
      this.queryForm.MaterialType = this.materialType
      this.queryForm.CategoryType = this.categoryType
      this.queryForm.GoldType = this.goldType
      this.queryForm.OrderBy = this.orderBy
      this.queryForm.IsAsced = this.IsAsced
      this.queryForm.PageIndex = this.pg
      this.queryForm.PageSize = this.size
      STOCKING_API_JUNK_TRACE_GETS(this.queryForm).then(res => {
        let result = res.data
        if (result.Code === 'CORRECT') {
          this.junkList = result.Data.Rows || []
          this.total = result.Data.Count
        }
      })
    },
    search() {
      this.pg = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.getJunkList()
    },
    selectAddJunk(flag) {
      if (this.selections.length > 1) {
        this.$message.error('一次只能添加一条')
        return false
      }
      if (this.selections.length === 0) {
        this.$message.error('请选择一条你要添加的旧货')
      }else{
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_JUNK_PRINT_ORDER_ITEM_CREATE({
          PrintId: Number(this.PrintId)||0,
          Items: [{JunkId: this.selections[0].JunkId, JunkCode: this.selections[0].JunkCode}]
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if(res.data.Code == 'CORRECT'){
            this.success = true
            if(flag){
              this.$emit('listenCreateDialog', this.success)
            }
            this.$message.success('添加成功')
          }
        }).catch(() => {
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    selectionChange(selection) {
      this.selections = [selection]
    },
    handleSelectionChange(val){
      // console.log(110, val)
      this.selections = val
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.orderBy = 0
          break
        default:
          this.orderBy = 1
          break
      }
      this.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.init()
    },
    detailPageChange(val) {
      this.pg = val
      this.init()
    },
    detailPageSizeChange(val) {
      if (this.size !== val) {
        this.size = val
        this.pg = 1
        this.init()
      }
    },
    reset() {
      this.queryForm = {
        SourceType: '0', // 来源类型(枚举)
        IsGold: '0', // 是否素金
        MaterialType: '0', // 材质类型(枚举)
        CategoryType: '0', // 品类(枚举)
        GoldType: '0', // 成色(枚举)
        JunkCode: '', // 旧货编号
        JunkName: '', // 旧货名称
        StoreBarCode: '', // 门店条码
        GoldWeight1: '', // 金重
        GoldWeight2: '', // 金重
        RecallGoldPrice1: '', // 回收金价(元/g)
        RecallGoldPrice2: '', // 回收金价(元/g)
        RecallPrice1: '', // 回收金额
        RecallPrice2: '', // 回收金额
        CreateTime1: '1900-01-01',
        CreateTime2: '1900-01-01',
        MemberId: '', // 会员序号
        MemberCode: '', // 会员Id
        Mobile: '', // 会员手机
        State: this.junkTraceState.Storaged, // 旧货状态(枚举)
        OrderBy: '0', // 排序字段(0=创建时间)
        IsAsced: this.YNStatus.No, // 是否升序
        PageIndex: '1', // 当前页码
        PageSize: '10' // 每页?条
      }
      this.junkGoldType = ''
      this.materialType = ''
      this.categoryType = ''
      this.goldType = ''
      this.getJunkList()
    }
  },
  beforeMount() {},
  mounted() {
    this.init()
  },
  watch: {
    junkGoldType: 'search',
    materialType: 'search',
    categoryType: 'search',
    goldType: 'search',
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
.cj_head {
  width: 100%;
}
</style>
