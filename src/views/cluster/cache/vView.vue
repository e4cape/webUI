
<template  >
  <div class="content">
    <div class="p-y-10 tr" v-if="data.length">
      <el-button type="primary" @click="viewClear">清空</el-button>
    </div>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="key" label="名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="viewRemove(scope.row.key)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  CLUSTER_API_CACHEVIEW_GETS,
  CLUSTER_API_CACHEVIEW_REMOVE,
  CLUSTER_API_CACHEVIEW_CLEAR
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
      CLUSTER_API_CACHEVIEW_GETS({
        Nick: this.nick
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    viewClear() {
      this.$confirm('确定要清空吗？', '清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CLUSTER_API_CACHEVIEW_CLEAR({
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
    viewRemove(key) {
      this.$confirm('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CLUSTER_API_CACHEVIEW_REMOVE({
            Nick: this.nick,
            Key: key
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
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