/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="detail.workDetail.title"></h1>
      <a class="mui-icon-compose mui-icon mui-pull-right" v-if="detail.workDetail.status==0" @tap="toEdit()"></a>
    </header>
    <div class="mui-content" style="padding-top: 44px;">
      <div class="mui-scroll-wrapper" :style="wrapperCss">
        <div class="mui-scroll">
          <div class="work_report_detail">
            <p class="title">
              <span v-if="detail.workDetail.reportType==0">{{date(detail.workDetail.startTime)}}工作总结</span>
              <span v-if="detail.workDetail.reportType==1">{{date(detail.workDetail.startTime)+'至'+date(detail.workDetail.endTime)}}工作总结</span>
              <span v-if="detail.workDetail.reportType==2">{{(new Date(detail.workDetail.startTime).getFullYear())+'年'+(new Date(detail.workDetail.startTime).getMonth()+1) + '月'}}工作总结</span>
            </p>
            <div class="content">
              <div class="now">
                <p class="title ti" v-if="detail.workDetail.reportType!=0">
                  <span v-if="detail.workDetail.reportType==1"><span></span>本周工作总结</span>
                  <span v-if="detail.workDetail.reportType==2"><span></span>本月工作总结</span>
                </p>
                <textarea readonly v-model="detail.workDetail.summary"></textarea>
              </div>
              <div class="next" v-if="detail.workDetail.plan">
                <p class="title"><span><span></span>下{{detail.workDetail.reportType=="1"?"周":"月"}}工作计划</span></p>
                <textarea readonly v-model="detail.workDetail.plan"></textarea>
              </div>
            </div>
            <div class="information">
              <li>
                <label>状态</label>
                <div>{{detail.workDetail.statusText}}</div>
              </li>
              <li v-if="detail.workDetail.acceptors">
                <label>汇报对象</label>
                <div>{{detail.workDetail.acceptors}}</div>
              </li>
              <li>
                <label>提交人</label>
                <div>{{detail.workDetail.createdName}}</div>
              </li>
              <li>
                <label>提交时间</label>
                <div>{{detail.workDetail.updatedOn||detail.workDetail.createdOn}}</div>
              </li>
            </div>
          </div>
          <div class="work_comment" v-if="detail.workDetail.commentList&&detail.workDetail.commentList.length > 0">
            <p>评论</p>
            <div class="comment_list">
              <ul v-for="list in detail.workDetail.commentList">
                <li class="group"><span class="title">{{list.date}}</span><span class="line"></span></li>
                <li v-for="item in list.list" class="content">
                  <p>{{item.time}}</p>
                  <p class="block" v-text="item.commenter"></p>
                  <p class="block" v-text="item.content"></p>
                  <span class="point"></span>
                  <div v-if="$index < (list.list.length-1)" class="line_left"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <footer @tap="commentFn()" class="rest_bn" v-if="detail.workDetail.status==1">回复</footer>
    </div>
  </div>
</template>
<script>
  import store from '../work-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: ''
        },
        detail: store.state,
        wrapperCss: {
          background: '#f1f1f1',
          top: '44px',
          height: (document.documentElement.clientHeight - 44 - 44) + 'px'
        }
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'workReport'
            }
          });
        } else {
          history.go(-1);
        }
      },
      date: function (val) {
        return val.substring(0, 10);
      },
      toEdit: function () {
        store.toEdit();
        this.$router.go('/editPage/1');
      },
      commentFn: function () {
        this.$router.go('/commentPage');
      },
      setWrapperHeight: function () {
        var self = this;
        setTimeout(function () {
          var statusId = self.detail.workDetail.status + '';
          if (statusId === '1') {
            self.wrapperCss.height = (document.documentElement.clientHeight - 44 - 44) + 'px';
          } else {
            self.wrapperCss.height = (document.documentElement.clientHeight - 44) + 'px';
          }
        }, 100);
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toDetail';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var self = this;
      if (window.initParam) {
        store.detail(window.initParam.id, function () {
          self.setWrapperHeight();
        });
      } else {
        self.setWrapperHeight();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
