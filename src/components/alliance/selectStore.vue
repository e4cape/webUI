<template>
  <el-dialog title="选择地址" :visible.sync="visible" @update:visible="$emit('update:visible', $event)" width="860px">
    <template v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-form :model="queryForm" label-position="right" label-width="90px" class="list-query-form no-border">
        <el-row>
          <el-col :span="7">
            <el-form-item label="门店编码：">
              <el-input name="Name" v-model="queryForm.Name" :maxlength="50" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="门店名称：">
              <el-input name="Name" v-model="queryForm.Name" :maxlength="50" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="区域：">
              <el-cascader name="areas" filterable v-model="areaArr" change-on-select :options="$store.getters.areas" ref="cascader" placeholder="所有地区"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align: center;">
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="data" v-loading="$store.getters.tb_loading" @row-click="toggleSelection" ref="selectStore" element-loading-text="拼命加载中">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="BarCode" label="门店编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="门店名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="地区" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceType" label="状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.addAddrs}}
          </template>
        </el-table-column>
        <el-table-column prop="Weight" label="到期日期"></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddAddrs" type="primary" @click="addAddrs(false)" :loading="$store.getters.is_loading">确定</el-button>
        <el-button name="btnCancel" @click="visible.sync =  false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import pagination from '@/components/pagination'
import {
  RmaType
} from '@/enums/spread'
import { YNStatus } from '@/enums/common'
import {
  SPREAD_API_SPR_SEARCHADDRS
} from '@/apis/spread'
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      queryForm: {
        Name: '',
        ProvinceId: '',
        CityId: '',
        TownId: '',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      areaArr: [],
      data: [],
      total: 0,
      areas: []
    }
  },
  computed: {
    allChecked() {
      return this.data.findIndex(item => !item.Checked) === -1
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPR_SEARCHADDRS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows.map(item => {
            item.Checked = false
            return item
          })
          this.total = res.data.Data.total
        }
      })
    },
    search() {
      this.queryForm.PageIndex = 1
      this.queryForm.ProvinceId = this.areaArr[0]
      this.queryForm.CityId = this.areaArr[1]
      this.queryForm.TownId = this.areaArr[2]
      this.getData()
    },
    addAddrs() {
      let selecteds = this.data.filter(item => {
        if (item.Checked) {
          return item
        }
      })
      if (!selecteds.length) {
        this.$message.warning('请选择提货地址')
        return false
      }
      this.$emit(
        'listenSelectStore',
        true,
        selecteds.map(item => {
          item.RmaType = RmaType.None
          return item
        })
      )
    },
    toggleSelection() {

    },
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      if (this.queryForm.PageSize !== val) {
        this.queryForm.PageIndex = 1
        this.queryForm.PageSize = val
        this.getData()
      }
    },
    allChange(value) {
      this.data.map(item => {
        item.Checked = value
        return item
      })
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    // this.getData()
  },
  watch: {
    visible() {
      this.$emit('listenSelectStore', false)
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.item {
  height: 60px;
  border: 1px solid #e5e5e5;
  border-top-width: 0;
  &:first-child {
    border-top-width: 1px;
  }
  .txt {
    line-height: 20px;
    padding: 10px 0;
    text-align: left;
    b {
      font-weight: 900;
    }
  }
}
.detailed-address {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

