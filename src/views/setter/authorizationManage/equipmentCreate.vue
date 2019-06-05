<template>
  <div class="m-x-20 contente-view border-1px">
    <div>
      <el-row
        :gutter="20"
        class="p-y-10"
        type="flex"
        align="middle"
      >
        <el-col :span="3">
          <p class="text-right">*授权角色序号：</p>
        </el-col>
        <el-col :span="4">
          <el-input
            name="CharacterId"
            v-model="creatData.CharacterId"
            disabled
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            name="searchCharacterId"
            type="primary"
            @click="search"
          >查找</el-button>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="p-y-10"
      >
        <el-col :span="3">
          <p class="text-right">*门店名称：</p>
        </el-col>
        <el-col :span="4">
          <p>{{creatData.StoreName}}</p>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="p-y-10"
      >
        <el-col
          :span="4"
          :push="2"
        >
          <el-button
            name="save"
            type="primary"
            :disabled="!hasStore"
            :loading="btnLoading"
            @click="save"
          >保存</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="授权角色序号"
      width="60%"
      :visible.sync="dialogVisible"
    >
      <div class="search-box p-l-10">
        <el-form
          inline
          :model="form"
          @submit.native.prevent
          @keyup.enter.native="search"
        >
          <el-form-item label="门店名称：">
            <el-input
              name="StoreName"
              v-model="form.StoreName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              name="searchStoreName"
              type="primary"
              icon="el-icon-search"
              @click="search"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData">
        <el-table-column
          label="商户序号"
          align="center"
          prop="CompanyId"
        ></el-table-column>
        <el-table-column
          label="角色序号"
          align="center"
          prop="CharacterId"
        ></el-table-column>
        <el-table-column
          label="门店序号"
          align="center"
          prop="StoreId"
        ></el-table-column>
        <el-table-column
          label="门店名称"
          align="center"
          prop="StoreName"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scoped">
            <el-button
              name="addStore"
              type="text"
              @click="addStore(scoped.row)"
            >添加</el-button>
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
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="cancelDialog"
          @click="dialogVisible = false"
        >取 消</el-button>
        <el-button
          name="confirmDialog"
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  MERCHANT_API_STORE_BASIC_GETS // 门店基本资料 - 检索
} from '@/apis/merchant.js'
import {
  MARKETING_API_CASHIER_EQUIPMENT_CREATE // 设备服务 - 创建
} from '@/apis/marketing.js'

import pagination from '@/components/pagination.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      dialogVisible: false,
      creatData: {},
      form: {
        StoreName: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0,
      loading: false,
      hasStore: false,
      btnLoading: false
    }
  },
  methods: {
    search() {
      this.dialogVisible = true
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      this.getData()
    },
    getData() {
      this.loading = true
      this.parameter.OpenTime1 = '1900-01-01 00:00:00.000'
      this.parameter.OpenTime2 = ''
      this.form = Object.assign(this.form, this.parameter)
      MERCHANT_API_STORE_BASIC_GETS(this.form).then(res => {
        this.total = res.data.Data.Count
        this.tableData = res.data.Data.Rows
        this.loading = false
      })
    },
    addStore(data) {
      this.dialogVisible = false
      this.creatData = data
      this.hasStore = true
    },
    save() {
      this.btnLoading = true
      let obj
      obj = Object.assign(
        {},
        {
          CharacterId: this.creatData.CharacterId,
          StoreCode: this.creatData.StoreCode,
          StoreTitle: this.creatData.StoreName
        }
      )
      MARKETING_API_CASHIER_EQUIPMENT_CREATE(obj)
        .then(res => {
          this.btnLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$router.go(-1)
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    sizeChange(val) {
      this.parameter.PageSize = parseInt(val)
      this.parameter.PageIndex = 1
      this.getData()
    },
    currentChange(val) {
      this.parameter.PageIndex = parseInt(val)
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.text-right {
  text-align: right;
}
</style>
