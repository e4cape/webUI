<template>
  <div v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中...">
    <el-row class="m-b-10">
      <el-col :span="12">
        <el-button name="btnCreateParent" type="primary" size="small" @click="createParent">新建大类</el-button>
      </el-col>
      <el-col :span="12" class="tr">
        <el-button size="small" @click="changeAllShow">{{allShow ? '-全部收起':'+全部展开'}}</el-button>
      </el-col>
    </el-row>
    <ul class="category-list">
      <li class="category-item" v-for="(item,index) in data" :key="index">
        <div class="category-name" @click="item.showChildren = !item.showChildren">
          <span>
            <i class="m-r-10" :class="{'el-icon-arrow-down': item.showChildren, 'el-icon-arrow-right': !item.showChildren}"></i>
            {{item.categoryName}}
          </span>
          <div>
            <el-button name="btnCreateChild" type="text" @click.stop="createChild(item)">新建子类</el-button>
            <el-button name="btnEditChild" type="text" @click.stop="modifyCategory(item,'')">修改</el-button>
            <el-button name="btnRemoveChild" type="text" @click.stop="deleteCategory(item)">删除</el-button>
          </div>
        </div>
        <ul v-show="item.showChildren">
          <li class="category-sub-item" v-for="(child,ci) in item.items" :key="ci">
            <div class="category-sub-name">
              <div class="left">
                <img :src="$root.settings.DOMAIN_IMAGE + child.imageUrl">
                <span>{{child.categoryName}}</span>
              </div>
              <div>
                <el-button name="btnEdit" type="text" @click="modifyCategory(child,item.categoryName)">修改</el-button>
                <el-button name="btnRemove" type="text" @click="deleteCategory(child)">删除</el-button>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <!-- @module 编辑 -->
    <el-dialog :title="(editForm.categoryId ? '编辑': '新建')" width="520px" :visible.sync="editVisible" @close="resetEditForm">
      <el-form class="fix-w" label-position="right" label-width="100px" :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="父类名称：" prop="parentName" v-if="editForm.parentId">
          <span>{{editForm.parentName}}</span>
        </el-form-item>
        <el-form-item :label="(editForm.parentId ? '子类':'大类') + '名称：'" prop="categoryName">
          <el-input name="categoryName" v-model="editForm.categoryName" :maxlength="editForm.parentId ? 10 : 4" :placeholder="(editForm.parentId ? '10' : '4') + '个汉字以内'"></el-input>
        </el-form-item>
        <el-form-item :label="(editForm.parentId ? '子类':'大类') + '图片：'" prop="imageUrl">
          <el-input name="imageUrl" v-model="editForm.imageUrl" v-show="false"></el-input>
          <div class="clearfix" v-if="isParent" v-loading="uploading">
            <div class="img-uploader" @click="iClick">
              <img class="goods-img" :src="$root.settings.DOMAIN_IMAGE + editForm.imageUrl" alt v-if="editForm.imageUrl">
              <i class="el-icon-plus avatar-uploader-icon" v-else></i>
              <input name="btnFile" type="file" id="imgUploaderInput" style="display: none;" accept="image/jpg, image/jpeg, image/png" @change="uploadChange">
            </div>
          </div>
          <el-upload
            class="avatar-uploader"
            name="btnAvatar"
            :action="$root.settings.DOMAIN_APIS.Gifting + '/api/Uploader/UploadImageAsync?pathType=' + imageUploadPaths.Category"
            v-else
            :show-file-list="false"
            accept="image/jpg, image/jpeg, image/png"
            :on-success="uploaderSuccess"
            :on-error="uploaderError"
            :before-upload="uploaderBefore"
            v-loading="uploading"
          >
            <div class="uploader">
              <template v-if="editForm.imageUrl">
                <img :src="$root.settings.DOMAIN_IMAGE + editForm.imageUrl" alt>
              </template>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
          <p class="red" v-if="isParent">用于微信礼品商城展示，200K以内，建议尺寸：宽342px高246px</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="saveCategory" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancel" @click="resetEditForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑 -->
    <img-cropper v-if="cropperVisible" :cropperVisible="cropperVisible" :imgSize="imgSize" :url="cropperUrl" @listenCropper="listenCropper"></img-cropper>
  </div>
</template>
<script>
import {
  ImageUploadPaths
} from '@/enums/gifting'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_CATEGORY_CREATE,
  GIFTING_API_CATEGORY_SAVEUPDATE,
  GIFTING_API_CATEGORY_DELETE
} from '@/apis/gifting'
import imgCropper from '@/components/spread/imgCropper'
import axios from 'axios'
export default {
  data() {
    const checkCategoryName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写名称'))
      } else {
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          callback(new Error('请输入汉字'))
        }
        callback()
      }
    }
    return {
      imageUploadPaths: ImageUploadPaths,
      data: [],
      editVisible: false,
      editForm: {
        parentId: 0,
        categoryId: 0,
        categoryName: '',
        imageUrl: ''
      },
      editRules: {
        categoryName: [
          {
            required: true,
            validator: checkCategoryName,
            trigger: 'change'
          }
        ],
        imageUrl: [
          {
            required: true,
            message: '请上传图片',
            trigger: 'change'
          }
        ]
      },
      uploading: false,
      cropperVisible: false,
      imgSize: {
      },
      cropperUrl: '',
      checkImgVisible: false,
      isParent: false,
    }
  },
  computed: {
    allShow() {
      return (
        this.data.filter(item => {
          if (!item.showChildren) { return item }
        }).length === 0
      )
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_CATEGORY_SEARCH().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.map(item => {
            item.showChildren = false
            return item
          })
        }
      })
    },
    createParent() {
      this.editVisible = true
      this.isParent = true
    },
    createChild(item) {
      this.editForm.parentId = item.categoryId
      this.editForm.parentName = item.categoryName
      this.editVisible = true
      this.isParent = false
      return true
    },
    modifyCategory(item, parentName) {
      this.editForm = {
        parentId: item.parentId,
        parentName: parentName,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        imageUrl: item.imageUrl
      }
      this.isParent = parentName === '' ? true : false
      this.editVisible = true
    },
    saveCategory() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          let apiName = ''
          let param = {
          }
          if (this.editForm.categoryId) {
            apiName = GIFTING_API_CATEGORY_SAVEUPDATE
            param = this.editForm
          } else {
            apiName = GIFTING_API_CATEGORY_CREATE
            param = {
              categoryId: 0,
              categoryName: this.editForm.categoryName,
              imageUrl: this.editForm.imageUrl,
              parentId: this.isParent ? 0 : this.editForm.parentId
            }
          }
          this.$store.commit('SET_BTN_LOADING', true)
          apiName(param).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存成功！')
              this.editVisible = false
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    resetEditForm() {
      // 这里重新将 editForm 指向一个新的对象
      // 于是 imageUrl 此时指向的是 undefined, 也失去了 Observeable
      // 导致了 http://192.168.1.27:81/zentao/bug-view-13254.html
      this.editForm = {
        // fix:
        ...this.editForm,
        imageUrl: '',
        categoryName: '',
        categoryId: '',
        SubId: '',
        SystemId: '',
        SubName: '',
        parentName: '',
        parentId: '',
      }
      this.$refs['editForm'].resetFields()
      this.editVisible = false
    },
    uploaderBefore(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error('请上传正确文件!')
        return false
      }
      const isLt2M = file.size / 1024 > 200
      if (isLt2M) {
        this.$message.error('分类图片大小不能超过 200KB!')
        return false
      }
      this.uploading = true
    },
    uploaderSuccess(response) {
      if (response.Code === 'CORRECT') {
        this.editForm.imageUrl = response.Data[0]
        this.uploading = false
      }
    },
    uploaderError() {
      this.uploading = false
      this.$message('上传失败', 'error')
    },
    deleteCategory(item) {
      this.$confirm('确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        GIFTING_API_CATEGORY_DELETE({
          id: item.categoryId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.getData()
          }
        })
      })
    },
    iClick() {
      document.getElementById('imgUploaderInput').click()
    },
    uploadChange(e) {
      var vm = this
      var reader = new FileReader()
      reader.onload = (function () {
        return function (e) {
          const isLt2M = e.total / 1024 < 200
          if (!isLt2M) {
            vm.$message.error('上传图片大小不能超过 200k!')
            return false
          }
          if (
            this.result.indexOf('image/jpeg') === -1 &&
            this.result.indexOf('image/png') === -1 &&
            this.result.indexOf('image/jpg') === -1
          ) {
            vm.$message.error('请上传正确文件')
            return false
          }
          vm.cropperVisible = true
          vm.cropperUrl = this.result
          vm.imgSize = {
            width: 342,
            height: 246,
            type: 'goods'
          }
          document.getElementById('imgUploaderInput').value = ''
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    changeAllShow() {
      let show = !this.allShow
      this.data.map(item => {
        item.showChildren = show
        return item
      })
    },
    listenCropper(url) {
      this.cropperVisible = false
      if (!url) {
        return
      }
      var arr = (url + '').split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n] = bstr.charCodeAt(n)
        n -= 1
      }
      var ext = mime.replace('image/', '.')
      const d = new Date()
      var fileName =
        'giftImg' +
        d.getFullYear() +
        '_' +
        (d.getMonth() + 1) +
        '_' +
        d.getDate() +
        '_' +
        d.getHours() +
        '_' +
        d.getMinutes() +
        '_' +
        d.getSeconds() +
        '_' +
        Math.random()
          .toString(12)
          .substring(2) +
        ext
      let file = new File([u8arr], fileName, {
        type: mime
      })
      let fd = new FormData()
      fd.append('file', file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.uploading = true
      axios
        .post(`${this.$root.settings.DOMAIN_APIS.Gifting + '/api/Uploader/UploadImageAsync?pathType=' + this.imageUploadPaths.Category}`, fd, config)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('上传成功')
            setTimeout(() => {
              this.uploading = false
              this.editForm.imageUrl = res.data.Data[0]
            }, 500)
          } else {
            this.$message.error(res.data.Message)
          }
        })
    },
  },
  beforeMount() {
    this.getData()
  },
  components: {
    imgCropper
  }
}
</script><style lang="scss" scoped>
.avatar-uploader {
  position: relative;
  display: block;
  z-index: 9;
  width: 70px;
  height: 70px;
  border: dashed 1px #ddd;
  overflow: hidden;
  .uploader {
    width: 70px;
    height: 70px;
    margin-top: 0;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      z-index: 5;
    }
  }
  .avatar-uploader-icon {
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 28px;
  }
}
.category-list {
  > .category-item {
    .category-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      margin-bottom: 10px;
      background-color: #f5f5f5;
      cursor: pointer;
    }
  }
  ul {
    padding-left: 20px;
    > .category-sub-item {
      .category-sub-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 10px;
        margin-bottom: 10px;
        border: 1px solid #e5e5e5;
        .left {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.el-icon-arrow-down,
.el-icon-arrow-right {
  color: #333;
}
.img-uploader {
  position: relative;
  float: left;
  width: 342px;
  height: 246px;
  border: #d9d9d9 1px dotted;
  border-radius: 5px;
  &:hover {
    border: #409eff 1px dotted;
  }
  > i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 28px;
  }
}
.goods-img {
  width: 100%;
  height: 100%;
}
</style>
