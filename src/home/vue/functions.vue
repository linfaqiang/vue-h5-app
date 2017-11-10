<template>
  <div class="function-container">
	  <div class="function-list">
			<div class="function-list-inner">
			  <div class="list-container">
			    <h3 class="list-text">常用功能</h3>
				<div class="list-content">
				  <ul>
				    <li v-for="func in funcList">
						  <a :href="'/' + func.key + '/index.html'">
								<b><img :src="func.icon|imgUrl"></b>
								<span> {{func.title}} </span>
						  </a>
				    </li>
				  </ul>
				</div>
			  </div>

			  <div class="list-container" v-show="showList" transition="fade">
					<h3 class="list-title">我的功能库</h3>
					<div class="list-content pt_5">
					  <ul>
					    <li v-for="img in 8">
						  <a>
							<b><img src="../../public/images/icon_03.jpg" ></b>
							<span>市场活动</span>
						  </a>
					    </li>
					  </ul>
					</div>
			  </div>

			</div>
	  </div>
	  <div class="opacity-container" v-show="showList"></div>
	</div>
</template>
<script>
  import {APIS} from 'configPort';
  export default {
    data: function () {
      return {
        showList: false,
        funcList: [],
        benchList: [],
        benches: {}
      };
    },
    filters: {
      imgUrl (value) {
        return APIS.admin + value;
      }
    },
    methods: {
      toggleList: function () {
        if (!this.showList) {
          this.showList = true;
          this.$emit('child-toggle', this.showList);
        } else {
          this.showList = false;
          this.$emit('child-toggle', this.showList);
        }
      }
    },
    created: function () {
      var _this = this;
      var params = {
        vtype: 'usable',
        token: 234567,
        key: '547bca33-3af0-4cba-b01f-3bc739a64a71',
        login: 'test',
        phone: '13413141314',
        tname: '',
        modules: '',
        from: 'WX',
        plat: 'wechat',
        ver: '1.60.20170303'
      };
      this.$http.post(APIS.device_register, params, {emulateJSON: true}).then(
        function (res) {
          _this.benches = res.data;
          var jsonBenches = JSON.stringify(_this.benches);
          window.localStorage.setItem('benches', jsonBenches);

          this.$http.get(APIS.my_general_functions).then(
            function (res) {
              _this.funcList = res.data.data;
              var jsonBenches = window.localStorage.getItem('benches');
              _this.benchList = JSON.parse(jsonBenches).modules;
              _this.benchList.map(function (item, index) {
                item.funcs.forEach(function (key, n) {
                  _this.funcList.forEach(function (k, i) {
                    if (k.fid === key.fid) {
                      Object.assign(k, key);
                    }
                  });
                });
              });
            },
            function (res) {
              mui.alert('请求出错了！');
            }
          );
        },
        function (res) {
          mui.alert('请求出错了！');
        }
      );
    },
    ready: function () {
      mui.init();
    }
  };
</script>
