<template>
  <div>
    <!-- @module Dialog·修改调拨出库单 -->
    <el-dialog title="修改原料调拨出库单" :visible="visible" @update:visible="$emit('update:visible', $event)">
      <el-form label-position="right" label-width="100px" :model="editParam" :rules="editRules" ref="editParam" v-loading="loading">
        <el-form-item label="发货位置" required>
          <div class="position">
            <el-form-item class="item">
              <el-select v-model="editForm.WarehouseName1" disabled>
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item class="item">
              <el-select v-model="editForm.ShelfName1" disabled>
                <!-- <el-option v-for="(item, index) in shelfId1List" :key="index" :value="item.Id" :label="item.Value"></el-option> -->
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="收货位置" required>
          <div class="position">
            <el-form-item class="item">
              <el-select v-model="editForm.WarehouseName2" disabled>
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item class="item">
              <el-select v-model="editForm.ShelfName2" disabled="">
                <!-- <el-option v-for="(item, index) in shelfId2List" :key="index" :value="item.Id" :label="item.Value"></el-option> -->
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="调拨原因" prop="ReasonTypeDk">
          <el-select v-model="editParam.ReasonTypeDk" @change="getReasonTypeDv" name="ReasonTypeDk">
            <el-option v-for="(item, index) in appropOutReasons" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="业务日期" prop="ActualDate">
          <el-date-picker v-model="editParam.ActualDate" :picker-options="$store.getters.businessDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="Note">
          <el-input type="textarea" v-model="editParam.Note" :maxlength="200" name="Note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editappropOut" :loading="$store.getters.is_loading" name="btnCreateappropOut">确 定</el-button>
        <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·修改调拨出库单 -->

    <!-- @module Dialog·新建调拨原因 -->
    <dict-manage
      :visible.sync="reasonDialog"
      :dicts="appropOutReasons"
      dialogTitle="原料调拨出库原因类型"
      :dictType="SettingDictionaryDictType.HalfAllotOrderOutakeReasonType"
      @listenDictSave="getAppropOutReason"
    ></dict-manage>
    <!-- End Dialog·新建调拨原因  -->
  </div>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import { SettingDictionaryDictType } from '@/enums/stocking.js'
import { STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_UPDATE } from '@/apis/stocking.js'

import dictManage from '@/components/erp/dictManage'

export default {
  props: {
    // ['editDialog', 'editParam']
    visible: {
      type: Boolean,
      default: false
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      YNStatus,
      SettingDictionaryDictType,
      dictType: {},
      editRules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择调拨原因',
            trigger: 'change'
          }
        ],
        ActualDate: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        // WarehouseId1: [
        //   {
        //     type: 'number',
        //     required: true,
        //     message: '请选择发货仓库',
        //     trigger: 'change'
        //   }
        // ],
        // ShelfId1: [
        //   {
        //     type: 'number',
        //     required: true,
        //     message: '请选择发货货架',
        //     trigger: 'change'
        //   }
        // ],
        // WarehouseId2: [
        //   {
        //     type: 'number',
        //     required: true,
        //     message: '请选择收货仓库',
        //     trigger: 'change'
        //   }
        // ],
        // ShelfId2: [
        //   {
        //     type: 'number',
        //     required: true,
        //     message: '请选择收货货架',
        //     trigger: 'change'
        //   }
        // ]
      },
      reasonDialog: false,
      appropOutReasons: [],
      shelfId1List: [],
      shelfId2List: [],
      loading: false,
      editParam: {
        OutakeId: '',
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        Note: '',
        ActualDate: ''
      }
    }
  },
  methods: {
    init() {
      this.editParam.OutakeId = this.editForm.OutakeId
      this.editParam.ReasonTypeDk = this.editForm.ReasonTypeDk
      this.editParam.ReasonTypeDv = this.editForm.ReasonTypeDv
      this.editParam.ActualDate = this.editForm.ActualDate
      this.editParam.Note = this.editForm.Note
    },
    getAppropOutReason() {
      this.loading = true
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfAllotOrderOutakeReasonType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.appropOutReasons = res.data.Data.Rows || []

          if (!this.appropOutReasons.some(item => item.Id === this.editParam.ReasonTypeDk)) {
            this.editParam.ReasonTypeDk = ''
            this.editParam.ReasonTypeDv = ''
          }
        }
        this.loading = false
      })
    },

    getReasonTypeDv(val) {
      // 获取原因类型名称
      this.editParam.ReasonTypeDv = this.appropOutReasons.find(item => item.Id === val).Value
    },
    editappropOut() {
      this.$refs['editParam'].validate(valid => {
        if (valid) {
          this.getReasonTypeDv(this.editParam.ReasonTypeDk)
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_UPDATE(this.editParam).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$emit('update:visible', false)
                this.$emit('listenEditDialog')
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        } else {
          this.$message.error('请完善信息！')
        }
      })
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_SETTLE_DATE')
    this.getAppropOutReason()
  },
  watch: {
    visible(val) {
      if (val) {
        this.init()
      }
    }
  },
  components: {
    dictManage
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
