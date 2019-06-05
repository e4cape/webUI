<template>
  <div>
    <el-dialog title="新建电子标签" :visible.sync="visible">
      <el-form :label-position="'right'" :model="queryForm" label-width="100px" :rules="rules"  ref="createForm">
        <el-form-item label="标签编号" prop="LabelCode">
          <el-input name="LabelCode" v-model="queryForm.LabelCode" placeholder="输入标签编号"  :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="货品" prop="GoodsName">
          <el-input name="GoodsName" v-model="queryForm.GoodsName" disabled placeholder="选择货品"  :maxlength="50">
            <el-button name="selectGoodsVisible" slot="append" type="primary" @click="dialogSelectGoodsVisible=true">选择货品</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="显示模板" prop="PrintingId" >
          <el-select name="PrintingId" v-model="queryForm.PrintingId" placeholder="选择模板" :filterable="true">
            <el-option v-for="(item, index) in templateList" :key="index" :value="item.PrintingId" :label="item.PrintingName"></el-option>
          </el-select>
        </el-form-item>        
        <el-form-item label="标签位置" >
          <el-select name="DeskId" v-model="queryForm.DeskId" placeholder="选择位置" :filterable="true">
            <el-option label="请选择" :value="0"> </el-option>
            <el-option v-for="item in desks" :key="item.value" :label="item.DeskName" :value="item.DeskId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签预览" v-if="templateSrc" >
          <img :src="$root.settings.DOMAIN_TEMP + templateSrc.replace('{0}','bzn')" alt="">  
        </el-form-item>
        <el-form-item>
          <el-button name="save"  type="primary"  @click.native="createGoodStags" :loading="$store.getters.is_loading" >{{!imgLoading?'保存':'获取图片中'}}</el-button>
          <el-button name="cancel" @click.native ="visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 选择货品 -->
    <select-goods v-if="dialogSelectGoodsVisible" :dialogSelectGoodsVisible="dialogSelectGoodsVisible" :stockType="stockTypes.StockOfSurplus" :deskId="0" @listenAddGoods="listenAddGoods" @listenSelectGoods="listenSelectGoods"></select-goods>
    <!-- End 选择货品 -->
  </div>
</template>

<script>
import {
  STOCKING_API_GOODSTAGS_CREATE, STOCKING_API_GOODSTAGS_UPDATEIMAGE 
} from '@/apis/stocking.js'
import {
  StockType 
} from '@/enums/merchant.js'
import SelectGoods from './selectGoods'

export default {
  data () {
    return {
      stockTypes: StockType,
      visible: this.createDialog,
      success: false,
      queryForm: {
        PrintingId: '',
        DeskId: '',
        GoodsId: ''
      },
      dialogSelectGoodsVisible: false,
      templateSrc: '',
      imgLoading: false, // 预览图片
      rules: {
        LabelCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入标签编号'))
              }
              //  else if (!new RegExp(/^\d{1,4}$/i).test(value.substring(8, 12))) {
              //   callback(new Error('标签编号错误'))
              // }
              callback()
            },
            trigger: 'blur'
          }
        ],
        PrintingId: [
          {
            type: 'number',
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择模板'))
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        GoodsName: [
          {
            type: 'string',
            required: true,
            validator: (rule, value, callback) => {
              if (!value || value === 0) {
                callback(new Error('请选择货品'))
              }
              callback()
            },
            trigger: 'blue'
          }
        ]
      }
    }
  },
  props: ['createDialog', 'templateList', 'desks'],
  mounted () {

  },
  methods: {
    listenSelectGoods () {
      this.dialogSelectGoodsVisible = false
    },
    listenAddGoods (data) {
      this.queryForm.GoodsName = data.GoodsName
      this.queryForm.GoodsId = data.GoodsId
      this.queryForm.StoreBarCode = data.StoreBarCode
    },
    createGoodStags () {
      this.$refs['createForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$store.commit('SET_BTN_LOADING', true)
        let params = {
          LabelCode: this.queryForm.LabelCode, // String 标签编号
          GoodsId: this.queryForm.GoodsId, // String 货品序号
          StoreBarCode: this.queryForm.StoreBarCode, // String 条码
          GoodsName: this.queryForm.GoodsName, // String 货品名称
          DeskId: this.queryForm.DeskId, // Int64 柜台序号
          DeskName: this.getDestName(this.queryForm.DeskId), // String 柜台名称
          PrintingId: this.queryForm.PrintingId, // String 模板序号
          PrintingName: this.getPrintName(this.queryForm.PrintingId), // String 模板名称
          ImageUrl: this.templateSrc, // String 标签地址
          Note: ''
        }
        STOCKING_API_GOODSTAGS_CREATE(params).then((res) => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
            this.success = true
            this.visible = false
            this.$emit('listenAllDialog', 'createDialog', this.success)
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      })
    },
    getDestName (id) {
      let name = null
      this.desks.forEach((item) => {
        if (item.DeskId === id) {
          name = item.DeskName
        }
      })
      return name
    },
    getPrintName (id) {
      let name = null
      this.templateList.forEach((item) => {
        if (item.PrintingId === id) {
          name = item.PrintingName
        }
      })
      return name
    }
  },
  components: {
    SelectGoods
  },
  watch: {
    visible () {
      this.$emit('listenAllDialog', 'createDialog', this.success)
    },
    'queryForm.PrintingId' () {
      if (!this.queryForm.GoodsId || !this.queryForm.GoodsId) {
        return false
      }
      this.imgLoading = true
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODSTAGS_UPDATEIMAGE({
        PrintingId: this.queryForm.PrintingId,
        GoodsId: this.queryForm.GoodsId
      }).then((res) => {
        if (res.data.Code === 'CORRECT') {
          this.templateSrc = res.data.Data.Path
        }
        this.$store.commit('SET_BTN_LOADING', false)
        this.imgLoading = false
      })
    },
    'queryForm.GoodsId' () {
      if (!this.queryForm.PrintingId || !this.queryForm.GoodsId) {
        return false
      }
      this.imgLoading = true
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODSTAGS_UPDATEIMAGE({
        PrintingId: this.queryForm.PrintingId,
        GoodsId: this.queryForm.GoodsId
      }).then((res) => {
        if (res.data.Code === 'CORRECT') {
          this.templateSrc = res.data.Data.Path
        }
        this.$store.commit('SET_BTN_LOADING', false)
        this.imgLoading = false
      })
    }
  }
}
</script>

<style>
.el-form-item__content .el-button--text span{color:#409EFF !important;}
</style>

