
<template  >
  <div class="content">
    <div class="p-10 tr">
      <el-button type="primary" v-if="data.length" @click="sessionClear">清空</el-button>
    </div>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="key" label="名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="sessionRemove(scope.row.key)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  CLUSTER_API_CACHESESSION_GETS,
  CLUSTER_API_CACHESESSION_CLEAR,
  CLUSTER_API_CACHESESSION_REMOVE
} from '@/apis/cluster.js'
export default {
  props: {
    nick: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      data: []
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      CLUSTER_API_CACHESESSION_GETS({
        Nick: this.nick
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    sessionClear() {
      this.$confirm('确定要清空吗？', '清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CLUSTER_API_CACHESESSION_CLEAR({
            Nick: this.nick
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.data = []
            }
          })
        })
        .catch(() => {})
    },
    sessionRemove(key) {
      this.$confirm('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CLUSTER_API_CACHESESSION_REMOVE({
            Nick: this.nick,
            Key: key
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('删除成功')
              this.getData()
            }
          })
        })
        .catch(() => {})
    }
  },
  beforeMount() {
    this.getData()
  }
}
</script>