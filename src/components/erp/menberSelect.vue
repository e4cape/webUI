<template>
  <!-- @module 会员 -->
  <el-dialog title="搜索会员" width="1000px" :visible="visible" @update:visible="$emit('update:visible', $event)" @open="init">
    <el-row :gutter="2" class="p-10">
      <el-col :span="20">
        <el-col :span="8">
          <el-input name="Mobile" maxlength="20" size="small" class="fl" v-model="vipParams.Mobile" placeholder="请输入会员手机号码" @keyup.enter.native="searchVipList"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input name="MemberId" maxlength="50" size="small" class="fl" v-model="vipParams.MemberId" placeholder="请输入会员ID" @keyup.enter.native="searchVipList"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input name="AliasName" maxlength="20" size="small" class="fl" v-model="vipParams.AliasName" placeholder="请输入会员昵称" @keyup.enter.native="searchVipList"></el-input>
        </el-col>
      </el-col>
      <el-col :span="4">
        <el-col style="line-height:32px;">
          <el-button name="btnSerrch" type="primary" @click="searchVipList">搜索</el-button>
          <el-button name="btnReset" @click="resetVip">重置</el-button>
        </el-col>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="vipList" highlight-current-row v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @row-click="selectVipNumber">
      <el-table-column prop="memberId" label="会员ID" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="trueName" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="aliasName" label="昵称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sexyType" label="性别" min-width="50" show-overflow-tooltip>
        <template slot-scope="scope">{{sexyTypes.Types[scope.row.sexyType]}}</template>
      </el-table-column>
      <el-table-column prop="Birthday" label="生日" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.birthday | filterDate }}</template>
      </el-table-column>
      <el-table-column prop="joinTime" label="入会日期" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.joinTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="subscrFromText" label="来源" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="头像" min-width="80" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl.indexOf('http') > -1 ? scope.row.imageUrl : $root.settings.DOMAIN_IMAGE + scope.row.imageUrl" alt style="width: 30px; vertical-align:middle;">
        </template>
      </el-table-column>
    </el-table>
    <!-- end  表格 -->
    <pagination :pg="vipIndex" :size="vipSize" :total="vipTotal" @currentChange="vipPageChange" @sizeChange="vipPageSizeChange"></pagination>
    <div slot="footer">
      <el-button name="btnSelected" type="primary" @click.native="selectedVipNumber">确认</el-button>
      <el-button name="btnClose" @click.native="$emit('update:visible', false)">取消</el-button>
    </div>
  </el-dialog>
  <!-- end 会员 -->
</template>

<script>
import { SexyType } from '@/enums/common.js'
import { MEMBERSHIP_API_MEMBER_GETS } from '@/apis/membership.js'

import pagination from '@/components/pagination'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sexyTypes: SexyType,
      vipList: [],
      vipIndex: 1,
      vipSize: 10,
      vipTotal: 0,
      vipDetail: {
      },
      vipParams: {
        PageIndex: 1,
        PageSize: 10,
        orderType: 1,
        orderField: 'joinTime',
        Mobile: '',
        MemberId: '',
        AliasName: '',
        SexyType: '',
        TrueName: ''
      },
      parameters: {
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (JSON.stringify(this.parameters) === '{}') {
        this.resetVip()
      } else {
        this.getVipList()
      }
    },
    getVipList() {
      // 获取列表
      this.vipParams.PageIndex = this.vipIndex
      this.vipParams.PageSize = this.vipSize
      this.$store.commit('SET_TB_LOADING', true) // table loading
      MEMBERSHIP_API_MEMBER_GETS(this.vipParams).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.vipList = res.data.Data.rows
          this.vipTotal = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    searchVipList() {
      // 搜索会员
      this.vipIndex = 1
      this.parameters = Object.assign({
      }, this.vipParams)
      this.getVipList()
    },
    selectVipNumber(row) {
      // 单选会员
      this.vipDetail = row
    },
    selectedVipNumber() {
      // 选定会员
      if (!this.vipDetail.memberId) {
        this.$message.error('请选择会员!')
        return false
      }
      this.$emit('getVipInfo', this.vipDetail)
    },
    vipPageChange(val) {
      this.vipIndex = val
      this.init()
    },
    vipPageSizeChange(val) {
      if (this.vipSize !== val) {
        this.vipSize = val
        this.vipIndex = 1
        this.init()
      }
    },
    resetVip() {
      // 重置列表
      this.vipParams = {
        PageIndex: 1,
        PageSize: 10,
        orderType: 1,
        orderField: 'joinTime',
        Mobile: '',
        MemberId: '',
        AliasName: '',
        SexyType: '',
        TrueName: ''
      }
      this.getVipList()
    }
  },
  components: {
    pagination
  }
}
</script>

<style scoped >
.mr10 {
  margin-right: 10px;
  overflow: hidden;
  float: left;
  width: 350px;
}
</style>

