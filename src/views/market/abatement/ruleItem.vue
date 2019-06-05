<template>
  <el-col :class="clazz">
    <el-form
      ref="form"
      class="form"
      v-model="model"
      style="display: flex;"
    >
      <el-row
        :gutter="24"
        class="inner"
      >
        <el-col :span="2">
          <div class="content">{{model.materialTypeText}}</div>
        </el-col>
        <el-col
          style="height: 100%;"
          class="contents"
          :span="spans"
          v-for="(col, i) in columns"
          :key="i"
        >
          <div class="rules">
            <div class="rules-static">
              <div>
                <div>按</div>
                <el-select
                  name="selectGiveType"
                  v-if="isActive"
                  v-model="model.scoreTypeItems[i].giveType"
                >
                  <el-option
                    v-for="(t, i) in types"
                    :key="i"
                    :value="t.key"
                    :label="t.title"
                  ></el-option>
                </el-select>
                <div
                  class="number"
                  v-else
                >{{rule.scoreTypeItems[i].giveTypeText}}</div>
              </div>
              <div>
                <div>有效期</div>
                <el-input-number
                  name="inputNumberExpireDays"
                  :min="0"
                  size="mini"
                  :controls="false"
                  v-if="isActive"
                  v-model="model.scoreTypeItems[i].expireDays"
                ></el-input-number>
                <div
                  class="number"
                  v-else
                >{{rule.scoreTypeItems[i].expireDays}}</div>
                <div>天</div>
              </div>
            </div>
            <div
              class="rules-items"
              :style="i === 0 ? 'margin-right: 1px' :'margin-right: 1px'"
            >
              <div v-if="isActive">
                <div
                  v-for="(item, ruleIndex) in model.scoreTypeItems[i].items"
                  :key="ruleIndex"
                  class="rule-item"
                >
                  <div>
                    <div>消费满
                      <el-input-number
                        name="inputNumberReachPrice"
                        class="price"
                        :min="0"
                        size="mini"
                        :max="1000000"
                        :controls="false"
                        v-model="item.reachPrice"
                      ></el-input-number>元,
                    </div>
                    <div>每
                      <el-input-number
                        name="inputNumberPerPrice"
                        :min="0"
                        size="mini"
                        :controls="false"
                        :max="1000000"
                        v-model="item.perPrice"
                      ></el-input-number>元送
                      <el-input-number
                        name="inputNumberGiveAmt"
                        :min="0"
                        size="mini"
                        :precision="0"
                        :step="1"
                        :controls="false"
                        :max="1000000"
                        v-model="item.giveAmt"
                      />
                      {{col.scoreTypeText}}
                    </div>
                  </div>
                  <div
                    name="clickRemoveRule"
                    class="delete-icon"
                    @click="removeRule(i, ruleIndex)"
                  >
                    <i class="el-icon-remove"></i>
                  </div>
                </div>
                <div style="margin-top: 10px;">
                  <span class="add-action">
                    <i class="el-icon-circle-plus plus"></i>
                    <span
                      name="clickAddRule"
                      @click="addRule(i)"
                    >添加规则</span>
                  </span>
                  <span class="sub">(最多添加10个)</span>
                </div>
              </div>
              <div v-else>
                <div
                  class="rule-text"
                  v-for="(item, i) in rule.scoreTypeItems[i].items"
                  :key="i"
                >
                  <span>
                    消费满
                    <span class="number">{{item.reachPrice}}</span> 元,
                  </span>
                  <span>
                    每
                    <span class="number">{{item.perPrice}}</span> 元送
                    <span class="number">{{item.giveAmt}}</span>
                    <span style="padding-left: 2px;">{{col.scoreTypeText}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col
          :span="2"
          class="ope"
          v-if="editable"
        >
          <div v-if="isActive">
            <el-button
              name="btnOnSave"
              type="text"
              @click="onSave"
            >保存</el-button>
            <el-button
              name="btnSetEditingCancel"
              type="text"
              @click="$emit('set-editing')"
            >取消</el-button>
          </div>
          <el-button
            name="btnSetEditing"
            v-else
            type="text"
            @click="$emit('set-editing', rule.materialType)"
          >编辑</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-col>
</template>
<script>
import _ from 'lodash'
import { GiveTypes } from '@/enums/membership'
import { ScoreTypes } from '@/enums/marketing'
import { MEMBERSHIP_API_SCORERULE_SAVE } from '@/apis/membership'

export default {
  props: ['rule', 'isEditing', 'sort', 'isActive', 'editable'],
  components: {},
  data() {
    const types = [...GiveTypes.Types].map(t => ({
      ...t,
      key: parseInt(t.key)
    }))
    types.pop()
    return {
      model: {},
      types
    }
  },
  computed: {
    columns() {
      const { rule, sort } = this
      let { scoreTypeItems } = rule
      return scoreTypeItems
    },
    spans() {
      return (this.editable ? 20 : 22) / this.sort.length
    },
    clazz() {
      const { isActive, isEditing } = this

      return {
        active: isActive,
        editing: isEditing,
        container: true
      }
    }
  },
  methods: {
    async onSave() {
      const { model } = this
      const res = await MEMBERSHIP_API_SCORERULE_SAVE(model)
      if (res.data.Code === 'CORRECT') {
        this.$message.success('操作成功!')
        this.$emit('success', res.data.Data)
      }
    },
    addRule(index) {
      const typeItems = this.model.scoreTypeItems[index]
      if (!typeItems.items) {
        typeItems.items = []
      }
      const items = typeItems.items
      const { value } = this.sort[index]
      const { materialType } = this.rule
      let obj = {}
      const isGloden = String(materialType) === String(MaterialTypes.Goldlion)

      if (String(value) === String(ScoreTypes.Score)) {
        obj = {
          perPrice: isGloden ? 10 : 1,
          giveAmt: 1,
          reachPrice: 1
        }
      }
      if (items.length < 10) {
        items.push(obj)
      }
    },
    removeRule(index, ruleIndex) {
      const { items } = this.model.scoreTypeItems[index]
      if (items.length) {
        items.splice(ruleIndex, 1)
      }
    }
  },
  watch: {
    isActive(val) {
      if (val === true) {
      }
    },
    rule: {
      handler(val, oldVal) {
        if (val && val != oldVal) {
          this.model = _.cloneDeep(val)
          const { scoreTypeItems } = val
          scoreTypeItems.forEach((item, i) => {
            const { items } = item
            if (!items || (items.length === 0 && i === 0)) {
              this.addRule(i)
            }
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
$border-color: #e5e5e5;

.container {
  position: relative;
  border-bottom: 1px solid #f5f5f5;
  min-width: 1082px;
  :global(.el-col) {
    padding: 0 !important;
    text-align: center;
  }
  &.active {
    z-index: 3;
    .rules-static {
      flex-direction: column;
      justify-content: center;
      > div {
        align-items: center;
      }
    }

    .rules-items {
      > div {
        display: flex;
        flex-direction: column;
      }
    }
    &.editing {
      .mask {
        display: none;
      }
    }
  }
  .form {
    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .mask {
    transition: all 0.2s ease;
    background: transparent;
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    content: ' ';
  }
  &.editing {
    .mask {
      z-index: 2;
      pointer-events: all;
      background: white;
    }
  }
  :global(.el-input__inner) {
    height: 24px;
    line-height: 24px;
  }
  @media screen and (max-width: 1680px) {
    // background: red;
    padding-left: 0 !important;
    padding-right: 0 !important;
    .content,
    .rules-static,
    .rules-items {
      padding-left: 15px;
      padding-right: 5px;
    }
  }
}
.rule-item {
  display: flex;
  margin-bottom: 2px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      display: flex;
    }
  }
}

.rules {
  display: flex;
  height: 100%;
  width: 100%;
  text-align: center;
  box-shadow: -1px 0 #e5e5e5;
  :global(.el-input-number) {
    width: 30px;
    :global(input) {
      padding: 0;
    }
  }
  .price {
    width: 50px;
  }
  :global(.el-select) {
    width: 80px;
  }
  .rules-static {
    flex: 2;
    box-shadow: 1px 0 $border-color;
    > :not(:last-child) {
      margin-right: 2px;
    }
  }
  .rules-items {
    flex: 3;
    > {
      margin-bottom: 2px;
    }
  }
}
.rules-items {
  box-shadow: 1px 0 #e5e5e5;
}
.content,
.rules-static,
.rules-items {
  padding: 15px 0px;
  padding-left: 30px;
  display: flex;
  align-items: center;
}

.rules-static,
.rules-items {
  justify-content: flex-start;
  > div {
    display: flex;
  }
}
.rules-items {
  > div {
    flex-direction: column;
  }
}
.inner {
  width: 100%;
}

.icon-size {
  width: 18px;
  height: 18px;
}

.delete-icon {
  color: #da0000;
  cursor: pointer;
  margin-left: 5px;
  @extend .icon-size;
}

.plus {
  @extend .icon-size;
}
.add-action {
  color: #1f91df;
  cursor: pointer;
}

.sub {
  color: #777;
}
.rule-text {
  margin-bottom: 2px;
  text-align: left;
}
.number {
  color: #ffa200;
  font-weight: bold;
}
</style>
