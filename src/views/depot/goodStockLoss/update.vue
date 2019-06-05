<template>
  <div>
    <el-dialog title="修改" :visible="visible" @update:visible="$emit('update:visible', $event)">
      <el-form :model="data" label-position="right" label-width="100px" ref="data">
        <el-form-item label="报损位置" v-if="characterType === CharacterType.Company">
          <el-row>
            <el-col :span="5">
              <el-form-item prop="WarehouseId" class="m-r-10">
                <el-select v-model="data.WarehouseName" disabled>
                  <template v-for="(item, index) in $store.getters.wareHouses">
                    <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="ShelfId">
                <el-select v-model="data.ShelfName" disabled>
                  <!-- <el-option v-for="(item, index) in shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="报损位置" prop="DeskId" v-else>
          <el-select v-model="data.DeskName" disabled>
            <!-- <template v-for="(item, index) in desks">
              <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template> -->
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input type="textarea" :rows="3" v-model="data.Note" :maxlength="200" name="note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update" :loading="$store.getters.is_loading" name="btnUpdate">确 定</el-button>
        <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { YNStatus, CharacterType } from '@/enums/common.js'
import { STOCKING_API_GOODS_COUNT_REPORT_BASIC_UPDATE } from '@/apis/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      defaul: {}
    }
  },
  data() {
    
    return {
      CharacterType,
      YNStatus
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    update() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODS_COUNT_REPORT_BASIC_UPDATE(this.data).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenEditDialog')
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
}
</script>

