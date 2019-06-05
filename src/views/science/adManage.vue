<template>
  <div class="ad-manage">
    <el-table :data="tableData" v-loading="tbloading" class="tb">
      <el-table-column label="图片" min-width="350">
        <template slot-scope="scope">
          <div v-if="scope.row.ImageUrl">
            <img v-if="scope.row.LocationType == EnumSustainAdvertLocationType.LocationType1" :src="$root.settings.DOMAIN_IMG_FILE+scope.row.ImageUrl" class="pic pc">
            <img v-if="scope.row.LocationType == EnumSustainAdvertLocationType.LocationType3" :src="$root.settings.DOMAIN_IMG_FILE+scope.row.ImageUrl" class="pic app">
          </div>
          <img v-else src="@/assets/images/noimg.png" class="pic">
        </template>
      </el-table-column>
      <el-table-column label="位置" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{EnumSustainAdvertLocationType.Types[scope.row.LocationType]}}</template>
      </el-table-column>
      <el-table-column label="链接" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="cont">
            <p>{{EnumSustainAdvertLinkType.Types[scope.row.LinkType]}}</p>
            <span v-if="scope.row.LinkType != EnumSustainAdvertLinkType.Nothing">{{scope.row.LinkType == EnumSustainAdvertLinkType.Outter?scope.row.LinkUrl:scope.row.LinkTitle}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="打开方式" prop="openWay" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.LinkType != EnumSustainAdvertLinkType.Nothing">{{EnumSustainAdvertOpenType.Types[scope.row.OpenType]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用/停用" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch :value="scope.row.State == EnumEnableState.Enable" @change="switchChange(scope.row.AdvertId,scope.row.State)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <uploadImgByBtn :Root="$root.filePaths.COLLEGE_INFAST" @uploadSucc="uploadSucc(scope.row.AdvertId,$event)">修改图片</uploadImgByBtn>
          <el-button type="text" size="small" @click="modifyLink(scope.row)">修改链接</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="note">注：图片格式仅支持JPG／PNG格式，不超过2M大小、PC端建议1720*90、APP端建议750*270</div>
    <el-dialog title="修改链接" :visible.sync="dialogVisible" width="600px">
      <dl class="modify-link-dialog">
        <dt>链接内容：</dt>
        <dd>
          <el-radio-group v-model="LinkType" @change="linkTypeChange">
            <el-radio v-for="item in EnumSustainAdvertLinkType.TypeArray" :label="item.KeyId" :key="item.KeyId">{{item.Value}}</el-radio>
          </el-radio-group>
        </dd>
        <template v-if="LinkType != EnumSustainAdvertLinkType.Nothing">
          <dt>打开方式：</dt>
          <dd>
            <el-radio-group v-model="OpenType">
              <el-radio v-for="item in EnumSustainAdvertOpenType.TypeArray.filter(item=>item.KeyId!=EnumSustainAdvertOpenType.Dialog)" :label="item.KeyId" :key="item.KeyId">{{item.Value}}</el-radio>
            </el-radio-group>
          </dd>
          <template v-if="LinkType == EnumSustainAdvertLinkType.Outter">
            <dt>外部链接地址：</dt>
            <dd>
              <el-input v-model="LinkUrlOutter" maxlength="100" placeholder="必须以http://或https://开头，最多100个字符"></el-input>
            </dd>
          </template>
        </template>
      </dl>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="LinkType == EnumSustainAdvertLinkType.Outter || LinkType == EnumSustainAdvertLinkType.Nothing" type="primary" @click="btnSave" :loading="$store.getters.is_loading">保 存</el-button>
        <el-button v-else type="primary" @click="nextStep">下一步</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <addModal v-if="visibleAddModal" :title="title" :modifyObj="modifyObj" :visibleAddModal="visibleAddModal" @listenVisibleAddModal="listenVisibleAddModal" modifyLinkIf/>
  </div>
</template>
<script>
import {
  COLLEGE_API_SUSTAINADVERT_GETS, // 列表
  COLLEGE_API_SUSTAINADVERT_ENABLE, // 启用
  COLLEGE_API_SUSTAINADVERT_DISABLE, // 停用
  COLLEGE_API_SUSTAINADVERT_UPDATEIMAGE, // 修改图片
  COLLEGE_API_SUSTAINADVERT_UPDATE // 修改链接
} from '@/apis/science'

import { EnableState } from '@/enums/common'
import {
  SustainAdvertLocationType,
  SustainAdvertLinkType,
  SustainAdvertOpenType
} from '@/enums/science'

import addModal from './template/addModal'
import uploadImgByBtn from '@/components/common/uploadImgByBtn'

export default {
  data() {
    return {
      tbloading: false,
      dialogVisible: false, // 修改链接
      AdvertId: null, // 广告序号
      OpenType: 1, // 打开方式
      ImageUrl: '', // 图片地址
      LinkType: 1, // 链接内容
      LinkTitle: '', // LinkTitle
      LinkUrl: '', // 链接网址
      LinkUrlOutter: '', // 外部链接地址
      visibleAddModal: false, // 添加弹窗显隐
      title: '', // 下一步(添加)标题
      modifyObj: {}, // 下一步数据
      tableData: []
    }
  },
  computed: {
    EnumSustainAdvertLocationType() {
      return SustainAdvertLocationType
    },
    EnumSustainAdvertLinkType() {
      return SustainAdvertLinkType
    },
    EnumSustainAdvertOpenType() {
      return SustainAdvertOpenType
    },
    EnumEnableState() {
      return EnableState
    }
  },
  created() {
    this.gets()
  },
  methods: {
    // 获取列表
    gets() {
      this.tbloading = true
      COLLEGE_API_SUSTAINADVERT_GETS()
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Subset
          }
          this.tbloading = false
        })
        .catch(() => {
          this.tbloading = false
        })
    },
    // 启用、停用
    switchChange(id, state) {
      if (state == EnableState.Enable) {
        COLLEGE_API_SUSTAINADVERT_DISABLE({ AdvertId: id }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.gets()
          }
        })
      } else {
        COLLEGE_API_SUSTAINADVERT_ENABLE({ AdvertId: id }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.gets()
          }
        })
      }
    },
    // 修改图片
    uploadSucc(AdvertId, ImageUrl) {
      this.tbloading = true
      let imageUrl  = ''
      if(ImageUrl instanceof Array){
        imageUrl = ImageUrl[0]
      }
      const param = {
        AdvertId,
        ImageUrl: imageUrl
      }
      COLLEGE_API_SUSTAINADVERT_UPDATEIMAGE(param)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.gets()
          }
          this.tbloading = false
        })
        .catch(() => {
          this.tbloading = false
        })
    },
    // 修改链接
    modifyLink(row) {
      let { AdvertId, OpenType, LinkType, LinkTitle, LinkUrl } = row
      this.AdvertId = AdvertId
      this.OpenType = String(OpenType)
      this.LinkType = String(LinkType)
      this.LinkTitle = LinkTitle
      this.LinkUrl = LinkUrl
      if (this.LinkType == SustainAdvertLinkType.Outter) {
        this.LinkUrlOutter == LinkUrl
      } else {
        this.LinkUrlOutter == ''
      }
      this.dialogVisible = true
    },
    btnSave() {
      this.$store.commit('SET_BTN_LOADING', true)
      let param = {
        AdvertId: this.AdvertId,
        OpenType: Number(this.OpenType),
        LinkType: Number(this.LinkType)
      }
      if (this.LinkType == SustainAdvertLinkType.Outter) {
        if (
          !/^((https|http)(:\/\/))(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~/])+/i.test(
            this.LinkUrlOutter
          )
        ) {
          this.$store.commit('SET_BTN_LOADING', false)
          this.$message.error('请输入正确的网址！')
          return
        }
        param.LinkUrl = this.LinkUrlOutter
        param.LinkTitle = ''
      } else {
        param.LinkUrl = ''
        if (this.LinkType == SustainAdvertLinkType.Nothing) {
          param.LinkTitle = ''
        } else {
          param.LinkTitle = this.LinkTitle
        }
      }
      COLLEGE_API_SUSTAINADVERT_UPDATE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dialogVisible = false
          this.gets()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 链接内容change
    linkTypeChange(e) {
      if (e == SustainAdvertLinkType.System) {
        this.title = '添加(系统培训)'
      } else if (e == SustainAdvertLinkType.College) {
        this.title = '添加(珠宝学院)'
      } else {
        this.title = '添加(专题推荐)'
      }
    },
    // 添加
    listenVisibleAddModal(succ) {
      this.visibleAddModal = false
      this.dialogVisible = false
      if (succ) {
        this.gets()
      }
    },

    nextStep() {
      this.modifyObj = {
        AdvertId: this.AdvertId,
        OpenType: Number(this.OpenType),
        LinkType: Number(this.LinkType),
        LinkTitle: this.LinkTitle,
        LinkUrl: this.LinkUrl
      }
      if (this.LinkType == SustainAdvertLinkType.System) {
        this.title = '添加(系统培训)'
      } else if (this.LinkType == SustainAdvertLinkType.College) {
        this.title = '添加(珠宝学院)'
      } else {
        this.title = '添加(专题推荐)'
      }
      this.visibleAddModal = true
    }
  },
  components: {
    addModal,
    uploadImgByBtn
  }
}
</script>
<style lang="scss" scoped>
.ad-manage {
  .tb {
    /deep/ td {
      padding: 15px 0;
    }
  }
  .pic {
    display: block;
    width: 200px;
    height: 112.5px;
    &.pc {
      width: 344px;
      height: 18px;
    }
    &.app {
      width: 150px;
      height: 54px;
    }
  }
  .cont {
    span {
      color: $gray;
    }
  }
}
.note {
  margin-top: 10px;
  color: $gray;
  font-size: $small-font;
}
.modify-link-dialog {
  dt {
    font-weight: bold;
    margin-top: 20px;
    &:first-child {
      margin-top: 0;
    }
  }
  dd {
    margin-top: 15px;
  }
}
</style>

