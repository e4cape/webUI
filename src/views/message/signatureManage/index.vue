<template>
  <div class="content">
    <el-form name="btnSignatureMenageForm" :model="queryForm" ref="queryForm" lable-width="120px" class="item-lh-26" :inline="true">
      <el-alert title="说明：" type="warning">
        <div class="instructions" slot>
          <p>1、在此新增的短信签名必是在运营商处创建并通过审核的签名；</p>
          <p>2、【重要】未在运营商处创建并通过审核的签名，在此创建后无法使用。</p>
        </div>
      </el-alert>
      <search-panel name="btnSinatureSearch" @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnShowCreateModal" type="primary" @click="showCreateSignature=true">
              <i class="el-icon-plus el-icon--left"></i>新增签名
            </el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="btnEnterSerialNum" placeholder="序号" v-model="queryForm.signatureId" @keyup.enter.native="onSearch">
              <el-button name="btnClickSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker
              name="btnCreateTime"
              v-model="queryForm.createTime"
              type="daterange"
              unlink-panels
              :picker-options="$root.datePickerOptions"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="序号：" prop="signatureId">
            <el-input name="btnEnterSerial" v-model="queryForm.signatureId" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="签名名称：" prop="signature">
            <el-input name="btnSignatureName" v-model="queryForm.signature" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" class="table m-t-10" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="signatureId" fixed label="序号" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="signature" label="签名名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateTypeName" label="适用模版类型" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createUser" label="创建人" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="auditStatusText" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnDeleteMember" type="text" @click="deleteMember(scope.row.signatureId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增签名" :visible.sync="showCreateSignature" width="40%" :before-close="beforeclose">
      <el-alert title="请录入在短信运营商（SP）处创建并审核通过的签名，否则无效！" type="warning"></el-alert>
      <el-form :model="createForm" label-width="120px" ref="createForm" :rules="rules">
        <el-form-item label="使用模版类型：" prop="templateType">
          <el-radio-group name="btnUseTemplateType" v-model="createForm.templateType">
            <el-radio v-for="item in templateTypes.Types" :key="item.key" :label="item.key">{{item.title}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名名称：" prop="signature">
          <el-input name="btnSignatureName" v-model="createForm.signature" placeholder="3-10个中英文字符"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnConfirmCreate" type="primary" @click="createSignature">确 定</el-button>
        <el-button name="btnCancel" @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { TemplateTypes } from '@/enums/message'
import { CharacterType } from '@/enums/common'
import {
  MESSAGE_API_SIGNATURE_SEARCH,
  MESSAGE_API_SIGNATURE_DELETE,
  MESSAGE_API_SIGNATURE_CREATE
} from '@/apis/message'
export default {
  data() {
    var checkSignature = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('签名名称不能为空'))
      }
      if (/^[\u4E00-\u9FA0A-Za-z]{3,10}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入3-10个中英文字符'))
      }
    }
    return {
      templateTypes: TemplateTypes,
      characterType: CharacterType,
      queryForm: {
        signatureId: '',
        signature: '',
        createTime: '',
        pageIndex: 1,
        pageSize: 10
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {}, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      showCreateSignature: false,
      createForm: {
        templateType: TemplateTypes.Notification,
        signature: ''
      },
      rules: {
        templateType: {
          required: true,
          message: '请选择模版类型',
          trigger: 'blur'
        },
        signature: {
          validator: checkSignature,
          trigger: 'blur',
          required: true
        }
      }
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.signatureId = query.signatureId || ''
      this.parameter.signature = query.signature || ''
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 10
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        startTime: this.parameter.createTime[0],
        endTime: this.parameter.createTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_SIGNATURE_SEARCH(Object.assign(parameter)).then(res => {
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
      this.parameter = Object.assign({}, this.queryForm)
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
        MESSAGE_API_SIGNATURE_DELETE({
          signatureId: id
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            if (this.data.length == 1) {
              this.parameter.pageIndex = 1
              this.queryForm.pageIndex = 1
            }
            this.getData()
            this.$message.success('删除成功!')
          }
        })
      })
    },
    createSignature() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          MESSAGE_API_SIGNATURE_CREATE(this.createForm).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.showCreateSignature = false
              this.$refs['createForm'].resetFields()
              this.getData()
            }
          })
        } else {
          return this.$message.error('新增失败')
        }
      })
    },
    handleCancel() {
      this.showCreateSignature = false
      this.$refs['createForm'].resetFields()
    },
    beforeclose(done) {
      done()
      this.$refs['createForm'].resetFields()
    }
  },
  created() {
    // if (this.$store.getters.user_session.CharacterType !== this.characterType.Lingcb) {
    //   this.$message.error('账号权限不足')
    //   this.$router.push('/login')
    // }
  },
  mounted() {
    this.init()
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
  p {
    margin-bottom: 8px;
    line-height: 18px;
  }
}
.el-form-item {
  margin-bottom: 20px;
}
</style>