<template>
  <el-dialog width="700px" :loading="loading" :title="title" @update:visible="$emit('update:visible', $event)" :visible="visible" :before-close="handleClose">
    <div class="inner">
      <el-transfer @change="currentChange" @right-check-change="rightCheckChanged" :titles="['未选择', '已选择']" v-model="currentItems" :data="data" :props="props"></el-transfer>
      <div class="sort-btns">
        <el-button name="btnUpSort2" :type="canMove != 0 && canMove!= 1 ? 'default' : 'primary'" :disabled="canMove != 0 && canMove!= 1" @click="makeSort(false, null)" size="mini">
          <i class="el-icon-arrow-up"></i>
        </el-button>
        <el-button name="btnDownSort1" :type="canMove != 0 && canMove!= 2 ? 'default' : 'primary'" :disabled="canMove != 0 && canMove!= 2" @click="makeSort(true, null)" size="mini">
          <i class="el-icon-arrow-down"></i>
        </el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnConfirm" :loading="uploading" type="primary" @click="handleConfirm">确定</el-button>
      <el-button name="btnClose" @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '导出'
    },
    items: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    uploading: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {
          key: 'key',
          label: 'label'
        }
      }
    }
  },
  data() {
    return {
      currentItems: [], // 右边的数据
      sortItems: [], // 右边选中需要排序的数据
      canMove: -1, // 是否可移动 -1代表不可移动 0代表可以上下移 1代表可以上移 2代表可以下移
    }
  },
  computed: {
    data() {
      return this.items
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.currentItems = []
        this.sortItems = []
        this.canMove = -1
      }
    }
  },
  methods: {
    currentChange(selected, direction) {
      this.currentItems = [] // 清空右边数据，根据所有数据的顺序插入数据
      this.data.forEach(item => {
        let name = item[this.props['key']]
        if (selected.indexOf(name) > -1) {
          this.currentItems.push(name)
        }
      })
      if (direction === 'left') {
        this.sortItems = []
      }
      this.rightCheckChanged(this.sortItems)
    },
    rightCheckChanged(selected) {
      if (selected.length) {
        this.sortItems = [] // 清空选中标记
        this.currentItems.forEach(item => {
          if (selected.indexOf(item) > -1) {
            this.sortItems.push(item)
          }
        })
        let selectedFirst = this.currentItems.indexOf(this.sortItems[0])
        let selectedLast = this.currentItems.indexOf(
          this.sortItems[this.sortItems.length - 1]
        )
        if (
          selectedFirst === 0 &&
          selectedLast === this.currentItems.length - 1
        ) {
          this.canMove = -1
        } else if (selectedFirst === 0) {
          this.canMove = 2
        } else if (selectedLast === this.currentItems.length - 1) {
          this.canMove = 1
        } else {
          this.canMove = 0
        }
      } else {
        this.canMove = -1
      }
    },
    // isDown true代表下移，false代表上移
    makeSort(isDown) {
      let self = this
      let sortItems = JSON.parse(JSON.stringify(this.sortItems))
      if (isDown) {
        sortItems = sortItems.reverse()
      }
      sortItems.forEach(c => {
        let index = self.currentItems.indexOf(c) // 已选的数据index
        let next = index - 1
        if (isDown) {
          next = index + 1
        }
        let moveItem = Object.assign(
          {},
          self.data.find(item => item[self.props['key']] === c)
        ) // 当前要移动的对象
        let moveIndex = self.data.findIndex(
          item => item[self.props['key']] === moveItem[self.props['key']]
        )
        let nextItem = Object.assign(
          {},
          self.data.find(
            item =>
              item[self.props['key']] === self.currentItems[next]
          )
        ) // 当前要移动的对象的已选的前一个对象
        let nextIndex = self.data.findIndex(
          item => item[self.props['key']] === nextItem[self.props['key']]
        )
        self.$set(self.data, nextIndex, moveItem)
        self.$set(self.data, moveIndex, nextItem)
        let currentNextItem = self.currentItems[next]
        self.$set(self.currentItems, next, c)
        self.$set(self.currentItems, index, currentNextItem)
      })
      this.rightCheckChanged(this.sortItems)
    },
    handleConfirm() {
      if (this.currentItems.length) {
        let result = this.props['key'] === 'FieldEnName' ? this.data.filter(item => {
          if (this.currentItems.indexOf(item[this.props.key]) > -1) {
            return item
          }
        }) : this.currentItems
        this.$emit('submit', result)
      } else {
        this.$message.warning('请选择要导出的选项.')
      }
    },
    handleClose() {
      this.selected = []
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss">
.el-checkbox-group.el-transfer-panel__list {
  flex-direction: column;
}
.inner {
  display: flex;
  align-items: center;
  justify-content: center;
  .sort-btns {
    > :nth-child(n) {
      display: block;
      margin-left: 10px;
      margin-bottom: 10px;
    }
  }
  .el-transfer__buttons .el-button + .el-button {
    margin-left: 0;
  }
}

.sort-btns {
  > button {
    position: relative;
  }
}
</style>
