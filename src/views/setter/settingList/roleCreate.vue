<template>
  <div class="content-view border-1px p-40">
    <el-form label-width="100px" class="tree fix-w" :model="createData" ref="createRole">
      <el-form-item label="角色名称：" prop="RoleName"
        :rules="[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]">
        <el-row>
          <el-col :span="4">
            <el-input name="RoleName" v-model="createData.RoleName"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="权限配置：">
        <el-tree :data="data" ref="roleTree" show-checkbox default-expand-all node-key="MenuId" :props="defaultProps"></el-tree>
      </el-form-item>
      <el-form-item>
        <el-button name="save" type="primary" @click="save">保存</el-button>
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
      roleName: '',
      createData: {
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
                    ParentId: v.MenuId,
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
      this.API_SECURITY_ROLECREATEDETAIL().then(res => {
        this.loading = false
        this.data = this.getRoleTree(res.data.Data)
      })
    },
    save() {
      this.createData.Checks = this.$refs.roleTree.getCheckedKeys()
      this.$refs.createRole.validate(valid => {
        if (valid) {
          this.API_SECURITY_ROLECREATE(this.createData).then(res => {
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
