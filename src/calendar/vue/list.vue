<template>
	<div class="calendar-container">
	  <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backHome()"></a>
      <h1 class="mui-title">日历</h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right"></a>
    </header>
		<div id="calendar"></div>
		<activelist></activelist>
	</div>
</template>

<script>
  import Calendar from 'mob-calendar';
  import activelist from '../../home/vue/activelist.vue';
  export default {
    components: {
      'activelist': activelist
    },
    data: function () {
      return {
      };
    },
    methods: {
      backHome: function () {
        if (APIS.is_weixin) {
          history.go(-1);
        } else {
          nativeApi.goNative();
        }
      }
    },
    ready: function () {
      var currentDate = new Date();
    	new Calendar({
	      // 用户传入实际的数据
	      container: 'calendar',
	      angle: 15,
	      isMask: false, // 是否需要弹层
	      beginTime: [2017, 1, 1],//如空数组默认设置成1970年1月1日开始,数组的每一位分别是年月日。
	      endTime: [2024, 12, 31],//如空数组默认设置成次年12月31日,数组的每一位分别是年月日。
	      recentTime: [],//如空数组默认设置成当月1日,数组的每一位分别是年月日。
	      isSundayFirst: true, // 周日是否要放在第一列
	      isShowNeighbor: false, // 是否展示相邻月份的月尾和月头
	      isToggleBtn: true, // 是否展示左右切换按钮
	      isChinese: true, // 是否是中文
	      monthType: 0, // 0:1月, 1:一月, 2:Jan, 3: April
	      canViewDisabled: true, // 是否可以阅读不在范围内的月份
	      beforeRenderArr: [{
	        stamp: 1512057600000,
	        //className: 'able',
	      }],
	      success: function (item, arr) {
	        console.log(item, arr);
	        //document.getElementsByClassName('calendar-item-' + item)[0].classList.add('able');
	        //document.getElementsByClassName('calendar-item-' + item)[1].classList.add('able');
	        document.querySelectorAll('.calendar-item-' + item)[0].classList.add('able');
	        document.querySelectorAll('.calendar-item-' + item)[1].classList.add('able');
	      },
	      switchRender: function (year, month, cal) {
	        //console.log('计算机识别的 - 年份: ' + year + ' 月份: ' + month);
	        var data = [{
	          'stamp': 1507737600000,
	          //'className': 'able',
	        }];
	        cal.renderCallbackArr(data);
	      }
	    });
    }
  };
</script>