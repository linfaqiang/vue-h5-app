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
								<a class="">检查更新 <i class="mui-pull-right update">V3.1.0</i></a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="#about" class="mui-navigate-right">关于软件</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="#account" class="mui-navigate-right">修改密码</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="#notifications" class="mui-navigate-right">服务与支持</a>
							</li>
						</ul>
						<ul class="mui-table-view mui-table-view-chevron">
							<li class="mui-table-view-cell">
								<a href="#feedback" class="mui-navigate-right">意见反馈</a>
							</li>
						</ul>

						<ul class="mui-table-view" style="margin-top: 20px;">
							<li class="mui-table-view-cell" style="text-align: center;">
								<a>退出登录</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!--页面主内容区结束-->
		</div>
		<!--单页面结束-->
		<div id="account" class="mui-page">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<h1 class="mui-center mui-title">修改密码</h1>
			</div>
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper positionTop">
					<div class="mui-scroll">
						<ul class="mui-table-view">
							<li class="mui-table-view-cell">
                旧密码
								<span class="mui-pull-right">
									<input type="password" placeholder="输入旧密码" v-model="pass.old">
								</span>
								<strong v-show="oldPassTip">请填写旧密码</strong>
							</li>
							<li class="mui-table-view-cell">
						    新密码
								<span class="mui-pull-right">
									<input type="password" placeholder="输入新密码" v-model="pass.new">
								</span>
								<strong v-show="newPassTip">请填写新密码</strong>
							</li>
							<li class="mui-table-view-cell">
						    确认密码
								<span class="mui-pull-right">
									<input type="password" placeholder="输入确认密码" v-model="confirmPassword">
								</span>
								<strong v-show="confirmPassTip">确认密码和新密码不一致</strong>
							</li>
						</ul>
						<div class="btn-container">
							<input type="submit" value="确定" @tap="submitPassword()">
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="notifications" class="mui-page">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<h1 class="mui-center mui-title">服务与支持</h1>
			</div>
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper positionTop">
					<div class="mui-scroll">
						<ul class="mui-table-view">
							<li class="mui-table-view-cell">
								<a href="tel:0755-4008230">热线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>0755-4008230</span></a>
							</li>
						</ul>
						<ul class="mui-table-view">
							<li class="mui-table-view-cell">
								<a href="mailto:serverkindnode@cn.com">邮箱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>serverkindnode@cn.com</span></a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div id="privacy" class="mui-page">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<h1 class="mui-center mui-title">关于软件</h1>
			</div>
		<div id="about" class="mui-page">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<h1 class="mui-center mui-title">关于云尚云</h1>
			</div>
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper positionTop">
					<div class="mui-scroll">
						<div class="img-container">
							<img src="../../public/images/icon/ic_launcher.png">
							<h3>云尚云CRM</h3>
						</div>
						<div class="describe-content">
							<p>&nbsp;&nbsp;&nbsp;&nbsp;云尚云智能科技帮助企业搭建简单、实用、安全的移动平台和应用。</p>
							<p>&nbsp;&nbsp;&nbsp;&nbsp;通过自主知识产权的技术架构，全面提供企业管理移动化的解决方案和产品。涵盖市场、销售、运营交付供应链管理、研发管理、人力资源管理、企业协同、商业智能等业务，实现了管理和业务的移动化，轻松安装即可安全使用</p>
							<p>&nbsp;&nbsp;&nbsp;&nbsp;我们致力于帮助企业实现移动化战略部署，大大提高工作便利性及效能。为企业的业务、管理等战略发展目标提供有力的支持，让每一个企业快速进入移动互联的时代。</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="feedback" class="mui-page feedback">
			<div class="mui-navbar-inner mui-bar mui-bar-nav">
				<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
					<span class="mui-icon mui-icon-left-nav"></span>
				</button>
				<h1 class="mui-center mui-title">问题反馈</h1>
			</div>
			<div class="mui-page-content">
				<div class="mui-content-padded">
					<div class="mui-inline">感谢您对云尚云的关注，如果您在使用过程中有任何的意见和建议，请写下来告诉我们。</div>
					<!--快捷输入具体内容，开发者可自己替换常用语-->
					<div>
					<div class="mui-input-checkbox">
						<div class="mui-input-group">
							<div class="mui-input-row mui-checkbox mui-left" v-for="check in checkes">
								<label> {{ check }} </label>
								<input type="checkbox" >
							</div>
						</div>
					</div>
				</div>
				<div class="row mui-input-row question-container">
					<textarea id='question' class="mui-input-clear question" v-model="opinion.textareaVal" placeholder="请填写反馈意见"></textarea>
					<span v-show="opinionTip">反馈意见不能为空！</span>
				</div>
				<p>手机号码</p>
				<div class="mui-input-row question-container">
					<input id='contact' type="text" class="mui-input-clear contact" v-model="opinion.telphoneVal" placeholder="(选填,方便我们联系你 )" />
					<span v-show="opinionPhone">手机号码格式不对！</span>
				</div>
				<div class="mui-input-row btn-sub">
					<input type="submit" value="提交" @tap="submitOpinion()"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import {APIS} from 'configPort';
  require('mui');
  require('mui.view');
  export default {
    data: function () {
      return {
        checkes: ['界面不友好', '功能模块太少', '运行速度太慢', '经常闪退'],
        pass: {
          old: '',
          new: ''
        },
        opinion: {
          textareaVal: '',
          telphoneVal: ''
        },
        confirmPassword: '',
        oldPassTip: false,
        newPassTip: false,
        confirmPassTip: false,
        opinionTip: false,
        opinionPhone: false
      };
    },
    created: function () {
    },
    methods: {
      submitPassword: function () {
        var self = this;
        if (this.pass.old === '') {
          this.oldPassTip = true;
        } else if (this.pass.new === '') {
          this.newPassTip = true;
        } else if (this.confirmPassword !== this.pass.new) {
          this.confirmPassTip = true;
        } else {
          this.oldPassTip = false;
          this.newPassTip = false;
          this.confirmPassTip = false;
          var url = APIS.admin_update_pwd + '?new=' + this.pass.new + '&old=' + this.pass.old;
          self.$http.post(url).then(
            function (res) {
              self.$http.post(APIS.api_update_pwd, self.pass).then(
              function (res) {
                console.log(res);
              }
              );
            }
          );
        }
      },
      submitOpinion: function () {
        var _this = this;
        var phoneReg = /^1(3|4|5|7|8)\d{9}$/;
        if (this.opinion.textareaVal === '') {
          this.opinionTip = true;
        } else if (!phoneReg.test(this.opinion.telphoneVal)) {
          this.opinionPhone = true;
        } else {
          this.opinionTip = false;
          this.opinionPhone = false;
          var jsonparm = {
            appId: '547bca33-3af0-4cba-b01f-3bc739a64a71',
            fromSys: 'wechat',
            linkPerop: '测试员',
            phone: _this.opinion.telphoneVal,
            content: _this.opinion.textareaVal,
            packageName: 'com.coracle.xsimple.crm.formal'
          };
          jsonparm = '%7bappId%3a+%27547bca33-3af0-4cba-b01f-3bc739a64a71%27%2cfromSys%3a+%27wechat%27%2clinkPerop%3a+%27%e6%b5%8b%e8%af%95%e5%91%98%27%2c+phone%3a+_this.opinion.telphoneVal%2c+content%3a+_this.opinion.textareaVal%2c+packageName%3a+%27com.coracle.xsimple.crm.formal%27%7d';
          var url = 'http://192.168.1.105:8180/admin/api/v1/feedback';
          this.$http.post(url, jsonparm).then(function (result) {
            console.log(result);
          });
        }
      }
    },
    computed: {
      passOld: function () {
        return this.pass.old;
      },
      passNew: function () {
        return this.pass.new;
      },
      getOpinion: function () {
        return this.opinion.textareaVal;
      },
      getPhone: function () {
        return this.opinion.telphoneVal;
      }
    },
    watch: {
      passOld: function (newVal, oldVal) {
        this.oldPassTip = false;
      },
      passNew: function (newVal, oldVal) {
        this.newPassTip = false;
      },
      confirmPassword: function (newVal, oldVal) {
        this.confirmPassTip = false;
      },
      getOpinion: function (newVal, oldVal) {
        this.opinionTip = false;
      },
      getPhone: function (newVal, oldVal) {
        this.opinionPhone = false;
      }
    },
    ready: function () {
      var _this = this;
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
      mui('.mui-input-group').on('change', 'input', function () {
        if (this.checked === true) {
          _this.opinion.textareaVal += this.previousElementSibling.innerText + ',';
        } else {
          _this.opinion.textareaVal = _this.opinion.textareaVal.replace((this.previousElementSibling.innerText + ','), '');
        }
      });
    }
  };
</script>
