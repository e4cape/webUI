<template>
  <div class="content" v-loading="$store.getters.is_loading">
    <h2 class="sm-t">操作说明</h2>
    <div class="m-20">
      <p class="tips">可通过EXCEL表编辑好商品信息，然后上传编辑好的EXCEL表即可批量上传商品，EXCEL的编辑模板如下：</p>
      <img src="/static/images/market_goods_upload_template.png" alt style="max-width:100%;">
      <p class="tips m-t-20">
        只支持xls和xlsx格式的Excel文件
        <el-button name="btnDowloadTemplate" type="text" v-loading="downLoading" @click="dowloadTemplate">商品模板(EXCEL)下载</el-button>
      </p>
    </div>
    <h2 class="sm-t">上传商品</h2>
    <div class="p-20">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="id">
          <el-input name="btnUpload" disabled v-model="form.id" class="w-400">
            <el-upload
              slot="append"
              class="upload-demo"
              :action="uploadUrl"
              :on-error="handleError"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :data="{Root:$root.filePaths.MARKETING_PRODUCT}"
              :headers="{'access-token': this.$store.getters.access_token}"
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              <el-button icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button name="btnOnSubmit" type="primary" v-loading="$store.getters.is_loading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  MARKETING_API_STORE_PRODUCT_BASIC_DOWNLOADPROTEMPLETEXCEL,
  MARKETING_API_STORE_PRODUCT_BASIC_CREATE
} from '@/apis/marketing'

export default {
  data() {
    return {
      form: {
        id: ''
      },
      rules: {
        id: [
          {
            required: true,
            message: '不能为空！'
          }
        ]
      },
      uploadUrl:
        `${this.$root.settings.DOMAIN_APIS.Common}/Upload/File/UploadToOss/`,
      downLoading: false
    }
  },
  methods: {
    dowloadTemplate() {
      this.downLoading = true
      MARKETING_API_STORE_PRODUCT_BASIC_DOWNLOADPROTEMPLETEXCEL().then(res => {
        this.downLoading = false
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data || !res.data.Data.FilePath) {
            this.$message.error('服务器错误')
            return
          }
          location.href = res.data.Data.FilePath
        }
      }).catch(() => {
        this.downLoading = false
      })
    },
    handleSuccess(file) {
      this.$message.success('上传成功！')
      this.form.id = file.Data.Path
      this.loading.close()
    },
    // 有些电脑的type是空字符串
    beforeUpload(file) {
      let type = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (type !== 'xls' && type !== 'xlsx') {
        this.$message.error('只支持xls和xlsx格式的Excel文件!')
        return false
      } else {
        return true
      }
    },
    handleError() {
      this.$message.error('上传失败！')
      this.loading.close()
    },
    handleProgress() {
      this.loading = this.$loading({
        lock: true,
        text: '正在努力上传中...',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    },
    onSubmit() {
      this.$refs['form'].validate(valide => {
        if (valide) {
          this.$store.commit('SET_BTN_LOADING', true)
          MARKETING_API_STORE_PRODUCT_BASIC_CREATE({ FileExcel: this.form.id }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code == 'CORRECT') {
              this.$message.success('上传成功！')
              this.$router.push('/market/product/index')
            } else {
              /<[^>]+>/g.test(res.data.Message) && this.$alert(res.data.Message, '错误提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定'
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.w-400 {
  width: 400px;
}

.sm-t {
  border-top: 1px solid #e5e5e5;
  background-color: #f5f5f5;
  border-bottom: 1px #e5e5e5 solid;
  padding: 10px;
  i {
    color: #399fe5;
  }
}

.tips {
  color: #777;
  margin-bottom: 10px;
}

.lnk {
  display: inline-block;
  margin-left: 20px;
}
</style>
