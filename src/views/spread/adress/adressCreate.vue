<template>
  <div class="content">
    <el-dialog title="新建提货地址" width="600px" @close="reset" :visible.sync="visible">
      <el-form ref="createForm" :model="queryForm" label-width="80px" :rules="rules">
        <el-form-item label="门店名称" prop="Name">
          <el-input name="Name" v-model="queryForm.Name" :maxlength="30" placeholde="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input name="Phone" v-model="queryForm.Phone" :maxlength="20" placeholde="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input name="Contact" v-model="queryForm.Contact" :maxlength="20" placeholde="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="Mobile">
          <el-input name="Mobile" v-model="queryForm.Mobile" :maxlength="20" placeholde="请输入手机"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="Areas">
          <el-cascader name="Areas" filterable :options="$store.getters.areas" v-model="queryForm.Areas" change-on-select ref="cascader" placeholder="选择地区" @change="citiChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input name="Address" type="textarea" :maxlength="100" v-model="queryForm.Address" placeholde="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnCreateAddress" type="primary" @click.native="createAddress" :loading="$store.getters.is_loading">保存</el-button>
        <el-button name="btnClose" @click.native="closeAdressDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SPREAD_API_SPR_ADDRCREATE } from '@/apis/spread.js'
export default {
  data() {
    return {
      visible: this.createDialog,
      queryForm: {
        Tag: '', // 地址标记
        Name: '', // String: '', // 门店名称
        Phone: '', // String: '', // 电话
        Contact: '', // String: '', // 联系人
        Mobile: '', // String: '', // 联系人电话
        ProvinceId: '', // Int32: '', // 省份序号
        ProvinceName: '', // String: '', // 省份名称
        CityId: '', // Int32: '', // 城市序号
        CityName: '', // String: '', // 城市名称
        TownId: '', // Int32: '', // 区/镇序号
        TownName: '', // String: '', // 区/镇名称
        Address: '', // String: '', // 详细地址
        Areas: []
      },
      areas: [],
      success: false,
      rules: {
        Phone: {
          type: 'string',
          required: true,
          message: '请输入电话号码',
          trigger: 'blur'
        },
        Mobile: {
          type: 'string',
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        Name: [
          {
            type: 'string',
            required: true,
            validator: (rule, value, callback) => {
              if (!value.trim()) {
                callback(new Error('请填写入门店名称'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        Areas: [
          {
            type: 'array',
            required: true,
            message: '请选择地区',
            trigger: 'change'
          }
        ]
      }
    }
  },
  props: {
    createDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    createAddress() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let params = {
            Tag: '12312',
            Name: this.queryForm.Name.trim(), // String: '', // 门店名称
            Phone: this.queryForm.Phone.trim(), // String: '', // 电话
            Contact: this.queryForm.Contact.trim(), // String: '', // 联系人
            Mobile: this.queryForm.Mobile.trim(), // String: '', // 联系人电话
            ProvinceId: this.queryForm.ProvinceId, // Int32: '', // 省份序号
            ProvinceName: this.queryForm.ProvinceName, // String: '', // 省份名称
            CityId: this.queryForm.CityId, // Int32: '', // 城市序号
            CityName: this.queryForm.CityName, // String: '', // 城市名称
            TownId: this.queryForm.TownId, // Int32: '', // 区/镇序号
            TownName: this.queryForm.TownName, // String: '', // 区/镇名称
            Address: this.queryForm.Address.trim() // String: '', // 详细地址
          }
          SPREAD_API_SPR_ADDRCREATE(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存成功')
              this.success = true
              this.reset()
              this.$emit('closeDialog', this.success)
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    reset() {
      this.queryForm = {
        Tag: '',
        Name: '', // String: '', // 门店名称
        Phone: '', // String: '', // 电话
        Contact: '', // String: '', // 联系人
        Mobile: '', // String: '', // 联系人电话
        ProvinceId: '', // Int32: '', // 省份序号
        ProvinceName: '', // String: '', // 省份名称
        CityId: '', // Int32: '', // 城市序号
        CityName: '', // String: '', // 城市名称
        TownId: '', // Int32: '', // 区/镇序号
        TownName: '', // String: '', // 区/镇名称
        Address: '' // String: '', // 详细地址
      }
    },
    citiChange(e) {
      this.queryForm.ProvinceId = parseInt(e[0]) || 0
      this.queryForm.CityId = parseInt(e[1]) || 0
      this.queryForm.TownId = parseInt(e[2]) || 0
      var cityName = this.$refs.cascader.currentLabels
      this.queryForm.ProvinceName = cityName[0] || ''
      this.queryForm.CityName = cityName[1] || ''
      this.queryForm.TownName = cityName[2] || ''
    },
    closeAdressDialog() {
      // 关闭创建窗口
      this.reset()
      this.$emit('closeDialog', this.success)
    }
  },
  watch: {
    visible() {
      this.$emit('closeDialog', this.success)
    }
  }
}
</script>

<style lang="scss">
</style>
