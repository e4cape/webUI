<template>
  <div class="custom-tag clearfix">
    <div class="left">
      <div class="hd">
        标签分类
      </div>
      <div v-loading="loadingLeft">
        <ul :class="customTagTypes.length>20 ? 'bd sp': 'bd' ">
          <li
            v-for="item in customTagTypes"
            @click="getCurrentTag(item.tagType, item.tagTypeText)"
            :class="settingTagType == item.tagType ? 'on' : ''"
            :key="item.tagType"
          >
            {{item.tagTypeText}}
          </li>
        </ul>
      </div>
    </div>
    <div
      class="right"
      v-loading="loadingRight"
    >
      <el-card shadow="never">
        <div
          slot="header"
          class="clearfix"
        >
          {{settingTagTypeText}}
        </div>
        <settingTag ref="settingTag"></settingTag>
      </el-card>
    </div>
  </div>
</template>

<script>
import settingTag from '@/components/scrm/settingTag'
import {
  MEMBERSHIP_API_SETTINGTAG_GETCUSTOMTAGTYPES 
} from '@/apis/membership'
export default {
  data() {
    return {
      loadingLeft: false, // 左边loading状态
      loadingRight: false, // 右边loading状态
      customTagTypes: [], // 标签分类数据
      settingTagType: '', // 当前标签类型
      settingTagTypeText: '', // 当前标签标题
    }
  },
  mounted() {
    this.getCustomTagTypes()
  },
  methods: {
    // 获取所有自定义标签类型
    getCustomTagTypes() {
      this.loadingLeft = true
      MEMBERSHIP_API_SETTINGTAG_GETCUSTOMTAGTYPES().then(res => {
        console.log(res)
        if (res.data.Code === 'CORRECT') {
          this.customTagTypes = res.data.Data
          this.settingTagType = res.data.Data[0].tagType
          this.getCurrentTag(this.settingTagType, res.data.Data[0].tagTypeText)
        }
        this.loadingLeft = false
      })
    },
    // 获取当前标签
    getCurrentTag(tagType, tagTypeText) {
      this.settingTagType = tagType
      this.settingTagTypeText = tagTypeText
      this.$refs.settingTag.getCustomSettingTagsByTagType(tagType)
    }
  },
  components: {
    settingTag
  }
}
</script>

<style lang="scss" scoped>

.custom-tag {
  .left {
    float: left;
    width: 300px;
    .hd {
      height: 34px;
      line-height: 34px;
      padding-left: 10px;
      background: #399fe5;
      color: $white;
    }
    .bd {
      max-height: 680px;
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
      overflow-y: auto;
      li {
        position: relative;
        height: 34px;
        line-height: 33px;
        padding-left: 15px;
        border-bottom: 1px solid $border-color;
        cursor: pointer;
        &.on, &:hover {
          background: $bg-color;
        }
      }
      &.sp {
        border-bottom: 1px solid $border-color;
        li:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .right {
    float: left;
    width: calc(100% - 330px);
    margin-left: 10px;
    .label-operate {
      .el-table {
        margin-top: 20px;
      }
    }
    .el-card {
      border: 1px solid $border-color;
      border-radius: 0;
    }
    /deep/ .el-card__header {
      height: 34px;
      line-height: 34px;
      padding: 0 10px;
      border-bottom: 1px solid $border-color;
      font-weight: bold;
    }
    /deep/ .el-card__body {
      padding: 10px;
    }
  }
}
</style>
