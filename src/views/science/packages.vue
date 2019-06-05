<template>
  <section>
    <el-table max-height="800" :data="tableData" style="width: 100%" v-loading="$store.getters.tb_loading">
      <el-table-column label="等级" width="50" align="center" prop="PackId"></el-table-column>
      <el-table-column label="套餐名称" align="center" min-width="120px" prop="PackName">
        <template slot="header">
          <div class="column-sub-header">
            <div>套餐名称</div>
            <span>(6个字以内)</span>
          </div>
        </template>
        <template slot-scope="{$index, row}">
          <div v-if="!isEditing">{{ row.PackName }}</div>
          <el-input v-if="isEditing" style="max-width: 120px;" v-model="row.PackName" :maxlength="6"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="包年费用(元)" align="center" min-width="1100">
        <el-table-column v-for="(item, index) in yearLength" :key="item" :label="(index + 1) + '年'" style="text-align: center" width="160" align="center">
          <template slot-scope="{$index, row}">
            <span v-if="$index == 0">
              ￥{{row['Price' +(index + 1)]}}
            </span>
            <template v-else-if="index == 0">
              <span v-if="!isEditing">
                ￥{{row['Price' +(index + 1)]}}
              </span>
              <el-input v-else style="max-width: 120px;" v-model="row['Price' +(index + 1)]" @keyup.native="inputChange($index)" @blur="rankChange($index)" :maxlength="10"></el-input>
            </template>
            <template v-else>
              <div class="row-flex">
                <span v-if="!isEditing">{{row['Rank' +(index + 1)]}}折</span>
                <el-input v-else style="width: 110px;" :maxlength="4" @keyup.native="rankChange($index, index)" @blur="checkRank(row['Rank' +(index + 1)])" v-model="row['Rank' +(index + 1)]">
                  <template slot="append">折</template>
                </el-input>
                <span>￥{{$root.toFixed(row['Price' +(index + 1)] - row['CouponPrice' +(index + 1)], 2)}}</span>
                <span class="gray">优惠 ￥{{row['CouponPrice' +(index + 1)]}}</span>
              </div>
            </template>
          </template>
        </el-table-column>

      </el-table-column>
      <el-table-column label="套餐说明" min-width="120px" align="center">
        <template slot="header">
          <div class="column-sub-header">
            <div>套餐说明</div>
            <span>(50个字以内)</span>
          </div>
        </template>
        <template slot-scope="scope">
          <el-input type="textarea" :rows="2" maxlength="50" v-if="isEditing" v-model="scope.row.Note"/>
          <span v-else>{{ scope.row.Note }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="btns clear">
      <el-button type="primary" @click="onSaveOrEdit" :loading="$store.getters.is_loading">
        {{
        isEditing ? '保存' : '编辑'
        }}
      </el-button>
      <el-button v-if="isEditing" @click="onCancel">取消</el-button>
      <span class="note">注：以上内容均会显示在续费或升级页面。优惠XXX，是与每年付费相比节省的费用</span>
    </div>
  </section>
</template>

<script>
import {
  COLLEGE_API_SETTINGPACK_GETS,
  COLLEGE_API_SETTINGPACK_UPDATE
} from '@/apis/science'

export default {
  data() {
    return {
      source: [],
      isEditing: false,
      yearsEnum: [1, 2, 3, 4, 5],
      tableData: [],
      yearLength: 0
    }
  },
  methods: {
    onCancel() {
      this.isEditing = false
      this.getData()
    },
    checkRank (value) {
      if (value < 1 || value > 10) {
        this.$message.error('打折范围为1-10')
      }
    },
    rankChange ($index, index) {
      let i = index + 1
      let value = this.$root.toFixed(this.tableData[$index]['Price1'], 2)
      let rank = this.$root.toFixed(this.tableData[$index]['Rank' + i]||0, 2)
      // this.tableData[$index]['Price' + i] = (value * (rank / 10) * i).toFixed(2)
      this.tableData[$index]['CouponPrice' + i] = ((value * i).toFixed(2) - (value * (rank / 10) * i).toFixed(2)).toFixed(2)
      this.tableData[$index]['Rank' + (index + 1)] = rank
      this.tableData[$index]['Price1'] = value
    },
    nameChange(value) {
      if (!value) {
        return ''
      }
      let length = 12
      for(let i = 0; i < value.length; i++) {
        if (/^[\u4e00-\u9fa5]+$/.test(value[i])) {
          length -=1
        }
      }
      return value.substring(0, length)
    },
    inputChange($index) {
      let value = this.$root.toFixed(this.tableData[$index]['Price1'], 2)
      value = value > 999999.99 ? 999999.99 : value
      value = value < 0 ? 0 : value
      for(let i = 0; i <= this.yearLength; i++) {
        if (i>=2) {
          this.tableData[$index]['Price' + i] = (value * i).toFixed(2)
          this.tableData[$index]['CouponPrice' + i] = ((value * i).toFixed(2) - (value * ((this.tableData[$index]['Rank' + i] || 0) / 10) * i).toFixed(2)).toFixed(2)
        }
      }
      this.tableData[$index]['Price1'] = value
    },
    onSave() {
      let Packs = []
      let flg = true
      this.tableData.forEach((item, index) => {
        let Prices = []
        for(let i = 0; i < this.yearLength; i++) {
          if (parseFloat(item['Rank' + (i + 1)] || 0) <= 0 || parseFloat(item['Rank' + (i + 1)] || 0) > 10) {
            this.$message.error(item.PackName + '的套餐打折不是1-10的小数')
            flg = false
            return
          } else if (index >=1 && parseFloat(item['Price' + (i + 1)]) <= 0) { // 去除免费版本
            this.$message.error(item.PackName + '的'+ (i + 1) + '年的金额必须大于0')
            flg = false
            return
          } else if (index >=1 && parseFloat(item.Price1) <= parseFloat(this.tableData[index - 1].Price1)) {
            this.$message.error(item.PackName + '的套餐不能小于等于' + this.tableData[index - 1].PackName)
            flg = false
            return
          } else if (index >=1 && i > 1 && parseFloat(item['Price' + (i + 1)]) < parseFloat(item['Price' + i])) { // bug18166
            this.$message.error(item.PackName + '的'+(i + 1)+'年套餐金额不能小于' + i + '年套餐金额')
            flg = false
            return
          } else if (index > 0 && i > 1 && parseFloat(item['Rank' + (i + 1)]) > parseFloat(item['Rank' + i])) { // 打折数字大小不能越来越大
            this.$message.error(item.PackName + '的' + (i + 1) + '年的打折大于' + i + '年的打折' )
            flg = false
            return
          } else if (index > 0 && i > 1 && 1 > parseFloat(item['Rank5'])) { // 5的年打折不能小于1
            this.$message.error(item.PackName + '的5年的打折必须大于1' )
            flg = false
            return
          }
          Prices.push({
            CouponPrice: this.$root.toInt(item['CouponPrice' + (i + 1)]),
            Price: this.$root.toInt(item['Price' + (i + 1)]),
            Rank: i > 0 ? parseFloat(item['Rank' + (i + 1)] || 0) : 10,
            Year: parseFloat(item['Year' + (i + 1)] || 0)
          })
        }
        Packs.push({
          PackName: item.PackName,
          PackId: item.PackId,
          Note: item.Note,
          LastUserId: item.LastUserId,
          LastUser: item.LastUser,
          LastTime: item.LastTime,
          Prices: JSON.stringify(Prices)
        })
      })
      if (flg) {
        this.$store.commit('SET_TB_LOADING', true)
        this.$store.commit('SET_BTN_LOADING', true)
        COLLEGE_API_SETTINGPACK_UPDATE({Packs: Packs}).then(res => {
          this.$store.commit('SET_TB_LOADING', false)
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.isEditing = false
          }
        })
      }
    },
    onSaveOrEdit() {
      if (this.isEditing) {
        this.onSave()
      } else {
        this.isEditing = true
      }
    },
    getData () {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      COLLEGE_API_SETTINGPACK_GETS().then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          let tableData = res.data.Data.Subset
          tableData.map((item) => {
            let Prices = JSON.parse(item.Prices)
            this.yearLength = Prices.length
            Prices.forEach((po, y) => {
              let ii = y+1
              item['Price' + ii] = (po.Price / 10000).toFixed(2)
              item['Rank' + ii] = po.Rank
              item['CouponPrice' + ii] = (po.CouponPrice / 10000).toFixed(2)
              item['Year' + ii] = ii
            })
            return item
          })
          this.tableData = tableData
        }
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>

.year-input {
  width: 80px;
}
.input-container {
  display: flex;
  .append {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(input) {
    padding: 0 !important;
  }
}
.btns {
  margin-top: 10px;
  & > span {
    float: right;
    line-height: 28px;
    color: $light-gray;
  }
}

.column-sub-header {
  display: flex !important;
  flex-direction: column;

  > * {
    line-height: 20px !important;
  }

  span {
    font-size: 12px;
    color: #bdbdbd;
  }
}
.discount {
  color: $light-gray;
}
.row-flex {
  display: flex;
  flex-direction: column;
}
</style>
