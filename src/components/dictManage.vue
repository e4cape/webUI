<template>
  <component :is="tag" :append-to-body="appendToBody" v-loading="loading" title="自定义选项" @close="onClose" :visible="visible">
    <el-row>
      <el-button name="btnCreate" type="text" @click="createDict">+ 新建</el-button>
    </el-row>
    <el-table :data="dicts | calculationMethod" border>
      <el-table-column align="center" prop="DictValue" :label="title">
        <template slot-scope="scope">
          <el-input name="prop" v-model="scope.row[prop]" v-if="scope.row.edit || scope.row.newAdd" :maxlength="10"></el-input>
          <span v-else>{{scope.row[prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="SortId" label="顺序" width="180">
        <template slot-scope="scope">
          <div class="rank-btn-group" v-if="addOrEdit">
            <span name="btnSort" class="rank-btn" v-for="(icon, index) in scope.row.rank" :key="index" :class="icon" @click="sorting(icon,scope.row, dicts)"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'el-dialog'
    },
    visible: {
      type: Boolean
    },
    prop: {
      type: String,
      required: true
    },
    isSaving: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return []
      },
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addOrEdit: true,
      saveTimer: '',
      tempValue: '',
      dicts: this.items.map(i => ({
        ...i
      }))
    }
  },
  methods: {
    copyDictsFromProps() {
      const len = this.items.length
      const tos = ['to-first', 'to-prev', 'to-next', 'to-last']
      return this.items.map(({ ...item }, index) => {
        let rank = tos
        if (index == 0) {
          rank = rank.slice(2)
        } else if (index === len - 1) {
          rank = rank.slice(0, 2)
        }
        return {
          ...item,
          rank
        }
      })
    },
    // TODO: 不再发出事件
    createDict() {
      if (this.addOrEdit) {
        this.$emit('new', {
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
    saveDict({ newAdd, ...row }) {
      if (!row[this.prop] || !row[this.prop].trim()) {
        this.$message.error(`请输入${this.title}名称！`)
      } else {
        if (newAdd) {
          this.$emit('create', row)
        } else {
          this.updateDict(row)
        }
        this.$set(
          this.dicts,
          row.index,
          Object.assign(row, {
            edit: false
          })
        )
        this.addOrEdit = true
      }
      
    },
    updateDict(row) {
      this.$emit('update', row)
    },
    delDict(row) {
      this.$emit('delete', row)
      this.addOrEdit = true
    },
    cancelDict(row) {
      if (row.newAdd) {
        this.$emit('cancel', row, row.newAdd)
      } else {
        this.$set(this.dicts, row.index, {
          ...this.items[row.index]
        })
      }
      this.addOrEdit = true
    },
    onClose() {
      this.addOrEdit = true
      this.$emit('close')
    },
    sorting(clazz, row) {
      var moveType = ''
      switch (clazz) {
        case 'to-first':
          moveType = 'first'
          break
        case 'to-prev':
          moveType = 'prev'
          break
        case 'to-next':
          moveType = 'next'
          break
        case 'to-last':
          moveType = 'last'
          break
        default:
          moveType = 'first'
          break
      }
      this.$emit('sort', row, moveType)
    }
  },
  computed: {},
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
      this.$emit('listenDictDialog', this.dictType)
    },
    items() {
      this.dicts = this.copyDictsFromProps()
    }
  }
}
</script>
<style lang="scss" scoped>
.rank-btn-group {
  .rank-btn.to-first {
    background-image: url(~@/assets/images/to-first.png);
  }
  .rank-btn.to-prev {
    background-image: url(~@/assets/images/to-prev.png);
  }
  .rank-btn.to-next {
    background-image: url(~@/assets/images/to-next.png);
  }
  .rank-btn.to-last {
    background-image: url(~@/assets/images/to-last.png);
  }
  .rank-btn {
    display: inline-block;
    margin: 0 5px;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-position: 50%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
</style>
