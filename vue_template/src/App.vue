<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  created: () => {
    let recorder = new TencentSOE({
    TransInitUrl: 'http://localhose:7001/transInit',
    success() {
      console.log('hi');
      // TODO
      recorder.uploadLocalFile({
      RefText: 'about',
      load() {
        console.log('文件加载完成');
      },
      success(res) {
        console.log(res); // 输出测评结果
      },
      error(err) {
        console.log('err', err);
      }
      });
      },
    error(err) {
      console.log(err);
    }
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
