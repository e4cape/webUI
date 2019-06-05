<template>
  <el-dialog title="从数据挖掘导入" :visible.sync="visible">
    <div class="import-from-tag">
      <div class="hd">
        <el-input name="searchBykeyword" class="input-name" v-model="keyword" placeholder="数据分组名称" size="mini"></el-input>
        <el-checkbox name="exceptEmptyMobile" size="mini" v-model="exceptEmptyMobile">不导入无手机号码客户</el-checkbox>
      </div>
      <div class="bd">
        <el-table :data="data" @current-change="handleCurrentChange" v-loading="$store.getters.tb_loading">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-radio name="settingTagGroupId" :label="scope.row.settingTagGroupId" v-model="selectedId">
                <span></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="数据分组" width="200" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="tagsText" label="标签" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <el-button name="bntConfirm" type="primary" @click="confirmImportFromTag" :loading="$store.getters.is_loading" size="mini">确定</el-button>
      <el-button name="btnClose" size="mini" @click="visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS
} from '@/apis/membership'

export default {
  props: {
    visibleImportFromTag: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      visible: this.visibleImportFromTag,
      keyword: '', // 搜索关键字-分组名称
      exceptEmptyMobile: true, // 导入无手机号码客户否
      selectedId: '', // 选中数据分组Id
      tableData: []
    }
  },
  computed: {
    data() {
      return this.tableData.filter(item => item.name.indexOf(this.keyword) > -1)
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleImportFromTag')
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 选中id
    handleCurrentChange(val) {
      this.selectedId = val.settingTagGroupId
    },
    // 确定提交
    confirmImportFromTag() {
      const param = {
        settingTagGroupId: this.selectedId,
        exceptEmptyMobile: this.exceptEmptyMobile
      }
      if (!this.selectedId) {
        this.$message.error('请选择标签')
        return
      }
      this.$emit('listenConfirmImportFromTag', param)
    }
  }
}
</script>

<style lang="scss" scoped>
.import-from-tag {
  .hd {
    margin-bottom: 10px;
    .input-name {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>
