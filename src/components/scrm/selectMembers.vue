<template>
  <el-dialog title="选择客户" width="1200px" :visible.sync="visible" custom-class="select-dialog">
    <el-form :model="queryForm">
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-select name="settingTagGroupId" v-model="queryForm.settingTagGroupId" placeholder="所有数据挖掘组">
              <el-option label="所有数据挖掘组" value></el-option>
              <el-option v-for="(item,index) in allWithTags" :key="index" :label="item.name" :value="item.settingTagGroupId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select name="memberTypeGroup" v-model="queryForm.memberTypeGroup" placeholder="所有分类" :filterable="true">
              <el-option label="全部" value></el-option>
              <el-option label="粉丝" :value="memberTypes.Fans"></el-option>
              <el-option label="微信会员" :value="memberTypes.OnlineVip"></el-option>
              <el-option label="线下会员" :value="memberTypes.OfflineVip"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select name="levelId" v-model="queryForm.levelId" placeholder="所有会员等级">
              <el-option label="所有会员等级" value></el-option>
              <el-option v-for="(item,index) in memBerLevels" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select name="groupId" v-model="queryForm.groupId" placeholder="所有客户分组">
              <el-option label="所有客户分组" value></el-option>
              <el-option v-for="(item,index) in memberGroup" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select name="sexyType" v-model="queryForm.sexyType" placeholder="所有性别">
              <el-option label="所有性别" value></el-option>
              <el-option v-for="(item,index) in sexyTypes.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select name="memberTagId" v-model="queryForm.memberTagId" placeholder="所有标签">
              <el-option label="所有标签" value></el-option>
              <el-option v-for="(item,index) in memBerTags" :key="index" :label="item.name" :value="item.settingMemberTagId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item>
            <el-input name="keyword" v-model="queryForm.keyword" placeholder="客户ID/会员卡号/姓名/手机号码" type="text" prefix-icon="el-icon-search" @input="search" @keyup.enter.native="search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox name="exceptEmptyMobile" v-model="queryForm.exceptEmptyMobile">不查看无手机号码客户</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectChange" v-loading="$store.getters.tb_loading" @row-click="toggleSelection" ref="selectGoods" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="giveId" label="基本信息" min-width="180" show-overflow-tooltip fixed="left">
        <template slot-scope="scope">
          <user-Info :scope="scope.row"></user-Info>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dateOfBirthText" label="生日" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subscrTime" label="关注时间" width="134" sortable="custom" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.subscrTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="joinTime" label="入会时间" width="134" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.joinTime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="expendLast" label="最近消费时间" width="134" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.expendLast | filterDateMinutes}}</template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页组件 -->
    <div slot="footer" class="dialog-footer">
      <el-button name="btnAdd" type="primary" @click="addMember(false)" :loading="$store.getters.is_loading">添加</el-button>
      <el-button name="btnAddAndClose" type="primary" @click="addMember(true)" :loading="$store.getters.is_loading">添加并关闭</el-button>
      <el-button name="btnClose" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  SexyTypes, MemberTypeGroup
} from '@/enums/membership.js'
import {
  YNStatus
} from '@/enums/common.js'
import {
  MEMBERSHIP_API_DATAANALYSIS_GETMEMBERFORSELECTOR,
  MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS,
  MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS
} from '@/apis/membership.js'
import pagination from '@/components/pagination'
import userInfo from '@/components/scrm/userInfo.vue'

export default {
  props: {
    selectMemberVisible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      sexyTypes: SexyTypes,
      memberTypes: MemberTypeGroup,
      memberGroup: [], // 所有客户分组
      memBerTags: [], // 所有标签下拉
      allWithTags: [], // 所有数据挖掘分组
      memBerLevels: [], // 所有会员等级列表
      visible: this.selectMemberVisible,
      queryForm: {
        settingTagGroupId: '',
        memberTypeGroup: '',
        groupId: '',
        levelId: '',
        sexyType: '',
        memberTagId: '',
        exceptEmptyMobile: true,
        keyword: '',
        orderField: 'subscrTime',
        orderType: YNStatus.No,
        subscribeType: '',
        pageIndex: 1,
        pageSize: 10
      },
      code: '',
      data: [],
      total: 0,
      selectData: [],
      close: false,
      goodsTimer: ''
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      MEMBERSHIP_API_DATAANALYSIS_GETMEMBERFORSELECTOR(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.data = res.data.Data.rows || []
            this.total = res.data.Data.total || 0
          }
          this.$store.commit('SET_TB_LOADING', false) // table loading
        }
      )
    },
    search() {
      this.queryForm.pageIndex = 1
      this.queryForm.orderField = 'subscrTime'
      this.getData()
    },
    addMember(flag) {
      this.$store.commit('SET_BTN_LOADING', true)
      if (!this.selectData.length) {
        this.$message('请选择客户', 'error')
      } else {
        this.$emit('listenAddMember', this.selectData)
        if (flag) {
          this.visible = false
        } else {
          this.$refs.selectGoods.clearSelection()
        }
      }
      this.$store.commit('SET_BTN_LOADING', false)
    },
    getMemBerTags() {
      MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memBerTags = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getMemberGroup() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memberGroup = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getAllWithTags() {
      MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allWithTags = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getMemBerLevels() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memBerLevels = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    currentChange(val) {
      this.queryForm.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.queryForm.pageIndex = 1
      this.queryForm.pageSize = val
      this.getData()
    },
    sortChange({ prop, order }) {
      this.queryForm.orderField = prop || 'subscrTime'
      this.queryForm.orderType = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    selectChange(selection) {
      this.selectData = selection
    },
    toggleSelection(row) {
      this.$refs.selectGoods.toggleRowSelection(row)
    }
  },
  mounted() {
    this.getMemberGroup()
    this.getMemBerTags()
    this.getAllWithTags()
    this.getMemBerLevels()
    this.search()
  },
  watch: {
    visible() {
      this.$emit('listenSelectMemDialog', false)
    },
    'queryForm.settingTagGroupId': 'search',
    'queryForm.memberTypeGroup': 'search',
    'queryForm.levelId': 'search',
    'queryForm.groupId': 'search',
    'queryForm.sexyType': 'search',
    'queryForm.memberTagId': 'search',
    'queryForm.exceptEmptyMobile': 'search',
    'queryForm.subscribeType': 'search'
  },
  components: {
    pagination,
    userInfo
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  border-left: 1px solid #ebeef5;
}
.pagination {
  margin-bottom: 0;
  padding: 0;
}
</style>
