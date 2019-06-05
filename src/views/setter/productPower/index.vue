<template>
  <div>
    <div class="tabs">
      <span name="tab" class="tab" v-for="item in tabTitles" :key="item.KeyId" :class="{'active': tabIndex === item.KeyId}" @click="tabChange(item.KeyId)">{{item.Value}}</span>
    </div>
    <el-table :data="dataList" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="FieldCnName" label="属性名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FieldType" label="类型" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{fieldType.Types[scope.row.FieldType]}}</template>
      </el-table-column>
      <el-table-column prop="IsPrivate" label="私密数据" min-width="80" show-overflow-tooltip>
        <template slot="header">
          <span class="m-r-5">私密数据</span>
          <el-tooltip effect="dark" content="设置为私密数据后仅有权限的人可以查看" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.IsPrivate" :active-value="ynStatus.Yes" :inactive-value="ynStatus.No" @change="(v) => changeState(scope.row.FieldId,v)"></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldType
} from '@/enums/stocking.js'
import {
  STOCKING_API_SETTING_PRIVATE_FIELD_GETS,
  STOCKING_API_SETTING_PRIVATE_FIELD_UPDATE
} from '@/apis/stocking.js'
export default {
  data() {
    return {
      tabIndex: 0,
      ynStatus: YNStatus,
      tabTitles: SettingCustomizedFieldSmallType.TypeArray,
      fieldType: SettingCustomizedFieldType,
      dataList: [],
      parameters: {}
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            FieldType: this.tabTitles[0].KeyId || 0
          }
      this.parameters = Object.assign({}, query)
      this.tabIndex = this.parameters.FieldType
      this.getData()
    },
    initRoute() {
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    tabChange(i) {
      this.tabIndex = i
      this.parameters.FieldType = i
      this.initRoute()
    },
    changeState(id, state) {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTING_PRIVATE_FIELD_UPDATE({
        FieldId: id,
        IsPrivate: state
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code == 'CORRECT') {
          this.getData()
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTING_PRIVATE_FIELD_GETS({
        CharacterId: this.$store.getters.user_session.CharacterId,
        SmallType: this.tabIndex
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code == 'CORRECT') {
          this.dataList = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  }
}
</script>
