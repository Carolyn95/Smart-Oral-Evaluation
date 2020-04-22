'use strict';

const Controller = require('egg').Controller;
const tencentcloud = require('tencentcloud-sdk-nodejs');


const SoeClient = tencentcloud.soe.v20180724.Client;
const models = tencentcloud.soe.v20180724.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

const SOE_CONFIG = {
  SecretId: 'AKIDgEYeZ0f8ZjwukSRPaVnfR16vVw6xsH6i',
  SecretKey: 'UifLKT3TdttoU4VLvG0WntiRSFpCPhjg',
  Endpoint: 'soe.tencentcloudapi.com',
  Region: 'ap-shanghai',
};

const cred = new Credential(SOE_CONFIG.SecretId, SOE_CONFIG.SecretKey);
const httpProfile = new HttpProfile();
httpProfile.endpoint = SOE_CONFIG.Endpoint;
const clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
const client = new SoeClient(cred, SOE_CONFIG.Region, clientProfile);

class SOEController extends Controller {
  async transInit () {
    const { ctx } = this;
    const req = new models.TransmitOralProcessWithInitRequest();
    const params = JSON.stringify(ctx.request.body);
    req.from_json_string(params);
    ctx.body = {
      Response: await new Promise(resolve => {
        client.TransmitOralProcessWithInit(req, function (errMsg, response) {
          console.log(errMsg, response);
          if (errMsg) {
            console.log(errMsg);
          }
          resolve(response);
          console.log(response, response.to_json_string());
        });
      }),
    };
  }
}

module.exports = SOEController;
