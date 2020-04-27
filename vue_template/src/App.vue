<template>
  <div id="app" v-loading="loading">
    <div v-if="step === '1'">
      <el-radio-group v-model="selection.ServerType">
        <el-radio-button :label="0">English</el-radio-button>
        <el-radio-button :label="1">中文</el-radio-button>
      </el-radio-group>
      <br />
      <el-radio-group v-model="selection.EvalMode">
        <el-radio-button :label="0">{{ switchCode("word") }}</el-radio-button>
        <el-radio-button :label="1">{{ switchCode("sentence") }}</el-radio-button>
      </el-radio-group>
      <br />
      <el-button type="primary" plain @click="startEvaluation">{{ switchCode("buttonText") }}</el-button>
      <!-- <el-button type="primary" plain @click="uploadAudioRecording">上传</el-button> -->
      <!-- <el-button type="primary" plain @click="startRecordAudio">录音</el-button> -->
      <!-- <el-button type="primary" plain @click="stopRecordAudio">停止录音</el-button> -->
    </div>
    <div v-else-if="step === '2'" class="question-card">
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <span>{{ switchCode("questionDesc") }}</span>
          <el-button type="danger" icon="el-icon-close" circle size="mini"></el-button>
        </div>
        <div class="card-ques">{{question.list && question.list[question.index]}}</div>
        <div class="card-mic">
          <figure
            class="card-animate"
            :class="{'recording-state':question.isRecording}"
            @click="startRecordAudio"
          >
            <figcaption>
              <el-button type="primary" icon="el-icon-microphone" circle size="default"></el-button>
            </figcaption>
            <!-- 圈圈的大小，68*69主要是按照按钮的大小设置 -->
            <svg width="68" height="69">
              <!-- 定义变量，这里定义了渐变的颜色，用于圈圈边框的颜色做一个渐变颜色，参考circle的stroke=url(#linear),#linear指的是这个id=linear的linearGradient -->
              <defs>
                <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#409effcc" />
                  <stop offset="100%" stop-color="#409eff87" />
                </linearGradient>
              </defs>
              <circle
                cx="34"
                cy="34"
                r="31"
                stroke="url(#linear)"
                class="outer"
                :style="{'animation-duration': '10000ms'}"
              />
            </svg>
          </figure>
          <div>
            <el-button
              type="success"
              circle
              @click="playAudio(question.score[question.index])"
            >{{question.index}}</el-button>
          </div>
          <audio id="audio" src></audio>
          <el-rate
            v-if="question.score[question.index]"
            v-model="question.score[question.index]['SuggestedScore']"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            class="score-padding"
          ></el-rate>
        </div>
        <div class="card-button-group">
          <el-button type="primary" :disabled="question.index === 0" @click="prevPage">Previous Page</el-button>
          <el-button
            type="primary"
            :disabled="question.index === (question.length - 1)"
            @click="nextPage"
          >Next Page</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import question_list from "./question_list.js"
console.log(question_list)
export default {
  name: 'App',
  data () {
    return {
      selection: {
        ServerType: 0,
        EvalMode: 0,
      },
      lang: {
        0: {
          "word": "Word",
          "sentence": "Sentence",
          "buttonText": "Start Evaluation",
          "questionDesc": "Please say the word/sentece in English"
        },
        1: {
          "word": "单词",
          "sentence": "句子",
          "buttonText": "开始评测",
          "questionDesc": "请用中文说出屏幕显示的内容"
        },
      },
      recorder: null,
      loading: false,
      step: '1',
      question: {
        list: null,
        index: 0,
        length: 0,
        isRecording: false,
        timeout_task: null,
        score: [],
        audioDom: null,
      },
    }
  },
  // created () {
  //   // console.log(question_list);
  //   this.question.list = (question_list["0__1"] && question_list["0__1"]["text"].sort(() => Math.random() - 0.5)) || [];
  //   this.question.length = this.question.list.length;
  // },
  methods: {
    switchCode: function (name) {
      let lang = this.lang;
      let serverType = this.selection.ServerType;
      return (lang && lang[serverType] && lang[serverType][name]) || name
    },
    startEvaluation () {
      let vm = this;
      let serverType = this.selection.ServerType;
      let evalMode = this.selection.EvalMode;
      if (!([0, 1].includes(serverType) && [0, 1].includes(evalMode))) {
        alert("Please specify language and evaluating mode!\n请选择评测语言和类型！ ")
      }
      vm.loading = true;
      this.recorder = new TencentSOE({
        // TransInitUrl: 'https://soe.cloud.tencent.com/cgi/transInit',
        TransInitUrl: 'http://localhost:7001/transInit',
        ServerType: serverType,
        EvalMode: evalMode,
        success () {
          vm.loading = false;
          vm.step = '2';
          // console.log('啊妈我得咗！！！')
          let search_key = serverType + "__" + evalMode;
          // function () => {return Math.random() - 0.5 }
          vm.question.list = (question_list[search_key] && question_list[search_key]["text"].sort(() => Math.random() - 0.5)) || [];
          vm.question.length = vm.question.list.length;
        },
        error (err) {
          console.log(err);
          vm.loading = false;
        }
      });
    },
    uploadAudioRecording () {
      // TODO
      this.recorder.uploadLocalFile({
        RefText: 'about',
        load () {
          console.log('文件加载完成');
        },
        success (res) {
          console.log(res); // 输出测评结果
        },
        error (err) {
          console.log('err', err);
        }
      });
    },
    startRecordAudio () {
      /**
   * 开始录音
   * @param {
   *   RefText: 'string', // 测评文本，必填
   *   error: function() {}, // 录音过程出现错误回调，选填
   *   complete: function() {}, // 录音1分钟自动停止回调（微信端），选填
   *   success: function() {}, // 录音1分钟自动测评回调（微信端），建议填写，否则超时后无法获取测评结果
   * }
   */
      if (this.question.isRecording) {
        this.stopRecordAudio()
      } else {
        let duration = this.selection.evalMode ? 20 * 1000 : 10 * 1000;
        // let timeout_task;
        this.question.isRecording = true;
        this.recorder.start({
          RefText: this.question.list[this.question.index],
          error: function (err) {
            console.log(err);
            this.stopRecordAudio();
          },
          // complete: function () {
          //   console.log('录音超过1分钟未停止触发此回调');
          // },
          // success: function (res) {
          //   console.log(res);
          // }
        });
        this.question.timeout_task = setTimeout(() => { this.stopRecordAudio() }, duration);
      }
    },
    nextPage () {
      if (this.question.index < this.question.length) {
        this.question.index += 1;
      }
    },
    prevPage () {
      if (this.question.index > 0) {
        this.question.index -= 1;
      }
    },
    stopRecordAudio () {
      /**
   * 停止录音，返回测评结果
   * @param {
   *   success: function() {} // 成功回调
   *   error: function() {} // 失败回调
   * }
   */
      let vm = this;
      if (!this.question.isRecording) return;
      this.question.isRecording = false;
      // console.log(err);
      clearTimeout(this.question.timeout_task);
      this.recorder.stop({
        success (res) {
          // 获取blob对象，创建audio进行回放 (PC端)
          // let audio = document.createElement('audio');
          // audio.setAttribute('controls', '');
          // let blobUrl = URL.createObjectURL(res.blob);
          // audio.src = blobUrl
          // let blobUrl = URL.createObjectURL(res.blob);
          // document.body.appendChild(audio);
          // 输出测评结果
          console.log(res);
          vm.$set(vm.question.score, vm.question.index, res)
        },
        error (err) {
          console.log(err);
        }
      });
    },
    playAudio (response) {
      if (!response) { return; }
      if (!this.question.audioDom) { this.question.audioDom = document.querySelector("#audio") }
      let audioDom = this.question.audioDom;
      // console.log(audioDom, URL.createObjectURL(response.blob));
      audioDom.src = URL.createObjectURL(response.blob); //切换音频的src资源
      audioDom.play().catch((e) => {
        console.log(e)
        alert('播放失败' + e)
      })//播放
      // 当前音频播放完毕，修改音频播放状态，并且触发队列下一个音频播放
      audioDom.onended = async () => { //
        alert('播放完毕')
      }
    },
  },
}
</script>

<style lang='less'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.question-card {
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    width: 480px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .card-button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
    }
    .card-mic {
      padding-top: 70px;
      .el-button {
        padding: 10px;
        font-size: 32px;
      }
    }
    .card-ques {
      padding-top: 60px;
    }
    .score-padding {
      padding-top: 22px;
    }
    .test {
      stroke-dashoffset: 0 !important;
    }
    .card-animate {
      display: inline-block;
      position: relative;

      figcaption {
        // 因为圈圈是absolute，脱离了文档流，会显示在button上面，导致button的交互效果没了，设置relative跟z-index让按钮显示在最上层
        position: relative;
        z-index: 10;
        .el-button {
          margin: 7px; //外边距撑开父容器，让父容器预留位置，即圈圈外边框的空间
        }
      }

      // 圈圈的父容器定义，主要是位置的定义
      svg {
        position: absolute;
        top: 0;
        left: 0;
        .outer {
          fill: transparent;
          // stroke: linear-gradient(90deg, #e2b32d, #409eff87);
          stroke-width: 3px;
          stroke-dasharray: 194.68;
          stroke-dashoffset: 194.68;
        }
      }

      // 点击时的圈圈动画以及按钮的背景颜色变化动画
      &.recording-state {
        .outer {
          transition: stroke-dashoffset 1s;
          // animation: show100 2s infinite;
          animation-name: show100;
          animation-iteration-count: 1;
        }

        .el-button {
          animation-name: btnflash;
          animation-iteration-count: 1;
          animation-duration: 10s;
        }
      }
      @keyframes show100 {
        from {
          stroke-dashoffset: 194.68;
        }
        to {
          stroke-dashoffset: 0;
        }
      }
      @keyframes btnflash {
        from {
          background-color: #8896b3;
          border-color: #8896b3;
        }
        to {
          background-color: #409eff;
          border-color: #409eff;
        }
      }
    }
  }
}
</style>
