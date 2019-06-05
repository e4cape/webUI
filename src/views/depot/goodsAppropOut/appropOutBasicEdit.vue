<template>
  <div>
    <!-- @module Dialog·修改调拨出库单 -->
    <el-dialog title="修改调拨出库单" :visible="visible" @update:visible="$emit('update:visible', $event)">
      <el-form label-position="right" label-width="100px" :model="editParam" :rules="editRules" ref="editParam">
        <el-form-item label="发货位置" required v-if="characterType === CharacterType.Company">
          <div class="position">
            <el-form-item class="item">
              <el-select v-model="data.WarehouseName1" disabled>
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item class="item">
              <el-select v-model="data.ShelfName1" disabled>
                <!-- <el-option v-for="(item, index) in shelfId1List" :key="index" :value="item.Id" :label="item.Value"></el-option> -->
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="调拨原因" prop="ReasonTypeDk">
          <el-select v-model="editParam.ReasonTypeDk" @change="handleReasonType" placeholder="请选择" name="ReasonTypeDk">
            <el-option v-for="(item, index) in appropOutReasons" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item required v-if="characterType === CharacterType.Company" label="收货单位" key="inTakeArr">
          <div class="position">
            <el-form-item class="item">
              <el-select v-model="data.WarehouseName2" :placeholder="data.WarehouseName2 || data.StoreName2" disabled>
                <!-- <el-option v-for="(item, index) in inTakePosition" :key="index" :value="item.Id" :label="item.Value"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item class="item" v-if="data.ShelfName2">
              <el-select v-model="data.ShelfName2" disabled>
                <!-- <el-option v-for="(item, index) in shelfId2List" :key="index" :value="item.Id" :label="item.Value"></el-option> -->
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item v-else label="收货单位" key="StorechterId2">
          <el-select v-model="data.StoreName2" disabled :placeholder="data.StoreName2||data.UnitedName2">
            <el-option :value="0" label="总部仓库"></el-option>
            <template v-for="(item, index) in $store.getters.stores">
              <el-option v-if="item.State === YNStatus.Yes && item.Id !== 0 && item.CharacterId !== $store.getters.user_session.CharacterId" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="收货方式" prop="ShippingType">
          <el-radio-group v-model="editParam.ShippingType" name="ShippingType">
            <el-radio v-for="(item,index) in ShippingType.Types" :key="index" :label="parseInt(index)">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="业务日期" prop="ActualDate">
          <el-date-picker v-model="editParam.ActualDate" :picker-options="$store.getters.businessDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-select v-model="editParam.ExpressType" clearable name="ExpressType">
            <el-option v-for="(item, index) in ExpressType.Types" :key="index" :label="item" :value="index*1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="editParam.ExpressCode" :maxlength="50" name="ExpressCode"></el-input>
        </el-form-item>
        <el-form-item label="发货人">
          <el-input v-model="editParam.SendUser" :maxlength="50" name="SendUser"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话">
          <el-input v-model="editParam.SendPhone" :maxlength="11" name="SendPhone"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="editParam.ReceiptUser" :maxlength="50" name="ReceiptUser"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="editParam.ReceiptPhone" :maxlength="11" name="ReceiptPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注">
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
    <dict-manage :visible.sync="reasonDialog" :dicts="appropOutReasons" dialogTitle="调拨出库原因" :dictType="SettingDictionaryDictType.GoodsAllotOrderOutakeReasonType" @listenDictSave="getappropOutReason"></dict-manage>
    <!-- End Dialog·新建调拨原因  -->
  </div>
</template>
<script>
import {
  CharacterType,
  ShippingType,
  ExpressType,
  YNStatus
} from '@/enums/common.js'
import { SettingDictionaryDictType } from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import { STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_UPDATE } from '@/apis/stocking.js'

import dictManage from '@/components/erp/dictManage'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      YNStatus,
      CharacterType,
      ShippingType,
      ExpressType,
      SettingDictionaryDictType,
      appropOutReasons: [], // 调拨出库原因
      reasonDialog: false,
      editParam: {
        OutakeId: '',
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        ShippingType: ShippingType.PickedUp,
        ExpressType: '',
        ExpressCode: '',
        SendUser: '',
        SendPhone: '',
        ReceiptUser: '',
        ReceiptPhone: '',
        ActualDate: '',
        Note: ''
      },
      editRules: {
        ReasonTypeDk: [
          {
            required: true,
            message: '请选择调拨原因',
            trigger: 'change'
          }
        ],
        
        StorechterId2: [
          {
            required: true,
            message: '请选择收货单位',
            trigger: 'change'
          }
        ],
        ShippingType: [
          {
            required: true,
            message: '请选择收货方式',
            trigger: 'change'
          }
        ],
        ActualDate: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  components: {
    dictManage
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init()
      }
    }
  },
  created() {
    this.getappropOutReason()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  methods: {
    init() {
      this.editParam.OutakeId = this.data.OutakeId
      this.editParam.ReasonTypeDk = this.data.ReasonTypeDk || ''
      this.editParam.ReasonTypeDv = this.data.ReasonTypeDv || ''
      this.editParam.ShippingType = this.data.ShippingType || ''
      this.editParam.ExpressType = this.data.ExpressType || ''
      this.editParam.ExpressCode = this.data.ExpressCode
      this.editParam.SendUser = this.data.SendUser
      this.editParam.SendPhone = this.data.SendPhone
      this.editParam.ReceiptUser = this.data.ReceiptUser
      this.editParam.ReceiptPhone = this.data.ReceiptPhone
      this.editParam.ActualDate = this.data.ActualDate
      this.editParam.Note = this.data.Note
    },
    getappropOutReason() {
      // 获取调拨出库原因下拉
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.GoodsAllotOrderOutakeReasonType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.appropOutReasons = res.data.Data.Rows || []
          if (!this.appropOutReasons.some(item => item.Id === this.editParam.ReasonTypeDk)) {
            this.editParam.ReasonTypeDk = ''
            this.editParam.ReasonTypeDv = ''
          }
        }
      })
    },
    handleReasonType(val) {
      // 获取调拨原因name
      this.editParam.ReasonTypeDv = this.appropOutReasons.find(
        item => item.Id == val
      ).Value
    },
    editappropOut() {
      this.$refs['editParam'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          this.editParam.ExpressType = this.editParam.ExpressType || 0
          STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_UPDATE(this.editParam).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: res.data.Message,
                  type: 'success'
                })
                this.$emit('update:visible', false)
                this.$emit('listenEditDialog')
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        }
      })
    }
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

