<template>
  <div class="content">
    <el-form name="btnMemberManageForm" :model="queryForm" ref="queryForm" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset" name="btnMemberManageSearch">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" name="btnResultStatus" :loading="resultStatus == 1" @click="showImport=true">导入老会员</el-button>
            <span class="red" v-if="resultMessage">&emsp;上次导入的结果：{{resultMessage}}</span>&emsp;
            <el-button name="btnShowImport" type="text" v-if="resultStatus == 0 && resultError.length" @click="importError=true">详情</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="btnMemberManageName" placeholder="姓名" v-model="queryForm.name" @keyup.enter.native="onSearch">
              <el-button name="btnSearchName" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="姓名：" prop="name">
            <el-input name="btnEnterSearch" v-model="queryForm.name" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sexType">
            <el-select name="btnSelectSexType" v-model="queryForm.sexType">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in sexyTypes.Types" :key="item.key" :value="item.key" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input name="btnEnterPhone" v-model="queryForm.mobile" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" class="table" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="membershipId" fixed label="ID" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" fixed label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sexTypeText" label="性别" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="birthday" label="生日" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="地址" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goods1" label="所购商品1" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="catagory1" label="商品品类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buyDate1" label="购买日期" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goods2" label="所购商品2" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="catagory2" label="商品品类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buyDate2" label="购买日期" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="auditStatusText" label="操作" min-width="140" fixed="right">
        <template slot-scope="scope">
          <router-link name="btnLinkCheckMember" :to="{path:'/message/memberManage/checkMember',query:{membershipId:scope.row.membershipId}}" class="btn-link el-button el-button--text">详情</router-link>
          <router-link name="btnLinkEditMember" :to="{path:'/message/memberManage/editMember',query:{membershipId:scope.row.membershipId}}" class="btn-link el-button el-button--text">修改</router-link>
          <el-button name="btnDeleteMember" type="text" @click="deleteMember(scope.row.membershipId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <el-dialog title="导入老会员" :visible.sync="showImport" width="580px" :before-close="closeDialog">
      <el-alert title="说明：" type="warning">
        <div class="instructions" slot>
          <p>1、老会员导入仅针对门店在使用本系统前所积累的老会员资料的导入，以便向老会员推送短信，引导老会员回归。</p>
          <p>2、使用本系统后获得的客户毋须导入。</p>
          <p>3、需按系统指定的模板编辑整理客户资料上传，<a :href="$root.settings.DOMAIN_FILE + '/messagecloud/导入客户资料EXCEL模板.xlsx'" target="_blank">下载客户资料EXCEL模板</a></p>
        </div>
      </el-alert>
      <el-upload name="btnUploadTemplate" class="upload-template" :action="$root.settings.DOMAIN_APIS.Message + '/api/Uploader/UploadToTempAsync'" :on-success="handleSuccess" accept=".xlsx,.xls" :show-file-list="false">
        <el-button name="btnUploadMember" type="primary">上传客户资料模版</el-button>
      </el-upload>
      <div v-if="file" class="file-list"><i class="el-icon-document"></i> {{this.file}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnUploadFile" type="primary" :loading="$store.getters.is_loading" @click="uploadFile">上 传</el-button>
        <el-button name="btnColseModal" @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入失败详情" :visible.sync="importError" width="500px">
      <div v-for="item in resultError" :key="item" class="m-t-10">{{item}}</div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import {
  SexyTypes 
} from '@/enums/message'
import {
  MESSAGE_API_MEMBERSHIP_SEARCH,
  MESSAGE_API_MEMBERSHIP_DELETEMEMBERSHIP,
  MESSAGE_API_MEMBERSHIP_SAVEUPLOADMEMBERSHIP,
  MESSAGE_API_MEMBERSHIP_GETUPLOADRESULT
} from '@/apis/message'
export default {
  data() {
    return {
      sexyTypes: SexyTypes,
      queryForm: {
        name: '',
        sexType: '',
        mobile: '',
        pageIndex: 1,
        pageSize: 10
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {
      }, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      showImport: false,
      fileName: '', // 上传到临时文件目录的路径
      resultMessage: '', // 上传老会员的处理结果
      resultStatus: 0, // 上传老会员的处理状态
      resultError: [], // 上传老会员的错误
      file: '',
      importError: false // 导入失败详情
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameter 
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.name = query.name || ''
      this.parameter.sexType = query.sexType || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 10
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_MEMBERSHIP_SEARCH(
        Object.assign(this.queryForm, this.parameter)
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$store.commit('SET_TB_LOADING', false)
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    deleteMember(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MESSAGE_API_MEMBERSHIP_DELETEMEMBERSHIP({
          membershipId: id 
        }).then(
          res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message.success('删除成功!')
            }
          }
        )
      })
    },
    handleSuccess(response, file) {
      if (response.Code === 'CORRECT') {
        this.fileName = response.Data[0]
        this.file = file.name
      }
    },
    uploadFile() {
      if (!this.fileName && !this.file) {
        this.$message.warning('请选择上传文件!')
        return false
      }
      this.$store.commit('SET_BTN_LOADING', true)
      MESSAGE_API_MEMBERSHIP_SAVEUPLOADMEMBERSHIP({
        fileName: this.fileName
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.showImport = false
          this.$message.success('上传完成，请留意上传结果信息')
          this.handleResult()
          this.getData()
        }
      })
    },
    closeDialog() {
      this.file = ''
      this.showImport = false
    },
    handleResult() {
      MESSAGE_API_MEMBERSHIP_GETUPLOADRESULT().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.resultMessage = res.data.Data.message
          this.resultStatus = res.data.Data.status
          this.resultError = res.data.Data.errors || []
          if (this.resultStatus === 1) {
            setTimeout(this.handleResult, 5000)
          }
        }
      })
    }
  },
  mounted() {
    this.init()
    this.handleResult()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel
  }
}
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 10px;
  color: #f5222d;
}
.instructions {
  font-size: 12px;
  p {
    margin-bottom: 8px;
    line-height: 18px;
  }
}
.upload-template {
  text-align: center;
  padding-top: 10px;
}
.file-list {
  text-align: center;
  margin-top: 10px;
  .el-icon-document {
    font-size: 14px;
    margin-right: 7px;
  }
}
</style>