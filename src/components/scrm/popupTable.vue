<template>
  <el-dialog :title="title" :visible.sync="visible" width="500px" @close="cancelSetting('settingDataForm')">
    <el-form :model="settingData" ref="settingDataForm">
      <el-button name="btnCreate" v-if="type == 3" class="newSetUp" :disabled="isEdit" type="primary" icon="el-icon-plus" @click="newProject">新建</el-button>
      <el-table :data="settingData.data" border style="width: 100%">
        <el-table-column :label="leftTitle">
          <template slot-scope="scope">
            <span v-if="type == 1">{{scope.row.sort}}级{{scope.row.sort == 1 ? '（最低）' : scope.row.sort == settingData.data.length ? '（最高）' : ''}}</span>
            <span v-if="type == 2">{{scope.row.sort}}</span>
            <span v-if="type == 3 && !scope.row.isInput">{{scope.row.name}}</span>
            <el-form-item v-if="type == 3 && scope.row.isInput" :prop="'data.' + scope.$index + '.name'">
              <el-input name="name" v-model="scope.row.name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="rightTitle">
          <template slot-scope="scope">
            <el-form-item v-if="type == 1" :prop="'data.' + scope.$index + '.name'">
              <el-input name="name" v-model="scope.row.name"></el-input>
            </el-form-item>
            <el-form-item v-if="type == 2" :prop="'data.' + scope.$index + '.name'">
              <el-input name="name" v-model="scope.row.name"></el-input>
            </el-form-item>
            <div class="operating" v-if="type == 3 && !scope.row.isInput">
              <el-button name="btnEdit" :disabled="isEdit" class="el-button el-button--text" @click="onModify(scope.row.name, scope.$index)">
                <span>修改</span>
              </el-button>
              <el-button name="btnDel" :disabled="isEdit" class="el-button el-button--text" @click="onDelete(scope.row)">
                <span>删除</span>
              </el-button>
            </div>
            <div class="operating" v-if="type == 3 && scope.row.isInput">
              <el-button name="btnSave" class="el-button el-button--text" @click="onSave(scope.row)">
                <span>保存</span>
              </el-button>
              <el-button name="btnCancel" class="el-button el-button--text" @click="onCanvel(scope.row)">
                <span>取消</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="type == 1 || type == 2" type="primary" @click="confirmSetting('settingDataForm')">确 定</el-button>
      <el-button v-if="type == 1 || type == 2" @click="cancelSetting('settingDataForm')">取 消</el-button>
      <el-button v-if="type == 3" @click="cancelSetting('settingDataForm')">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>

<script>
import {
  MEMBERSHIP_API_SETTINGOPTION_SAVEMEMBERLEVELS,
  MEMBERSHIP_API_SETTINGOPTION_SAVEMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGMEMBERTAG_CREATE,
  MEMBERSHIP_API_SETTINGMEMBERTAG_UPDATE,
  MEMBERSHIP_API_SETTINGMEMBERTAG_DELETE
} from '@/apis/membership.js'
export default {
  props: {
    type: {
      type: Number
    }, // 1:等级  2:分组 3: 客户标签
    gradeVisible: {
      type: Boolean
    }, // 弹窗显示
    title: {
      type: String
    }, // 弹窗标题
    leftTitle: {
      type: String
    }, // 表格头部左边标题
    rightTitle: {
      type: String
    }, // 表格头部右边标题
    settingData: {
      type: Object
    },
    memberTagIds: {
      type: Array
    }
  },
  data() {
    return {
      isEdit: false, // 是否禁用
      visible: this.gradeVisible,
      index: null, // 保存原有值的下标
      name: '' // 保存原有的值
    }
  },
  computed: {
  },
  watch: {
    gradeVisible(val) {
      this.visible = val
    }
  },
  methods: {
    // 新建
    newProject() {
      const obj = {
        name: '',
        isInput: true
      }
      this.isEdit = true
      this.settingData.data.unshift(obj)
    },
    // 确定
    confirmSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type == 1) {
            const para = {
              levels: this.settingData.data
            }
            MEMBERSHIP_API_SETTINGOPTION_SAVEMEMBERLEVELS(para).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$refs[formName].resetFields()
                this.$emit('confirmClick', false)
              }
            })
          }
          if (this.type == 2) {
            const para = {
              groups: this.settingData.data
            }
            MEMBERSHIP_API_SETTINGOPTION_SAVEMEMBERGROUPS(para).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$refs[formName].resetFields()
                this.$emit('confirmClick', false)
              }
            })
          }
        }
      })
    },
    // 关闭
    cancelSetting() {
      this.isEdit = false
      this.$emit('closeClick', false)
    },
    // 修改
    onModify(name, index) {
      this.name = name
      this.index = index
      this.isEdit = true
      this.settingData.data[index].isInput = true
    },
    // 取消
    onCanvel(data) {
      this.isEdit = false
      if (data.settingMemberTagId) {
        this.settingData.data[this.index].isInput = false
        this.settingData.data[this.index].name = this.name
      } else {
        this.settingData.data.shift()
      }
    },
    // 保存
    onSave(data) {
      if (data.settingMemberTagId) {
        MEMBERSHIP_API_SETTINGMEMBERTAG_UPDATE(data).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.isEdit = false
            this.$emit('confirmClick', true)
          }
        })
      } else {
        const para = {
          name: data.name
        }
        MEMBERSHIP_API_SETTINGMEMBERTAG_CREATE(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.isEdit = false
            this.$emit('confirmClick', true)
          }
        })
      }
    },
    // 删除
    onDelete(data) {
      // console.log(data.settingMemberTagId)
      let selectdTag = false
      this.memberTagIds.forEach(item => {
        if (item == data.settingMemberTagId) {
          selectdTag = true
        }
      })
      if (selectdTag) {
        this.$message({
          showClose: true,
          message: '改标签已经使用，不可删除',
          type: 'error'
        })
        return
      }
      const para = {
        settingMemberTagId: data.settingMemberTagId
      }
      MEMBERSHIP_API_SETTINGMEMBERTAG_DELETE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$emit('confirmClick', true)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button--text {
  border: none;
}
.newSetUp {
  margin-bottom: 10px;
}
/deep/ .cell {
  height: 28px;
  line-height: 28px;
}
</style>