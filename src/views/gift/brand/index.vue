<template>
  <div>
    <el-form :model="queryForm" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnCreate" type="primary" @click="onCreate">新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="status" filterable v-model="queryForm.status" @change="onSearch">
              <el-option label="所有状态" value=""></el-option>
              <el-option v-for="item in brandStatus.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cnName">
            <el-input name="cnName" v-model="queryForm.cnName" placeholder="品牌名称">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch" prop="">
          <el-form-item label="品牌名称：" prop="cnName">
            <el-input name="cnName"  v-model="queryForm.cnName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="英文/拼音：" prop="enName">
            <el-input name="enName"  v-model="queryForm.enName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建日期：" prop="createTime">
            <el-date-picker name="createTime" v-model="queryForm.createTime" type="daterange" :unlink-panels="true" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="imageUrl" label="LOGO" width="100" fixed>
        <template slot-scope="scope">
          <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl" style="width:50px;" />
        </template>
      </el-table-column>
      <el-table-column prop="code" label="编码" min-width="100" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="cnName" label="品牌名称" min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="enName" label="英文/拼音" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="platformTypeText" label="来源" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createUser" label="创建人" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" label="状态" width="100" show-overflow-tooltip fixed="right"></el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnEdit" type="text" v-if="scope.row.status != brandStatus.Nullify"  @click="modifyBrand(scope.row)">修改</el-button>
          <el-button name="btnAudit" type="text" @click="auditBrand(scope.row)" v-if="scope.row.status == brandStatus.NotAudit">审核</el-button>
          <el-button name="btnNullify" type="text" @click="abandonBrand(scope.row)" v-if="scope.row.status != brandStatus.Nullify">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- @module 编辑 -->
    <el-dialog :title="(editForm.brandId ? '编辑': '新建')" width="500px" :visible.sync="editVisible" @close="resetEditForm">
      <el-form class="fix-w" label-position="right" label-width="100px" :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="品牌编码：" prop="code">
          <el-input name="code" v-model="editForm.code" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称：" prop="cnName">
          <el-input name="cnName" v-model="editForm.cnName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="英文/拼音：" prop="enName">
          <el-input name="enName" v-model="editForm.enName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="imageUrl">
          <el-input name="imageUrl" v-model="editForm.imageUrl" v-show="false"></el-input>
          <el-upload name="btnAvatar" class="avatar-uploader" :action="$root.settings.DOMAIN_APIS.Gifting + '/api/Uploader/UploadImageAsync?pathType=' + imageUploadPaths.Brand" :show-file-list="false" accept="image/png,image/jpeg,image/jpg" :on-success="uploaderSuccess" :on-error="uploaderError" :before-upload="uploaderBefore" v-loading="uploading">
            <div class="uploader">
              <template v-if="editForm.imageUrl">
                <img :src="$root.settings.DOMAIN_IMAGE + editForm.imageUrl" alt="">
              </template>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="saveBrand" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancel" @click="resetEditForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑 -->
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import SearchPanel from '@/components/searchPanel.vue'
import {
  BrandStatus, ImageUploadPaths 
} from '@/enums/gifting'
import {
  GIFTING_API_BRAND_SEARCH,
  GIFTING_API_BRAND_CREATE,
  GIFTING_API_BRAND_SAVEUPDATE,
  GIFTING_API_BRAND_SAVEAUDIT
} from '@/apis/gifting'
import {
  YNStatus
} from '@/enums/common'
export default {
  data() {
    return {
      imageUploadPaths: ImageUploadPaths,
      brandStatus: BrandStatus,
      queryForm: {
        cnName: '',
        enName: '',
        status: '',
        createTime: '',
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {
      }, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      editVisible: false,
      editForm: {
        code: '',
        cnName: '',
        enName: '',
        imageUrl: ''
      },
      editRules: {
        code: [
          {
            required: true,
            message: '请填写品牌编码',
            trigger: 'change'
          }
        ],
        cnName: [
          {
            required: true,
            message: '请填写品牌名称',
            trigger: 'change'
          }
        ],
        imageUrl: [
          {
            required: true,
            message: '请上传LOGO',
            trigger: 'change'
          }
        ]
      },
      uploading: false
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/brand/index',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    onCreate() {
      this.editVisible = true
      this.editForm = {
      }
    },
    init() {
      let query = this.$route.query
      this.parameter.status = query.status || ''
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.cnName = query.cnName || ''
      this.parameter.enName = query.enName || ''
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        createTimeStart: this.parameter.createTime[0],
        createTimeEnd: this.parameter.createTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_BRAND_SEARCH(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    sortChange(sort) {
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
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
    saveBrand() {
      console.log(this.editForm.imageUrl)
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          let apiName = GIFTING_API_BRAND_CREATE
          if (this.editForm.brandId) {
            apiName = GIFTING_API_BRAND_SAVEUPDATE
          }
          this.$store.commit('SET_BTN_LOADING', true)
          apiName(this.editForm).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存成功！')
              this.editVisible = false
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    resetEditForm() {
      this.editBrandForm = {
        SubId: '',
        SystemId: '',
        SubName: ''
      }
      this.$refs['editForm'].resetFields()
      this.editVisible = false
    },
    uploaderBefore(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error('请上传正确文件!')
        return false
      }
      this.uploading = true
    },
    uploaderSuccess(response) {
      if (response.Code === 'CORRECT') {
        this.$set(this.editForm, 'imageUrl', response.Data[0])
        // this.editForm.imageUrl = response.Data[0]
        this.uploading = false
      }
    },
    uploaderError() {
      this.uploading = false
      this.$message('上传失败', 'error')
    },
    modifyBrand(item) {
      this.editForm = {
        brandId: item.brandId,
        code: item.code,
        cnName: item.cnName,
        enName: item.enName,
        imageUrl: item.imageUrl
      }
      this.editVisible = true
    },
    auditBrand(item) {
      this.$confirm('确定审核?', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        GIFTING_API_BRAND_SAVEAUDIT({
          brandId: item.brandId,
          status: this.brandStatus.Audited
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已审核！')
            this.getData()
          }
        })
      })
    },
    abandonBrand(item) {
      this.$confirm('确定作废?', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        GIFTING_API_BRAND_SAVEAUDIT({
          brandId: item.brandId,
          status: this.brandStatus.Nullify
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已作废！')
            this.getData()
          }
        })
      })
    }
  },
  beforeMount() {
    this.init()
  },
  mounted() {},
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    SearchPanel
  }
}
</script><style lang="scss" scoped>
.avatar-uploader {
  position: relative;
  display: block;
  z-index: 9;
  width: 70px;
  height: 70px;
  border: dashed 1px #ddd;
  overflow: hidden;
  .uploader {
    width: 70px;
    height: 70px;
    margin-top: 0;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      z-index: 5;
    }
  }
  .avatar-uploader-icon {
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 28px;
  }
}
</style>
