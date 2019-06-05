<template>
  <div class="content p-40 border-1px">
    <el-form label-width="100px">
      <el-form-item label="角色名称：">
        <el-row>
          <el-col :span="4">
            <el-input name="roleName" v-model="roleName" readonly></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="权限配置：" class="role-tree">
        <el-tree :data="data" show-checkbox default-expand-all node-key="MenuId" :props="defaultProps" :default-checked-keys="checkedArr"></el-tree>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        label: 'MenuTitle',
        children: 'children',
        disabled: 'isEdit'
      },
      data: [],
      checkedArr: [],
      roleName: '',
      loading: false
    }
  },
  methods: {
    getRoleTree(data) {
      let arr = []
      data.Trees.forEach(item => {
        if (item.ParentId == '') {
          item.children= []
          data.Trees.forEach(value => {
            if(value.ParentId == item.MenuId) {
              value.children = []
              data.Powers.forEach(v => {
                if (v.MenuId == value.MenuId) {
                  value.children.push({
                    MenuTitle: v.PowerTitle,
                    MenuId: v.PowerId,
                    ParentId: v.MenuId,
                    isEdit: true
                  })
                }
              })
              value.isEdit = true
              item.children.push(value)
            }
          })
          item.isEdit = true
          arr.push(item)
        }
      })
      return arr
    },
    init() {
      this.loading = true
      this.API_SECURITY_ROLEDETAIL({
        id: this.$route.params.id
      }).then(res => {
        this.data = this.getRoleTree(res.data.Data)
        this.checkedArr = res.data.Data.Checks
        this.roleName = res.data.Data.RoleName
        this.loading = false
      })
    }
  },
  mounted() {
    // this.init()
  }
}
</script>

<style lang="scss">
.role-tree {
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #006DB8;
    border-color: #006DB8;
  }
  .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
    background-color: #006DB8;
    border-color: #006DB8;
  }
}
</style>

