<template>
	<div>
		<!--页面主结构开始-->
		<div id="app" class="mui-views">
			<div class="mui-view">
				<div class="mui-navbar">
				</div>
				<div class="mui-pages">
				</div>
			</div>
		</div>
		<!--页面主结构结束-->
		<!--单页面开始-->
		<div id="setting" class="mui-page">
			<!--页面标题栏开始-->
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<h1 class="mui-center mui-title">设置</h1>
			</div>
			<!--页面标题栏结束-->
			<!--页面主内容区开始-->
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper positionTop">
					<div class="mui-scroll">
					  <ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a id="head" class="mui-navigate-right">头像
								<span class="mui-pull-right head">
									<img class="head-img mui-action-preview" id="head-img1" src="../../public/images/cbd.jpg" style="border-radius: 50%;" />
								</span>
							</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="javascript:;">姓名<span class="mui-pull-right">云尚云</span></a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="#about" class="mui-navigate-right">手机</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="#account" class="mui-navigate-right">邮件</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="javascript:;">职位</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="javascript:;">部门</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="javascript:;">直属上级</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!--页面主内容区结束-->
		</div>
		<!--单页面结束-->
		<div id="about" class="mui-page">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<button id="submit" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" @tap="savePhone()">保存</button>
				<h1 class="mui-center mui-title">手机</h1>
			</div>
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper positionTop">
					<div class="mui-scroll">
						<div>
							<input type="text" v-model="phone" placeholder="请输入11位手机号" style="border: 0;border-radius:0;">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="account" class="mui-page">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<button class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" @tap="saveEmail()">保存</button>
				<h1 class="mui-center mui-title">邮箱</h1>
			</div>
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper positionTop">
					<div class="mui-scroll">
						<div>
							<input type="text" v-model="email" placeholder="请输入邮箱" style="border: 0;border-radius:0;">
						</div>
					</div>
				</div>
			</div>
		</div>

</template>
<script>
  require('../../setting/feedback.css');
  require('../../setting/feedback-page.css');
  require('mui');
  require('mui.view');
  import {APIS} from 'configPort';
  export default {
    data: function () {
      return {
        phone: '',
        email: ''
      };
    },
    methods: {
      savePhone: function () {
        var phoneReg = /^1(3|4|5|7|8)\d{9}$/;
        if (this.phone === '') {
          mui.alert('手机号不能为空', '提示');
        } else if (!phoneReg.test(this.phone)) {
          mui.alert('手机号格式不对', '提示');
        } else {
          var url = APIS.modify_mobile_admin + '?phone=' + this.phone + '&id=89';
          this.$http.post(url).then((result) => {
            console.log(result);
            this.$http.put(APIS.modify_mobile, {'mobile': this.phone}, {emulateJSON: true}).then((res) => {
              console.log(res);
            });
          });
        }
      },
      saveEmail: function () {
        if (this.email === '') {
          mui.alert('邮箱不能为空', '提示');
        } else if (!new RegExp(/^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(this.email)) {
          mui.alert('邮箱格式不对', '提示');
        } else {
        }
      }
    },
    ready: function () {
      mui.init();
      var viewApi = mui('#app').view({
        defaultPage: '#setting'
      });
      mui('.mui-scroll-wrapper').scroll();
      var view = viewApi.view;
      (function ($) {
        var oldBack = $.back;
        $.back = function () {
          if (viewApi.canBack()) {
            viewApi.back();
          } else {
            oldBack();
          }
        };
        view.addEventListener('pageBeforeShow', function (e) {
        });
        view.addEventListener('pageShow', function (e) {
        });
        view.addEventListener('pageBeforeBack', function (e) {
        });
        view.addEventListener('pageBack', function (e) {
        });
      })(mui);
    }
  };
</script>