<template>
  <div class="content-view gro-list">
    <el-form
      :model="form"
      ref="search"
      lable-width="120px"
      @keyup.enter.native="onSearch"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="createShop" type="primary" icon="fa fa-plus" @click="createShop">新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable @change="onSearch" name="State" v-model="form.State">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option
                v-for="item in EnableState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="GroupCode">
            <el-input name="GroupCode" v-model="form.GroupCode" placeholder="集团编码">
              <el-button name="onSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="GroupCode" label="集团编码：">
            <el-input name="GroupCode" v-model="form.GroupCode"></el-input>
          </el-form-item>
          <el-form-item prop="GroupName" label="集团名称：">
            <el-input name="GroupName" v-model="form.GroupName"></el-input>
          </el-form-item>
          <el-form-item label="创建日期：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              type="daterange"
              v-model="form.CreateTime"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="集团电话：" prop="Phone">
            <el-input name="Phone" v-model="form.Phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="Contact">
            <el-input name="Contact" v-model="form.Contact"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机：" prop="Mobile">
            <el-input name="Mobile" v-model="form.Mobile"></el-input>
          </el-form-item>
          <el-form-item label="所在地区：" prop="Area">
            <el-cascader
              filterable
              v-model="form.Area"
              :options="$store.getters.areas"
              ref="cascader"
              change-on-select
              placeholder="选择地区"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="PackId" label="类型/套餐：">
            <el-select name="PackId" v-model="form.PackId" clearable placeholder="请选择" filterable>
              <el-option label="全部" value></el-option>
              <el-option
                v-for="item in packList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      element-loading-text="拼命加载中"
      v-loading="$store.getters.tb_loading"
      @sort-change="sortChange"
    >
      <el-table-column fixed label="集团编码" show-overflow-tooltip prop="GroupCode" sortable="customn"></el-table-column>
      <el-table-column show-overflow-tooltip label="集团名称" prop="GroupName"></el-table-column>
      <el-table-column show-overflow-tooltip label="类型/套餐" prop="PackId" :formatter="formatter"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="创建日期"
        width="100"
        prop="CreateTime"
        sortable="customn"
      >
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDate }}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="地区"
        width="180"
        prop="AddressExt"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="集团电话" prop="Phone"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系人" prop="Contact"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系人手机" prop="Mobile"></el-table-column>
      <el-table-column label="状态" prop="State" :formatter="formatter"></el-table-column>
      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scoped">
          <el-button
            name="detailLink"
            @click="
              $router.push({
                path: `/setter/group/detail?GroupId=${
                  scoped.row.GroupId
                }&state=1`
              })
            "
            type="text"
          >查看</el-button>
          <el-button
            name="editLink"
            v-if="scoped.row.State === EnableState.Enable"
            type="text"
            @click="
              $router.push({
                path: `/setter/group/edit?GroupId=${scoped.row.GroupId}&state=2`
              })
            "
          >修改</el-button>
          <el-button
            name="changePWDLink"
            v-if="scoped.row.State === EnableState.Enable"
            type="text"
            @click="changePWD(scoped.row)"
          >重置密码</el-button>
          <el-button
            name="disableLink"
            v-if="scoped.row.State === EnableState.Enable"
            type="text"
            @click="Disable($event,scoped.row.GroupId, scoped.$index)"
          >停用</el-button>
          <el-button
            name="enableLink"
            v-else
            type="text"
            @click="Enable($event,scoped.row.GroupId, scoped.$index)"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <el-dialog
      title="重置密码"
      width="410px"
      :visible.sync="DaialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        class="item-lh-26"
        :model="PWDData"
        ref="PWDData"
        :rules="rules"
        lable-width="120px"
        :inline="true"
      >
        <el-form-item label="管理员账号：" prop="LoginId">
          <span>{{ PWDData.LoginId }}</span>
        </el-form-item>
        <el-form-item label="新密码：" prop="Loginpass2">
          <el-input
            name="Loginpass"
            type="password"
            placeholder="5-20个字符"
            v-model="PWDData.Loginpass2"
            :maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          name="confirm"
          :loading="$store.getters.is_loading"
          type="primary"
          @click="savePWD('PWDData')"
        >确定</el-button>
        <el-button name="cancel" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MERCHANT_API_GROUP_BASIC_GETS, // 集团服务 - 检索
  MERCHANT_API_DROPDOWN_PACKBASICLIST, // 套餐 - 列表(下拉)
  MERCHANT_API_GROUP_BASIC_ENABLE, // 集团服务 - 启用
  MERCHANT_API_GROUP_BASIC_DISABLE, // 集团服务 - 停用
  MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT // 用户账号服务 - 修改密码(平台)
} from '@/apis/merchant.js'

import { YNStatus, CharacterType, EnableState } from '@/enums/common.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      form: {
        Area: ['', '', ''],
        GroupCode: '',
        GroupName: '',
        ProvinceId: '',
        CityId: '',
        Contact: '',
        Mobile: '',
        Phone: '',
        CreateTime: [],
        OrderBy: 0,
        IsAsced: YNStatus.No,
        State: 0,
        PackId: '',
        PageIndex: 1,
        PageSize: 10
      },
      parameter: {},
      total: 0,
      tableData: [],
      packList: [],
      statusList: [],
      PWDData: {
        CharacterId: '',
        LoginId: '',
        Loginpass2: ''
      },
      rules: {
        Loginpass2: [
          {
            required: true,
            message: '密码不能为空！'
          },
          {
            min: 5,
            max: 20,
            message: '5-20个字符'
          }
        ]
      },
      CharacterType,
      EnableState,
      dialogStart: false,
      dialogStop: false,
      DaialogFormVisible: false
    }
  },
  watch: {
    $route: 'init'
  },
  created() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.getPackList()
    this.init()
  },
  methods: {
    // 获取类型/套餐数据
    getPackList() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: this.CharacterType.Group
      }).then(res => {
        res.data.Data.Rows.forEach(item => {
          this.packList.push({
            value: item.Id,
            name: item.Value
          })
        })
      })
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/group/index',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.Area = query.Area || ['', '', '']
      this.parameter.GroupCode = query.GroupCode || ''
      this.parameter.GroupName = query.GroupName || ''
      this.parameter.ProvinceId = query.ProvinceId || ''
      this.parameter.CityId = query.CityId || ''
      this.parameter.Contact = query.Contact || ''
      this.parameter.Mobile = query.Mobile || ''
      this.parameter.Phone = query.Phone || ''
      this.parameter.OrderBy = query.OrderBy || 0
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.State = query.State > 0 ? query.State : 0
      this.parameter.PackId = query.PackId || ''
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.form))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs.search.resetFields()
      this.form.State = 0
      this.form.Area = ['', '', '']
      this.form.CreateTime = []
      this.form.PackId = ''
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      const { CreateTime, Area } = this.parameter
      let parameter = Object.assign(this.form, this.parameter, {
        CreateTime1: CreateTime[0],
        CreateTime2: CreateTime[1],
        ProvinceId: +Area[0],
        CityId: +Area[1] || 0,
        TownId: +Area[2] || 0
      })
      MERCHANT_API_GROUP_BASIC_GETS(parameter).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    createShop() {
      this.$router.push('/setter/group/create')
    },
    formatter(row, col) {
      let tpr
      switch (col.property) {
        case 'AddressExt':
          tpr = row.ProvinceName + '、' + row.CityName + '、' + row.TownName
          break
        case 'PackId':
          this.packList.forEach(m => {
            if (m.value == row.PackId) {
              tpr = m.name
            }
          })
          break
        case 'State':
          tpr = this.EnableState.Types[row.State]
          break
        default:
          tpr = row[col.property]
          break
      }
      return tpr
    },
    sizeChange(value) {
      // 切换每页显示数
      this.parameter.PageSize = value
      this.parameter.PageIndex = 1
      this.initRoute()
    },
    currentChange(value) {
      // 切换当前页
      this.parameter.PageIndex = value
      this.initRoute()
    },
    sortChange(sort) {
      // (0= 创建日期，1=集团编码)
      switch (sort.prop) {
        case 'CreateTime':
          this.form.OrderBy = 0
          break
        case 'GroupCode':
          this.form.OrderBy = 1
          break
        default:
          this.form.OrderBy = 0
          break
      }
      if (!sort.order) {
        this.form.IsAsced = YNStatus.No
      } else {
        this.form.IsAsced =
          sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      }
      this.onSearch()
    },
    handleClose() {
      this.DaialogFormVisible = false
      this.$store.commit('SET_BTN_LOADING', false)
      this.$refs['PWDData'].resetFields()
    },
    changePWD(data) {
      this.DaialogFormVisible = true
      this.PWDData.LoginId = data.AdministratorId
      this.PWDData.CharacterId = data.CharacterId
    },
    savePWD(PWDData) {
      this.$refs[PWDData].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT(this.PWDData).then(
            res => {
              this.$store.commit('SET_BTN_LOADING', false)
              if (res.data.Code == 'CORRECT') {
                this.DaialogFormVisible = false
                this.$refs[PWDData].resetFields()
              }
            }
          )
        }
      })
    },
    Enable(e, id, i) {
      e.currentTarget.blur()
      this.$confirm('是否确认启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.isLoading = true
          MERCHANT_API_GROUP_BASIC_ENABLE({
            GroupId: id
          }).then(res => {
            // this.isLoading = false
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '启用成功!'
              })
              this.tableData[i].State = EnableState.Enable

              this.$set(this.tableData[i], 'State', this.tableData[i].State)
            }
          })
        })
        .catch(() => {})
    },
    Disable(e, id, i) {
      e.currentTarget.blur()
      this.$confirm('是否确认停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.isLoading = true
          MERCHANT_API_GROUP_BASIC_DISABLE({
            GroupId: id
          }).then(res => {
            // this.isLoading = false
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '停用成功!'
              })
              this.tableData[i].State = EnableState.Disable

              this.$set(this.tableData[i], 'State', this.tableData[i].State)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

