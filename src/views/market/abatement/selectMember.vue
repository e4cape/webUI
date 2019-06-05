<template>
  <el-dialog title="从数据挖掘导入" width="600px" :visible="visible" @update:visible="$emit('update:visible', $event)">
    <div class="header">
      <el-input name="inputOnSearch" placeholder="数据分组名称" style="max-width: 200px;" size="mini" v-model="searchValue"></el-input>
      <el-checkbox size="mini" v-model="mobile">不导入无手机号码客户</el-checkbox>
    </div>
    <div>
      <el-table highlight-current-row @current-change="handleCurrentChange" :data="filterData" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio name="radioSelected" :label="scope.row.settingTagGroupId" v-model="selected">
              <span></span>
            </el-radio>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="数据分组" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tagsText" label="标签" min-width="300" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button name="btnConfirm" size="mini" type="primary" @click="confirm" :loading="uploading">确定</el-button>
      <el-button name="btnClose" size="mini" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS,
  MEMBERSHIP_API_DEDUCTORDER_BATCHIMPORTANALYSIS
} from '@/apis/membership'

export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    initMobile: {
      default: false,
      type: Boolean
    },
    id: {
      required: true,
      type: String
    }
  },
  watch: {
    visible(val) {
      if (val === false) {
        this.mobile = this.initMobile
        this.selects = []
      }
    }
  },
  computed: {
    filterData() {
      return this.data.filter(d => d.name.indexOf(this.searchValue) > -1)
    }
  },
  methods: {
    getData() {
      MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    confirm() {
      if (!!this.selected === false) {
        return this.$message.error('请选择标签分组!')
      }
      const para = {
        exceptEmptyMobile: this.mobile,
        deductCode: this.id,
        groupIds: [this.selected]
      }

      this.uploading = true
      MEMBERSHIP_API_DEDUCTORDER_BATCHIMPORTANALYSIS(para)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$emit('success')
            this.close()
          }
          this.uploading = false
        })
        .catch(() => {
          () => {
            this.uploading = false
          }
        })
    },
    close() {
      this.$emit('update:visible', false)
    },
    handleCurrentChange(val) {
      this.selected = val.settingTagGroupId
    }
  },
  data() {
    return {
      searchValue: '',
      mobile: this.initMobile,
      data: [],
      uploading: false,
      selects: [],
      loading: false,
      selected: ''
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  & > :first-child {
    margin-right: 10px;
  }
}
</style>
