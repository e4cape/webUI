
<template>
  <div class="content">
    <el-form :model="queryForm" ref="onSearch" lable-width="120px" class="item-lh-26 p-t-1" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" name="videoUp" @click="$router.push({path: '/science/videoDatabase/videoUp'})">上传视频</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="deleteVideo($event)" name="btnSelectDelete">批量删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="getData" name="getData">刷新</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="State" v-model="queryForm.State" placeholder="所有状态" @change="onSearch">
              <el-option label="所有状态" value="0"></el-option>
              <el-option :label="item.Value" :key="index" :value="item.KeyId" v-for="(item, index) in vodState.TypeArray"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input name="Title" :maxlength="200" v-model="queryForm.Title" placeholder="请输入名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="名称：">
            <el-input name="Title" v-model="queryForm.Title" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker name="CreateTime" v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select name="State" v-model="queryForm.State" placeholder="所有状态">
              <el-option label="所有状态" value="0"></el-option>
              <el-option :label="item.Value" :key="index" :value="item.KeyId" v-for="(item, index) in vodState.TypeArray"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table class="tabs-tb" :data="data" @selection-change="selectChange" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="title" label="视频" show-overflow-tooltip fixed>
        <template slot-scope="scope">
          <div class="video-title">
            <div class="img" @click="showVideo(scope.row)">
              <img v-if="scope.row.coverURL" :src="scope.row.coverURL" alt>
              <i class="icon-play" v-if="scope.row.coverURL"></i>
            </div>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="时长" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creationTime" sortable="custom" label="创建时间" width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.creationTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{vodState.Types[scope.row.state]}}</template>
      </el-table-column>
      <el-table-column prop="ProductName" label="操作" width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" name="deleteOne" @click="deleteVideo($event,[scope.row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :sizes="[10, 20, 50, 100]" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- End 分页组件 -->
    <videoPlayModal
      v-if="visibleVideoPlayModal"
      :visibleVideoPlayModal="visibleVideoPlayModal"
      :coverUrl="videoObj.coverUrl"
      :videoId="videoObj.videoId"
      @listenVisibleVideoPlayModal="visibleVideoPlayModal = false"
    ></videoPlayModal>
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import dayjs from 'dayjs'
import { VodState, YNStatus } from '@/enums/common'
import { COMMON_API_VOD_GETS } from '@/apis/common'
import {
  COLLEGE_API_INFRASTCOURSEBASIC_DELETEVIDEO,
  COLLEGE_API_INFRASTCOURSEVIDEOLOG_DELETE
} from '@/apis/science'
import videoPlayModal from '@/components/college/videoPlayModal'
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      vodState: VodState,
      visibleVideoPlayModal: false,
      videoObj: {},
      queryForm: {
        Title: '',
        State: '0',
        CreateTime1: '',
        CreateTime2: '',
        CreateTime: [],
        PageIndex: 1,
        PageSize: 10,
        IsAsced: 1
      },
      scrollToken: '',
      parameters: {},
      dectionarys: [],
      data: [],
      selectData: [], // 选中的数据
      total: 0
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          Title: '',
          State: '0',
          CreateTime1: '',
          CreateTime2: '',
          CreateTime: [],
          PageIndex: 1,
          PageSize: 10,
          IsAsced: 1
        },
        query
      )
      this.getData()
    },
    selectState(value) {
      // 状态搜索
      this.queryForm.State = value
      this.onSearch()
    },
    selectChange(selection) {
      this.selectData = selection
    },
    sortChange(sort) {
      if (!sort.order) {
        this.queryForm.IsAsced = YNStatus.No
      } else {
        this.queryForm.IsAsced =
          sort.order === 'ascending' ? YNStatus.No : YNStatus.Yes
      }
      this.onSearch()
    },
    showVideo(row) {
      this.videoObj = {
        videoId: row.videoId,
        coverUrl: row.coverURL
      }
      this.visibleVideoPlayModal = true
    },
    deleteVideo(e, datas) {
      e.currentTarget.blur()
      // 删除
      let deleteDatas = []
      if (!datas && !this.selectData.length) {
        this.$message.error('请先选择视频')
        return
      } else if (datas && datas.length) {
        // 删除单条
        deleteDatas = [...datas]
      } else if (this.selectData.length > 20) {
        this.$message.error('最多批量删除20条视频')
        return
      } else {
        // 批量删除
        deleteDatas = [...this.selectData]
      }
      let videoIds = []
      deleteDatas.forEach(item => {
        videoIds.push(item.videoId)
      })
      this.$confirm(
        `确定删除${videoIds.length > 1 ? '这些' : '该'}视频？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let videoCode = videoIds.join(',')
          this.$store.commit('SET_TB_LOADING', true)
          COLLEGE_API_INFRASTCOURSEBASIC_DELETEVIDEO({
            VideoCode: videoCode
          }).then(res => {
            this.$store.commit('SET_TB_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              COLLEGE_API_INFRASTCOURSEVIDEOLOG_DELETE({
                VideoCodes: videoCode
              }).then(() => { })
              setTimeout(() => {
                this.queryForm.PageIndex = 1
                this.getData()
              }, 1000)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    getData() {
      let CreateTime = this.queryForm.CreateTime.length
        ? this.queryForm.CreateTime
        : ['', '']
      let param = JSON.parse(
        JSON.stringify(
          Object.assign({}, this.queryForm, {
            CreateTime1: CreateTime[0]
              ? dayjs(CreateTime[0]).format('YYYY-MM-DD')
              : '',
            CreateTime2: CreateTime[1]
              ? dayjs(CreateTime[1]).format('YYYY-MM-DD')
              : '',
            ScrollToken: this.scrollToken
          })
        )
      )
      delete param.CreateTime // 不删会导致后台服务报错
      if (param.PageIndex == 1) {
        delete param.ScrollToken
      }
      this.$store.commit('SET_TB_LOADING', true)
      COMMON_API_VOD_GETS(param).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Vods.map(item => {
            if (item.creationTime == '' || !item.creationTime) {
              item.creationTime = ''
            } else {
              item.creationTime = dayjs(item.creationTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }
            item.duration =
              (item.duration > 3600
                ? parseInt(
                  ((item.duration - (item.duration % 3600)) / 3600) % 3600
                ) + '时'
                : '') +
              (item.duration > 60
                ? parseInt(((item.duration - (item.duration % 60)) / 60) % 60) +
                '分'
                : '') +
              parseInt(item.duration % 60) +
              '秒'
          })
          this.data = res.data.Data.Vods
          this.total = res.data.Data.Count
          this.scrollToken = res.data.Data.ScrollToken
        }
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.queryForm = {
        Title: '',
        State: '0',
        CreateTime1: '',
        CreateTime2: '',
        CreateTime: [],
        PageIndex: 1,
        PageSize: 10,
        IsAsced: 1
      }
      this.onSearch()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel,
    videoPlayModal
  }
}
</script>
<style lang="scss" scoped>
.video-title {
  display: flex;
  span {
    width: calc(100% - 160px);
    margin-left: 10px;
  }
  .img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160px !important;
    height: 90px;
    img {
      width: 100%;
      transition: all 0.5s;
    }
    i {
      position: absolute;
      color: #fff;
      font-size: 30px;
      z-index: 999;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      opacity: 0;
      transition: all 0.5s;
    }
    &:hover {
      img {
        transform: scale(1.1);
      }
      i {
        opacity: 1;
      }
    }
  }
}
</style>
