<template>
  <div class="index-manage">
    <el-button
      type="primary"
      @click="$router.push('/science/indexManage/preview')"
      class="index-preview"
    >预览首页</el-button>
    <el-tabs
      type="card"
      v-model="activeName"
      @tab-click="tabClick"
      class="lcb-tabs"
    >
      <el-tab-pane
        :label="item.value"
        :name="item.key"
        v-for="item in recmtTypeArr"
        :key="item.key"
      >
        <div class="index-manage-con">
          <div class="hd">
            <el-button
              type="primary"
              @click="addClick"
            >添加</el-button>
            <span class="note">最多添加20个，实际显示根据页面自动适应。不足自动按创建时间显示最新内容。</span>
          </div>
          <div class="bd">
            <el-table
              :data="tableData"
              v-loading="tbloading"
            >
              <el-table-column
                label="图片"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.RecmtType==EnumSustainRecmtType.Subject">
                    <div
                      v-if="scope.row.SubjectImageUrl.startsWith('http')"
                      class="pic"
                    >
                      <img :src="scope.row.SubjectImageUrl">
                    </div>
                    <div
                      v-else-if="scope.row.SubjectImageUrl"
                      class="pic"
                    >
                      <img :src="$root.settings.DOMAIN_IMG_FILE+scope.row.SubjectImageUrl">
                    </div>
                    <div
                      v-else
                      class="pic"
                    >
                      <img src="@/assets/images/noimg.png">
                    </div>
                  </div>
                  <div v-else>
                    <div
                      v-if="scope.row.CourseImageUrl.startsWith('http')"
                      class="pic"
                    >
                      <img :src="scope.row.CourseImageUrl">
                      <img
                        v-if="scope.row.State!=EnumInfrastCourseState.Audit"
                        src="@/assets/images/canceled.png"
                      >
                    </div>
                    <div
                      v-else-if="scope.row.CourseImageUrl"
                      class="pic"
                    >
                      <img :src="$root.settings.DOMAIN_IMG_FILE+scope.row.CourseImageUrl">
                      <img
                        v-if="scope.row.State!=EnumInfrastCourseState.Audit"
                        src="@/assets/images/canceled.png"
                      >
                    </div>
                    <div
                      v-else
                      class="pic"
                    >
                      <img src="@/assets/images/noimg.png">
                      <img
                        v-if="scope.row.State!=EnumInfrastCourseState.Audit"
                        src="@/assets/images/canceled.png"
                      >
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="内容"
                min-width="300"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div class="cont">
                    <p v-if="scope.row.RecmtType==EnumSustainRecmtType.Subject">{{scope.row.SubjectTitle}}</p>
                    <p v-else>
                      <img
                        v-if="scope.row.CourseType==EnumInfrastCourseType.Video"
                        src="@/assets/images/video_icon.png"
                      >
                      {{scope.row.CourseTitle}}
                    </p>
                    <b v-if="!(scope.row.RecmtType==EnumSustainRecmtType.Subject)">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</b>
                    <span>{{ scope.row.CreateTime | filterDateTime }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="排序"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <sort-item
                    :index="scope.$index"
                    :source="tableData"
                    :sort="(...args) => onTableDataSort(scope.row, ...args)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="80"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    name="btnDel"
                    type="text"
                    size="small"
                    :key="scope.row.RecmtId"
                    @click="del($event,scope.row.RecmtId)"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <addModal
      v-if="visibleAddModal"
      :title="title"
      :visibleAddModal="visibleAddModal"
      @listenVisibleAddModal="listenVisibleAddModal"
    />
  </div>
</template>
<script>
import {
  COLLEGE_API_SUSTAINRECMT_GETS, // 列表
  COLLEGE_API_SUSTAINRECMT_DELETE, // 删除
  COLLEGE_API_SUSTAINRECMT_SORT // 排序
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import {
  SustainRecmtType,
  InfrastCourseType,
  InfrastCourseState
} from '@/enums/science'

import addModal from '../template/addModal'
import sortItem from '../template/sortOrderItem'

export default {
  data() {
    return {
      recmtTypeArr: [
        // tab
        {
          key: String(SustainRecmtType.Subject),
          value: '专题推荐'
        },
        {
          key: String(SustainRecmtType.System),
          value: '系统培训'
        },
        {
          key: String(SustainRecmtType.College),
          value: '珠宝学院'
        }
      ],
      activeName: String(SustainRecmtType.Subject), // 选中tab
      visibleAddModal: false, // 添加弹窗显隐
      title: '添加(专题推荐)', // 添加弹窗标题
      tbloading: false,
      tableData: []
    }
  },
  computed: {
    EnumYNStatus() {
      return YNStatus
    },
    EnumSustainRecmtType() {
      return SustainRecmtType
    },
    EnumInfrastCourseType() {
      return InfrastCourseType
    },
    EnumInfrastCourseState() {
      return InfrastCourseState
    }
  },
  mounted() {
    this.gets(SustainRecmtType.Subject)
  },
  methods: {
    // 获取列表
    gets(RecmtType) {
      this.tbloading = true
      COLLEGE_API_SUSTAINRECMT_GETS({
        RecmtType: RecmtType
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Subset
          }
          this.tbloading = false
        })
        .catch(() => {
          this.tbloading = false
        })
    },
    addClick() {
      if (this.tableData.length >= 20) {
        this.$message.warning('最多添加20个！不能再添加')
        return
      }
      this.visibleAddModal = true
    },
    // Tab事件
    tabClick(tab) {
      this.activeName = tab.name
      this.gets(Number(tab.name))
      if (tab.name == SustainRecmtType.System) {
        this.title = '添加(系统培训)'
      } else if (tab.name == SustainRecmtType.College) {
        this.title = '添加(珠宝学院)'
      } else {
        this.title = '添加(专题推荐)'
      }
    },
    // -删除
    del(e, id) {
      e.currentTarget.blur()
      this.$confirm('确定移除?', '移除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          console.log(0)
          COLLEGE_API_SUSTAINRECMT_DELETE({RecmtId: id}).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('已移除！')
              this.gets(Number(this.activeName))
            }
            this.$store.commit('SET_FULL_LOADING', false)
          })
        })
        .catch(() => {})
    },
    // 添加弹窗
    listenVisibleAddModal(succ) {
      if (succ) {
        this.gets(Number(this.activeName))
      }
      this.visibleAddModal = false
    },
    onTableDataSort(item, sortObj) {
      this.$store.commit('SET_TB_LOADING', true)
      COLLEGE_API_SUSTAINRECMT_SORT({
        MoveType: sortObj.ope,
        RecmtId: item.RecmtId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.gets(Number(this.activeName))
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    }
  },
  components: {
    addModal,
    sortItem
  }
}
</script>
<style lang="scss" scoped>
.index-manage {
  position: relative;
  .index-preview {
    position: absolute;
    top: 1px;
    right: 0px;
    z-index: 1;
  }
  .index-manage-con {
    padding: 20px 0;
    /deep/ td {
      padding: 15px 0;
    }
    .hd {
      margin-bottom: 15px;
      .note {
        margin-left: 10px;
      }
    }
    .bd {
      .pic {
        position: relative;
        width: 200px;
        height: 112.5px;
        img {
          display: block;
          &:first-child {
            width: 200px;
            height: 112.5px;
          }
          &:last-child {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1;
          }
        }
      }
      .cont {
        img {
          margin-right: 5px;
          vertical-align: middle;
        }
        span {
          color: $gray;
        }
      }
    }
  }
}
</style>

