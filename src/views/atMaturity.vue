<template>
  <div class="full-wrapper">
    <div class="atMaturity-box">
      <div class="message">
        <p>
          <i class="el-icon-warning"></i>
          <span>{{$route.query.Message?decodeURI($route.query.Message):'抱歉，您的系统已到期，请联系客服续费!'}}</span>
        </p>
        <div class="service">
          <span>客服热线：</span>
          <div>
            <b>15920024182</b>
          </div>
          <div>
            <b>13922804544</b>
          </div>
        </div>
        <div class="service">
          <span class="p-t-10">微信客服：</span>
          <div>
            <img src="/static/images/lcb-wechat-1.jpg" width="160" alt>
            <p>扫码添加客服</p>
          </div>
          <div>
            <img src="/static/images/lcb-wechat-2.jpg" width="160" alt>
            <p>扫码添加客服</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.full-wrapper {
  width: 100%;
  height: 700px;

  .atMaturity-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .message {
      > p {
        color: red;
        font-size: 14px;
        text-indent: 7px;

        //text-align: center;
        span {
          padding-left: 10px;
        }
      }

      i {
        font-size: 30px;
        vertical-align: middle;
      }

      .service {
        font-size: 14px;
        margin-top: 10px;

        display: flex;

        > span {
          width: 70px;
        }
        > div {
          flex: 1 1 0%;
          text-align-last: auto;
        }
        b {
          font-weight: bold;
          padding-right: 15px;
          padding-left: 8px;
        }
        p {
          color: #888;
          text-align: center;
        }
      }
    }
  }
}
</style>