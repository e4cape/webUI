<template>
  <!-- @module Dialog·修改成品采购入库单 -->
  <el-dialog title="修改采购入库单" :visible.sync="visible">
    <el-form label-position="right" label-width="100px" :model="editForm" :rules="rules" ref="editForm">
      <el-input type="hidden" v-model="editForm.PurchaseId" name="purchaseId"></el-input>
      <el-form-item label="供应商：" prop="SupplierId">
        <el-select v-model="editForm.SupplierId" placeholder="请选择" :filterable="true" name="supplierId">
          <el-option v-for="(item, index) in $store.getters.suppliers" :key="index" :label="item.SupplierName" :value="item.SupplierId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货品类别：" required>
        <el-radio-group v-model="editForm.FinanceType" name="financeType">
          <el-radio :label="financeTypes.Self">自营</el-radio>
          <el-radio :label="financeTypes.Take">代销</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="采购员：" prop="PurchaseUserId">
        <el-select v-model="editForm.PurchaseUserId" placeholder="请选择" :filterable="true" name="purchaseUserId" >
          <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="送货单号：">
        <el-input v-model="editForm.ArrivalCode" :maxlength="50" name="arrivalCode"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" style="width: 300px" v-model="editForm.Note" :maxlength="200" name="note"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editPurchase" :loading="$store.getters.is_loading" name="btnEditPurchase">确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·修改成品采购入库单 -->
</template>

<script>
import {
  FinanceType,
  SecurityUserState 
} from '@/enums/stocking.js'
import {
  STOCKING_API_PURCHASE_ORDERUPDATE 
} from '@/apis/stocking.js'

export default {
  props: {
    editForm: {
      type: Object,
    },
    editDialog: {
      type: Boolean
    }
  },
  data () {
    return {
      financeTypes: FinanceType,
      securityUserStates: SecurityUserState,
      rules: {
        SupplierId: [
          {
            type: 'number', required: true, message: '请选择供应商', trigger: 'change'
          }
        ],
        PurchaseUserId: [
          {
            type: 'number', required: true, message: '请选择采购员', trigger: 'change'
          }
        ]
      },
      visible: this.editDialog,
      success: false
    }
  },
  methods: {
    getUserList () {
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    getSupplier () {
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    },
    getSupplierName (supplierId) {
      let name = ''
      this.$store.getters.suppliers.forEach((item) => {
        if (item.SupplierId === supplierId) {
          name = item.SupplierName
          return false
        }
      })
      return name
    },
    getUserListName (userid) {
      let name = ''
      this.$store.getters.users.forEach((item) => {
        if (item.UserId === userid) {
          name = item.TrueName
          return false
        }
      })
      return name
    },
    editPurchase () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_PURCHASE_ORDERUPDATE(Object.assign(this.editForm, {
            SupplierName: this.getSupplierName(this.editForm.SupplierId),
            PurchaseUser: this.getUserListName(this.editForm.PurchaseUserId)
          })).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.success = true
              this.visible = false
            } else {
              this.$message.error('修改失败')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    }
  },
  created () {
    this.getUserList()
    this.getSupplier()
  },
  watch: {
    visible () {
      this.$emit('listenEditDialog', this.editForm, this.success)
    }
  }
}
</script>
