<template>
  <el-row>
    <el-alert title class="m-b-10" type="warning">
      <template>
        <p>说明：</p>
        <p>1、在此新增的模板必是在运营商处创建并通过审核的短信模板</p>
        <p>2、【重要】未在运营商处创建并通过审核的短信模板，在此创建后无法使用</p>
      </template>
    </el-alert>
    <div class="tabs" v-if="$store.getters.user_session.CharacterType == characterTypes.Lingcb">
      <span class="tab" :class="{'active': activeIndex == 1}" @click="activeIndex = 1" name="btnManualCreate">手动创建</span>
      <!-- <span class="tab" :class="{'active': activeIndex == 2}" @click="activeIndex = 2">
        批量导入
      </span>-->
    </div>
    <div class="panel p-t-10" :class="{'no-border': $store.getters.user_session.CharacterType == characterTypes.Store}">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="rules" ref="createForm" class="fix-w" v-if="activeIndex == 1">
        <el-form-item label="模板ID：" prop="ispId">
          <el-input :maxlength="20" v-model="createForm.ispId" name="btnEnterSMSSP"></el-input>
          <em class="m-l-10">输入短信SP审核通过的模板ID</em>
        </el-form-item>
        <el-form-item label="模板类别：" prop="characterType">
          <el-radio-group v-model="createForm.characterType" name="btnSelectTemplate" @change="characterTypeChange">
            <el-radio :label="characterTypes.Lingcb">平台端用模板</el-radio>
            <el-radio :label="characterTypes.Store">门店端用模板</el-radio>
            <el-radio :label="characterTypes.Company">公司用模板</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="归属门店：" prop="characterId" v-if="createForm.characterType == characterTypes.Store">
          <el-cascader
            :options="[allStoreObj,...$store.getters.company_and_stores&&$store.getters.company_and_stores.filter(item=>item.Childrens.length==1)]"
            v-model="characterIdArr"
            :props="{value:'CharacterId',label:'Value',children:'Childrens'}"
            filterable
            @change="characterIdArrChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="归属公司：" prop="characterId" v-if="createForm.characterType == characterTypes.Company">
          <el-select filterable v-model="createForm.characterId" name="btnSelectFirm">
            <el-option
              v-for="item in $store.getters.company_and_stores&&$store.getters.company_and_stores.filter(item=>item.Childrens.length>0 || item.Value == '所有公司')"
              :key="item.CharacterId"
              :value="item.CharacterId"
              :label="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型：" prop="templateType">
          <el-radio-group v-model="createForm.templateType" @change="templateTypeChange" name="btnSelectTemplateType">
            <el-radio v-for="item in templateTypes.Types" :key="item.key" :label="item.key">{{item.title}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板名称：" prop="templateName">
          <el-input name="btnEnterTeplateName" v-model="createForm.templateName"></el-input>
          <span class="mg-l">2-10个汉字或英文字母</span>
        </el-form-item>
        <el-form-item label="短信签名：" prop="signature">
          <el-select v-model="createForm.signature" :filterable="true" placeholder="请选择" name="btnSelectSignature" @change="templateLenght">
            <el-option v-for="(item, index) in signatureData" :key="index" :label="item.signature" :value="item.signature"></el-option>
          </el-select>
          <span class="mg-l">3-10个中英文字符</span>
        </el-form-item>
        <el-form-item label="模板内容：" prop="templateContent">
          <el-input type="textarea" v-model="createForm.templateContent" class="template-content" id="templateContent" name="btnEnterTemplateContent"></el-input>
          <div class="variable-list">
            <p>变量列表：（点击即可插入到模板内容里，插入后以{s}显示）</p>
            <ul>
              <li class="item" v-for="item in variables" :key="item.name" @click="insertVariable(item.name)" name="btnInsertList">{{item.name}}</li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item>
          <div>注意：70字为1条，超过的另算一条，请注意模板字数 共{{smsTotal.content}}字符 ，{{smsTotal.sendTotal}}条短信</div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="createTemplate" :loading="$store.getters.is_loading" name="btnSave">保存</el-button>
        </el-form-item>
      </el-form>
      <el-form label-position="right" label-width="100px" :model="uploadForm" :rules="uploadRules" ref="uploadForm" class="fix-w" v-else>
        <el-form-item label="选择文件：">
          <el-upload
            ref="upload"
            accept=".xls, .xlsx"
            :action="$root.settings.DOMAIN_APIS.Message + '/api/Uploader/UploadToTempAsync'"
            :on-success="uploaderSuccess"
            :on-error="uploaderError"
            :show-file-list="false"
            style="display:inline-block;"
            name="btnSelectFile"
          >
            <el-button slot="trigger" type="default" name="btnBrowse">浏览</el-button>
          </el-upload>
          <el-button type="text" @click="downLoadTemplate" class="m-l-5" name="btnDownLoadTemplate">下载Excel格式模板</el-button>
        </el-form-item>
        <el-form-item label v-if="file">
          <span>
            <i class="el-icon-document" style="font-size:14px;margin-right:7px;"></i>
            {{this.file}}
          </span>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="uploadTemplate" :loading="$store.getters.is_loading" name="btnUploadTemplate">上传</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-row>
</template>

<script>
import { TemplateTypes } from '@/enums/message'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  MESSAGE_API_SIGNATURE_GETSIGNATUREOPTIONLIST,
  MESSAGE_API_VARIABLE_GETVARIABLES,
  MESSAGE_API_SETTINGTEMPLATE_CREATETEMPLATE,
  MESSAGE_API_SETTINGTEMPLATE_SAVEUPLOADTEMPLATE
} from '@/apis/message'
export default {
  data() {
    return {
      activeIndex: 1,
      characterTypes: CharacterType,
      templateTypes: TemplateTypes,
      characterIdArr: [0],
      allStoreObj: {
        CharacterId: 0,
        Id: 0,
        State: 0,
        StoreType: 0,
        Value: '所有门店'
      },
      createForm: {
        characterType: CharacterType.Lingcb,
        templateType: TemplateTypes.Notification,
        templateName: '',
        templateContent: '',
        signature: '',
        ispId: '',
        characterId: 0,
        storeName: ''
      },
      smsTotal: {
        content: 0,
        sendTotal: 1
      },
      rules: {
        characterType: [
          {
            required: true,
            message: '请选择模板类别',
            trigger: 'change'
          }
        ],
        signature: [
          {
            required: true,
            message: '请选择短信签名',
            trigger: 'change'
          }
        ],
        templateType: [
          {
            required: true,
            message: '请选择模板类型',
            trigger: 'change'
          }
        ],
        templateName: [
          {
            min: 2,
            max: 10,
            required: true,
            message: '模板名称必须是2-10个汉字或英文字母',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请填写模板名称',
            trigger: 'change'
          }
        ],
        templateContent: [
          {
            required: true,
            message: '请填写模板内容',
            trigger: 'change'
          }
        ]
      },
      signatureData: [],
      variables: [], // 变量列表
      uploadForm: {
        fileName: ''
      },
      uploadRules: {
        fileName: [
          {
            required: true,
            message: '请上传文件',
            trigger: 'change'
          }
        ]
      },
      file: ''
    }
  },
  methods: {
    characterTypeChange() {
      this.createForm.characterId = 0
      this.characterIdArr = [0]
    },
    characterIdArrChange(e) {
      this.createForm.characterId = e[e.length - 1]
    },
    templateLenght() {
      const { templateContent, signature } = this.createForm
      const total = templateContent.length + signature.length
      const smsAmount = total / 70
      this.smsTotal.content = total
      this.smsTotal.sendTotal = Math.ceil(smsAmount)
    },
    getSignatureData() {
      MESSAGE_API_SIGNATURE_GETSIGNATUREOPTIONLIST({
        templateType: this.createForm.templateType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.signatureData = res.data.Data
        }
      })
    },
    getVariableData() {
      MESSAGE_API_VARIABLE_GETVARIABLES().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.variables = res.data.Data
        }
      })
    },
    createTemplate() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          if (this.createForm.characterType === CharacterType.Store) {
            this.createForm.storeName = this.$store.getters.stores.find(
              item => item.CharacterId === this.createForm.characterId
            ).Value
          }
          if (this.createForm.characterType === CharacterType.Company) {
            this.createForm.storeName = this.$store.getters.company_and_stores.find(
              item => item.CharacterId === this.createForm.characterId
            ).Value
          }
          this.$store.commit('SET_BTN_LOADING', true)
          MESSAGE_API_SETTINGTEMPLATE_CREATETEMPLATE(this.createForm).then(
            res => {
              this.$store.commit('SET_BTN_LOADING', false)
              if (res.data.Code === 'CORRECT') {
                this.$message.success('模板创建成功！')
                this.$router.back()
              }
            }
          )
        }
      })
    },
    templateTypeChange() {
      this.createForm.signature = ''
      this.getSignatureData()
    },
    uploaderSuccess(response, file) {
      if (response.Code === 'CORRECT') {
        this.file = file.name
        this.uploadForm.fileName = response.Data[0]
      }
    },
    uploaderError() {
      this.$message('上传失败', 'error')
    },
    insertVariable(name) {
      this.templateLenght()
      var _content = document.getElementById('templateContent')
      if (document.selection) {
        // IE Support
        _content.focus()
        var selectRange = document.selection.createRange()
        selectRange.text = `{${name}}`
        _content.focus()
      } else if (_content.selectionStart || _content.selectionStart === 0) {
        // not IE
        let startPos = _content.selectionStart
        this.createForm.templateContent =
          this.createForm.templateContent.substring(0, startPos) +
          `{${name}}` +
          this.createForm.templateContent.substring(
            startPos,
            this.createForm.templateContent.length
          )
        _content.focus()
      } else {
        // all
        this.createForm.templateContent += `{${name}}`
      }
    },
    uploadTemplate() {
      if (this.file === '') {
        return this.$message.error('请上传模版')
      }
      this.$refs['uploadForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MESSAGE_API_SETTINGTEMPLATE_SAVEUPLOADTEMPLATE(this.uploadForm).then(
            res => {
              this.$store.commit('SET_BTN_LOADING', false)
              if (res.data.Code === 'CORRECT') {
                this.$message.success('模板导入成功！')
                this.$router.back()
              }
            }
          )
        }
      })
    },
    downLoadTemplate() {
      window.open(
        this.$root.settings.DOMAIN_FILE + '/messageCloud/导入短信EXCEL模板.xlsx'
      )
    }
  },
  created() {
    this.$store.dispatch('GET_STORES_DROPLIST', 1)
    this.$store.dispatch('GET_STORES_DROPLIST', 3)
    this.$store.dispatch('GET_STORES_DROPLIST')
    this.$store.dispatch('GET_COMPANYS_DROPLIST', { HasStore: YNStatus.Yes })
  },
  beforeMount() {
    this.getSignatureData()
    this.getVariableData()
  },
  mounted() { },
  watch: {
    'createForm.templateType': 'templateTypeChange',
    'createForm.templateContent': 'templateLenght'
  }
}
</script>

<style lang="scss" scoped>
.template-content {
  width: 360px;
  vertical-align: top;
  max-width: initial !important;
  /deep/ textarea {
    height: 120px;
  }
}
.variable-list {
  display: inline-block;
  width: 600px;
  margin-left: 10px;
  .item {
    display: inline-block;
    padding: 0 6px;
    margin: 0 10px 10px 0;
    border: 1px solid #e5e5e5;
  }
}
.mg-l {
  margin-left: 10px;
}
</style>

