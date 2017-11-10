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
    <div class="main_con">
      <div class="customerAnalysis">
        <p class="danwei">单位/万元</p>
        <div style="width:100%;height: 230px" class="chart" id="barChart"></div>
      </div>
      <div class="customerAnalysis-table">
        <div class="line-top"></div>
        <table>
          <colgroup>
            <col width="50%"/>
            <col width="25%"/>
            <col width="25%"/>
          </colgroup>
          <thead>
          <tr>
            <th>最佳客户</th>
            <th>金额</th>
            <th>百分比</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="list in data.lists">
            <td><p class="customerShortname">{{list.customerShortname}}</p></td>
            <td class="color_red">{{list.forecastAmount}}</td>
            <td>{{list.rate}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../report-store';
  import echarts from '../../public/js/echarts.min.js';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '重点客户分析',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        user: store.state.user,
        data: {
          lists: []
        }
      };
    },
    route: {
      activate: function (transition) {
        transition.next();
        this.renderCharts();
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      renderCharts: function () {
        var self = this;
        var param = '';
        store.renderDetail('key_customer_analysis', param, function (data) {
          self.data.lists = data;
          var years = [];
          var dataOne = [];
          var datas = data;
          var rotates = 0;
          var y2 = 55;
          var xr = 0;
          if (datas.length > 3) {
            y2 = 45;
            xr = 30;
          }
          for (var i = 0; i < datas.length; i++) {
            if (datas[i].forecastAmount > 100000) {
              rotates = 60;
            }
            years.push(datas[i].customerShortname);
            dataOne.push(datas[i].forecastAmount);
          }

          var getOption = function (chartType) {
            var chartOption = {
              legend: {
                data: []
              },
              grid: {
                x: 45,
                x2: 10,
                y: 30,
                y2: y2
              },
              toolbox: {
                show: false,
                feature: {
                  mark: {
                    show: true
                  },
                  dataView: {
                    show: true,
                    readOnly: false
                  },
                  magicType: {
                    show: true,
                    type: ['line', 'bar']
                  },
                  restore: {
                    show: true
                  },
                  saveAsImage: {
                    show: true
                  }
                }
              },
              calculable: false,
              xAxis: [{
                axisLine: {
                  show: false
                },
                type: 'category',
                data: years,
                axisLabel: {
                  interval: 0, // 横轴信息全部显示
                  rotate: xr
                }
              }],
              yAxis: [{
                type: 'value',
                axisLine: {
                  show: false
                },
                 // max: 500,
                splitArea: {
                  show: true
                },
                axisLabel: {
                  interval: 0, // 横轴信息全部显示
                  rotate: rotates   // 角倾斜显示s
                }
              }],
              series: [{
                name: '预计金额',
                type: chartType,
                data: dataOne,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      var colorList = [
                        '#FDAE0A', '#6CB105', '#F13B12', '#4A80D2', '#893CDF',
                        '#E70051'
                      ];
                      return colorList[params.dataIndex];
                    }
                  }
                },
                barWidth: 20
              }]
            };
            return chartOption;
          };
          var barChart = echarts.init(document.getElementById('barChart'));
          barChart.setOption(getOption('bar'));
        });
      }
    },
    created: function () {
    },
    ready: function () {
    }
  };
</script>
