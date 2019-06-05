<template>
  <el-card shadow="never" class="userInfoCard">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="12">
          <user-info :scope="userinfos" :isLink="false"></user-info>
        </el-col>
        <el-col :span="12">
          <div class="btnGroup" v-if="upgradeStatus != 2 && isOperable">
            <el-button name="btnOpenEditDataModal" type="primary" @click="openEditDataModal">修改基本资料</el-button>
            <el-button name="btnOpenAddEntryRecordModal" type="primary" @click="openAddEntryRecordModal">添加进店记录</el-button>
            <el-button name="btnOpenAddVisitRecordModal" v-if="$store.getters.wechatSettingType != companyBasicMountType.Company" type="primary" @click="openAddVisitRecordModal">添加回访记录</el-button>
            <el-button name="btnOpenAddremarksModal" type="primary" @click="openAddremarksModal">添加备注</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tabs">
      <span @click="tabClick(1)" :class="activeName == 1 ? 'tab active' : 'tab'">基本资料</span>
      <span @click="tabClick(2)" :class="activeName == 2 ? 'tab active' : 'tab'">消费记录</span>
      <span @click="tabClick(3)" :class="activeName == 3 ? 'tab active' : 'tab'">退货记录</span>
      <span @click="tabClick(4)" :class="activeName == 4 ? 'tab active' : 'tab'">礼品兑换</span>
      <span @click="tabClick(5)" :class="activeName == 5 ? 'tab active' : 'tab'">积分/礼金</span>
      <span @click="tabClick(6)" :class="activeName == 6 ? 'tab active' : 'tab'">收益</span>
      <span @click="tabClick(10)" :class="activeName == 10 ? 'tab active' : 'tab'">卡券</span>
      <span @click="tabClick(7)" :class="activeName == 7 ? 'tab active' : 'tab'">进店记录</span>
      <span @click="tabClick(8)" :class="activeName == 8 ? 'tab active' : 'tab'">回访记录</span>
      <span @click="tabClick(9)" :class="activeName == 9 ? 'tab active' : 'tab'">备注</span>
    </div>
    <div class="centent">
      <div v-if="activeName == 1">
        <el-row>
          <el-col :span="19">
            <tabulation :data="currInfo">
              <tr>
                <td colspan="6" style="padding: 10px 10px 0">
                  <div class="tableButton">
                    <template v-if="memberTagIds && memberTagIds.length != 0">
                      <span v-for="(item, index) in memberTagIds" :key="index">
                        <el-tag type="info">{{item.tagName}}</el-tag>
                      </span>
                    </template>
                    <span v-if="memberTagIds && memberTagIds.length == 0">还未添加标签</span>
                  </div>
                </td>
              </tr>
            </tabulation>
          </el-col>
          <el-col :span="5">
            <div class="userAvatar">
              <img v-if="userinfos.imageUrl" :src="userinfos.imageUrl.indexOf('http') > -1 ? userinfos.imageUrl : $root.settings.DOMAIN_IMAGE + userinfos.imageUrl" alt="客户头像" class="avatar">
              <div class="score">综合评分{{userinfos.score}}</div>
              <div class="text">评分系统暂未开放</div>
            </div>
          </el-col>
        </el-row>
        <div class="score-explain">
          <div class="hd">评分说明</div>
          <div class="aline"/>
          <div class="bd">
            <dl class="formula">
              <dt>
                <p>综合评分</p>
                <span>（总分1000）</span>
              </dt>
              <dd class="sp"/>
              <dt>
                <p>活跃度</p>
                <span>（总分200）</span>
              </dt>
              <dd/>
              <dt>
                <p>忠诚度</p>
                <span>（总分200）</span>
              </dt>
              <dd/>
              <dt>
                <p>购买力</p>
                <span>（总分200）</span>
              </dt>
              <dd/>
              <dt>
                <p>身份</p>
                <span>（总分200）</span>
              </dt>
              <dd/>
              <dt>
                <p>行为</p>
                <span>（总分200）</span>
              </dt>
            </dl>
            <dl class="formula-detail">
              <dd>活跃度（总分200）：</dd>
              <dt>进入微信H5页面，每次+1分，每天最多加2分</dt>
              <dd>购买力（总分200）：</dd>
              <dt>购买一次+10分，购买每满1000，再+1分，不足不加分。退货扣回分数。</dt>
              <dd>忠诚度（总分200）：</dd>
              <dt>本店第2次购买+20分。第3次购买+30分，第4次购买+40分，依次类推。退货扣20分。</dt>
              <dd>身份（总分200）：</dd>
              <dt>
                会员等级1-9级，依次10-90分，完善手机号码+10分，验证手机号码+20分，完善出生日期+10分，
                完善生日+10分，打赏一次+10分，评分一次+5分。
              </dt>
              <dd>行为（总分200）：</dd>
              <dt>参加一次活动+2分，使用一次卡券+2分，转发一次+1分，转发后引入粉丝+5分，粉丝转化为会员+10分，到店一次（记录一次到店记录）+2分。</dt>
            </dl>
          </div>
        </div>
      </div>
      <div v-if="activeName == 2">
        <el-row class="content">
          <div v-loading="$store.getters.tb_loading">
            <table class="retail-table" cellspacing="0" cellpadding="0" border="0" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
              <tbody>
                <tr class="table-hd">
                  <th>货品信息</th>
                  <th v-if="$store.getters.wechatSettingType != companyBasicMountType.Store">门店</th>
                  <th>金额</th>
                  <th>参与活动</th>
                  <th>付款情况</th>
                  <th>销售时间</th>
                </tr>
                <tr v-for="(item, index) in expensesRecord" :key="index">
                  <td colspan="7">
                    <div :ref="'table_item_'+item.$index" class="item-show-some item-warpper" style="max-height: initial">
                      <div class="info-head">
                        <el-row class="cell">
                          <div>
                            <span>
                              {{item.masterCode}}
                              <span style="margin-left:5px;" class="el-tag el-tag--info-61a9da el-tag--mini">{{retailOrderMasterTerminalTypes.Types[item.terminalType]}}</span>
                            </span>
                          </div>
                          <div class="text">
                            <!-- <span style="margin-right:0;">会员:{{item.trueName}}</span> -->
                            <span>{{item.Mobile && '('+ item.mobile +')'}}</span>
                          </div>
                          <div class="text">
                            <span>收银: {{item.cashierUser || '未知'}}</span>
                            <span>主销导购: {{item.mainUser}}</span>
                            <!-- <span>{{item.assistUser && '辅销导购:'+ item.assistUser}}</span> -->
                          </div>
                        </el-row>
                      </div>

                      <table class="retail-table-inline" cellspacing="0" cellpadding="0">
                        <tbody>
                          <tr v-for="(val, key) in item.orderItem" :key="key">
                            <td style="border-left: 1px solid #e5e5e5; padding-left: 16px;">
                              <template>
                                <div class="clearfix tl">
                                  <div class="show2line" v-if="val.isJunk !== YNStatus.Yes">
                                    <p>
                                      <span style="cursor: inherit">{{val.storeBarCode}}</span>
                                      <span class="el-tag el-tag--info-b1b1b1 el-tag--mini" v-if="val.returnState === retailOrderSellBasicReturnStates.ReturnOrder">已退货</span>
                                    </p>
                                    <p>
                                      <span style="cursor: inherit, color: #333;">{{val.goodsName}}</span>
                                    </p>
                                  </div>
                                  <div class="show2line text-overflow" v-else>
                                    <p>
                                      <span style="cursor: inherit">{{val.junkCode}}</span>
                                      <span class="el-tag el-tag--555 el-tag--mini">{{val.junkSourceType === retailOrderBackProductSourceTypes.Coupon ? '卡券换购' : '旧货抵扣'}}</span>
                                    </p>
                                    <p>
                                      <span style="cursor: inherit; color: #333;">{{val.goodsName}}</span>
                                    </p>
                                  </div>
                                </div>
                              </template>
                            </td>
                            <td v-if="$store.getters.wechatSettingType != companyBasicMountType.Store">
                              <template class="tc">
                                <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                                  <span class="text-overflow">{{item.storeName}}</span>
                                </div>
                              </template>
                            </td>
                            <td>
                              <template class="tc">
                                <div v-if="val.isJunk === YNStatus.No && val.productPrice === val.cashPrice">
                                  <span>￥{{val.cashPrice}}</span>
                                </div>
                                <div :class="val.productPrice !== val.cashPrice ? 'show2line' : ''" v-else-if="val.isJunk === YNStatus.No && val.productPrice !== val.cashPrice">
                                  <span>应付:￥{{val.productPrice}}</span>
                                  <br>
                                  <span>实付:￥{{val.cashPrice}}</span>
                                </div>
                                <div class="show2line" v-else-if="val.isJunk !== retailOrderBackProductSourceTypes.Coupon">
                                  <span>回收金额:￥{{val.recallPrice}}</span>
                                  <br>
                                  <span>回收工费:￥{{val.recallFee}}</span>
                                </div>
                                <div class="show2line" v-else>
                                  <span>回收金额:￥{{val.recallPrice}}</span>
                                  <br>
                                  <span>折旧工费:￥{{val.recallFee}}</span>
                                </div>
                              </template>
                            </td>
                            <td>
                              <template>
                                <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                                  <span v-if="val.marproTitle && val.giftType !== giftTypes.Gift">{{val.marproTitle}}</span>
                                  <span v-else-if="val.isJunk === YNStatus.No && val.giftType !== giftTypes.Gift" class="red">无</span>
                                  <span v-else>-</span>
                                </div>
                              </template>
                            </td>
                            <td :rowspan="item.orderItem.length" :colspan="1" v-if="key < 1">
                              <template>
                                <div :class="[ item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                                  <div class="price-list">
                                    <div v-if="item.productPrice === item.cashPrice">
                                      <p>￥{{item.cashPrice}}</p>
                                    </div>
                                    <div v-else-if="item.productPrice !== item.cashPrice">
                                      <p>
                                        <span class="tr">应付：</span>
                                        <span class="tl">￥{{item.productPrice}}</span>
                                      </p>
                                      <p>
                                        <span class="tr">实付：</span>
                                        <span class="tl">￥{{item.cashPrice}}</span>
                                      </p>
                                    </div>
                                    <div class="pay-type" v-if="item.paymentItem.length">
                                      <span
                                        class="text_overflow"
                                        style="max-width:40%;"
                                        v-for="(item1, index1) in item.paymentItem"
                                        :key="index1"
                                      >{{ item.paymentItem.length >= 1 && index1 === 0 ? item1.categoryName : "，" + item1.categoryName}}</span>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </td>
                            <td :rowspan="item.orderItem.length" :colspan="1" v-if="key < 1">
                              <template>
                                <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                                  <p>{{item.orderTime}}</p>
                                </div>
                              </template>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!expensesRecord.length && !$store.getters.tb_loading" class="el-table__empty-block" style="width: 100%; border-bottom: 1px solid #e5e5e5">
              <span class="el-table__empty-text">暂无数据</span>
            </div>
          </div>
        </el-row>
        <div class="consumer-return-record">
          共消费
          <b>{{expensesTotal.totalCount}}</b>
          次，购买
          <b>{{expensesTotal.totalGoods}}</b>
          件商品，共
          <b>{{expensesTotal.totalPrice}}</b>元
        </div>
      </div>
      <div v-if="activeName == 3">
        <el-table :data="returnRecord" key="returnRecord">
          <el-table-column prop="createTime" label="退货时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="returnCode" label="单据编号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sellCode" label="原销售单" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="$store.getters.wechatSettingType != companyBasicMountType.Store" prop="storeName" label="门店" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productTitle" label="商品信息" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productPrice" label="商品售价" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.productPrice}}</template>
          </el-table-column>
          <el-table-column prop="awaitPrice" label="应退金额" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.awaitPrice}}</template>
          </el-table-column>
          <el-table-column prop="returnPrice" label="实退金额" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.returnPrice}}</template>
          </el-table-column>
        </el-table>
        <div class="consumer-return-record">
          共退货
          <b>{{returnTotal.totalCount}}</b>
          次， 共
          <b>{{returnTotal.totalGoods}}</b>
          件商品， 共
          <b>{{returnTotal.totalPrice}}</b>元
        </div>
      </div>
      <div v-if="activeName == 4">
        <el-table :data="exChangeRecord" key="exChangeRecord">
          <el-table-column prop="orderCode" label="礼品单号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="140" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.createTime | filterDateTime}}</template>
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间" width="140" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.payTime | filterDateTime}}</template>
          </el-table-column>
          <el-table-column prop="orderStatusText" label="状态" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="礼品信息" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.giftName}}&nbsp;&nbsp;{{scope.row.attributeTexts}}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="scoreTypeText" label="兑换类型" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="exchangeQuantity" label="兑换量" width="80" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="consumer-return-record">
          共兑换
          <b>{{exChangeTotal.giftCount}}</b> 次，兑换
          <b>{{exChangeTotal.orderCount}}</b> 件商品，积分使用
          <b>{{exChangeTotal.totalScore}}</b> ，礼金使用
          <b>{{exChangeTotal.totalGoldenRice}}</b>
        </div>
      </div>
      <div v-if="activeName == 5">
        <el-table :data="balanceData" key="balanceData">
          <el-table-column prop="createTime" label="操作时间" width="140" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.createTime | filterDateMinutes}}</template>
          </el-table-column>
          <el-table-column prop="logTypeText" label="操作类型" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="scoreTypeText" label="礼金类型" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="recordText" label="收入/支出" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amount" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="prevOrderCode" label="相关单据" min-width="160" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="consumer-return-record">
          积分：剩余
          <b>{{scoreLogList.scoreTotal}}</b>
          ，累计赠送
          <b>{{scoreLogList.scoreGiveTotal}}</b>
          (不含退货)，兑换
          <b>{{scoreLogList.scoreExchangeTotal}}</b>
          (不含取消和作废)，到期未用
          <b>{{scoreLogList.scoreOverdueTotal}}</b>
          <br>礼金：剩余
          <b>{{scoreLogList.goldenRiceTotal}}</b>
          ，累计赠送
          <b>{{scoreLogList.goldenRiceGiveTotal}}</b>
          (不含退货)，兑换
          <b>{{scoreLogList.goldenRiceExchangeTotal}}</b>
          (不含取消和作废)，到期未用
          <b>{{scoreLogList.goldenRiceOverdueTotal}}</b>
        </div>
      </div>
      <div v-if="activeName == 6">
        <div v-if="JSON.stringify(memberWalletCouponList)=='{}'" class="entry-record-b-box">暂无收益记录</div>
        <div v-for="(n, index) in memberWalletCouponList" :key="index" class="coupons">
          <div class="hd">{{ n.Name }}</div>
          <div class="bd">
            <ul>
              <template v-if="index == CouponType.Agrece">
                <li v-for="m in n.Coupons" :key="m.CouponId" class="coupons-type1">
                  <div class="bd-con">
                    <div class="item1">
                      <p>
                        <span>商品编号：</span>
                        {{m.ProductNO}}
                      </p>
                      <p>
                        <span>材质类型：</span>
                        {{$store.getters.materialType.Types[m.MaterialType1]}}
                      </p>
                      <p>
                        <span>商品名称：</span>
                        {{m.ProductTitle}}
                      </p>
                      <p>
                        <span>金重：</span>
                        {{$root.toFloat(m.GoldWeight)}}g
                      </p>
                      <p>
                        <span>销售价：</span>
                        ￥{{$root.toFloat(m.ProductPrice)}}
                      </p>
                    </div>
                    <div class="item2">
                      <div class="item2-con">
                        <div class="item2-l"/>
                        <div class="item2-r"/>
                        <em>当前鼓励金可抵扣金额</em>
                        <b>￥{{$root.toFloat(m.ValidPrice)}}</b>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Abandon" class="card-sty" src="@/assets/images/card-2.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Origin" class="card-sty" src="@/assets/images/card-4.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Audit" class="card-sty" src="@/assets/images/card-6.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Locked" class="card-sty" src="@/assets/images/card-8.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Finish" class="card-sty" src="@/assets/images/card-10.png" alt>
                      </div>
                    </div>
                  </div>
                </li>
              </template>
              <template v-if="index == CouponType.Agitate">
                <li v-for="m in n.Coupons" :key="m.CouponId" class="coupons-type3">
                  <div class="bd-con">
                    <div class="item1">
                      <p>
                        <span>商品编号：</span>
                        {{m.ProductNO}}
                      </p>
                      <p>
                        <span>材质类型：</span>
                        {{$store.getters.materialType.Types[m.MaterialType1]}}
                      </p>
                      <p>
                        <span>商品名称：</span>
                        {{m.ProductTitle}}
                      </p>
                      <p>
                        <span>销售价：</span>
                        ￥{{$root.toFloat(m.ProductPrice)}}
                      </p>
                    </div>
                    <div class="item2">
                      <div class="item2-con">
                        <div class="item2-l"/>
                        <div class="item2-r"/>
                        <em>当前置换金可抵扣金额</em>
                        <b>￥{{$root.toFloat(m.ValidPrice)}}</b>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Abandon" class="card-sty" src="@/assets/images/card-2.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Origin" class="card-sty" src="@/assets/images/card-4.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Audit" class="card-sty" src="@/assets/images/card-6.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Locked" class="card-sty" src="@/assets/images/card-8.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Finish" class="card-sty" src="@/assets/images/card-10.png" alt>
                      </div>
                    </div>
                  </div>
                </li>
              </template>
              <template v-if="index == CouponType.Gond">
                <li v-for="m in n.Coupons" :key="m.CouponId" class="coupons-type5">
                  <div class="bd-con">
                    <div class="item1">
                      <p>
                        <span>商品编号：</span>
                        {{m.ProductNO}}
                      </p>
                      <p>
                        <span>材质类型：</span>
                        {{$store.getters.materialType.Types[m.MaterialType1]}}
                      </p>
                      <p>
                        <span>商品名称：</span>
                        {{m.ProductTitle}}
                      </p>
                      <p>
                        <span>销售价：</span>
                        ￥{{$root.toFloat(m.ProductPrice)}}
                      </p>
                    </div>
                    <div class="item2">
                      <div class="item2-con">
                        <div class="item2-l"/>
                        <div class="item2-r"/>
                        <em>当前可用购物金</em>
                        <b>￥{{$root.toFloat(m.ValidPrice)}}</b>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Abandon" class="card-sty" src="@/assets/images/card-2.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Origin" class="card-sty" src="@/assets/images/card-4.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Audit" class="card-sty" src="@/assets/images/card-6.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Locked" class="card-sty" src="@/assets/images/card-8.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Finish" class="card-sty" src="@/assets/images/card-10.png" alt>
                      </div>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </div>
          <div v-if="index == CouponType.Equiv" class="bdcash">
            <ul>
              <li v-for="m in n.Coupons" :key="m.CouponId">
                <div class="bdcash1">
                  <p>
                    <span>商品编号：</span>
                    {{m.ProductNO}}
                  </p>
                  <p>
                    <span>材质类型：</span>
                    {{$store.getters.materialType.Types[m.MaterialType1]}}
                  </p>
                  <p>
                    <span>商品名称：</span>
                    {{m.ProductTitle}}
                  </p>
                  <p>
                    <span>销售价：</span>
                    ￥{{$root.toFloat(m.ProductPrice)}}
                  </p>
                  <div class="bdcash1-r">
                    <p>可</p>
                    <p>用</p>
                    <p>抵</p>
                    <p>用</p>
                    <p>金</p>
                  </div>
                </div>
                <div class="bdcash2">
                  <ul>
                    <li v-for="(k,key) in (m.Cards || [])" :key="key">
                      <div>
                        <div class="cash-coupon-l"/>
                        <div class="cash-coupon-r"/>
                        <em>可用金额</em>
                        <b>￥{{$root.toFloat(k.ValidPrice)}}</b>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Abandon" class="card-sty" src="@/assets/images/card-2.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Origin" class="card-sty" src="@/assets/images/card-4.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Audit" class="card-sty" src="@/assets/images/card-6.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Locked" class="card-sty" src="@/assets/images/card-8.png" alt>
                        <img v-if="m.CouponStatus == WalletCouponStatus.Finish" class="card-sty" src="@/assets/images/card-10.png" alt>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="activeName == 10">
        <div v-loading="cardLoading" class="wrap-card">
          <el-select v-model="cardStatus" @change="changeCardStatus">
            <el-option :value="0" label="所有状态"></el-option>
            <el-option v-for="(item, key) in couponStatus.Types" :key="key" :value="parseInt(key)" :label="item"></el-option>
          </el-select>
          <p class="p-y-10" v-if="cardsData.length < 1">暂时没有卡券！</p>
          <ul class="card-box">
            <li v-for="(item2, index2) in cardsData" :key="index2" class="card-list">
              <img :src="item2.StyleImageUrl?$root.settings.DOMAIN_IMG_FILE+item2.StyleImageUrl:''" alt>
              <img v-if="item2.Status == couponStatus.Origin" class="seal-img" src="@/assets/images/card-1.png" alt>
              <img v-if="item2.Status == couponStatus.Give" class="seal-img" src="@/assets/images/card-3.png" alt>
              <img v-if="item2.Status == couponStatus.Locked" class="seal-img" src="@/assets/images/card-5.png" alt>
              <img v-if="item2.Status == couponStatus.Finish" class="seal-img" src="@/assets/images/card-7.png" alt>
              <img v-if="item2.Status == couponStatus.Expired" class="seal-img" src="@/assets/images/card-9.png" alt>
              <div @click="toCardDetail(item2)" class="coupon-item">
                <div class="top">
                  <div class="logo">{{item2.CouponType === couponSettingType.Sale? couponSaleType.Types[item2.CouponSaleType]:couponSettingType.Types[item2.CouponType]}}</div>
                  <div class="rule">{{item2.RuleType == ruleType.Indefinitely? ruleType.Types[item2.RuleType] : '消费满'+!item2.RulePrice?'0.00':item2.RulePrice.toFixed(2)+'元可用'}}</div>
                </div>
                <div class="middle">
                  <span>
                    <b style="font-size:16px">￥</b>
                    {{$root.toFloat(item2.Price)}}
                  </span>
                </div>
                <div class="bottom">
                  <div class="name">
                    <p>{{item2.CouponName}}</p>
                    <p>{{item2.Expireb | filterDate}} - {{item2.Expiree === '2100-01-01 00:00:00' ? '不限' : $options.filters.filterDate(item2.Expiree)}}</p>
                  </div>
                  <div class="no">NO. {{item2.ItemId}}</div>
                </div>
              </div>
            </li>
          </ul>
          <pagination :total="total" :pg="page.PageIndex" :size="page.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
      <div v-if="activeName == 7">
        <div class="recordTable">
          <ul class="entry-record-lists" v-if="recorData.length != 0">
            <li v-for="(item, index) in recorData" :key="index">
              <div class="entry-record-lists-hd">
                <div
                  class="left"
                >{{currRecorInfo[index].createTime}} / {{currRecorInfo[index].createUser}}{{$store.getters.wechatSettingType != companyBasicMountType.Store ? ` / ${currRecorInfo[index].storeName}` : ''}}</div>
                <a class="right" @click="onDeleteEntryRecordClick(currRecorInfo[index].memberEnterLogId)">
                  <i class="el-icon-delete"></i>
                  删除记录
                </a>
              </div>
              <tabulation :data="item"></tabulation>
            </li>
          </ul>
          <div v-else class="entry-record-b-box">暂无进店记录</div>
        </div>
      </div>
      <div v-if="activeName == 8">
        <el-table :data="returnRecordData" key="returnRecordData">
          <el-table-column prop="createTime" label="回访时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="settingOptionMethodName" label="回访方式" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="$store.getters.wechatSettingType != companyBasicMountType.Store" prop="storeName" label="门店" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createUser" label="记录人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="content" label="回访内容" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="lookOver" @click="onDeleteRecordClick(scope.row.visitLogId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName == 9">
        <el-table :data="addRemarkData" key="addRemarkData">
          <el-table-column prop="createTime" label="备注时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="settingOptionName" label="备注项目" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="storeName" v-if="$store.getters.wechatSettingType != companyBasicMountType.Store" label="门店" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createUser" label="记录人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="content" label="备注内容" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <span class="lookOver" @click="onDeleteRemarkClick(scope.row.memberRemarkId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 编辑个人资料 -->
    <edit-Profile
      :isOffline="isOffline"
      :currUserInfo="currUserInfo"
      :editClientVisible="editClientModal"
      v-on:openLevel="openLevelModal"
      v-on:openGroup="openGroupsModal"
      v-on:openLabel="openLabelModal"
      :level="level"
      :grade="grade"
      :multipleOptions="multipleOptions"
      v-on:confirmClick="confirmEditData"
      v-on:closeClick="colseEditData"
    ></edit-Profile>
    <!-- 进店记录 -->
    <entry-Record :currUserInfo="currUserInfo" :recordVisible="recordModal" v-on:closeClick="closeRecordModal"></entry-Record>
    <!-- 添加备注 -->
    <add-Notes :currUserInfo="currUserInfo" :addRemarkVisible="addRemarkModal" v-on:closeClick="closeAddNotesModal"></add-Notes>
    <!-- 回访记录 -->
    <return-Record :currUserInfo="currUserInfo" :returnRecordVisible="returnRecordModal" v-on:closeClick="closeReturnVisitModal"></return-Record>
    <!-- 设置 -->
    <popup-Table
      :memberTagIds="currUserInfo.memberTagIds"
      :gradeVisible="gradeVisible"
      :title="settingTitle"
      :leftTitle="leftTitle"
      :rightTitle="rightTitle"
      :settingData="settingData"
      v-on:confirmClick="confirmClick"
      v-on:closeClick="closeClick"
      :type="modalType"
    ></popup-Table>
  </el-card>
</template>

<script>
import {
  mixin
} from './common'
import { YNStatus } from '@/enums/common.js'
import { CompanyBasicMountType } from '@/enums/merchant'
import { GiftType } from '@/enums/stocking'
import {
  MEMBERSHIP_API_MEMBER_GETMEMBERINFO,
  MEMBERSHIP_API_MEMBER_GETMEMBERTAGS,
  MEMBERSHIP_API_MEMBERENTERLOG_GETMEMBERENTERLOGLIST,
  MEMBERSHIP_API_MEMBERENTERLOG_DELETEMEMBERENTERLOG,
  MEMBERSHIP_API_VISITLOG_GETVISITLOGS,
  MEMBERSHIP_API_VISITLOG_DELETE,
  MEMBERSHIP_API_MEMBERREMARK_GETMEMBERREMARKLIST,
  MEMBERSHIP_API_MEMBERREMARK_DELETEMEMBERREMARK,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS,
  MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS,
  MEMBERSHIP_API_MARKETING_GETMEMBEREXPENDLIST,
  MEMBERSHIP_API_MARKETING_GETMEMBERRETURNLIST,
  MEMBERSHIP_API_GIFTSERVICE_GETMEMBEREXCHANGES,
  MEMBERSHIP_API_SCORERECORD_GETBALANCELIST
} from '@/apis/membership.js'
import { MemberOpitonTypes } from '@/enums/membership.js'
import { MARKETING_API_WALLET_COUPON_GETS } from '@/apis/marketing'
import { CouponType, WalletCouponStatus } from '@/enums/marketing'
import { RetailOrderBackProductSourceType, RetailOrderSellBasicReturnState, RetailOrderMasterTerminalType } from '@/enums/order'
import { CardStatus, CouponStatus, CouponSettingType, RuleType, CouponSaleType } from '@/enums/scoring'
import {
  SCORING_API_COUPON_ITEM_GETSBYMEMBER
} from '@/apis/scoring.js'
import tabulation from '@/components/scrm/tabulation.vue'
import entryRecord from '@/components/scrm/entryRecord.vue'
import addNotes from '@/components/scrm/addNotes.vue'
import returnRecord from '@/components/scrm/returnVisitRecord.vue'
import editProfile from '@/components/scrm/editProfile.vue'
import popupTable from '@/components/scrm/popupTable.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import pagination from '@/components/pagination.vue'

export default {
  mixins: [mixin],
  components: {
    userInfo,
    tabulation,
    entryRecord,
    addNotes,
    returnRecord,
    editProfile,
    popupTable,
    pagination
  },
  data() {
    return {
      retailOrderMasterTerminalTypes: RetailOrderMasterTerminalType,
      retailOrderSellBasicReturnStates: RetailOrderSellBasicReturnState,
      retailOrderBackProductSourceTypes: RetailOrderBackProductSourceType,
      companyBasicMountType: CompanyBasicMountType,
      giftTypes: GiftType,
      couponStatus: CouponStatus,
      CardStatus,
      CouponType,
      WalletCouponStatus,
      ruleType: RuleType,
      memberOpitonTypes: MemberOpitonTypes,
      couponSettingType: CouponSettingType,
      couponSaleType: CouponSaleType,
      YNStatus,
      cardStatus: 0,  // 卡券状态(默认是所有)
      isOffline: false,
      userinfos: {
      },
      cardsData: [],
      total: 0,
      page: {
        PageIndex: 1,
        PageSize: 20
      },
      cardLoading: false,
      currUserInfo: {
        vipCardNo: '',
        trueName: '',
        mobile: '',
        aliasName: '',
        sexyType: '',
        pcd: '',
        birthday: '',
        dateOfBirthArray: [],
        lunarCalendar: false,
        joinTime: '',
        settingOptionLevelId: '',
        settingOptionGroupId: '',
        remark: '',
        memberTagIds: [],
        areaArr: [],
        provinceName: '',
        cityName: '',
        townName: '',
        settingMemberTags: [],
        qq: '',
        email: '',
        marriageStatus: '0',
        commemorate: ''
      }, // 用户信息
      activeName: 1,
      currInfo: [], // 用户表格信息
      memberTagIds: [], // 用户标签
      recorData: [],
      currRecorInfo: [],
      returnRecordData: [], // 回访记录列表
      addRemarkData: [], // 备注列表
      recordModal: false, // 进店记录弹窗
      editClientModal: false, // 编辑客户资料弹窗
      returnRecordModal: false, // 添加回访记录弹窗
      addRemarkModal: false, // 添加备注弹窗
      gradeVisible: false, // 设置会员等级弹窗
      level: [], // 等级下拉数据
      grade: [], // 分组下来数据
      multipleOptions: [], // 标签下拉列表
      settingTitle: '', // 设置弹窗标题
      settingData: {
      }, // 弹窗数据
      modalType: 0, // 弹窗类型
      leftTitle: '', // 表格左边标题
      rightTitle: '', // 表格右边标题
      expensesRecord: [], // 消费记录
      expensesTotal: {
      }, // 消费记录总数
      returnRecord: [], // 退货记录
      returnTotal: {
      }, // 退货记录总数
      exChangeRecord: [], // 兑换记录
      exChangeTotal: {
      }, // 兑换记录总数
      balanceData: [], // 积分礼金数据
      memberWalletCouponList: {}, // 收益
      scoreLogList: {
      },
      upgradeStatus: 0
    }
  },
  methods: {
    // 打开编辑资料弹窗
    openEditDataModal() {
      this.getMemberLevels()
      this.getClientGroupList()
      this.getClientLabelOptionList()
      this.editClientModal = true
    },
    // 打开添加进店记录弹窗
    openAddEntryRecordModal() {
      this.recordModal = true
    },
    // 打开添加回访记录弹窗
    openAddVisitRecordModal() {
      this.returnRecordModal = true
    },
    // 打开添加备注弹窗
    openAddremarksModal() {
      this.addRemarkModal = true
    },
    // 打开会员等级设置弹窗
    openLevelModal() {
      const [...arr] = this.level
      const obj = {
        data: arr
      }
      this.settingData = obj
      this.settingTitle = '会员等级'
      this.leftTitle = '会员等级'
      this.rightTitle = '等级名称'
      this.modalType = 1
      this.gradeVisible = true
    },
    // 打开会员分组设置弹窗
    openGroupsModal() {
      const [...arr] = this.grade
      const obj = {
        data: arr
      }
      this.settingData = obj
      this.settingTitle = '会员分组'
      this.leftTitle = '分组编号'
      this.rightTitle = '分组名称'
      this.modalType = 2
      this.gradeVisible = true
    },
    // 打开设置标签弹窗
    openLabelModal() {
      const [...arr] = this.multipleOptions
      const obj = {
        data: arr
      }
      this.settingData = obj
      this.settingTitle = '标签设置'
      this.leftTitle = '项目'
      this.rightTitle = '操作'
      this.modalType = 3
      this.gradeVisible = true
    },
    // 切换tab
    tabClick(tab) {
      this.activeName = tab
      switch (tab) {
        case 2:
          this.getMemberExpensesRecord()
          break
        case 3:
          this.getMemberReturnRecord()
          break
        case 4:
          this.getMemberExChangeRecord()
          break
        case 5:
          this.getBalanceList()
          break
        case 6:
          this.getCouponData()
          break
        case 7:
          this.getEntryRecord()
          break
        case 8:
          this.getVisitLogs()
          break
        case 9:
          this.getMemberRemarkList()
          break
        case 10:
          this.getCardsData()
          break
        default:
      }
    },
    // 获取用户信息
    getMemberInfo() {
      MEMBERSHIP_API_MEMBER_GETMEMBERINFO({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          const arr = [
            [
              {
                title: '会员卡号',
                content: res.data.Data.vipCardNo
              },
              {
                title: '微信会员卡',
                // 位运算(方便以后增加新的枚举)
                content: (res.data.Data.option & this.memberOpitonTypes.ReceivedVipCard) == this.memberOpitonTypes.ReceivedVipCard ? '已领取' : '未领取'
              },
              {
                title: '姓名',
                content: res.data.Data.trueName
              }
            ],
            [
              {
                title: '手机',
                content: res.data.Data.mobile
              },
              {
                title: '昵称',
                content: res.data.Data.aliasName
              },
              {
                title: '性别',
                content: res.data.Data.sexyTypeText
              }
            ],
            [
              {
                title: '地区',
                content: res.data.Data.area
              },
              {
                title: '出生日期',
                content: this.$options.filters.filterDate(res.data.Data.birthday)
              },
              {
                title: '生日',
                content:
                  res.data.Data.dateOfBirthText ? res.data.Data.dateOfBirthText + '（' + (res.data.Data.lunarCalendar == 0 ? '公历' : '农历') + '）' : ''
              }
            ],
            [
              {
                title: '微信关注时间',
                content: this.$options.filters.filterDateTime(res.data.Data.subscrTime)
              },
              {
                title: '婚姻状况',
                content: res.data.Data.marriageStatusText
              },
              {
                title: '纪念日',
                content: this.$options.filters.filterAllDate(res.data.Data.commemorate)
              }
            ],
            [
              {
                title: 'QQ',
                content: res.data.Data.qq
              },
              {
                title: '邮箱',
                content: res.data.Data.email
              },
              {
                title: '微信关注来源',
                content: res.data.Data.subscrFromText
              }
            ],
            [
              {
                title: '入会时间',
                content: this.$options.filters.filterDate(res.data.Data.joinTime)
              },
              {
                title: '会员等级',
                content: res.data.Data.level
              },
              {
                title: '客户分组',
                content: res.data.Data.group
              }
            ],
            [
              {
                title: '备注',
                content: res.data.Data.remark,
                colspan: 5
              }
            ]
          ]
          const areaArr = []
          if (res.data.Data.provinceId) {
            areaArr.push(
              res.data.Data.provinceId,
              res.data.Data.cityId,
              res.data.Data.townId
            )
          }
          const userInfoArr = {
            ...this.userinfos,
            ...res.data.Data,
            lunarCalendar: res.data.Data.lunarCalendar ? true : false,
            areaArr,
            memberTagIds: res.data.Data.memberTagIds || []
          }
          this.userinfos = userInfoArr
          this.currInfo = arr
          this.currUserInfo = {
            ...userInfoArr
          }
        }
      })
    },
    // 获取用户标签
    getMemebrLabel() {
      MEMBERSHIP_API_MEMBER_GETMEMBERTAGS({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.currUserInfo.memberTagIds = res.data.Data.memberTags.map(
            item => item.settingMemberTagId
          )
          this.memberTagIds = res.data.Data.memberTags || []
        }
      })
    },
    changeCardStatus() {
      this.page.PageIndex = 1
      this.page.PageSize = 20
      this.getCardsData()
    },
    // 获取卡券信息
    getCardsData() {
      this.cardLoading = true
      SCORING_API_COUPON_ITEM_GETSBYMEMBER(
        Object.assign({}, { MemberId: this.$route.query.memberId, Status: this.cardStatus }, this.page)
      ).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.cardsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.cardLoading = false
      })
    },
    // 跳转到卡券详情
    toCardDetail(data) {
      switch (data.CouponType) {
        case this.couponSettingType.Universal:
          this.$router.push({
            path: '/market/coupon/couponbasic/' + data.CouponId
          })
          break
        case this.couponSettingType.Voucher:
          this.$router.push({
            path: '/market/coupon/giftcouponbasic/' + data.CouponId
          })
          break
        case this.couponSettingType.Sale:
          this.$router.push({
            path: '/market/coupon/salecardsonlinebasic/' + data.CouponId
          })
          break
        default:
      }
    },
    // 编辑资料确认
    confirmEditData(val) {
      this.editClientModal = val
      this.getMemberInfo()
      this.getMemebrLabel()
    },
    // 获取进店记录列表
    getEntryRecord() {
      MEMBERSHIP_API_MEMBERENTERLOG_GETMEMBERENTERLOGLIST({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const recorData = []
          const currRecorInfo = []
          res.data.Data.forEach(item => {
            const arr = [
              [
                {
                  title: '进店时间',
                  content: item.entryTime
                },
                {
                  title: '停留时间',
                  content: item.stayMinute
                }
              ],
              [
                {
                  title: '意向商品1',
                  content: `${item.goodsMaterial1 ||
                    ''} ${item.goodsCategory1 || ''}`
                },
                {
                  title: '意向商品2',
                  content: `${item.goodsMaterial2 ||
                    ''} ${item.goodsCategory2 || ''}`
                }
              ],
              [
                {
                  title: '预算价格',
                  content: `${item.budgetStart ? `${item.budgetStart || ''} ~ ${item.budgetEnd || ''}` : ''}`
                },
                {
                  title: '意向商品价格',
                  content: `${item.goodsPriceStart ? `${item.goodsPriceStart} ~ ${item.goodsPriceEnd}` : ''}`
                }
              ],
              [
                {
                  title: '备注',
                  content: item.remark,
                  colspan: 3
                }
              ]
            ]
            const obj = {
              createTime: item.createTime,
              createUser: item.createUser,
              memberEnterLogId: item.memberEnterLogId,
              storeName: item.storeName
            }
            recorData.push(arr)
            currRecorInfo.push(obj)
          })
          this.recorData = recorData
          this.currRecorInfo = currRecorInfo
        }
      })
    },
    // 获取回访列表
    getVisitLogs() {
      MEMBERSHIP_API_VISITLOG_GETVISITLOGS({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnRecordData = res.data.Data
        }
      })
    },
    // 删除进店记录
    onDeleteEntryRecordClick(memberEnterLogId) {
      const para = {
        memberEnterLogId
      }
      MEMBERSHIP_API_MEMBERENTERLOG_DELETEMEMBERENTERLOG(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            showClose: true,
            message: '成功删除进店记录',
            type: 'success'
          })
          this.getEntryRecord()
        }
      })
    },
    // 删除回访方式记录
    onDeleteRecordClick(visitLogId) {
      const para = {
        visitLogId
      }
      MEMBERSHIP_API_VISITLOG_DELETE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            showClose: true,
            message: '成功删除回访记录',
            type: 'success'
          })
          this.getVisitLogs()
        }
      })
    },
    // 获取用户备注列表
    getMemberRemarkList() {
      MEMBERSHIP_API_MEMBERREMARK_GETMEMBERREMARKLIST({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.addRemarkData = res.data.Data
        }
      })
    },
    // 删除添加备注记录
    onDeleteRemarkClick(memberRemarkId) {
      const para = {
        memberRemarkId
      }
      MEMBERSHIP_API_MEMBERREMARK_DELETEMEMBERREMARK(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            showClose: true,
            message: '成功删除备注',
            type: 'success'
          })
          this.getMemberRemarkList()
        }
      })
    },
    // 编辑资料点击确定
    confirmClick(val) {
      this.settingData = {
      }
      this.gradeVisible = val
      if (this.modalType == 1) {
        this.getMemberLevels()
      }
      if (this.modalType == 2) {
        this.getClientGroupList()
      }
      if (this.modalType == 3) {
        this.getClientLabelOptionList()
      }
    },
    // 关闭编辑资料弹窗
    colseEditData(val) {
      this.editClientModal = val
    },
    // 关闭添加备注弹窗
    closeAddNotesModal(val) {
      this.addRemarkModal = val
      this.getMemberRemarkList()
    },
    // 关闭回访记录弹窗
    closeReturnVisitModal(val) {
      this.returnRecordModal = val
      this.getVisitLogs()
    },
    // 关闭设置弹窗
    closeClick(val) {
      this.settingData = {
      }
      this.gradeVisible = val
    },
    // 关闭进店记录
    closeRecordModal(val) {
      this.recordModal = val
      this.getEntryRecord()
    },
    // 获取客户分组下拉列表
    getClientGroupList() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.grade = res.data.Data
        }
      })
    },
    // 获取会员等级下拉列表
    getMemberLevels() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.level = res.data.Data
        }
      })
    },
    // 获取客户标签下拉列表
    getClientLabelOptionList() {
      MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS().then(res => {
        if (res.data.Code == 'CORRECT') {
          const arr = []
          res.data.Data.forEach(item => {
            const obj = {}; (obj.name = item.name), (obj.settingMemberTagId = item.settingMemberTagId)
            arr.push(obj)
          })
          this.multipleOptions = arr
        }
      })
    },
    // 获取用户消费记录
    getMemberExpensesRecord() {
      MEMBERSHIP_API_MARKETING_GETMEMBEREXPENDLIST({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.expensesRecord = res.data.Data.rows
          const obj = {
            totalCount: res.data.Data.totalCount,
            totalGoods: res.data.Data.totalGoods,
            totalPrice: res.data.Data.totalPrice
          }
          this.expensesTotal = obj
        }
      })
    },
    // 获取用户退货记录
    getMemberReturnRecord() {
      MEMBERSHIP_API_MARKETING_GETMEMBERRETURNLIST({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.returnRecord = res.data.Data.rows
          const obj = {
            totalCount: res.data.Data.totalCount,
            totalGoods: res.data.Data.totalGoods,
            totalPrice: res.data.Data.totalPrice
          }
          this.returnTotal = obj
        }
      })
    },
    // 获取礼品兑换
    getMemberExChangeRecord() {
      MEMBERSHIP_API_GIFTSERVICE_GETMEMBEREXCHANGES({
        memberId: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.exChangeRecord = res.data.Data.items
          const obj = {
            giftCount: res.data.Data.giftCount,
            orderCount: res.data.Data.orderCount,
            totalGoldenRice: res.data.Data.totalGoldenRice,
            totalScore: res.data.Data.totalScore
          }
          this.exChangeTotal = obj
        }
      })
    },
    // 获取收益数据
    getCouponData() {
      MARKETING_API_WALLET_COUPON_GETS({
        MemberId: this.$route.query.memberId,
        PageIndex: 1,
        PageSize: 999
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          let obj = {}
          res.data.Data.Rows && res.data.Data.Rows.forEach(item => {
            if (obj.hasOwnProperty(item.CouponType)) {
              obj[item.CouponType].Coupons.push(item)
            } else {
              obj[item.CouponType] = {
                Value: item.CouponType,
                Name: CouponType.Types[item.CouponType],
                Coupons: [item]
              }
            }
          })
          this.memberWalletCouponList = obj
        }
      })
    },
    // 获取积分礼金
    getBalanceList() {
      MEMBERSHIP_API_SCORERECORD_GETBALANCELIST({
        id: this.$route.query.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          const obj = {
            scoreTotal: res.data.Data.scoreTotal,
            goldenRiceTotal: res.data.Data.goldenRiceTotal,
            scoreGiveTotal: res.data.Data.scoreGiveTotal,
            goldenRiceGiveTotal: res.data.Data.goldenRiceGiveTotal,
            scoreExchangeTotal: res.data.Data.scoreExchangeTotal,
            goldenRiceExchangeTotal: res.data.Data.goldenRiceExchangeTotal,
            scoreOverdueTotal: res.data.Data.scoreOverdueTotal,
            goldenRiceOverdueTotal: res.data.Data.goldenRiceOverdueTotal
          }
          this.scoreLogList = obj
          this.balanceData = res.data.Data.recordOutputs
        }
      })
    },
    currentChange(val) {
      this.page.PageIndex = val
      this.getCardsData()
    },
    sizeChange(val) {
      this.page.PageIndex = 1
      this.page.PageSize = val
      this.getCardsData()
    },
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
  },
  mounted() {
    this.upgradeStatus = this.$route.query.upgradeStatus || 0
    if (
      this.$route.query.upgradeStatus ||
      this.$route.query.upgradeStatus == 0
    ) {
      this.isOffline = true
    }
    this.getMemberInfo()
    this.getMemebrLabel()
  },
  watch: {
    multipleOptions(val) {
      const [...arr] = val
      const obj = {
        data: arr
      }
      this.settingData = obj
    }
  }
}
</script>

<style lang="scss">
.userInfoCard .el-card__body {
  padding: 0 !important;
}
.userInfoCard .el-card__header {
  border-bottom: none !important;
}
.userInfoCard .centent {
  margin-top: 0px !important;
}
</style>

<style lang="scss" scoped>
@import '../../../assets/sass/erp/retail.scss';
$d: #ddd;
$w: #fff;
$f5: #f5f5f5;
.lookOver {
  color: #409eff;
  cursor: pointer;
}

.userInfoCard {
  /deep/ .el-card__header {
    padding: 10px 30px 10px 15px;
  }
  .tabs {
    border-bottom: 1px solid #ddd;
  }
  .centent {
    margin-top: 10px;
    padding: 20px;
  }
  .consumer-return-record {
    margin-top: 10px;
    line-height: 22px;
    font-size: 12px;
    b {
      margin: 0 5px;
      font-size: 12px;
      font-weight: bold;
      color: #f5222d;
    }
  }
  .btnGroup {
    overflow: hidden;
    text-align: right;
    padding-top: 10px;
  }
  .userAvatar {
    text-align: center;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    .score {
      width: 130px;
      height: 30px;
      line-height: 30px;
      margin: 9px auto;
      text-align: center;
      background: #399fe5;
      color: #fff;
    }
  }
  .tableButton {
    width: 100%;
    min-height: 25px;
    span {
      margin-bottom: 10px !important;
    }
  }
  .score-explain {
    .hd {
      width: 80px;
      line-height: 28px;
      border: 1px solid $d;
      border-bottom: 0;
      margin-top: 20px;
      text-align: center;
      font-weight: bold;
    }
    .aline {
      height: 1px;
      background: $d;
    }
    .bd {
      dl {
        zoom: 1;
        &:before,
        &:after {
          content: ' ';
          display: table;
        }
        &:after {
          clear: both;
          visibility: hidden;
          font-size: 0;
          height: 0;
        }
        margin-bottom: 0;
        dd {
          margin-bottom: 9px;
        }
      }
      .formula {
        margin-top: 20px;
        line-height: 17px;
        dt {
          float: left;
          width: 9%;
          height: 40px;
          text-align: center;
          font-size: 12px;
          background: #e9e9e9;
          padding: 4px 0;
        }
        dd {
          float: left;
          width: 4%;
          height: 40px;
          background: url(../../../assets/images/plus.png) center center
            no-repeat;
          &.sp {
            width: 5%;
            background: url(../../../assets/images/equal.png) center center
              no-repeat;
          }
        }
      }
      .formula-detail {
        font-size: 12px;
        dd {
          margin-top: 20px;
        }
      }
    }
  }
  .wrap-card {
    overflow: hidden;
    .card-title {
      margin-top: 20px;
      font-size: 14px;
      color: #777777;
      font-weight: bold;
      line-height: 1.5;
      // border-bottom: 1px solid $border-color;
      span {
        line-height: 1.5;
        border-bottom: 3px solid #399fe5;
      }
    }
    .card-box {
      overflow: hidden;
      .card-list {
        float: left;
        position: relative;
        margin-top: 20px;
        width: 350px;
        height: 150px;
        border: 1px solid $border-color;
        border-radius: 5px 5px 0px 0px;
        margin-right: 20px;
        .seal-img {
          position: absolute;
          top: 32px;
          left: 20px;
          z-index: 2;
          width: 70px;
          height: 70px;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .coupon-item {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          color: #fff;
          cursor: pointer;
          .top {
            padding: 10px;
            display: flex;
            justify-content: space-between;

            .logo {
              position: relative;
              padding-left: 22px;
              width: 120px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &::before {
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                width: 18px;
                height: 13px;
                background: url(/static/images/coupon_icon.png) no-repeat;
                background-size: cover;
              }
            }
          }
          .middle {
            padding: 17px 10px;
            font-size: 40px;
            text-align: right;
          }
          .bottom {
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #333;
            line-height: 16px;
            p:last-child {
              color: #999;
            }
            .no {
              color: #999;
            }
          }
        }
      }
    }
  }
  .recordTable {
    padding: 0 15px;
    .entry-record-lists {
      li {
        margin-top: 10px;
      }
      .entry-record-lists-hd {
        zoom: 1;
        height: 25px;
        line-height: 25px;
        .left {
          float: left;
        }
        .right {
          float: right;
        }
      }
    }
  }
  .coupons {
    line-height: 1;
    .hd {
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: $w;
      background: #a79758;
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
    .bd {
      max-height: 406px;
      padding: 10px;
      background: $f5;
      overflow: auto;
      ul {
        margin-bottom: 0;
        zoom: 1;
        &:before,
        &:after {
          content: ' ';
          display: table;
        }
        &:after {
          clear: both;
          visibility: hidden;
          font-size: 0;
          height: 0;
        }
      }
      li {
        float: left;
        width: 50%;
        height: 122px;
        margin-top: 10px;
        &.coupons-type1 {
          .item1 {
            padding-top: 5px;
          }
          .item2-con {
            background: #da6f1b;
          }
          .item2-l {
            background: $w url(../../../assets/images/card1.png) 0 0 no-repeat;
          }
          .item2-r {
            background: $w url(../../../assets/images/card2.png) 0 0 no-repeat;
          }
        }
        &.coupons-type3 {
          .item2-con {
            background: #347bb1;
          }
          .item2-l {
            background: $w url(../../../assets/images/card3.png) 0 0 no-repeat;
          }
          .item2-r {
            background: $w url(../../../assets/images/card4.png) 0 0 no-repeat;
          }
        }
        &.coupons-type5 {
          .item2-con {
            background: #ac3535;
          }
          .item2-l {
            background: $w url(../../../assets/images/card5.png) 0 0 no-repeat;
          }
          .item2-r {
            background: $w url(../../../assets/images/card6.png) 0 0 no-repeat;
          }
        }
        &:first-child,
        &:nth-child(2) {
          margin-top: 0;
        }
        background-color: $w;
        .bd-con {
          height: 122px;
          border: 1px solid $d;
          & > div {
            float: left;
            width: 50%;
          }
        }
        &:nth-child(2n) {
          border-left: 5px solid $f5;
        }
        &:nth-child(2n + 1) {
          border-right: 5px solid $f5;
        }
        .item1 {
          height: 120px;
          padding-top: 16px;
          font-size: 12px;
          text-align: left;
          p {
            line-height: 22px;
          }
          span {
            display: inline-block;
            width: 80px;
            text-align: right;
          }
        }
        .item2 {
          position: relative;
          height: 120px;
          padding: 10px 10px 10px 0;
          color: $w;
          .card-sty {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 80px;
            height: 80px;
          }
          .item2-con {
            position: relative;
            height: 100px;
            padding: 28px 7px 0 57px;
            text-align: center;
          }
          .item2-l {
            position: absolute;
            top: 0;
            left: 0;
            width: 57px;
            height: 100px;
          }
          .item2-r {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 7px;
            height: 100px;
          }
          em {
            display: block;
            margin-bottom: 14px;
            font-style: normal;
            color: #fff;
          }
          b {
            display: block;
            font-size: 24px;
            font-weight: normal;
          }
        }
      }
    }
    .bdcash {
      max-height: 406px;
      padding: 10px;
      background: $f5;
      overflow: auto;
      ul {
        margin-bottom: 0;
      }
      & > ul {
        & > li {
          zoom: 1;
          &:before,
          &:after {
            content: ' ';
            display: table;
          }
          &:after {
            clear: both;
            visibility: hidden;
            font-size: 0;
            height: 0;
          }
          height: 122px;
          border: 1px solid $d;
          margin-top: 10px;
          background-color: $w;
          &:first-child {
            margin-top: 0;
          }
          & > div {
            float: left;
            &.bdcash1 {
              position: relative;
              z-index: 1;
              width: 20%;
              height: 120px;
              padding-top: 16px;
              font-size: 12px;
              text-align: left;
              p {
                line-height: 22px;
              }
              .bdcash1-r {
                position: absolute;
                top: 0;
                right: -40px;
                bottom: 0;
                width: 40px;
                height: 120px;
                padding-top: 10px;
                text-align: center;
                color: $w;
                font-size: 16px;
                background: #a79758;
                p {
                  line-height: 20px;
                }
              }
              span {
                display: inline-block;
                width: 80px;
                text-align: right;
              }
            }
            &.bdcash2 {
              width: 80%;
              padding-left: 40px;
              color: $w;
              ul {
                height: 120px;
                white-space: nowrap;
                overflow: auto;
                overflow-y: hidden;
                li {
                  display: inline-block;
                  width: 33.333333333%;
                  height: 120px;
                  padding: 10px;
                  &:nth-child(3n + 1) {
                    & > div {
                      background: #8ac2ed;
                      .cash-coupon-l {
                        background: $w url(../../../assets/images/card7.png) 0 0
                          no-repeat;
                      }
                      .cash-coupon-r {
                        background: $w url(../../../assets/images/card77.png) 0
                          0 no-repeat;
                      }
                    }
                  }
                  &:nth-child(3n + 2) {
                    & > div {
                      background: #ffc09e;
                      .cash-coupon-l {
                        background: $w url(../../../assets/images/card8.png) 0 0
                          no-repeat;
                      }
                      .cash-coupon-r {
                        background: $w url(../../../assets/images/card88.png) 0
                          0 no-repeat;
                      }
                    }
                  }
                  &:nth-child(3n + 3) {
                    & > div {
                      background: #f0aaaa;
                      .cash-coupon-l {
                        background: $w url(../../../assets/images/card9.png) 0 0
                          no-repeat;
                      }
                      .cash-coupon-r {
                        background: $w url(../../../assets/images/card99.png) 0
                          0 no-repeat;
                      }
                    }
                  }
                  & > div {
                    position: relative;
                    height: 100px;
                    padding: 0 7px 0 57px;
                    border-radius: 3px;
                    text-align: center;
                    .card-sty {
                      position: absolute;
                      top: 10px;
                      right: 10px;
                    }
                    .cash-coupon-l {
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 57px;
                      height: 100px;
                    }
                    .cash-coupon-r {
                      position: absolute;
                      top: 0;
                      right: 0;
                      width: 7px;
                      height: 100px;
                    }
                    i {
                      position: absolute;
                      top: 10px;
                      left: 10px;
                      font-size: 18px;
                      font-weight: bold;
                    }
                    em {
                      display: block;
                      padding: 30px 0 10px;
                      color: #333;
                      font-style: normal;
                    }
                    b {
                      display: block;
                      font-size: 24px;
                      color: #c53030;
                      font-weight: normal;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

