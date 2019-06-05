<template>
  <div>
    <!-- @module Dialog·新建客户回访 -->
    <el-dialog :title="(JSON.stringify(this.bookParams.params) !== '{}' ? '修改' : '新建') + '话术'" :visible.sync="visible" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="话术主题：" prop="subject">
          <el-input name="inputSubject" v-model="createForm.subject" placeholder="限制20字以内" :maxlength="20" @keyup.enter.native="onSearch" @blur="createForm.subject = createForm.subject.trim()"></el-input>
        </el-form-item>
        <el-form-item label="话术类型	：" prop="settingOptionId">
          <el-select name="selectSettingOptionId" v-model="createForm.settingOptionId" placeholder="请选择">
            <el-option v-for="(item, index) in dicts" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
          </el-select>
          <span class="icon-set-item" @click="dictsDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="话术内容：" prop="content">
          <el-input name="inputContent" v-model="createForm.content" type="textarea" :rows="5" :maxlength="500" @blur="createForm.content = createForm.content.trim()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCreateVisitTask" type="primary" @click="createVisitTask" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancel" @click="visible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品采购入库单 -->

    <!-- 新建修改原因 -->
    <member-dict-manage prop="name" :optionType="settingOptionTypes.VisitBookType" :items="dicts" :visible.sync="dictsDialog" @reason-change="$emit('dicts-change', $event)"></member-dict-manage>
    <!-- end 新建修改原因 -->
  </div>
</template>

<script>
import { SettingOptionTypes } from '@/enums/membership'
import MemberDictManage from '@/components/scrm/memberDictManage'

export default {
  data() {
    return {
      settingOptionTypes: SettingOptionTypes,
      visible: this.bookParams.dialog,
      dictsDialog: false,
      createForm: {
        visitBookId: '',
        subject: '',
        settingOptionId: '',
        settingOptionName: '',
        content: ''
      },
      createRules: {
        // 新建规则
        subject: [
          {
            type: 'string',
            required: true,
            message: '请输入话术主题',
            trigger: 'blur'
          }
        ],
        content: [
          {
            type: 'string',
            required: true,
            message: '请输入话术内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    bookParams: {
      default: new Object(),
      type: Object
    },
    dicts: {
      default: new Array(),
      type: Array
    }
  },
  methods: {
    createVisitTask() {
      let params = {
        subject: this.createForm.subject,
        settingOptionId: this.createForm.settingOptionId,
        settingOptionName: this.getDictsName(this.createForm.settingOptionId),
        content: this.createForm.content
      }

      this.createForm.visitBookId
        ? (params['visitBookId'] = this.createForm.visitBookId)
        : ''
      this.createForm.visitTaskId
        ? (params['visitTaskId'] = this.createForm.visitTaskId)
        : ''
      this.$emit('listenVisitBook', params)
    },
    getDictsName(id) {
      var name
      this.dicts.forEach(item => {
        if (item.settingOptionId === id) {
          name = item.name
        }
      })
      return name
    },
    resetForm() {
      this.createForm = {
        visitBookId: '',
        subject: '',
        settingOptionId: '',
        settingOptionName: '',
        content: ''
      }
    }
  },
  mounted() {
    JSON.stringify(this.bookParams.params) === '{}'
      ? this.resetForm()
      : (this.createForm = Object.assign({}, this.bookParams.params))
  },
  components: {
    MemberDictManage
  },
  watch: {
    visible(to) {
      if (!to) {
        this.resetForm()
        this.$emit('listenVisitBook', false)
      }
    }
  }
}
</script>

<style>
</style>
