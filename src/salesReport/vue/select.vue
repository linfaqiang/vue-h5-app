/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="back"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" style="padding-left:20px; display: inline-block; width: 50px"
         @tap="confirm()">确认</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li v-if="notStaff.notStaff">
                <a class="mui-icon arrows" @click="getType(selectDate.selectType)">
                  <label>筛选</label>
                  <div>{{selectDate.selectType}}</div>
                  <!--<div>{{searchData.customer}}</div>-->
                </a>
              </li>
              <li v-if="notStaff.notStaff">
                <a @click="getRenyuan(selectDate.selectType=='部门')" class="mui-icon arrows"
                   :class="{'not':selectDate.selectType=='部门'}">
                  <label>指定人员</label>
                  <div>{{selectDate.employee}}</div>
                </a>
              </li>

              <li v-if="notStaff.notStaff">
                <a @click="getBumen(selectDate.selectType=='人员')" class="mui-icon arrows"
                   :class="{'not':selectDate.selectType=='人员'}">
                  <label>指定部门</label>
                  <div>{{selectDate.depth}}</div>
                </a>
              </li>
              <li>
                <a @click="getDateTime('start')" class="mui-icon arrows">
                  <label>{{selectDate.dayTitle}}</label>
                  <div>{{selectDate.start}}</div>
                </a>
              </li>
              <li v-if="selectDate.endSelect">
                <a @click="getDateTime('end')" class="mui-icon arrows">
                  <label>结束时间</label>
                  <div>{{selectDate.end}}</div>
                </a>
              </li>
              <li v-if="selectDate.chanceShow">
                <a @click="getChanceType" class="mui-icon arrows">
                  <label>商机类型</label>
                  <div>{{selectDate.chanceType}}</div>
                </a>
              </li>
              <li v-if="selectDate.weiduShow">
                <a @click="getWeidu(selectDate.weidu)" class="mui-icon arrows">
                  <label>维度</label>
                  <div>{{selectDate.weidu}}</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer @click="restFn()" class="rest_bn"><span style="font-size: 15px" class="mui-icon crm-loading"></span>重置条件
      </footer>
    </div>
    <div class="levels" v-show="levelShow">
      <header class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="levelBack"></a>
        <h1 class="mui-title">选择维度</h1>
        <!--v-if-->
      </header>
      <div class="mui-content">
        <div class="select_li">
          <ul>
            <li v-for="level in leaves" @click="selected($index)">
              <span>{{level.name}}</span>
              <span :class="{'crm-check':level.selected}" class="mui-icon"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="levels" v-show="selectedTypeShow">
      <header class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="selectTypeBack"></a>
        <h1 class="mui-title">选择类型</h1>
        <!--v-if-->
      </header>
      <div class="mui-content">
        <div class="select_li">
          <ul>
            <li v-for="level in selectTypes" @click="selectedType($index)">
              <span>{{level.name}}</span>
              <span :class="{'crm-check':level.selected}" class="mui-icon"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../report-store';
  import {FastClick} from 'fastclick';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '更多筛选'
        },
        selectDate: store.state.selectDate,
        levelShow: false,
        notStaff: store.state,
        selectedTypeShow: false,
        leaves: [
          {
            'id': 0,
            'selected': true,
            'name': '月',
            'value': 'monthly'
          },
          {
            'id': 1,
            'selected': false,
            'name': '季度',
            'value': 'quarterly'
          },
          {
            'id': 2,
            'selected': false,
            'name': '半年',
            'value': 'semi-annual'
          },
          {
            'id': 3,
            'selected': false,
            'name': '年',
            'value': 'annual'
          }
        ],
        selectTypes: [
          {
            'id': 0,
            'selected': true,
            'name': '部门'
          },
          {
            'id': 1,
            'selected': false,
            'name': '人员'
          }
        ]
      };
    },
    route: {
      activate: function (transition) {
        if (this.$route.params.type) {
          this.selectDate.dayTitle = '起始日期';
          this.selectDate.endSelect = true;
          this.selectDate.chanceShow = true;
        }
        this.selectedTypeShow = false;
        transition.next();
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      getDateTime: function (field) {
        var types = 'month';
        if (this.$route.params.type) {
          types = 'date';
        }
        var picker = new mui.DtPicker({'type': types});
        picker.show(function (rs) {
          store.state.selectDate[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = store.state.selectDate['start'];
          var end = store.state.selectDate['end'];
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            mui.alert('开始日期不能晚于结束日期', '提示', function () {
              store.state.selectDate[field] = '';
            });
            return;
          }
          picker.dispose();
        });
      },
      confirm: function () {
        history.go(-1);
      },
      getWeidu: function (val) {
        this.levelShow = true;
        for (var i = 0; i < this.leaves.length; i++) {
          if (this.leaves[i].name === val) {
            this.leaves[i].selected = true;
          } else {
            this.leaves[i].selected = false;
          }
        }
      },
      getType: function (val) {
        this.selectedTypeShow = true;
        for (var i = 0; i < this.selectTypes.length; i++) {
          if (this.selectTypes[i].name === val) {
            this.selectTypes[i].selected = true;
          } else {
            this.selectTypes[i].selected = false;
          }
        }
      },
      levelBack: function () {
        this.levelShow = false;
      },
      selectTypeBack: function () {
        this.selectedTypeShow = false;
      },
      selected: function (index) {     // 选择维度 年/月
        for (var i = 0; i < this.leaves.length; i++) {
          this.leaves[i].selected = false;
        }
        this.leaves[index].selected = true;
        store.state.selectDate.weidu = this.leaves[index].name;
        store.state.selectDate.weiduValue = this.leaves[index].value;
        this.levelShow = false;
      },
      selectedType: function (index) {   // 选择部门/人员
        for (var i = 0; i < this.selectTypes.length; i++) {
          this.selectTypes[i].selected = false;
        }
        this.selectTypes[index].selected = true;
        store.state.selectDate.selectType = this.selectTypes[index].name;
        this.selectedTypeShow = false;
        if (index === 0) {
          this.selectDate.employee = '';
          this.selectDate.employeeId = 0;
        } else {
          this.selectDate.depth = '';
          this.selectDate.depthId = 0;
        }
      },
      getBumen: function (type) {
        if (type) {
          return;
        }
        var self = this;
        /* 查询部门 */
        store.showDept(self.selectDate.depthId, function () {
          self.$router.go('/personDeptPage/dept');
        });
      },
      getRenyuan: function (type) {
        if (type) {
          return;
        }
        var self = this;
        /* 查询人员 */
        store.showStaff(self.selectDate.employeeId, function () {
          self.$router.go('/personDeptPage/staff');
        });
      },
      restFn: function () {
        store.initSelect(this.$route.params && this.$route.params.type);
      },
      getChanceType: function () {
        store.selectFn('chance', this.selectDate.chanceTypeId, '商机类型');
        this.$router.go('/select-p/chanceTypeId_edit');
      }
    },
    ready: function () {
      FastClick.attach(document.body);
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
