
<template>
  <el-form :rules="rules" ref="form" label-width="110px" :model="model">
    <el-dialog :visible="visible" @update:visible="clear" width="640px" :title="title">
      <template>
        <el-form-item prop="dateName" label="日期名称">
          <el-input name="inputDateName" v-model="model.dateName" :maxlength="50" :disabled="isBirth"></el-input>
        </el-form-item>

        <el-form-item prop="dateType" v-if="!isBirth">
          <el-radio-group name="radioGroupDateType" v-model="model.dateType">
            <div class="date-item">
              <el-radio name="radioDate" :label="0">固定日期</el-radio>
              <el-date-picker name="datePickerfixedDate" style="margin-left: 10px;" v-model="model.fixedDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" :editable="false"></el-date-picker>
            </div>
            <div class="date-item">
              <el-radio name="radioRange" :label="1">日期范围</el-radio>
              <el-date-picker
                name="datePickerDate"
                class="m-l-10"
                v-model="model.date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                :picker-options="pickerOptions"
                :editable="false"
              ></el-date-picker>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="赠送倍率">
          <div class="giving-options">
            积分按
            <el-form-item prop="scoreRate">
              <el-input-number name="inputNumberScoreRate" :min="0" :max="10000" :controls="null" v-model="model.scoreRate"></el-input-number>
            </el-form-item>倍赠送, 礼金按
            <el-form-item prop="goldenRiceRate">
              <el-input-number name="inputNumberGoldenRiceRate" :min="0" :max="10000" :controls="null" v-model="model.goldenRiceRate"></el-input-number>
            </el-form-item>倍赠送,
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input name="inputRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="model.remark"></el-input>
        </el-form-item>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button name="btnClear" :disabled="uploading" size="mini" @click="clear">取 消</el-button>
        <el-button name="btnConfirm" :loading="uploading" size="mini" type="primary" @click="confirm">
          确
          定
        </el-button>
      </span>
    </el-dialog>
  </el-form>
</template>

<script>
import {
  MEMBERSHIP_API_SCORERULE_CREATEBYRATERULE,
  MEMBERSHIP_API_SCORERULE_UPDATEBYRATERULE
} from '@/apis/membership'

const date_type = {
  Fixed: 0,
  Range: 1
}

export default {
  components: {
  },
  props: {
    isCreate: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    init: {
      type: Object
    }
  },
  data() {
    const self = this

    function dateValidate(rule, value, callback) {
      const {
        fixedDate, dateType, date
      } = self.model
      if (!(dateType === 0 && fixedDate) && !(dateType === 1 && date)) {
        callback(new Error('请选择日期'))
      } else {
        callback()
      }
    }

    const rateRule = [
      {
        required: true,
        message: '请输入倍率'
      },
      {
        validator: (rule, value, callback) => {
          if (value < 1) {
            callback(new Error('倍率最小为1'))
          } else {
            callback()
          }
        },
        trigger: 'blue'
      }
    ]
    return {
      model: this.newModel(),
      uploading: false,
      rules: {
        dateName: [
          {
            required: true,
            message: '请输入日期名称'
          }
        ],
        dateType: [
          {
            required: true,
            validator: dateValidate,
            trigger: 'blur'
          }
        ],
        scoreRate: rateRule,
        goldenRiceRate: rateRule
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date() - 8.64e7
        }
      },
    }
  },
  computed: {
    title() {
      return this.isCreate ? '添加日期' : '更新规则'
    },
    isBirth() {
      return this.init.type == 0 || this.init.type == 1
    }
  },
  created() { },
  methods: {
    newModel() {
      const {
        dateStart, dateEnd
      } = this.init
      const dateType = dateStart && dateEnd ? date_type.Range : date_type.Fixed
      return {
        ...this.init,
        dateType,
        date: dateStart && dateEnd ? [dateStart, dateEnd] : [],
        fixedDate: (dateStart && !dateEnd && dateStart) || null
      }
    },
    async onApi(model) {
      const {
        dateType, date, fixedDate
      } = model
      if (dateType === date_type.Range) {
        model.dateStart = date[0]
        model.dateEnd = date[1]
      } else {
        //
        model.dateStart = fixedDate
        delete model.dateEnd
      }
      delete model.date
      delete model.dateType
      const {
        isCreate
      } = this
      this.uploading = true
      const api = isCreate
        ? MEMBERSHIP_API_SCORERULE_CREATEBYRATERULE
        : MEMBERSHIP_API_SCORERULE_UPDATEBYRATERULE
      const res = await api(model)
      if (res.data.Code === 'CORRECT') {
        this.$message.success('操作成功')
        this.$emit('success', res.data.Data)
      }
      this.uploading = false
    },
    clear() {
      this.$emit('update:visible', false)
      const newModel = {
      }
      Object.entries(this.model).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          newModel[k] = v
        } else if (typeof v === 'object') {
          newModel[k] = {
          }
        } else {
          newModel[k] = ''
        }
      })
      this.model = {
        ...newModel,
        dateType: this.newModel().dateType,

        ...this.init
      }
    },
    confirm() {
      const {
        model, $refs
      } = this
      $refs.form.validate(valid => {
        if (!valid) {
          return false
        }

        this.onApi({
          ...model
        })
      })
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.model = this.newModel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.date-item {
  line-height: 1;
  height: 36px;
}

.giving-options {
  display: flex;

  :global(.el-input-number) {
    width: 100px;
    margin: 0 2px;
  }
}
</style>
