<template>
  <section>
    <div class="panel new-panel">
      <div
        class="panel-hd"
        style="border-bottom: 0;"
      >
        <span class="title">基本信息</span>
      </div>
    </div>
    <div
      class="panel-bd m-b-10"
      v-loading="basicLoading"
    >
      <div class="details-info-table cus">
        <table
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr>
              <td class="tit">专题名称</td>
              <td>{{ basicInfo.Title }}</td>
              <td class="tit">创建</td>
              <td>{{ basicInfo.CreateUser }} {{basicInfo.CreateTime | filterDateTime}}</td>
            </tr>
            <tr>
              <td class="tit">专题封面</td>
              <td class="note">
                <img
                  :src="$root.settings.DOMAIN_IMG_FILE+basicInfo.ImageUrl"
                  alt
                >
              </td>
              <td class="tit">专题介绍</td>
              <td class="note">{{ basicInfo.Note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-hd">
        <span class="title">专题内容</span>
      </div>
      <div class="p-10">
        <el-table
          :data="tableData"
          v-loading="$store.getters.tb_loading"
        >
          <el-table-column
            label="序号"
            prop="ItemId"
            width="55"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="名称"
            prop="CourseTitle"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="分类"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
            </template>
          </el-table-column>
          <el-table-column
            label="适用套餐"
            prop="PackName"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="类型"
            min-width="50"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{EnumInfrastCourseType.Types[scope.row.CourseType]}}</template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="CreateTime"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                name="btnLook"
                @click="look(scope.row)"
                type="text"
                size="small"
              >查看</el-button>
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
    </div>
  </section>
</template>

<script>
import {
  COLLEGE_API_INFRASTSUBJECTBASIC_GET, // 管控中心 - 课程专题 - 详情
  COLLEGE_API_INFRASTSUBJECTITEM_GETS // 管控中心 - 专题管理 - 详情(明细列表)
} from '@/apis/science'

import { InfrastCourseType, InfrastCourseChannelType } from '@/enums/science'

import pagination from '@/components/pagination.vue'

export default {
  data() {
    return {
      basicInfo: {}, // 基本信息
      basicLoading: false, // 基本信息loading
      // 表格分页相关
      form: {
        SubjectId: this.$route.query.id,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0
    }
  },
  computed: {
    EnumInfrastCourseType() {
      return InfrastCourseType
    },
    EnumInfrastCourseChannelType() {
      return InfrastCourseChannelType
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.getBasicInfo()
    this.init()
  },
  methods: {
    // 获取基本信息
    getBasicInfo() {
      this.basicLoading = true
      COLLEGE_API_INFRASTSUBJECTBASIC_GET({
        SubjectId: this.$route.query.id
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.basicInfo = res.data.Data
        }
        this.basicLoading = false
      })
    },
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: `/science/topic/detail?id=${
          this.$route.query.id
        }`,
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
      COLLEGE_API_INFRASTSUBJECTITEM_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    look({ ChannelType, CourseType, CourseId }) {
      if (ChannelType == InfrastCourseChannelType.System) {
        if (CourseType == InfrastCourseType.Article) {
          this.$router.push(
            `/science/sysTraining/docDetail?id=${CourseId}`
          )
        } else {
          this.$router.push(
            `/science/sysTraining/videoDetail?id=${CourseId}`
          )
        }
      } else {
        if (CourseType == InfrastCourseType.Article) {
          this.$router.push(
            `/science/jewelryCollege/docDetail?id=${CourseId}`
          )
        } else {
          this.$router.push(
            `/science/jewelryCollege/videoDetail?id=${CourseId}`
          )
        }
      }
    }
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
.cus {
  margin: 10px 0;
  .tit {
    min-width: 80px;
  }
  .note {
    min-width: 120px;
  }
  img {
    display: block;
    width: 200px;
    height: 112.5px;
    margin: 10px 0;
  }
}
</style>
