<template>
  <el-row>
    <el-row class="m-y-5">
      <el-checkbox v-model="score">积分</el-checkbox>
      <el-radio-group class="rg" v-model="scoreRadio" :disabled="!score">
        <el-radio :label="1">
          {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价': '批发价'}} ×
          <el-input class="number" v-model="scoreRate1" :disabled="!score || scoreRadio != 1" placeholder="倍率" @keyup.native="scoreRate1=$root.toFixed(scoreRate1, 2)" maxlength="4"></el-input>
        </el-radio>
        <el-radio :label="2">
          零售价 ×
          <el-input class="number" v-model="scoreRate2" :disabled="!score || scoreRadio != 2" placeholder="倍率" @keyup.native="scoreRate2=$root.toFixed(scoreRate2, 2)" maxlength="4"></el-input>
        </el-radio>
      </el-radio-group>
      <span class="red proxy-error" v-if="score && !scoreRadio">请选择规则</span>
      <span class="red proxy-error" v-else-if="score && ((scoreRadio == 1 && !scoreRate1) || (scoreRadio == 2 && !scoreRate2))">请填写倍率</span>
    </el-row>
    <el-row class="m-y-5">
      <el-checkbox v-model="golden">礼金</el-checkbox>
      <el-radio-group class="rg" v-model="goldRadio" :disabled="!golden">
        <el-radio :label="1">
          {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价': '批发价'}} ×
          <el-input class="number" v-model="goldenRiceRate1" :disabled="!golden || goldRadio != 1" placeholder="倍率" @keyup.native="goldenRiceRate1=$root.toFixed(goldenRiceRate1, 2)" maxlength="4"></el-input>
        </el-radio>
        <el-radio :label="2">
          零售价 ×
          <el-input class="number" v-model="goldenRiceRate2" :disabled="!golden || goldRadio != 2" placeholder="倍率" @keyup.native="goldenRiceRate2=$root.toFixed(goldenRiceRate2, 2)" maxlength="4"></el-input>
        </el-radio>
      </el-radio-group>
      <span class="red proxy-error" v-if="golden && !goldRadio">请选择规则</span>
      <span class="red proxy-error" v-else-if="golden && ((goldRadio == 1 && !goldenRiceRate1) || (goldRadio == 2 && !goldenRiceRate2))">请填写倍率</span>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      row: {
      },
      golden: false,
      score: false,
      goldRadio: '',
      scoreRadio: '',

      goldenRiceRate1: '', // 批发价
      goldenRiceRate2: '', // 零售价
      scoreRate1: '',
      scoreRate2: ''
    }
  },
  methods: {
  },
  watch: {
    data: {
      immediate: true,
      // 使用 scoreType  1 积分, 2 礼金 3 全选
      handler(newVal) {
        if (!newVal) {
          return
        }
        const {
          scoreType, ...rest
        } = newVal
        const {
          goldenRiceRate1, // 批发价 
          goldenRiceRate2, // 零售价 
          scoreRate1,
          scoreRate2
        } = rest
        switch (scoreType) {
          case 1:
            this.score = true
            break
          case 2:
            this.golden = true
            break
          case 3:
            this.score = true
            this.golden = true
            break
          default:
            break
        }

        if (goldenRiceRate1) {
          this.goldRadio = 1
        } else if (goldenRiceRate2) {
          this.goldRadio = 2
        }

        if (scoreRate1) {
          this.scoreRadio = 1
        } else if (scoreRate2) {
          this.scoreRadio = 2
        }
        const self = this
        Object.keys(rest).forEach(k => {
          self[k] = rest[k]
        })
      }
    }
  },
  filters: {
    scoreFilter(val) {
      return val ? 1 : 0
    },
    goldFilter(val) {
      return val ? 2 : 0
    }
  },
  updated() {
    let data = {
      ...this.$data
    }
    const {
      golden, score, scoreRadio, goldRadio
    } = data
    data.scoreType = golden | score
    if (scoreRadio == 1) {
      delete data.scoreRate2
    } else if (scoreRadio == 2) {
      delete data.scoreRate1
    } else {
      delete data.scoreRate2
      delete data.scoreRate1
    }
    if (goldRadio == 1) {
      delete data.goldenRiceRate2
    } else if (goldRadio == 2) {
      delete data.goldenRiceRate1
    } else {
      delete data.goldenRiceRate2
      delete data.goldenRiceRate1
    }
    if (golden && score) {
      data.scoreType = 3
    } else if (golden) {
      data.scoreType = 2
    } else if (score) {
      data.scoreType = 1
    } else {
      delete data.scoreType
    }
    this.$emit('change', data)
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
  margin: 0 20px;
}
</style>
