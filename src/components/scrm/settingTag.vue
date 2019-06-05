<template>
  <div class="setting-tag" v-loading="loadingIf">
    <el-button name="btnNewTag" type="primary" @click="newTag" icon="el-icon-plus" :disabled="!newIf">新建标签</el-button>
    <el-table :data="settingTagTableData">
      <el-table-column :label="name">
        <template slot-scope="scope">
          <el-input name="name" v-if="scope.row.editIf || currentSettingTagId == scope.row.settingTagId" v-model="scope.row.name" placeholder="请输入名称" style="width:80%" clearable></el-input>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="范围">
        <template slot-scope="scope">
          <div v-if="scope.row.editIf || currentSettingTagId == scope.row.settingTagId">
            <el-input name="minValue" @keyup.native="scope.row.minValue = scope.row.minValue.replace(/[^\-?\d]/g,'')" v-model="scope.row.minValue" maxlength="8" placeholder="请输入数值" style="width:45%"></el-input>
            <span class="wave">~</span>
            <el-input name="maxValue" @keyup.native="scope.row.maxValue = scope.row.maxValue.replace(/[^\-?\d]/g,'')" v-model="scope.row.maxValue" maxlength="8" placeholder="请输入数值" style="width:45%"></el-input>
          </div>
          <div v-else class="the-range">
            <p>{{scope.row.minValue}}</p>
            <span class="wave">~</span>
            <p>{{scope.row.maxValue}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.editIf || currentSettingTagId == scope.row.settingTagId">
            <el-button name="btnSave" type="text" @click="save(scope.row)" size="small">保存</el-button>
            <el-button name="btnCancel" type="text" @click="cancel" size="small">取消</el-button>
          </div>
          <div v-else>
            <el-button name="btnUpdate" @click="update(scope.row)" type="text" size="small" :disabled="!newIf">修改</el-button>
            <el-button name="btnDel" type="text" @click="del(scope.row.settingTagId)" size="small" :disabled="!newIf">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="note">
      <span>注：</span>
      <p>标签名称最多20个字，请输入容易辨识的标签名称，例如：18岁以内</p>
      <p>范围为区间值，统计包含最小值和最大值。例如：输入范围18~25，实际统计≥18并且&lt;26的数据</p>
    </div>
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGTAG_GETCUSTOMSETTINGTAGSBYTAGTYPE,
  MEMBERSHIP_API_SETTINGTAG_CREATEORUPDATE,
  MEMBERSHIP_API_SETTINGTAG_DELETE
} from '@/apis/membership'
export default {
  props: {
    name: {
      type: String,
      default: '标签名称'
    }
  },
  data() {
    return {
      settingTagType: null, // 标签类型
      settingTagTableData: [], // 表格数据
      loadingIf: false, // 表格loading
      newIf: true, // 可以新建否
      currentSettingTagId: '' // 点击修改保存时，当前项id
    }
  },
  methods: {
    // 根据标签类型(自定义)获取标签设置列表
    getCustomSettingTagsByTagType(settingTagType) {
      this.loadingIf = true
      MEMBERSHIP_API_SETTINGTAG_GETCUSTOMSETTINGTAGSBYTAGTYPE(
        settingTagType
      ).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.settingTagType = settingTagType
          const dataArr = res.data.Data
          let settingTagTableDataArr = []
          for (let i = 0; i < dataArr.length; i += 1) {
            settingTagTableDataArr.push({
              editIf: false,
              settingTagId: dataArr[i].settingTagId,
              tagType: dataArr[i].tagType,
              name: dataArr[i].name,
              minValue: dataArr[i].minValue,
              maxValue: dataArr[i].maxValue
            })
          }
          this.settingTagTableData = settingTagTableDataArr
        }
        this.loadingIf = false
      })
    },
    // 新建标签
    newTag() {
      this.newIf = false
      this.settingTagTableData.unshift({
        editIf: true,
        settingTagId: null,
        tagType: this.settingTagType,
        name: '',
        minValue: '',
        maxValue: ''
      })
    },
    // 取消
    cancel() {
      this.newIf = true
      if (this.currentSettingTagId) {
        // -修改的取消
        this.getCustomSettingTagsByTagType(this.settingTagType)
        this.currentSettingTagId = ''
      } else {
        // -新建的取消
        this.settingTagTableData.shift()
      }
    },
    // 修改
    update(param) {
      this.newIf = false
      this.currentSettingTagId = param.settingTagId
    },
    // 保存
    save(param) {
      if (param.name.replace(/\s*/g, '') == '') {
        this.$message({
          message: '标签名称为1-20个字符',
          type: 'error'
        })
        return
      }
      if (param.settingTagId) {
        // -修改的保存
        this.createOrUpdate(param, '修改保存成功')
      } else {
        // -新建的保存
        this.createOrUpdate(param, '新建保存成功')
      }
    },
    createOrUpdate(param, message) {
      MEMBERSHIP_API_SETTINGTAG_CREATEORUPDATE(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            message,
            type: 'success'
          })
          this.getCustomSettingTagsByTagType(this.settingTagType)
          this.newIf = true
          this.currentSettingTagId = ''
        }
      })
    },
    // 删除
    del(settingTagId) {
      MEMBERSHIP_API_SETTINGTAG_DELETE(settingTagId).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getCustomSettingTagsByTagType(this.settingTagType)
        }
        if (!this.newIf) {
          this.newIf = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-tag {
  & > button {
    margin-bottom: 10px;
  }
  .wave {
    display: inline-block;
    width: 10%;
    text-align: center;
  }
  .the-range {
    p {
      display: inline;
    }
  }
  .note {
    position: relative;
    line-height: 20px;
    padding-left: 25px;
    margin-top: 15px;
    color: #999;
    font-size: 12px;
    span {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>

