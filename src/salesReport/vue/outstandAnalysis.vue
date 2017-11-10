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
    </header>
    <div class="main_con">
      <div class="section_1 bg_w" style="padding-bottom: 5px; border-bottom: 1px solid #ccc">
        <h5 class="f_16 color_black">{{user.userName}}</h5>
        <p class="f_12">{{user.section}}</p>
        <div class="right-con">
          <a>时间:<span class="color_black">{{selectDate.start}}</span></a>
          <span class="">维度:<span>{{selectDate.weidu}}</span></span>
        </div>
        <span class="mui-icon loudou-icon" @click="selectMore"></span>
      </div>
      <div class="customerAnalysis">
        <p class="danwei">单位/万元</p>
        <div style="width:100%; height:250px" class="chart" id="barChart"></div>
        <div class="noData" v-show="noData.show">暂无数据</div>
      </div>
      <div class="customerAnalysis-table">
        <div class="line-top"></div>
        <table>
          <colgroup>
            <col width="30%"/>
            <col width="20%"/>
            <col width="20%"/>
            <col width="30%"/>
          </colgroup>
          <thead>
          <tr>
            <th>维度-{{selectDate.weidu}}</th>
            <th>目标</th>
            <th>已完成</th>
            <th>完成百分比</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="list in data.lists">
            <td>{{list.name}}</td>
            <td class="color_red">{{list.forecastAmount}}</td>
            <td>{{list.dealAmount}}</td>
            <td>{{list.dealRate}}%</td>
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
    data: function () {
      return {
        currentHeader: {
          title: '销售业绩分析',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        noData: {
          show: false
        },
        user: store.state.user,
        data: {
          lists: []
        },
        selectDate: store.state.selectDate
      };
    },
    route: {
      activate: function (transition) {
        store.endSelect = true;
        this.renderCharts();
        transition.next();
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      selectMore: function () {
        this.$router.go('/sales-select');
      },
      renderCharts: function () {
        var self = this;
        var param = {
          'staffId': self.selectDate.employeeId,
          'deptId': self.selectDate.depthId,
          'analysisDate': self.selectDate.start,
          'dimension': self.selectDate.weiduValue
        };
        store.renderDetail('sales_performance_analysis', param, function (data) {
          self.data.lists = data;
          if (!data.length) {
            self.noData.show = true;
            return;
          } else {
            self.noData.show = false;
          }
          var years = [];
          var dataOne = [];
          var dataTwo = [];
          var rotates = 0;
          var y2 = 65;
          var xr = 0;
          if (data.length > 3) {
            y2 = 75;
            xr = 30;
          }
          for (var i = 0; i < data.length; i++) {
            if (data[i].forecastAmount > 100000) {
              rotates = 60;
            }

            years.push(data[i].name);
            dataOne.push(data[i].forecastAmount);
            dataTwo.push(data[i].dealAmount);
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
                type: 'category',
                axisLine: {
                  show: false    // 是否显示坐标轴
                },
                splitLine: {
                  show: true   // 默认分隔线
                },
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
                splitArea: {
                  show: true
                },
                axisLabel: {
                  interval: 0, // 横轴信息全部显示
                  rotate: rotates // 60度角倾斜显示
                }
              }],
              series: [
                {
                  name: '实际销售业绩',
                  type: chartType,
                  data: dataTwo,
                  itemStyle: {
                    normal: {
                      color: '#f00'
                    }
                  }
                }]
            };
            return chartOption;
          };
          var barChart = echarts.init(document.getElementById('barChart'));
          barChart.setOption(getOption('line'));
        });
      }
    },
    created: function () {
    },
    ready: function () {
      FastClick.attach(document.body);
    }
  };
</script>
