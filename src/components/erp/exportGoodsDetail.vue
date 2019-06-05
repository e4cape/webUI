<template>
  <base-export-field-setter
    @submit="$emit('submit', $event)"
    title="导出"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :items="goodsExportColumn"
    :props="{key: 'FieldEnName', label: 'FieldCnName'}"
  />
</template>
<script>
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import { STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS } from '@/apis/stocking.js'
import { SettingCustomizedFieldOrderType, SettingCustomizedFieldLargeType, SettingCustomizedFieldSmallType, SettingCustomizedFieldType } from '@/enums/stocking.js'
import { EnableState, YNStatus } from '@/enums/common.js'
export default {
  components: {
    baseExportFieldSetter
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default: () => {
        return {
          OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
          LargeType: SettingCustomizedFieldLargeType.Goods,
          SmallType: SettingCustomizedFieldSmallType.Basic,
          KindTypeEk: 1,
        }
      }
    }
  },
  data() {
    return {
      goodsExportColumn: [],
    }
  },
  mounted() {
    this.getGoodsExportColumn()
  },
  methods: {
    getGoodsExportColumn() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(this.option).then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data.Rows || []
          this.goodsExportColumn = []
          data.forEach(item => {
            if (item.IsEnable === EnableState.Enable && item.IsPrivate === YNStatus.No) {
              let name = ''
              if (item.FieldType === SettingCustomizedFieldType.SelectOfEnums) {
                if (item.FieldEnName.slice(-2) === 'Ek') {
                  name = item.FieldEnName.replace('Ek', 'Ev')
                } else {
                  name   = item.FieldEnName + 'Name'
                }
              } else {
                name = item.FieldEnName
              }
              this.goodsExportColumn.push({
                FieldCnName: item.FieldCnName,
                FieldEnName: name,
                Precision: item.Precision,
              })
              
            }
          })
        }
      })
    },
  }
}
</script>

