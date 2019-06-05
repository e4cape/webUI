<template>
  <el-form name="btnTaskCreateForm" label-position="right" label-width="100px" :model="createForm" :rules="rules" ref="createForm" class="fix-w">
    <el-form-item label="发送对象：" prop="sendGroupType">
      <el-select name="btnSelectSendOBJ" v-if="StoreCharacterType == EnumCharacterType.Lingcb" v-model="createForm.sendGroupType" :filterable="true" @change="sendGroupTypeChange" placeholder="请选择">
        <template v-for="item in sendGroupTypes.Types">
          <el-option
            :key="item.key"
            :label="item.title"
            :value="item.key"
            v-if="item.key != sendGroupTypes.CustomSelect && item.key != sendGroupTypes.AllMember && item.key != sendGroupTypes.BirthMember && item.key != sendGroupTypes.OldMember"
          ></el-option>
        </template>
      </el-select>
      <el-select name="btnSelectSendGroupType" v-else v-model="createForm.sendGroupType" :filterable="true" @change="sendGroupTypeChange" placeholder="请选择">
        <template v-for="item in sendGroupTypes.Types">
          <el-option :key="item.key" :label="item.title" :value="item.key" v-if="item.key != sendGroupTypes.CustomSelect && item.key != sendGroupTypes.AllStore"></el-option>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="手机号码：" prop="mobile" :class="{'is-required': createForm.sendGroupType == sendGroupTypes.InputNumber}" v-if="createForm.sendGroupType == sendGroupTypes.InputNumber">
      <el-input name="btnEnterMobile" type="textarea" v-model="createForm.mobile" placeholder="手动输入手机号请使用;分割" :maxlength="200"></el-input>
    </el-form-item>
    <el-form-item label="对象号码：" :class="{'required': createForm.sendGroupType == sendGroupTypes.Imported}" v-if="createForm.sendGroupType == sendGroupTypes.Imported">
      <el-upload
        name="btnObjNumber"
        ref="upload"
        accept=".xls, .xlsx"
        :action="$root.settings.DOMAIN_APIS.Message + '/api/Uploader/UploadToTempAsync'"
        :on-success="uploaderSuccess"
        :on-error="uploaderError"
        :on-change="uploadChange"
        :file-list="fileList"
        style="display:inline-block;"
      >
        <el-button name="btnSelectFile" slot="trigger" type="default">选取文件</el-button>
      </el-upload>
      <el-button name="btnDownLoadMould" type="text" @click="downLoadTemplate">下载模板</el-button>
    </el-form-item>
    <el-form-item label="模板类型：" prop="templateType">
      <el-radio-group name="btnTemplateType" v-model="createForm.templateType" @change="templateTypeChange">
        <el-radio v-for="item in templateTypes.Types" :key="item.key" :label="item.key">{{item.title}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择模板：" prop="templateId">
      <el-select name="btnSelectTemplate" v-model="createForm.templateId" :filterable="true" @change="templateChange" placeholder="请选择">
        <el-option label="请选择" value></el-option>
        <el-option v-for="(item, index) in templateData" :key="index" :label="item.templateName" :value="item.templateId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="短信内容：">
      <el-input name="btnTemplateContent" type="textarea" v-model="createForm.templateContent" :rows="5" disabled></el-input>
    </el-form-item>
    <el-form-item label="短信签名：">
      <span class="red">{{createForm.signature}}</span>
    </el-form-item>
    <el-form-item label="发送类型：" prop="sendType">
      <el-radio-group name="btnSendTypes" v-model="createForm.sendType" @change="sendTypesChange">
        <el-radio v-for="item in sendTypes.Types" :key="item.key" :label="item.key">{{item.title}}</el-radio>
      </el-radio-group>
      <el-date-picker
        name="btnSendTime"
        v-if="createForm.sendType == sendTypes.Ontime"
        type="datetime"
        v-model="createForm.sendTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="m-l-10"
        :editable="false"
        placeholder="选择日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label>
      <el-button name="btnConfirmSend" size="small" type="primary" @click="createTask" :loading="$store.getters.is_loading">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { SendGroupTypes, TemplateTypes, SendTypes } from '@/enums/message'
import { CharacterType } from '@/enums/common'
import {
  MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST,
  MESSAGE_API_MESSAGETASK_CREATE
} from '@/apis/message'
export default {
  data() {
    return {
      fileList: [],
      sendGroupTypes: SendGroupTypes,
      templateTypes: TemplateTypes,
      sendTypes: SendTypes,
      createForm: {
        sendGroupType: '',
        templateId: '',
        templateName: '',
        templateContent: '',
        templateType: TemplateTypes.Notification,
        sendType: SendTypes.Immediatly,
        sendTime: '',
        signature: '',
        excelFilePath: '',
        mobile: '',
        taskItems: []
      },
      rules: {
        sendGroupType: [
          {
            required: true,
            message: '请选择发送对象',
            trigger: 'change'
          }
        ],
        templateId: [
          {
            required: true,
            message: '请选择模板',
            trigger: 'change'
          }
        ],
        sendType: [
          {
            required: true,
            message: '请选择发送类型',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            validator: (rule, value, callback) => {
              if (this.createForm.sendGroupType == this.sendGroupTypes.InputNumber) {
                if (value === '') {
                  callback(new Error('请输入手机号码'))
                } else {
                  let reg = /^1[34578]\d{9}$/
                  let arr = value.split(/[;；]/)
                  arr.forEach(item => {
                    if (!reg.test(item)) {
                      callback(new Error('请输入正确的手机号码'))
                      return
                    }
                  })
                }
                callback()
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      templateData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    getTemplateData() {
      MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST({
        templateType: this.createForm.templateType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.templateData = res.data.Data
        }
      })
    },
    createTask() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          if (
            this.createForm.sendGroupType === this.sendGroupTypes.InputNumber
          ) {
            this.createForm.mobile.split(';').forEach(item => {
              this.createForm.taskItems.push({
                mobile: item
              })
            })
          }
          this.createForm.templateName = this.templateData.find(
            item => item.templateId === this.createForm.templateId
          ).templateName
          MESSAGE_API_MESSAGETASK_CREATE(this.createForm).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('任务创建成功！')
              this.$router.back()
            }
            this.$store.commit('SET_BTN_LOADING', false)
            this.createForm.taskItems = []
          })
        }
      })
    },
    sendGroupTypeChange() {
      this.$refs.createForm.validateField('mobile')
      this.createForm.excelFilePath = ''
      this.createForm.taskItems = []
    },
    templateTypeChange() {
      this.createForm.templateId = ''
      this.createForm.templateContent = ''
      this.createForm.signature = ''
      this.getTemplateData()
    },
    templateChange() {
      let item = this.templateData.find(
        item => item.templateId === this.createForm.templateId
      )
      this.createForm.templateContent = item.templateContent || ''
      this.createForm.signature = item.signature || ''
    },
    sendTypesChange(e) {
      if (e == this.sendTypes.Immediatly) {
        this.createForm.sendTime = ''
      }
    },
    uploadChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    uploaderSuccess(response) {
      if (response.Code === 'CORRECT') {
        this.createForm.excelFilePath = response.Data[0]
      }
    },
    uploaderError() {
      this.$message('上传失败', 'error')
    },
    downLoadTemplate() {
      window.open(
        this.$root.settings.DOMAIN_FILE +
        '/messageCloud/导入外部对象EXCEL模板.xlsx'
      )
    }
  },
  beforeMount() {
    this.getTemplateData()
  },
  computed: {
    EnumCharacterType() {
      return CharacterType
    },
    StoreCharacterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  watch: {
    'createForm.templateType': 'templateTypeChange'
  }
}
</script>
