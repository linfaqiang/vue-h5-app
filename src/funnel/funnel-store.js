/**
 * @file
 * @author
 */
// 定义store, store可以被多个组件引用
var nativeApi = require('nativeApi');
import {APIS} from 'configPort';
import echarts from '../public/js/echarts.min.js';
var selectUrl = {
  'chance': APIS.chanceType
};
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    lists: [],
    selectDate: {
      selectType: '部门',
      renyuan: '',
      bumen: '',
      depth: '',
      weiduShow: true,
      chanceType: '',
      chanceTypeId: 0,
      chanceShow: false,
      depthId: 0
    },
    selectLi: [],
    selectTitle: ''
  },
  init: function (id, cb) {
    var self = this;
    nativeApi.initAjax({
      url: APIS.funnel_list,
      type: 'get',
      param: id ? {
        type: id
      } : '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.lists = result.data;
          // 加载漏斗图表
          var myChart = echarts.init(document.getElementById('funnelMain'));
          var newArr = [];
          var funelData = result.data;
          for (var i = 0, len = funelData.length; i < len; i++) {
            newArr.push({
              value: 100 - i * 100 / len,
              name: funelData[i].stageName + '   ' + funelData[i].stageAmount
            });
          }
          var option = {
            tooltip: {
              formatter: '{b}'
            },
            calculable: true,
            series: [
              {
                type: 'funnel',
                left: '10%',
                top: 25,
                bottom: 0,
                width: '45%',
                height: '72%',
                min: 0,
                max: 90,
                minSize: '10%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                  normal: {
                    show: true,
                    position: ''
                  },
                  emphasis: {
                    textStyle: {
                      fontSize: 12
                    }
                  }
                },
                labelLine: {
                  normal: {
                    length: 10,
                    lineStyle: {
                      width: 1,
                      type: 'solid'
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    borderColor: '#fff',
                    borderWidth: 0,
                    color: function (params) {
                      var colorList = [
                        '#9d5ae5', '#5a95db', '#7dbb00', '#ffbb00', '#f75314',
                        '#b00454', '#00a1f1', '#02c1a5', '#efee18', '#dd0527'
                      ];
                      return colorList[params.dataIndex];
                    }
                  }
                },
                data: newArr
              }
            ]
          };
          myChart.setOption(option);
        } else {
          mui.alert('数据获取失败' || result.msg, '提示');
        }
      }
    });
  },
  selectFn: function (obj, selectId, title) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl[obj],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            var id = lists[i].id || lists[i].itemCode;
            if (id === selectId) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          self.state.selectLi = lists;
          self.state.selectTitle = '选择' + title;
        }
      }
    });
  },
  updateField: function (field, valData) {
    this.state.selectDate[field] = valData;
  }
};
