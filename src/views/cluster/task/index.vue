
<template>
  <div class="content">
    <!--   Data Table   -->
    <el-row class="m-b-10">
      <el-col :span="12">
        <el-button :type="!canStop ? 'primary' : ''" :disabled="canStop" @click="taskOn" name="btnOn">启动</el-button>
        <el-button :type="canStop ? 'primary' : ''" :disabled="!canStop" @click="taskOff" name="btnOff">停止</el-button>
      </el-col>
      <el-col :span="12" class="tr">
        <el-button type="primary" @click="createVisible = true" name="btnCreate">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="JobId" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="JobName" label="任务名称" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="JobType" label="任务类型" min-width="100">
        <template slot-scope="scope">{{jobType.Types[scope.row.JobType]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="Descr" label="任务描述" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Express" label="定时正则" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ApisUri" label="URL" min-width="200"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Queue" label="队列名称" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CreateUser" label="创建人员" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CreateTime" label="创建时间" min-width="140">
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="showEdit(scope.row)" name="btnUpdate">修改</el-button>
          <template v-if="scope.row.State != QuartzJobState.Origin">
            <el-button type="text" @click="del(scope.row.JobId)" name="btnDelete">删除</el-button>
            <el-button type="text" @click="stop(scope.row.JobId)" name="btnStop" v-if="scope.row.State == QuartzJobState.Running">暂停</el-button>
            <el-button type="text" @click="restart(scope.row.JobId)" name="btnRestart" v-if="scope.row.State == QuartzJobState.Stop">重新启动</el-button>
          </template>
          <el-button type="text" @click="showDetail(scope.row)" name="btnDetail">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="pageIndex" :size="pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!--   @module Dialog·新建任务调度   -->
    <el-dialog title="创建任务调度" v-if="createVisible" :visible.sync="createVisible">
      <el-form label-position="right" label-width="100px" :model="createForm" ref="createForm">
        <el-form-item label="任务名称" prop="JobName">
          <el-input v-model="createForm.JobName" :maxlength="50" name="JobName"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="JobType">
          <el-select v-model="createForm.JobType" :filterable="true" name="JobType">
            <el-option v-for="(item, index) in jobType.Types" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="Descr">
          <el-input type="textarea" v-model="createForm.Descr" :maxlength="200" name="Descr"></el-input>
        </el-form-item>
        <el-form-item label="定时正则" prop="Express">
          <el-input v-model="createForm.Express" :maxlength="200" name="Express"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="ApisUri">
          <el-input v-model="createForm.ApisUri" :maxlength="200" name="ApisUri"></el-input>
        </el-form-item>
        <el-form-item label="队列名称" prop="Queue">
          <el-input v-model="createForm.Queue" :maxlength="50" name="Queue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createTask" :loading="$store.getters.is_loading" name="btnConfirm">确 定</el-button>
        <el-button @click="createVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--   End Dialog·新建任务调度   -->
    <!--   @module Dialog·修改任务调度   -->
    <el-dialog title="修改任务调度" v-if="updateVisible" :visible.sync="updateVisible">
      <el-form label-position="right" label-width="100px" :model="currentItem" ref="editForm">
        <el-form-item label="任务名称" prop="JobName">
          <el-input v-model="currentItem.JobName" :maxlength="50" name="JobName"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="JobType">
          <el-select v-model="currentItem.JobType" :filterable="true" name="JobType">
            <el-option v-for="(item, index) in jobType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="Descr">
          <el-input type="textarea" v-model="currentItem.Descr" :maxlength="50" name="Descr"></el-input>
        </el-form-item>
        <el-form-item label="定时正则" prop="Express">
          <el-input v-model="currentItem.Express" :maxlength="50" name="Express"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="ApisUri">
          <el-input v-model="currentItem.ApisUri" :maxlength="50" name="ApisUri"></el-input>
        </el-form-item>
        <el-form-item label="队列名称" prop="Queue">
          <el-input v-model="currentItem.Queue" :maxlength="50" name="Queue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateTask" :loading="$store.getters.is_loading" name="btnConfirm">确 定</el-button>
        <el-button @click="updateVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--   End Dialog·修改任务调度   -->
    <!--   @module Dialog·任务调度详情   -->
    <el-dialog title="任务调度详情" v-if="detailVisible" :visible.sync="detailVisible">
      <el-form label-position="right" label-width="100px" :model="currentItem" ref="editForm">
        <el-form-item label="任务名称：">
          <span>{{currentItem.JobName}}</span>
        </el-form-item>
        <el-form-item label="任务类型：">
          <span>{{jobType.Types[currentItem.JobType]}}</span>
        </el-form-item>
        <el-form-item label="任务描述：">
          <span>{{currentItem.Descr}}</span>
        </el-form-item>
        <el-form-item label="定时正则：">
          <span>{{currentItem.Express}}</span>
        </el-form-item>
        <el-form-item label="URL：">
          <span>{{currentItem.ApisUri}}</span>
        </el-form-item>
        <el-form-item label="队列名称：">
          <span>{{currentItem.Queue}}</span>
        </el-form-item>
        <el-form-item label="创建人员：">
          <span>{{currentItem.CreateUser}}</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>{{currentItem.CreateTime | filterDateTime}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false" name="btnClose">关闭</el-button>
      </span>
    </el-dialog>
    <!--   End Dialog·任务调度详情   -->
  </div>
</template>
<script>
import { EnableState } from '@/enums/common'
import { QuartzJobType, QuartzJobState } from '@/enums/cluster'
import {
  CLUSTER_API_QUARTZSCHEDULER_STATE,
  CLUSTER_API_QUARTZJOB_GETS,
  CLUSTER_API_QUARTZJOB_RESUME,
  CLUSTER_API_QUARTZJOB_PAUSE,
  CLUSTER_API_QUARTZJOB_REMOVE,
  CLUSTER_API_QUARTZSCHEDULER_START,
  CLUSTER_API_QUARTZSCHEDULER_STOP,
  CLUSTER_API_QUARTZJOB_UPDATE,
  CLUSTER_API_QUARTZJOB_CREATE
} from '@/apis/cluster.js'
import pagination from '@/components/pagination.vue'
export default {
  data() {
    return {
      jobType: QuartzJobType,
      QuartzJobState,
      canStop: false,
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      createForm: {
        JobType: '',
        JobName: '',
        Descr: '',
        Express: '',
        ApisUri: '',
        Queue: ''
      },
      createVisible: false,
      updateVisible: false,
      detailVisible: false,
      currentItem: {} // 当前操作的对象
    }
  },
  methods: {
    taskOn() {
      if (!this.canStop) {
        this.$store.commit('SET_FULL_LOADING', true)
        CLUSTER_API_QUARTZSCHEDULER_START().then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('启动成功')
            this.canStop = true
          }
        })
      }
    },
    taskOff() {
      if (this.canStop) {
        this.$store.commit('SET_FULL_LOADING', true)
        CLUSTER_API_QUARTZSCHEDULER_STOP().then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('停止成功')
            this.canStop = false
          }
        })
      }
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      CLUSTER_API_QUARTZJOB_GETS({
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pageIndex = 1
      this.pageSize = val
      this.getData()
    },
    getState() {
      CLUSTER_API_QUARTZSCHEDULER_STATE().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.canStop = EnableState.Enable === res.data.Data.EnableState
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    stop(id) {
      this.$confirm('确定要暂停吗？', '暂停', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        CLUSTER_API_QUARTZJOB_PAUSE({ JobId: id }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('暂停成功')
            this.getData()
          }
        })
      })
    },
    restart(id) {
      this.$confirm('确定要重新启动吗？', '重新启动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        CLUSTER_API_QUARTZJOB_RESUME({ JobId: id }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('重新启动成功')
            this.getData()
          }
        })
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CLUSTER_API_QUARTZJOB_REMOVE({ JobId: id }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('删除成功')
            this.getData()
          }
        })
      })
    },
    showDetail(row) {
      this.currentItem = row
      this.detailVisible = true
    },
    showEdit(row) {
      this.currentItem = row
      this.updateVisible = true
    },
    updateTask() {
      this.$store.commit('SET_BTN_LOADING', true)
      CLUSTER_API_QUARTZJOB_UPDATE(this.currentItem).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('修改成功')
          this.updateVisible = false
          this.getData()
        }
      })
    },
    createTask() {
      this.$store.commit('SET_BTN_LOADING', true)
      CLUSTER_API_QUARTZJOB_CREATE(
        Object.assign({}, this.createForm, {
          JobType: parseInt(this.createForm.JobType)
        })
      ).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('创建成功')
          this.$refs['createForm'].resetFields()
          this.createVisible = false
          this.getData()
        }
      })
    }
  },
  mounted() {
    this.getState()
    this.getData()
  },
  components: {
    pagination
  }
}
</script>