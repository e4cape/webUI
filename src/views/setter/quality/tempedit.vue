<template>
  <div class="content">
    <el-row v-loading="isLoading" :gutter="20">
      <el-col :lg="14">
        <el-form label-width="140px" :model="form" :rules="rules" ref="form">
          <el-form-item label="门店logo：">
            <img :src="form.LogoUrl?DOMAIN_IMG_FILE + form.LogoUrl:''" alt="" />
          </el-form-item>
          <el-form-item label="公司印章全称：" prop="StampTitle">
            <el-input v-model="form.StampTitle" :maxlength="20"	></el-input>
          </el-form-item>
          <el-form-item label="质保单模板：" prop="TemplateID">
            <el-radio-group v-model="form.TemplateID" class="temp-list">
              <el-radio :label="1">模板一</el-radio>
              <el-radio :label="2">模板二</el-radio>
              <el-radio :label="3">模板三</el-radio>
              <el-radio :label="4">模板四</el-radio>
              <el-radio :label="5">模板五</el-radio>
              <el-radio :label="6">模板六</el-radio>
              <el-radio :label="7">模板七</el-radio>
              <el-radio :label="8">模板八</el-radio>
              <el-radio :label="99">自定义模板<span>（可在系统设置>模板管理>电子质保单模板中启用或设计）</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="质保单协议：" prop="AgreeNote">
            <el-input type="textarea" maxLength="500" v-model="form.AgreeNote" :autosize="{ minRows: 6}"></el-input>
          </el-form-item>
          <span v-if="form.AgreeNote" class="fr">剩余字数 {{500 - form.AgreeNote.length}}</span>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="10">
        <img :src="form.TemplateID==99?form.CustomImgUrl:'/static/images/quality_temp_'+form.TemplateID+'.jpg'" width="100%" alt="" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  MARKETING_API_STORE_STAMP_GET, MARKETING_API_STORE_STAMP_UPDATE 
} from '@/apis/marketing'
import {
  DOMAIN_IMG_FILE 
} from '@/configs/appSettings'
export default {
  data() {
    return {
      DOMAIN_IMG_FILE,
      form: {
        TemplateID: 1,
      },
      rules: {
        StampTitle: [
          {
            required: true, message: '请输入公司印章全称', trigger: 'blur' 
          }
        ],
        TemplateID: [
          {
            required: true, message: '请选择质保单模板' ,  trigger: 'change'
          }
        ],
        AgreeNote: [
          {
            required: true, message: '请输入质保单协议', trigger: 'blur' 
          },
          {
            min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'change' 
          }
        ]
      },
      isLoading:false
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.isLoading = true
      MARKETING_API_STORE_STAMP_GET().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.form.LogoUrl = this.form.LogoUrl.replace('{0}', '240x120')     
        }
        this.isLoading=false
      })
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.isLoading=true
          MARKETING_API_STORE_STAMP_UPDATE(this.form).then(res => {
            this.isLoading=false
            if(res.data.Code=='CORRECT'){
              this.$message({
                type:'success',
                message:'保存成功！'
              })
              this.$router.push('/setter/quality/tempdetail')
            }
          })
        }
      })

    }
  },
}

</script>
<style lang="scss">
.temp-list {
  .el-radio {
    margin-left: 0;
    margin-right: 10px;
    line-height: 28px;
  }
}
</style>
