/**
* @file 滚动刷新组件
* @author renjian
* @date 2016/3/22
*/
<template>
    <div id="refreshContainer"
         class="mui-scroll-wrapper chance-list-wrapper"
         :style="{top: top,bottom: bottom}">
        <div class="mui-scroll">
            <slot></slot>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      scroll: {},
      top: {
        type: String,
        default: '0px'
      },
      bottom: {
        type: String,
        default: '0px'
      },
      downContent: String,
      ownOverContent: String,
      downRefreshContent: String,
      upRefreshContent: String,
      nomoreContent: String,
      isDisablePulluptoRefresh: {
        type: Boolean,
        default: false
      }
    },
    events: {
      'refresh': function (item) {
        mui(this.$el).pullRefresh();
      }
    },
    methods: {
      pulldownRefresh: function () {
        scroll.pullDirection = 'down';
        this.$dispatch('pulldown', this.scroll);
      },
      pullupRefresh: function () {
        scroll.pullDirection = 'up';
        this.$dispatch('pullup', this.scroll);
      },
      disablePullupToRefresh: function () {
        mui(this.$el).pullRefresh().disablePullupToRefresh();
      },
      enablePullupToRefresh: function () {
        mui(this.$el).pullRefresh().enablePullupToRefresh();
      }
    },
    ready: function () {
      this.scroll = mui(this.$el).pullRefresh({
        container: this.$el,
        down: {
          contentdown: this.downContent,
          contentover: this.ownOverContent,
          contentrefresh: this.downRefreshContent,
          callback: this.pulldownRefresh
        },
        up: {
          contentrefresh: this.upRefreshContent,
          contentnomore: this.nomoreContent,
          callback: this.pullupRefresh
        }
      });
      this.$dispatch('pullRefreshReady', this.scroll);
      if (this.isdisablePullupToRefresh) {
        this.disablePullupToRefresh();
      }
      this.$watch('isDisablePulluptoRefresh', function (newVal) {
        if (newVal) {
          this.enablePullupToRefresh();
        } else {
          this.disablePullupToRefresh();
        }
      });
    }
  };
</script>
