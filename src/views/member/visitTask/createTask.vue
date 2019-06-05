<template>
  <div>
    <!-- @module Dialog·新建客户回访 -->
    <el-dialog :title="(JSON.stringify(this.TaskParams.params) === '{}' ? '新建' : '修改') + '客户回访单'" :visible.sync="visible" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="任务名称：" prop="taskName">
          <el-input
            name="inputTaskName"
            v-model="createForm.taskName"
            placeholder="任务名称限制20字以内"
            :maxlength="20"
            @keyup.enter.native="onSearch"
            @blur="createForm.taskName = createForm.taskName.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务类型：" prop="settingOptionId">
          <el-select name="selectSettingOptionId" v-model="createForm.settingOptionId" placeholder="请选择">
            <el-option v-for="(item, index) in dictsItems" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
          </el-select>
          <span class="icon-set-item" @click="dictsDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="执行人：" prop="visitUserList">
          <el-select name="selectVisitUserList" multiple v-model="createForm.visitUserList" placeholder="请选择执行人">
            <template v-for="(user, index) in $store.getters.users">
              <el-option v-if="user.UserState == SecurityUserState.Audit" :key="index" :label="user.TrueName" :value="user.UserId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="任务结果标记：">
          <div class="fl" style="width:60%;">
            <div class="m-b-10">
              <span>标记方式：</span>
              <el-radio name="radioMarkType" v-model="createForm.markType" :label="1">单选</el-radio>
              <el-radio name="radioMarkTypes" v-model="createForm.markType" :label="2">多选</el-radio>
            </div>
            <div>
              <span class="m-b-10">
                标记选项：
                <el-button name="btnOnAddOption" type="text" @click="onAddOption">+添加选项(最多5个)</el-button>
              </span>
              <p v-for="(option, index) in createForm.results" :key="index" class="m-b-10">
                <el-input name="inputCreateForm" placeholder="最多十个字" maxlength="10" v-model="createForm.results[index]">
                  <template slot="append" :class="'el-button--danger'">
                    <el-button name="btnRemovetagOptionItem" type="danger" v-if="createForm.results.length == (index+1) && index > 0" @click="removetagOptionItem(index)">删除</el-button>
                  </template>
                </el-input>
              </p>
            </div>
          </div>
          <div class="fl visit-mark">
            <h5>标记目的：</h5>
            <p>1、在任务执行时，执行人可以通过选项快速标记任务结果。</p>
            <p>2、任务完成后快速统计和分析任务结果分布情况。</p>
          </div>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input name="inputRemark" v-model="createForm.remark" type="textarea" :rows="3" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCreateVisitTask" type="primary" @click="createVisitTask" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancel" @click="visible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品采购入库单 -->

    <!-- 新建修改原因 -->
    <member-dict-manage prop="name" :optionType="settingOptionTypes.VisitTaskType" :items="dictsItems" :visible.sync="dictsDialog" @reason-change="reasonChange"></member-dict-manage>
    <!-- end 新建修改原因 -->
  </div>
</template>

<script>
import {
  SecurityUserState
} from '@/enums/merchant'
import {
  SettingOptionTypes
} from '@/enums/membership'
import {
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS
} from '@/apis/membership'
import MemberDictManage from '@/components/scrm/memberDictManage'

export default {
  data() {
    return {
      SecurityUserState,
      settingOptionTypes: SettingOptionTypes,
      visible: this.TaskParams.dialog,
      dictsDialog: false,
      dictsItems: [],
      createForm: {
        taskName: '',
        settingOptionId: '',
        settingOptionName: '',
        visitUserList: [],
        markType: 1,
        results: [''],
        remark: ''
      },
      createRules: {
        // 新建规则
        taskName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'change'
          }
        ],
        settingOptionId: [
          {
            required: true,
            message: '请选择任务类型',
            trigger: 'change'
          }
        ],
        visitUserList: [
          {
            type: 'array',
            required: true,
            message: '请选择执行人',
            trigger: 'change'
          }
        ]
      }
    }
  },
  props: {
    TaskParams: {
      type: Object,
      default: new Object()
    },
    dicts: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    init() {
      JSON.stringify(this.TaskParams.params) === '{}'
        ? this.resetForm()
        : (this.createForm = Object.assign({
        }, this.TaskParams.params))
      let arr = []
      JSON.stringify(this.TaskParams.params) !== '{}' &&
        this.TaskParams.params.results.length > 1
        ? this.TaskParams.params.results.forEach(item => {
          item !== null && arr.push(item)
        })
        : (arr = [''])
      this.createForm.results = arr
      this.dictsItems = this.dicts.slice()

      if (!this.dictsItems.length) {
        this.getDicts()
      }
    },
    createVisitTask() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          var arr = []
          this.$store.getters.users.forEach((item) => {
            this.createForm.visitUserList.forEach((val) => {
              if (item.UserId === val) {
                arr.push({
                  userId: item.UserId,
                  trueName: item.TrueName
                })
              }
            })
          })
          let params = {
            taskName: this.createForm.taskName,
            settingOptionId: this.createForm.settingOptionId,
            settingOptionName: this.getDictsName(
              this.createForm.settingOptionId
            ),
            visitUserList: arr,
            markType: this.createForm.markType,
            results: this.createForm.results,
            remark: this.createForm.remark
          }
          this.createForm.visitTaskId
            ? (params['visitTaskId'] = this.createForm.visitTaskId)
            : ''
          this.$emit('listenVisitTask', params)
        }
      })
    },
    getDicts() {
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
        type: this.settingOptionTypes.VisitTaskType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dictsItems = res.data.Data
        }
      })
    },
    getDictsName(id) {
      var name
      this.dictsItems.forEach((item) => {
        if (item.settingOptionId === id) {
          name = item.name
        }
      })
      return name
    },
    reasonChange(data) {
      this.dictsItems = data
    },
    onAddOption() {
      if (this.createForm.results.length >= 5) {
        return
      }
      this.createForm.results.push('')
    },
    removetagOptionItem(index) {
      this.createForm.results.splice(index, 1)
    },
    resetForm() {
      this.createForm = {
        taskName: '',
        settingOptionId: '',
        settingOptionName: '',
        visitUserList: [],
        markType: 1,
        results: [''],
        remark: ''
      }
    }
  },
  created() {
    this.$store.dispatch('GET_USERS_DROPLIST')
  },
  mounted() {
    this.init()
  },
  components: {
    MemberDictManage
  },
  watch: {
    visible(to) {
      if (!to) {
        this.resetForm()
        this.$emit('listenVisitTask', false)
      }
    }
  }
}
</script>

<style lang="scss">
.visit-mark {
  width: calc(40% - 10px);
  padding: 10px;
  background: #f5f5f5;
  margin-left: 10px;
  h5 {
    font-weight: bold;
  }
}
</style>
