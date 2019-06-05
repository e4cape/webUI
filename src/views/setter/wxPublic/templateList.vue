<template>
  <div>
    <ul class="tabs border-bottom-1px">
      <li class="tab" name="tab0" @click="handleClick(false)" :class="{'active': !isStore}">公众号在总部</li>
      <li class="tab" name="tab1" @click="handleClick(true)" :class="{'active': isStore}">公众号在门店</li>
    </ul>
    <div class="content-box p-10">
      <el-form class="fix-w" :inline="true" :model="form" ref="form" @keyup.enter.native="onSearch">
        <search-panel @onSearch="onSearch('true')" @onReset="onReset">
          <template slot="btnBox">
            <el-form-item>
              <el-button name="createStoreAndTemplate" v-if="isStore" type="primary" @click="$router.push({path:'/setter/wxpublic/createtemplate?isStore=true'})">新增门店及模板</el-button>
              <el-button name="createMerchantAndStemplate" v-else type="primary" @click="$router.push({path:'/setter/wxpublic/createtemplate?isStore=false'})">新增商户及模板</el-button>
            </el-form-item>
          </template>
          <template slot="simpleSearch">
            <el-form-item prop="CharacterId">
              <el-input name="CharacterIdSearchInput" v-model="form.CharacterId" placeholder="角色序号">
                <el-button name="CharacterIdonSearch" @click="onSearch('false')" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </template>
          <template slot="seniorSearch">
            <el-form-item label="角色序号：" prop="CharacterId" width="150" show-overflow-tooltip>
              <el-input name="CharacterId" v-model="form.CharacterId"></el-input>
            </el-form-item>
            <el-form-item v-if="isStore" label="门店名称：" prop="StoreTitle" show-overflow-tooltip>
              <el-input name="StoreTitle" v-model="form.StoreTitle"></el-input>
            </el-form-item>
            <el-form-item v-else label="商户名称：" prop="CompanyTitle" width="300" show-overflow-tooltip>
              <el-input name="CompanyTitle" v-model="form.CompanyTitle"></el-input>
            </el-form-item>
          </template>
        </search-panel>
      </el-form>
      <el-table :data="tableData" v-loading="$store.getters.tb_loading">
        <el-table-column label="角色序号" prop="CharacterId" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isStore" label="门店名称" prop="StoreTitle" show-overflow-tooltip></el-table-column>
        <el-table-column v-else label="商户名称" prop="CompanyTitle" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column label="模板类型" :formatter="formatter" prop="TemplateTypes" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scoped">
            <el-button
              name="detail"
              type="text"
              @click="$router.push({path:`/setter/wxpublic/templatelistdetail?CharacterId=${scoped.row.CharacterId}&isStore=${isStore}&${isStore?('StoreTitle='+scoped.row.StoreTitle):('CompanyTitle='+scoped.row.CompanyTitle)}`})"
            >详情</el-button>
            <el-button
              name="addTemplate"
              type="text"
              @click="$router.push({path:`/setter/wxpublic/createtemplate?CharacterId=${scoped.row.CharacterId}&isStore=${isStore}&${isStore?('StoreTitle='+scoped.row.StoreTitle):('CompanyTitle='+scoped.row.CompanyTitle)}`})"
            >添加模板</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_COMPANYTEMPLATELIST, //  微信管理 - 总部模版(列表)
  MARKETING_API_WEB_CHAT_STORETEMPLATELIST // 微信管理 - 门店消息模版(列表)
} from '@/apis/marketing.js'

import { WxTemplateType } from '@/enums/component.js'

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
        CharacterId: '',
        StoreTitle: '',
        CompanyTitle: '',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      parameter: {},
      tableData: [],
      activeIndex: '2',
      WxTemplateType,
      activeName: 'first',
      isStore: true
    }
  },
  created() {
    if (this.$route.query.isStore) {
      if (this.$route.query.isStore == 'true') {
        this.isStore = true
      } else {
        this.isStore = false
      }
    }
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    init() {
      let query = this.$route.query
      if (this.isStore) {
        this.parameter.CharacterId = query.CharacterId || ''
        this.parameter.StoreTitle = query.StoreTitle || ''
      } else {
        this.parameter.CharacterId = query.CharacterId || ''
        this.parameter.CompanyTitle = query.CompanyTitle || ''
      }

      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/wxpublic/wxtemplatelist',
        query: Object.assign({}, this.parameter, {
          isStore: this.isStore
        })
      })
    },
    onSearch(flag) {
      // 搜索相关
      if (flag == 'true') {
        this.form.isSenior = true
      } else {
        this.form.isSenior = false
      }
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs.form.resetFields()
      this.onSearch()
    },
    handleClick(flag) {
      this.isStore = flag
      this.$router.replace({
        path: `/setter/wxpublic/wxtemplatelist?isStore=${this.isStore}`
      })
    },
    formatter(value) {
      let str = []
      for (let i = 0; i < value.TemplateTypes.split(',').length; i++) {
        str.push(WxTemplateType.Types[value.TemplateTypes.split(',')[i]])
      }
      return str.join('、') || '--'
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      let obj
      this.tableData = []
      if (this.isStore) {
        obj = Object.assign(
          {},
          {
            PageIndex: this.parameter.PageIndex,
            PageSize: this.parameter.PageSize
          },
          {
            CharacterId: +this.form.CharacterId,
            StoreTitle: this.form.StoreTitle
          }
        )
        MARKETING_API_WEB_CHAT_STORETEMPLATELIST(obj).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.tableData = res.data.Data.Rows
            this.total = res.data.Data.Count || 0
          }
          this.$store.commit('SET_TB_LOADING', false)
        })
      } else {
        obj = Object.assign(
          {},
          {
            PageIndex: this.parameter.PageIndex,
            PageSize: this.parameter.PageSize
          },
          {
            CharacterId: +this.form.CharacterId,
            CompanyTitle: this.form.CompanyTitle
          }
        )
        MARKETING_API_WEB_CHAT_COMPANYTEMPLATELIST(obj).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.tableData = res.data.Data.Rows
            this.total = res.data.Data.Count || 0
          }
          this.$store.commit('SET_TB_LOADING', false)
        })
      }
      this.form = Object.assign(this.form, this.parameter)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.m-x-20 {
  margin: 0 20px;
}
.border-1px {
  border: 1px solid #e5e5e5;
}
.border-bottom-1px {
  border-bottom: 1px solid #e5e5e5;
}
// .m-b-10{
//   margin-bottom: 10px;
// }
.content-box {
  border: 1px solid #e5e5e5;
  border-top: none;
}
</style>
<style lang="scss">
.wx-tem .el-tabs__nav-scroll {
  padding-left: 20px;
}

.wx-tem .el-tabs__item {
  padding: 0 20px !important;
}

.wx-tem .search-t {
  padding-left: 20px;
  padding-top: 15px;
  padding-bottom: 5px;
  background: #f5f5f5;
  .el-form-item__label {
    color: #333;
    padding-right: 6px;
    line-height: 28px;
  }
  .el-form-item__content {
    line-height: 28px;
  }
}
</style>
