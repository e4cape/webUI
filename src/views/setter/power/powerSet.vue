<template>
  <el-row class="permission-list" style="background-color: #f5f5f5;" v-loading="bodyLoading">
    <el-col :span="3" class="role-menu" ref="pcMenu">
      <ul>
        <li name="item.label" v-for="(item,index) in menus" :key="index" :class="{active:activeIndex==index}" @click="changeMenu(index)">{{ item.label }}</li>
      </ul>
    </el-col>
    <el-col :span="21">
      <el-tree :data="menus" @check="dataChange" show-checkbox default-expand-all node-key="id" highlight-current class="permission-tree pc" ref="powerData"></el-tree>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    myPowers: {
      type: Array,
      default: () => []
    },
    allPowers: {
      type: Array,
      default: () => []
    },
    terminalType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      menusPower: [],
      activeIndex: 0,
      bodyLoading: false
    }
  },
  methods: {
    setPermissionStyle() {
      // 初始控制权限树的高度
      this.$refs.powerData.$el.setAttribute(
        'style',
        'height:' + this.$refs.pcMenu.$el.clientHeight + 'px'
      )
    },
    changeMenu(index) {
      // 控制pc权限左侧菜单锚点
      this.activeIndex = index
      let h = 0
      for (let i = 0; i < index; i++) {
        h += this.$refs.powerData.$el.children[i].clientHeight
      }
      this.$refs.powerData.$el.scrollTop = h
    },
    getAllSelectData(data) {
      let all = []
      if (data.children && data.children[0] && data.children[0].isLeaf) {
        all = [...data.children]
      } else if (data.children && data.children[0]) {
        data.children.forEach(item => {
          if (item.children) {
            all = [...all, ...this.getAllSelectData(item)]
          }
        })
      }
      return all
    },
    batchDataChange(data) {
      let allSelectData = []
      let flg = false // true代表子节点全选，false代表全不选
      allSelectData = this.getAllSelectData(data) || []
      allSelectData.forEach(item => {
        if (this.myPowers.indexOf(item.id) === -1) {
          flg = true
        }
      })
      if (flg) {
        allSelectData.forEach(item => {
          this.allPowers.forEach(child => {
            if (child.indexOf(item.PowerId) > -1) {
              this.myPowers.push(child)
            }
          })
        })
      } else {
        allSelectData.forEach(item => {
          for (let i = 0; i < this.myPowers.length; i++) {
            if (this.myPowers[i].indexOf(item.PowerId) > -1) {
              this.myPowers.splice(i, 1)
              i -= 1
            }
          }
        })
      }
      this.$refs.powerData.setCheckedKeys(this.myPowers)
      this.backMyPowers() // 返回数据
      this.bodyLoading = false
    },
    getLinkGoups(data, linkageGroups, allCheck) {
      // allCheck代表取该子节点的所有兄弟节点
      let linkagePowrIds = []
      this.menus.forEach(item => {
        item.children.length &
          item.children.forEach(sub => {
            sub.children.length &
              sub.children.forEach(menu => {
                if (menu.MenuId === data.MenuId) {
                  menu.children.length &
                    menu.children.forEach(leaf => {
                      if (
                        linkageGroups.indexOf(leaf.PowerTitle) > -1 ||
                        allCheck
                      ) {
                        linkagePowrIds.push(leaf.PowerId)
                      }
                    })
                  return linkagePowrIds
                }
              })
            return linkagePowrIds
          })
        return linkagePowrIds
      })
      return linkagePowrIds
    },
    dataChange(data) {
      this.bodyLoading = true
      if (data.isLeaf) {
        let linkageGroups = []
        let linkagePowrIds = []
        let dataCheck = this.myPowers.indexOf(data.id) === -1
        switch (data.PowerTitle) {
          case '检索':
            if (!dataCheck) {
              linkagePowrIds = this.getLinkGoups(data, linkageGroups, true) // true代表取该子节点的所有兄弟节点
            } else {
              linkagePowrIds.push(data.PowerId)
            }
            break
          case '创建':
            if (dataCheck) {
              linkageGroups = ['检索', '创建', '编辑', '详情']
              linkagePowrIds = this.getLinkGoups(data, linkageGroups)
            } else {
              linkagePowrIds.push(data.PowerId)
            }
            break
          case '编辑':
            if (dataCheck) {
              linkageGroups = ['检索', '编辑', '详情']
              linkagePowrIds = this.getLinkGoups(data, linkageGroups)
            } else {
              linkagePowrIds.push(data.PowerId)
            }
            break
          case '详情':
            if (!dataCheck) {
              linkageGroups = ['编辑', '提交审核', '详情']
              linkagePowrIds = this.getLinkGoups(data, linkageGroups)
            } else {
              linkageGroups = ['检索', '详情']
              linkagePowrIds = this.getLinkGoups(data, linkageGroups)
            }
            break
          case '提交审核':
            if (dataCheck) {
              linkageGroups = ['检索', '提交审核', '详情']
              linkagePowrIds = this.getLinkGoups(data, linkageGroups)
            } else {
              linkagePowrIds.push(data.PowerId)
            }
            break
          default:
            if (dataCheck) {
              linkageGroups = ['检索']
              linkagePowrIds = this.getLinkGoups(data, linkageGroups)
              linkagePowrIds.push(data.PowerId)
            } else {
              linkagePowrIds.push(data.PowerId)
            }
            break
        }
        if (dataCheck) {
          // 选中
          linkagePowrIds.forEach(pow => {
            this.allPowers.forEach(item => {
              if (item.indexOf(pow) > -1) {
                this.myPowers.push(item)
              }
            })
          })
        } else {
          linkagePowrIds.forEach(pow => {
            // 移除
            for (let i = 0; i < this.myPowers.length; i++) {
              if (this.myPowers[i].indexOf(pow) > -1) {
                this.myPowers.splice(i, 1)
                i -= 1
              }
            }
          })
        }
        this.$refs.powerData.setCheckedKeys(this.myPowers)
        this.backMyPowers() // 返回数据
        this.bodyLoading = false
      } else {
        this.batchDataChange(data)
      }
    },
    menusChange() {
      let leafs = document.getElementsByClassName('is-leaf')
      setTimeout(() => {
        this.$refs.powerData.setCheckedKeys([...this.myPowers])
        this.setPermissionStyle()
        for (let i = 0; i < leafs.length; i++) {
          if (
            leafs[i].parentElement.parentElement.parentElement.classList
              .length === 1
          ) {
            leafs[i].parentElement.style.float = 'left'
            leafs[i].parentElement.style.padding = '0px'
            leafs[i].parentElement.parentElement.parentElement.style.padding =
              '0 0 0 56px'
          }
        }
      })
    },
    backMyPowers() {
      let checkPower = new Set()
      this.myPowers.length &&
        this.myPowers.forEach(item => {
          checkPower.add(item.split('&')[1])
        })
      this.$emit('powerChange', {
        Powers: checkPower,
        TerminalType: this.terminalType
      })
    }
  },
  mounted() {
    let height = Math.max(
      this.menus.length * 40,
      document.getElementsByClassName('el-scrollbar__wrap')[1].offsetHeight -
        110
    )
    document.getElementsByClassName('role-menu')[0].style.height = height + 'px' // 控制权限框的大小随屏幕大小变化而变化
  },
  watch: {
    menus: 'menusChange'
  }
}
</script>

<style lang="scss">
.permission-list .tabs .tab {
  border-bottom-width: 1px;
}
.permission-list .el-tree-node__label {
  font-size: 12px !important;
}
.permission-list .panel {
  margin-top: 10px;
}
.permission-list {
  min-height: 100%;
  .el-tabs {
    padding-top: 0;
  }
  .el-tabs__header {
    border-width: 1px 0;
  }
  .el-tabs__content {
    background-color: #eee;
  }
  .role-menu {
    min-height: calc(100% - 100px);
    line-height: 40px;
    li {
      cursor: pointer;
      text-align: left;
      padding-left: 16px;
      &.active {
        background-color: #fff;
      }
    }
  }
  .permission-tree {
    min-height: 100%;
    padding-left: 15px;
    overflow: hidden;
    overflow-y: auto;
    border: 0;
    text-align: left;
  }
}
</style>