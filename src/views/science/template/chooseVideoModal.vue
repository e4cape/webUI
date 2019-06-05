<template>
  <el-dialog
    title="选择视频"
    :visible.sync="visible"
    width="800px"
    class="choose-video-modal"
  >
    <el-form
      :model="form"
      ref="search"
      :inline="true"
    >
      <el-form-item
        label="名称："
        prop="Title"
        @keyup.native.enter="onSearch"
      >
        <el-input
          name="inputTitle"
          v-model="form.Title"
        ></el-input>
      </el-form-item>
      <el-form-item
        name="datePickerCreateTime"
        label="创建时间："
        class="m-l-10"
      >
        <el-date-picker
          v-model="CreateTime"
          @change="dateChange"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :clearable="false"
          style="width:200px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="m-l-10">
        <el-button
          name="btnSearch"
          type="primary"
          @click="onSearch"
        > 搜索</el-button>
        <el-button
          name="btnReset"
          type="default"
          class="m-l-10"
          @click="onReset"
        > 重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      @sort-change="sortChange"
      @current-change="handleCurrentChange"
      highlight-current-row
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="视频"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div class="img-title">
            <img
              :src="scope.row.coverURL"
              alt=""
            >
            {{scope.row.title}}
          </div>

        </template>
      </el-table-column>
      <el-table-column
        label="时长"
        prop="duration"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        width="160"
        show-overflow-tooltip
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.creationTime | filterDateTime}}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pg="form.PageIndex"
      :size="form.PageSize"
      :total="total"
      :sizes="[10, 20, 50, 100]"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnSubmit"
        type="primary"
        @click="chooseVideoSure"
        :loading="$store.getters.is_loading"
      >确 定</el-button>
      <el-button
        name="btnCancel"
        @click="visible = false"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  COMMON_API_VOD_GETSBYNORMAL, // 获取视频(列表)
  COMMON_API_IMAGE_UPLOAD64TOOSS
} from '@/apis/common'

import { YNStatus } from '@/enums/common'

import pagination from '@/components/pagination'

export default {
  props: {
    visibleChooseVideoModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.visibleChooseVideoModal,
      loadingIf: false,
      form: {
        Title: '', // 视频标题
        CreateTime1: '', // 创建时间(起始
        CreateTime2: '', // 创建时间(截止)
        IsAsced: YNStatus.No, // 是否升序(枚举)
        PageIndex: 1,
        PageSize: 20,
        ScrollToken: '' // 翻页令牌
      },
      CreateTime: [], // 创建时间
      pickerOptions: {
        shortcuts: this.$root.datePickerOptions.shortcuts,
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      tableData: [],
      total: 0,
      selectRow: null // 选中项
    }
  },
  watch: {
    visible() {
      this.$store.commit('SET_BTN_LOADING', false)
      this.$emit('listenVisibleChooseVideoModal')
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      COMMON_API_VOD_GETSBYNORMAL(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Vods.map(item => {
            // 计算时分秒
            let h = 0,
              m = 0,
              s = 0
            if (item.duration >= 3600) {
              h = Math.floor(item.duration / 3600)
            }
            if (item.duration >= 60) {
              m = Math.floor((item.duration / 60) % 60)
            }
            s = Math.round(item.duration % 60)
            if (item.duration >= 3600) {
              item.duration = `${h}时${m}分${s}秒`
            } else if (item.duration >= 60) {
              item.duration = `${m}分${s}秒`
            } else {
              item.duration = `${s}秒`
            }
          })
          this.tableData = res.data.Data.Vods
          this.total = res.data.Data.Count
          this.form.ScrollToken = res.data.Data.ScrollToken
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    currentChange(val) {
      this.form.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.form.PageIndex = 1
      this.form.PageSize = val
      this.getData()
    },
    sortChange({ order }) {
      this.form.IsAsced = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    onSearch() {
      this.form.PageIndex = 1
      this.getData()
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.form.CreateTime1 = ''
      this.form.CreateTime2 = ''
      this.CreateTime = []
      this.onSearch()
    },
    dateChange(v) {
      this.form.CreateTime1 = v[0]
      this.form.CreateTime2 = v[1]
    },
    handleCurrentChange(row) {
      this.selectRow = row
    },
    // 将图片转换为Base64
    getImgToBase64(url, cb) {
      let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image()
      img.crossOrigin = '*'
      img.onload = function() {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        let dataURL = canvas.toDataURL('image/jpeg')
        cb(dataURL)
        canvas = null
      }
      img.src = url
    },
    chooseVideoSure() {
      if (!this.selectRow) {
        this.$message.error('请选择一个视频')
        return
      }
      this.$store.commit('SET_BTN_LOADING', true)
      // 上传
      this.getImgToBase64(this.selectRow.coverURL, dataURL => {
        const param = {
          Base64Str: dataURL,
          Root: this.$root.filePaths.COLLEGE_INFAST
        }
        COMMON_API_IMAGE_UPLOAD64TOOSS(param).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$emit('chooseVideoInfo', this.selectRow, res.data.Data.Path)
          }
          this.$store.commit('SET_BTN_LOADING', false)
          this.visible = false
        })
      })
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.choose-video-modal {
  .pagination {
    margin: 15px 0 0 0;
    padding: 0;
  }
  .img-title {
    position: relative;
    height: 90px;
    padding-left: 170px;
    margin: 10px 0;
    img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 160px;
      height: 90px;
    }
  }
}
</style>
