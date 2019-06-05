<template>
  <div>
    <div class="tabs">
      <span
        @click="tabClick('')"
        :class="activeName == '' ? 'tab active' : 'tab'"
      >全部</span>
      <span
        v-for="item in memberOperateLogTypes.Types"
        :key="item.key"
        @click="tabClick(item.key)"
        :class="activeName == item.key ? 'tab active' : 'tab'"
      >{{item.title}}</span>
    </div>
    <div
      class="wrap can-scroll"
      ref="scrollContainer"
    >
      <ul
        class="users contentul"
        v-if="users.length > 0"
      >
        <li
          class="user"
          v-for="(item,key) in users"
          :key="key"
        >
          <img
            name="clickCheckMember"
            :src="item.imageUrl.indexOf('http') > -1 ? item.imageUrl : $root.settings.DOMAIN_IMAGE + item.imageUrl"
            alt="客户头像"
            style="cursor:pointer"
            @click="checkMember(item.memberId)"
          />
          <div class="word">
            <div class="name-tag">
              <el-button
                name="btnCheckMember"
                class="name"
                type="text"
                @click="checkMember(item.memberId)"
              >
                {{
                item.aliasName || ''
                }}
                {{
                item.trueName ? `（${item.trueName}）` : ''
                }}
              </el-button>
              <el-tag
                v-for="(tagitem, index) in item.logTypeTexts"
                class="tag"
                :key="index"
                type="info"
              >{{tagitem}}</el-tag>
            </div>
            <p>
              {{item.content}}
            </p>
            <div class="time">{{item.createTime}} {{item.createUser}}</div>
          </div>
        </li>
      </ul>
      <mugen-scroll
        class="you-can-add-custom-class-name"
        :handler="getData"
        :should-handle="!loading"
        scroll-container='scrollContainer'
      >
      </mugen-scroll>
      <div
        class="tc p-t-10"
        v-if="!users.length && !loading"
      >
        - 暂无数据 -
      </div>
      <div
        v-if="loading"
        class="loadings"
      >
        <img
          src='../../../assets/images/loading.gif'
          alt="客户头像"
        />
        <span class="loadingText">正在努力加载，请稍候...</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_MEMBEROPERATELOG_GETMEMBEROPERATELOGS 
} from '@/apis/membership.js'
import {
  MemberOperateLogTypes 
} from '@/enums/membership'
import MugenScroll from 'vue-mugen-scroll'
export default {
  components: {
    MugenScroll
  },
  data() {
    return {
      memberOperateLogTypes: MemberOperateLogTypes, // 会员动态类型枚举
      activeName: '',
      para: {
        logType: '',
        pageIndex: 1,
        pageSize: 10
      },
      users: [],
      loading: false,
      count: 0,
      total: 0
    }
  },
  methods: {
    // 切换tab
    tabClick(tab) {
      this.activeName = tab
      this.para.logType = tab
      this.para.pageIndex = 1
      this.para.pageSize = 10
      this.total = 1
      this.users = []
      this.getData()
    },
    getData() {
      if (this.total < this.users.length) {
        this.loading = false
        return
      }
      this.loading = true
      MEMBERSHIP_API_MEMBEROPERATELOG_GETMEMBEROPERATELOGS(this.para).then(
        res => {
          if (res.data.Code == 'CORRECT') {
            // this.users = res.data.Data.rows
            this.loading = false
            this.users = [...this.users, ...res.data.Data.rows]
            this.para.pageIndex = this.para.pageIndex + 1
            this.total = res.data.Data.total
          }
        }
      )
    },
    checkMember(memberId) {
      this.$router.push({
        path: '/member/clientManage/viewcustomer',
        query: {
          memberId: memberId 
        }
      })
    }
  },
  created() {},
  mounted() {
    // this.getData()
  }
}
</script>
<style lang="scss" scoped>
.loadings {
  text-align: center;
  .loadingText {
    position: relative;
    top: -14px;
  }
}
.mugen-scroll {
  font-size: 18px;
  text-align: center;
}
.count {
  font-size: 18px;
  margin-top: 10px;
}
// 滚动插件一定要有这个高度
.wrap.can-scroll {
  height: 800px;
  width: 99%;
  overflow-y: auto;
  border: 1px solid #ddd;
}
.tabs {
  // border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  .tab {
    border-bottom: 1px solid #e5e5e5;
  }
}
.contentul {
  margin-bottom: 0;
  li {
    position: relative;
    box-sizing: border-box;
    padding: 10px 18px 10px 100px;
    border-bottom: 1px solid #ddd;
    .word {
      min-height: 60px;
    }
  }
  li {
    &:last-child {
      border-bottom: 0;
    }
  }
  img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 18px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: auto;
  }
  .name-tag {
    .name {
      margin-right: 10px;
    }
    .tag {
      height: 20px;
      line-height: 18px;
    }
  }
  p {
    line-height: 20px;
    font-size: 12px;
    margin-top: 3px;
  }
  .time {
    line-height: 20px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>