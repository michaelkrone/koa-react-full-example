"use strict";
const IO = require("koa-socket");
const co = require("co");
const mongoose = require("mongoose");

/**
 * The koa socket instance that will be attached to the app as app.io
 */
const io = new IO();

module.exports = function (app, config, passport) {
  if (!config.socket || !config.socket.models) {
    return;
  }
   
  config.socket.models.forEach(name => {
   let model = mongoose.model(name);
   
   ['save', 'remove'].forEach(e => {
     model.schema.post(e, emitEvent(name, e));
   });
  });

  function emitEvent(name, e) {
    return function (doc) {
      io.broadcast(`${name}:${e}`, doc);
    };
  }
  
  io.attach(app);
};
