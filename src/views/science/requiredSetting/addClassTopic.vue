
<template>
  <el-dialog title="从专题选课" width="1200px" :visible.sync="visible">
    <template v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <div class="first m-r-10">
        <div class="search">
          <el-input v-model="title" @keyup.native.enter="onSearch()" placeholder="专题名"/>
          <el-button type="primary" @click="onSearch()">搜索</el-button>
        </div>
        <el-table :data="firstData" ref="fristTable" highlight-current-row @current-change="onLeftSelectionChange" class="m-b-10" v-loading="fristLoading" element-loading-text="拼命加载中">
          <el-table-column prop="Title" label="专题标题" min-width="100" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="ItemQty" label="课程数目" min-width="70" show-overflow-tooltip></el-table-column> -->
        </el-table>
        <div class="myPagination-bar m-t-10">
          <el-select v-model="firstSize" placeholder="20" name="firstSize" @change="sizeChange">
            <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
          </el-select>
          <div class="pagination-controller">
            <button class="prev-btn" @click="prevPage" :disabled="firstPg === 1" :class="{'isDisabled': firstPg === 1}">
              <i class="el-icon-arrow-left"></i>
            </button>
            <span class="current-page">{{firstPg}}/{{pages}}</span>
            <button class="next-btn" @click="nextPage" :disabled="firstPg === pages" :class="{'isDisabled': firstPg === pages}">
              <i class="el-icon-arrow-right"></i>
            </button>
          </div>
          <span class="total">共{{firstTotal}}条</span>
        </div>
      </div>
      <i class="el-icon-minus"></i>
      <i class="el-icon-arrow-right"></i>
      <div class="second m-l-10">
        <el-table :data="secondData" ref="addClass" @selection-change="selectChange" @row-click="toggleSelection" v-loading="fristLoading || secondLoading" element-loading-text="拼命加载中">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="CourseTitle" label="标题" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AddressId" label="分类" width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</template>
          </el-table-column>
          <el-table-column prop="AddressId" label="是否有考试" width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</template>
          </el-table-column>
          <el-table-column prop="AddressId" label="类型" width="50" show-overflow-tooltip>
            <template slot-scope="scope">{{ infrastCourseType.Types[scope.row.CourseType + ''] }}</template>
          </el-table-column>
          <el-table-column label="适用套餐" prop="PackName" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CreateTime" label="创建时间" width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
          </el-table-column>
        </el-table>
        <pagination :pg="secondPg" class="pag" :size="secondSize" :total="secondTotal" @currentChange="secondCurrentChange" @sizeChange="secondSizeChange"></pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddGoods" type="primary" :loading="$store.getters.is_loading" @click="saveData">保存</el-button>
        <el-button name="btnAddGoods" :loading="$store.getters.is_loading" @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { InfrastCourseType } from '@/enums/science'
import pagination from '@/components/pagination'
import { YNStatus } from '@/enums/common'
import {
  COLLEGE_API_INFRASTSUBJECTBASIC_CACHES,
  COLLEGE_API_INFRASTSUBJECTITEM_CACHES,
  COLLEGE_API_CHARACTERSOLUTIONITEM_CREATE
} from '@/apis/science'

export default {
  props: {
    addClassTopicVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      yNStatus: YNStatus,
      infrastCourseType: InfrastCourseType,
      visible: this.addClassTopicVisible,
      fristLoading: false,
      secondLoading: false,
      title: '',
      radio: '珠宝学院',
      firstPg: 1,
      firstSize: 10,
      firstTotal: 0,
      secondPg: 1,
      secondSize: 10,
      secondTotal: 0,
      total: 0,
      paginationSizes: [10, 15, 20],
      firstData: [],
      secondData: [],
      selectData: [],
      leftSelectId: ''
    }
  },
  computed: {
    pages() {
      return (
        (this.firstTotal % this.firstSize === 0
          ? Math.ceil(this.firstTotal / this.firstSize)
          : parseInt(this.firstTotal / this.firstSize) + 1) || 1
      )
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
    onSearch() {
      this.firstPg = 1
      this.getFirstData()
    },
    getFirstData() {
      this.fristLoading = true
      COLLEGE_API_INFRASTSUBJECTBASIC_CACHES({
        Title: this.title,
        Orderby: 0,
        PageIndex: this.firstPg,
        PageSize: this.firstSize
      })
        .then(res => {
          this.fristLoading = false
          if (res.data.Code === 'CORRECT') {
            this.firstTotal = res.data.Data.Count
            this.firstData = res.data.Data.Subset
            this.$refs.fristTable.setCurrentRow(res.data.Data.Subset[0])
          }
        })
        .catch(() => {
          this.fristLoading = false
        })
    },
    onLeftSelectionChange(val, old) {
      if (!val) {
        this.leftSelectId = old.SubjectId
      } else {
        this.leftSelectId = val.SubjectId
      }
      this.secondPg = 1
      this.getItems()
    },
    getItems() {
      this.secondLoading = true
      COLLEGE_API_INFRASTSUBJECTITEM_CACHES({
        SubjectId: this.leftSelectId,
        PageIndex: this.secondPg,
        PageSize: this.secondSize
      })
        .then(res => {
          this.secondLoading = false
          if (res.data.Code === 'CORRECT') {
            this.secondTotal = res.data.Data.Count
            this.secondData = res.data.Data.Subset
          }
        })
        .catch(() => {
          this.secondLoading = false
        })
    },
    selectChange(selection) {
      this.selectData = selection
    },
    prevPage() {
      this.firstPg -= 1
      this.getFirstData()
    },
    sizeChange() {
      this.firstPg = 1
      this.getFirstData()
    },
    nextPage() {
      this.firstPg += 1
      this.getFirstData()
    },
    toggleSelection(row) {
      this.$refs.addClass.toggleRowSelection(row)
    },
    secondCurrentChange(val) {
      this.secondPg = val
      this.getItems()
    },
    secondSizeChange(val) {
      this.secondPg = 1
      this.secondSize = val
      this.getItems()
    }
  },
  mounted() {
    this.getFirstData()
  },
  watch: {
    visible() {
      this.$emit('listenViTopicChange')
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  display: flex;
  align-items: center;
}
.pag {
  border: none;
  padding-top: 4px;
}
.first {
  width: 26%;
  height: 433px;
}
.search {
  margin-bottom: 10px;
  display: flex;
  .el-input {
    flex: 1;
  }
  button {
    margin-left: 10px;
  }
}
.second {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px !important;
  height: 440px;
  padding-top: 41px;
}
/deep/ .el-table__body-wrapper {
  height: 320px;
  overflow-y: auto;
}
.myPagination-bar {
  position: relative;
  color: #333;
  background-color: #fff;
  height: 32px;
  text-align: center;

  .el-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 65px;
    height: 20px;
    margin: 1px 0 6px 6px !important;

    .el-input__suffix {
      right: 0;

      .el-input__icon {
        line-height: 20px;
      }

      .el-icon-arrow-up {
        width: 20px;
        height: 20px;
      }
    }

    .el-input__inner {
      font-size: 12px;
      padding-right: 28px;
      height: 20px;
      border: solid 1px #e5e5e5;
      border-radius: 0;
    }
  }

  .pagination-controller {
    display: inline-block;
    margin: 5px 0;
    font-size: 0;

    .prev-btn,
    .next-btn {
      vertical-align: middle;
      width: 30px;
      height: 22px;
      padding: 0;
      background-color: #399fe5;
      border: none;
      outline: 0;
      cursor: pointer;

      &:hover {
        background-color: #0581d7;
      }

      &.isDisabled {
        background-color: #e5e5e5;
        cursor: no-drop;
      }

      .el-icon-arrow-left,
      .el-icon-arrow-right {
        position: relative;
        top: 1px;
        transform: scale(0.83);
        font-size: 12px;
        color: $white;
      }
    }

    .current-page {
      display: inline-block;
      padding: 0 10px;
      min-width: 30px;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      color: #333;
      vertical-align: middle;
    }
  }

  .total {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    color: #333;
  }
}
</style>