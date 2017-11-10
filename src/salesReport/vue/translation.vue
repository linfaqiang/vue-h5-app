/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @click="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class="mui-icon mui-pull-right" style="font-size: 14px; line-height:28px">{{selectDate.chanceType}}</a>
    </header>
    <div class="main_con">
      <div class="section_1 bg_w" style="padding-bottom: 5px; border-bottom: 1px solid #ccc">
        <h5 class="f_16 color_black">{{user.userName}}</h5>
        <p class="f_12">{{user.section}}</p>
        <div class="right-con">
          <a>起始:<span class="color_black">{{selectDate.start}}</span></a>
          <a>结束:<span class="color_black">{{selectDate.end}}</span></a>
        </div>
        <span class="mui-icon loudou-icon" @click="selectMore"></span>

      </div>
      <div class="customerAnalysis">
        <div style="width: 100%;height: 100%" class="chart" id="barChart"></div>
        <div class="noData" v-show="noData.show">暂无数据</div>
      </div>
      <div class="customerAnalysis-table">
        <div class="line-top"></div>
        <table>
          <colgroup>
            <col width="70%"/>
            <col width=""/>
          </colgroup>
          <thead>
          <tr>
            <th>销售阶段</th>
            <th>平均值(天)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="list in data.lists">
            <td>{{list.stageName}}</td>
            <td class="color_red">{{list.days}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="customerAnalysis-table" style="margin-bottom: 15px">
        <table>
          <colgroup>
            <col width="70%"/>
            <col width=""/>
          </colgroup>
          <tbody>
          <tr style="margin-top: 3px">
            <td>销售周期</td>
            <td class="color_red">{{zhouqi}}</td>
          </tr>
          <tr>
            <td>成功转化率</td>
            <td class="color_red">{{succeedRate}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../report-store';
  import {FastClick} from 'fastclick';
  import echarts from '../../public/js/echarts.min.js';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '销售转化率',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        showMore: false,
        user: store.state.user,
        data: {
          lists: []
        },
        noData: {
          show: false
        },
        succeedRate: '',
        zhouqi: '',
        selectDate: store.state.selectDate
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      renderCharts: function () {
        var self = this;
        var param = {
          'staffId': self.selectDate.employeeId || 0,
          'deptId': self.selectDate.depthId || 0,
          'fromDate': self.selectDate.start,
          'toDate': self.selectDate.end,
          'type': self.selectDate.chanceTypeId
        };
        store.renderDetail('sales_conversion_rate', param, function (data) {
          if (!(data.list && data.list.length > 0)) {
            self.noData.show = true;
            return;
          } else {
            self.noData.show = false;
          }
          self.succeedRate = data.succeedRate;
          self.zhouqi = data.list[0].days;
          var datas = [];
          var dataList = [];
          var colors = ['', '#6CB105', '#883BDC', '#FDAE0A', '#F13B12', '#4A80D2'];
          var noDays = true; // 如果所有天数都为0,不显示图标
          for (var i = 1; i < data.list.length; i++) {
            datas.push({
              value: parseInt(data.list[i].days),
              name: data.list[i].stageName,
              itemStyle: {
                normal: {color: colors[i]}
              }
            });
            dataList.push(data.list[i]);
            if (data.list[i].days > 0) {
              noDays = false;
            }
          }
          if (noDays) {
            self.noData.show = true;
          }
          self.data.lists = dataList;
          var getOption = function () {
            var chartOption = {
              legend: {
                orient: 'vertical',
                x: '60%',
                y: '10%',
                width: '30%',
                data: datas,
                textStyle: {
                  color: '#333',
                  fontFamily: '微软雅黑',
                  fontSize: 12
                },
                selectedMode: false
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
              },
              backgroundColor: 'rgba(255,255,255,1)',
              series: [{
                'type': 'pie',
                'center': ['30%', '46%'],
                'radius': '65%',
                'minAngle': 10, // 最小的扇区角度.如果对应比例为0,也占用10%
                'label': {
                  normal: {
                    show: false,
                    position: ''
                  }
                },
                'itemStyle': {
                  'normal': {
                    'label': {
                      'show': true,
                      'formatter': function (a, b, c, d) {
                        if (c !== 0) {
                          return b;
                        }
                      }

                    },
                    'labelLine': {
                      'show': false,
                      'length': 5
                    }
                  }
                },
                'data': datas
              }]
            };
            return chartOption;
          };
          var barChart = echarts.init(document.getElementById('barChart'));
          barChart.setOption(getOption('pie'));
        });
      },
      selectMore: function () {
        this.$router.go('/sales-select/1');
      }
    },
    route: {
      activate: function (transition) {
        this.renderCharts();
        transition.next();
      }
    },
    created: function () {
    },
    ready: function () {
      FastClick.attach(document.body);
    }
  };
</script>
