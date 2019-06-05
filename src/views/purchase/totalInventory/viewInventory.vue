<template>
  <div>
    <div class="mb">
      <div class="title mb">款式信息</div>
      <tabulation :data="item"></tabulation>
    </div>
    <div>
      <div class="title mb">门店库存</div>
      <el-table :data="tableData" border style="width: 100%">
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
        <el-table-column label="安全库存">
          <template slot-scope="scope">
            {{scope.row.SafeQty1}}~{{scope.row.SafeQty2}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row style="margin: 10px; text-align: left; border: 0;">
      <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import tabulation from '@/components/scrm/tabulation.vue'
import { 
  STOCKING_API_STYLE_BASIC_GET,
  STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST,
} from '@/apis/merchant'
import {
  StyleStockWarehousePositionType,
  StyleBasicTemplateType
} from '@/enums/stocking.js'
import dayjs from 'dayjs'
export default {
  components: {
    tabulation
  },
  data() {
    return {
      id: this.$route.query.id,
      item: [],
      tableData: []
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
    getStore() {
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
                this.tableData = arr
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
                this.tableData = arr
              }
            }
          })
        }
      })
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      return dayjs(data).format('YYYY-MM-DD')
    },
  },
  mounted() {
    this.getData()
    this.getStore()
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
</style>
