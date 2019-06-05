<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    class="doc-video-modal"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      v-loading="loadingIf"
      label-width="80px"
    >
      <el-form-item
        label="标题"
        prop="CourseTitle"
      >
        <el-input
          name="inputName"
          v-model="ruleForm.CourseTitle"
          class="name"
          :maxlength="25"
        ></el-input>
        <span class="note">25个字以内</span>
      </el-form-item>
      <el-form-item
        v-if="channelType == EnumInfrastCourseChannelType.System"
        label="所属系统"
        prop="LargeId"
        placeholder="请选择"
      >
        <el-select
          name="selectSystem"
          v-model="ruleForm.LargeId"
        >
          <el-option
            v-for="item in systemArr"
            :key="item.DictId"
            :label="item.DictName"
            :value="item.DictId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="channelType == EnumInfrastCourseChannelType.College"
        label="所属课程"
        prop="LargeId"
      >
        <el-cascader
          name="selectLargeId"
          :options="collegeArr"
          v-model="collegeArrSelect"
          :props="{value:'DictId',label:'DictName',children:'Children'}"
          @change="collegeArrChange"
          filterable
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="套餐要求"
        prop="PackId"
      >
        <el-select
          name="selectPack"
          v-model="ruleForm.PackId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in packArr"
            :key="item.PackId"
            :label="item.PackName"
            :value="item.PackId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否考试"
        prop="IsPaper"
      >
        <el-radio-group
          name="sendType"
          v-model="ruleForm.IsPaper"
          class="radio"
        >
          <el-radio :label="EnumYNStatus.Yes">是</el-radio>
          <el-radio :label="EnumYNStatus.No">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="ruleForm.IsPaper == EnumYNStatus.Yes">
        <el-form-item
          label="考题设置"
          style="marginBottom:0"
        >
          <div class="examination">
            <p class="clearfix">
              <span>考试单选题</span>
              <el-form-item prop="SingleQty">
                <el-input
                  v-model="ruleForm.SingleQty"
                  class="ainput"
                  maxlength="3"
                  @keyup.native="ruleForm.SingleQty = $root.toFixed(ruleForm.SingleQty);getPassScore()"
                ></el-input>
              </el-form-item>
              <span>，每道题分数</span>
              <el-form-item prop="SingleScore">
                <el-input
                  v-model="ruleForm.SingleScore"
                  class="ainput"
                  maxlength="3"
                  @keyup.native="ruleForm.SingleScore = $root.toFixed(ruleForm.SingleScore);getPassScore()"
                ></el-input>
              </el-form-item>
            </p>
            <p class="clearfix">
              <span>考试多选题</span>
              <el-form-item prop="MultiQty">
                <el-input
                  v-model="ruleForm.MultiQty"
                  class="ainput"
                  maxlength="3"
                  @keyup.native="ruleForm.MultiQty = $root.toFixed(ruleForm.MultiQty);getPassScore()"
                ></el-input>
              </el-form-item>
              <span>，每道题分数</span>
              <el-form-item prop="MultiScore">
                <el-input
                  v-model="ruleForm.MultiScore"
                  class="ainput"
                  maxlength="3"
                  @keyup.native="ruleForm.MultiScore = $root.toFixed(ruleForm.MultiScore);getPassScore()"
                ></el-input>
              </el-form-item>
            </p>
          </div>
        </el-form-item>
        <el-form-item label="考试总分">
          <div v-if="(ruleForm.SingleQty*ruleForm.SingleScore+ruleForm.MultiQty*ruleForm.MultiScore)>0">
            共
            <span class="total-score">{{ruleForm.SingleQty*ruleForm.SingleScore+ruleForm.MultiQty*ruleForm.MultiScore}}</span> 分
          </div>
        </el-form-item>
        <el-form-item
          label="合格分数"
          prop="PassScore"
        >
          <el-input
            v-model="ruleForm.PassScore"
            class="ainput"
            maxlength="7"
            @keyup.native="ruleForm.PassScore = $root.toFixed(ruleForm.PassScore)"
          ></el-input>
          <span class="m-l-5">分</span>
        </el-form-item>
        <el-form-item
          label="考试限时"
          prop="ExamTime"
        >
          <el-input
            v-model="ruleForm.ExamTime"
            class="ainput"
            maxlength="3"
            @keyup.native="ruleForm.ExamTime = $root.toFixed(ruleForm.ExamTime)"
          ></el-input>
          <span class="m-l-5">分钟</span>
        </el-form-item>
      </template>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnConfirm"
        type="primary"
        @click="btnConfirm"
        :loading="loadingBtn"
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
  COLLEGE_API_INFRASTCOURSEBASIC_CREATEBYSYSTEM, // 系统-新建文档、视频
  COLLEGE_API_INFRASTCOURSEBASIC_UPDATESYSTEM, // 系统-更新基本信息
  COLLEGE_API_INFRASTCOURSEBASIC_CREATEBYCOLLEGE, // 学院-新建文档、视频
  COLLEGE_API_INFRASTCOURSEBASIC_UPDATECOLLEGE, // 学院-更新基本信息
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST, // 套餐-下拉框
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM, // 系统-所属系统-下拉框
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE // 学院-所属课程-下拉框
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import { InfrastCourseType, InfrastCourseChannelType } from '@/enums/science'
import { getTree } from '../util'

export default {
  props: {
    visibleDocVideoModal: {
      type: Boolean
    },
    title: {
      type: String
    },
    channelType: {
      // 频道类型,系统还是学院
      type: Number,
      default: InfrastCourseChannelType.System
    },
    courseType: {
      // 课程类型,文档还是视频
      type: [String, Number]
    },
    docVideoObj: {
      // 编辑修改的时候，原数据
      type: Object
    }
  },
  data() {
    const validateInteger = (rule, value, callback) => {
      if (value > 100) {
        callback(new Error('请输入0-100的整数'))
      }
      callback()
    }
    return {
      visible: this.visibleDocVideoModal,
      succ: false,
      id: null, // 新建成功后的id，用做跳转用
      loadingIf: false,
      loadingBtn: false,
      packArr: [], // 套餐arr
      systemArr: [], // 所属系统arr
      collegeArr: [], // 所属课程arr
      collegeArrSelect: [0, 0], // 选中所属课程
      ruleForm: {
        PackId: null, // 套餐要求
        CourseTitle: '', // 标题
        SmallId: 0,
        LargeId: null, // 所属系统
        SingleQty: null, // 单选题数
        MultiQty: null, // 多选题数
        SingleScore: null, // 单选题分数
        MultiScore: null, // 多选题分数
        PassScore: null, // 合格分数
        ExamTime: null, // 限时
        IsPaper: YNStatus.Yes // 是否考试
      },
      rules: {
        CourseTitle: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.trim().length < 1) {
                callback(new Error('请输入标题'))
              }
              callback()
            }
          }
        ],
        LargeId: [
          {
            required: true,
            message:
              this.channelType == InfrastCourseChannelType.System
                ? '请选择所属系统'
                : '请选择所属课程'
          }
        ],
        PackId: [
          {
            required: true,
            message: '请选择套餐要求'
          }
        ],
        IsPaper: [
          {
            required: true
          }
        ],
        SingleQty: [
          {
            validator: validateInteger
          }
        ],
        MultiQty: [
          {
            validator: validateInteger
          }
        ],
        SingleScore: [
          {
            validator: validateInteger
          }
        ],
        MultiScore: [
          {
            validator: validateInteger
          }
        ],
        ExamTime: [
          {
            validator: (rule, value, callback) => {
              if (value > 180 || value === '0' || value === 0) {
                callback(new Error('请输入1-180的整数'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    EnumYNStatus() {
      return YNStatus
    },
    EnumInfrastCourseType() {
      return InfrastCourseType
    },
    EnumInfrastCourseChannelType() {
      return InfrastCourseChannelType
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleDocVideoModal', this.succ, this.id)
    }
  },
  beforeMount() {
    if (this.docVideoObj) {
      const {
        PackId,
        CourseTitle,
        SmallId,
        LargeId,
        SingleQty,
        MultiQty,
        SingleScore,
        MultiScore,
        PassScore,
        ExamTime,
        IsPaper
      } = this.docVideoObj
      Object.assign(this.ruleForm, {
        PackId,
        CourseTitle,
        SmallId,
        LargeId,
        SingleQty,
        MultiQty,
        SingleScore,
        MultiScore,
        PassScore,
        ExamTime,
        IsPaper
      })
      this.collegeArrSelect = [LargeId, SmallId]
    }
  },
  mounted() {
    this.gets()
  },
  methods: {
    collegeArrChange(v) {
      this.ruleForm.LargeId = v[0]
      this.ruleForm.SmallId = v[1]
    },
    // 获取所属系统和套餐要求
    gets() {
      this.loadingIf = true
      let p1
      if (this.channelType == InfrastCourseChannelType.System) {
        this.collegeArr = []
        // -所属系统
        p1 = COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM().then(res => {
          if (res.data.Code == 'CORRECT') {
            this.systemArr = res.data.Data.Subset
          }
        })
      }
      if (this.channelType == InfrastCourseChannelType.College) {
        this.systemArr = []
        // -所属课程
        p1 = COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE().then(res => {
          if (res.data.Code == 'CORRECT') {
            this.collegeArr = getTree(res.data.Data.Subset, {
              id: 'DictId',
              parentId: 'ParentId',
              children: 'Children'
            })
          }
        })
      }
      // -套餐要求
      const p2 = COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.packArr = res.data.Data.Subset
        }
      })
      Promise.all([p1, p2])
        .then(() => {
          this.loadingIf = false
        })
        .catch(err => {
          this.loadingIf = false
          this.$message.error(err)
        })
    },
    getPassScore() {
      const { SingleQty, MultiQty, SingleScore, MultiScore } = this.ruleForm
      if (SingleQty * SingleScore + MultiQty * MultiScore > 0) {
        this.ruleForm.PassScore = Math.round(
          (SingleQty * SingleScore + MultiQty * MultiScore) * 0.6
        )
      } else {
        this.ruleForm.PassScore = null
      }
    },
    btnConfirm() {
      const {
        SingleQty,
        MultiQty,
        SingleScore,
        MultiScore,
        IsPaper,
        PassScore,
        ExamTime
      } = this.ruleForm

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (IsPaper == YNStatus.Yes) {
            if (
              (SingleQty > 0 && SingleScore < 1) ||
              (MultiQty > 0 && MultiScore < 1)
            ) {
              this.$message.error('题目>0，每题分数也必须>0')
              return
            }
            if (
              (SingleScore > 0 && SingleQty < 1) ||
              (MultiScore > 0 && MultiQty < 1)
            ) {
              this.$message.error('分数>0，题目必须>0')
              return
            }
            if (SingleQty == 0 && MultiQty == 0) {
              this.$message.error('单选题和多选题不能同时为0')
              return
            }
            if (SingleQty < 1 && MultiQty < 1) {
              this.$message.error('选择考试时，单选题和多选题不能同时不填')
              return
            }
            if (!PassScore && PassScore !== 0) {
              this.$message.error('请输入合格分数')
              return
            }
            if (!ExamTime) {
              this.$message.error('请输入考试限时')
              return
            }
            if (PassScore > SingleQty * SingleScore + MultiQty * MultiScore) {
              this.$message.error('合格分数不能大于总分')
            }
          }
          this.loadingBtn = true

          let API, param

          // 系统
          if (this.channelType == InfrastCourseChannelType.System) {
            if (this.docVideoObj) {
              // -更新基本信息
              param = Object.assign({}, this.ruleForm, {
                CourseId: this.docVideoObj.CourseId
              })
              API = COLLEGE_API_INFRASTCOURSEBASIC_UPDATESYSTEM
            } else {
              // -新建文档、视频
              param = Object.assign({}, this.ruleForm, {
                CourseType: this.courseType
              })
              API = COLLEGE_API_INFRASTCOURSEBASIC_CREATEBYSYSTEM
            }
          }
          // 学院
          if (this.channelType == InfrastCourseChannelType.College) {
            if (this.docVideoObj) {
              // -更新基本信息
              param = Object.assign({}, this.ruleForm, {
                CourseId: this.docVideoObj.CourseId
              })
              API = COLLEGE_API_INFRASTCOURSEBASIC_UPDATECOLLEGE
            } else {
              // -新建文档、视频
              param = Object.assign({}, this.ruleForm, {
                CourseType: this.courseType
              })
              API = COLLEGE_API_INFRASTCOURSEBASIC_CREATEBYCOLLEGE
            }
          }

          API(param)
            .then(res => {
              if (res.data.Code == 'CORRECT') {
                this.succ = true
                if (!this.docVideoObj) {
                  this.id = res.data.Data
                }
                this.visible = false
              }
              this.loadingBtn = false
            })
            .catch(() => (this.loadingBtn = false))
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.doc-video-modal {
  .name {
    width: 193px;
  }
  .note {
    margin-left: 5px;
    color: $light-gray;
  }
  /deep/ .el-form-item__error {
    white-space: nowrap;
  }
  .examination {
    p {
      & > span,
      .el-form-item {
        float: left;
      }
    }
    /deep/ .el-input {
      margin-left: 5px;
    }
  }
  .ainput {
    width: 60px;
    /deep/ .el-input__inner {
      padding: 0 5px;
      text-align: center;
    }
  }
  /deep/ .el-form-item__error {
    padding-top: 3px;
  }
  .total-score {
    font-size: 13px;
  }
}
</style>
