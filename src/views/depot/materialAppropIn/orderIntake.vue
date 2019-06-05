<template>
  <el-dialog :visible="visible" @update:visible="$emit('update:visible', $event)" title="收货入库" @close="$refs.form.resetFields()">
    <el-form ref="form" :model="orderIntakeForm" :rules="rules" inline>
      <el-form-item prop="WarehouseId2" label="入库位置：">
        <el-select v-model="orderIntakeForm.WarehouseId2" @change="getshelfIdList">
          <template v-for="(item, index) in $store.getters.wareHouses">
            <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="ShelfId2">
        <el-select v-model="orderIntakeForm.ShelfId2">
          <el-option v-for="(item, index) in shelfIdList" :key="index" :value="item.Id" :label="item.Value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="orderIntakeAudit" :loading="$store.getters.is_loading" name="btnOrderIntakeAudit">确 定</el-button>
      <el-button @click="$emit('update:visible',false)" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_AUDITS,
  STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_AUDIT
} from '@/apis/stocking.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    data: Array
  },
  data() {
    return {
      YNStatus,
      shelfIdList: [],
      orderIntakeForm: {
        WarehouseId2: '',
        ShelfId2: '',
        Items: []
      },
      rules: {
        WarehouseId2: [{ required: true, message: '请选择仓库' }],
        ShelfId2: [{ required: true, message: '请选择货架' }]
      }
    }
  },
  created() {
    this.$store.dispatch('GET_WAREHOUSES_DROPLIST',  {HasShelf: YNStatus.Yes, State: YNStatus.Yes})
  },
  methods: {
    getshelfIdList(val) {
      this.shelfIdList = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      if (this.shelfIdList.length === 1) {
        this.orderIntakeForm.ShelfId2 = this.shelfIdList[0].Id
      } else {
        this.orderIntakeForm.ShelfId2 = ''
      }
    },
    orderIntakeAudit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let result
         
          if (this.data.length > 1) {
            this.orderIntakeForm.Items = this.data.map(item => {
              return {
                IntakeId: item.IntakeId,
                WarehouseId2: this.orderIntakeForm.WarehouseId2,
                ShelfId2: this.orderIntakeForm.ShelfId2
              }
            })
            result = STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_AUDITS(
              this.orderIntakeForm
            )
          } else {
            if (this.data[0].WarehouseId1 === this.orderIntakeForm.WarehouseId2 && this.data[0].ShelfId1 === this.orderIntakeForm.ShelfId2) {
              this.$message.warning('收货位置和发货位置不能相同')
              return false
            }
            this.$store.commit('SET_BTN_LOADING', true)
            result = STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_AUDIT({
              IntakeId: this.data[0].IntakeId,
              WarehouseId2: this.orderIntakeForm.WarehouseId2,
              ShelfId2: this.orderIntakeForm.ShelfId2
            })
          }
          result.then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.$emit('update:visible', false)
              this.$emit('listenOrderIntakeVisible')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    }
  }
}
</script>

