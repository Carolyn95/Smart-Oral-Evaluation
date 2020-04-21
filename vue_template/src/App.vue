<template>
  <div id="app">
 <div>
    <el-radio-group v-model="selection.ServerType">
      <el-radio-button :label="0">English</el-radio-button>
      <el-radio-button :label="1">中文</el-radio-button>
    </el-radio-group>
 </div>
 <div>
    <el-radio-group v-model="selection.EvalMode">
      <el-radio-button :label="0">{{ switchCode('word') }}</el-radio-button>
      <el-radio-button :label="1">{{ switchCode('sentence') }}</el-radio-button>
    </el-radio-group>
  </div>
  <el-button type="primary" plain @click="startEvaluation">{{ switchCode('buttonText') }}</el-button>
  </div>
</template>
<script>

export default {
  name: 'App',
  data(){
    return {
      selection: {
        ServerType: 0,
        EvalMode: 0,
      },
      lang: {
        0: {
          'word': "Word",
          'sentence': "Sentence",
          'buttonText': "Start Evaluation",
        },
        1: {
           'word': "词语",
           'sentence': "句子",
           'buttonText': "开始评测",
        },
      }
    }
  },
  methods: {
    switchCode(name) {
      let serverType = this.selection.ServerType;
      let lang = this.lang;
      return (lang && lang[serverType] && lang[serverType][name]) || name
    },
    startEvaluation() {
        // let recorder = new TencentSOE({
        // TransInitUrl: 'https://soe.cloud.tencent.com/cgi/transInit',
        // success() {
        //   // TODO
        // },
        // error(err) {
        //   console.log(err);
        // }
        // })

    },
  }
  // created: () => {

  // }
  
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
