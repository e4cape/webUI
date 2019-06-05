<template>
  <div class="sys-training-detail">
    <basicInfoTb
      :basicInfo="basicInfo"
      :loadingBasic="loadingBasic"
    ></basicInfoTb>
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
          <ul
            class="con"
            v-loading="loadingBasic"
          >
            <li>
              <div class="con-l">
                封面：
              </div>
              <div class="con-r">
                <img
                  v-if="basicInfo.ImageUrl"
                  :src="basicInfo.ImageUrl.startsWith('http')?basicInfo.ImageUrl:$root.settings.DOMAIN_IMG_FILE+basicInfo.ImageUrl"
                >
              </div>
            </li>
            <li>
              <div class="con-l">
                简介：
              </div>
              <div class="con-r">
                {{basicInfo.CourseNote}}
              </div>
            </li>
            <li>
              <div class="con-l">
                正文：
              </div>
              <div class="con-r">
                <span v-html="basicInfo.Content"></span>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane
          v-if="basicInfo.IsPaper == EnumYNStatus.Yes"
          label="题库"
          name="second"
        >
          <div class="question">
            <div class="about clearfix">
              <div class="fl">
                实际考试时系统随机选题，选项打乱顺序。最多可添加200道题。以下正确答案黄色加粗显示。
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
                    alt=""
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="题目类型"
                prop="joinTime"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{EnumInfrastCourseQuesType.Types[scope.row.QuesType]}}
                </template>
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
            </el-table>
            <pagination
              :total="total"
              :pg="form.PageIndex"
              :size="form.PageSize"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      v-if="parameter.activeName == 'first' || tableData.length>0"
      class="md-line"
    ></div>
    <div class="bd">
      <el-button
        name="btnAudit"
        v-if="basicInfo.State == EnumInfrastCourseState.Wait"
        @click="audit"
      >审核</el-button>
      <el-button
        name="btnInvalid"
        v-if="basicInfo.State == EnumInfrastCourseState.Audit"
        @click="auditCancel"
      >取消审核</el-button>
      <template v-if="basicInfo.State == EnumInfrastCourseState.Draft || basicInfo.State == EnumInfrastCourseState.Reject || basicInfo.State == EnumInfrastCourseState.Cancel">
        <el-button
          name="btnEdit"
          type="primary"
          @click="$router.push(`/science/sysTraining/docEdit?id=${form.CourseId}`)"
        >编辑</el-button>
        <el-button
          name="btnInvalid"
          @click="invalid"
        >作废</el-button>
      </template>
    </div>
    <auditModal
      v-if="visibleAuditModal"
      :visibleAuditModal="visibleAuditModal"
      @listenVisibleAuditModal="listenVisibleAuditModal"
      :auditObj="basicInfo"
    ></auditModal>
    <invalidCancelModal
      v-if="visibleInvalidCancelModal"
      :title="title"
      :apiName="apiName"
      :visibleInvalidCancelModal="visibleInvalidCancelModal"
      :invalidCancelObj="basicInfo"
      @listenVisibleInvalidCancelModal="listenVisibleInvalidCancelModal"
    />
  </div>
</template>
<script>
import {
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL, // 系统详情
  COLLEGE_API_INFRASTCOURSEQUES_SYSTEMLIST // 题库列表
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import { InfrastCourseState, InfrastCourseQuesType } from '@/enums/science'

import pagination from '@/components/pagination.vue'
import basicInfoTb from '../template/basicInfoTb'
import auditModal from '../template/auditModal'
import invalidCancelModal from '../template/invalidCancelModal'

export default {
  data() {
    return {
      loadingBasic: false, // 基本信息loading
      basicInfo: {}, // 基本信息
      visibleAuditModal: false, // 审核显隐
      visibleInvalidCancelModal: false, // 作废或取消审核显隐
      title: '', // 作废或取消审核
      apiName: '', // 调用的接口名字
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
      total: 0
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
      COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL({
        CourseId: this.$route.query.id
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
        path: `/science/sysTraining/docDetail?id=${this.$route.query.id}`,
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
    // 审核
    audit() {
      this.visibleAuditModal = true
    },
    listenVisibleAuditModal(succ) {
      if (succ) {
        this.getInfrastCourseBasic()
        this.getData()
      }
      this.visibleAuditModal = false
    },
    // 作废、取消审核
    invalid() {
      this.title = '作废'
      this.apiName = 'COLLEGE_API_INFRASTCOURSEBASIC_ABANDONSYSTEM'
      this.visibleInvalidCancelModal = true
    },
    auditCancel() {
      this.title = '取消审核'
      this.apiName = 'COLLEGE_API_INFRASTCOURSEBASIC_CANCELSYSTEM'
      this.visibleInvalidCancelModal = true
    },
    listenVisibleInvalidCancelModal(succ) {
      if (succ) {
        this.getInfrastCourseBasic()
        this.getData()
      }
      this.visibleInvalidCancelModal = false
    }
  },
  components: {
    pagination,
    basicInfoTb,
    auditModal,
    invalidCancelModal
  }
}
</script>
<style lang="scss" scoped>
.sys-training-detail {
  .md {
    padding: 20px 10px 0 10px;
    border-left: 1px solid $border-color;
    border-right: 1px solid $border-color;
    .con {
      padding: 20px 15px;
      li {
        position: relative;
        min-height: 24px;
        line-height: 24px;
        padding-left: 60px;
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
        .con-l {
          position: absolute;
          top: 0;
          left: 0;
          line-height: 24px;
        }
        .con-r {
          width: 50%;
          word-break: break-all;
          img {
            width: 160px;
            height: 90px;
          }
        }
      }
    }
    .question {
      .about {
        & > .fl {
          line-height: 48px;
          color: $gray;
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
  .md-line {
    height: 1px;
    background: $border-color;
  }
  .bd {
    padding: 10px 0 50px;
  }
}
</style>

