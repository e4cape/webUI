<template>
  <div class="content">
    <div class="m-b-10">
      <el-button @click="numVisible = true">设置分数段</el-button>
      <el-button @click="colorVisible = true">设置颜色与净度</el-button>
    </div>
    <!-- @module 数据表格 -->
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="name" label="分数名称" min-width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="ct" label="分数段（ct）" min-width="120" show-overflow-tooltip fixed></el-table-column>
      <template v-for="(item, index) in columns">
        <el-table-column v-if="item.StoneClaritys && item.StoneClaritys.length && item.StoneClaritys[0]" :key="index" :label="StoneColor.Types[item.StoneColor]">
          <template v-for="(value, i) in item.StoneClaritys">
            <el-table-column v-if="value !== 0" :key="i" :label="StoneClarity.Types[value]" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row[`price${item.StoneColor}${value}`]">
                  <el-input
                    v-model="scope.row[`price${item.StoneColor}${value}`].Price"
                    @keyup.native="scope.row[`price${item.StoneColor}${value}`].Price =  scope.row[`price${item.StoneColor}${value}`].Price != 0 ? $root.toFixed(scope.row[`price${item.StoneColor}${value}`].Price, 2) : ''"
                    :maxlength="10"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-button v-if="this.data.length" type="primary" :loading="$store.getters.is_loading" @click="save" class="m-t-10">保存</el-button>
    <!-- End 数据表格 -->
    <el-dialog title="设置分数段" class="details-table-dialog" width="800px" :visible.sync="numVisible" @close="getDiamondFields" @open="toFloatWeight">
      <el-alert :title="`注：名称最多10个字，请输入容易辨识的标签名称，例如：2分以内。`" description="范围为区间值，统计包含最小值和最大值。例如：输入范围0.1~0.2，实际统计≥0.1并且<0.2的数据" :closable="false" type="info"></el-alert>
      <div class="p-t-10"></div>
      <el-form :model="diamondFields" ref="Rows" class="diamond-fields">
        <el-table :data="diamondFields.Rows" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column label="操作" min-width="60" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="handle-btn">
                <i name="addShow" class="icon-add1 handel-icon" @click="addShow(scope)" style="color: #1f91df" title="新增一行"></i>
                <i name="deleteShow" class="icon-reduce1 handel-icon" @click="deleteShow($event, scope)" style="color: #d74040" title="删除此行"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="RowName" label="名称" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item :prop="`Rows[${scope.$index}].RowName`" :rules="[{required: true}]" class="item">
                <el-input v-model="scope.row.RowName" :maxlength="10" @blur="scope.row.RowName=scope.row.RowName.trim()"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="分段数（ct）" min-width="220" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="display:flex;align-item: center">
                <el-form-item :prop="`Rows[${scope.$index}].StoneWeight1`" :rules="[{ validator: stoneWeightValid, trigger: 'blur' }]" class="item">
                  <el-input v-model="scope.row.StoneWeight1" @keyup.native="scope.row.StoneWeight1 = $root.toFixed(scope.row.StoneWeight1, 2)" :maxlength="10" style="width: 180px;"></el-input>
                </el-form-item>
                <span>~</span>
                <el-form-item :prop="`Rows[${scope.$index}].StoneWeight2`" :rules="[{ validator: stoneWeightValid, trigger: 'blur' }]" class="item">
                  <el-input v-model="scope.row.StoneWeight2" @keyup.native="scope.row.StoneWeight2 = $root.toFixed(scope.row.StoneWeight2, 2)" :maxlength="10" style="width: 180px;"></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveRows" type="primary" :loading="$store.getters.is_loading" name="btnsaveRows">保存</el-button>
        <el-button @click="numVisible =  false" name="btnClose">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置颜色与净度" class="details-table-dialog" width="800px" :visible.sync="colorVisible" @close="getDiamondFields">
      <el-form :model="diamondFields" ref="Fields" class="diamond-fields">
        <el-table :data="diamondFields.Fields" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="StoneColor" label="颜色" width="50" show-overflow-tooltip>
            <template slot-scope="scope">{{StoneColor.Types[scope.row.StoneColor]}}</template>
          </el-table-column>
          <el-table-column prop="StoneClaritys" label="可设置的净度">
            <template slot-scope="scope">
              <el-form-item :prop="`Fields[${scope.$index}].StoneClaritys`" class="item">
                <el-checkbox-group v-model="scope.row.StoneClaritys">
                  <el-checkbox v-for="(item,index) in StoneClarity.Types" :key="index" :label="parseInt(index)">{{item}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveFields" type="primary" :loading="$store.getters.is_loading" name="btnsaveFields">保存</el-button>
        <el-button @click="colorVisible =  false" name="btnClose">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input name="rowsNum" v-model="addLineForm.rowsNum" @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)" style="width: 200px"></el-input>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <el-form-item label="位置：">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="addVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { STOCKING_API_SETTING_DIAMOND_FIELD_GET, STOCKING_API_SETTING_DIAMOND_COST_GETS, STOCKING_API_SETTING_DIAMOND_FIELD_UPDATE, STOCKING_API_SETTING_DIAMOND_COST_UPDATE } from '@/apis/stocking.js'
import { StoneColor, StoneClarity } from '@/enums/stocking.js'
export default {
  data() {
    return {
      StoneColor,
      StoneClarity,
      numVisible: false,
      colorVisible: false,
      data: [],
      diamondCostData: [],
      rows: [],
      columns: [],
      diamondFields: {},
      handleRow: {},
      addVisible: false,
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    stoneWeightValid(rule, value, callback) {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('输入有误'))
      }
    },
    init() {
      this.$store.commit('SET_TB_LOADING', true)
      this.getDiamondCostData().then(() => {
        this.getDiamondFields().then(() => {
          this.setData()
          this.$store.commit('SET_TB_LOADING', false)
        })
      })
    },
    save() {
      let items = []
      this.data.forEach(item => {
        for (let key in item) {
          if (key !== 'name' && key !== 'ct') {
            let newItem = { ...item[key] }
            newItem.Price = this.$root.toInt(item[key].Price)
            items.push(newItem)
          }
        }
      })
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_SETTING_DIAMOND_COST_UPDATE({ Items: items }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.init()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    getColorData() {
      let colorData = []
      for (let key in StoneColor.Types) {
        let claritys = []
        if (parseInt(key) === StoneColor.D) {
          claritys = [StoneClarity.IF]
        } else if (parseInt(key) === StoneColor.DE) {
          claritys = [StoneClarity.VVS, StoneClarity.VS, StoneClarity.SI]
        } else {
          claritys = [StoneClarity.VVS, StoneClarity.VS, StoneClarity.SI, StoneClarity.P]
        }
        colorData.push({
          StoneColor: parseInt(key),
          StoneClaritys: claritys
        })
      }
      return colorData
    },
    getDiamondFields() {
      return STOCKING_API_SETTING_DIAMOND_FIELD_GET().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.diamondFields = res.data.Data
          if (!res.data.Data.Rows || !this.diamondFields.Rows.length) {
            this.$set(this.diamondFields, 'Rows', [{ RowName: '', StoneWeight1: '', StoneWeight2: '' }])
          }
          if (!res.data.Data.Fields || !res.data.Data.Fields[0].StoneClaritys && res.data.Data.Fields.length === 1) {
            this.$set(this.diamondFields, 'Fields', this.getColorData())
          } else {
            this.diamondFields.Fields.forEach(item => {
              if (!item.StoneClaritys) {
                item.StoneClaritys = []
              }
            })
          }
          // this.$set(this.diamondFields, 'Fields', this.getColorData())
          this.$set(this.diamondFields, 'DeleteRowsIds', [])
        }
      }).catch(() => {
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    setData() {
      this.data = []
      if (!this.diamondFields.Rows[0].RowId) { // 若不存在分数段，不显示表格
        return false
      }
      this.diamondFields.Rows.forEach(item => {
        let dataItem = {
          name: item.RowName,
          ct: `${this.$root.toFloat(item.StoneWeight1)}-${this.$root.toFloat(item.StoneWeight2)}`
        }
        this.diamondFields.Fields.forEach((ele) => {
          ele.StoneClaritys && ele.StoneClaritys.forEach((v) => {
            let costData = this.diamondCostData.find(cost => v === cost.StoneClarity && item.RowId === cost.RowId && ele.StoneColor === cost.StoneColor)
            let price = costData ? costData.Price : ''
            this.$set(dataItem, `price${ele.StoneColor}${v}`, {
              CharacterId: this.diamondFields.CharacterId,
              RowId: item.RowId,
              StoneColor: ele.StoneColor,
              StoneClarity: v,
              StoneWeight1: item.StoneWeight1,
              StoneWeight2: item.StoneWeight2,
              Price: price ? this.$root.toFloat(price) : ''
            })
          })
        })
        this.data.push(dataItem)
      })
      this.columns = this.diamondFields.Fields.map(item => {
        return { ...item }
      })
    },
    saveFields() { // 设置颜色净度
      if (!this.diamondFields.Rows[0].RowId) {
        this.$message.warning('请先设置分数段')
        return
      }
      // this.diamondFields.Rows.forEach(item => {
      //   item.StoneWeight1 = item.StoneWeight1 || 0
      //   item.StoneWeight2 = item.StoneWeight2 || 0
      // })
      this.diamondFields.Fields.forEach(item => {
        item.StoneClaritys.sort((a, b) => a - b)
      })
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_SETTING_DIAMOND_FIELD_UPDATE(this.diamondFields).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.getDiamondFields().then(() => {
            this.setData()
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
        this.colorVisible = false
      })
    },
    toFloatWeight() { // 控制分数段精度
      this.diamondFields.Rows.forEach(item => {
        item.StoneWeight1 = this.$root.toFloat(item.StoneWeight1)
        item.StoneWeight2 = this.$root.toFloat(item.StoneWeight2)
      })
    },
    saveRows() { // 设置分数段
      this.$refs.Rows.validate(valid => {
        if (valid) {
          let errorName
          let isError = this.diamondFields.Rows.some((item, index) => {
            if (index === this.diamondFields.Rows.length - 1) {
              if (item.StoneWeight1 * 1 >= item.StoneWeight2 * 1) {
                errorName = item.RowName
                this.$message.warning(errorName + '的分数段值设置有误')
                return true
              }
            } else {
              if (item.StoneWeight1 * 1 >= item.StoneWeight2 * 1) {
                errorName = item.RowName
                this.$message.warning(errorName + '的分数段值设置有误')
                return true
              }
              if (item.StoneWeight2 * 1 >= this.diamondFields.Rows[index + 1].StoneWeight1 * 1) {
                errorName = this.diamondFields.Rows[index + 1].RowName
                this.$message.warning(errorName + '的分数段值设置有误')
                return true
              }
              // return item.StoneWeight1 * 1 >= item.StoneWeight2 * 1 || item.StoneWeight2 * 1 >= this.diamondFields.Rows[index + 1].StoneWeight1 * 1
            }
          })
          if (isError) {
            return false
          }
          let param = JSON.parse(JSON.stringify(this.diamondFields))
          param.Rows.forEach(item => {
            item.StoneWeight1 = this.$root.toInt(item.StoneWeight1)
            item.StoneWeight2 = this.$root.toInt(item.StoneWeight2)
          })
          // this.diamondFields.DeleteRowsIds = this.diamondFields.DeleteRowsIds.join(',')
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_SETTING_DIAMOND_FIELD_UPDATE(param).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getDiamondFields().then(() => {
                this.setData()
              })
            }
            this.$store.commit('SET_BTN_LOADING', false)
            this.numVisible = false
          })
        }
      })
    },

    addShow(scope) {
      // 插入空白行弹窗
      this.addLineForm.rowsNum = ''
      this.addLineForm.local = '1'
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      let local
      if (isNaN(this.addLineForm.rowsNum) || parseFloat(this.addLineForm.rowsNum) > 50 && parseFloat(this.addLineForm.rowsNum) * 1 > 0) {
        this.$message.warning('最多新增50行')
        return false
      }
      local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        this.diamondFields.Rows.splice(this.handleRow.$index + local, 0, {
          RowId: '',
          RowName: '',
          StoneWeight1: '',
          StoneWeight2: ''
        })
      }
      this.addVisible = false
    },
    deleteShow($event, scope) {
      if (this.diamondFields.Rows.length === 1) {
        return false
      }
      $event.currentTarget.blur()
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.diamondFields.Rows.splice(scope.$index, 1)
        if (scope.row.RowId) {
          this.diamondFields.DeleteRowsIds.push(scope.row.RowId)
        }
      }).catch(() => { })
    },
    getDiamondCostData() {
      return STOCKING_API_SETTING_DIAMOND_COST_GETS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.diamondCostData = res.data.Data.Rows || []
        }
      }).catch(() => {
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },

  },

}
</script>
<style lang="scss" scoped>
.handle-btn {
  font-size: 16px;
  color: #1f91df;
  i {
    margin-right: 8px;
    &:hover {
      color: blue;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.diamond-fields {
  .item {
    margin-bottom: 0 !important;
  }
  .el-checkbox {
    margin-right: 10px !important;
    .el-checkbox__label {
      padding-left: 0 !important;
    }
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0px !important;
  }
}
</style>