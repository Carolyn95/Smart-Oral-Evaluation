'use strict';

const tencentcloud = require('tencentcloud-sdk-nodejs');
const { v1: uuidv1 } = require('uuid');

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

const req = new models.TransmitOralProcessWithInitRequest();

const params = JSON.stringify({
  SeqId: 1,
  IsEnd: 1,
  VoiceFileType: 1,
  VoiceEncodeType: 1,
  UserVoiceData: 'UserVoiceData',
  SessionId: uuidv1(),
  RefText: '保护',
  WorkMode: 0,
  EvalMode: 1,
  ScoreCoeff: 2.5,
  // "ServerType": 1,
});
req.from_json_string(params);


client.TransmitOralProcessWithInit(req, function(errMsg, response) {
  if (errMsg) {
    console.log(errMsg);
    return;
  }
  console.log(response.to_json_string());
});
