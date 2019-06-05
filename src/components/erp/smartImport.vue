<template>
  <el-dialog :visible="visible" @update:visible="$emit('update:visible', $event)" @open="init" title="智能导入货品" width="900px">
    <template v-if="!isNextStep">
      <div class="dialog-title">
        <p class="m-b-10 title">请选择导入的文件，根据表格标题自动匹配导入：</p>
      </div>
      <el-upload
        class="upload-demo"
        drag
        :action="api"
        :data="{ Root: root}"
        accept=".xls,.xlsx"
        :headers="{'access-token': $store.getters.access_token}"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-success="success"
        :on-error="error"
        ref="upLoad"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip dialog-upload-tip" slot="tip">
          <p>1、仅支持.xls和.xlsx的Excel文件。</p>
          <p>2、仅支持Excel文件中第一个表格的数据导入。</p>
          <p>3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</p>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="nextLoading" @click="goToNext">下一步</el-button>
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
      </span>
    </template>
    <template v-else>
      <div class="dialog-title">
        <p class="title">请选择数据对应关系：</p>
        <div>
          <el-button type="primary" @click="createTemplate" :loading="createLoading">保存到我的模板</el-button>
          <el-select v-model="templetId" @change="handleMyTemplate" placeholder="我的模板" class="m-r-10">
            <el-option v-for="(item, index) in myTemplateList" :key="index" :value="item.TempletId" :label="item.TempletName">
              <span style="float: left">{{item.TempletName}}</span>
              <span style="float: right;color: #d74040">
                <i class="el-icon-error" @click.stop="delTemplate(item.TempletId)"></i>
              </span>
            </el-option>
          </el-select>
          <!-- <el-select v-model="templetId" placeholder="系统模板">
            <el-option :value="1" label="xx"></el-option>
          </el-select>-->
          <!-- <el-dropdown class=" m-x-10">
            <el-button type="default">
              系统模板<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>xxx</el-dropdown-item>
              <el-dropdown-item>xxx</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
          <el-tooltip effect="light">
            <div slot="content" class="tooltip-content">
              <p>
                <b>我的模板：</b>将数据对应关系保存到模板，下次选择同样格式的excel文件，通过选择模板自动匹配数据对应关系。
              </p>
              <p>
                <b>系统模板：</b>从其他ERP导入的快捷通道，自动匹配其他ERP导出的货品数据。
              </p>
            </div>
            <el-button type="text">什么是模板？</el-button>
          </el-tooltip>
        </div>
      </div>
      <el-form :model="creatForm">
        <el-form-item>
          <el-table v-scrollshow="handelScrollshow" :data="creatForm.Fields" v-loading="tbLoading" height="600" class="m-t-10">
            <el-table-column prop="FieldCnName" label="系统货品属性" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.IsRequired === YNStatus.Yes" style="color:#d74040">*</span>
                <span>{{scope.row.FieldCnName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ExcelCnName" label="Excel列" width="200px">
              <template slot-scope="scope">
                <el-form-item :prop="`Fields[${scope.$index}].ExcelCnName`">
                  <el-select v-model="scope.row.ExcelCnName">
                    <el-option value="空" label="空"></el-option>
                    <el-option v-for="item in xlsxColumnList" :key="item.Index" :value="item.Title" :label="item.Title"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="默认值" width="200px">
              <template slot="header">
                默认值
                <el-tooltip effect="light" placement="bottom-start">
                  <p slot="content" class="tooltip-content">设置默认值后，如果未设置Excel列或者导入的数据中为空，自动用默认值代替</p>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
                <el-form-item :prop="`Fields[${scope.$index}].DefaultValue`" v-if="scope.row.FieldType === SettingCustomizedFieldType.SelectOfEnums">
                  <el-select v-model="scope.row.DefaultValue" v-if="scope.row.Enums">
                    <el-option :value="''" label="请选择"></el-option>
                    <template v-for="(item, index) in scope.row.Enums">
                      <el-option v-if="item.State === YNStatus.Yes || item.State === 0" :key="index" :value="item.Title" :label="item.Title"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item :prop="`Fields[${scope.$index}].DefaultValue`" v-else-if="scope.row.FieldEnName === 'BarCode'">
                </el-form-item>
                <el-form-item :prop="`Fields[${scope.$index}].DefaultValue`" v-else-if="scope.row.FieldType === SettingCustomizedFieldType.TextOfDecimal">
                  <el-input v-model="scope.row.DefaultValue" @keyup.native="scope.row.DefaultValue = $root.toFixed(scope.row.DefaultValue, scope.row.Precision)" :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item :prop="`Fields[${scope.$index}].DefaultValue`" v-else-if="scope.row.FieldType === SettingCustomizedFieldType.TextOfPercent">
                  <el-input v-model="scope.row.DefaultValue" @keyup.native="scope.row.DefaultValue = scope.row.DefaultValue > 100 ? 100 : $root.toFixed(scope.row.DefaultValue, 1)" :maxlength="4"></el-input>
                </el-form-item>
                <el-form-item :prop="`Fields[${scope.$index}].DefaultValue`" v-else>
                  <el-input v-model="scope.row.DefaultValue" :maxlength="50" @blur="scope.row.DefaultValue = scope.row.DefaultValue.trim()"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                截取字符
                <el-tooltip effect="light" placement="bottom-start">
                  <p slot="content" class="tooltip-content">如果导入的数据中有需要截取的字符，可以使用该功能，可以截取分隔符前的字符或者分隔符后的字符。例如：内容为0.3/2，分割字符为“/”，截取方式为分隔符前，截取后的内容为“0.3”</p>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
                <div class="split-box" v-if="scope.row.isSetSplit">
                  <el-form-item :prop="`Fields[${scope.$index}].SplitChar`" class="m-r-10">
                    <el-input v-model="scope.row.SplitChar" placeholder="分隔符" :maxlength="10"></el-input>
                  </el-form-item>
                  <el-form-item :prop="`Fields[${scope.$index}].SplitType`" class="m-r-10">
                    <el-select v-model="scope.row.SplitType" placeholder="截取方式">
                      <el-option :value="0" label="截取方式"></el-option>
                      <el-option v-for="(item, index) in SettingAiimportFieldSplitType.Types" :key="index" :value="Number(index)" :label="'分隔符'+ item"></el-option>
                    </el-select>
                  </el-form-item>
                  <i class="el-icon-error" style="font-size:16px; color: #d74040;cursor:point" @click.stop="cancelSetSplit(scope)"></i>
                </div>
                <el-button v-else type="text" @click="scope.row.isSetSplit = true">截取设置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" :disabled="$store.getters.is_loading" :loading="$store.getters.is_loading">确定</el-button>
        <el-button type="primary" @click="resetImport">重新导入</el-button>
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import {
  STOCKING_API_SETTING_AIIMPORT_TEMPLET_GETS,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_XLSXCOLUMN,
  STOCKING_API_SETTING_AIIMPORT_TEMPLET_CREATE,
  STOCKING_API_SETTING_AIIMPORT_TEMPLET_DISABLE,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_SETTING_AIIMPORT_FIELD_GETS,
} from '@/apis/stocking.js'
import {
  FeeType,
  RetailType,
  ProcessType,
  PriceType,
  StoneCut,
  StoneColor,
  StoneSym,
  StonePolish,
  StoneClarity,
  GiftType,
  AppropType,
  WholesaleType,
  SettingAiimportFieldSplitType,
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
} from '@/enums/stocking.js'
import { YNStatus } from '@/enums/common.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default() {
        return {
          OrderType: 1,
          LargeType: 3,
          SmallType: 0,
          KindTypeEk: 1,
        }
      }
    },
    root: {
      type: String,
      default: ''
    },
    smartImportOrderType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      YNStatus,
      SettingCustomizedFieldSmallType,
      SettingCustomizedFieldType,
      SettingAiimportFieldSplitType,
      isNextStep: false,
      key: '',
      fileList: [],
      templetId: '',
      myTemplateList: [],
      xlsxColumnList: [],
      creatForm: {
        OrderType: '',
        TempletName: '',
        Fields: []
      },
      createLoading: false,
      tbLoading: false,
      enums: {
        RetailType,
        ProcessType,
        PriceType,
        FeeType,
        GiftType,
        StoneColor,
        StoneClarity,
        StoneCut,
        StonePolish,
        StoneSym,
        AppropType,
        WholesaleType
      },
      nextLoading: false,
      currentStartIndex: 0,
      currentEndIndex: 20,
    }
  },
  computed: {
    api() {
      return this.$root.settings.DOMAIN_APIS.Common + '/Upload/File/UploadToOss/'
    }
  },
  methods: {
    // 表格懒加载
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    // 提交导入
    submit() {
      this.$store.commit('SET_BTN_LOADING', true)
      let param = [...this.creatForm.Fields]
      param.forEach(item => {
        item.SplitType = item.SplitType || 0
      })
      if (this.visible) {
        this.$emit('submit', { Fields: param, FilePath: this.key })
      }
    },
    resetImport() { // 重新导入
      this.isNextStep = false
      this.templetId = ''
    },
    init() { // 初始化
      this.key = ''
      this.isNextStep = false
      this.templetId = ''
      this.fileList = []
      if (this.$refs.upLoad) {
        this.$refs.upLoad.clearFiles()
      }
      this.getMyTemplateList()
    },
    beforeUpload(file) {
      if (file.name.indexOf('.xls') === -1) {
        this.$message.error('只支持xls和xlsx格式的Excel文件!')
        return false
      } else {
        return true
      }
    },
    success(res, file) {
      if (res.Code === 'CORRECT') {
        this.$message.success('上传成功')
        this.key = res.Data.Path
        this.fileList = [file]
      }
    },
    error() {
      this.$message.error('上传失败')
    },
    goToNext() { // 下一步
      if (this.key) {
        this.nextLoading = true
        STOCKING_API_SETTING_CUSTOMIZED_FIELD_XLSXCOLUMN({ // 获取Excel列下拉
          FileName: this.key
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.xlsxColumnList = res.data.Data
            this.isNextStep = true
          }
          this.nextLoading = false
        }).then(() => {
          this.getCustomField()
        })
      }
    },
    getMyTemplateList() { // 获取我的模板下拉
      STOCKING_API_SETTING_AIIMPORT_TEMPLET_GETS({
        OrderType: this.smartImportOrderType,
        PageIndex: 1,
        PageSize: 10000,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.myTemplateList = res.data.Data.Rows
        }
      })
    },
    getCustomField() { // 获取表格系统货品属性列
      this.tbLoading = true
      this.creatForm.Fields = []
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(this.option).then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Rows && res.data.Data.Rows.forEach((item) => {
            if (item.IsEnable === YNStatus.Yes) {
              let cnName = ''
              this.xlsxColumnList.forEach(ele => {
                if ((ele.Title.slice(-1) === '*' ? ele.Title.slice(0, -1) : ele.Title) === item.FieldCnName) {
                  cnName = ele.Title
                }
              })
              this.creatForm.Fields.push({
                FieldEnName: item.FieldEnName,
                FieldCnName: item.FieldCnName,
                FieldType: item.FieldType,
                Precision: item.Precision,
                IsRequired: item.IsRequired,
                Enums: item.Enums,
                ExcelCnName: cnName || '空',
                DefaultValue: '',
                SplitType: 0,
                SplitChar: '',
                isSetSplit: false
              })
            }
          })
        }
        this.tbLoading = false
      })
    },
    cancelSetSplit(scope) { // 关闭截取设置
      this.creatForm.Fields[scope.$index].isSetSplit = false
      this.creatForm.Fields[scope.$index].SplitType = 0
      this.creatForm.Fields[scope.$index].SplitChar = ''
    },
    createTemplate() { // 创建我的模板
      this.$prompt('请输入模板名称：', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\S*\S*]{1,10}$/,
        inputErrorMessage: '不能超过10个字'
      })
        .then(({ value }) => {
          this.creatForm.TempletName = value
          this.creatForm.OrderType = this.smartImportOrderType
          let params = JSON.parse(JSON.stringify(this.creatForm))
          params.Fields.forEach(item => {
            item.SplitType = item.SplitType || 0
            // if (item.FieldType === SettingCustomizedFieldType.SelectOfEnums) {
            //   item.DefaultValue = item.DefaultValue || ''
            // } else 
            if (item.FieldType === SettingCustomizedFieldType.TextOfDecimal) {
              item.DefaultValue = String(this.$root.toInt(item.DefaultValue))
            } else if (item.FieldType === SettingCustomizedFieldType.TextOfPercent) {
              item.DefaultValue = String(this.$root.toInt(item.DefaultValue / 100))
            } else {
              item.DefaultValue = item.DefaultValue
            }
          })
          this.createLoading = true
          STOCKING_API_SETTING_AIIMPORT_TEMPLET_CREATE(params).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('提交成功')
                this.getMyTemplateList()
              }
              this.createLoading = false
            }
          )
        })
        .catch(() => { })
    },
    delTemplate(id) { // 删除我的模板
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_SETTING_AIIMPORT_TEMPLET_DISABLE({ TempletId: id }).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getMyTemplateList()
            }
          }
        )
      }).catch(() => { })
    },
    handleMyTemplate(id) { // 使用我的模板
      this.tbLoading = true
      STOCKING_API_SETTING_AIIMPORT_FIELD_GETS({ TempletId: id }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data.Rows || []
          this.creatForm.Fields.forEach((item, index) => {
            item.ExcelCnName = data[index].ExcelCnName || '空'
            item.SplitType = data[index].SplitType || 0
            item.SplitChar = data[index].SplitChar
            // if (data[index].FieldType === SettingCustomizedFieldType.SelectOfEnums) {
            //   item.DefaultValue = data[index].DefaultValue || ''
            // } else 
            if (data[index].FieldType === SettingCustomizedFieldType.TextOfDecimal) {
              item.DefaultValue = this.$root.toFloat(data[index].DefaultValue, data[index].Precision) || ''
            } else if (data[index].FieldType === SettingCustomizedFieldType.TextOfPercent) {
              item.DefaultValue = this.$root.toFloat(data[index].DefaultValue * 100) || ''
            } else {
              item.DefaultValue = data[index].DefaultValue || ''
            }
            item.isSetSplit = item.SplitType && item.SplitChar
          })
        }
      })
      this.tbLoading = false
    },
    
  }
}
</script>

<style lang="scss" scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-upload__tip p {
  padding-top: 5px;
}
.split-box {
  display: flex;
  align-items: center;
}
.el-form-item--mini {
  margin-bottom: 0 !important;
}
</style>
