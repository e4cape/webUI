
<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="active0" :class="{'active': $route.path.indexOf('accordingStaff') > 0}" @click="$router.push({path: '/science/requiredCourse/accordingStaff'})">
        按员工查询
      </span>
      <span class="tab" name="active1" :class="{'active': $route.path.indexOf('accordingCourse') > 0}" @click="$router.push({path: '/science/requiredCourse/accordingCourse'})">
        按课程查询
      </span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  },
  watch: {
  }
}
</script>

