
<template  >
  <div class="content">
    <div class="p-10 tr">
      <el-button type="primary" @click="keyVisible = true">+新增</el-button>
      <el-button type="primary" v-if="data.length" @click="keyClear">清空</el-button>
    </div>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="key" label="名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="keyUpdate(scope.row.key)">修改</el-button>
          <el-button type="text" @click="keyRemove(scope.row.key)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- @module Dialog·新建/修改KEY -->
    <el-dialog :title="keyForm.update ? '修改' : '新增'" :visible.sync="keyVisible" @close="resetKeyForm">
      <el-form label-position="right" label-width="100px" :model="keyForm" :rules="rules" ref="keyForm">
        <el-form-item label="KEY：" prop="key">
          <el-input v-model="keyForm.key" :maxlength="50" :disabled="keyForm.update"></el-input>
        </el-form-item>
        <el-form-item label="VALUE：" prop="value">
          <el-input v-model="keyForm.value" :maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="keySet" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button @click="keyVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建/修改KEY -->
  </div>
</template>
<script>
import {
  CLUSTER_API_CACHEKEY_GETS,
  CLUSTER_API_CACHEKEY_SET,
  CLUSTER_API_CACHEKEY_CLEAR,
  CLUSTER_API_CACHEKEY_GET,
  CLUSTER_API_CACHEKEY_REMOVE
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
      data: [],
      keyForm: {
        key: '',
        value: ''
      },
      keyVisible: false, // KEY新建或修改
      rules: {
        Value: [
          {
            validator: (rule, value, callback) => {
              if (value && !/^[1-9]+\d*$/.test(value)) {
                callback(new Error('请输入大于0的Value值'))
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      CLUSTER_API_CACHEKEY_GETS({
        Nick: this.nick
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.map(item => {
            item.key = item.key.replace('KEY:', '')
            return item
          })
        }
      })
    },
    keyUpdate(key) {
      CLUSTER_API_CACHEKEY_GET({ Nick: this.nick, Key: key }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.keyForm = {
            key: key,
            value: res.data.Data.val,
            update: true
          }
          this.keyVisible = true
        }
      })
    },
    resetKeyForm() {
      this.keyForm = {
        key: '',
        value: ''
      }
    },
    keySet() {
      this.$refs['keyForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          CLUSTER_API_CACHEKEY_SET({
            Nick: this.nick,
            Key: this.keyForm.key,
            Val: this.keyForm.value
          }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
              this.$refs['keyForm'].resetFields()
              this.keyVisible = false
            }
          })
        }
      })
    },
    keyClear() {
      this.$confirm('确定要清空吗？', '清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          CLUSTER_API_CACHEKEY_CLEAR({
            Nick: this.nick
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('清空成功')
              this.data = []
            }
          })
        })
        .catch(() => {})
    },
    keyRemove(key) {
      this.$confirm('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          CLUSTER_API_CACHEKEY_REMOVE({
            Nick: this.nick,
            Key: key
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
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