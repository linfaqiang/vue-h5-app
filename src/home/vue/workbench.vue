<template>
  <div id="offCanvasContentScroll" class="mui-content mui-scroll-wrapper">
    <div class="mui-scroll">
    	<div class="applications">
    		<div class="list-container" v-for="functioned in smodules">
    			<h3 class="list-title"> {{ functioned.mtitle }} </h3>
    			<div class="list-content">
    				<ul>
    					<li v-for="func in functioned.funcs">
    						<a :href="'/' + func.key + '/index.html'">
    							<b><img :src="func.icon|imgUrl"></b>
    							<span> {{ func.title }} </span>
    						</a>
    					</li>
    				</ul>
    			</div>
    		</div>
    	</div>
    </div>
  </div>
</template>
<script>
  import {APIS} from 'configPort';
  export default {
    data: function () {
      return {
        smodules: []
      };
    },
    filters: {
      imgUrl (value) {
        return APIS.admin + value;
      }
    },
    methods: {
    },
    created: function () {
      var _this = this;
      var jsonBenches = window.localStorage.getItem('benches');
      var data = JSON.parse(jsonBenches);

      var dictAllFunctions = [];
      var allModules = data.modules;
      allModules.map(function (module, index) {
        module.funcs.map(function (item, n) {
          dictAllFunctions[item.fid + ''] = item;
        });
      });

      _this.smodules = data.smodules;
      _this.smodules.map(function (module, index) {
        module.funcs.map(function (item, n) {
          Object.assign(item, dictAllFunctions[item.fid + '']);
        });
      });
    },
    ready: function () {
      mui.init();
    }
  };
</script>
