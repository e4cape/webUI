<template>
  <el-dialog title="范围设置" :visible.sync="visible" width="750px">
    <settingTag ref="settingTag" name="范围名称"/>
  </el-dialog>
</template>
<script>
import settingTag from './settingTag'
export default {
  props: {
    visibleSettingTagModal: {
      type: Boolean
    },
    tagType: {
      type: String
    }
  },
  data() {
    return {
      visible: this.visibleSettingTagModal
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleSettingTagModal')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.settingTag.getCustomSettingTagsByTagType(this.tagType)
    })
  },
  components: {
    settingTag
  }
}
</script>
<style lang="scss" scoped>
</style>

