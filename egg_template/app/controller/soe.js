'use strict';

const Controller = require('egg').Controller;
const tencentcloud = require('../../../../tencentcloud-sdk-nodejs');


const SoeClient = tencentcloud.soe.v20180724.Client;
const models = tencentcloud.soe.v20180724.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

class SOEController extends Controller {
  async transInit() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
    const cred = new Credential('AKIDgEYeZ0f8ZjwukSRPaVnfR16vVw6xsH6i', 'UifLKT3TdttoU4VLvG0WntiRSFpCPhjg');
    const httpProfile = new HttpProfile();
    httpProfile.endpoint = 'soe.tencentcloudapi.com';
    const clientProfile = new ClientProfile();
    clientProfile.httpProfile = httpProfile;
    const client = new SoeClient(cred, 'ap-singapore', clientProfile);

    const req = new models.TransmitOralProcessWithInitRequest();

    const params = '{"SeqId":1111122222,"IsEnd":0,"VoiceFileType":3,"VoiceEncodeType":1,"UserVoiceData":"pathToAudioFile","SessionId":"1111122222","RefText":"\'test\'","WorkMode":1,"EvalMode":1,"ScoreCoeff":2.2}';
    req.from_json_string(params);


    client.TransmitOralProcessWithInit(req, function(errMsg, response) {

      if (errMsg) {
        console.log(errMsg);
        return;
      }

      console.log(response.to_json_string());
    });
  }
}

module.exports = SOEController;
