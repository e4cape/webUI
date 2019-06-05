<template>
  <div>
    <el-form :model="form" @keyup.enter.native="onSearch" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="Status" @change="onSearch" v-model="form.Status" placeholder="请选择">
              <el-option label="全部" :value="-1"></el-option>
              <el-option v-for="item in WxAppletStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CompanyCode">
            <el-input name="CompanyCode" v-model="form.CompanyCode" placeholder="公司编码">
              <el-button @click="onSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="公司编码：" prop="CompanyCode">
            <el-input name="CompanyCode" v-model="form.CompanyCode"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="CompanyTitle">
            <el-input name="CompanyTitle" v-model="form.CompanyTitle"></el-input>
          </el-form-item>
          <el-form-item label="门店编码：" prop="EnglishID">
            <el-input name="EnglishID" v-model="form.EnglishID"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：" prop="StoreTitle">
            <el-input name="StoreTitle" v-model="form.StoreTitle"></el-input>
          </el-form-item>
          <el-form-item label="关联公众号：" prop="NickName">
            <el-input name="NickName" v-model="form.NickName"></el-input>
          </el-form-item>
          <el-form-item label="小程序名称：" prop="AppletTitle">
            <el-input name="AppletTitle" v-model="form.AppletTitle"></el-input>
          </el-form-item>
          <el-form-item label="AppID：" prop="AppId">
            <el-input name="AppId" v-model="form.AppId"></el-input>
          </el-form-item>
          <el-form-item label="上个版本号：" prop="PreVersion">
            <el-input name="PreVersion" v-model="form.PreVersion"></el-input>
          </el-form-item>
          <el-form-item label="当前版本号：" prop="CurVersion">
            <el-input name="CurVersion" v-model="form.CurVersion"></el-input>
          </el-form-item>
          <el-form-item label="小程序授权：" prop="AuthStatus">
            <el-select name="AuthStatus" v-model="form.AuthStatus" placeholder="请选择">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in WxAuthorizerStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="+item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="Status">
            <el-select name="Status" v-model="form.Status" placeholder="请选择">
              <!-- <el-option
                label="全部"
                :value="-1"
              ></el-option>
              <el-option
                v-for="(item, index) in WxAppletStatusLists"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>-->
              <el-option label="全部" :value="-1"></el-option>
              <el-option v-for="item in WxAppletStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div class="p-y-10 over-hide">
      <div class="left-box">
        <el-button name="setServerDomainName" class="btn-140" :disabled="!isChoosed" @click="multipleSelection.length==1?(chooseDomain(multipleSelection[0],0)):(dialogServerVisible = true)">配置服务器域名</el-button>
        <el-button name="setBusinessDomainName" class="btn-140" :disabled="!isChoosed" @click="multipleSelection.length==1?(chooseDomain(multipleSelection[0],1)):(dialogBusinessVisible = true)">配置业务域名</el-button>
        <el-button name="uploadCode" class="btn-140" :disabled="!isChoosed" @click="uploadCode()">上传代码</el-button>
        <el-button name="examine" class="btn-140" :disabled="!isChoosed || isExamine" @click="examine($event)">提交审核</el-button>
        <el-button name="releaseWxApp" class="btn-140" :disabled="!isChoosed || isRelease" @click="releaseWxApp()">发布</el-button>
      </div>
      <div class="right-box">
        <span class="p-l-10">
          操作：
          <span class="grade-n">1</span> 配置服务器域名和业务域名，
          <span class="grade-n">2</span> 上传代码，
          <span class="grade-n">3</span>提交审核，
          <span class="grade-n">4</span>发布
        </span>
      </div>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" v-loading="$store.getters.tb_loading">
      <el-table-column fixed type="selection" width="40"></el-table-column>
      <el-table-column width="100" label="公司编码" prop="CompanyCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="公司名称" prop="CompanyTitle" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="门店编码" prop="EnglishID" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店名称" prop="StoreTitle" show-overflow-tooltip></el-table-column>
      <el-table-column label="小程序授权" width="100" prop="AuthStatus" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column label="关联公众号" width="120" prop="NickName" show-overflow-tooltip></el-table-column>
      <el-table-column label="小程序名称" width="120" prop="AppletTitle" show-overflow-tooltip></el-table-column>
      <el-table-column label="AppID(小程序ID)" width="150" prop="AppId" show-overflow-tooltip></el-table-column>
      <el-table-column label="服务器域名" prop="SerDomain" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column label="业务域名" prop="BusDomain" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column label="上个版本号" width="100" prop="PreVersion" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column label="当前版本号" width="100" prop="CurVersion" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="80" prop="Status" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="480">
        <template slot-scope="scope">
          <el-button name="detailContral" type="text" @click="$router.push({path: `/setter/wxapplet/wxappletstoredetail?authorizerId=${scope.row.AuthorizerId}`})">详情</el-button>
          <el-button name="setServerDomainNameContral" type="text" @click="chooseDomain(scope.row,0)">配置服务器域名</el-button>
          <el-button name="setBusinessDomainNameContral" type="text" @click="chooseDomain(scope.row,1)">配置业务域名</el-button>
          <el-button name="uploadCodeContral" type="text" v-if="scope.row.Status != WxAppletStatus.Progress" @click="uploadCode(scope.row.AuthorizerId)">上传代码</el-button>
          <el-button name="showWxCodeContral" type="text" v-if="scope.row.AuthorizerId" @click="showWxCode(scope.row.AuthorizerId)">体验二维码</el-button>
          <el-button
            name="examineContral"
            type="text"
            v-if="scope.row.Status == WxAppletStatus.Wait||scope.row.Status == WxAppletStatus.Failed||scope.row.Status == WxAppletStatus.PublishedSuccess"
            @click="examine($event,scope.row.AuthorizerId)"
          >提交审核</el-button>
          <el-button
            name="releaseWxAppContral"
            type="text"
            v-if="scope.row.Status == WxAppletStatus.Audit||scope.row.Status == WxAppletStatus.PublishedFailed"
            @click="releaseWxApp(scope.row.AuthorizerId)"
          >发布</el-button>
          <el-button name="cancleAuditContral" type="text" v-if="scope.row.Status == WxAppletStatus.Progress" @click="cancleAudit($event,scope.row.AuthorizerId)">撤销审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <el-dialog title="配置服务器域名" :visible.sync="dialogServerVisible" :before-close="handleClose">
      <el-form ref="ServerData" :model="ServerData">
        <div class="dialog-c-box">
          <p>服务器域名需经过ICP备案，新备案域名需24小时后才可配置，域名格式只支持英文大小写字母、数字及“-”，不支持IP地址及端口号。</p>
          <el-row class="p-t-10">
            <el-col :span="6" class="text-center">request合法域名</el-col>
            <el-col :span="18">
              <el-form-item v-for="(item,index) in ServerData.requestOpts" :prop="'requestOpts['+index+'].requestUrl'" :key="index" :rules="{required: true, message: '域名不能为空', trigger: 'blur'}">
                <el-row class="row-btn">
                  <el-col :span="20" class="m-t-5">
                    <el-input name="requestUrl" v-model="item.requestUrl"></el-input>
                  </el-col>
                  <el-col :span="4" class="p-l-30">
                    <img v-if="index > 0" @click="removeItems(index, 0)" src="/static/images/icon-4.png" alt>
                    <img v-if="index == 0&&ServerData.requestOpts.length != 5" @click="addItems(index, 0)" src="/static/images/icon-5.png" alt>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="p-t-10">
            <el-col :span="6" class="text-center">socket合法域名</el-col>
            <el-col :span="18">
              <el-form-item v-for="(item,index) in ServerData.socketOpts" :key="index" :prop="'socketOpts['+index+'].socketUrl'" :rules="{required: true, message: '域名不能为空', trigger: 'blur'}">
                <el-row class="row-btn">
                  <el-col :span="20" class="m-t-5">
                    <el-input name="socketUrl" v-model="item.socketUrl"></el-input>
                  </el-col>
                  <el-col :span="4" class="p-l-30">
                    <img v-if="index > 0" @click="removeItems(index, 1)" src="/static/images/icon-4.png" alt>
                    <img v-if="index == 0&&ServerData.socketOpts.length != 5" @click="addItems(index, 1)" src="/static/images/icon-5.png" alt>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="p-t-10">
            <el-col :span="6" class="text-center">uploadFile合法域名</el-col>
            <el-col :span="18">
              <el-form-item
                v-for="(item,index) in ServerData.uploadFileOpts"
                :key="index"
                :prop="'uploadFileOpts['+index+'].uploadFileUrl'"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
              >
                <el-row class="row-btn">
                  <el-col :span="20" class="m-t-5">
                    <el-input name="uploadFileUrl" v-model="item.uploadFileUrl"></el-input>
                  </el-col>
                  <el-col :span="4" class="p-l-30">
                    <img v-if="index > 0" @click="removeItems(index, 2)" src="/static/images/icon-4.png" alt>
                    <img v-if="index == 0&&ServerData.uploadFileOpts.length != 5" @click="addItems(index, 2)" src="/static/images/icon-5.png" alt>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="p-t-10">
            <el-col :span="6" class="text-center">downloadFile合法域名</el-col>
            <el-col :span="18">
              <el-form-item
                v-for="(item,index) in ServerData.downloadFileOpts"
                :key="index"
                :prop="'downloadFileOpts['+index+'].downloadFileUrl'"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
              >
                <el-row class="row-btn">
                  <el-col :span="20" class="m-t-5">
                    <el-input name="downloadFileUrl" v-model="item.downloadFileUrl"></el-input>
                  </el-col>
                  <el-col :span="4" class="p-l-30">
                    <img v-if="index > 0" @click="removeItems(index, 3)" src="/static/images/icon-4.png" alt>
                    <img v-if="index == 0&&ServerData.downloadFileOpts.length != 5" @click="addItems(index, 3)" src="/static/images/icon-5.png" alt>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="serverCancel" @click="handleClose">取 消</el-button>
        <el-button name="serverSubmit" type="primary" :loading="isUpLoading" @click="onSubmit('ServerData',0)">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置业务域名" width="35%" :visible.sync="dialogBusinessVisible" :before-close="handleClose">
      <el-form ref="domainsData" :model="domainsData">
        <div>
          <p>业务域名需经过ICP备案，新备案域名需24小时后才可配置。域名格式只支持英文大小写字母、数字及“- ”，不支持IP地址及端口号</p>
          <el-row class="p-t-10">
            <el-form-item
              class="err-msg-sty"
              v-for="(item, index) in domainsData.domainsOpts"
              :prop="'domainsOpts['+index+'].domainUrl'"
              :key="index"
              :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
            >
              <el-col :span="3" class="m-t-5 text-center">域名{{index + 1}}：</el-col>
              <el-col :span="18" class="m-t-5">
                <el-input name="domainUrl" v-model="item.domainUrl"></el-input>
              </el-col>
              <el-col :span="3" class="p-l-30 col-img">
                <img v-if="index > 0" @click="removeDomains(index)" src="/static/images/icon-4.png" alt>
                <img v-if="index == 0&&domainsData.domainsOpts.length != 5" @click="addDomains(index)" src="/static/images/icon-5.png" alt>
              </el-col>
            </el-form-item>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="businessCancel" @click="handleClose">取 消</el-button>
        <el-button name="businessSubmit" type="primary" @click="onSubmit('domainsData', 1)" :loading="isUpLoading">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传代码" width="25%" :visible.sync="dialogUploadVisible" :before-close="handleClose">
      <el-form ref="uploadData" :model="uploadData" label-width="100px">
        <el-form-item prop="Template_id" label="模板ID：">
          <el-input name="Template_id" :disabled="true" v-model="uploadData.template_id"></el-input>
          <p class="font-sty">请选择代码库中的代码模版ID</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="uploadCodeCancel" @click="handleClose">取 消</el-button>
        <el-button name="uploadCodeConfirm" type="primary" @click="onSubmit('uploadData', 2)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="体验二维码" width="320px" :visible.sync="dialogWxCodeVisible">
      <div class="img-box" v-loading="qrcodeLoading" element-loading-text="拼命加载中">
        <img v-if="wxCode" class="img-sty" :src="wxCode" alt>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button name="WxCodeClose" type="primary" @click="dialogWxCodeVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MARKETING_API_WX_APPLET_GETWXAPPLETLIST, // 小程序 - 商家小程序列表
  MARKETING_API_WX_APPLET_PUBLISHWXAPPLET, // 小程序 - 发布已通过审核的小程序
  MARKETING_API_WX_APPLET_GETTEMPLATELATEST, // 小程序 - 获取代码模版库中的最新模版
  MARKETING_API_WX_APPLET_SUBMITAUDIT, // 小程序 - 提交代码审核
  MARKETING_API_WX_APPLET_GETQRCODE, // 小程序 - 小程序体验二维码
  MARKETING_API_WX_APPLET_MODIFYDOMAIN, // 小程序 - 设置服务器域名
  MARKETING_API_WX_APPLET_WXACOMMIT, // 小程序 - 上传代码
  MARKETING_API_WX_APPLET_SETWEBVIEWDOMAIN, // 小程序 - 设置业务域名
  MARKETING_API_WX_APPLET_UNDOCODEAUDIT //  小程序 - 撤回审核
} from '@/apis/marketing'

import { WxAuthorizerStatus } from '@/enums/common'
import { WxAppletStatus } from '@/enums/component'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      form: {
        Status: -1,
        CompanyCode: '',
        CompanyTitle: '',
        EnglishID: '',
        StoreTitle: '',
        NickName: '',
        AppletTitle: '',
        AppId: '',
        CurVersion: '',
        PreVersion: '',
        AuthStatus: 0,
        PageIndex: 1,
        PageSize: 20
      },
      qrcodeLoading: false,
      parameter: {},
      total: 0,
      tableData: [],
      releaseData: {
        token: '',
        userVersion: '',
        userDesc: ''
      },
      rule4: {
        token: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        userVersion: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        userDesc: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ]
      },
      multipleSelection: [],
      WxAuthorizerStatus: WxAuthorizerStatus,
      WxAppletStatus: WxAppletStatus,
      createTime: [],
      uploadData: {},
      AuthorizerIds: [],
      ServerData: {
        requestOpts: [
          {
            requestUrl: 'https://'
          }
        ],
        socketOpts: [
          {
            socketUrl: 'wws://'
          }
        ],
        uploadFileOpts: [
          {
            uploadFileUrl: 'https://'
          }
        ],
        downloadFileOpts: [
          {
            downloadFileUrl: 'https://'
          }
        ]
      },
      // requestOpts: [],
      // socketOpts: [],
      // uploadFileOpts: [],
      // downloadFileOpts: [],
      domainsData: {
        domainsOpts: [
          {
            domainUrl: 'https://'
          }
        ]
      },
      wxCode: '',
      isBatch: false,
      dialogServerVisible: false,
      dialogUploadVisible: false,
      dialogWxCodeVisible: false,
      dialogBusinessVisible: false,
      loading: false,
      isChoosed: false,
      isExamine: false,
      isRelease: false,
      isUpLoading: false
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    // 撤销审核
    cancleAudit(e, id) {
      e.currentTarget.blur()
      this.$confirm('你确定要撤销审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_WX_APPLET_UNDOCODEAUDIT({
            AuthorizerId: id
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message.success('撤销审核成功')
              this.getData()
            }
          })
        })
        .catch(() => { })
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/wxapplet/wxappletstorelist',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.CompanyTitle = query.CompanyTitle || ''
      this.parameter.EnglishID = query.EnglishID || ''
      this.parameter.StoreTitle = query.StoreTitle || ''
      this.parameter.NickName = query.NickName || ''
      this.parameter.AppletTitle = query.AppletTitle || ''
      this.parameter.AppId = query.AppId || ''
      this.parameter.PreVersion = query.PreVersion || ''
      this.parameter.CurVersion = query.CurVersion || ''
      this.parameter.AuthStatus = +query.AuthStatus || 0
      this.parameter.Status = query.Status > -1 ? query.Status : -1

      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MARKETING_API_WX_APPLET_GETWXAPPLETLIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    releaseWxApp(id) {
      this.$store.commit('SET_FULL_LOADING', true)
      if (id) {
        this.AuthorizerIds = []
        this.AuthorizerIds.push(id)
      }
      MARKETING_API_WX_APPLET_PUBLISHWXAPPLET({
        AuthorizerIds: this.AuthorizerIds
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message.success('发布成功')
          this.getData()
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    uploadCode(id) {
      MARKETING_API_WX_APPLET_GETTEMPLATELATEST().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.uploadData = res.data.Data || {}
        }
      })
      if (id) {
        this.AuthorizerIds = []
        this.AuthorizerIds.push(id)
      }
      this.dialogUploadVisible = true
      this.initRoute()
    },
    chooseDomain(data, state) {
      switch (state) {
        case 0:
          if (data.SerDomain) {
            let arr = []
            arr = data.SerDomain.split('|')
            if (arr[0].split(',').length > 0 && arr[0].split(',')[0] != '') {
              this.ServerData.requestOpts = []
              arr[0].split(',').forEach(m => {
                this.ServerData.requestOpts.push({
                  requestUrl: m
                })
              })
            } else {
              this.ServerData.requestOpts = [
                {
                  requestUrl: 'https://'
                }
              ]
            }

            if (arr[1].split(',').length > 0 && arr[1].split(',')[0] != '') {
              this.ServerData.socketOpts = []
              arr[1].split(',').forEach(m => {
                this.ServerData.socketOpts.push({
                  socketUrl: m
                })
              })
            } else {
              this.ServerData.socketOpts = [
                {
                  socketUrl: 'wws://'
                }
              ]
            }

            if (arr[2].split(',').length > 0 && arr[2].split(',')[0] != '') {
              this.ServerData.uploadFileOpts = []
              arr[2].split(',').forEach(m => {
                this.ServerData.uploadFileOpts.push({
                  uploadFileUrl: m
                })
              })
            } else {
              this.ServerData.uploadFileOpts = [
                {
                  uploadFileUrl: 'https://'
                }
              ]
            }

            if (arr[3].split(',').length > 0 && arr[3].split(',')[0] != '') {
              this.ServerData.downloadFileOpts = []
              arr[3].split(',').forEach(m => {
                this.ServerData.downloadFileOpts.push({
                  downloadFileUrl: m
                })
              })
            } else {
              this.ServerData.downloadFileOpts = [
                {
                  downloadFileUrl: 'https://'
                }
              ]
            }
          }

          // this.requestOpts = arr[0].split(',')
          // this.socketOpts = arr[1].split(',')
          // this.uploadFileOpts = arr[2].split(',')
          // this.downloadFileOpts = arr[3].split(',')

          this.dialogServerVisible = true
          break
        case 1:
          if (data.BusDomain) {
            this.domainsData.domainsOpts = []
            data.BusDomain.split(',').forEach(m => {
              this.domainsData.domainsOpts.push({
                domainUrl: m
              })
            })
          } else {
            this.domainsData.domainsOpts = [
              {
                domainUrl: 'https://'
              }
            ]
          }
          this.dialogBusinessVisible = true
          break
        default:
          break
      }
      // 初始化数组
      this.AuthorizerIds = []
      this.AuthorizerIds.push(data.AuthorizerId)
    },
    showWxCode(id) {
      this.dialogWxCodeVisible = true
      this.qrcodeLoading = true
      MARKETING_API_WX_APPLET_GETQRCODE({ AuthorizerId: id }).then(res => {
        this.qrcodeLoading = false
        if (res.data.Code == 'CORRECT') {
          this.wxCode = res.data.Data
        }
      })
    },
    removeItems(i, state) {
      switch (state) {
        case 0:
          if (this.ServerData.requestOpts.length > 1) {
            this.ServerData.requestOpts.splice(i, 1)
          }
          break
        case 1:
          if (this.ServerData.socketOpts.length > 1) {
            this.ServerData.socketOpts.splice(i, 1)
          }
          break
        case 2:
          if (this.ServerData.uploadFileOpts.length > 1) {
            this.ServerData.uploadFileOpts.splice(i, 1)
          }
          break
        case 3:
          if (this.ServerData.downloadFileOpts.length > 1) {
            this.ServerData.downloadFileOpts.splice(i, 1)
          }
          break
        default:
          break
      }
    },
    removeDomains(i) {
      this.domainsData.domainsOpts.splice(i, 1)
    },
    addItems(i, state) {
      switch (state) {
        case 0:
          if (this.ServerData.requestOpts.length < 5) {
            this.ServerData.requestOpts.push({
              requestUrl: 'https://'
            })
          }
          break
        case 1:
          if (this.ServerData.socketOpts.length < 5) {
            this.ServerData.socketOpts.push({
              socketUrl: 'wws://'
            })
          }
          break
        case 2:
          if (this.ServerData.uploadFileOpts.length < 5) {
            this.ServerData.uploadFileOpts.push({
              uploadFileUrl: 'https://'
            })
          }
          break
        case 3:
          if (this.ServerData.downloadFileOpts.length < 5) {
            this.ServerData.downloadFileOpts.push({
              downloadFileUrl: 'https://'
            })
          }
          break
        default:
          break
      }
    },
    addDomains() {
      if (this.domainsData.domainsOpts.length < 5) {
        this.domainsData.domainsOpts.push({
          domainUrl: 'https://'
        })
      }
    },
    onSubmit(formData, state) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          switch (state) {
            case 0:
              this.isUpLoading = true
              MARKETING_API_WX_APPLET_MODIFYDOMAIN(
                {
                  WxaServer_Request: this.ServerData.requestOpts.map(m => {
                    return m.requestUrl
                  }),
                  WxaServer_Socket: this.ServerData.socketOpts.map(m => {
                    return m.socketUrl
                  }),
                  WxaServer_Upload: this.ServerData.uploadFileOpts.map(m => {
                    return m.uploadFileUrl
                  }),
                  WxaServer_Download: this.ServerData.downloadFileOpts.map(m => {
                    return m.downloadFileUrl
                  }),
                  AuthorizerIds: this.AuthorizerIds
                }
              )
                .then(res => {
                  this.dialogServerVisible = false
                  this.isUpLoading = false
                  if (res.data.Code == 'CORRECT') {
                    this.$message({
                      type: 'success',
                      message: '配置服务器域名成功！'
                    })
                    this.getData()
                  }
                })
                .catch(() => {
                  this.dialogServerVisible = false
                  this.isUpLoading = false
                })
              break
            case 1:
              MARKETING_API_WX_APPLET_SETWEBVIEWDOMAIN(
                {
                  Domain: this.domainsData.domainsOpts.map(m => {
                    return m.domainUrl
                  }),
                  AuthorizerIds: this.AuthorizerIds
                }
              ).then(res => {
                this.dialogBusinessVisible = false
                if (res.data.Code == 'CORRECT') {
                  this.$message({
                    type: 'success',
                    message: '配置服务器域名成功！'
                  })
                  this.getData()
                }
              })
              break
            case 2:
              MARKETING_API_WX_APPLET_WXACOMMIT({
                Template_id: this.uploadData.template_id,
                AuthorizerIds: this.AuthorizerIds
              }).then(res => {
                this.dialogUploadVisible = false
                if (res.data.Code == 'CORRECT') {
                  this.$message({
                    type: 'success',
                    message: '上传代码成功!'
                  })
                  this.$refs.uploadData.resetFields()
                  this.getData()
                }
              })
              break
            default:
              break
          }
        }
      })
    },
    handleClose() {
      if (this.dialogServerVisible) {
        this.$refs.ServerData.resetFields()
        this.dialogServerVisible = false
        // 初始化数据
        this.ServerData.requestOpts = [
          {
            requestUrl: 'https://'
          }
        ]
        this.ServerData.socketOpts = [
          {
            socketUrl: 'wws://'
          }
        ]
        this.ServerData.uploadFileOpts = [
          {
            uploadFileUrl: 'https://'
          }
        ]
        this.ServerData.downloadFileOpts = [
          {
            downloadFileUrl: 'https://'
          }
        ]
      } else if (this.dialogBusinessVisible) {
        this.$refs.domainsData.resetFields()
        this.dialogBusinessVisible = false
        // 初始化数据
        this.domainsData.domainsOpts = [
          {
            domainUrl: 'https://'
          }
        ]
      } else if (this.dialogUploadVisible) {
        this.$refs.uploadData.resetFields()
        this.dialogUploadVisible = false
      }
    },
    handleSelectionChange(val) {
      // 初始化数据
      this.multipleSelection = val
      this.AuthorizerIds = []
      this.isExamine = false
      this.isRelease = false

      if (val.length > 0) {
        this.isChoosed = true
      } else {
        this.isChoosed = false
      }
      val.forEach(item => {
        this.AuthorizerIds.push(item.AuthorizerId)
        if (
          item.Status != this.WxAppletStatus.PublishedFailed &&
          item.Status != this.WxAppletStatus.Audit
        ) {
          this.isRelease = true
        }
        if (
          (item.Status != this.WxAppletStatus.Wait &&
            item.Status != this.WxAppletStatus.Failed) ||
          item.Status == this.WxAppletStatus.PublishedSuccess
        ) {
          this.isExamine = true
        }
      })
    },
    examine(e, id) {
      e.currentTarget.blur()
      this.AuthorizerIds = []
      this.AuthorizerIds.push(id)
      this.$confirm('你确定要审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_WX_APPLET_SUBMITAUDIT({
            AuthorizerIds: this.AuthorizerIds
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: '已提交审核!'
              })
              this.getData()
            }
          })
        })
        .catch(() => { })
    },
    sizeChange(value) {
      // 切换每页显示数
      this.parameter.PageSize = value
      this.parameter.PageIndex = 1
      this.initRoute()
    },
    currentChange(value) {
      // 切换当前页
      this.parameter.PageIndex = value
      this.initRoute()
    },
    formatData(row, column) {
      switch (column.property) {
        case 'Status':
          return WxAppletStatus.Types[row[column.property]]
        case 'AuthStatus':
          return this.WxAuthorizerStatus.Types[row[column.property]]
        case 'SerDomain':
          return row[column.property] ? '已配置' : '-'
        case 'BusDomain':
          return row[column.property] ? '已配置' : '-'
        case 'PreVersion':
          return row[column.property] ? row[column.property] : '-'
        case 'CurVersion':
          return row[column.property] ? row[column.property] : '-'
        default:
          return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-140 {
  width: 140px;
}
.w450 {
  width: 450px;
}
.m-b-15 {
  margin-bottom: 15px;
}
.img-sty {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 200px;
}
.dialog-c-box {
  max-height: 580px;
  overflow: auto;
}
.row-btn .el-col {
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  img {
    vertical-align: middle;
  }
}
.col-img {
  img {
    vertical-align: middle;
  }
}
.font-sty {
  font-size: 12px;
  color: #606266;
}
.img-box {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 200px;
}
.over-hide {
  //  overflow: hidden;
  display: flex;
  justify-content: space-between;
}
.left-box {
  width: 755px;
  //  overflow: hidden;

  //  float: left;
}
.right-box {
  flex: 1;
  text-align: right;
  padding-top: 10px;
  overflow: hidden;
  & > span {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
<style lang="scss">
.err-msg-sty .el-form-item__error {
  padding-left: 12.5%;
}
</style>

