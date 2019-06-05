<template>
  <div>
    <div class="mb">
      <div class="title mb">款式信息</div>
      <tabulation :data="item"></tabulation>
    </div>
    <div>
      <div class="title mb">门店库存</div>
      <el-form :rules="model.rules" :model="model" ref="form">
        <el-table :data="model.tableData" border style="width: 100%">
          <el-table-column  prop="StoreCode" label="门店编码">
          </el-table-column>
          <el-table-column  prop="StoreName" label="门店名称">
          </el-table-column>
          <el-table-column prop="AvailableQty" label="可用库存">
          </el-table-column>
          <el-table-column prop="FinanceQty" label="账面库存">
          </el-table-column>
          <el-table-column prop="OutwaitQty" label="待出库存">
          </el-table-column>
          <el-table-column prop="AllotQty" label="调拨在途">
          </el-table-column>
          <el-table-column label="安全库存" width="210">
            <template slot-scope="scope">
              <el-row :gutter="20">
                <el-col :span="9">
                  <el-form-item :prop="'tableData.' + scope.$index + '.SafeQty1'" style="margin-bottom: 0px;">
                    <el-input class="inputNumber" name="SafeQty1" v-model.number="scope.row.SafeQty1" :maxlength="9"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <span class="inputSpan">~</span>
                </el-col>
                <el-col :span="9">
                  <el-form-item :prop="'tableData.' + scope.$index + '.SafeQty2'" style="margin-bottom: 0px;">
                    <el-input class="inputNumber" name="SafeQty2"  v-model.number="scope.row.SafeQty2" :maxlength="9"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="save">
      <el-button name="onSave" @click="onSave" type="primary" icon="fa fa-plus" :loading="saveLoading">保存</el-button>
      <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
      <span class="end-right">注：请根据门店销量及采购周期设置安全库存，建议最低库存设置为日均销量，最高库存设置为日均销量×采购周期</span>
    </div>
  </div>
</template>

<script>
import tabulation from '@/components/scrm/tabulation.vue'
import { 
  STOCKING_API_STYLE_BASIC_GET,
  STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS,
  STOCKING_API_STYLE_STOCK_WAREHOUSE_SET
} from '@/apis/stocking.js'
import {
  StyleStockWarehousePositionType,
  StyleBasicTemplateType
} from '@/enums/stocking.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST,
} from '@/apis/merchant'
// import {
//   StoreBasicState
// } from '@/enums/merchant'
import dayjs from 'dayjs'
export default {
  components: {
    tabulation
  },
  data() {
    const SafeQty1 = (r,v,callback) => {
      if (
        v &&
        !/^(\d+|\d+.?\d+)$/.test(v) &&
        parseInt(v) !== 0
      ) {
        callback(new Error('请输入非负数字'))
      } else if(parseInt(v) === 0) {
        callback(new Error('起始值不能为0'))
      } else if (!/^\d+$/.test(v)) {
        callback(new Error('请输入正整数'))
      } else if (
        this.setSafetyData.SafeQty2 !== '' &&
        parseFloat(v) > parseFloat(this.setSafetyData.SafeQty2)
      ) {
        callback(new Error('起始值不能大于结束值'))
      }
      callback()
    }
    const SafeQty2 = (r,v,callback) => {
      if (
        v &&
        !/^(\d+|\d+.?\d+)$/.test(v) &&
        parseInt(v) !== 0
      ) {
        callback(new Error('请输入非负数字'))
      } else if(parseInt(v) === 0) {
        callback(new Error('结束值不能为0'))
      } else if (v && !/^\d+$/.test(v)) {
        callback(new Error('请输入正整数'))
      } else if (
        this.setSafetyData.SafeQty1 &&
        parseFloat(v) < parseFloat(this.setSafetyData.SafeQty1)
      ) {
        callback(new Error('结束值不能小于起始值'))
      }
      callback()
    }
    return {
      id: this.$route.query.id,
      item: [],
      model: {
        tableData: [],
        rules: {
          SafeQty1: [
            {
              validator: SafeQty1
            },
          ],
          SafeQty2: [
            {
              validator: SafeQty2
            },
          ],
        }
      },
      enableSubmit: true, // 控制请求一个一个提交
      saveLoading: false,
    }
  },
  methods: {
    getData() {
      STOCKING_API_STYLE_BASIC_GET({
        StyleId: this.id 
      }).then(res => {
        if(res.data.Code == 'CORRECT') {
          const data = res.data.Data
          this.basicData = res.data.Data
          const arrayImageUrls = res.data.Data.ImageUrls != '' ? data.ImageUrls.split(',') : []
          this.item = [
            [
              {
                title: '款号',
                content: data.StyleCode,
              },
              {
                title: '款式名称',
                content: data.StyleName,
              },
              {
                title: '种类',
                content: data.KindTypeEv,
              }
            ],
            [
              {
                title: '品类',
                content: data.CategoryTypeEv,
              },
              {
                title: '新款日期',
                content: this.schemeDate(data.UpperTime),
              },
              {
                title: '模版来源',
                content: StyleBasicTemplateType.Types[data.TemplateType],
              }
            ],
            [
              {
                title: '金重(g)',
                content: data.GoldWeights,
              },
              {
                title: '主石重(ct)',
                content: data.StoneWeights,
              },
              {
                title: '主石颜色',
                content: data.StoneColors,
              }
            ],
            [
              {
                title: '主石净度',
                content: data.StoneClaritys,
              },
              {
                title: '尺寸',
                content: data.Sizes,
              },
              {
                title: '',
                content: '',
              }
            ],
            [
              {
                title: '图片',
                content: arrayImageUrls,
                colspan: 5,
                type: 'image',
                dataType: 'array'
              }
            ],
            [
              {
                title: '描述',
                content: data.Description,
                colspan: 5
              }
            ]
          ]
        }
      })
    },
    getAllStore() {
      MERCHANT_API_DROPDOWN_STORELIST({State: 0}).then(req => {
        if(req.data.Code === 'CORRECT' && req.data.Data.Count) {
          STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS({
            StyleId: this.id,
            PositionType: StyleStockWarehousePositionType.Store,
            PageSize	: 10000,
            PageIndex: 1
          }).then(res => {
            if(res.data.Code == 'CORRECT') {
              // 
              if(res.data.Data.Count) {
                const storeList = req.data.Data.Rows
                const styleStock = res.data.Data.Rows
                const arr = []
                for(let i = 0; i < storeList.length; i++) {
                  const obj = {
                    ...storeList[i],
                    StoreCode: storeList[i].StoreCode,
                    StoreName: storeList[i].Value,
                    AvailableQty: 0,
                    FinanceQty: 0,
                    OutwaitQty: 0,
                    AllotQty: 0,
                    SafeQty1: 0,
                    SafeQty2: 0,
                  }
                  for(let o = 0; o < styleStock.length; o++) {
                    if(storeList[i].CharacterId === styleStock[o].StorechterId) {
                      obj.AvailableQty = styleStock[o].AvailableQty
                      obj.FinanceQty = styleStock[o].FinanceQty
                      obj.OutwaitQty = styleStock[o].OutwaitQty
                      obj.AllotQty = styleStock[o].AllotQty
                      obj.SafeQty1 = styleStock[o].SafeQty1
                      obj.SafeQty2 = styleStock[o].SafeQty2
                    }
                  }
                  arr.push(obj)
                }
                this.model.tableData = arr
              } else {
                const arr = req.data.Data.Rows.map(item => {
                  return {
                    ...item,
                    StoreCode: item.StoreCode,
                    StoreName: item.Value,
                    AvailableQty: 0,
                    FinanceQty: 0,
                    OutwaitQty: 0,
                    AllotQty: 0,
                    SafeQty1: 0,
                    SafeQty2: 0,
                  }
                })
                this.model.tableData = arr
              }
            }
          })
        }
      })
    },
    getStore() {
      
    },
    onSave() {
      for(let i = 0; i < this.model.tableData.length; i++) {
        if(parseInt(this.model.tableData[i].SafeQty1) < 0 || parseInt(this.model.tableData[i].SafeQty2) < 0) {
          return this.$message.error('安全库存不能小于0')
        } else if (!/^\d+$/.test(this.model.tableData[i].SafeQty1) || !/^\d+$/.test(this.model.tableData[i].SafeQty2)) {
          return this.$message.error('安全库存只能为正整数')
        } else if (
          this.model.tableData[i].SafeQty2 !== '' &&
          parseFloat(this.model.tableData[i].SafeQty1) > parseFloat(this.model.tableData[i].SafeQty2)
        ) {
          return this.$message.error('起始值不能大于结束值')
        }
      }
      const para = {
        StyleId: Number(this.id),
        Items: []
      }
      para.Items = this.model.tableData.map((item) => {
        const obj = {
          SafeQty1: item.SafeQty1,
          SafeQty2: item.SafeQty2,
          StorechterId: item.CharacterId
        }
        return obj
      })
      this.saveLoading = true
      STOCKING_API_STYLE_STOCK_WAREHOUSE_SET(para).then(res => {
        if(res.data.Code === 'CORRECT') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.back(-1)
        }
        this.saveLoading = false
      })
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  mounted() {
    this.getData()
    this.getStore()
    this.getAllStore()
  }
}
</script>

<style lang="scss" scoped>
.mb {
  margin-bottom: 15px
}
.title {
  font-size: 14px;
  padding: 10px 15px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  color: #777777;
  font-weight: 600;
  background: #f5f5f5;
}
.inputNumber {
  display: inline-block;
  width: 80px;
}
.inputSpan {
  display: inline-block;
  width: 20px;
  text-align: center;
}
.save {
  margin-top: 20px;
  span {
    color: #999;
  }
}
.end-right {
  color: #999;
  float: right;
}
</style>
