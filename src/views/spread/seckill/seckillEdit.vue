<template>
  <div class="content">
    <el-form label-position="right" label-width="133px" ref="editForm" class="fix-w" :model="form" :rules="rules" show-message>
      <el-form-item label="活动名称：" prop="SeckillTitle">
        <el-input name="SeckillTitle" v-model="form.SeckillTitle" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="活动时间：" prop="CreateTime">
        <el-date-picker name="CreateTime" v-model="form.CreateTime" :unlink-panels="true" type="datetimerange" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="商品限购：" prop="LimitType">
        <el-radio-group name="LimitType" v-model="form.LimitType">
          <el-radio :label="parseInt(limitType.More)">
            <span>同一用户限购</span><el-input class="m-r-5 m-l-5" v-model="form.LimitTimes" @keyup.native="form.LimitTimes = $root.toFixed(form.LimitTimes, 0)" style="width: 80px!important;" placeholder=""></el-input><span>次</span>
          </el-radio>
          <el-radio :label="parseInt(limitType.None)">不限</el-radio>
        </el-radio-group>
        <div class="alertS">商品默认每次只能买一件</div>
      </el-form-item>
      <el-form-item label="订单自动取消时间：" prop="CancelMinutes">
        <el-input name="CancelMinutes" v-model="form.CancelMinutes" :maxlength="7" class="medium-input"></el-input>            
        <el-select name="cancelType" v-model="cancelType" class="medium-select" filterable>
          <el-option label="分钟" :value="1"></el-option>
          <el-option label="小时" :value="60"></el-option>
        </el-select>
        <div class="alertS">买家提交订单后在指定的时间内未支付，订单自动取消，不得小于5分钟。</div>
      </el-form-item>
      <el-form-item label="活动商品：" class="is-required">
        <el-button name="btnSelectGoods" type="primary" @click="selectGoodsVisible = true">添加商品</el-button>
        <span class="alertS m-l-5">请提前在活动商品中建好活动商品，以便选择。</span>
      </el-form-item>
      <el-form-item label="">
        <!-- Data Table -->
        <el-table :data="activeGoods" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="ProductId" label="商品编码" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="商品类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{productType.Types[scope.row.ProductType]}}
            </template>
          </el-table-column>
          <el-table-column prop="SummaryQty" label="库存" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.LabelPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.SalePrice}}
            </template>
          </el-table-column>
          <el-table-column prop="SeckillPrice" label="秒杀价" width="140" class-name="hd-required" show-overflow-tooltip>                  
            <template slot-scope="scope">
              <el-input name="SeckillPrice" :maxlength="9" v-model="scope.row.SeckillPrice" style="width: 100px !important;" @keyup.native="scope.row.SeckillPrice = $root.toFixed(scope.row.SeckillPrice, 2)" v-if="scope.row.Edit"></el-input>
              <span v-else>￥{{scope.row.SeckillPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="CreateTime" label="秒杀时间" min-width="120" class-name="hd-required" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-date-picker name="CreateTime" v-if="scope.row.Edit" v-model="scope.row.CreateTime" :unlink-panels="true" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions" style="width: 100%; height: 100%;"></el-date-picker>
              <span v-else>{{scope.row.Btime}} - {{scope.row.Etime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <template v-if="!scope.row.Edit">
                <el-button name="btnEditGoods" type="text" size="small" @click="editGood(scope.row)">修改</el-button>
                <el-button name="btnDelGoods" type="text" size="small" @click="delGood(scope.row)">删除</el-button>
              </template>
              <template v-if="scope.row.Edit">
                <el-button name="btnSaveGoods" type="text" size="small" @click="saveGood(scope.row)">保存</el-button>
                <el-button name="btnCancelGoods" type="text" size="small" @click="cancelGood(scope.row)">取消</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- end Table -->
      </el-form-item>
      <el-form-item label="商品领取地址：" class="is-required">
        <el-button name="btnSelectStore" type="primary" @click="selectStoreVisible = true">选择门店</el-button>
      </el-form-item>
      <el-form-item label="">
        <!-- Data Table -->
        <el-table :data="activeAddrs" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="Name" label="门店名称" max-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mobile" label="联系电话" width="120"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact" label="联系人" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Address" label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag class="after-tag" type="info" v-if="scope.row.RmaType === rmaType.Rma">售后</el-tag>
              <span class="adress-table">{{scope.row.ProvinceName + scope.row.CityName + scope.row.TownName + scope.row.Address}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button name="btnDelAddr" type="text" @click="delAddr(scope.row.AddressId)">删除</el-button>
              <el-button name="btnSetAfter" type="text" @click="setAfter(scope.row)" v-if="scope.row.RmaType == rmaType.None">设为售后地址</el-button>
              <el-button name="btnCancelAfter" type="text" @click="cancelAfter(scope.row)" v-else>取消设为售后地址</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- end Table -->
      </el-form-item>
    </el-form>
    <el-row style="margin: 20px; margin-left: 133px; text-align: left; border: 0;">
      <el-button name="btnCreateActive" type="primary" @click="createActive" :loading="$store.getters.is_loading">提交</el-button>
      <el-button name="btnCancel" @click="$router.push({path: '/spread/activitySeckill/index'})">取消</el-button>
    </el-row>
    <!-- selectGoods -->
    <selectGoods v-if="selectGoodsVisible" :selectGoodsVisible="selectGoodsVisible" @listenSelectGoods="listenSelectGoods" :activeTime="form.CreateTime" activeType="seckill"></selectGoods>
    <!-- selectStore -->
    <selectStore v-if="selectStoreVisible" :selectStoreVisible="selectStoreVisible" @listenSelectStore="listenSelectStore"></selectStore>

    <qrcode v-if="qrcodeVisible" :qrcodeVisible="qrcodeVisible" :data="codeData" @qrcodeClose="qrcodeClose" :first="true"></qrcode>
  </div>
</template>
<script>
import selectStore from '@/components/spread/selectStore'
import selectGoods from '@/components/spread/selectGoods'
import qrcode from '@/components/spread/qrcode'
import {
  LimitType, RmaType, UnitType, ProductType
} from '@/enums/spread'
import {
  SPREAD_API_SECKILL_DETAIL,
  SPREAD_API_SECKILL_SEARCHITEMS,
  SPREAD_API_SECKILL_SEARCHADDRS,
  SPREAD_API_SECKILL_UPDATE,
  SPREAD_API_SECKILL_CREATE
} from '@/apis/spread'
export default {
  data () {
    return {
      productType: ProductType,
      rmaType: RmaType,
      limitType: LimitType,
      selectGoodsVisible: false,
      selectStoreVisible: false,
      form: {
        SeckillId: 0,
        SeckillTitle: '',
        LimitType: LimitType.More,
        LimitTimes: '1',
        CreateTime: '',
        CancelMinutes: 5,
        Ggrain: 0,
        GgrainTop: 5,
        GgrainUnitType: UnitType.Year,
        GgrainExpire: 1,
        Score: 0,
        ScoreTop: 5,
        ScoreUnitType: UnitType.Year,
        ScoreExpire: 1,
        Note: ''
      },
      cancelType: 1,
      shareData: [
        {
          PrefixName: 'Ggrain',
          Type: '礼金',
          Count: 0,
          Expire: 1,
          UnitType: UnitType.Year,
          Top: 5
        },
        {
          PrefixName: 'Score',
          Type: '积分',
          Count: 0,
          Expire: 1,
          UnitType: UnitType.Year,
          Top: 5
        }
      ],
      activeGoods: [],
      activeAddrs: [],
      rules: {
        SeckillTitle: [
          {
            required: true, message: '请填写活动名称', trigger: 'change' 
          }
        ],
        CreateTime: [
          {
            required: true, message: '请选择活动时间', trigger: 'change' 
          },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (Date.parse(value[0]) === Date.parse(value[1])) {
                callback(new Error('开始时间不能等于结束时间'))
              }
              callback()
            }
          }
        ],
        LimitType: {
          validator: (rule, value, callback) => {
            if (value == LimitType.More && (!this.form.LimitTimes || !this.form.LimitTimes.toString().trim() || this.form.LimitTimes == '0')) {
              callback('请输入限购次数')
            }
            callback()
          }
        },
        CancelMinutes: [
          {
            required: true, message: '请填写自动取消时间', trigger: 'change' 
          },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error('请输入正整数的自动取消时间'))
              } else if (this.cancelType === 1 && parseInt(value) < 5) {
                callback(new Error('自动取消时间不得小于5分钟'))
              }
              callback()
            }
          }
        ]
      },
      pickerOptions: {
        disabledDate (date) {
          let now = new Date()
          return (
            Date.parse(date) <
            Date.parse(
              now.getFullYear() +
                '/' +
                (now.getMonth() + 1) +
                '/' +
                now.getDate()
            )
          )
        }
      },
      editing: false,
      oldItem: {
      },
      html: '',
      qrcodeVisible: false,
      cropperVisible: false,
      codeData: {
      }
    }
  },
  methods: {
    getDetail () {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SECKILL_DETAIL({
        seckillId: this.form.SeckillId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.html = res.data.Data.Note
          this.form.CreateTime = [this.form.Btime, this.form.Etime]
          this.shareData[0].Top = this.form.GgrainTop === 0 ? 0 : 5
          this.shareData[1].Top = this.form.ScoreTop === 0 ? 0 : 5
        }
      })
    },
    createActive () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          if (this.form.Ggrain) {
            if (!/^[1-9]\d*$/.test(this.form.Ggrain)) {
              this.$message.warning('请填写正确的礼金奖励额度')
              return false
            }
            if (!/^[1-9]\d*$/.test(this.form.GgrainExpire)) {
              this.$message.warning('请填写正确的礼金奖励有效期')
              return false
            }
            if (
              this.shareData[0].Top &&
              !/^[1-9]\d*$/.test(this.form.GgrainTop)
            ) {
              this.$message.warning('请填写正确的礼金奖励分享人数量')
              return false
            }
          }
          if (this.form.Score) {
            if (!/^[1-9]\d*$/.test(this.form.Score)) {
              this.$message.warning('请填写正确的积分奖励额度')
              return false
            }
            if (!/^[1-9]\d*$/.test(this.form.ScoreExpire)) {
              this.$message.warning('请填写正确的积分奖励有效期')
              return false
            }
            if (
              this.shareData[1].Top &&
              !/^[1-9]\d*$/.test(this.form.ScoreTop)
            ) {
              this.$message.warning('请填写正确的积分奖励分享人数量')
              return false
            }
          }
          if (Date.parse(this.form.CreateTime[0]) >= Date.parse(this.form.CreateTime[1])) {
            this.$message.warning('开始时间不能大于或等于结束时间')
            return false
          }
          if (!this.activeGoods.length) {
            this.$message.error('请添加活动商品')
            return
          } else if (!this.activeAddrs.length) {
            this.$message.error('请添加商品领取地址')
            return
          } else if(this.editing) {
            this.$message.error('请先保存数据')
            return
          }
          let bTime = new Date(
            Date.parse(this.form.CreateTime[0]) + 1000 * 60 * 60 * 8
          )
            .toJSON()
            .replace('T', ' ')
            .replace('.000Z', '')
          let eTime = new Date(
            Date.parse(this.form.CreateTime[1]) + 1000 * 60 * 60 * 8
          )
            .toJSON()
            .replace('T', ' ')
            .replace('.000Z', '')
          let timeTrue = false
          this.activeGoods.forEach(item => {
            if (new Date(item.Btime) - new Date(bTime) < 0 || new Date(item.Etime) - new Date(eTime) > 0) {
              timeTrue = true
            }
          })
          if (timeTrue) {
            this.$message.error('商品秒杀时间必须在活动有效时间范围内！')
            return false
          }
          let parameters = Object.assign({
          }, this.form, {
            Btime: bTime,
            Etime: eTime,
            SeckillTitle: this.form.SeckillTitle.trim(),
            CancelMinutes: this.form.CancelMinutes * this.cancelType,
            Items: this.activeGoods,
            Addrs: this.activeAddrs
          })
          if (!this.shareData[0].Top) {
            parameters.GgrainTop = 0
          }
          if (!this.shareData[1].Top) {
            parameters.ScoreTop = 0
          }
          let api = this.form.SeckillId
            ? SPREAD_API_SECKILL_UPDATE
            : SPREAD_API_SECKILL_CREATE
          this.$store.commit('SET_BTN_LOADING', true)
          api(parameters).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              if (!this.form.SeckillId) {
                this.form.SeckillId = res.data.Data.SeckillId
              }
              this.$router.push({
                path: '/spread/activitySeckill/index'
              })
              this.$message.success(res.data.Message)
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    listenSelectGoods (flag, data) {
      this.selectGoodsVisible = false
      if (data && parseFloat(data.SeckillPrice) === 0) {
        this.$message.error('请输入大于0的秒杀价！')
      }
      if (flag) {
        this.$store.commit('SET_TB_LOADING', true)
        let bTime = new Date(
          Date.parse(data.CreateTime[0]) + 1000 * 60 * 60 * 8
        )
          .toJSON()
          .replace('T', ' ')
          .replace('.000Z', '')
        let eTime = new Date(
          Date.parse(data.CreateTime[1]) + 1000 * 60 * 60 * 8
        )
          .toJSON()
          .replace('T', ' ')
          .replace('.000Z', '')
        let isNew = true
        this.activeGoods.forEach((item) => {
          if (item.ProductId === data.ProductId) {
            this.$message.error('商品已存在')
            isNew = false
          }
        })
        if (isNew) {
          this.activeGoods.unshift(Object.assign(data, {
            Btime: bTime,
            Etime: eTime
          }))
          this.activeGoods.map((item, index) => {
            item.Index = index
            item.Edit = false
            item.CreateTime = [item.Btime, item.Etime]
            return item
          })
          this.$message.success('添加成功')
        }
      }
      this.$store.commit('SET_TB_LOADING', false)
    },
    getGoods () {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SECKILL_SEARCHITEMS({
        seckillId: this.form.SeckillId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.activeGoods = res.data.Data.rows.map((item, index) => {
            item.Index = index
            item.Edit = false
            item.CreateTime = [item.Btime, item.Etime]
            return item
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    editGood (row) {
      if (!this.editing) {
        this.oldItem = row
        this.$set(
          this.activeGoods,
          row.Index,
          Object.assign({
          }, row, {
            Edit: true 
          })
        )
        this.editing = true
      } else {
        this.$message.warning('有数据在编辑中，请先保存！')
      }
    },
    saveGood (row) {
      if (
        !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.SeckillPrice) ||
        parseFloat(row.SeckillPrice) === 0
      ) {
        this.$message.warning('请输入大于0的秒杀价！')
        return false
      } else if (parseFloat(row.SeckillPrice) > parseFloat(row.SalePrice)) {
        this.$message.warning('秒杀价不能大于售价！')
        return false
      }
      if (!row.CreateTime) {
        this.$message.warning('请设定秒杀时间！')
        return false
      } else {
        let start = Date.parse(this.form.CreateTime[0])
        let end = Date.parse(this.form.CreateTime[1])
        if (
          Date.parse(row.CreateTime[0]) < start ||
          Date.parse(row.CreateTime[1]) > end
        ) {
          this.$message.warning('商品秒杀时间必须在活动有效时间范围内！')
          return false
        } else if (
          Date.parse(row.CreateTime[0]) === Date.parse(row.CreateTime[1])
        ) {
          this.$message.warning('开始时间不能等于结束时间！')
          return false
        }
      }
      let bTime = new Date(Date.parse(row.CreateTime[0]) + 1000 * 60 * 60 * 8)
        .toJSON()
        .replace('T', ' ')
        .replace('.000Z', '')
      let eTime = new Date(Date.parse(row.CreateTime[1]) + 1000 * 60 * 60 * 8)
        .toJSON()
        .replace('T', ' ')
        .replace('.000Z', '')
      this.$set(
        this.activeGoods,
        row.Index,
        Object.assign(row, {
          Btime: bTime, Etime: eTime, Edit: false 
        })
      )
      // this.$emit('listenGoodSave', this.dictType)
      this.editing = false
    },
    delGood (row) {
      this.$confirm('确定将此商品删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activeGoods.splice(this.activeGoods.findIndex(item => item.ProductId === row.ProductId), 1)
        this.activeGoods.forEach((item, index) => {
          item.Index = index
        })
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    cancelGood (row) {
      this.$set(this.activeGoods, row.Index, this.oldItem)
      this.editing = false
    },
    listenSelectStore (flag, data) {
      this.selectStoreVisible = false
      if (flag) {
        let haiAddrs = []
        this.activeAddrs.forEach((item) => {
          haiAddrs.push(item.AddressId)
        })
        JSON.stringify(data).replace('')
        data.forEach(item => {
          if (haiAddrs.indexOf(item.AddressId) == -1) {
            this.activeAddrs.unshift(item)
          }
        })
      }
    },
    getAddrs () {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SECKILL_SEARCHADDRS({
        seckillId: this.form.SeckillId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.activeAddrs = res.data.Data.rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    setAfter(row) {
      this.$set(
        this.activeAddrs,
        this.activeAddrs.findIndex(item => item.AddressId === row.AddressId),
        Object.assign(row, {
          RmaType: RmaType.Rma 
        })
      )
      this.$message.success('设置成功')
    },
    cancelAfter(row) {
      this.$set(
        this.activeAddrs,
        this.activeAddrs.findIndex(item => item.AddressId === row.AddressId),
        Object.assign(row, {
          RmaType: RmaType.None 
        })
      )
      this.$message.success('取消成功')
    },
    delAddr(id) {
      this.$confirm('确定将此地址删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activeAddrs.splice(
          this.activeAddrs.findIndex(item => item.AddressId === id),
          1
        )
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    qrcodeClose (flg) {
      this.qrcodeVisible = false
      flg && this.$router.push({
        path: '/spread/activitySeckill/index'
      })
    }
  },
  beforeMount () {
    this.form.SeckillId = this.$route.query.id || 0
    if (this.form.SeckillId) {
      this.getDetail()
      this.getGoods()
      this.getAddrs()
    }
  },
  components: {
    selectGoods,
    selectStore,
    qrcode
  }
}
</script>
<style lang="scss">
@import '~@/assets/sass/spreadActive.scss';
</style>
