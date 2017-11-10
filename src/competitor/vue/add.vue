/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveCompetitor()">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="the_add">
            <ul class="mui-table-view">
              <crm-listicon :list="list" v-for=" list in addFields.fieldOne"></crm-listicon>
            </ul>
            <ul class="mui-table-view" id="change-height" :style="{'height':addFields.moreHeight}">
              <crm-listicon :list="list" v-for=" list in addFields.fieldTwo"></crm-listicon>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="newC-plus" v-show="addFields.moreShow" @tap="add"><span class="mui-icon crm-plus"> </span>添加更多信息</div>
  </div>
</template>
<script>
  import store from '../competitor-store';
  var nativeApi = require('nativeApi');
  import {validator} from '../../public/js/crm-verify.js';
  import crmListIcon from '../../public/components/listsingle/crm-listicon.vue';
  export default {
    components: {
      'crm-listicon': crmListIcon
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '新建竞争对手'
        },
        addFields: store.state,
        detailData: {
          'switch': false
        },
        switch: false,
        adrMsg: {}
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      saveCompetitor: function () {
        var self = this;
        var datas = this.addFields.fieldOne;
        if (!datas[0].value) {
          mui.alert('请输入公司名称');
          return;
        }
        if (!datas[1].value) {
          mui.alert('请输入地址');
          return;
        }
        var arrList = this.addFields.fieldOne.concat(this.addFields.fieldTwo);
        var flag = validator.init(arrList, true);
        if (!flag) {
          return;
        }
        var param = {
          'competitorName': self.addFields.fieldOne[0].value,
          'competitorPhone': self.addFields.fieldOne[2].value,
          'remark': self.addFields.fieldOne[3].value,
          'address': {
            'address': self.adrMsg.address,
            'province': self.adrMsg.province,
            'city': self.adrMsg.city,
            'cityCode': self.adrMsg.cityCode,
            'adname': self.adrMsg.adname,
            'adcode': self.adrMsg.adcode,
            'longitude': self.adrMsg.longitude,
            'latitude': self.adrMsg.latitude
          },
          'linkman': {
            'name': self.addFields.fieldTwo[0].value,
            'department': self.addFields.fieldTwo[1].value,
            'title': self.addFields.fieldTwo[2].value,
            'mobile': self.addFields.fieldTwo[3].value,
            'wechat': self.addFields.fieldTwo[5].value,
            'birthday': self.addFields.fieldTwo[6].value
          }
        };

        for (var attr in param.linkman) {
          if (attr !== 'name') {
            if (param.linkman[attr] && !param.linkman.name) {
              mui.alert('请输入联系人姓名');
              return;
            }
          }
        }

        var linkmanFalg = false;      // 联系人信息如果都不填 就传null
        for (var ii in param.linkman) {
          if (param.linkman[ii]) {
            linkmanFalg = true;
          }
        }
        if (!linkmanFalg) {
          param.linkman = null;
        }

        nativeApi.initAjax({
          type: 'post',
          url: store.APIS.competitors_detail.substring(0, store.APIS.competitors_detail.length - 1),
          param: param,
          callback: function (result) {
            if (result && result.code === 200) {
              mui.alert('新增成功', '提示', function () {
                store.listRefresh('list');
                history.go(-1);
              });
            } else {
              mui.alert(result.msg || '新增失败', '提示');
            }
          }
        });
      },
      switchFn: function () {
        if (this.switch) {
          this.switch = false;
        } else {
          this.switch = true;
        }
      },
      add: function () {
        if (this.addFields.moreShow === true) {
          store.state.moreHeight = '310px';
        }
        store.state.moreShow = !store.state.moreShow;
      },
      getFirstAdr: function () {
        var self = this;
        nativeApi.getQDLocationInfo({
          callback: function (result) {
            self.adrMsg = result;
            self.addFields.fieldOne[1].value = result.address;
          }
        });
      }

    },
    events: {
      'getAdrMsg': function () {
        var self = this;
        nativeApi.correctLocation({
          'apiJson': {
            'showMap': false,
            'address': self.adrMsg.address,
            'province': self.adrMsg.province,
            'city': self.adrMsg.city,
            'district': self.adrMsg.district,
            'adcode': self.adrMsg.adcode,
            'cityCode': self.adrMsg.cityCode,
            'longitude': self.adrMsg.longitude,
            'latitude': self.adrMsg.latitude
          },
          callback: function (result) {
            /* 位置纠偏*/
            self.adrMsg = result;
            self.addFields.fieldOne[1].value = result.address;
          }
        });
      }
    },
    route: {
      activate: function (transition) {
        transition.next();
        this.getFirstAdr();
      }
    },
    created: function () {

    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
      });
    }
  };
</script>
