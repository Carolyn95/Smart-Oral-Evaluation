<template>
  <div id="app" v-loading="loading">
    <div>
    <el-radio-group v-model=selection.ServerType>
      <el-radio-button :label="0">English</el-radio-button>
      <el-radio-button :label="1">中文</el-radio-button>
    </el-radio-group>
    </div>
    <div>
    <el-radio-group v-model=selection.EvalMode>
      <el-radio-button :label="0">{{ switchCode("word") }}</el-radio-button>
      <el-radio-button :label="1">{{ switchCode("sentence") }}</el-radio-button>
    </el-radio-group>
    </div>
    <div>
      <el-button type="primary" plain @click="startEvaluation">{{ switchCode("buttonText") }}</el-button>
    </div>
    <el-button type="primary" plain @click="uploadAudioRecording">上传</el-button>
    <el-button type="primary" plain @click="startRecordAudio">录音</el-button>
    <el-button type="primary" plain @click="stopRecordAudio">停止录音</el-button>
 </div>
</template>
<script>

export default {
  name: 'App',
  data() {
    return {
      selection: {
      ServerType: 0,
      EvalMode: 0,
      },
      lang: {
        0: {
          "word": "Word", 
          "sentence": "Sentence", 
          "buttonText": "Start Evaluation"
          },
        1: {
          "word": "单词", 
          "sentence": "句子", 
          "buttonText": "开始评测"
          },
      },
      recorder: null,
      loading: false,
    }
  },
  methods: {
    switchCode: function (name) {
      let lang = this.lang;
      let serverType = this.selection.ServerType;
      return (lang && lang[serverType] && lang[serverType][name]) || name
    },
    startEvaluation(){
      let vm = this;
      let serverType = this.selection.ServerType;
      let evalMode = this.selection.EvalMode;
      if (!([0,1].includes(serverType) && [0,1].includes(evalMode))){
        alert("Please specify language and evaluating mode!\n请选择评测语言和类型！ ")
      }  
      vm.loading = true;
      this.recorder = new TencentSOE({
        TransInitUrl: 'https://soe.cloud.tencent.com/cgi/transInit',
      // TransInitUrl: 'http://localhose:7001/transInit?ServerType='+ serverType + '&EvalMode=' + evalMode,
      success() {
        vm.loading = false;
        console.log('啊妈我得咗！！！')
        
        },
      error(err) {
        console.log(err);
        vm.loading = false;
      }
      });
  },
  uploadAudioRecording(){
        // TODO
        this.recorder.uploadLocalFile({
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
  startRecordAudio(){
    /**
 * 开始录音
 * @param {
 *   RefText: 'string', // 测评文本，必填
 *   error: function() {}, // 录音过程出现错误回调，选填
 *   complete: function() {}, // 录音1分钟自动停止回调（微信端），选填
 *   success: function() {}, // 录音1分钟自动测评回调（微信端），建议填写，否则超时后无法获取测评结果
 * }
 */
this.recorder.start({
  RefText: 'about',
  error: function(err) {
    console.log(err);
  },
  complete: function() {
    console.log('录音超过1分钟未停止触发此回调')
  },
  success: function(res) {
    console.log(res);
  }
});
  },
  stopRecordAudio(){
    /**
 * 停止录音，返回测评结果
 * @param {
 *   success: function() {} // 成功回调
 *   error: function() {} // 失败回调
 * }
 */
this.recorder.stop({
  success(res) {
    // 获取blob对象，创建audio进行回放 (PC端)
    let audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    // let blobUrl = URL.createObjectURL(res.blob);
    document.body.appendChild(audio);

    // 获取localId，进行回放（微信端）
    // let localId = res.localId;
    // wx.playVoice({
    //  localId: localId
    // });

    // 输出测评结果
    console.log(res);
  },
  error(err) {
    console.log(err);
  }
});
  }
  },
  // created: () => {
  //   let recorder = new TencentSOE({
  //   TransInitUrl: 'http://localhose:7001/transInit',
  //   success() {
  //     console.log('hi');
  //     // TODO
  //     recorder.uploadLocalFile({
  //     RefText: 'about',
  //     load() {
  //       console.log('文件加载完成');
  //     },
  //     success(res) {
  //       console.log(res); // 输出测评结果
  //     },
  //     error(err) {
  //       console.log('err', err);
  //     }
  //     });
  //     },
  //   error(err) {
  //     console.log(err);
  //   }
  //   });
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
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
