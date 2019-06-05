<template>
  <el-row
    type="flex"
    :gutter="10"
  >
    <el-col
      :span="4"
      class="left-col"
    >
      <ul class="saas-menu">
        <li
          class="s-menu-item"
          v-for="(item,index) in charactertypes.Types"
          :key="index"
          :name="'menu' + index"
        >
          <div class="menu-name name">
            <span>{{item}}</span>
            <i
              class="icon-set"
              @click="selectCharacter(parseInt(index))"
            ></i>
          </div>
          <ul>
            <template v-for="(pack,pi) in packages">
              <li
                class="s-sub-item"
                :key="pi"
                v-if="pack.CharacterType == index"
                @click="selectPackage(pack)"
                :name="'menuItem' + index"
              >
                <div
                  class="sub-name name"
                  :class="{'active': pack.PackId == currentPack.PackId}"
                >
                  <span>{{pack.PackName}}</span>
                  <el-tag
                    type="danger"
                    v-if="packageTypes.Inner == pack.PackType"
                  >{{packageTypes.Types[pack.PackType]}}</el-tag>
                  <el-tag
                    type="info"
                    v-if="pack.MultiType == multiTypes.One"
                  >{{multiTypes.Types[pack.MultiType]}}</el-tag>
                  <el-tag v-if="ynStatus.Yes == pack.IsDefault">默认</el-tag>
                </div>
              </li>
            </template>
          </ul>
        </li>
      </ul>
    </el-col>
    <el-col
      :span="18"
      class="right-col"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <div class="tabs">
        <span
          class="tab"
          :class="{'active': terminalType == index}"
          v-for="(item, index) in terminalTypes.Types"
          :key="index"
          @click="terminalChange(index)"
          :name="'tab' + index"
        >{{item}}</span>
      </div>
      <div class="panel">
        <el-row class="m-10">
          <el-button
            name="createSystem"
            type="primary"
            size="small"
            @click="editSysVisible = true"
          >新建系统</el-button>
          <el-button
            name="createNewMenuList"
            type="primary"
            size="small"
            @click="editGroupVisible = true"
            :disabled="sysMenus.length == 0"
          >新建菜单分组</el-button>
          <el-button
            name="systemOrListRank"
            type="primary"
            size="small"
            @click="editSysSortVisible = true"
            :disabled="sysMenus.length == 0"
          >系统/分组排序</el-button>
        </el-row>
        <el-row class="p10">
          <el-table
            class="sys-menus-tb"
            :data="sysMenus"
            :span-method="rowSpanSysMenus"
          >
            <el-table-column
              prop="SystemName"
              label="系统"
              width="200"
            >
              <template slot-scope="scope">
                <div class="sysBox">
                  <i :class="scope.row.NaviIcon"></i>
                  <div class="content">
                    <span class="name">{{scope.row.SystemName}}</span>
                    <div class="operation">
                      <el-button
                        name="editSys"
                        type="text"
                        @click="editSys(scope.row)"
                      >编辑</el-button>
                      <el-button
                        name="delSys"
                        type="text"
                        @click="delSys($event,scope.row)"
                      >删除</el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="SubName"
              label="菜单分组"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="Menus"
              label="功能菜单"
            >
              <template slot-scope="scope">
                <div
                  class="menu-box"
                  v-if="scope.row.SystemType == systemTypes.Inner"
                >
                  <span
                    v-for="(item,index) in scope.row.Menus"
                    :key="index"
                  >{{item.MenuCode}}-{{item.MenuName}}&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div v-else>
                  <a
                    :href="scope.row.SystemLinkUrl"
                    target="_bank"
                  >{{scope.row.SystemLinkUrl}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  name="editGroupMenus"
                  type="text"
                  @click="editGroupMenus(scope.row)"
                  v-if="scope.row.SubId"
                >功能配置</el-button>
                <el-button
                  name="editGroup"
                  type="text"
                  @click="editGroup(scope.row)"
                  v-if="scope.row.SubId"
                >编辑分组</el-button>
                <el-button
                  name="delGroup"
                  type="text"
                  @click="delGroup($event,scope.row)"
                  v-if="scope.row.SubId"
                >删除分组</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-col>
    <!-- @module 编辑系统 -->
    <el-dialog
      :title="(editSysForm.SystemId ? '编辑': '新建') + '系统'"
      width="800px"
      :visible.sync="editSysVisible"
      @close="resetEditSysForm"
    >
      <el-form
        class="fix-w"
        label-position="right"
        label-width="100px"
        :model="editSysForm"
        :rules="sysRules"
        ref="editSysForm"
      >
        <el-form-item
          label="系统编码："
          prop="SystemCode"
          :class="{'is-required': this.terminalType == terminalTypes.App}"
        >
          <el-input
            name="SystemCode"
            v-model="editSysForm.SystemCode"
            :maxlength="6"
          ></el-input>
          <p>
            <em>（用于手机端，APP底部导航，A用来标记工作台里面的系统，B标记数据里面的系统）</em>
          </p>
        </el-form-item>
        <el-form-item
          label="系统名称："
          prop="SystemName"
        >
          <el-input
            name="SystemName"
            v-model="editSysForm.SystemName"
            @blur="editSysForm.SystemName = editSysForm.SystemName.trim()"
            placeholder="6个字以内"
            :maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="导航图标："
          prop="NaviIcon"
        >
          <div class="icons-box">
            <span
              :name="'navIcon' + index"
              v-for="(icon, index) in icons"
              :key="index"
              :class="{'active':editSysForm.NaviIcon == icon}"
              @click="editSysForm.NaviIcon = icon"
            >
              <i :class="icon"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item
          label="系统类型："
          prop="SystemType"
        >
          <el-radio-group
            name="SystemType"
            v-model="editSysForm.SystemType"
          >
            <el-radio
              v-for="(item, index) in systemTypes.Types"
              :key="item"
              :label="parseInt(index)"
            >{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="链接地址："
          prop="LinkUrl"
          :class="{'is-required': editSysForm.SystemType == systemTypes.Outer}"
        >
          <el-input
            name="LinkUrl"
            v-model="editSysForm.LinkUrl"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="首页导航："
          prop="IsHomed"
        >
          <el-radio-group
            name="IsHomed"
            v-model="editSysForm.IsHomed"
          >
            <el-radio
              v-for="(item, index) in ynStatus.Types"
              :key="item"
              :label="parseInt(index)"
            >{{index == ynStatus.Yes ? '显示' : '不显示'}}</el-radio>
          </el-radio-group>
          <em>（设置为显示，在首页显示导航图片，点击链接到系统介绍页。）</em>
        </el-form-item>
        <el-form-item
          label="导航图片："
          prop="HomeIcon"
          :class="{'is-required': editSysForm.IsHomed == ynStatus.Yes}"
        >
          <div class="img-box">
            <div
              class="img"
              v-for="(icon, index) in homeIcons"
              :key="index"
              :class="{'active':editSysForm.HomeIcon == icon}"
              @click="editSysForm.HomeIcon = editSysForm.HomeIcon == icon ? '' : icon"
            >
              <img :src="$root.settings.DOMAIN_IMAGE + '/default/images/' + icon">
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="导航链接："
          prop="IsAjax"
        >
          <el-radio-group
            name="IsAjax"
            v-model="editSysForm.IsAjax"
          >
            <el-radio
              v-for="(item, index) in ynStatus.Types"
              :key="item"
              :label="parseInt(index)"
            >{{index == ynStatus.Yes ? '链接' : '不链接'}}</el-radio>
          </el-radio-group>
          <em>（设置为链接，点击系统左侧的图标，链接到系统介绍页。）</em>
        </el-form-item>
        <el-form-item
          label="系统介绍："
          prop="Note"
        >
          <div ref="editor"></div>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="saveSys"
          type="primary"
          @click="saveSys"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          name="cancelSys"
          @click="resetEditSysForm"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑系统 -->
    <!-- @module 编辑分组 -->
    <el-dialog
      :title="(editGroupForm.SubId ? '编辑': '新建') + '分组'"
      width="600px"
      :visible.sync="editGroupVisible"
      @close="resetEditGroupForm"
    >
      <el-form
        class="fix-w"
        label-position="right"
        label-width="100px"
        :model="editGroupForm"
        :rules="groupRules"
        ref="editGroupForm"
      >
        <el-form-item
          label="所属系统："
          prop="SystemId"
        >
          <el-select
            name="SystemId"
            v-model="editGroupForm.SystemId"
            :filterable="true"
            placeholder="全部"
          >
            <el-option
              label="请选择"
              value
            ></el-option>
            <el-option
              v-for="(item, index) in sysDropItems"
              :key="index"
              :label="item.SystemName"
              :value="item.SystemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分组名称："
          prop="SubName"
        >
          <el-input
            name="SubName"
            v-model="editGroupForm.SubName"
            @blur="editGroupForm.SubName = editGroupForm.SubName.trim()"
            placeholder="8个字以内"
            maxlength="8"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="saveGroup"
          type="primary"
          size="small"
          @click="saveGroup"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          name="cancelGroup"
          size="small"
          @click="resetEditGroupForm"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑系统 -->
    <!-- @module 套餐管理 -->
    <el-dialog
      title="套餐管理"
      v-if="editPackageVisible"
      width="1000px"
      :visible.sync="editPackageVisible"
      @close="closePackageDialog"
    >
      <el-row>
        <el-button
          name="createPackage"
          type="text"
          @click="createPackage"
        >+新建</el-button>
      </el-row>
      <el-table :data="editPackages | filterPackage">
        <el-table-column
          prop="PackName"
          width="140"
          label="套餐"
        >
          <template slot-scope="scope">
            <el-input
              name="PackName"
              v-model="scope.row.PackName"
              @blur="scope.row.PackName = scope.row.PackName.trim()"
              v-if="scope.row.edit || scope.row.newAdd"
              :maxlength="20"
            ></el-input>
            <span v-else>{{scope.row.PackName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="MultiType"
          width="140"
          label="类型"
        >
          <template slot-scope="scope">
            <el-select
              :disabled="scope.row.edit"
              name="MultiType"
              v-model="scope.row.MultiType"
              v-if="scope.row.edit || scope.row.newAdd"
              :filterable="true"
            >
              <el-option
                v-for="(item, index) in multiTypes.Types"
                :key="item"
                :label="item"
                :value="parseInt(index)"
              ></el-option>
            </el-select>
            <span v-else>{{multiTypes.Types[scope.row.MultiType]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="PackType"
          width="140"
          label="内/外"
        >
          <template slot-scope="scope">
            <el-select
              name="PackType"
              v-model="scope.row.PackType"
              v-if="scope.row.edit || scope.row.newAdd"
              :filterable="true"
            >
              <el-option
                v-for="(item, index) in packageTypes.Types"
                :key="item"
                :label="item"
                :value="parseInt(index)"
              ></el-option>
            </el-select>
            <span v-else>{{packageTypes.Types[scope.row.PackType]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="IsDefault"
          label="是否默认"
        >
          <template
            slot-scope="scope"
            v-if="addOrEditPackage"
          >{{ynStatus.Types[scope.row.IsDefault]}}</template>
        </el-table-column>
        <el-table-column
          prop="SortId"
          label="顺序"
          width="180"
        >
          <template slot-scope="scope">
            <div
              class="rank-btn-group tc"
              v-if="addOrEditPackage"
            >
              <span
                name="rankBtnGroup"
                class="rank-btn"
                v-for="(icon, index) in scope.row.rank"
                :key="index"
                :class="icon"
                @click="packageSorting(icon,scope.row.index,editPackages)"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="!scope.row.edit && !scope.row.newAdd">
              <el-button
                name="editPackage"
                type="text"
                size="small"
                @click="editPackage(scope.row)"
              >修改</el-button>
              <el-button
                name="delPackage"
                type="text"
                size="small"
                @click="delPackage($event,scope.row)"
              >删除</el-button>
              <el-button
                name="setPackageDefault"
                type="text"
                size="small"
                @click="setPackageDefault(scope.row)"
                v-if="scope.row.IsDefault == ynStatus.No"
              >设为默认</el-button>
            </template>
            <template v-if="scope.row.edit || scope.row.newAdd">
              <el-button
                name="savePackage"
                type="text"
                size="small"
                @click="savePackage(scope.row)"
                :loading="isSavingPackage"
              >保存</el-button>
              <el-button
                name="cancelPackage"
                type="text"
                size="small"
                @click="cancelPackage(scope.row)"
              >取消</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <p class="tc m-10">
        <em>注：选择“内部”，仅平台可见，可用于测试、特殊客户等场景。</em>
      </p>
    </el-dialog>
    <!-- End 套餐管理 -->
    <!-- @module 系统/分组排序 -->
    <el-dialog
      title="系统/分组排序"
      v-if="editSysSortVisible"
      width="700px"
      :visible.sync="editSysSortVisible"
    >
      <el-row class="sys-sort-btns">
        <el-button
          name="changeSysSortShow"
          size="small"
          @click="changeSysSortShow"
        >{{showSysSortItems ? '-全部收起':'+全部展开'}}</el-button>
      </el-row>
      <div
        v-for="(item, index) in sysSortItems"
        :key="index"
      >
        <div class="sys-sort-item">
          <div>
            <i
              class="icon"
              :class="item.NaviIcon"
            ></i>
            <span class="name">{{item.SystemName}}</span>
          </div>
          <div
            class="rank-btn-group"
            v-if="sysSortItems.length != 1"
          >
            <span
              name="sysRankBtnFirst"
              class="rank-btn to-first"
              v-if="index != 0 && sysSortItems.length > 2"
              @click="sysSorting(sortTypes.First,item.SystemId)"
            ></span>
            <span
              name="sysRankBtnPrev"
              class="rank-btn to-prev"
              v-if="index != 0"
              @click="sysSorting(sortTypes.Prev,item.SystemId)"
            ></span>
            <span
              name="sysRankBtnNext"
              class="rank-btn to-next"
              v-if="index != sysSortItems.length - 1"
              @click="sysSorting(sortTypes.Next,item.SystemId)"
            ></span>
            <span
              name="sysRankBtnLast"
              class="rank-btn to-last"
              v-if="index != sysSortItems.length - 1  && sysSortItems.length > 2"
              @click="sysSorting(sortTypes.Last,item.SystemId)"
            ></span>
          </div>
        </div>
        <div
          v-show="item.Show"
          class="sys-sort-item sys-sub-item"
          v-for="(sub, subIndex) in item.Subs"
          :key="subIndex"
        >
          <span class="name">{{sub.SubName}}</span>
          <div
            class="rank-btn-group"
            v-if="item.Subs.length != 1"
          >
            <span
              name="subRankBtnFirst"
              class="rank-btn to-first"
              v-if="subIndex != 0 && item.Subs.length > 2"
              @click="sysSorting(sortTypes.First,item.SystemId,sub.SubId)"
            ></span>
            <span
              name="subRankBtnPrev"
              class="rank-btn to-prev"
              v-if="subIndex != 0"
              @click="sysSorting(sortTypes.Prev,item.SystemId,sub.SubId)"
            ></span>
            <span
              name="subRankBtnNext"
              class="rank-btn to-next"
              v-if="subIndex != item.Subs.length - 1"
              @click="sysSorting(sortTypes.Next,item.SystemId,sub.SubId)"
            ></span>
            <span
              name="subRankBtnlast"
              class="rank-btn to-last"
              v-if="subIndex != item.Subs.length - 1  && item.Subs.length > 2"
              @click="sysSorting(sortTypes.Last,item.SystemId,sub.SubId)"
            ></span>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="saveSysSort"
          type="primary"
          size="small"
          @click="saveSysSort"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          name="cancelSysSort"
          size="small"
          @click="editSysSortVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 系统/分组排序 -->
    <!-- @module 功能配置 -->
    <menu-setter
      v-if="editPackMenuVisible"
      :data="packMenuAllList"
      :current="packGroupCurrent.Menus || []"
      :props="{key: 'MenuId'}"
      @changed="saveCurrentMenus"
      :visible.sync="editPackMenuVisible"
    >
      <span slot-scope="scope">{{ scope.option.MenuCode }} - {{ scope.option.MenuName }}</span>
    </menu-setter>
    <!-- End 功能配置 -->
  </el-row>
</template>
<script>
import { CharacterType, YNStatus, SortType } from '@/enums/common.js'
import {
  SecurityTerminalType,
  SecurityPackType,
  SecurityPackBasicMultiType,
  SecurityPackSystemType
} from '@/enums/merchant'

import {
  MERCHANT_API_SECURITY_PACK_BASIC_GETS,
  MERCHANT_API_SECURITY_PACK_SYS_UPDATE,
  MERCHANT_API_SECURITY_PACK_SYS_CREATE,
  MERCHANT_API_SECURITY_PACK_SYS_DELETE,
  MERCHANT_API_SECURITY_PACK_SUB_CREATE,
  MERCHANT_API_SECURITY_PACK_SUB_UPDATE,
  MERCHANT_API_SECURITY_PACK_BASIC_CREATE,
  MERCHANT_API_SECURITY_PACK_BASIC_UPDATE,
  MERCHANT_API_SECURITY_PACK_BASIC_DEFAULT,
  MERCHANT_API_SECURITY_PACK_BASIC_SORT,
  MERCHANT_API_SECURITY_PACK_BASIC_DISABLE,
  MERCHANT_API_SECURITY_PACK_MENU_REQS,
  MERCHANT_API_SECURITY_PACK_SUB_DELETE,
  MERCHANT_API_SECURITY_MENU_GETS,
  MERCHANT_API_SECURITY_PACK_MENU_CREATE,
  MERCHANT_API_SECURITY_PACK_SYS_SORT
} from '@/apis/merchant'
import menuSetter from '@/components/menuSetter'
import Editor from 'editor-lcb'

export default {
  data() {
    return {
      icons: [
        'icon-crm',
        'icon-erp',
        'icon-message',
        'icon-star-round',
        'icon-xinchou',
        'icon-kaquan',
        'icon-kefu',
        'icon-gift',
        'icon-set',
        'icon-star',
        'icon-zhankai',
        'icon-weixin',
        'icon-cat',
        'icon-finance',
        'icon-inventor',
        'icon-bulk',
        'icon-bulk-in',
        'icon-college',
        'icon-sale'
      ],
      homeIcons: [
        'sys1.png',
        'sys2.png',
        'sys3.png',
        'sys4.png',
        'sys5.png',
        'sys6.png',
        'sys7.png',
        'sys8.png',
        'sys9.png',
        'sys10.png',
        'sys11.png',
        'sys12.png'
      ],
      sortTypes: {},
      ynStatus: {},
      charactertypes: {},
      characterType: 0,
      terminalTypes: {},
      terminalType: SecurityTerminalType.Web,
      systemTypes: {},
      packageTypes: {},
      multiTypes: {},
      packages: [],
      currentPack: {},
      sysSortItems: [], // 系统/分组排序数据
      sysDropItems: [], // 新建分组的下拉数据
      sysMenus: [],
      editSysVisible: false,
      editSysForm: {
        PackId: 0,
        TerminalType: 0,
        SystemCode: '',
        SystemName: '',
        NaviIcon: '',
        SystemType: SecurityPackSystemType.Inner,
        LinkUrl: '',
        HomeIcon: '',
        IsHomed: YNStatus.No,
        IsAjax: YNStatus.Yes,
        Note: ''
      },
      sysRules: {
        SystemName: [
          {
            required: true,
            message: '请输入系统名称',
            trigger: 'change'
          }
        ],
        NaviIcon: [
          {
            required: true,
            message: '请选择导航图标',
            trigger: 'change'
          }
        ],
        SystemType: [
          {
            type: 'number',
            required: true,
            message: '请选择系统类型',
            trigger: 'change'
          }
        ],
        IsHomed: [
          {
            type: 'number',
            required: true,
            message: '请选择首页导航',
            trigger: 'change'
          }
        ],
        HomeIcon: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.editSysForm.IsHomed === this.ynStatus.Yes && !value) {
                callback('请选择导航图片')
              } else {
                callback()
              }
            }
          }
        ],
        IsAjax: [
          {
            type: 'number',
            required: true,
            message: '请选择导航链接',
            trigger: 'change'
          }
        ],
        LinkUrl: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (
                this.editSysForm.SystemType === this.packageTypes.Outer &&
                !value
              ) {
                callback('请输入连接地址')
              } else {
                callback()
              }
            }
          }
        ],
        SystemCode: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (
                this.editSysForm.TerminalType === this.terminalTypes.App + '' &&
                !value
              ) {
                callback('请输入系统编码')
              } else {
                callback()
              }
            }
          }
        ]
      },
      editGroupVisible: false,
      editGroupForm: {
        SystemId: '',
        SubName: ''
      },
      groupRules: {
        SubName: [
          {
            required: true,
            message: '请输入分组名称',
            trigger: 'change'
          }
        ],
        SystemId: [
          {
            required: true,
            message: '请选择所属系统',
            trigger: 'change'
          }
        ]
      },
      editPackages: [], // 当前编辑的套餐组
      editPackageVisible: false,
      addOrEditPackage: true,
      isSavingPackage: false,
      editPackMenuVisible: false,
      packMenuAllList: [],
      packGroupCurrent: {}, // 当前配置的系统分组
      editSysSortVisible: false,
      showSysSortItems: true,
      editor: null
    }
  },
  methods: {
    // 获取左侧角色套餐
    getPackBasicList() {
      MERCHANT_API_SECURITY_PACK_BASIC_GETS({
        CharacterType: 0,
        PageIndex: 1,
        PageSize: 9999
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packages = res.data.Data.Rows
          if (!this.currentPack.PackId) {
            this.currentPack = res.data.Data.Rows[0] // 初始化选中第一个套餐
            this.editSysForm.PackId = this.currentPack.PackId
          }
          if (this.characterType) {
            this.selectCharacter(this.characterType)
          }
          this.getPackMenus()
        }
      })
    },
    // 获取当前选中套餐的系统菜单数据
    getPackMenus() {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SECURITY_PACK_MENU_REQS({
        RoleId: 0,
        SystemId: 0,
        NeedSystemNote: 0,
        NeedPower: 0,
        PackId: this.currentPack.PackId,
        TerminalType: this.terminalType
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.sysDropItems = res.data.Data.Systems || []
          this.sysSortItems = this.sysDropItems.map((item, index) => {
            item.SortId = index + 1
            item.Show = true
            item.Subs &&
              item.Subs.map((sub, subIndex) => {
                sub.SortId = subIndex + 1
              })
            return item
          })
          this.sysMenus = this.resetSysMenus(res.data.Data.Systems || [])
        }
      })
    },
    // 重置系统菜单数据结构
    resetSysMenus(data) {
      let arr = []
      data.forEach(sys => {
        const subs = [...(sys.Subs || [])]
        if (!subs.length) {
          arr.push(
            Object.assign(sys, {
              Rows: 1
            })
          )
        }
        subs.forEach((sub, index) => {
          let obj = Object.assign({}, sys, sub)
          if (index === 0) {
            obj.Rows = subs.length || 1
            obj.Index = 0
          } else {
            obj.Rows = 0
            delete obj.Subs
          }
          arr.push(obj)
        })
      })
      return arr
    },
    rowSpanSysMenus({ row, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: !row.Rows ? 0 : row.Rows,
          colspan: !row.Rows ? 0 : 1
        }
      }
    },
    // 选择套餐数据
    selectPackage(item) {
      if (item.CharacterType !== this.currentPack.CharacterType) {
        this.packMenuAllList = []
      }
      if (item.Id !== this.currentPack.PackId) {
        this.currentPack = item
        this.editSysForm.PackId = item.PackId
        this.getPackMenus()
      }
    },
    // 平台切换
    terminalChange(type) {
      this.terminalType = Number(type)
      this.editSysForm.TerminalType = Number(type)
      this.packMenuAllList = []
      this.getPackMenus() // 更新菜单数据
    },
    delSys(e, item) {
      e.currentTarget.blur()
      this.$confirm('确定删除此系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          MERCHANT_API_SECURITY_PACK_SYS_DELETE({
            SystemId: item.SystemId
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getPackMenus()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    // 编辑系统
    editSys(item) {
      this.editSysForm = {
        SystemId: item.SystemId,
        PackId: item.PackId,
        TerminalType: item.TerminalType,
        SystemCode: item.SystemCode,
        SystemName: item.SystemName,
        NaviIcon: item.NaviIcon,
        SystemType: item.SystemType,
        LinkUrl: item.SystemLinkUrl,
        HomeIcon: item.HomeIcon,
        IsHomed: item.IsHomed,
        IsAjax: item.IsAjax,
        Note: item.Note
      }
      this.editSysVisible = true
    },
    // 保存系统
    saveSys() {
      this.$refs['editSysForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let apiName = MERCHANT_API_SECURITY_PACK_SYS_CREATE
          if (this.editSysForm.SystemId) {
            apiName = MERCHANT_API_SECURITY_PACK_SYS_UPDATE
          }
          apiName(this.editSysForm).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.editSysVisible = false
              this.getPackMenus()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    // 重置系统表单
    resetEditSysForm() {
      this.editSysForm = Object.assign({}, this.editSysForm, {
        SystemId: '',
        SystemCode: '',
        SystemName: '',
        NaviIcon: '',
        SystemType: SecurityPackSystemType.Inner,
        LinkUrl: '',
        HomeIcon: '',
        IsHomed: YNStatus.No,
        IsAjax: YNStatus.No,
        Note: ''
      })
      this.$refs['editSysForm'].resetFields()
      this.editSysVisible = false
    },
    delGroup(e, item) {
      e.currentTarget.blur()
      this.$confirm('确定删除此分组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          MERCHANT_API_SECURITY_PACK_SUB_DELETE({
            SubId: item.SubId
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getPackMenus()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    editGroup(item) {
      this.editGroupForm = {
        SubId: item.SubId,
        SystemId: item.SystemId,
        SubName: item.SubName
      }
      this.editGroupVisible = true
    },
    // 保存分组
    saveGroup() {
      this.$refs['editGroupForm'].validate(valid => {
        if (valid) {
          let apiName = MERCHANT_API_SECURITY_PACK_SUB_CREATE
          if (this.editGroupForm.SubId) {
            apiName = MERCHANT_API_SECURITY_PACK_SUB_UPDATE
          }
          this.$store.commit('SET_BTN_LOADING', true)
          apiName(this.editGroupForm).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存分组成功')
              this.editGroupVisible = false
              this.getPackMenus()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    // 重置系统表单
    resetEditGroupForm() {
      this.editGroupForm = {
        SubId: '',
        SystemId: '',
        SubName: ''
      }
      this.$refs['editGroupForm'].resetFields()
      this.editGroupVisible = false
    },
    closePackageDialog() {
      this.characterType = ''
      this.addOrEditPackage = true
      this.getPackBasicList()
    },
    // 以下都是套餐管理
    selectCharacter(type) {
      this.characterType = type
      this.editPackages = this.packages.filter(pack => {
        if (pack.CharacterType === type) {
          return pack
        }
      })
      this.editPackageVisible = true
    },
    createPackage() {
      if (this.addOrEditPackage) {
        this.editPackages.unshift({
          CharacterType: this.characterType,
          MultiType: this.multiTypes.More,
          PackType: this.packageTypes.Inner,
          PackName: '',
          newAdd: true
        })
        this.addOrEditPackage = false
      }
    },
    editPackage(row) {
      if (this.addOrEditPackage) {
        this.$set(
          this.editPackages,
          row.index,
          Object.assign(row, {
            edit: true
          })
        )
        this.addOrEditPackage = false
      }
    },
    savePackage(row) {
      console.log(row)
      if (!row.PackName.trim()) {
        this.isSavingPackage = false
        this.$message.warning('请填写套餐名称！')
      } else {
        this.isSavingPackage = true
        if (row.newAdd) {
          MERCHANT_API_SECURITY_PACK_BASIC_CREATE(row)
            .then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('新建成功!')
                this.getPackBasicList()
              } else {
                this.$message.error(res.data.Message)
                this.editPackages.shift()
              }
              setTimeout(() => {
                this.isSavingPackage = false
              }, 300)
            })
            .catch(() => {
              setTimeout(() => {
                this.isSavingPackage = false
              }, 300)
            })
        } else {
          this.updatePackage(row)
        }
        this.addOrEditPackage = true
      }
    },
    updatePackage(row) {
      MERCHANT_API_SECURITY_PACK_BASIC_UPDATE(row)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getPackBasicList()
          }
          this.isSavingPackage = false
        })
        .catch(() => {
          this.isSavingPackage = false
        })
    },
    delPackage(e, row) {
      e.currentTarget.blur()
      this.$confirm('确定删除此套餐？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MERCHANT_API_SECURITY_PACK_BASIC_DISABLE({
          PackId: row.PackId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.editPackages.splice(row.index, 1)
          }
        })
      })
    },
    cancelPackage(row) {
      if (row.newAdd) {
        this.editPackages.splice(row.index, 1)
      } else {
        this.getPackBasicList()
      }
      this.addOrEditPackage = true
      this.isSavingPackage = false
    },
    packageSorting(clazz, key, alls) {
      var sortType = ''
      // 排序计算
      switch (clazz) {
        case 'to-first':
          sortType = this.sortTypes.First
          break
        case 'to-prev':
          sortType = this.sortTypes.Prev
          break
        case 'to-next':
          sortType = this.sortTypes.Next
          break
        case 'to-last':
          sortType = this.sortTypes.Last
          break
        default:
          break
      }
      MERCHANT_API_SECURITY_PACK_BASIC_SORT({
        SortType: sortType,
        PackId: alls[key].PackId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getPackBasicList()
          this.selectCharacter(alls[key].CharacterType)
        } else {
          this.$message.error('失败')
        }
      })
    },
    setPackageDefault(row) {
      MERCHANT_API_SECURITY_PACK_BASIC_DEFAULT({
        PackId: row.Id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getPackBasicList()
        }
      })
    },
    // 功能配置
    editGroupMenus(row) {
      this.packGroupCurrent = row
      this.editPackMenuVisible = true
      if (!this.packMenuAllList.length) {
        this.getPackMenuList()
      }
    },
    // 获取当前角色菜单数据
    getPackMenuList() {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SECURITY_MENU_GETS({
        Note: this.currentPack.CharacterType,
        TerminalType: this.terminalType,
        Search: '',
        PageIndex: 1,
        PageSize: 999
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.packMenuAllList = res.data.Data.Rows
        }
      })
    },
    saveCurrentMenus(value) {
      let arr = []
      value.forEach((item, index) => {
        arr.push({
          MenuId: item,
          SortId: index + 1
        })
      })
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_PACK_MENU_CREATE({
        SubId: this.packGroupCurrent.SubId,
        Menus: arr
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.editPackMenuVisible = false
          this.getPackMenus()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    // 系统/分组排序
    sysSorting(moveType, systemId, subId) {
      let items = this.sysSortItems
      let moveItem, moveIndex
      if (subId) {
        items = this.sysSortItems.find(item => item.SystemId === systemId).Subs
        moveItem = JSON.parse(
          JSON.stringify(items.find(sub => sub.SubId === subId))
        )
        moveIndex = items.findIndex(item => item.SubId === subId)
      } else {
        moveItem = JSON.parse(
          JSON.stringify(
            this.sysSortItems.find(item => item.SystemId === systemId)
          )
        )
        moveIndex = this.sysSortItems.findIndex(
          item => item.SystemId === systemId
        )
      }
      let toIndex // 排序计算
      switch (moveType) {
        case this.sortTypes.First:
          toIndex = 0
          break
        case this.sortTypes.Prev:
          toIndex = moveIndex - 1
          break
        case this.sortTypes.Next:
          toIndex = moveIndex + 1
          break
        case this.sortTypes.Last:
          toIndex = items.length - 1
          break
        default:
          break
      }
      let toItem = JSON.parse(JSON.stringify(items[toIndex]))
      if (moveType === this.sortTypes.Next) {
        items.splice(moveIndex, 2, toItem, moveItem)
      } else if (moveType === this.sortTypes.Prev) {
        items.splice(toIndex, 2, moveItem, toItem)
      } else if (moveType === this.sortTypes.First) {
        items.unshift(moveItem)
        items.splice(moveIndex + 1, 1)
      } else {
        items.push(moveItem)
        items.splice(moveIndex, 1)
      }
      // 移动之后重新排序
      items.map((item, index) => {
        item.SortId = index + 1
        return item
      })
    },
    saveSysSort() {
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_PACK_SYS_SORT({
        Systems: this.sysSortItems
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.editSysSortVisible = false
          this.getPackMenus()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    changeSysSortShow() {
      this.showSysSortItems = !this.showSysSortItems
      this.sysSortItems.map(item => {
        item.Show = this.showSysSortItems
        return item
      })
    },
    initEditor() {
      if (!this.$refs.editor) {
        setTimeout(this.initEditor, 200)
        return
      } else if (!this.editor) {
        this.editor = new Editor(this.$refs.editor)
        this.editor.customConfig.onchange = html => {
          this.editSysForm.Note = html
        }
        this.editor.customConfig.uploadImgShowBase64 = true
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image' // 插入图片
        ]
        this.editor.create()
      }
      this.editor.txt.html(this.editSysForm.Note) // 初始化赋值
    }
  },
  filters: {
    filterPackage(value) {
      // 重新计算数据格式
      let hasNew = false
      value.map(text => {
        text.rank = ['to-first', 'to-prev', 'to-next', 'to-last']
        if (text.newAdd) {
          hasNew = true
        }
      })
      if (value.length) {
        if (hasNew) {
          value[0].rank = []
          if (value.length === 2) {
            value[1].rank = []
          }
          if (value.length > 2) {
            value[1].rank = ['to-next', 'to-last']
            value[value.length - 1].rank = ['to-first', 'to-prev']
          }
        } else if (value.length === 1) {
          value[0].rank = []
        } else {
          value[0].rank = ['to-next', 'to-last']
          value[value.length - 1].rank = ['to-first', 'to-prev']
        }
      }
      value.map((text, index) => {
        text.index = index
      })
      return value
    }
  },
  beforeMount() {
    this.sortTypes = SortType
    this.ynStatus = YNStatus
    this.charactertypes = CharacterType
    this.terminalTypes = SecurityTerminalType
    this.systemTypes = SecurityPackSystemType
    this.packageTypes = SecurityPackType
    this.multiTypes = SecurityPackBasicMultiType
    this.getPackBasicList()
  },
  mounted() {
    this.editSysForm.TerminalType = this.terminalType
  },
  watch: {
    editSysVisible: 'initEditor'
  },
  components: {
    menuSetter
  }
}
</script>

<style lang="scss" scoped>
.saas-menu {
  border: 1px solid $border-color;
  border-bottom-width: 0;
  .name {
    display: flex;
    align-items: center;
    height: 34px;
    border-bottom: 1px solid $border-color;
    color: #777;
    &.sub-name {
      position: relative;
      padding: 0 30px;
      color: #333;
      cursor: pointer;
      &.active {
        color: #0068b8;
        font-weight: bold;
        &::before {
          position: absolute;
          left: 15px;
          display: block;
          content: '';
          width: 12px;
          height: 12px;
          border: 3px solid #ffa200;
          border-radius: 12px;
        }
      }
    }
    &.menu-name {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      background-color: #f5f5f5;
      font-weight: bold;
      i {
        font-size: 14px;
        color: #bbb;
        cursor: pointer;
      }
    }
  }
}
.icons-box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-height: 201px;
  width: 351px;
  border: 1px solid $border-color;
  border-width: 1px 0 0 1px;
  overflow-y: auto;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border: 1px solid $border-color;
    border-width: 0 1px 1px 0;
    cursor: pointer;
    &.active {
      background-color: #399fe5;
      i {
        color: #fff;
      }
    }
    i {
      font-size: 26px;
    }
  }
}
.img-box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 501px;
  border: 1px solid $border-color;
  border-width: 1px 0 0 1px;
  overflow-y: auto;
  .img {
    position: relative;
    width: 125px;
    border: 1px solid $border-color;
    border-width: 0 1px 1px 0;
    cursor: pointer;
    &.active {
      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        content: '';
        border: 1px solid #399fe5;
      }
    }
    img {
      display: block;
      width: 100%;
    }
  }
}
.sysBox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  i {
    margin-right: 30px;
    font-size: 52px;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    justify-content: center;
    line-height: 18px;
    button {
      padding: 5px 0;
    }
  }
}
.sys-menus-tb /deep/ td {
  border-right: 1px solid $border-color;
  &:last-child {
    border-right: 0;
  }
}
.sys-sort-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid $border-color;
  &.sys-sub-item {
    padding-left: 60px;
  }
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    &.rank-btn-group {
      flex: none;
      width: 160px;
    }
  }
  .icon {
    width: 30px;
  }
}
.sys-sort-btns {
  padding-bottom: 5px;
  border-bottom: 1px solid $border-color;
  text-align: right;
}
.left-col {
  width: 300px;
}
.right-col {
  flex: 1;
}
</style>
