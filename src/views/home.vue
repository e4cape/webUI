<template>
  <div class="content">
    <div class="home-left">
      <div class="sys-items">
        <template v-for="(item, index) in $store.getters.menus">
          <div class="a" @click="goSysInfo(item, index)" v-if="item.HomeIcon" :key="index">
            <img :src="$root.settings.DOMAIN_IMAGE + '/default/images/' + item.HomeIcon" alt>
          </div>
        </template>
      </div>
      <div class="home-alerts">
        <div
          class="alerts-item"
          v-if="$store.getters.wechatSettingType != companyBasicWechatSettingType.Company && characterTraceDetail && characterTraceDetail.IsWxAuth && characterTraceDetail.IsWxAuth == yNStatus.No"
        >
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您尚未授权微信！</span>
            <span class="presentation">（授权后可以使用微信营销、管理粉丝和会员）</span>
          </div>
          <el-button type="primary" @click="$router.push({path: '/setter/wechat/authorise'})">立即授权</el-button>
        </div>
        <div
          class="alerts-item"
          v-if="$store.getters.wechatSettingType != companyBasicWechatSettingType.Company && characterTraceDetail && characterTraceDetail.IsApplet && characterTraceDetail.IsApplet == yNStatus.No"
        >
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您尚未开通小程序！</span>
            <span class="presentation">（开通后可以使用营销活动和礼品商城）</span>
          </div>
          <el-button type="primary" @click="$router.push({path: '/setter/applet/wechat'})">立即开通</el-button>
        </div>
        <div class="alerts-item" v-if="characterTraceDetail && characterTraceDetail.IsDepartment && characterTraceDetail.IsDepartment == yNStatus.No">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您尚未添加部门！</span>
            <span class="presentation">（为员工关联部门，计算部门薪酬绩效）</span>
          </div>
          <el-button type="primary" @click="$router.push({path: '/setter/department/index'})">立即添加</el-button>
        </div>
        <div class="alerts-item" v-if="characterTraceDetail && characterTraceDetail.IsRole && characterTraceDetail.IsRole == yNStatus.No">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您尚未添加角色与权限！</span>
            <span class="presentation">（可以添加不同的岗位，设置不同的权限）</span>
          </div>
          <el-button type="primary" @click="$router.push({path: '/setter/power/powerCreate'})">立即添加</el-button>
        </div>
        <div class="alerts-item" v-if="characterTraceDetail && characterTraceDetail.IsUser && characterTraceDetail.IsUser == yNStatus.No">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您尚未添加员工！</span>
            <span class="presentation">（管理门店员工，管理部门和岗位权限）</span>
          </div>
          <el-button type="primary" @click="$router.push({path: '/setter/staff/index'})">立即添加</el-button>
        </div>
        <div
          class="alerts-item"
          v-if="$store.getters.wechatSettingType != companyBasicWechatSettingType.Company && characterTraceDetail && characterTraceDetail.IsScoreRule && characterTraceDetail.IsScoreRule == yNStatus.No"
        >
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您尚未开启积分规则！</span>
            <span class="presentation">（开启后再消费时自动赠送积分）</span>
          </div>
          <el-button type="primary" @click="$router.push({path: '/market/score/rule'})">立即启用</el-button>
        </div>
        <div class="alerts-item" v-if="accountSummary.balance <= 1000 && $store.getters.wechatSettingType != companyBasicWechatSettingType.Company">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您的短信余额不足！</span>
            <span class="presentation">（余额不足将影响客户消费、保养等短信提醒）</span>
          </div>
          <el-button type="primary" @click="smsShow">立即充值</el-button>
        </div>
        <div class="alerts-item" v-if="balanceStatistic.balance <= 5000 && $store.getters.wechatSettingType != companyBasicWechatSettingType.Company">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您的礼品账户余额不足！</span>
            <span class="presentation">（余额不足将影响客户兑换礼品）</span>
          </div>
          <el-button type="primary" @click="giftVisible = true">立即充值</el-button>
        </div>

        <div class="alerts-item" v-if="storePackDetail.PackageType != packageType.Free  && storePackDetail.PackageType != packageType.Flow && storePackDetail.day <= 30 && storePackDetail.day >= 0">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您的系统即将到期！</span>
            <span class="presentation">（到期将影响系统正常使用）</span>
          </div>
        </div>

        <div class="alerts-item" v-if="unFinishAmt">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您有{{unFinishAmt}}节未完成课程！</span>
            <!-- <span class="presentation">（到期将影响系统正常使用）</span> -->
          </div>
          <el-button type="primary" @click="$router.push({path: '/science/requiredCourse/index'})">进入课程</el-button>
        </div>

        <div class="alerts-item" v-if="examHave">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>您正在考试中，剩余时间：{{timeRemaining}}</span>
            <!-- <span class="presentation">（到期将影响系统正常使用）</span> -->
          </div>
          <el-button type="primary" @click="$router.push({path: '/science/examination?id=' + paperId})">继续考试</el-button>
        </div>

        <div class="alerts-item" v-if="collegePackDetail.Days <= 30">
          <div class="alert-left">
            <i class="el-icon-warning"></i>
            <span>科技院{{ collegePackDetail.Days > 0 ? '即将到期' : '已到期'}}！</span>
            <span class="presentation">（{{ collegePackDetail.Days > 0 ? '到期将影响系统正常使用' : '到期部分功能无法使用'}}）</span>
          </div>
          <el-button type="primary" @click="collegeRecVisible=true">立即续费</el-button>
        </div>
      </div>
      <div class="price-title">
        <div class="title">
          <img src="@/assets/images/price.png" alt>
          <span>今日金价</span>
        </div>
        <router-link class="el-button el-button--text el-button--small" style="margin-right: 10px;" :to="{path:'/setter/goldPrice/index'}">金价设置</router-link>
      </div>
      <el-table :data="priceData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="GoldType" label="成色" min-width="100" show-overflow-tooltip fixed>
          <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
        </el-table-column>
        <el-table-column prop="Gprice" label="零售金价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">￥{{$root.toFloat(scope.row.Gprice)}}</template>
        </el-table-column>
        <el-table-column prop="Jprice" label="旧货回收金价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">￥{{$root.toFloat(scope.row.Jprice)}}</template>
        </el-table-column>
        <el-table-column prop="RecallFee" label="旧货回收工费" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">￥{{$root.toFloat(scope.row.RecallFee) +'/' + storeSettingGpriceRecallType.Types[scope.row.RecallType]}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-right">
      <div class="system-version" v-if="$store.getters.user_session.CharacterType != characterType.Lingcb">
        <div class="sys-title">系统版本</div>
        <div class="sys-message">
          <div class="sys-color sys-color-yellow"></div>
          <div class="sys-version" v-if="storePackDetail && storePackDetail.PackageType == packageType.Try && parseFloat(storePackDetail.day) > 0">{{'试用版（' + parseInt(storePackDetail.day) + '天后到期）'}}</div>

          <div
            class="sys-version"
            v-else-if="storePackDetail && storePackDetail.PackageType == packageType.Date || (parseFloat(storePackDetail.day) < 0 && storePackDetail.PackageType == packageType.Try )"
          >{{packageType.Types[storePackDetail.PackageType] + '（' + (storePackDetail.day >= 0? $root.toFixed(storePackDetail.day, 0) + '天后到期）': '已过期）')}}</div>

          <div class="sys-version" v-else-if="storePackDetail && storePackDetail.PackageType == packageType.Flow">{{packageType.Types[storePackDetail.PackageType] + '（余额 ￥' + validCash + '）'}}</div>

          <div class="sys-version" v-else-if="storePackDetail && storePackDetail.PackageType == packageType.Free">{{packageType.Types[storePackDetail.PackageType]}}</div>
        </div>
      </div>
      <div class="gift-sms" v-if="$store.getters.wechatSettingType != companyBasicWechatSettingType.Company">
        <img src="@/assets/images/home-sms.png" alt>
        <div class="balance">
          <div class="balance-item">
            <div class="balance-label">短信余额（条）：</div>
            <el-tooltip :disabled="String(accountSummary.balance).length < 12" :content="'￥' + accountSummary.balance" placement="bottom" effect="light">
              <div class="balance-value">{{accountSummary.balance || 0}}</div>
            </el-tooltip>
          </div>
          <div class="balance-item">
            <div class="balance-label">待发送（条）：</div>
            <el-tooltip :disabled="String(accountSummary.pendingSendCount).length < 12" :content="'￥' + accountSummary.pendingSendCount" placement="bottom" effect="light">
              <div class="balance-value">{{accountSummary.pendingSendCount || 0}}</div>
            </el-tooltip>
          </div>
        </div>
        <el-button type="primary" @click="smsShow">充值</el-button>
        <el-button @click="sysLogsVisibleShow">充值记录</el-button>
      </div>

      <div class="gift-sms" v-if="$store.getters.wechatSettingType != companyBasicWechatSettingType.Company">
        <img src="@/assets/images/home-gift.png" alt>
        <div class="balance">
          <div class="balance-item">
            <div class="balance-label">礼品余额（元）：</div>
            <el-tooltip :disabled="balanceStatistic.balance.length < 11" :content="'￥' + balanceStatistic.balance" placement="bottom" effect="light">
              <div class="balance-value">￥{{balanceStatistic.balance || 0}}</div>
            </el-tooltip>
          </div>
          <div class="balance-item">
            <div class="balance-label">近30天日均消费：</div>
            <el-tooltip :disabled="balanceStatistic.averageExpend.length < 11" :content="'￥' + balanceStatistic.averageExpend" placement="bottom" effect="light">
              <div class="balance-value">￥{{balanceStatistic.averageExpend || 0}}</div>
            </el-tooltip>
          </div>
        </div>
        <el-button type="primary" @click="giftVisible = true">充值</el-button>
        <el-button @click="giftLogsVisibleShow">充值记录</el-button>
      </div>

      <div class="gift-sms" v-if="$store.getters.wechatSettingType != companyBasicWechatSettingType.store">
        <img src="@/assets/images/home-college.png" alt>
        <div class="balance">
          <div class="balance-item item-left">
            <div class="balance-label">科技院：</div>
            <div class="balance-value">{{ collegePackDetail.PackName || 0}}</div>
          </div>
          <div class="balance-item">
            <div
              class="balance-value"
              style="width: 100%;"
            >{{ collegePackDetail.PackId == 1 ? '升级可以获取更多资源' : collegePackDetail.Days > 0 ? (collegePackDetail.Expiree && collegePackDetail.Expiree.substring(0, 10)) + '(剩余' + collegePackDetail.Days + ')' : (collegePackDetail.Expiree && collegePackDetail.Expiree.substring(0, 10) || 0) + '(已到期)'}}</div>
          </div>
        </div>
        <el-button v-if="collegePackDetail.PackId != 1" type="primary" @click="collegeRecVisible = true">续费</el-button>
        <el-button :type="collegePackDetail.PackId == 1 ? 'primary' : ''" @click="collegeUpVisible = true">升级</el-button>
      </div>

      <div class="home-qrcode">
        <div class="qrcode-item mr10">
          <div class="qrcode-title">ERP小程序</div>
          <img :src="$root.settings.DOMAIN_IMAGE + '/default/lcb/lcb-wechat-erp.jpg?=' + Date.now()" alt>
          <div class="qrcode-message">微信扫一扫，手机轻松管理</div>
        </div>
        <div class="qrcode-item">
          <div class="qrcode-title">
            <span>公众号二维码</span>
            <span v-if="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType">（本店专属）</span>
            <el-tooltip v-if="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType" :disabled="false" placement="bottom" effect="light">
              <i class="el-icon-question"></i>
              <div slot="content">
                请在门店传播微信公众号时使用该二维码，
                <br>客户通过该二维码关注，列为本店的粉丝。
              </div>
            </el-tooltip>
          </div>
          <img class="vipcn-img" :src="barCode ? barCode : ''" alt>
          <div class="qrcode-message">
            <el-button type="text" @click="downBarCode">下载公众号二维码</el-button>
          </div>
        </div>
      </div>
      <el-table :data="noticeData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="NoticeTitle" label="系统公告" width="180" show-overflow-tooltip fixed>
          <template slot-scope="scope">
            <el-button type="text" @click="noticeShow(scope.row.index)">{{scope.row.NoticeTitle}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CheckTime" align="right" label min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 短信充值 -->
    <el-dialog title="充值" :visible.sync="smsVisible" width="600px" custom-class="informs">
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="smsForm" ref="form">
        <el-form-item label="商品名称：">
          <span>短信</span>
        </el-form-item>
        <el-form-item label="套餐（条）：" prop="count">
          <el-radio-group v-model="smsForm.count" class="home-radio">
            <el-radio v-for="(item, index) in storeRechargeSetting" @click="countIndex = index + 1" :label="item.count" :key="index" border>{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额：">
          <span class="red-price">￥{{price + '（'+ (unitPrice || 0) + '元/条）'}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="smsFormSub">确定</el-button>
        <el-button @click="smsVisible =  false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 礼品充值 -->
    <el-dialog title="充值" :visible.sync="giftVisible" width="600px" custom-class="informs">
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="giftForm" ref="form">
        <el-form-item label="充值金额：">
          <el-input maxlength="9" v-model="giftForm.price" @keyup.native="giftForm.price = $root.toFixed(giftForm.price)" style="width: 150px;"></el-input>
          <span>&nbsp;元&nbsp;只能充值整数，最低充值金额为{{minPrice}}元</span>
        </el-form-item>
        <el-form-item label>
          <el-radio-group v-model="giftForm.price" class="home-radio">
            <template v-for="(item, index) in allPrices">
              <el-radio :key="index" v-if="minPrice <= item" :label="item">{{item}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="giftFormSub">确定</el-button>
        <el-button @click="giftVisible =  false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 科技院续费 -->
    <el-dialog title="充值" :visible.sync="collegeRecVisible" width="600px" custom-class="informs">
      <div class="strong">您正在进行科技院续费操作</div>
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="collegeVouFrom" ref="form">
        <el-form-item label="当前套餐：">
          <el-tag type="success">{{collegePackDetail.PackName}}</el-tag>
          <el-button type="text" class="m-l-10" @click="collegeUpVisible =  true">升级套餐</el-button>
        </el-form-item>
        <el-form-item label="续费时长：" prop="Year">
          <el-radio-group v-model="collegeVouFrom.Year">
            <el-radio-button :label="item.Year" :key="index" v-for="(item,index) in continueTimeDetail.Prices">{{item.Year}}年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐金额：" class="min-height">
          <span style="text-decoration: line-through;" v-if="xfStartPrice != xfEndRank" class="m-r-5 other-price">￥{{xfStartPrice}}</span>
          <span class="other-price">￥{{xfEndRank}}</span>
        </el-form-item>
        <el-form-item label v-if="parseFloat(xfStartPrice) > parseFloat(xfEndRank)" class="min-height">
          <span class="green">{{xfSpare}}</span>
        </el-form-item>
        <el-form-item label="应付金额：">
          <span class="red-price">￥{{xfEndRank > 0 ? xfEndRank : 0}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="collegeToUpPay(packOrderBasicOrderType.Renew)">确定</el-button>
        <el-button @click="collegeRecVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 科技院升级套餐 -->
    <el-dialog title="升级" :visible.sync="collegeUpVisible" width="700px" custom-class="informs">
      <div class="strong">您正在进行科技院升级操作</div>
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="collegeUpFrom" ref="form">
        <el-form-item label="升级套餐：">
          <el-radio-group v-model="collegeUpFrom.PackId" @change="getCollegePackDetail(collegeUpFrom.PackId)">
            <template v-for="(item, index) in collegePackList">
              <el-radio-button :label="item.PackId" v-if="item.PackId > collegePackDetail.PackId" :key="index">{{item.PackName}}</el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐说明：">
          <p style="width: calc(100% - 30px);">{{collegeUpFrom.text}}</p>
        </el-form-item>
        <el-form-item label="续费时长：">
          <el-radio-group v-model="collegeUpFrom.Year">
            <el-radio-button :label="index" :key="index" v-for="(item,index) in continueTimeUpDetail.Prices">{{item.Year}}年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐金额：" v-if="continueTimeUpDetail.Prices" class="min-height">
          <span style="text-decoration: line-through;" v-if="startPrice != endRank" class="m-r-5 other-price">￥{{startPrice}}</span>
          <span class="other-price">￥{{endRank}}</span>
        </el-form-item>
        <el-form-item label v-if="continueTimeUpDetail.Prices && continueTimeUpDetail.Prices[collegeUpFrom.Year].Rank != 10" class="min-height">
          <span class="green">{{spare}}</span>
        </el-form-item>
        <el-form-item label="原套餐抵扣：" v-if="deduction > 0">
          <span class="other-price">￥{{deduction}}</span>
        </el-form-item>
        <el-form-item label="应付金额：" v-if="continueTimeUpDetail.Prices">
          <span class="red-price">￥{{actualPay }}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="collegeToUpPay(packOrderBasicOrderType.Upgrade)">立即支付</el-button>
        <el-button @click="collegeUpVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="充值二维码" :visible.sync="qrCodeVisible" width="400px" custom-class="informs">
      <div class="qrcode-box">
        <div class="pay-price">应付金额：￥{{qrCodeInfo.amount}}</div>
        <div class="qrcode">
          <img class="pay" :src="qrCodeInfo.qrCode" alt>
          <img src="@/assets/images/pay1.png" alt>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="getQueryOrder">完成支付</el-button>
        <el-button @click="qrCodeVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="短信充值记录" :visible.sync="sysLogsVisible" width="900px" custom-class="select-dialog">
      <el-form :model="smsFormLog" class="fix-w">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="下单时间：">
              <el-date-picker :picker-options="$root.datePickerOptions" :editable="false" v-model="smsFormLog.checkTime" :unlink-panels="true" type="daterange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单号：">
              <el-input v-model="smsFormLog.orderId" type="text" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="sysLogsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="createTime" label="下单时间" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="smsCount" label="购买条数" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="单价（元）" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="amount" label="金额（元）" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="statusText" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTypeText" label="支付方式" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTime" label="支付时间" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="smsFormLog.pageIndex" :size="smsFormLog.pageSize" :total="smsTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sysLogsVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="礼品充值记录" :visible.sync="giftLogsVisible" width="900px" custom-class="select-dialog">
      <el-form :model="giftFormLog" class="fix-w">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="下单时间：">
              <el-date-picker :picker-options="$root.datePickerOptions" :editable="false" v-model="giftFormLog.checkTime" :unlink-panels="true" type="daterange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单号：">
              <el-input v-model="giftFormLog.orderId" type="text" @keyup.enter.native="giftSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="giftSearch">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="giftLogsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="createTime" label="下单时间" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="充值金额" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUser" label="操作人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="statusText" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTypeText" label="支付方式" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTime" label="支付时间" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="giftFormLog.pageIndex" :size="giftFormLog.pageSize" :total="giftTotal" @currentChange="currChange" @sizeChange="pageSizeChange"></pagination>
      <!-- End 分页组件 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="giftLogsVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- <VueQrcode value="Hello, World!" :tag="'img'" :options="{ size: 200 }"></VueQrcode> -->
  </div>
</template>
<script>
import {
  GIFTING_API_ORDERRECHARGE_RECHARGE,
  GIFTING_API_STATISTIC_GETBALANCESTATISTIC,
  GIFTING_API_ORDERRECHARGE_QUERYORDER,
  GIFTING_API_ORDERRECHARGE_GETRECHARGESETTING,
  GIFTING_API_ORDERRECHARGE_GETRECHARGEITEMS
} from '@/apis/gifting'
import {
  MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY,
  MESSAGE_API_SETTINGGLOBAL_GETSTORERECHARGESETTING,
  MESSAGE_API_ORDERRECHARGE_RECHARGE,
  MESSAGE_API_ORDERRECHARGE_SEARCHLIST,
  MESSAGE_API_ORDERRECHARGE_QUERYORDER
} from '@/apis/message'
import {
  MERCHANT_API_SECURITY_CHARACTER_TRACE_GET,
  MERCHANT_API_SETTING_GPRICE_GETS,
  MERCHANT_API_SECURITY_CPACK_GET
} from '@/apis/merchant'
import {
  STOCKING_API_SETTING_ENUMERATOR_GETS
} from '@/apis/stocking'
import {
  MARKETING_API_SETTING_NOTICE_GETS,
  MARKETING_API_BALANCE_STORE_GET,
  MARKETING_API_WEB_CHAT_WECHATBARCODE
} from '@/apis/marketing'
import {
  COLLEGE_API_CHARACTERPACK_GETBYSTORE,
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST,
  COLLEGE_API_SETTINGPACK_GET,
  COLLEGE_API_EMPLOYEEEXAMPAPER_REQ,
  COLLEGE_API_CHARACTERSOLUTIONITEM_GETUNFINISHAMT,
  COLLEGE_API_PACKORDERBASIC_CREATEBYSTORE,
  COLLEGE_API_PACKORDERBASIC_CALLBACK
} from '@/apis/science'
// 新的
import {
  StoreSettingGpriceRecallType,
  SettingHelpStatus
} from '@/enums/marketing'
import { SettingEnumeratorEnumeratorType } from '@/enums/stocking'
import { PackOrderBasicOrderType } from '@/enums/science'
import { CompanyBasicWechatSettingType } from '@/enums/membership'
import {
  YNStatus,
  CharacterType,
  PaymentType,
  PackageType
} from '@/enums/common'
import { setTimeout, setInterval, clearInterval } from 'timers'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      companyBasicWechatSettingType: CompanyBasicWechatSettingType,
      yNStatus: YNStatus,
      packOrderBasicOrderType: PackOrderBasicOrderType,
      allPrices: [5000, 10000, 20000, 50000, 100000],
      characterType: CharacterType,
      packageType: PackageType,
      storeSettingGpriceRecallType: StoreSettingGpriceRecallType,
      smsVisible: false,
      qrCodeVisible: false,
      giftVisible: false,
      sysLogsVisible: false,
      giftLogsVisible: false,
      collegeRecVisible: false, // 科技院充值
      collegeUpVisible: false, // 科技院升级
      rules: {
        count: {
          required: true,
          message: '请选择套餐',
          trigger: 'change'
        },
        Year: {
          required: true,
          message: '请选择续费时长',
          trigger: 'change'
        }
      },
      smsForm: {
        count: '',
        countIndex: 0,
        Department: ''
      },
      giftForm: {
        price: ''
      },
      smsFormLog: {
        checkTime: [],
        pageSize: 10,
        orderId: '',
        pageIndex: 1
      },
      giftFormLog: {
        checkTime: [],
        pageSize: 10,
        orderId: '',
        pageIndex: 1
      },
      smsTotal: 0,
      giftTotal: 0,
      barCode: '',
      minPrice: 0,
      price: 0,
      unitPrice: 0,
      countIndex: 0,
      priceData: [],
      noticeData: [],
      accountSummary: {
        balance: '',
        pendingSendCount: ''
      },
      balanceStatistic: {
        balance: '',
        averageExpend: ''
      },
      characterTraceDetail: {
        IsWxAuth: ''
      },
      collegePackList: [], // 后台给的科技院套餐列表
      collegePackDetail: {}, // 后台给的科技院信息
      collegeUpFrom: {
        PackId: '',
        Year: 0,
        text: ''
      }, // 科技院升级数据
      collegeVouFrom: {
        Year: 0
      }, // 科技院充值数据
      validCash: '', // 按量付费的余额
      continueTimeDetail: {}, // 科技院充值的续费数据
      continueTimeUpDetail: {}, // 科技院升级的续费数据
      storePackDetail: {},
      storeRechargeSetting: [],
      sysLogsData: [],
      giftLogsData: [],
      qrCodeInfo: {},
      unFinishAmt: '', // 未完成课程数
      timeRemaining: '', // 考试剩余时间展示
      examHave: '',
      timer: null,
      paperId: '' // 试卷id
    }
  },
  computed: {
    spare () {
      // 打折信息
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return (
        prices[index].Rank +
        '折，节省￥' +
        (prices[index].CouponPrice / 10000).toFixed(2)
      )
    },
    startPrice () {
      // 套餐原价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return ((prices[index].Price) / 10000).toFixed(2)
    },
    endRank () {
      // 折后价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return ((prices[index].Price - prices[index].CouponPrice) / 10000).toFixed(2)
    },
    deduction () {
      // 抵扣价格
      // 到期天数*每日平摊+结余差额
      let price = (this.collegePackDetail.SurplusPrice / 10000).toFixed(2)
      return price > 0 ? price : 0
    },
    actualPay () {
      // 最终价格
      let prices = this.continueTimeUpDetail.Prices
      let index = this.collegeUpFrom.Year
      return (
        (prices[index].Price - prices[index].CouponPrice - this.collegePackDetail.SurplusPrice) / 10000
      ).toFixed(2)
    },
    xfSpare () {
      let obj = this.continueTimeDetail.Prices ? this.continueTimeDetail.Prices.find(item => {
        return item.Year == this.collegeVouFrom.Year
      }) : { Price: 0, Rank: 0 }
      return `${obj.Rank}折，节省￥${((10 - obj.Rank) / 10 * obj.Price / 10000).toFixed(2)}`
    },
    xfStartPrice () {
      let obj = this.continueTimeDetail.Prices ? this.continueTimeDetail.Prices.find(item => {
        return item.Year == this.collegeVouFrom.Year
      }) : { Price: 0 }
      return (obj.Price / 10000).toFixed(2)
    },
    xfEndRank () {
      let obj = this.continueTimeDetail.Prices ? this.continueTimeDetail.Prices.find(item => {
        return item.Year == this.collegeVouFrom.Year
      }) : { Price: 0, Rank: 0 }
      return ((obj.Rank / 10) * obj.Price / 10000).toFixed(2)
    }
  },
  methods: {
    getAccountSummary () {
      MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.accountSummary = res.data.Data
        }
      })
    },
    getCharacterTraceDetail () {
      MERCHANT_API_SECURITY_CHARACTER_TRACE_GET().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.characterTraceDetail = res.data.Data
        }
      })
    },
    getGpriceList () {
      STOCKING_API_SETTING_ENUMERATOR_GETS({
        EnumeratorType: SettingEnumeratorEnumeratorType.GoldType, // 	int32	科目类型(枚举)	gte=0
        EnumeratorKey: 0, // 	int32	枚举键(自增量)	gte=0
        EnumeratorVal: '', //	string	枚举值(名称)	max=50
        IsDefault: 0, // 	int32	是否默认(枚举)	gte=0
        IsEnable: 0, // 	int32	是否启用(枚举)	gte=0
        IsAppend: 0, // 	int32	是否追加(枚举)	gte=0
        SortId: 0, // 	int32	排序编号	gte=0
        OrderBy: 0, // 	int32	排序字段(0=EnumeratorKey)	gte=0
        IsAsced: YNStatus.Yes, // 	int32	是否升序(枚举)	gte=0
        PageIndex: 1, // 	int32	当前页码	gt=0
        PageSize: 1000 // 	int32	每页?条	gt=0
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let parentData = res.data.Data.Rows || []
          MERCHANT_API_SETTING_GPRICE_GETS().then(result => {
            if (result.data.Code === 'CORRECT') {
              let childData = result.data.Data.Rows || []
              let arr = []
              parentData.forEach((res) => {
                childData.forEach((value) => {
                  if (res['EnumeratorKey'] == value['GoldType'] && res['IsEnable'] == YNStatus.Yes) {
                    arr.push(Object.assign({}, res, value))
                  }
                })
              })
              this.priceData = arr
            }
          })
        }
      })
    },
    getNoticeList () {
      MARKETING_API_SETTING_NOTICE_GETS({
        PageIndex: 1,
        PageSize: 5,
        Status: SettingHelpStatus.Audit,
        CharacterType: this.$store.getters.user_session.CharacterType,
        NoticeTitle: '',
        SortBy: 'CheckTime'
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.noticeData = res.data.Data.Rows.map((item, index) => {
            item.index = index
            return item
          })
        }
      })
    },
    getStorePackDetail () {
      MERCHANT_API_SECURITY_CPACK_GET().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.storePackDetail = res.data.Data
          this.$store.state.accountStatus = res.data.Data
          this.storePackDetail.day = parseFloat(
            (new Date(res.data.Data.Expiree) -
              new Date(res.data.Data.NowTime)) /
            (1000 * 60 * 60 * 24)
          )
          if (this.storePackDetail.PackageType == PackageType.Flow) {
            this.getBalanceDetail()
          }
        }
      })
    },
    getBalanceDetail () {
      MARKETING_API_BALANCE_STORE_GET().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.validCash = (res.data.Data && res.data.Data.ValidCash / 10000).toFixed(2)
        }
      })
    },
    getBarCode () {
      MARKETING_API_WEB_CHAT_WECHATBARCODE().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.barCode = res.data.Data
        }
      })
    },
    downBarCode () {
      window.open(
        this.$root.settings.DOMAIN_APIS.Spread +
        '/api/Spr/DownloadFile?url=' +
        this.barCode +
        '&name=公众号二维码.jpg'
      )
    },
    getStoreRechargeSetting () {
      MESSAGE_API_SETTINGGLOBAL_GETSTORERECHARGESETTING().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.storeRechargeSetting = res.data.Data.packages
        }
      })
    },
    getBalanceStatistic () {
      GIFTING_API_STATISTIC_GETBALANCESTATISTIC().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.balanceStatistic = res.data.Data
        }
      })
    },
    goSysInfo (item, index) {
      sessionStorage.curSys = index + 1
      this.$store.state.curSys = index + 1
      item.LinkUrl
        ? window.open(item.LinkUrl)
        : this.$router.push({
          path: '/introduction/' + item.SystemId
        })
    },
    getSmsLogs () {
      let time = this.smsFormLog.checkTime || ['', '']
      MESSAGE_API_ORDERRECHARGE_SEARCHLIST({
        endTime: time[1],
        pageSize: this.smsFormLog.pageSize,
        orderId: this.smsFormLog.orderId,
        pageIndex: this.smsFormLog.pageIndex,
        storeAdministratorId: '',
        storeName: '',
        startTime: time[0]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.sysLogsData = res.data.Data.rows
          this.smsTotal = res.data.Data.total
        }
      })
    },
    getGiftLogs () {
      let time = this.giftFormLog.checkTime || ['', '']
      GIFTING_API_ORDERRECHARGE_GETRECHARGEITEMS({
        createTimeEnd: time[1],
        pageSize: this.giftFormLog.pageSize,
        orderId: this.giftFormLog.orderId,
        pageIndex: this.giftFormLog.pageIndex,
        createTimeStart: time[0]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.giftLogsData = res.data.Data.rows
          this.giftTotal = res.data.Data.total
        }
      })
    },
    smsShow () {
      this.smsVisible = true
      if (!this.storeRechargeSetting.length) {
        this.getStoreRechargeSetting()
      }
    },
    smsFormSub () {
      // 短信充值支付请求
      this.smsVisible = false
      MESSAGE_API_ORDERRECHARGE_RECHARGE({
        count: this.smsForm.count
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.qrCodeInfo = Object.assign(res.data.Data, {
            type: 'sms'
          }) // 区分是短信还是礼品
          this.qrCodeVisible = true
        }
      })
    },
    giftFormSub () {
      // 礼品充值支付请求
      if (!this.giftForm.price) {
        this.$message.error('请输入充值金额！')
        return
      } else if (parseFloat(this.giftForm.price) < parseFloat(this.minPrice)) {
        this.$message.error('请输入不小于最低金额的充值金额！')
        return
      }
      this.giftVisible = false
      GIFTING_API_ORDERRECHARGE_RECHARGE({
        price: this.giftForm.price
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.qrCodeInfo = Object.assign(res.data.Data, {
            type: 'gift'
          }) // 区分是短信还是礼品
          this.qrCodeVisible = true
        }
      })
    },
    collegeToUpPay (type) {
      if (type == PackOrderBasicOrderType.Upgrade && this.actualPay < 0) {
        this.$message.error('应付金额不能为负数！')
        return
      }
      this.collegeRecVisible = false
      this.collegeUpVisible = false
      // 科技院（升级套餐/续费）支付请求
      let param = {
        OrderType: type,
        PaymentType: PaymentType.WechatPay,
        PackId: '',
        Years: ''
      }
      if (type == PackOrderBasicOrderType.Upgrade) {
        param.PackId = this.collegeUpFrom.PackId
        param.Years = this.continueTimeUpDetail.Prices[this.collegeUpFrom.Year].Year
      } else {
        param.PackId = this.collegeVouFrom.PackId
        param.Years = this.collegeVouFrom.Year
      }
      COLLEGE_API_PACKORDERBASIC_CREATEBYSTORE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.qrCodeInfo.type = 'college'
          this.qrCodeInfo.amount = this.$root.toFixed(res.data.Data.PaidPrice / 10000, 2)
          this.qrCodeInfo.qrCode = res.data.Data.QrCode
          this.qrCodeInfo.orderId = res.data.Data.OrderId
          this.qrCodeVisible = true
        }
      })
    },
    countChange () {
      this.storeRechargeSetting.forEach(item => {
        if (this.smsForm.count == item.count) {
          this.unitPrice = item.unitPrice
          this.price = item.price
        }
      })
    },
    sysLogsVisibleShow () {
      this.sysLogsVisible = true
      if (!this.sysLogsData.length) {
        this.getSmsLogs()
      }
    },
    giftLogsVisibleShow () {
      this.giftLogsVisible = true
      this.getGiftLogs()
    },
    noticeShow (index) {
      document.getElementsByClassName('icon-tixing')[0].click()
      setTimeout(() => {
        document
          .getElementsByClassName('informs-left-item')[0]
          .childNodes[index].click()
      }, 1000)
    },
    currChange (val) {
      this.giftFormLog.pageIndex = val
      this.getGiftLogs()
    },
    pageSizeChange (val) {
      this.giftFormLog.pageIndex = 1
      this.giftFormLog.pageSize = val
      this.getGiftLogs()
    },
    giftSearch () {
      this.giftFormLog.pageIndex = 1
      this.getGiftLogs()
    },
    currentChange (val) {
      this.smsFormLog.pageIndex = val
      this.getSmsLogs()
    },
    sizeChange (val) {
      this.smsFormLog.pageIndex = 1
      this.smsFormLog.pageSize = val
      this.getSmsLogs()
    },
    search () {
      this.smsFormLog.pageIndex = 1
      this.smsFormLog.pageSize = 10
      this.getSmsLogs()
    },
    getMinPrice (value) {
      if (value) {
        GIFTING_API_ORDERRECHARGE_GETRECHARGESETTING().then(res => {
          if (res.data.Code === 'CORRECT') {
            this.minPrice = res.data.Data.recharge.minimum
          }
        })
      }
    },
    getCollegePack () {
      // 获取当前科技院套餐信息
      COLLEGE_API_CHARACTERPACK_GETBYSTORE().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.collegePackDetail = res.data.Data || {}
          this.getCollegePackDetail(this.collegePackDetail.PackId, result => {
            result.Prices = JSON.parse(result.Prices)
            this.continueTimeDetail = result
            this.collegeVouFrom.Year = result.Prices[0].Year
          })
        }
      })
    },
    getCollegePackDetail (id, back) {
      // 科技院套餐下面的升级续费价格
      COLLEGE_API_SETTINGPACK_GET({
        PackId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (back) {
            back(res.data.Data)
          } else {
            this.collegeUpFrom.text = res.data.Data.Note
            res.data.Data.Prices = JSON.parse(res.data.Data.Prices)
            this.collegeUpFrom.Year = 0
            this.continueTimeUpDetail = res.data.Data
          }
        }
      })
    },
    getCollegePacksList () {
      COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.collegePackList = res.data.Data.Subset
        }
      })
    },
    collegeUpChange (value) {
      if (value) {
        let fristItem = this.collegePackList.filter(pack => {
          return pack.PackId > this.collegePackDetail.PackId
        }).sort((a, b) => a.PackId - b.PackId)
        if (fristItem.length) {
          this.collegeUpFrom.PackId = fristItem[0].PackId
          this.getCollegePackDetail(fristItem[0].PackId)
        } else {
          this.collegeUpVisible = false
          this.$message.error('当前套餐等级已经是最高级')
        }
      }
    },
    getQueryOrder () {
      this.qrCodeVisible = false
      switch (this.qrCodeInfo.type) {
        case 'gift':
          this.getQueryOrderGift()
          break
        case 'sms':
          this.getQueryOrderSms()
          break
        case 'college':
          this.getQueryOrderCollege()
          break
        default:
          this.getQueryOrderGift()
          break
      }
    },
    getQueryOrderCollege () { // 科技院
      COLLEGE_API_PACKORDERBASIC_CALLBACK({
        OrderNo: this.qrCodeInfo.orderId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('支付成功')
        }
        this.getCollegePack()
      })
    },
    getQueryOrderSms () { // 短信
      MESSAGE_API_ORDERRECHARGE_QUERYORDER({
        orderId: this.qrCodeInfo.orderId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.status == 1) {
            this.$message.error('待支付')
          } else {
            this.$message.success('支付成功，' + res.data.Data.amount + '元')
          }
        }
        this.getBalanceStatistic()
      })
    },
    getQueryOrderGift () { // 礼品
      GIFTING_API_ORDERRECHARGE_QUERYORDER({
        orderId: this.qrCodeInfo.orderId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.status == 1) {
            this.$message.error('待支付')
          } else {
            this.$message.success('支付成功，' + res.data.Data.price + '元')
          }
        }
        this.getBalanceStatistic()
      })
    },
    getUnFinishAmt () {
      // 获取未完成课程数
      COLLEGE_API_CHARACTERSOLUTIONITEM_GETUNFINISHAMT().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.unFinishAmt = res.data.Data.UnFinishAmt
        }
      })
    },
    getKs () {
      // 获取考试信息
      COLLEGE_API_EMPLOYEEEXAMPAPER_REQ().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data || !res.data.Data.PaperId) {
            return // 没有正在考试的课程
          }
          this.paperId = res.data.Data.PaperId
          let endTime = parseInt(
            (Date.parse(res.data.Data.Expiree) -
              Date.parse(res.data.Data.NowTime)) /
            1000
          )
          if (endTime > -600) {
            this.examHave = true
            this.countDown(endTime)
          }
        }
      })
    },
    countDown (haveDate) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (haveDate <= -600) {
          this.examHave = false
          clearInterval(this.timer)
          return
        } else if (haveDate > 0) {
          let s =
            parseInt(haveDate / 3600) > 0 ? parseInt(haveDate / 3600) + ':' : ''
          let f =
            parseInt((haveDate % 3600) / 60) > 0
              ? (parseInt((haveDate % 3600) / 60) >= 10
                ? parseInt((haveDate % 3600) / 60)
                : '0' + parseInt((haveDate % 3600) / 60)) + ':'
              : '00:'
          let m =
            parseInt(haveDate % 60) >= 10
              ? parseInt(haveDate % 60)
              : '0' + parseInt(haveDate % 60)
          this.timeRemaining = s + f + m
        } else {
          this.timeRemaining = '00:00'
        }
        haveDate = new Date(haveDate - 1)
      }, 1000)
    }
  },
  beforeMount () {
    this.$store.dispatch('GET_GOLD_TYPE')
    this.getCharacterTraceDetail() // 是否添加角色，部门等信息
    this.getGpriceList() // 今日金价
    this.getNoticeList() // 系统公告
    this.getStorePackDetail() // 系统版本
    this.getCollegePacksList() // 科技院的套餐列表
    this.getBarCode() // 公众号二维码
    this.getCollegePack()
    this.getKs() // 获取考试信息
    if (this.$store.getters.wechatSettingType == CompanyBasicWechatSettingType.Store) {
      // 一号多店的门店不请求数据
      this.getAccountSummary()
      this.getBalanceStatistic()
    }
  },
  watch: {
    'smsForm.count': 'countChange',
    collegeUpVisible: 'collegeUpChange',
    giftVisible: 'getMinPrice'
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  .home-right {
    width: 430px;
  }
  .home-left {
    width: calc(100% - 440px);
    margin-right: 10px;
    .sys-items {
      display: flex;
      margin-right: -4px;
      margin-left: -4px;
      flex-wrap: wrap;
      .a {
        display: inline-block;
        margin: 0 4px 10px 4px;
        font-size: 0;
      }
    }
  }
}
.alerts-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  margin-bottom: 5px;
  font-size: 12px;
  background-color: #f5f5f5;
  .alert-left {
    display: flex;
    align-items: center;
    .el-icon-warning {
      font-size: 16px;
      color: #da0000;
      padding-right: 10px;
    }
  }
}
.presentation {
  font-size: 12px;
  color: #999;
}
.price-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  margin-top: 10px;
  line-height: 32px;
  border-top: 1px solid #e5e5e5;
  .title {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #777;
    img {
      padding: 0 10px;
    }
  }
}

.system-version {
  display: flex;
  align-items: center;
  height: 40px;
  color: #fff;
  font-size: 12px;
  //background-color: #399fe5;
  .sys-title {
    position: relative;
    width: 136px;
    text-align: center;
    &::before {
      position: absolute;
      display: block;
      content: '';
      width: 1px;
      height: 20px;
      background-color: #90c9f1;
      right: -1px;
      top: -4px;
    }
  }
  .sys-message {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 294px;
    .sys-color {
      height: 10px;
      width: 10px;
      border-radius: 50%;
    }
    .sys-color-yellow {
      background-color: #ffe761;
    }
    .sys-version {
      padding: 0 20px;
    }
  }
}
.gift-sms {
  display: flex;
  margin-top: 10px;
  padding: 0 15px;
  align-items: center;
  height: 80px;
  background-color: #f5f5f5;
  img {
    margin-right: 10px;
  }
  .balance {
    width: 194px;
    .balance-item {
      display: flex;
      width: 100%;
      line-height: 24px;
      &.item-left {
        text-align: left;
        .balance-label {
          width: 45px;
        }
      }
      .balance-label {
        width: 100px;
        text-align: right;
        white-space: nowrap;
        color: #333333;
      }
      .balance-value {
        color: #ffa200;
        font-weight: 600;
        width: calc(100% - 100px);
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
.home-qrcode {
  display: flex;
  margin: 10px 0;
  .qrcode-item {
    width: 50%;
    display: inline-block;
    background-color: #f5f5f5;
    padding: 0 10px;
    .qrcode-title {
      height: 32px;
      line-height: 32px;
      font-weight: 900;
      color: #777;
    }
    img {
      width: 100% !important;
    }
    .qrcode-message {
      height: 28px;
      line-height: 28px;
      color: #777;
      width: 100%;
      text-align: center;
    }
  }
  .mr10 {
    margin-right: 10px;
  }
}

.vipcn-img {
  display: block;
  width: 190px;
  height: 190px;
  font-size: 0;
  background-color: #fff;
}
.strong {
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  line-height: 30px;
  text-align: center;
  color: #ffa200;
  margin: 10px;
}
.red-price {
  font-size: 14px;
  font-weight: 600;
  color: #da0000;
}
.other-price {
  font-size: 14px;
  color: #777;
  font-weight: 600;
}
.home-radio /deep/ .el-radio {
  margin-right: 10px;
}
</style>

