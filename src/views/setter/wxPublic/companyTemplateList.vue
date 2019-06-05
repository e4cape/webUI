<template>
  <div>
    <ul class="tabs border-bottom-1px m-b-10">
      <li name="tab0" class="tab active">公众号在总部</li>
      <li name="tab1" class="tab" @click="$router.push({path: '/setter/wxpublic/cmptemplatelist'})">公众号在门店</li>
    </ul>

    <el-form :inline="true" :model="formInline" @keyup.enter.native="getList(true)" class="demo-form-inline">
      <el-form-item label="商户序号：">
        <el-input name="CompanyId" v-model="formInline.CompanyId"></el-input>
      </el-form-item>
      <el-form-item label="商户名称：">
        <el-input name="CompanyTitle" v-model="formInline.CompanyTitle"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button name="getList" type="primary" icon="fa fa-search" @click="getList(true)">搜索</el-button>
      </el-form-item>
    </el-form>

    <div class="p-20 tool"></div>
    <el-table :data="tableData">
      <el-table-column align="center" header-align="center" label="门店序号" prop="CompanyId"></el-table-column>
      <el-table-column align="center" width="500" header-align="center" label="门店名称" prop="CompanyTitle"></el-table-column>
      <el-table-column align="center" width="500" header-align="center" label="模板类型" :formatter="formatter" prop="TemplateType"></el-table-column>
      <el-table-column align="center" header-align="center" label="操作">
        <template slot-scope="scoped">
          <span name="companyTemplateDetail" class="table-tool" @click="$router.push({path:'/wx/templatelist/companytemplatedetail/'+scoped.row.CompanyId})">详情</span>
          <span name="createsCompanyTemplate" class="table-tool" @click="$router.push({path:'/wx/templatelist/createscompanytemplate'})">添加模板</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-nav">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.PageIndex"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="page.PageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { WxTemplateType } from '@/enums/component.js'
export default {
  data() {
    return {
      formInline: {},
      tableData: [{}],
      activeIndex: '1',
      page: {
        PageIndex: 1,
        PageSize: 10,
        total: 0
      },
      activeName: 'first'
    }
  },
  methods: {
    formatter() {
      return WxTemplateType.Types[arguments[2]] || '--'
    },
    getList(flag) {
      let page

      if (!flag) {
        page = this.page
      } else {
        page = {
          PageIndex: 1,
          PageSize: 10
        }
        this.page = {
          PageIndex: 1,
          PageSize: 10,
          total: 0
        }
      }
      const obj = Object.assign({}, this.formInline, page)
      this.API_WX_COMPANYTEMPLATELIST(obj).then(res => {
        this.tableData = res.data.Data.Subset
        this.page.total = res.data.Data.TotalItemCount
        this.isLoading = false
      })
    },
    handleSizeChange(value) {
      // 切换每页显示数
      this.page.PageSize = value
      this.page.PageIndex = 1
      this.getList()
    },
    handleCurrentChange(value) {
      // 切换当前页
      this.page.PageIndex = value

      this.getList()
    }
  },
  mounted() {
    // this.getEnums()
    this.getPage()
    this.getList()
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
