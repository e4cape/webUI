<template>
  <div class="content">
    <!-- @module 数据表格 -->
    <el-table
      :data="formData"
      v-loading="fullLoading"
    >
      <el-table-column
        prop="GenerateType"
        label="单据名称"
        min-width="200"
      >
        <template slot-scope="scope">
          {{String(settingGenerateType.Types[scope.row.GenerateType]).replace(/\([^\)]*\)/g,"")}}
        </template>
      </el-table-column>
      <el-table-column
        prop="OrderPrefix"
        label="单据前缀"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-input
            name="OrderPrefix"
            v-model="scope.row.OrderPrefix"
            :maxlength="6"
            @blur="blurChange(scope.row.OrderPrefix, scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="流水号"
        min-width="200"
      >
        <template slot-scope="scope">
          <el-select
            :name="'len'+ scope.row.SerialLength"
            v-model="scope.row.SerialLength"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in streamNumber"
              :key="item.value"
              :label="item.label"
              :value="parseInt(item.value)"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="应用效果"
        min-width="230"
      >
        <template slot-scope="scope">
          <span>{{scope.row.OrderPrefix | results(scope.row)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <div class="buttons">
      <el-button
        name="save"
        type="primary"
        @click="saveData($event)"
        :loading="$store.getters.is_loading"
        v-if="formData.length > 0"
      >保存</el-button>
      <span
        class="fr"
        style="line-height: 28px;"
      >
        单据编号为：单号前辍+年月日+顺序号，顺序号每年归零。
      </span>
    </div>
  </div>
</template>

<script>
import { SettingGenerateType } from '@/enums/merchant'
import {
  MERCHANT_API_SETTING_GENERATE_GETS,
  MERCHANT_API_SETTING_GENERATE_UPDATE
} from '@/apis/merchant.js'
export default {
  data() {
    return {
      fullLoading: false,
      settingGenerateType: SettingGenerateType,
      formData: [], // 用于展示的容器
      streamNumber: [
        {
          value: 5,
          label: '5位'
        },
        {
          value: 6,
          label: '6位'
        },
        {
          value: 7,
          label: '7位'
        },
        {
          value: 8,
          label: '8位'
        },
        {
          value: 9,
          label: '9位'
        },
        {
          value: 10,
          label: '10位'
        }
      ]
    }
  },
  methods: {
    blurChange(value, index) {
      // 判断输入的是否符合规定，不符合规定就0.001秒后把它干掉，并提示操作者输入的规定
      if (value) {
        let n =
          value.match(/[A-Z]/gi) === null
            ? null
            : value.match(/[A-Z]/gi).slice(0, 6)
        if (
          (n ? n.join('') : null) !== value ||
          (value.length > 6 && value !== '')
        ) {
          this.$message({
            message: '必须为字母，最多6位，可以为空。',
            type: 'warning'
          })
        }
        setTimeout(() => {
          this.formData[index].OrderPrefix = n ? n.join('') : ''
        }, 1)
      }
    },
    getData() {
      // 请求数据
      this.fullLoading = true
      MERCHANT_API_SETTING_GENERATE_GETS({}).then(res => {
        this.fullLoading = false
        if (res.data.Code === 'CORRECT') {
          this.formData = res.data.Data.Rows
        }
      })
    },
    saveData(e) {
      e.currentTarget.blur()
      // 保存数据
      this.$confirm('是否保存参数设置修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_SETTING_GENERATE_UPDATE({ Items: this.formData }).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
              this.getData()
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  filters: {
    results: (value, row) => {
      // 计算单据编号的应用效果
      let effect = ''
      if (!row.SerialLength) {
        return ''
      }
      let date = new Date()
      effect =
        value +
        (date.getFullYear() + '').slice(2) +
        '0101' +
        '0'.repeat(row.SerialLength - 1) +
        '1'
      return effect
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    modul: 'modulChange'
  }
}
</script>
