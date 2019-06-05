<template>
  <el-row :loading="$store.getters.tb_loading" element-loading-text="拼命加载中...">
    <el-row class="m-b-10">
      <span>开启自动上架：</span>
      <el-switch name="btnAuto" v-model="autoUp" :active-value="1" @change="setAuto" :inactive-value="0"></el-switch>
    </el-row>
    <el-alert type="warning" title :closable="false" v-if="!autoUp">
      <p>当前设置的是手工上架，系统有更新的礼品时需要手工在礼品管理中添加。</p>
      <p>建议设置为自动上架，系统有更新的礼品时自动上架到您的礼品商城中。</p>
    </el-alert>
    <div class="content">
      <el-table class="table" :data="data">
        <el-table-column prop="categoryName" label="礼品大类" width="120"></el-table-column>
        <el-table-column label="兑换方式">
          <template slot-scope="scope">
            <el-row>
              <el-radio-group name="isGroup" v-model="scope.row.isGroup" class="m-y-10" @change="(...args) => onGroupFieldChange(scope.$index, ...args)">
                <el-radio-button :label="true">子类统一设置</el-radio-button>
                <el-radio-button :label="false">子类分别设置</el-radio-button>
              </el-radio-group>
              <template v-if="scope.row.isGroup">
                <el-row :gutter="10" style="display: flex; align-items: center;">
                  <el-col :span="6">
                    <span v-for="(item, index) in scope.row.child" :key="item.categoryId">{{item.categoryName + (index != scope.row.child.length - 1 ? '，': '')}}</span>
                  </el-col>
                  <el-col :span="18">
                    <rule-item name="btnGroupChange" :data="scope.row.rule" @change="onGroupChange(scope.$index, $event)"/>
                  </el-col>
                </el-row>
              </template>
              <template v-else>
                <el-table :data="scope.row.child" :show-header="false">
                  <el-table-column prop="categoryName" label="子类" width="100"></el-table-column>
                  <el-table-column prop="rule" label="规则">
                    <template slot-scope="childScope">
                      <rule-item name="btnChildChange" :data="childScope.row.rule" @change="(rule) => onChildChange(scope.$index, childScope.$index, rule)"/>
                    </template>
                    row.row.IW
                  </el-table-column>
                </el-table>
              </template>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="m-y-10 btns">
        <el-button name="btnSave" type="primary" @click="save" v-loading="$store.getters.is_loading">保存</el-button>
      </el-row>
    </div>
  </el-row>
</template>

<script>
import {
  GIFTING_API_RULE_GETGIFTRULE,
  GIFTING_API_ONSHELFERULE_GETONSHELFERULE,
  GIFTING_API_ONSHELFERULE_ONSHELFERULE,
  GIFTING_API_RULE_CREATEGIFTRULE
} from '@/apis/gifting'
import RuleItem from './ruleItem'
export default {
  components: {
    RuleItem
  },
  data() {
    this.changedData = []
    return {
      data: [],
      data1: [],
      autoUp: 0,
      rules: []
    }
  },
  methods: {
    onGroupFieldChange(index, isGroup) {
      this.changedData[index].isGroup = isGroup
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_RULE_GETGIFTRULE().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          const o = this.resetRules(res.data.Data)
          this.data = o
          this.changedData = JSON.parse(JSON.stringify(o))
        }
      })
    },
    resetRules(data) {
      let rule = {
        scoreType: 0,
        goldenRiceRate1: '',
        goldenRiceRate2: '',
        scoreRate1: '',
        scoreRate2: ''
      }
      return data.map((item, index) => {
        item.id = index
        item.isGroup = !!item.rule
        item.rule = Object.assign({}, rule, item.rule)
        item.scoreType1 = item.rule.scoreType === 1 || item.rule.scoreType === 3
        item.scoreType2 = item.rule.scoreType === 2 || item.rule.scoreType === 3
        item.goldenRiceRate = item.rule.goldenRiceRate1
          ? 1
          : item.rule.goldenRiceRate2
            ? 2
            : ''

        item.scoreRate = item.rule.scoreRate1
          ? 1
          : item.rule.scoreRate2
            ? 2
            : ''

        item.child = item.children.map(child => {
          child.rule = Object.assign({}, rule, child.rule)
          child.scoreType1 =
            child.rule.scoreType === 1 || child.rule.scoreType === 3
          child.scoreType2 =
            child.rule.scoreType === 2 || child.rule.scoreType === 3
          child.goldenRiceRate = child.rule.goldenRiceRate1
            ? 1
            : child.rule.goldenRiceRate2
              ? 2
              : ''
          child.scoreRate = child.rule.scoreRate1
            ? 1
            : child.rule.scoreRate2
              ? 2
              : ''
          return child
        })
        delete item.children
        return item
      })
    },
    getOnShelf() {
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_ONSHELFERULE_GETONSHELFERULE().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.autoUp = res.data.Data
          if (this.autoUp === 1) {
            this.getData()
          }
        }
      })
    },
    mapToRules(obj) {
      const { rule, parentId, categoryId, child, isGroup } = obj
      if (!isGroup && child) {
        child.forEach(this.mapToRules)
      } else {
        this.rules.push({
          ...rule,
          categoryId1: parentId,
          categoryId2: categoryId
        })
      }
    },
    async save() {
      let _error = this.$el.querySelector('.proxy-error')
      if (_error) {
        this.$message.warning('有信息未完善！')
        return
      }
      this.rules = []
      this.changedData.forEach(this.mapToRules)
      this.$store.commit('SET_BTN_LOADING', true)
      GIFTING_API_RULE_CREATEGIFTRULE({
        rules: this.rules
      }).then(response => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (response.data.Code === 'CORRECT') {
          this.$message.success('保存成功！')
          this.getData()
        }
      })
    },
    setAuto() {
      GIFTING_API_ONSHELFERULE_ONSHELFERULE({
        i: this.autoUp ? 1 : 0
      })
    },
    onGroupChange(index, rule) {
      this.changedData[index].rule = rule
    },
    onChildChange(parentIndex, childIndex, rule) {
      this.changedData[parentIndex].child[childIndex].rule = rule
    }
  },
  mounted() {
    this.getOnShelf()
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.number {
  width: 50px;
  /deep/ .el-input__inner {
    padding: 0 8px;
  }
}
.rg {
  margin-left: 20px;
}
.content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  .table {
    flex: 1;
    overflow: auto;
  }
}
.table::before {
  display: none;
}
</style>

