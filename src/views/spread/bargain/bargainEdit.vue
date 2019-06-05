<template>
  <div class="content">
    <!-- @module Panel -->
    <el-form label-position="right" label-width="133px" ref="editForm" class="fix-w" :model="form" :rules="rules" show-message>
      <el-form-item label="活动名称：" prop="BargainTitle">
        <el-input name="BargainTitle" v-model="form.BargainTitle" :maxlength="30"></el-input>
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
        <el-button name="btnSelectGoods" type="primary m-r-5" @click="selectGoodsVisible = true">添加商品</el-button>
        <span class="alertS m-l-5">请提前在活动商品中建好活动商品，以便选择。</span>
      </el-form-item>
      <el-form-item label="">
        <el-table :data="activeGoods" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="ProductId" label="商品编码" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductType" label="商品类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{productType.Types[scope.row.ProductType]}}
            </template>
          </el-table-column>
          <el-table-column prop="SummaryQty" label="库存" width="70" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.LabelPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.SalePrice}}
            </template>
          </el-table-column>
          <el-table-column prop="AvailablePrice" :render-header="privateHeader" class-name="hd-required" width="140">                  
            <template slot-scope="scope">
              <template  v-if="scope.row.Edit">
                <el-input name="AvailablePrice" style="width: 100px !important;" :maxlength="9" v-model="scope.row.AvailablePrice" @keyup.native="scope.row.AvailablePrice = $root.toFixed(scope.row.AvailablePrice, 2)"></el-input>
              </template>
              <template v-else>
                ￥{{scope.row.AvailablePrice}}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="SelfAmt" label="自砍次数(次）" class-name="hd-required" width="140">                  
            <template slot-scope="scope">
              <template v-if="scope.row.Edit">
                <el-input name="SelfAmt" style="width: 100px !important;" :maxlength="9" v-model="scope.row.SelfAmt"></el-input>
              </template>
              <template v-else>
                {{scope.row.SelfAmt}}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="SelfPrice" label="自砍金额（元）" class-name="hd-required" width="140">                  
            <template slot-scope="scope">
              <template  v-if="scope.row.Edit">
                <el-input name="SelfPrice1" style="width: 50px !important;" :maxlength="9" v-model="scope.row.SelfPrice1" @keyup.native="scope.row.SelfPrice1 = $root.toFixed(scope.row.SelfPrice1, 2)"></el-input>
                -
                <el-input name="SelfPrice2" style="width: 50px !important;" :maxlength="9" v-model="scope.row.SelfPrice2" @keyup.native="scope.row.SelfPrice2 = $root.toFixed(scope.row.SelfPrice2, 2)"></el-input>
              </template>
              <template v-else>
                ￥{{scope.row.SelfPrice1}}
                -
                ￥{{scope.row.SelfPrice2}}
              </template>
            </template>
          </el-table-column>
          <el-table-column class-name="hd-required" label="好友帮砍金额（元）" width="160">                  
            <template slot-scope="scope">
              <template  v-if="scope.row.Edit">
                <el-input name="HelpPrice1" style="width: 50px !important;" :maxlength="9" v-model="scope.row.HelpPrice1" @keyup.native="scope.row.HelpPrice1 = $root.toFixed(scope.row.HelpPrice1, 2)"></el-input>
                -
                <el-input name="HelpPrice2" style="width: 50px !important;" :maxlength="9" v-model="scope.row.HelpPrice2" @keyup.native="scope.row.HelpPrice2 = $root.toFixed(scope.row.HelpPrice2, 2)"></el-input>
              </template>
              <template v-else>
                ￥{{scope.row.HelpPrice1}}
                -
                ￥{{scope.row.HelpPrice2}}
              </template>
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
        <div class="alertS">注：砍价过程中，最后剩余可砍金额小于最低砍价金额时，顾客砍到的金额会按剩余可砍金额显示，表示已砍到底，请知悉！</div>
      </el-form-item>
      <el-form-item label="商品领取地址：" class="is-required">
        <el-button name="btnSelectStore" type="primary" @click="selectStoreVisible = true">选择门店</el-button>
      </el-form-item>
      <el-form-item>
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
      <el-button name="btnCancel" @click="$router.push({path: '/spread/activityBargain/index'})">取消</el-button>
    </el-row>

    <!-- selectGoods -->
    <selectGoods v-if="selectGoodsVisible" :selectGoodsVisible="selectGoodsVisible" @listenSelectGoods="listenSelectGoods" activeType="bargain"></selectGoods>

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
  LimitType,
  RmaType,
  SpreadType,
  ProductType
} from '@/enums/spread'
import {
  SPREAD_API_BARGAIN_DETAIL,
  SPREAD_API_BARGAIN_SEARCHITEMS,
  SPREAD_API_BARGAIN_SEARCHADDRS,
  SPREAD_API_BARGAIN_UPDATE,
  SPREAD_API_BARGAIN_CREATE
} from '@/apis/spread'
export default {
  data() {
    return {
      productType: ProductType,
      rmaType: RmaType,
      limitType: LimitType,
      selectGoodsVisible: false,
      selectStoreVisible: false,
      form: {
        BargainId: 0,
        BargainTitle: '',
        BannerUrl: '',
        LimitType: LimitType.More,
        LimitTimes: '1',
        CreateTime: '',
        CancelMinutes: 5,
        Note: ''
      },
      cancelType: 1,
      activeGoods: [],
      activeAddrs: [],
      rules: {
        BargainTitle: [
          {
            required: true, message: '请填写活动名称', trigger: 'change' 
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
        disabledDate(date) {
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
      qrcodeVisible: false,
      codeData: {
      }
    }
  },
  methods: {
    privateHeader(createElement) {
      return createElement('span', [
        createElement('span', {
        }, ['可砍金额']),
        createElement(
          'el-tooltip',
          {
            attrs: {
              placement: 'top',
              effect: 'light',
              class: 'el-icon-question',
              content:
                '在售价的基础上拿出来用于砍价的金额，砍完不能再砍以确保商品利润，需小于售价。'
            }
          },
          [
            createElement(
              'i',
              {
                attrs: {
                  style: 'margin-left:5px;' 
                }
              },
              ['']
            )
          ]
        )
      ])
    },
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_BARGAIN_DETAIL({
        BargainId: this.form.BargainId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.html = res.data.Data.Note
          this.form.CreateTime = [this.form.Btime, this.form.Etime]
          this.form.ValidityMinutes = this.form.ValidityMinutes / 60
        }
      })
    },
    createActive() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          if (
            Date.parse(this.form.CreateTime[0]) >=
            Date.parse(this.form.CreateTime[1])
          ) {
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
          let parameters = Object.assign({
          }, this.form, {
            Btime: bTime,
            Etime: eTime,
            BargainTitle: this.form.BargainTitle.trim(),
            CancelMinutes: this.form.CancelMinutes * this.cancelType,
            ValidityMinutes: this.form.ValidityMinutes * 60,
            Items: this.activeGoods,
            Addrs: this.activeAddrs
          })
          let api = this.form.BargainId
            ? SPREAD_API_BARGAIN_UPDATE
            : SPREAD_API_BARGAIN_CREATE
          this.$store.commit('SET_BTN_LOADING', true)
          api(parameters).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$router.push({
                path: '/spread/activityBargain/index'
              })
              this.$message.success(res.data.Message)
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    nextSecond() {
      if (!this.activeGoods.length) {
        this.$message.warning('请先添加活动商品！')
        return false
      }
    },
    iClick() {
      document.getElementById('flileImg').click()
    },
    listenSelectGoods(flag, data) {
      this.selectGoodsVisible = false
      if (flag) {
        let isNew = true
        this.activeGoods.forEach((item) => {
          if (item.ProductId === data.ProductId) {
            this.$message.error('商品已存在')
            isNew = false
          }
        })
        if (isNew) {
          this.activeGoods.unshift(data)
          this.activeGoods.map((item, index) => {
            item.Index = index
            item.Edit = false
            return item
          })
          this.$message.success('添加成功')
        }
      }
    },
    editGood(row) {
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
    saveGood(row) {
      if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.AvailablePrice)) {
        this.$message.warning('请输入可砍金额！')
        return false
      } else if (parseFloat(row.AvailablePrice) >= row.SalePrice) {
        this.$message.warning('可砍金额必须小于售价！')
        return false
      } else {
        if (!/^[1-9]\d*$/.test(row.SelfAmt)) {
          this.$message.warning('请输入正整数的可砍次数！')
          return false
        }
        if (
          !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.SelfPrice1) ||
          !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.SelfPrice2)
        ) {
          this.$message.warning('请输入自砍金额范围！')
          return false
        } else if (parseFloat(row.SelfPrice1) > parseFloat(row.SelfPrice2)) {
          this.$message.warning('自砍金额起始值不能大于结束值范围！')
          return false
        } else if (
          parseFloat(row.SelfPrice2) > parseFloat(row.AvailablePrice)
        ) {
          this.$message.warning('自砍金额结束值不能大于可砍金额！')
          return false
        } else if (parseFloat(row.SelfPrice1) <= 0) {
          this.$message.warning('砍价范围要大于0')
        }
        if (
          !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.HelpPrice1) ||
          !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.HelpPrice2)
        ) {
          this.$message.warning('请输入好友帮砍金额范围！')
          return false
        } else if (parseFloat(row.HelpPrice1) > parseFloat(row.HelpPrice2)) {
          this.$message.warning('好友帮砍金额起始值不能大于结束值范围！')
          return false
        } else if (
          parseFloat(row.HelpPrice2) > parseFloat(row.AvailablePrice)
        ) {
          this.$message.warning('好友帮砍金额结束值不能大于可砍金额！')
          return false
        } else if (parseFloat(row.HelpPrice1) <= 0) {
          this.$message.warning('砍价范围要大于0')
          return false
        }
      }
      this.activeGoods.findIndex(item => item.ProductId === row.ProductId) >= 0 ? this.$set(
        this.activeGoods,
        this.activeGoods.findIndex(item => item.ProductId === row.ProductId),
        Object.assign(row, {
          Edit: false 
        })
      ) | this.$message.success('保存成功') : this.$message.success('保存失败')
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
    cancelGood(row) {
      this.$set(this.activeGoods, row.Index, this.oldItem)
      this.editing = false
    },
    listenSelectStore(flag, data) {
      this.selectStoreVisible = false
      if (flag) {
        let haiAddrs = []
        this.activeAddrs.forEach((item) => {
          haiAddrs.push(item.AddressId)
        })
        data.forEach(item => {
          if (haiAddrs.indexOf(item.AddressId) == -1) {
            this.activeAddrs.unshift(item)
          }
        })
      }
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
    getGoods () {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_BARGAIN_SEARCHITEMS({
        BargainId: this.form.BargainId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          let activeGoods = JSON.parse(JSON.stringify(res.data.Data.rows))
          activeGoods.map((item, index) => {
            item.Index = index
            item.Edit = false
            return item
          })
          this.activeGoods = activeGoods
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getAddrs () {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_BARGAIN_SEARCHADDRS({
        BargainId: this.form.BargainId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.activeAddrs = res.data.Data.rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    success() {
      if (this.activeAddrs.length) {
        this.qrcodeVisible = true
        this.codeData = {
          url: this.form.AppletImageUrl,
          id: this.form.BargainId,
          type: SpreadType.Bargain
        }
      } else {
        this.$message.warning('请先添加提货地址！')
      }
    },
    qrcodeClose(flg) {
      this.qrcodeVisible = false
      flg &&
        this.$router.push({
          path: '/spread/activityBargain/index'
        })
    }
  },
  beforeMount() {
    this.form.BargainId = this.$route.query.id || 0
    if (this.form.BargainId) {
      this.getDetail()
      this.getGoods()
      this.getAddrs()
    }
  },
  watch: {
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

