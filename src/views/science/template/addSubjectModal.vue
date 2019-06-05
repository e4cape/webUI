<template>
  <el-dialog
    title="增加题目"
    :visible.sync="visible"
    width="900px"
    class="add-subject-modal"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
    >
      <el-form-item
        label="题目"
        prop="Title"
      >
        <el-input
          name="inputName"
          v-model="ruleForm.Title"
          class="name"
          maxlength="100"
        ></el-input>
        <span class="note">5-100字</span>
      </el-form-item>
      <el-form-item
        label="图片"
        prop="ImageUrl"
      >
        <uploadImg
          :uploadImgLoading="uploadImgLoading"
          :uploadImageUrl="uploadImageUrl"
          :Root="$root.filePaths.COLLEGE_INFAST"
          @uploadSucc="uploadSucc"
          @uploadImgLoadingChange="uploadImgLoadingChange"
        />
        <span class="note">图片格式仅支持JPG／PNG格式，不超过2M大小，建议640*360</span>
      </el-form-item>
      <el-form-item
        label="题目类型"
        prop="QuesType"
      >
        <el-radio-group
          name="sendType"
          v-model="ruleForm.QuesType"
          class="radio"
        >
          <el-radio :label="EnumInfrastCourseQuesType.Single">单选</el-radio>
          <el-radio :label="EnumInfrastCourseQuesType.Multi">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="答题选项"
        style="marginBottom:0"
      >
        <el-table :data="Options">
          <el-table-column
            prop="option"
            label="选项"
            width="100"
          >
            <template slot-scope="scope">选项{{ scope.row.OptionId}}</template>
          </el-table-column>
          <el-table-column
            prop="Title"
            label="选项内容"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.Title"
                placeholder="请输入内容"
                :maxlength="50"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="IsAnswer"
            label="正确答案"
            width="100"
          >
            <template slot-scope="scope">
              <el-switch
                :disabled="/^[ ]*$/.test(scope.row.Title)||scope.row.Title.length<1"
                v-model="scope.row.IsAnswer"
                :active-value="EnumYNStatus.Yes"
                :inactive-value="EnumYNStatus.No"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnConfirm"
        type="primary"
        @click="btnConfirm"
        :loading="$store.getters.is_loading"
      >保 存</el-button>
      <el-button
        name="btnCancel"
        @click="visible = false"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  COLLEGE_API_INFRASTCOURSEQUES_CREATEBYSYSTEM, // 系统增加题目
  COLLEGE_API_INFRASTCOURSEQUES_CREATEBYCOLLEGE // 学院增加题目
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import {
  InfrastCourseQuesType,
  InfrastCourseChannelType
} from '@/enums/science'

import uploadImg from '@/components/common/uploadImg'
export default {
  props: {
    visibleAddSubjectModal: {
      type: Boolean
    },
    channelType: {
      // 系统还是学院
      type: Number,
      default: InfrastCourseChannelType.System
    },
    CourseId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      visible: this.visibleAddSubjectModal,
      uploadImgLoading: false,
      uploadImageUrl: '',
      ruleForm: {
        Title: '', // 题目
        ImageUrl: '', // 图片
        QuesType: InfrastCourseQuesType.Single // 题目类型单选多选
      },
      rules: {
        Title: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if ((value && value.trim() == '') || value.length == 0) {
                callback(new Error('请输入题目'))
              } else if (value && value.trim().length < 5) {
                callback(new Error('长度为5到100个字符'))
              }
              callback()
            }
          }
        ]
      },
      Options: [
        {
          OptionId: 1,
          Title: '',
          IsAnswer: YNStatus.No
        },
        {
          OptionId: 2,
          Title: '',
          IsAnswer: YNStatus.No
        },
        {
          OptionId: 3,
          Title: '',
          IsAnswer: YNStatus.No
        },
        {
          OptionId: 4,
          Title: '',
          IsAnswer: YNStatus.No
        },
        {
          OptionId: 5,
          Title: '',
          IsAnswer: YNStatus.No
        },
        {
          OptionId: 6,
          Title: '',
          IsAnswer: YNStatus.No
        }
      ],
      succ: false
    }
  },
  computed: {
    EnumInfrastCourseQuesType() {
      return InfrastCourseQuesType
    },
    EnumYNStatus() {
      return YNStatus
    },
    EnumInfrastCourseChannelType() {
      return InfrastCourseChannelType
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleAddSubjectModal', this.succ)
    }
  },
  methods: {
    // 图片上传
    uploadSucc(Key) {
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      this.ruleForm.ImageUrl = Key
    },
    uploadImgLoadingChange(v) {
      this.uploadImgLoading = v
    },
    btnConfirm() {
      let titles = []
      this.Options.map(item => {
        item.Title = item.Title.trim()
        if (item.Title.length > 0) {
          titles.push(item.Title)
        }
        return item
      })
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { Title, QuesType, ImageUrl } = this.ruleForm

          if (titles.length <= 1 && QuesType == InfrastCourseQuesType.Single) {
            this.$message.error('单选题选项至少2个')
            return
          }
          if (titles.length <= 2 && QuesType == InfrastCourseQuesType.Multi) {
            this.$message.error('多选题选项至少3个')
            return
          }

          let param = {
            CourseId: Number(this.CourseId),
            Title: Title.trim(),
            QuesType,
            ImageUrl,
            Options: this.Options
          }
          this.$store.commit('SET_BTN_LOADING', true)
          if (this.channelType == InfrastCourseChannelType.System) {
            COLLEGE_API_INFRASTCOURSEQUES_CREATEBYSYSTEM(param).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message({
                  message: res.data.Message,
                  type: 'success'
                })
                this.succ = true
                this.visible = false
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          }
          if (this.channelType == InfrastCourseChannelType.College) {
            COLLEGE_API_INFRASTCOURSEQUES_CREATEBYCOLLEGE(param).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message({
                  message: res.data.Message,
                  type: 'success'
                })
                this.succ = true
                this.visible = false
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          }
        } else {
          return false
        }
      })
    }
  },
  components: {
    uploadImg
  }
}
</script>
<style lang="scss" scoped>
.add-subject-modal {
  .name {
    width: 300px;
  }
  .note {
    margin-left: 5px;
    color: $light-gray;
  }
  .examination {
    p {
      margin-top: 10px;
      &:first-child {
        margin-top: 0;
      }
    }
    /deep/ .el-input {
      width: 50px;
      margin-left: 5px;
    }
  }
  .ainput {
    width: 50px;
  }
  /deep/ .el-form-item__error {
    padding-top: 3px;
  }
}
</style>
