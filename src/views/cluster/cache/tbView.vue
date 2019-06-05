
<template  >
  <div class="content">
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="key" label="名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="clear(scope.row.key)">清空</el-button>
          <el-button type="text" @click="reload(scope.row.key)">重装</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  CLUSTER_API_CACHETABLE_GETS,
  CLUSTER_API_CACHETABLE_CLEAR,
  CLUSTER_API_CACHETABLE_RELOAD
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
      CLUSTER_API_CACHETABLE_GETS({
        Nick: this.nick
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    clear(key) {
      this.$confirm('确定要清空吗？', '清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CLUSTER_API_CACHETABLE_CLEAR({
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
    },
    reload(key) {
      this.$confirm('确定要重装吗？', '重装', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CLUSTER_API_CACHETABLE_RELOAD({
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