<template>
  <el-dialog title="导入线下会员" :visible="visible" @update:visible="$emit('update:visible', $event)" width="55%" v-loading="loading" @close="importCancel">
    <div class="step-one" v-show="step === 1">
      <div class="download">
        <span>请选择导入的文件：</span>
        <el-button name="btnDowloadTemplate" size="small" type="text" class="download-text" @click="dowloadTemplate">下载模板文件</el-button>
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="name">
          <el-input name="name" disabled v-model="form.name" class="w-400">
            <el-upload
              slot="append"
              class="upload-demo"
              :action="uploadUrl"
              :on-error="handleError"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              :show-file-list="false"
              accept=".xls, .xlsx"
            >
              <el-button name="btnUpload" icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </el-input>
        </el-form-item>
      </el-form>
      <ol class="uploadExcelTip">
        <li>仅支持.xls和.xlsx的Excel文件。</li>
        <li>仅支持Excel文件中第一个表格的数据导入。</li>
        <li>根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</li>
        <li>请先下载模板文件填写后再导入。</li>
      </ol>
    </div>
    <div class="step-two" v-show="step == 2">
      <div class="result">
        <div class="title">导入结果：</div>
        <div v-if="charfale.length" class="context">导入失败</div>
        <div class="context" v-else>导入成功</div>
      </div>
      <el-table :data="charfale" size="mini" class="no-border">
        <el-table-column prop="reason" label="失败原因" min-width="180" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer" v-if="step === 1">
      <el-button name="btnNext" size="small" type="primary" @click="onSubmit">下一步</el-button>
      <el-button name="btnCancel1" size="small" @click="importCancel">取 消</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button name="btnReload" size="small" type="primary" @click="step = 1">重新导入</el-button>
      <el-button name="btnCancel2" size="small" @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  MEMBERSHIP_API_MEMBER_IMPORTOFFLINEMEMBER
} from '@/apis/membership'
import {
  DOMAIN_APIS, DOMAIN_FILE
} from '@/configs/appSettings'

export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        id: '',
        name: ''
      },
      rules: {
        name: [
          {
            required: true, message: '需要上传excel文件才能进行下一步'
          }
        ]
      },
      fileList: [],
      loading: false,
      step: 1,
      uploadUrl: DOMAIN_APIS.Membership + '/api/Uploader/UploadToTempAsync',
      charfale: [],
    }
  },
  methods: {
    dowloadTemplate() {
      const url = DOMAIN_FILE + '/membershipcloud/导入线下会员模板.xlsx'
      location.href = url
    },
    handleSuccess(files, fileList) {
      this.$message.success('上传成功！')
      this.form.id = files.Data[0]
      this.form.name = fileList.name
      this.loading = false
    },
    handleError() {
      this.$message.error('上传失败！')
      this.loading = false
    },
    handleProgress() {
      this.loading = true
    },
    importCancel() {
      this.$refs['form'].resetFields()
      this.$emit('update:visible', false)
    },
    cancel() {
      this.$emit('update:visible', false)
      this.step = 1
    },
    onSubmit() {
      this.$refs['form'].validate(valide => {
        if (valide) {
          this.loading = true
          MEMBERSHIP_API_MEMBER_IMPORTOFFLINEMEMBER({
            fileName: this.form.id
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.loading = false
              this.$refs['form'].resetFields()
              if (res.data.Data.errors.length == 0) {
                this.$message({
                  showClose: true,
                  message: '导入成功',
                  type: 'success'
                })
                this.$emit('success')
                this.importCancel()
              } else {
                this.charfale = res.data.Data.errors
                this.step = 2
              }
            } else {
              this.loading = false
              this.importCancel()
            }
          })
        }
      })

    },
  },
}
</script>

<style lang="scss" scoped>
.result {
  margin-bottom: 16px;
  .title {
    display: inline-block;
  }
  .context {
    display: inline-block;
    margin-left: 5px;
  }
}
.step-two /deep/ .cell.el-tooltip {
  height: 33px;
  line-height: 33px;
}
.step-two /deep/ .el-input__suffix-inner {
  line-height: 40px;
}
ol {
  font-size: 12px;
  line-height: 18px;
}
</style>
