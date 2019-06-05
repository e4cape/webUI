<template>
  <div class="content">
    <!-- <div
      class="tabs"
      v-if="$store.getters.user_session.CharacterType == characterType.Company"
    >
      <span
        name="tab0"
        class="tab"
        :class="{'active': activeIndex == 0}"
        @click="activeIndex = 0"
      >公司金价</span>
      <span
        name="tab1"
        class="tab"
        :class="{'active': activeIndex == 1}"
        @click="activeIndex = 1"
      >门店金价</span>
    </div> -->

    <div v-if="activeIndex == 0">
      <el-table
        :data="data"
        style="width: 100%"
        v-loading="$store.getters.tb_loading"
      >
        <el-table-column
          type="index"
          label="序号"
          show-overflow-tooltip
          width="90"
        ></el-table-column>
        <el-table-column
          prop="GoldType"
          label="成色"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{goldType.Types[scope.row.GoldType]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="零售金价(元/克)"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-input
              name="Gprice"
              :maxlength="9"
              v-model="scope.row.Gprice"
              @keyup.native="scope.row.Gprice = toFixed(scope.row.Gprice, 2)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="旧货回收金价(元/克)"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-input
              name="Jprice"
              :maxlength="9"
              v-model="scope.row.Jprice"
              @keyup.native="scope.row.Jprice = toFixed(scope.row.Jprice, 2)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="旧货回收工费"
          min-width="150"
        >
          <template slot-scope="scope">
            <div class="goldprice">
              <el-select
                size="mini"
                name="RecallType"
                v-model="scope.row.RecallType"
                class="fl goldprice-select"
                filterable
              >
                <el-option
                  v-for="(item, index) in recallTypes.Types"
                  :key="index"
                  :label="item"
                  :value="parseInt(index)"
                ></el-option>
              </el-select>
              <el-input
                name="RecallFee"
                class="fl goldprice-input"
                style="width:50%;"
                :maxlength="9"
                v-model="scope.row.RecallFee"
                @keyup.native="scope.row.RecallFee = toFixed(scope.row.RecallFee, 2)"
              ></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="buttons">
        <el-button
          name="saveData"
          type="primary"
          @click="saveData($event)"
          :loading="$store.getters.is_loading"
          v-if="data.length"
        >保存</el-button>
      </div>
    </div>

<!-- 没有接口 暂时不做  bug号 18140 -->
    <div v-if="activeIndex == 1">
      <el-row :gutter="20">
        <el-col
          :span="4"
          v-loading="loading1"
        >
          <el-radio-group
            v-model="selectStore"
            class="month-check"
          >
            <el-radio-button :label="-1">1号门店</el-radio-button>
            <el-radio-button :label="0">1号门店</el-radio-button>
            <!-- <el-radio-button v-for="(item, index ) in deskClassData" :key="index" :label="item.Id">{{item.Value}}</el-radio-button> -->
          </el-radio-group>
        </el-col>
        <el-col :span="20">
          <el-table
            :data="data"
            style="width: 100%"
            v-loading="$store.getters.tb_loading"
          >
            <el-table-column
              type="index"
              label="序号"
              show-overflow-tooltip
              width="90"
            ></el-table-column>
            <el-table-column
              prop="GoldType"
              label="成色"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{goldType.Types[scope.row.GoldType]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="零售金价(元/克)"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input
                  name="Gprice"
                  :maxlength="9"
                  v-model="scope.row.Gprice"
                  @keyup.native="scope.row.Gprice = toFixed(scope.row.Gprice, 2)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="旧货回收金价(元/克)"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input
                  name="Jprice"
                  :maxlength="9"
                  v-model="scope.row.Jprice"
                  @keyup.native="scope.row.Jprice = toFixed(scope.row.Jprice, 2)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="旧货回收工费"
              min-width="150"
            >
              <template slot-scope="scope">
                <div class="goldprice">
                  <el-select
                    size="mini"
                    name="RecallType"
                    v-model="scope.row.RecallType"
                    class="fl goldprice-select"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in recallTypes.Types"
                      :key="index"
                      :label="item"
                      :value="parseInt(index)"
                    ></el-option>
                  </el-select>
                  <el-input
                    name="RecallFee"
                    class="fl goldprice-input"
                    style="width:50%;"
                    :maxlength="9"
                    v-model="scope.row.RecallFee"
                    @keyup.native="scope.row.RecallFee = toFixed(scope.row.RecallFee, 2)"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <div class="buttons">
          <el-button
            name="saveData"
            type="primary"
            @click="saveData($event)"
            :loading="$store.getters.is_loading"
            v-if="data.length"
          >保存</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { CharacterType } from '@/enums/common'
import { StoreSettingGpriceRecallType } from '@/enums/marketing'
import { GoldType } from '@/enums/stocking'
import {
  MERCHANT_API_SETTING_GPRICE_GETS,
  MERCHANT_API_SETTING_GPRICE_UPDATE
} from '@/apis/merchant'
export default {
  data() {
    return {
      characterType: CharacterType,
      selectStore: 0,
      loading1: false,
      data: [],
      recallTypes: {},
      goldType: {},
      activeIndex: 0
    }
  },
  methods: {
    getData() {
      // 获取金价信息
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SETTING_GPRICE_GETS({}).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows
          this.data.map((item, index) => {
            item.index = index
            item.Gprice = this.$root.toFloat(item.Gprice)
            item.Jprice = this.$root.toFloat(item.Jprice)
            item.RecallFee = this.$root.toFloat(item.RecallFee)
            return item
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    saveData(e) {
      e.currentTarget.blur()
      // 保存操作
      this.$confirm('是否保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let Items = this.data.map(item =>
            Object.assign({}, item, {
              Gprice: this.$root.toInt(item.Gprice),
              Jprice: this.$root.toInt(item.Jprice),
              RecallFee: this.$root.toInt(item.RecallFee)
            })
          )
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_SETTING_GPRICE_UPDATE({ Items }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },
    toFixed(value, fixed) {
      if (value && value !== '0') {
        let number = JSON.parse(JSON.stringify(value))
        if (value.indexOf('.') > -1) {
          number =
            (value.split('.')[0] === '' ? '0' : value.split('.')[0]) +
            '.' +
            value.split('.')[1]
        }
        return number
          .replace(/[^\d.]*/g, '')
          .replace(
            new RegExp('([0-9]+.[0-9]{' + fixed + '})[0-9]*', 'gim'),
            '$1'
          )
      }
      return value
    }
  },
  beforeMount() {
    this.recallTypes = StoreSettingGpriceRecallType
    this.goldType = GoldType
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss">
.goldprice {
  display: flex;
  align-items: center;
  .goldprice-select {
    margin-right: -1px;
    width: 30%;
    input {
      margin-top: 1px;
      margin-right: -1px;
      border-radius: 0;
    }
  }
  .goldprice-input {
    width: 50%;
    input {
      border-radius: 0;
    }
  }
}

.month-check {
  width: 100%;
  .el-radio-button {
    width: 100%;
    .el-radio-button__inner {
      width: 100%;
      padding: 15px;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      border-radius: 0 !important;
      box-shadow: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:last-child {
      .el-radio-button__inner {
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
</style>
