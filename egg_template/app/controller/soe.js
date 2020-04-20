'use strict';

const Controller = require('egg').Controller;

class SOEController extends Controller {
  async transInit() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
}

module.exports = SOEController;
