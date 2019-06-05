<template>
  <div>
    <div class="mb">
      <div class="title mb">查看款式</div>
      <tabulation :data="item"></tabulation>
    </div>
    <div class="mb" v-if="$store.getters.user_session.CharacterType === characterType.Company">
      <div class="title mb">关联供应商</div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column  prop="PartnerName" label="供应商名称">
        </el-table-column>
        <el-table-column  prop="LastStyleCode" label="供应商款号">
        </el-table-column>
        <el-table-column prop="PurchaseType" label="进货方式">
          <template slot-scope="scope">
            {{purchaseType.Types[scope.row.PurchaseType]}}
          </template>
        </el-table-column>
        <el-table-column prop="ReferPrice" label="参考进货价/工费">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.ReferPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="Note" label="备注">
        </el-table-column>
      </el-table>
    </div>
    <div class="mb">
      <div class="title mb">图文详情</div>
      <p style="word-wrap:break-word" v-html="basicData.Note"></p>
    </div>
    <div>
      <el-button type="default" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import tabulation from '@/components/scrm/tabulation.vue'
import { PurchaseType } from '@/enums/common.js'
import {
  STOCKING_API_STYLE_BASIC_GET,
  STOCKING_API_STYLE_PARTNER_GETS
} from '@/apis/stocking.js'
import {
  StyleBasicTemplateType
} from '@/enums/stocking.js'
import { CharacterType } from '@/enums/common'
import dayjs from 'dayjs'
export default {
  components: {
    tabulation
  },
  data() {
    return {
      basicData: {
      },
      characterType: CharacterType,
      item: [],
      tableData: [],
      styleId: this.$route.query.StyleId,
      purchaseType: PurchaseType, // 进货方式
      templateType: StyleBasicTemplateType, // 模版来源
    }
  },
  methods: {
    getData() {
      STOCKING_API_STYLE_BASIC_GET({
        StyleId: this.styleId 
      }).then(res => {
        if(res.data.Code == 'CORRECT') {
          const arrayImageUrls = res.data.Data.ImageUrls != '' ? res.data.Data.ImageUrls.split(',') : []
          const data = res.data.Data
          this.basicData = res.data.Data
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
                content: this.templateType.Types[data.TemplateType],
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
    getSupplier() {
      STOCKING_API_STYLE_PARTNER_GETS({
        StyleId: this.styleId 
      }).then(res => {
        if(res.data.Code == 'CORRECT') {
          this.tableData =  res.data.Data
        }
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
    this.getSupplier()
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
