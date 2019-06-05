<template>
  <div class="content">
    <div class="tabs" style="border-bottom: 1px solid #e5e5e5;">
      <span class="tab" name="active0" :class="{'active': activeIndex == 0}" @click="activeIndex = 0">TABLE</span>
      <span class="tab" name="active1" :class="{'active': activeIndex == 1}" @click="activeIndex = 1">VIEW</span>
      <span class="tab" name="active2" :class="{'active': activeIndex == 2}" @click="activeIndex = 2">SESSION</span>
      <span class="tab" name="active3" :class="{'active': activeIndex == 3}" @click="activeIndex = 3">KEY</span>
      <span class="tab" name="active4" :class="{'active': activeIndex == 4}" @click="activeIndex = 4">SEQ</span>
    </div>
    <el-row>
      <keep-alive>
        <tb-view v-if="activeIndex == 0" :nick="nick"></tb-view>
        <v-view v-if="activeIndex == 1" :nick="nick"></v-view>
        <session-view v-if="activeIndex == 2" :nick="nick"></session-view>
        <key-view v-if="activeIndex == 3" :nick="nick"></key-view>
        <seq-view v-if="activeIndex == 4" :nick="nick"></seq-view>
      </keep-alive>
    </el-row>
  </div>
</template>

<script>
import TbView from './tbView'
import VView from './vView'
import SessionView from './sessionView'
import KeyView from './keyView'
import SeqView from './seqView'
export default {
  data() {
    return {
      activeIndex: 0,
      nick: ''
    }
  },
  beforeMount() {
    this.nick = this.$route.query.nick
    if (!this.nick) {
      this.$router.back()
    }
  },
  components: {
    TbView,
    VView,
    SessionView,
    KeyView,
    SeqView
  }
}
</script>
