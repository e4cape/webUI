<template>
  <div class="content p-40 border-1px">
    <el-form label-width="100px" class="tree" :model="roleData" ref="roleData">
     <el-form-item label="角色名称：" prop="RoleName"
        :rules="[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]">
        <el-row>
          <el-col :span="4">
            <el-input name="RoleName" v-model="roleData.RoleName"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="权限配置：" class="role-tree">
        <el-tree ref="roleTree" :data="data" show-checkbox default-expand-all node-key="MenuId" :props="defaultProps" :default-checked-keys="roleData.Checks"></el-tree>
      </el-form-item>
      <el-form-item>
        <el-button name="edit" type="primary" @click="edit">保存</el-button>
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
      },
      data: [],
      roleData: {
        RoleName: '',
        Checks: []
      },
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
                    ParentId: v.MenuId
                  })
                }
              })
              item.children.push(value)
            }
          })
          arr.push(item)
        }
      })
      return arr
    },
    init() {
      this.loading = true
      this.API_SECURITY_ROLEEDITDETAIL({
        id: this.$route.params.id
      }).then(res => {
        this.data = this.getRoleTree(res.data.Data)
        this.roleData.Checks = res.data.Data.Checks
        this.roleData.RoleName = res.data.Data.RoleName
        this.loading = false
      })
    },
    edit() {
      this.roleData.Checks = this.$refs.roleTree.getCheckedKeys()
      this.$refs.roleData.validate(valid => {
        if (valid) {
          let params = Object.assign({
          },{
            RoleId: this.$route.params.id
          }, this.roleData)
          this.API_SECURITY_ROLEEDIT(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.$router.go(-1)
            }
          })
        } else {
          this.$message({
            message: '请正确输入角色名称！',
            type: 'warning'
          })
        }
      })
    },
    validateName(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入角色名称'))
      } else if (value.length > 50) {
        callback(new Error('角色名称长度不可以超过50个字！'))
      } else {
        callback()
      }
    }

  },
  mounted() {
    // this.init()
  }
}
</script>

<style lang="scss">
  .tree {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
</style>

