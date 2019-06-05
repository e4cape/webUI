<template>
  <div class="content">
    <!-- @module Panel -->
    <el-form label-position="right" label-width="133px" ref="editForm" class="fix-w" :model="form" :rules="rules" show-message>
      <el-form-item label="活动名称：" prop="CollageTitle">
        <el-input name="CollageTitle" v-model="form.CollageTitle" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="活动时间：" prop="CreateTime">
        <el-date-picker name="CreateTime" v-model="form.CreateTime" :unlink-panels="true" type="datetimerange" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="商品限购：" prop="LimitType">
        <el-radio-group v-model="form.LimitType">
          <el-radio :label="parseInt(limitType.More)">
            <span>同一用户限购</span><el-input class="m-r-5 m-l-5" v-model="form.LimitTimes" @keyup.native="form.LimitTimes = $root.toFixed(form.LimitTimes, 0)" style="width: 80px!important;" placeholder=""></el-input><span>次</span>
          </el-radio>
          <el-radio :label="parseInt(limitType.None)">不限</el-radio>
        </el-radio-group>
        <div class="alertS">商品默认每次只能买一件</div>
      </el-form-item>-->
      <el-form-item label="组团有效期：" prop="ValidityMinutes">
        <el-input name="ValidityMinutes" v-model="form.ValidityMinutes" :maxlength="7" class="medium-input"></el-input>
        <span>小时</span>
        <div class="alertS">开团并支付成功后规定时间为组团有效期，建议设置24小时；开团有效期超过活动结束时间时，活动结束时间即为开团有效期结束时间。</div>
      </el-form-item>
      <el-form-item label="订单自动取消时间：" prop="CancelMinutes">
        <el-input name="CancelMinutes" v-model="form.CancelMinutes" :maxlength="7" class="medium-input"></el-input>
        <el-select name="cancelType" v-model="cancelType" class="medium-select" filterable>
          <el-option label="分钟" :value="1"></el-option>
          <el-option label="小时" :value="60"></el-option>
        </el-select>
        <div class="alertS">买家提交订单后在指定的时间内未支付，订单自动取消，不得小于5分钟。</div>
      </el-form-item>
      <el-form-item label="未成团订单处理：" class="is-required">
        <el-radio-group name="HandleType" v-model="form.HandleType">
          <el-radio v-for="(item, index) in collageBasicHandleType.Types" :key="index" :label="parseInt(index)">{{item}}</el-radio>
        </el-radio-group>
        <div class="alertS" v-if="form.HandleType != collageBasicHandleType.Refund">系统会在组团有效期结束前对未凑够人数的团自动分配“匿名买家”凑满人数，以便成团。商家只需向真实付款的买家发货。</div>
      </el-form-item>
      <el-form-item label="活动商品：" class="is-required">
        <el-button name="btnSelectGoods" type="primary m-r-5" @click="selectGoodsVisible = true">添加商品</el-button>
        <span class="alertS m-l-5">请提前在活动商品中建好活动商品，以便选择。虚拟商品无需提货，客户支付完成后系统将自动发货！</span>
      </el-form-item>
      <el-form-item label>
        <!-- Data Table -->
        <el-table :data="activeGoods" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="ProductId" label="商品编码" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductType" label="商品类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{productType.Types[scope.row.ProductType]}}</template>
          </el-table-column>
          <el-table-column prop="SummaryQty" label="库存" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="120" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.LabelPrice}}</template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="120" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.SalePrice}}</template>
          </el-table-column>
          <el-table-column prop="TeamQty" label="成团人数/团" class-name="hd-required" width="140">
            <template slot-scope="scope">
              <template v-if="scope.row.Edit">
                <div>
                  <el-input name="TeamQty" style="width: 90px !important;" :maxlength="2" v-model="scope.row.TeamQty" @keyup.native="scope.row.TeamQty = $root.toFixed(scope.row.TeamQty, 0)"></el-input>
                </div>
                <div>
                  <el-input name="TeamQty1" style="width: 90px !important;" :maxlength="2" v-model="scope.row.TeamQty1" @keyup.native="scope.row.TeamQty1 = $root.toFixed(scope.row.TeamQty1, 0)"></el-input>
                </div>
              </template>
              <template v-else>
                <div>{{scope.row.TeamQty}}</div>
                <div v-if="scope.row.TeamQty1">{{scope.row.TeamQty1}}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="MemberPrice" label="成员拼团价" class-name="hd-required" width="140">
            <template slot-scope="scope">
              <template v-if="scope.row.Edit">
                <div>
                  ￥
                  <el-input
                    name="MemberPrice"
                    style="width: 90px !important;"
                    :maxlength="9"
                    v-model="scope.row.MemberPrice"
                    @keyup.native="scope.row.MemberPrice = $root.toFixed(scope.row.MemberPrice, 2)"
                  ></el-input>
                </div>
                <div>
                  ￥
                  <el-input
                    name="MemberPrice1"
                    style="width: 90px !important;"
                    :maxlength="9"
                    v-model="scope.row.MemberPrice1"
                    @keyup.native="scope.row.MemberPrice1 = $root.toFixed(scope.row.MemberPrice1, 2)"
                  ></el-input>
                </div>
              </template>
              <template v-else>
                <div>￥{{scope.row.MemberPrice}}</div>
                <div v-if="scope.row.TeamQty1">￥{{scope.row.MemberPrice1}}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="ChiefPrice" label="团长拼团价" class-name="hd-required" width="140">
            <template slot-scope="scope">
              <template v-if="scope.row.Edit">
                <div>
                  ￥
                  <el-input
                    name="ChiefPrice"
                    style="width: 90px !important;"
                    :maxlength="9"
                    v-model="scope.row.ChiefPrice"
                    @keyup.native="scope.row.ChiefPrice = $root.toFixed(scope.row.ChiefPrice, 2)"
                  ></el-input>
                </div>
                <div>
                  ￥
                  <el-input
                    name="ChiefPrice1"
                    style="width: 90px !important;"
                    :maxlength="9"
                    v-model="scope.row.ChiefPrice1"
                    @keyup.native="scope.row.ChiefPrice1 = $root.toFixed(scope.row.ChiefPrice1, 2)"
                  ></el-input>
                </div>
              </template>
              <template v-else>
                <div>￥{{scope.row.ChiefPrice}}</div>
                <div v-if="scope.row.TeamQty1">￥{{scope.row.ChiefPrice1}}</div>
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
        <!-- end Table -->
      </el-form-item>
      <el-form-item label="商品领取地址：" class="is-required">
        <el-button name="btnSelectStore" type="primary" @click="selectStoreVisible = true">选择门店</el-button>
        <span class="alertS m-l-5">注意：虚拟商品无需提货，客户支付后系统将自动发货。</span>
      </el-form-item>
      <el-form-item label>
        <!-- Data Table -->
        <el-table select="mini" :data="activeAddrs" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="Name" label="门店名称" max-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mobile" label="联系电话" width="120" show-overflow-tooltip></el-table-column>
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
      <el-button name="btnCancel" @click="$router.push({path: '/spread/activitySpellGroup/index'})">取消</el-button>
    </el-row>

    <!-- selectGoods -->
    <selectGoods v-if="selectGoodsVisible" :selectGoodsVisible="selectGoodsVisible" @listenSelectGoods="listenSelectGoods" activeType="spellGroup"></selectGoods>

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
  UploadFileType,
  LimitType,
  RmaType,
  CollageBasicHandleType,
  ProductType
} from '@/enums/spread'
import {
  SPREAD_API_COLLAGE_DETAIL,
  SPREAD_API_COLLAGE_SEARCHITEMS,
  SPREAD_API_COLLAGE_SEARCHADDRS,
  SPREAD_API_COLLAGE_UPDATE,
  SPREAD_API_COLLAGE_CREATE
} from '@/apis/spread'
export default {
  data() {
    return {
      rmaType: RmaType,
      productType: ProductType,
      limitType: LimitType,
      collageBasicHandleType: CollageBasicHandleType,
      selectGoodsVisible: false,
      selectStoreVisible: false,
      uploadUrl:
        this.$root.settings.DOMAIN_APIS.Spread +
        '/api/Upload/File?id=' +
        UploadFileType.BannerImageUrl,
      isUpload: false,
      form: {
        CollageId: 0,
        CollageTitle: '',
        LimitType: LimitType.One,
        LimitTimes: '1',
        HandleType: CollageBasicHandleType.Trade,
        CreateTime: '',
        CancelMinutes: 5,
        ValidityMinutes: 24,
        Note: ''
      },
      cancelType: 1,
      activeGoods: [],
      activeAddrs: [],
      rules: {
        CollageTitle: [
          {
            required: true, message: '请填写活动名称', trigger: 'change'
          }
        ],
        LimitType: {
          validator: (rule, value, callback) => {
            if (value == LimitType.More && (!this.form.LimitTimes || this.form.LimitTimes == '0')) {
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
        ],
        ValidityMinutes: [
          {
            required: true, message: '请填写组团有效期', trigger: 'change'
          },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error('请输入正整数的组团有效期'))
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
      html: '',
      qrcodeVisible: false,
      cropperVisible: false,
      cropperUrl: '',
      codeData: {
      }
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_DETAIL({
        CollageId: this.form.CollageId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.html = res.data.Data.Note
          this.form.CreateTime = [this.form.Btime, this.form.Etime]
          this.form.ValidityMinutes = this.form.ValidityMinutes / 60
        } else {
          this.$message.error(res.data.Message)
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
          } else if (this.editing) {
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
          this.activeGoods.map(item => {
            if (!item.TeamSettings) {
              item.TeamSettings = JSON.parse(item.Teams)
            }
          })
          let parameters = Object.assign({}, this.form, {
            Btime: bTime,
            Etime: eTime,
            CollageTitle: this.form.CollageTitle,
            CancelMinutes: this.form.CancelMinutes * this.cancelType,
            ValidityMinutes: this.form.ValidityMinutes * 60,
            Items: this.activeGoods,
            Addrs: this.activeAddrs,
            LimitType: 3 // 拼团默认不限
          })
          let api = this.form.CollageId
            ? SPREAD_API_COLLAGE_UPDATE
            : SPREAD_API_COLLAGE_CREATE
          this.$store.commit('SET_BTN_LOADING', true)
          api(parameters).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              if (!this.form.CollageId) {
                this.form.CollageId = res.data.Data.CollageId
              }
              this.$router.push({
                path: '/spread/activitySpellGroup/index'
              })
              this.$message.success(res.data.Message)
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    iClick() {
      document.getElementById('flileImg').click()
    },
    listenSelectGoods(flg, data) {
      this.selectGoodsVisible = false
      if (flg) {
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
            item.Teams && JSON.parse(item.Teams).forEach((t, index) => {
              item['TeamQty' + (index ? '1' : '')] = t.TeamQty
              item['MemberPrice' + (index ? '1' : '')] = t.MemberPrice
              item['ChiefPrice' + (index ? '1' : '')] = t.ChiefPrice
            })
            return item
          })
          this.$message.success('添加成功')
        }
      }
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_SEARCHITEMS({
        CollageId: this.form.CollageId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.editing = false
          this.activeGoods = res.data.Data.rows.map((item, index) => {
            item.Index = index
            item.Edit = false
            item.Teams && JSON.parse(item.Teams).forEach((t, index) => {
              item['TeamQty' + (index ? '1' : '')] = t.TeamQty
              item['MemberPrice' + (index ? '1' : '')] = t.MemberPrice
              item['ChiefPrice' + (index ? '1' : '')] = t.ChiefPrice
            })
            return item
          })
        }
      })
    },
    editGood(row) {
      if (!this.editing) {
        this.oldItem = row
        this.$set(
          this.activeGoods,
          row.Index,
          Object.assign({}, row, {
            Edit: true
          })
        )
        this.editing = true
      } else {
        this.$message.warning('有数据在编辑中，请先保存！')
      }
    },
    saveGood(row) {
      if (
        (!row.TeamQty || !row.MemberPrice || !row.ChiefPrice) && (!row.TeamQty1 || !row.MemberPrice1 || !row.ChiefPrice1)
      ) {
        this.$message.warning('请设定拼团数据！')
        return false
      } else if (row.TeamQty && row.TeamQty1 && parseInt(row.TeamQty) === parseInt(row.TeamQty1)) {
        this.$message.warning('不能创建两个相同的拼团人数！')
        return false
      } else if (row.TeamQty > 10 || row.TeamQty1 > 10 || row.TeamQty <= 0 || row.TeamQty <= 0) {
        this.$message.warning('请输入2-10的拼团人数！')
        return false
      } else if (row.TeamQty && (!parseFloat(row.MemberPrice) || !parseFloat(row.ChiefPrice))) {
        this.$message.warning(row.TeamQty + '人团的拼团价不能为零！')
        return false
      } else if (row.TeamQty1 && (!parseFloat(row.MemberPrice1) || !parseFloat(row.ChiefPrice1))) {
        this.$message.warning(row.TeamQty1 + '人团的拼团价不能为零！')
        return false
      } else if (row.SalePrice < row.MemberPrice || row.SalePrice < row.MemberPrice1 || row.SalePrice < row.ChiefPrice || row.SalePrice < row.ChiefPrice1) {
        this.$message.warning('拼团价不能大于售价！')
        return false
      } else {
        row.TeamSettings = []
        if (row.TeamQty && row.MemberPrice && row.ChiefPrice) {
          row.TeamSettings.push({
            TeamQty: row.TeamQty,
            MemberPrice: row.MemberPrice,
            ChiefPrice: row.ChiefPrice
          })
        }
        if (row.TeamQty1 && row.MemberPrice1 && row.ChiefPrice1) {
          row.TeamSettings.push({
            TeamQty: row.TeamQty1,
            MemberPrice: row.MemberPrice1,
            ChiefPrice: row.ChiefPrice1
          })
        }
      }
      if (row.TeamQty || row.MemberPrice || row.ChiefPrice) {
        if (!/^[1-9]+\d*$/.test(row.TeamQty) || parseInt(row.TeamQty) < 2) {
          this.$message.warning('请输入不小于2的成团人数！')
          return false
        }
        if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.MemberPrice)) {
          this.$message.warning('请输入大于0成员拼团价！')
          return false
        }
        if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.ChiefPrice)) {
          this.$message.warning('请输入大于0团长拼团价！')
          return false
        }
      }
      if (row.TeamQty1 || row.MemberPrice1 || row.ChiefPrice1) {
        if (!/^[1-9]+\d*$/.test(row.TeamQty1) || parseInt(row.TeamQty1) < 2) {
          this.$message.warning('请输入大于2的成团人数！')
          return false
        }
        if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.MemberPrice1)) {
          this.$message.warning('请输入非负成员拼团价！')
          return false
        }
        if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(row.ChiefPrice1)) {
          this.$message.warning('请输入非负团长拼团价！')
          return false
        }
      }
      this.$set(
        this.activeGoods,
        row.Index,
        Object.assign(row, {
          Edit: false
        })
      )
      this.editing = false
      return true
    },
    delGood(row) {
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
      }).catch(() => { })
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
      }).catch(() => { })
    },
    getAddrs() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_SEARCHADDRS({
        CollageId: this.form.CollageId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.activeAddrs = res.data.Data.rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    qrcodeClose(flg) {
      this.qrcodeVisible = false
      flg &&
        this.$router.push({
          path: '/spread/activitySpellGroup/index'
        })
    }
  },
  beforeMount() {
    this.form.CollageId = this.$route.query.id || 0
    if (this.form.CollageId) {
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
