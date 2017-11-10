<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @click="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">客户层级</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="tapLink()">维护</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <div class="hierarchy-con">
            <div v-if="lists.parent.id" class="hierarchy-list">
              <span class="hierarchy-icon"><span class="icon-in">父客户</span></span>
              <div class="hierarchy-right">
                <h5>{{lists.parent.name}}</h5>
                <p>{{lists.parent.remark?'('+lists.parent.remark+')':''}}</p>
              </div>
              <span class="line_left"></span>
            </div>
            <div class="hierarchy-list" style="padding: 20px 0 20px 70px">
              <span class="hierarchy-icon"><span class="icon-in">当前</span></span>
              <div class="hierarchy-right" style="padding-bottom: 40px">
                <h5>{{current.currentName}}</h5>
              </div>
              <span class="line_left" v-if="lists.subdirectories.length"></span>
            </div>
            <div v-if="lists.subdirectories.length" class="hierarchy-list">
              <span class="hierarchy-icon"><span class="icon-in">子客户</span></span>
              <div class="hierarchy-right">
                <div v-for="list in lists.subdirectories" style="margin-bottom: 20px">
                  <h5>{{list.name}}</h5>
                  <p>{{list.remark?'('+list.remark+')':''}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet/less'>
  @import './hierarchy.css';
</style>
<script>
  import store from './hierarchy-store.js';
  export default{
    data: function () {
      return {
        lists: store.state.lists,
        current: store.state.current
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('search', scroll);
      },
      pulldown: function () {
        store.listRefresh('search');
      },
      pullup: function () {
        store.listLoadMore('search');
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      tapLink: function () {
        this.$router.go('/hierarchy-change/' + this.current.currentId + '/' + this.current.currentName);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    },
    route: {
      activate: function (transition) {
        this.current.currentId = parseInt(this.$route.params.id);
        this.current.currentName = this.$route.params.name;
        store.init(this.current.currentId);
        transition.next();
      }
    }
  };
</script>
