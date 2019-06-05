<template>
  <div class="content">
    <el-alert type="error" :closable="false" title="以下消息是根据相应业务配置的微信公众号自动推送消息，门店可根据需要选择开启或关闭。"></el-alert>
    <el-table :data="tableData" class="m-t-10" v-loading="tableLoading">
      <el-table-column label="ID" type="index" width="50"></el-table-column>
      <el-table-column prop="MessageType" label="消息类型" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{SettingMessageType.Types[scope.row.MessageType]}}</template>
      </el-table-column>
      <el-table-column prop="TemplateNote" label="消息模板" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-switch name="EnableState" v-model="scope.row.EnableState" :active-value="EnableState.Enable" :inactive-value="EnableState.Disable" @change="enableStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  MARKETING_API_STORE_SYSTEM_MESSAGE_GETS,
  MARKETING_API_STORE_SYSTEM_MESSAGE_UPDATE
} from '@/apis/marketing'
import { EnableState } from '@/enums/common'
import { SettingMessageType} from '@/enums/marketing'
export default {
  data() {
    return {
      SettingMessageType,
      EnableState,
      tableData: [],
      tableLoading: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.tableLoading = true
      MARKETING_API_STORE_SYSTEM_MESSAGE_GETS({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.tableLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data
        }
      })
    },
    enableStateChange(row) {
      this.tableLoading = true
      MARKETING_API_STORE_SYSTEM_MESSAGE_UPDATE({
        MessageType:row.MessageType,
        EnableState:row.EnableState
      })
        .then(res => {
          this.tableLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
          } else {
            this.getData()
          }
        })
        .catch(() => {
          this.tableLoading = false
          this.getData()
        })
    }
  }
}
</script>

<style scoped>
</style>