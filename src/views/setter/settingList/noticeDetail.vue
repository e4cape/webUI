<template>
  <div class="content-view border-1px">
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >公告标题：</el-col>
      <el-col :span="22">{{detail.NoticeTitle}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >发送范围：</el-col>
      <el-col :span="22">{{RangeIds}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >公告内容：</el-col>
      <el-col
        id="test-1"
        :span="22"
        v-html="detail.NoticeNoteEx"
      ></el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >创建时间：</el-col>
      <el-col :span="22">{{detail.CreateTime | filterDateTime}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >创建人员：</el-col>
      <el-col :span="22">{{detail.CreateUser}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >审核时间：</el-col>
      <el-col :span="22">{{detail.CheckTime | filterDateTime}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >审核人：</el-col>
      <el-col :span="22">{{detail.CheckUser}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
    >
      <el-col
        :span="2"
        class="text-right"
      >状态：</el-col>
      <el-col :span="22">{{noticeStatus.Types[detail.Status]}}</el-col>
    </el-row>
    <el-row
      class="p-y-10"
      :gutter="15"
      v-if="detail.Status == noticeStatus.Origin"
    >
      <el-col
        :span="2"
        class="text-right"
      >&nbsp;</el-col>
      <el-col :span="22">
        <div>
          <el-button
            name="audit"
            type="primary"
            @click="audit($event)"
          >审核</el-button>
          <el-button
            name="reject"
            type="primary"
            @click="reject($event)"
          >拒绝</el-button>
          <el-button
            name="abandon"
            type="primary"
            @click="abandon($event)"
          >作废</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { SettingNoticeType, SettingHelpStatus } from '@/enums/marketing'
import {
  MARKETING_API_SETTING_NOTICE_GET,
  MARKETING_API_SETTING_NOTICE_AUDIT,
  MARKETING_API_SETTING_NOTICE_REJECT,
  MARKETING_API_SETTING_NOTICE_ABANDON
} from '@/apis/marketing'
import { CharacterType } from '@/enums/common'
export default {
  data() {
    return {
      noticeType: SettingNoticeType,
      noticeStatus: SettingHelpStatus,
      loading: false,
      detail: {},
      CharacterType,
      RangeIds: ''
    }
  },
  methods: {
    formatNote(v) {
      return !!v && v.replace(/\r/g, '<br>')
    },
    init() {
      this.loading = true
      MARKETING_API_SETTING_NOTICE_GET({
        NoticeId: this.$route.query.NoticeId
      }).then(res => {
        this.loading = false
        this.detail = res.data.Data
        this.detail.NoticeNoteExt =
          this.formatNote(this.detail.NoticeNote) || ''
        this.showRangeIds(res.data.Data.RangeIds)
      })
    },
    audit(e) {
      e.currentTarget.blur()
      this.$confirm('确定要审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_SETTING_NOTICE_AUDIT({
            NoticeId: this.detail.NoticeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    reject(e) {
      e.currentTarget.blur()
      this.$confirm('确定要拒绝吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_SETTING_NOTICE_REJECT({
            NoticeId: this.detail.NoticeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    abandon(e) {
      e.currentTarget.blur()
      this.$confirm('确定要作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_SETTING_NOTICE_ABANDON({
            NoticeId: this.detail.NoticeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    showRangeIds(data) {
      let arr = []
      let arr1 = []
      arr = data.split(',')
      for (let m in this.CharacterType.Types) {
        arr.forEach(item => {
          if (parseInt(m) == parseInt(item)) {
            arr1.push(this.CharacterType.Types[m])
            this.RangeIds = arr1.join('、')
          }
        })
      }
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.content-view {
  #test-1 {
    // 控制图片的大小
    width: 750px;
  }
  ul {
    li {
      height: 40px;
      line-height: 40px;
      display: flex;
      span {
        &:first-of-type {
          margin-right: 15px;
          width: 120px;
          text-align: right;
        }
      }
    }
  }
}
.text-right {
  text-align: right;
}
</style>
