<template>
  <el-row v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中...">
    <el-row class="m-b-10">
      <span>开启市场价：</span>
      <el-switch name="btnPrice" v-model="priceUp" :active-value="true" @change="setPrice" :inactive-value="false">
      </el-switch>
    </el-row>
    <el-alert type="warning" title="" :closable="false" v-if="!priceUp">
      <p>开启市场价后，礼品商城的小程序显示礼品的市场价</p>
      <p>可以按分类为礼品设置市场价，按采购价或零售价的倍率自动计算。</p>
    </el-alert>
    <div class="content" v-if="priceUp">
      <div class="tip">请为每个分类设置市场价：<span>（市场价在小程序中显示）</span></div>
      <el-table class="table" :data="data" row-key="categoryId">
        <el-table-column prop="categoryName" label="礼品大类" width="120"></el-table-column>
        <el-table-column label="市场价">
            <template slot-scope="scope">
              <el-row>
                <el-radio-group
                  name="uniformly"
                  v-model="scope.row.uniformly"
                  class="m-y-10"
                  @change="(...args) => onGroupFieldChange(scope.$index, ...args)">
                    <el-radio-button :label="1">子类统一设置</el-radio-button>
                    <el-radio-button :label="0">子类分别设置</el-radio-button>
                </el-radio-group>
                  <template v-if="scope.row.uniformly">
                    <el-row :gutter="10" style="display: flex; align-items: center;">
                      <el-col :span="6">
                        <span v-for="(item, index) in scope.row.children" :key="item.categoryId">
                        {{item.categoryName + (index != scope.row.children.length - 1 ? '，': '')}}
                        </span>
                      </el-col>
                      <el-col :span="18">
                        <rule-item name="btnGroupChange" :data="scope.row.rule" @change="onGroupChange(scope.$index, $event)"/>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-else>
                    <el-table :data="scope.row.children" :show-header="false">
                      <el-table-column prop="categoryName" label="子类" width="100"></el-table-column>
                      <el-table-column prop="rule" label="规则">
                        <template slot-scope="childScope">
                          <rule-item
                            name="btnChildChange"
                            :data="childScope.row.rule"
                            @change="(rule) => onChildChange(scope.$index, childScope.$index, rule)"/>
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
  GIFTING_API_STORECATEGORYPRICE_GETSTORECATEGORYPRICES,
  GIFTING_API_STORECATEGORYPRICE_ISENABLEMARKETPRICERATE,
  GIFTING_API_STORECATEGORYPRICE_SETENABLEMARKETPRICERATE,
  GIFTING_API_STORECATEGORYPRICE_UPDATESTORECATEGORYPRICES
} from '@/apis/gifting'
import RuleItem  from './ruleItem'
export default {
  components: {
    RuleItem
  },
  data() {
    this.changedData = []
    return {
      data: [],
      priceUp: 0,
    }
  },
  methods: {
    onGroupFieldChange(index, isGroup){
      console.log(isGroup)
      this.changedData[index].uniformly = isGroup
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_STORECATEGORYPRICE_GETSTORECATEGORYPRICES().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          const o = this.resetRules(res.data.Data)
          this.data  = o
          this.changedData =  JSON.parse(JSON.stringify(o))
        }
      })
    },
    resetRules(data) {
      let rule = {
        retailRate: '',
        retailEnable: '',
        wholesaleEnable: '',
        wholesaleRate: '',
      }
      return data.map(item => {
        item.rule = Object.assign({
        }, item.rule, rule)
        item.rule.retailRate = item.retailRate
        item.rule.retailEnable = item.retailEnable
        item.rule.wholesaleEnable = item.wholesaleEnable
        item.rule.wholesaleRate = item.wholesaleRate

        item.children.map(child => {
          child.rule = Object.assign({
          }, child.rule, rule)
          child.rule.retailRate = child.retailRate
          child.rule.retailEnable = child.retailEnable
          child.rule.wholesaleEnable = child.wholesaleEnable
          child.rule.wholesaleRate = child.wholesaleRate
          return child
        })
        return item
      })
    },
    getOnShelf() {
      GIFTING_API_STORECATEGORYPRICE_ISENABLEMARKETPRICERATE().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.priceUp = res.data.Data
          if (this.priceUp) {
            this.getData()
          }
        }
      })
    },
    async save() {
      let _error = this.$el.querySelector('.proxy-error')
      let isError = 0
      if (_error) {
        this.$message.warning('有信息未完善！')
        return
      }
      this.$store.commit('SET_BTN_LOADING', true)
      try {
        let rules = []
        function mapToRules(obj){
          const {
            rule, parentId, categoryId, children, uniformly 
          } = obj
          // if(children.length !== 0) {
          //   children.forEach(mapToRules)
          // } else {
          //   rules.push({
          //     ...rule,
          //     uniformly: uniformly,
          //     categoryId: categoryId
          //   })
          // }
          console.log(rule.retailRate, rule.wholesaleRate)
          if (!(0 - rule.retailRate < 0) && rule.retailRate) {
            isError = 2
          }
          if (!(0 - rule.wholesaleRate < 0) && rule.wholesaleRate) {
            isError = 1
          }
          rules.push({
            ...rule,
            uniformly: uniformly,
            categoryId: categoryId
          })
          children.forEach(mapToRules)
        }
        this.changedData.forEach(mapToRules)
        if (isError === 2) {
          return this.$message.error('零售价倍率必须大于0')
        } else if (isError === 1) {
          return this.$message.error('采购价倍率必须大于0')
        }
        await  GIFTING_API_STORECATEGORYPRICE_UPDATESTORECATEGORYPRICES({
          items: rules 
        }).then(response => {
          if (response.data.Code === 'CORRECT') {
            this.$message.success('保存成功！')
            this.getData()
          }
        })
      } catch(e){
      } finally {
        this.$store.commit('SET_BTN_LOADING', false)
      }
    },
    setPrice() {
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_STORECATEGORYPRICE_SETENABLEMARKETPRICERATE({
        enable: this.priceUp
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onGroupChange(index, rule){
      this.changedData[index].rule = rule
    },
    onChildChange(parentIndex, childIndex, rule) {
      this.changedData[parentIndex].children[childIndex].rule = rule
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
  .tip {
    padding-bottom: 10px;
    span {
      color: #999;
    }
  }
  .table {
    flex: 1;
    overflow: auto;
  }
}
.table::before {
  display: none;
}
</style>

