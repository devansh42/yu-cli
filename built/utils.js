"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
function errLogger(err) {
    console.log(chalk.red(err.message));
}
exports.errLogger = errLogger;
