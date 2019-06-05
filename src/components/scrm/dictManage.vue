<template>
  <el-dialog :title="'新建' + dialogTitle" :visible.sync="visible">
    <el-row>
      <el-button name="btnCreate" type="text" @click="createDict">+新建</el-button>
    </el-row>
    <el-table :data="dicts | calculationMethod" border>
      <el-table-column align="center" prop="name" :label="dialogTitle">
        <template slot-scope="scope">
          <el-input name="name" v-model="scope.row.name" v-if="scope.row.edit || scope.row.newAdd" :maxlength="50"></el-input>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="SortId" label="顺序" width="180">
        <template slot-scope="scope">
          <div class="rank-btn-group" v-if="addOrEdit">
            <span class="rank-btn" v-for="(icon, index) in scope.row.rank" :key="index" :class="icon" @click="sorting(icon,scope.row.index,dicts)"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <template v-if="!scope.row.edit && !scope.row.newAdd">
            <el-button name="btnEdit" type="text" @click="editDict(scope.row)">修改</el-button>
            <el-button name="btnDel" type="text" @click="delDict(scope.row)">删除</el-button>
          </template>
          <template v-if="scope.row.edit || scope.row.newAdd">
            <el-button name="btnSave" type="text" @click="saveDict(scope.row)" :loading="isSaving">保存</el-button>
            <el-button name="btnCancel" type="text" @click="cancelDict(scope.row)">取消</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGOPTION_CREATESETTINGOPTION,
  MEMBERSHIP_API_SETTINGOPTION_UPDATESETTINGOPTION,
  MEMBERSHIP_API_SETTINGOPTION_DELETESETTINGOPTION,
  MEMBERSHIP_API_SETTINGOPTION_SORTSETTINGOPTION
} from '@/apis/membership'

export default {
  props: {
    dicts: {
      type: Array,
      default: () => []
    },
    dictDialog: {
      type: Boolean,
      required: true
    },
    // 展示在第一项, 要改变的字段名
    dialogTitle: {
      type: String
    },
    dictType: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      visible: this.dictDialog,
      addOrEdit: true,
      isSaving: false,
      saveTimer: ''
    }
  },
  methods: {
    createDict() {
      if (this.addOrEdit) {
        this.dicts.unshift({
          name: '',
          newAdd: true
        })
        this.addOrEdit = false
      }
    },
    editDict(row) {
      if (this.addOrEdit) {
        this.$set(
          this.dicts,
          row.index,
          Object.assign(row, {
            edit: true
          })
        )
        this.addOrEdit = false
      }
    },
    saveDict(row) {
      if (!row.name.trim()) {
        this.isSaving = false
        this.$message('请填写' + this.dialogTitle + '！', 'error')
      } else {
        this.isSaving = true
        if (row.newAdd) {
          MEMBERSHIP_API_SETTINGOPTION_CREATESETTINGOPTION(
            Object.assign({}, row, {
              optionType: this.dictType
            })
          )
            .then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$emit('listenDictSave', this.dictType)
              } else {
                this.$message.error(res.data.Message)
              }
              setTimeout(() => {
                this.isSaving = false
              }, 300)
            })
            .catch(() => {
              setTimeout(() => {
                this.isSaving = false
              }, 300)
            })
        } else {
          this.updateDict(row)
        }
        this.addOrEdit = true
      }
    },
    updateDict(row) {
      MEMBERSHIP_API_SETTINGOPTION_UPDATESETTINGOPTION(row)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            delete row.edit
            this.$set(this.dicts, row.index, row)
          } else {
            this.$message.error(res.data.Message)
            this.$emit('listenDictSave', this.dictType)
          }
          this.isSaving = false
        })
        .catch(() => {
          this.isSaving = false
        })
    },
    delDict(row) {
      MEMBERSHIP_API_SETTINGOPTION_DELETESETTINGOPTION(
        row.settingOptionId
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message || '删除成功!',
            type: 'success'
          })
          this.dicts.splice(row.index, 1)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    cancelDict(row) {
      if (row.newAdd) {
        this.dicts.splice(row.index, 1)
      } else {
        this.$emit('listenDictSave', this.dictType)
      }
      this.addOrEdit = true
    },
    sorting(clazz, key, alls) {
      switch (
        clazz // 排序计算
      ) {
        case 'to-first':
          alls[key].index = -1
          break
        case 'to-prev':
          alls[key].index = alls[key].index - 1.5
          break
        case 'to-next':
          alls[key].index = alls[key].index + 1.5
          break
        case 'to-last':
          alls[key].index = alls.length
          break
        default: 
          break
      }
      alls.sort((a, b) => {
        return a.index - b.index
      })
      this.$set(this.dicts, JSON.parse(JSON.stringify(alls)))
      let arr = []
      alls.forEach(item => {
        arr.push(item.settingOptionId)
      })
      MEMBERSHIP_API_SETTINGOPTION_SORTSETTINGOPTION({
        settingOptionIdList: arr
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$emit('listenDictSave', this.dictType)
        } else {
          this.$message({
            message: '失败',
            type: 'error'
          })
        }
      })
    }
  },
  filters: {
    calculationMethod(value) {
      // 重新计算数据格式
      let hasNew = false
      value.map(text => {
        text.rank = ['to-first', 'to-prev', 'to-next', 'to-last']
        if (text.newAdd) {
          hasNew = true
        }
      })
      if (value.length) {
        if (hasNew) {
          value[0].rank = []
          if (value.length === 2) {
            value[1].rank = []
          }
          if (value.length > 2) {
            value[1].rank = ['to-next', 'to-last']
            value[value.length - 1].rank = ['to-first', 'to-prev']
          }
        } else if (value.length === 1) {
          value[0].rank = []
        } else {
          value[0].rank = ['to-next', 'to-last']
          value[value.length - 1].rank = ['to-first', 'to-prev']
        }
      }
      value.map((text, index) => {
        text.index = index
      })
      return value
    }
  },
  watch: {
    visible() {
      console.log(this)
      this.$emit('listenDictDialog', this.dictType)
    }
  }
}
</script>
