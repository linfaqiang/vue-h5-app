/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
    </header>

    <div class="mui-content" style="padding-top: 44px">
      <div id="slider" class="mui-slider" @slide="muiTabSlide">
        <div id="sliderSegmentedControl"
             class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
          <a class="mui-control-item mui-active" href="#item1mobile">
            本月
          </a>
          <a class="mui-control-item" href="#item2mobile">
            本季
          </a>
          <a class="mui-control-item" href="#item3mobile">
            本年
          </a>
        </div>
        <div id="sliderProgressBar" class="mui-slider-progress-bar mui-col-xs-4"></div>
        <div class="mui-slider-group">
          <div id="item1mobile" class="mui-slider-item mui-control-content mui-active":style="divCss">
            <div id="scroll1" class="mui-scroll-wrapper" :class="{'list_is_null': lists.one.list.length == 0}">
              <div class="mui-scroll">
                <div class="performance">
                  <div class="head sideline_up" v-if="lists.one.my.ranking">
                    <div><p><span class="mui-icon mui-icon-rank"></span>排名</p>
                      <p>{{lists.one.my.ranking}}</p><span></span></div>
                    <div><p><span class="mui-icon mui-icon-per"></span>成交额（元）</p>
                      <p>{{lists.one.my.dealAmount}}</p></div>
                  </div>
                  <div class="rank sideline_up" v-for="list in lists.one.list">
                    <span class="default" v-if="lists.one.my.ranking == list.ranking"></span>
                    <span>{{$index+1}}</span><img src="../../public/images/default_contact.png">
                    <div><p>{{list.staffName}}</p>
                      <p>成交额：{{list.dealAmount}}</p></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div id="item2mobile" class="mui-slider-item mui-control-content" :style="divCss">
            <div id="scroll2" class="mui-scroll-wrapper" :class="{'list_is_null': lists.two.list.length == 0}">
              <div class="mui-scroll">
                <div class="performance">
                  <div class="head sideline_up" v-if="lists.two.my.ranking">
                    <div><p><span class="mui-icon mui-icon-rank"></span>排名</p>
                      <p>{{lists.two.my.ranking}}</p><span></span></div>
                    <div><p><span class="mui-icon mui-icon-per"></span>成交额（元）</p>
                      <p>{{lists.two.my.dealAmount}}</p></div>
                  </div>
                  <div class="rank sideline_up" v-for="list in lists.two.list">
                    <span class="default" v-if="lists.two.my.ranking == list.ranking"></span>
                    <span>{{$index+1}}</span><img src="../../public/images/default_contact.png">
                    <div><p>{{list.staffName}}</p>
                      <p>成交额：{{list.dealAmount}}</p></div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <div id="item3mobile" class="mui-slider-item mui-control-content" :style="divCss">
            <div id="scroll3" class="mui-scroll-wrapper" :class="{'list_is_null': lists.three.list.length == 0}">
              <div class="mui-scroll">
                <div class="performance">
                  <div class="head sideline_up" v-if="lists.three.my.ranking">
                    <div><p><span class="mui-icon mui-icon-rank"></span>排名</p>
                      <p>{{lists.three.my.ranking}}</p><span></span></div>
                    <div><p><span class="mui-icon mui-icon-per"></span>成交额（元）</p>
                      <p>{{lists.three.my.dealAmount}}</p></div>
                  </div>
                  <div class="rank sideline_up" v-for="list in lists.three.list">
                    <span class="default" v-if="lists.three.my.ranking == list.ranking"></span>
                    <span>{{$index+1}}</span><img src="../../public/images/default_contact.png">
                    <div><p>{{list.staffName}}</p>
                      <p>成交额：{{list.dealAmount}}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../report-store';
  var nativeApi = require('nativeApi');
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '业绩排行榜',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        user: store.state.user,
        lists: {
          one: {
            my: {},
            list: []
          },
          two: {
            my: {},
            list: []
          },
          three: {
            my: {},
            list: []
          }
        },
        divCss: {
          height: (document.documentElement.clientHeight - 38 - 44) + 'px'
        }
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      renderRanking: function (type, dim) {
        var self = this;
        if (self.lists[dim].list && self.lists[dim].list.length) {
          return;
        }
        nativeApi.initAjax({
          url: store.APIS.sales_report + 'performance_ranking',
          type: 'get',
          param: {
            'dimension': type
          },
          callback: function (response) {
            if (response && response.code === 200) {
              self.lists[dim].list = response.data.list;
              self.lists[dim].my = response.data.my;
            }
          }
        });
      },
      muiTabSlide: function (e) {
        if (e.detail.slideNumber === 1) {
          this.renderRanking('quarterly', 'two');
        } else if (e.detail.slideNumber === 2) {
          this.renderRanking('annual', 'three');
        }
      }
    },
    created: function () {
    },
    ready: function () {
      this.renderRanking('monthly', 'one');
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
