<template>
  <el-dialog width="600px" class="edit-info-dialog" :visible.sync="visible" :title="title">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" v-loading="loadingIf">
      <el-form-item label="方案封面" prop="ImageUrl">
        <uploadImg
          :uploadImgLoading="uploadImgLoading"
          :uploadImageUrl="uploadImageUrl"
          :Root="$root.filePaths.COLLEGE_INFAST"
          @uploadSucc="uploadSucc"
          @uploadImgLoadingChange="uploadImgLoadingChange"
        />
      </el-form-item>
      <el-form-item label="方案名称" prop="Title">
        <el-input v-model="ruleForm.Title" @keyup.native="ruleForm.Title = mytrim(ruleForm.Title)" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="培训目标" prop="Target">
        <el-input v-model="ruleForm.Target" @keyup.native="ruleForm.Target = mytrim(ruleForm.Target)" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="适用范围" prop="Scope">
        <el-input v-model="ruleForm.Scope" @keyup.native="ruleForm.Scope = mytrim(ruleForm.Scope)" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="适用套餐" prop="PackId">
        <el-select v-model="ruleForm.PackId" placeholder="请选择适用套餐">
          <el-option v-for="item in packArr" :key="item.PackId" :label="item.PackName" :value="item.PackId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划天数" prop="Days">
        <el-input v-model="ruleForm.Days" maxlength="3" @keyup.native="ruleForm.Days = $root.toFixed(ruleForm.Days)"></el-input>
        <span class="note">天</span>
      </el-form-item>
      <el-form-item label="方案介绍" prop="Note">
        <el-input type="textarea" maxlength="200" v-model="ruleForm.Note"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="$store.getters.is_loading" @click="btnSave">保存</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  COLLEGE_API_SETTINGSOLUTIONBASIC_CREATE, // 方案管理创建
  COLLEGE_API_SETTINGSOLUTIONBASIC_UPDATE, // 方案管理修改
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST // 套餐 - 下拉框
} from '@/apis/science'

import uploadImg from '@/components/common/uploadImg'
import sortItem from '../template/sortOrderItem'

export default {
  props: {
    visibleInfomationDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    infoObj: {
      type: Object,
      value: null
    }
  },
  data() {
    return {
      visible: this.visibleInfomationDialog,
      uploadImgLoading: false,
      theTitle: this.title,
      uploadImageUrl: '',
      packArr: [],
      loadingIf: false,
      ruleForm: {
        PackId: null,
        Title: '',
        ImageUrl: '',
        Target: '',
        Scope: '',
        Days: null,
        Note: ''
      },
      rules: {
        ImageUrl: [
          {
            required: true,
            message: '请选择方案封面图片!'
          }
        ],
        Title: [
          {
            required: true,
            message: '请输入方案名称!'
          }
        ],

        PackId: [
          {
            required: true,
            message: '请选择适用套餐!'
          }
        ]
      },
      succ: false,
      id: null // 新建成功后的id，用做跳转用
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleInfomationDialog', this.succ, this.id)
    }
  },
  beforeMount() {
    this.getPack()
    if (this.infoObj) {
      const {
        PackId,
        Title,
        ImageUrl,
        Target,
        Scope,
        Days,
        Note
      } = this.infoObj
      Object.assign(this.ruleForm, {
        PackId,
        Title,
        ImageUrl,
        Target,
        Scope,
        Days,
        Note
      })
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + ImageUrl
    }
  },
  mounted() {},
  methods: {
    // 获取套餐
    getPack() {
      this.loadingIf = true
      COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.packArr = res.data.Data.Subset
        }
        this.loadingIf = false
      })
    },
    mytrim(value) {
      return value.replace(/\s/g, '')
    },
    btnSave() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          this.ruleForm.Title = this.ruleForm.Title.replace(/\s/g, '')
          if (this.infoObj) {
            const param = Object.assign({}, this.ruleForm, {
              SolutionId: this.infoObj.SolutionId
            })
            // 更新方案
            COLLEGE_API_SETTINGSOLUTIONBASIC_UPDATE(param).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.succ = true
                this.visible = false
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          } else {
            // 新建方案
            COLLEGE_API_SETTINGSOLUTIONBASIC_CREATE(this.ruleForm).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.succ = true
                this.id = res.data.Data.SolutionId
                this.visible = false
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          }
        }
      })
    },
    //  图片上传
    uploadSucc(Key) {
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      this.ruleForm.ImageUrl = Key
    },
    uploadImgLoadingChange(v) {
      this.uploadImgLoading = v
    }
  },
  components: {
    sortItem,
    uploadImg
  }
}
</script>
<style lang="scss" scoped>
.edit-info-dialog {
  .note {
    margin-left: 5px;
    color: $light-gray;
  }
  .el-input,
  .el-select {
    width: 200px;
  }
  /deep/ .el-form-item__error {
    padding-top: 3px;
  }
}
</style>
