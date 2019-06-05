<template>
  <el-dialog title="选择地址" :visible.sync="visible" width="860px">
    <template v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-form :model="queryForm" label-position="right" label-width="110px" class="list-query-form no-border">
        <el-row>
          <el-col :span="8">
            <el-form-item label="门店名称：">
              <el-input name="Name" v-model="queryForm.Name" :maxlength="50" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区域：">
              <el-cascader name="areas" filterable v-model="areaArr" change-on-select :options="$store.getters.areas" ref="cascader" placeholder="所有地区"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: center;">
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="adress-list">
        <el-row v-for="(item, index) in data" :key="index" class="item">
          <el-col :span="2" style="text-align:center; line-height: 58px;">
            <el-checkbox name="Checked" v-model="item.Checked"></el-checkbox>
          </el-col>
          <el-col :span="22" class="txt">
            <div>
              <b>{{item.Name}}</b>&nbsp;&nbsp;&nbsp;
              <span>{{item.Mobile}}</span>
            </div>
            <el-tooltip :content="item.ProvinceName + item.CityName + item.TownName + item.Address" placement="bottom" effect="light">
              <div class="detailed-address">{{item.ProvinceName + item.CityName + item.TownName + item.Address}}</div>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-row>
      <!-- @module 分页组件 -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="14" style="text-align: left; line-height: 33px;">
            <el-checkbox name="allChecked" v-model="allChecked" @change="allChange">全选</el-checkbox>
          </el-col>
          <el-col :span="10">
            <el-button name="btnAddAddrs" type="primary" @click="addAddrs(false)" :loading="$store.getters.is_loading">确定</el-button>
            <el-button name="btnCancel" @click="visible =  false">取消</el-button>
          </el-col>
        </el-row>
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
    selectStoreVisible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      visible: this.selectStoreVisible,
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
    this.getData()
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

