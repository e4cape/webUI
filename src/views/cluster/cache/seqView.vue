
<template  >
  <div class="content">
    <div class="p-10 tr">
      <el-button type="primary" @click="seqVisible = true">+新增</el-button>
      <el-button type="primary" v-if="data.length" @click="seqClear" style="display:none;">清空</el-button>
    </div>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="key" label="名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="seqUpdate(scope.row.key)">修改</el-button>
          <el-button type="text" @click="seqRemove(scope.row.key)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- @module Dialog·新建/修改SEQ -->
    <el-dialog :title="seqForm.update ? '修改' : '新增'" :visible.sync="seqVisible" @close="resetSeqForm">
      <el-form label-position="right" label-width="100px" :model="seqForm" :rules="rules" ref="seqForm">
        <el-form-item label="KEY：">
          <el-input v-model="seqForm.key" :maxlength="50" :disabled="seqForm.update"></el-input>
        </el-form-item>
        <el-form-item label="VALUE：" prop="Value">
          <el-input v-model="seqForm.value" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="seqSet" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button @click="seqVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建/修改SEQ -->
  </div>
</template>
<script>
import {
  CLUSTER_API_CACHESEQS_GETS,
  CLUSTER_API_CACHESEQS_CREATE,
  CLUSTER_API_CACHESEQS_UPDATE,
  CLUSTER_API_CACHESEQS_REMOVE,
  CLUSTER_API_CACHESEQS_GET,
  CLUSTER_API_CACHESEQS_CLEAR
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
      seqVisible: false, // SEQ新建或修改
      seqForm: {
        Name: '',
        Value: ''
      },
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
      CLUSTER_API_CACHESEQS_GETS({
        Nick: this.nick
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.map(item => {
            item.key = item.key.replace('SEQ:', '')
            return item
          })
        }
      })
    },
    seqUpdate(key) {
      CLUSTER_API_CACHESEQS_GET({
        Nick: this.nick,
        Key: key
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.seqForm = {
            key: key,
            value: res.data.Data.val,
            update: true
          }
          this.seqVisible = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    resetSeqForm() {
      this.seqForm = {
        Name: '',
        Value: ''
      }
    },
    seqSet() {
      this.$refs['seqForm'].validate(valid => {
        if (valid) {
          let api = CLUSTER_API_CACHESEQS_CREATE
          if (this.seqForm.update) {
            api = CLUSTER_API_CACHESEQS_UPDATE
          }
          api({
            Nick: this.nick,
            Key: this.seqForm.key,
            Val: this.seqForm.value
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
              this.$refs['seqForm'].resetFields()
              this.seqVisible = false
            }
          })
        }
      })
    },
    seqClear() {
      this.$confirm('确定要清空吗？', '清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          CLUSTER_API_CACHESEQS_CLEAR({
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
    seqRemove(key) {
      this.$confirm('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          CLUSTER_API_CACHESEQS_REMOVE({
            Nick: this.nick,
            Key: key
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
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