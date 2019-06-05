<template>
  <div class="sys-training-detail">
    <basicInfoTb
      :basicInfo="basicInfo"
      :loadingBasic="loadingBasic"
    >
      <el-button
        name="btnVisibleDocModal"
        type="text"
        @click="visibleDocModal = true"
      >修改</el-button>
    </basicInfoTb>
    <div class="md clear">
      <el-tabs
        type="card"
        v-model="parameter.activeName"
        @tab-click="tabClick"
        class="lcb-tabs"
      >
        <el-tab-pane
          label="内容"
          name="first"
        >
          <el-form
            :model="conForm"
            :rules="rules"
            ref="conForm"
            label-width="60px"
            class="con-form"
          >
            <el-form-item
              label="封面："
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
              label="简介："
              prop="CourseNote"
            >
              <el-col :span="14">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="conForm.CourseNote"
                  maxlength="300"
                ></el-input>
                <span
                  class="note word"
                  v-if="conForm.CourseNote.length"
                >{{conForm.CourseNote.length}}/300字</span>
              </el-col>
            </el-form-item>
            <el-form-item
              label="正文："
              prop="Content"
            >
              <el-col :span="14">
                <editor
                  @listenEditerChange="listenEditerChange"
                  :Note="html"
                ></editor>
                <span
                  v-if="editorText.length"
                  class="note word"
                >
                  <i :class="editorText.length>2000?'red':''">{{editorText.length}}</i>/2000字
                </span>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="saveConForm"
                :loading="saveConFormLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-if="basicInfo.IsPaper == EnumYNStatus.Yes"
          label="题库"
          name="second"
        >
          <div class="question">
            <div class="about clearfix">
              <div class="fl">
                <el-button
                  type="primary"
                  @click="addSubject"
                >增加题目</el-button>实际考试时系统随机选题，选项打乱顺序。最多可添加200道题。以下正确答案黄色加粗显示。
              </div>
              <div class="fr">
                <div class="fl">
                  <b>{{basicInfo.SingleAmt}}</b>
                  <p>单选题</p>
                </div>
                <div class="fl">
                  <b>{{basicInfo.MultiAmt}}</b>
                  <p>多选题</p>
                </div>
              </div>
            </div>
            <el-table
              :data="tableData"
              v-loading="$store.getters.tb_loading"
            >
              <el-table-column
                label="序号"
                prop="QuesId"
                min-width="50"
                fixed="left"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="题目"
                prop="Title"
                min-width="200"
                fixed="left"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="图片"
                prop="ImageUrl"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.ImageUrl"
                    :src="$root.settings.DOMAIN_IMG_FILE+scope.row.ImageUrl"
                    alt
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="题目类型"
                prop="joinTime"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{EnumInfrastCourseQuesType.Types[scope.row.QuesType]}}</template>
              </el-table-column>
              <el-table-column
                :label="`选项${k+1}`"
                prop="Options"
                min-width="100"
                show-overflow-tooltip
                v-for="(v,k) in 6"
                :key="k"
              >
                <template slot-scope="scope">
                  <span v-if="JSON.parse(scope.row.Options)[k]">
                    <span :class="JSON.parse(scope.row.Options)[k].IsAnswer == EnumYNStatus.Yes ? 'is-answer':''">{{JSON.parse(scope.row.Options)[k].Title}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    name="btnLook"
                    @click="del($event,scope.row.QuesId)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :total="total"
              :pg="form.PageIndex"
              :size="form.PageSize"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
            <div
              v-if="parameter.activeName == 'second' && tableData.length<1"
              style="height:10px"
            ></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bd">
      <el-button
        v-if="basicInfo.State == EnumInfrastCourseState.Draft || basicInfo.State == EnumInfrastCourseState.Reject || basicInfo.State == EnumInfrastCourseState.Cancel"
        :disabled="!basicInfo.ImageUrl"
        type="primary"
        @click="submitAudit"
        :loading="$store.getters.is_loading"
      >提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
    <docVideoModal
      v-if="visibleDocModal"
      :visibleDocVideoModal="visibleDocModal"
      @listenVisibleDocVideoModal="listenVisibleDocVideoModal"
      title="修改文档(基本信息)"
      :courseType="EnumInfrastCourseType.Article"
      :docVideoObj="basicInfo"
    />
    <addSubjectModal
      v-if="visibleAddSubjectModal"
      :visibleAddSubjectModal="visibleAddSubjectModal"
      @listenVisibleAddSubjectModal="listenVisibleAddSubjectModal"
      :CourseId="id"
    />
  </div>
</template>
<script>
import {
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL, // 系统详情
  COLLEGE_API_INFRASTCOURSEBASIC_MODIFYBYSYSTEMARTICLE, // 更新文档内容
  COLLEGE_API_INFRASTCOURSEQUES_SYSTEMLIST, // 题库列表
  COLLEGE_API_INFRASTCOURSEQUES_DELETEBYSYSTEM, // 题库删除
  COLLEGE_API_INFRASTCOURSEBASIC_SUBMITBYSYSTEM // 提交审核
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import {
  InfrastCourseState,
  InfrastCourseQuesType,
  InfrastCourseType
} from '@/enums/science'

import pagination from '@/components/pagination.vue'
import basicInfoTb from '../template/basicInfoTb'
import docVideoModal from '../template/docVideoModal'
import addSubjectModal from '../template/addSubjectModal'
import uploadImg from '@/components/common/uploadImg'

import editor from '@/components/common/editor'

export default {
  data() {
    return {
      id: this.$route.query.id,
      loadingBasic: false, // 基本信息loading
      basicInfo: {}, // 基本信息
      visibleDocModal: false, // 修改文档(基本信息)显隐
      visibleAddSubjectModal: false, // 增加题目项目
      smsMarketingInfo: {}, // 短信任务数据
      // 表格分页相关
      form: {
        CourseId: this.$route.query.id,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {
        activeName: 'first'
      },
      tableData: [],
      total: 0,
      // 内容conForm
      uploadImgLoading: false,
      uploadImageUrl: '',
      conForm: {
        ImageUrl: '', // 图片地址
        CourseNote: '', // 课程简介
        Content: '' // 课程描述(正文)
      },
      rules: {
        ImageUrl: [
          {
            required: true,
            message: '请上传封面',
            trigger: 'change'
          }
        ],
        CourseNote: [
          {
            required: true,
            message: '请输入简介'
          }
        ],
        Content: [
          {
            required: true,
            message: '请编辑正文',
            trigger: 'change'
          }
        ]
      },
      saveConFormLoading: false,
      html: '',
      editorText: ''
    }
  },
  computed: {
    EnumYNStatus() {
      return YNStatus
    },
    EnumInfrastCourseState() {
      return InfrastCourseState
    },
    EnumInfrastCourseQuesType() {
      return InfrastCourseQuesType
    },
    EnumInfrastCourseType() {
      return InfrastCourseType
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.getInfrastCourseBasic()
    this.init()
  },
  methods: {
    // 获取系统详情
    getInfrastCourseBasic() {
      this.loadingBasic = true
      this.uploadImgLoading = true
      COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL({
        CourseId: this.id
      })
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.basicInfo = res.data.Data
            const {ImageUrl,CourseNote,Content} = res.data.Data
            if (ImageUrl) {
              this.uploadImageUrl =
                this.$root.settings.DOMAIN_IMG_FILE + ImageUrl
            }
            this.conForm.ImageUrl = ImageUrl
            this.conForm.CourseNote = CourseNote
            this.conForm.Content = Content
            this.html = Content
          }
          this.loadingBasic = false
          this.uploadImgLoading = false
        })
        .catch(() => {
          this.loadingBasic = false
          this.uploadImgLoading = false
        })
    },
    // 获取系统详情-修改用
    getInfrastCourseBasicForModify() {
      this.loadingBasic = true
      COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL({
        CourseId: this.id
      })
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.basicInfo = res.data.Data
          }
          this.loadingBasic = false
        })
        .catch(() => {
          this.loadingBasic = false
        })
    },
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.activeName = query.activeName || 'first'
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: `/science/sysTraining/docEdit?id=${this.id}`,
        query: this.parameter
      })
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      COLLEGE_API_INFRASTCOURSEQUES_SYSTEMLIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // tab切换
    tabClick(e) {
      this.parameter.activeName = e.name
      this.initRoute()
    },
    // 题库删除
    del(e, QuesId) {
      e.currentTarget.blur()
      this.$confirm('您正在进行删除操作，删除后不可恢复！确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        COLLEGE_API_INFRASTCOURSEQUES_DELETEBYSYSTEM({QuesId: QuesId}).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.getInfrastCourseBasic()
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    // 修改文档
    listenVisibleDocVideoModal(succ) {
      if (succ) {
        this.getInfrastCourseBasicForModify()
        this.getData()
      }
      this.visibleDocModal = false
    },
    // 增加题目
    listenVisibleAddSubjectModal(succ) {
      if (succ) {
        this.getData()
        COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL({
          CourseId: this.id
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.basicInfo.SingleAmt = res.data.Data.SingleAmt
            this.basicInfo.MultiAmt = res.data.Data.MultiAmt
          }
        })
      }
      this.visibleAddSubjectModal = false
    },
    // 图片上传
    uploadSucc(Key) {
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      this.conForm.ImageUrl = Key
      this.$refs.conForm.validateField('ImageUrl')
    },
    uploadImgLoadingChange(v) {
      this.uploadImgLoading = v
    },
    // 编辑器
    listenEditerChange(obj) {
      this.editorText = obj.text
      if (obj.text.length == 0 && !obj.html.includes('img')) {
        this.conForm.Content = ''
      } else {
        this.conForm.Content = obj.html
      }
      this.$refs.conForm.validateField('Content')
    },
    // 保存
    saveConForm() {
      const param = Object.assign({}, this.conForm, {
        CourseId: this.id
      })
      this.$refs.conForm.validate(valid => {
        if (valid) {
          if (this.editorText.length > 2000) {
            this.$message.warning('正文文字过长')
            return false
          }
          this.saveConFormLoading = true
          COLLEGE_API_INFRASTCOURSEBASIC_MODIFYBYSYSTEMARTICLE(param)
            .then(res => {
              if (res.data.Code == 'CORRECT') {
                this.getInfrastCourseBasic()
              }
              this.saveConFormLoading = false
            })
            .catch(() => {
              this.saveConFormLoading = false
            })
        }
      })
    },
    // 增加题目
    addSubject() {
      if (this.tableData.length >= 200) {
        this.$message.warning('最多添加200道！不能再添加')
        return
      }
      this.visibleAddSubjectModal = true
    },
    // 提交审核
    submitAudit() {
      this.$store.commit('SET_BTN_LOADING', true)
      COLLEGE_API_INFRASTCOURSEBASIC_SUBMITBYSYSTEM({ CourseId: this.id }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push('/science/sysTraining/index')
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  components: {
    pagination,
    basicInfoTb,
    docVideoModal,
    addSubjectModal,
    uploadImg,
    editor
  }
}
</script>
<style lang="scss" scoped>
.sys-training-detail {
  .md {
    padding: 20px 10px 0 10px;
    border: 1px solid $border-color;
    border-top: none;
    .con-form {
      padding: 18px 18px 0 0;
      /deep/ .el-form-item__label {
        padding: 0;
        text-align: left;
      }
      .note {
        color: $light-gray;
        &.word {
          display: block;
          height: 28px;
          line-height: 28px;
          padding-right: 10px;
          margin-top: -28px;
          text-align: right;
          color: $light-gray;
        }
      }
      /deep/ .el-form-item__error {
        padding-top: 3px;
      }
    }
    .question {
      .about {
        & > .fl {
          line-height: 48px;
          color: $gray;
          button {
            margin-right: 10px;
          }
        }
        .fr {
          padding-top: 4px;
          line-height: 20px;
          .fl {
            margin-right: 20px;
            text-align: center;
          }
        }
      }
      img {
        display: block;
        width: 160px;
        height: 90px;
        margin: 10px 0;
      }
      .is-answer {
        color: #ffa200;
        font-weight: bold;
      }
    }
  }
  .bd {
    padding: 10px 0 50px;
  }
}
</style>

