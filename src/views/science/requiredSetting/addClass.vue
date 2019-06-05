
<template>
  <el-dialog title="添加课程" width="700px" :visible.sync="visible">
    <template v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <div class="first">
        <span>请选择必修内容：</span>
        <el-radio-group v-model="channelType" @change="channelTypeChangeSp">
          <el-radio-button :label="infrastCourseChannelType.College">珠宝学院</el-radio-button>
          <el-radio-button :label="infrastCourseChannelType.System">系统培训</el-radio-button>
        </el-radio-group>
      </div>
      <div class="second">
        <el-cascader v-if="channelType == infrastCourseChannelType.College" :options="collegeDrown" class="m-r-10" v-model="queryForm.category" filterable placeholder="所有课程" change-on-select></el-cascader>
        <el-select v-else name="selectclass" class="sys-select m-r-10" placeholder="所有系统" v-model="queryForm.system" filterable>
          <el-option label="所有系统" :value="'0'"></el-option>
          <el-option v-for="(item,index) in allSys" :key="index" :label="item.DictName" :value="item.DictId"></el-option>
        </el-select>
        <el-input style="width: 150px;" class="m-r-5" placeholder="标题" v-model="queryForm.title" @keyup.enter.native="onSearch"></el-input>
        <el-button name="btnAddGoods" type="primary" :loading="$store.getters.is_loading" @click="onSearch">搜索</el-button>
      </div>

      <el-table :data="data" @selection-change="selectChange" ref="addClass" class="m-t-10 m-b-10" v-loading="bodyLoading" @row-click="toggleSelection" element-loading-text="拼命加载中">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="CourseTitle" label="标题" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AddressId" label="分类" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</template>
        </el-table-column>
        <el-table-column prop="IsPaper" label="是否有考试" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column prop="CourseType" label="类型" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{ infrastCourseType.Types[scope.row.CourseType + ''] }}</template>
        </el-table-column>
        <el-table-column label="适用套餐" prop="PackName" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
        </el-table-column>
      </el-table>

      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddGoods" type="primary" :loading="$store.getters.is_loading" @click="saveData">保存</el-button>
        <el-button name="btnAddGoods" :loading="$store.getters.is_loading" @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { InfrastCourseChannelType, InfrastCourseType } from '@/enums/science'
import { YNStatus } from '@/enums/common'
import {
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE,
  COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE,
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE,
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM,
  COLLEGE_API_CHARACTERSOLUTIONITEM_CREATE
} from '@/apis/science'
import pagination from '@/components/pagination'
export default {
  props: {
    addClassVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      yNStatus: YNStatus,
      infrastCourseType: InfrastCourseType,
      infrastCourseChannelType: InfrastCourseChannelType,
      visible: this.addClassVisible,
      bodyLoading: false,
      collegeDrown: [],
      allSys: [],
      queryForm: {
        category: ['0'],
        system: '0',
        title: '',
        PageSize: 20,
        PageIndex: 1
      },
      selectData: [],
      channelType: InfrastCourseChannelType.College,
      total: 0,
      data: []
    }
  },
  methods: {
    saveData() {
      if (this.selectData.length === 0) {
        this.$message.error('请先选择课程')
        return
      }
      let arr = []
      this.selectData.forEach(item => {
        arr.push(item.CourseId)
      })
      COLLEGE_API_CHARACTERSOLUTIONITEM_CREATE({
        CourseIds: arr.join(',')
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.visible = false
        }
      })
    },
    getCollegeData() {
      this.bodyLoading = true
      COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE({
        CourseTitle: this.queryForm.title,
        SmallId: this.queryForm.category[1] || 0,
        LargeId: this.queryForm.category[0] || 0,
        Orderby: 0,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      })
        .then(res => {
          this.bodyLoading = false
          if (res.data.Code === 'CORRECT') {
            this.data = res.data.Data.Subset
            this.total = res.data.Data.Count
          }
        })
        .catch(() => {
          this.bodyLoading = false
        })
    },
    selectChange(selection) {
      this.selectData = selection
    },
    toggleSelection(row) {
      this.$refs.addClass.toggleRowSelection(row)
    },
    getSystemData() {
      this.bodyLoading = true
      COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE({
        CourseTitle: this.queryForm.title,
        LargeId: this.queryForm.system || 0,
        Orderby: 0,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      })
        .then(res => {
          this.bodyLoading = false
          if (res.data.Code === 'CORRECT') {
            this.data = res.data.Data.Subset
            this.total = res.data.Data.Count
          }
        })
        .catch(() => {
          this.bodyLoading = false
        })
    },
    channelTypeChangeSp () {
      this.queryForm.title = ''
      this.queryForm.PageSize = 20
      this.onSearch()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.channelTypeChange()
    },
    channelTypeChange() {
      if (this.channelType == InfrastCourseChannelType.College) {
        this.getCollegeData()
      } else {
        this.getSystemData()
      }
    },
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.channelTypeChange()
    },
    sizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.channelTypeChange()
    },
    getCollegeDrown() {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE().then(res => {
        if (res.data.Code === 'CORRECT') {
          let arr = [
            {
              value: '0',
              label: '所有课程',
              disabled: false
            }
          ]
          res.data.Data.Subset.forEach(item => {
            if (item.ParentId == 0) {
              arr.push(
                Object.assign(
                  {
                    value: item.DictId + '',
                    label: item.DictName,
                    disabled: false
                  },
                  item
                )
              )
            }
          })
          let collegeDrown = this.initCollegeDrown(arr, res.data.Data.Subset)
          for(let i = 0; i < collegeDrown.length; i++) {
            if (!collegeDrown[i].children && collegeDrown[i].value != '0') {
              collegeDrown.splice(i,1)
              i -= 1
            }
          }
          this.collegeDrown = collegeDrown
        }
      })
    },
    initCollegeDrown(arr, oldArr) {
      arr.forEach(item => {
        let objs = []
        oldArr.forEach(a => {
          if (item.DictId === a.ParentId) {
            objs.push(
              Object.assign(
                {
                  value: a.DictId + '',
                  label: a.DictName,
                  disabled: false
                },
                a
              )
            )
          }
        })
        if (objs.length) {
          item.children = this.initCollegeDrown(objs, oldArr)
        }
      })
      return arr
    },
    getSystemDrown() {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allSys = res.data.Data.Subset
        }
      })
    }
  },
  mounted() {
    this.getCollegeDrown()
    this.getSystemDrown()
    this.channelTypeChange()
  },
  watch: {
    visible() {
      this.$emit('listenVisibleChange')
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.first {
}
.second {
  display: flex;
  margin-top: 10px;
}
</style>