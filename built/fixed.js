"use strict";
//This file contains app wide constant
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiBackend = isDevEnv() ? "http://api.gstatic.tech" : "http://api.gstatic.tech";
exports.appName = "";
exports.serviceDomain = isDevEnv() ? "gstatic.tech" : "gstatic.tech";
function isDevEnv() {
    return "YU_DEV_ENV" in process.env;
}
