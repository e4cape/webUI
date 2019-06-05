<template>
  <el-dialog title="收货入库" :visible="visible" @update:visible="$emit('update:visible', $event)" @open="resetAppropInForm">
    <el-form :model="appropInForm" ref="appropInForm" :rules="appropInFormRules">
      <el-form-item label="入货仓库" required>
        <div class="position">
          <el-form-item prop="WarehouseId2" class="item">
            <el-select v-model="appropInForm.WarehouseId2" @change="getShelfId2List">
              <template v-for="(item, index) in $store.getters.wareHouses">
                <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShelfId2" class="item">
            <el-select v-model="appropInForm.ShelfId2">
              <el-option v-for="(item, index) in shelfId2List" :key="index" :value="item.Id" :label="item.Value"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleIntake($event)" :loading="$store.getters.is_loading">确定</el-button>
      <el-button type="default" @click="$emit('update:visible', false)">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return
      }
    }
  },
  data() {
    return {
      YNStatus,
      appropInForm: {
        WarehouseId2: '',
        ShelfId2: '',
      },
      appropInFormRules: {
        WarehouseId2: [
          {
            required: true,
            message: '请选择入库仓库',
            trigger: 'change'
          }
        ],
        ShelfId2: [
          {
            required: true,
            message: '请选择入库仓库',
            trigger: 'change'
          }
        ]
      },
      shelfId2List: [],
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$store.dispatch('GET_WAREHOUSES_DROPLIST',  {HasShelf: YNStatus.Yes, State: YNStatus.Yes})
      }
    }
  },
  methods: {
    resetAppropInForm() {
      if (this.$refs['appropInForm']) {
        this.$refs['appropInForm'].resetFields()
      }
    },
    handleIntake($event) {
      // 操作入库仓库弹窗
      this.$refs['appropInForm'].validate(valid => {
        if (valid) {
          if (this.data.WarehouseId1 === this.appropInForm.WarehouseId2 && this.data.ShelfId1 === this.appropInForm.ShelfId2) {
            this.$message.warning('收货位置和发货位置不能相同')
            return false
          }
          this.$store.commit('SET_BTN_LOADING', true)
          $event.currentTarget.blur()
          this.$emit('appropInReceived', this.appropInForm)
        }
      })
    },
    getShelfId2List(val) {
      // 入库位置货架下拉
      this.shelfId2List = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      this.appropInForm.ShelfId2 =
        this.shelfId2List.length === 1 ? this.shelfId2List[0].Id : ''
    },
  }
}
</script>
<style lang="scss" scoped>
.position {
  display: flex;
  .item {
    margin-bottom: 0 !important;
    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>
