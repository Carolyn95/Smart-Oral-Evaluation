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
        {{question.duration}}
        <div class="card-mic">
          <!-- @click="startRecordAudio" -->
          <svg circular class="card-animate" style="
    width: 68px;
    height: 68px;
">
            <circle
              cx="33.5"
              cy="34"
              r="30"
              fill="none"
              :class="{test:question.isRecording}"
              :style="{
                'transition-duration': question.duration + 'ms',
              }"
              style="stroke-width: 3px; stroke: rgba(64, 158, 255, 0.53); stroke-dashoffset: 188.5; stroke-dasharray: 188.5;"
            />
          </svg>
          <el-button
            type="primary"
            icon="el-icon-microphone"
            circle
            size="default"
            style="margin: 7px;position: relative"
            @click="startRecordAudio"
          ></el-button>
          <!-- el-icon-turn-off-microphone -->
        </div>
        <div>
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
        duration: 0//transition duration
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
        this.question.duration = this.selection.EvalMode ? 20 * 1000 : 10 * 1000;
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
        this.question.timeout_task = setTimeout(() => { this.stopRecordAudio() }, this.question.duration);
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
          let audio = document.createElement('audio');
          audio.setAttribute('controls', '');
          let blobUrl = URL.createObjectURL(res.blob);
          audio.src = blobUrl
          // let blobUrl = URL.createObjectURL(res.blob);
          document.body.appendChild(audio);
          // 输出测评结果
          console.log(res);
          vm.$set(vm.question.score, vm.question.index, res)
        },
        error (err) {
          console.log(err);
        }
      });
    }
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
      margin-top: 70px;
      .el-button {
        padding: 10px;
        font-size: 32px;
      }
      circle {
        transition-property: none;
        &.test {
          stroke-dashoffset: 0;
          transition-property: stroke-dashoffset;
          transition-timing-function: linear;
          stroke-dasharray: 188.5;
        }
      }
    }
    .card-ques {
      padding-top: 60px;
    }
    .score-padding {
      padding-top: 22px;
    }

    .card-animate {
      display: inline-block;
      position: absolute;
    }
  }
}
</style>
