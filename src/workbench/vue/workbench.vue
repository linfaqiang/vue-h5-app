<template>
	<div class="applications">
		<div class="list-container" v-for="m in 4">
			<h3 class="list-title">销售管理</h3>
			<div class="list-content">
				<ul>
					<li v-for="item in 12">
						<a>
							<b><img src="../../public/images/icon_03.jpg" ></b>
							<span>线索分配</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
  export default {
    data: function () {
      return {
      };
    },
    methods: {
    },
    ready: function () {
      mui.init();
    }
  };
</script>