<template>
  <el-dialog title="功能配置" width="750px" @update:visible="$emit('update:visible', $event)" :visible="visible">
    <div class="box">
      <el-transfer
        v-model="currentData"
        filterable
        filter-placeholder="请输入编号/名称"
        :titles="['未选择', '已选择']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :props="props"
        @change="currentChange"
        :data="allData"
        @right-check-change="rightCheckChanged"
        :filter-method="filterMethod"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <span slot-scope="{ option }">
          <slot :option="option"></slot>
        </span>
      </el-transfer>
      <div class="btns">
        <el-button name="btnMoveUp" :type="move != 0 && move!= 1 ? 'default' : 'primary'" @click="makeSort(false)" :disabled="move != 0 && move!= 1">上移</el-button>
        <el-button name="btnMoveDown" :type="move != 0 && move!= 2 ? 'default' : 'primary'" @click="makeSort(true)" :disabled="move != 0 && move!= 2">下移</el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnSave" type="primary" @click="save(true)" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="$emit('update:visible', false)">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    // 左侧数据集
    data: {
      type: Array,
      default: new Array()
    },
    // 已选数据集
    current: {
      type: Array,
      default: new Array()
    },
    // 显示的key
    props: {
      type: Object,
      default: new Object()
    }
  },
  data() {
    return {
      allData: [],
      currentData: [],
      move: -1, // 是否可移动 -1代表不可移动 0代表可以上下移 1代表可以上移 2代表可以下移
      selectes: [], // 右侧选中的项
      filterMethod(query, item) {
        return (
          (item.MenuName && item.MenuName.indexOf(query) > -1) ||
          (item.MenuCode && item.MenuCode.indexOf(query) > -1)
        )
      }
    }
  },
  methods: {
    rightCheckChanged(selected) {
      if (selected.length) {
        this.selectes = [] // 清空选中标记
        this.currentData.forEach(item => {
          if (selected.indexOf(item) > -1) {
            this.selectes.push(item)
          }
        })
        let selectedFirst = this.currentData.indexOf(this.selectes[0])
        let selectedLast = this.currentData.indexOf(
          this.selectes[this.selectes.length - 1]
        )
        if (
          selectedFirst === 0 &&
          selectedLast === this.currentData.length - 1
        ) {
          this.move = -1
        } else if (selectedFirst === 0) {
          this.move = 2
        } else if (selectedLast === this.currentData.length - 1) {
          this.move = 1
        } else {
          this.move = 0
        }
      } else {
        this.move = -1
      }
    },
    // isDown true代表下移，false代表上移
    makeSort(isDown) {
      let self = this
      let sortItems = JSON.parse(JSON.stringify(this.selectes))
      if (isDown) {
        sortItems = sortItems.reverse()
      }
      sortItems.forEach(c => {
        let index = self.currentData.indexOf(c) // 已选的数据index
        let next = index - 1
        if (isDown) {
          next = index + 1
        }
        let moveItem = Object.assign(
          {},
          self.allData.find(item => item.MenuId === c)
        ) // 当前要移动的对象
        let moveIndex = self.allData.findIndex(
          item => item.MenuId === moveItem.MenuId
        )
        let nextItem = Object.assign(
          {},
          self.allData.find(
            item =>
              item.MenuId === self.currentData[next]
          )
        ) // 当前要移动的对象的已选的前一个对象
        let nextIndex = self.allData.findIndex(
          item => item.MenuId === nextItem.MenuId
        )
        self.$set(self.allData, nextIndex, moveItem)
        self.$set(self.allData, moveIndex, nextItem)
        let currentNextItem = self.currentData[next]
        self.$set(self.currentData, next, c)
        self.$set(self.currentData, index, currentNextItem)
      })
      this.rightCheckChanged(this.selectes)
    },
    currentChange(selected, direction) {
      this.currentData = [] // 清空右边数据，根据所有数据的顺序插入数据
      this.allData.forEach(item => {
        if (selected.indexOf(item.MenuId) > -1) {
          this.currentData.push(item.MenuId)
        }
      })
      if (direction === 'left') {
        this.selectes = []
      }
      this.rightCheckChanged(this.selectes)
    },
    save() {
      this.$emit('changed', this.currentData)
    },
    setData() {
      if (this.data.length) {
        this.allData = JSON.parse(JSON.stringify(this.data))
        // 按照已选的顺序重置所有的数据的顺序
        let index = 0
        this.currentData.forEach(c => {
          let moveItem = Object.assign(
            {},
            this.allData.find(item => item.MenuId === c)
          ) // 当前要移动的对象
          let moveIndex = this.allData.findIndex(
            item => item.MenuId === moveItem.MenuId
          )
          let toItem = Object.assign({}, this.allData[index]) // 当前要移动的对象的已选的前一个对象
          this.$set(this.allData, index, moveItem)
          this.$set(this.allData, moveIndex, toItem)
          index += 1
        })
      }
    }
  },
  mounted() {
    this.current.forEach(item => {
      this.currentData.push(item[this.props.key])
    })
    this.setData()
  },
  watch: {
    data: {
      deep: true,
      handler: 'setData'
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  .btns {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    justify-content: center;
    margin-left: 10px;
    .el-button {
      margin: 0;
      margin-bottom: 10px;
    }
  }
}
.el-transfer {
  /deep/ .el-transfer-panel {
    width: 250px;
  }
  /deep/ .el-transfer-panel__body {
    height: 500px;
    .el-transfer-panel__list {
      height: 454px;
    }
  }
  /deep/ .el-button + .el-button {
    margin-left: 0;
  }
}
</style>

