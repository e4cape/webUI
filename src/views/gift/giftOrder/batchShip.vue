<template>
  <div class="content">
    <div class="panel-tag">
      <span>批量发货</span>
      <el-button
				name="btnBack"
        @click="$router.back()"
        class="el-back"
        type="text"
      >返回</el-button>
    </div>
    <div style="padding-top: 10px">
      <el-checkbox
				name="checked"
        v-model="checked"
        style="margin-left: 10px"
      >合并相同的收货人</el-checkbox>
    </div>
    <el-form
      ref="batchShip"
      :model="batchShip"
      :rules="rules"
    >
      <el-table
        :data="batchShip.data"
        :span-method="objectSpanMethod"
        class="table m-t-10"
      >
        <el-table-column
          prop="orderCode"
          label="订单编号"
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="receiveName"
          label="收货人姓名"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="receiveMobile"
          label="收货人手机"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="receiveArea"
          label="收货地区"
          min-width="140"
        ></el-table-column>
        <el-table-column
          label="*快递公司"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'data.' + scope.$index + '.expressType'"
              :rules="rules.expressType"
            >
              <el-select
								name="expressType"
                filterable
                v-model="scope.row.expressType"
                placeholder="请选择"
              >
                <el-option
                  label="同上"
                  :value="-1"
                  v-if="scope.$index !== 0"
                ></el-option>
                <el-option
                  v-for="item in expressTypes.Types"
                  :key="item.key"
                  :label="item.title"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="expressCode"
          label="*快递单号"
          min-width="140"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'data.' + scope.$index + '.expressCode'"
              :rules="rules.expressCode"
            >
              <el-input
								name="expressCode"
                v-model="scope.row.expressCode"
                placeholder="20个英文字符以内"
                :maxlength="20"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="expressNote"
          label="发货备注(50字以内)"
          min-width="180"
        >
          <template slot-scope="scope">
            <el-form-item prop="expressNote">
              <el-input
								name="expressNote"
                type="textarea"
                autosize
                v-model="scope.row.expressNote"
                :maxlength="50"
                placeholder="50字以内"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row style="margin: 20px; margin-left: 33px; text-align: left; border: 0;">
      <el-button
				name="btnDelivery"
        type="primary"
        @click="delivery('batchShip')"
      >确定发货</el-button>
      <el-button name="btnBack" @click="$router.back()">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import {
  ExpressTypes 
} from '@/enums/gifting'
import {
  GIFTING_API_GIFTSALEORDERFORC_BATCHDELIVERY,
  GIFTING_API_GIFTSALEORDERFORC_GETORDERSFORBATCHDELIVERY
} from '@/apis/gifting'
export default {
  data() {
    var checkExpressCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入快递单号'))
      }
      if (/^[a-zA-Z0-9]{1,20}$/.test(value)) {
        callback()
      } else {
        callback(new Error('格式错误'))
      }
    }
    return {
      expressTypes: ExpressTypes,
      checked: true,
      orderIds: [],
      batchShip: {
        data: []
      },
      spanArr: [], // 每一行记录的合并数
      pos: 0, // spanArr的索引
      addForm: {
      },
      rules: {
        expressType: [
          {
            required: true, message: '请选择快递公司', trigger: 'change' 
          }
        ],
        expressCode: [
          {
            required: true, validator: checkExpressCode, trigger: 'change' 
          }
        ]
      }
    }
  },
  methods: {
    objectSpanMethod({
      row, column, rowIndex, columnIndex 
    }) {
      if (this.checked && columnIndex > 0 && this.batchShip.data.length > 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        if (_row === 1) {
        }
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getSpanArr() {
      for (var i = 0; i < this.batchShip.data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (
            this.batchShip.data[i].receiveName ==
              this.batchShip.data[i - 1].receiveName &&
            this.batchShip.data[i].receiveMobile ==
              this.batchShip.data[i - 1].receiveMobile &&
            this.batchShip.data[i].receiveArea ==
              this.batchShip.data[i - 1].receiveArea
          ) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    getData() {
      this.batchShip.data.forEach((item, index) => {
        if (index !== 0) {
          item.expressType = ''
        }
      })
      GIFTING_API_GIFTSALEORDERFORC_GETORDERSFORBATCHDELIVERY({
        orderIds: this.orderIds
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.forEach((item, index) => {
            if (index !== 0) {
              item.expressType = -1
            }
          })
          this.batchShip.data = res.data.Data
          this.getSpanArr()
        }
      })
    },
    delivery(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.batchShip.data)
          this.formatData()
          GIFTING_API_GIFTSALEORDERFORC_BATCHDELIVERY({
            deliveryOrders: this.batchShip.data
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('发货成功')
              this.$router.push('/gift/giftOrder/index')
            }
          })
        } else {
          return false
        }
      })
    },
    formatData() {
      for (let i = 0; i < this.batchShip.data.length; i++) {
        if (this.checked) {
          if (
            i !== 0 &&
            this.batchShip.data[i].receiveName ===
              this.batchShip.data[i - 1].receiveName
          ) {
            this.batchShip.data[i].expressCode = this.batchShip.data[
              i - 1
            ].expressCode
            this.batchShip.data[i].expressNote = this.batchShip.data[
              i - 1
            ].expressNote
            this.batchShip.data[i].expressType = this.batchShip.data[
              i - 1
            ].expressType
          }
        }
        if (this.batchShip.data[i].expressType == -1) {
          this.batchShip.data[i].expressType = this.batchShip.data[
            i - 1
          ].expressType
        }
      }
    }
  },
  mounted() {
    this.orderIds = JSON.parse(this.$route.query.orderIds) || []
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.el-back {
  position: absolute;
  right: 25px;
  z-index: 10;
}
</style>