
<template  >
  <div>
    <el-form inline :model="form" ref="search">
      <el-form-item label="日期" prop="joinTimeRange">
        <el-date-picker
          v-model="form.joinTimeRange"
          @change="dateChange"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="$root.datePickerOptions"
          value-format="yyyy-MM-dd"
          name="joinTimeRange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item v-show="false" prop="joinTimeStart">
        <el-input v-model="form.joinTimeStart" name="joinTimeStart"></el-input>
      </el-form-item>
      <el-form-item v-show="false" prop="joinTimeEnd">
        <el-input v-model="form.joinTimeEnd" name="joinTimeEnd"></el-input>
      </el-form-item>
      <el-form-item label="会员昵称" prop="aliasName">
        <el-input v-model="form.aliasName" name="aliasName"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="trueName">
        <el-input v-model="form.trueName" name="trueName"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" name="mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search" name="btn-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column prop="aliasName" label="昵称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="trueName" label="真实姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sexyType" label="性别">
        <template slot-scope="scope">{{sexyType.Types[scope.row.sexyType]}}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="所在地" show-overflow-tooltip></el-table-column>
      <el-table-column prop="joinTime" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.joinTime | filterDate}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button type="text" name="btn-select" @click="selectMember(scoped.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import {
  SexyType
} from '@/enums/common'
import {
  MEMBERSHIP_API_MEMBER_GETS
} from '@/apis/membership'
import pagination from '@/components/pagination.vue'
export default {
  components: {
    pagination
  },
  props: {
    isShow: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      sexyType: SexyType,
      form: {
        joinTimeRange: [],
        joinTimeStart: '',
        joinTimeEnd: '',
        aliasName: '',
        trueName: '',
        mobile: '',
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      createTime: [],
      tableData: [],
      isLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    isShow() {
      if (this.isShow) {
        this.getList()
      } else {
        this.$refs.search.resetFields()
        this.form.pageSize = 10
        this.form.pageIndex = 1
      }
    }
  },
  methods: {
    dateChange(value) {
      if (value) {
        this.form.joinTimeStart = value[0]
        this.form.joinTimeEnd = value[1]
      } else {
        this.form.joinTimeStart = ''
        this.form.joinTimeEnd = ''
      }
    },
    getList() {
      this.isLoading = true
      MEMBERSHIP_API_MEMBER_GETS(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.isLoading = false
      })
    },
    search() {
      this.form.pageIndex = 1
      this.getList()
    },
    sizeChange(value) {
      // 切换每页显示数
      this.form.pageSize = value
      this.form.pageIndex = 1
      this.getList()
    },
    currentChange(val) {
      this.form.pageIndex = val
      this.getList()
    },
    selectMember(row) {
      this.$emit('selectMember', row)
    }
  }
}
</script>