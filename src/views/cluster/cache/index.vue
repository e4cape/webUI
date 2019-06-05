
<template  >
  <div class="content">
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="dbid" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="nick" label="名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({path:'/cluster/cache/check', query:{nick: scope.row.nick}})">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { CLUSTER_API_CACHEDB_GETS } from '@/apis/cluster.js'
export default {
  data() {
    return {
      data: []
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      CLUSTER_API_CACHEDB_GETS().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    }
  },
  beforeMount() {
    this.getData()
  }
}
</script>