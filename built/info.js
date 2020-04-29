"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fixed_1 = require("./fixed");
var auth_1 = require("./auth");
var chalk = require("chalk");
var node_fetch_1 = require("node-fetch");
var utils_1 = require("./utils");
function handleProjectListing(cmdobj) {
    var q = new URLSearchParams();
    q.append("only_deployed", cmdobj.only_deployed);
    node_fetch_1.default([fixed_1.apiBackend, "list"].join("/").concat("?").concat(q.toString()), {
        method: "get",
        headers: auth_1.fetchAuthenticatedHeader(),
    }).then(function (res) {
        switch (res.status) {
            case 200:
                return res.json();
                break;
            case 403:
                throw Error("Authentication Failed, Please Login again ");
            default:
                throw Error("Internal Server Error");
                break;
        }
    })
        .then(function (list) {
        console.log(chalk.yellow("=".repeat(50)));
        console.log(chalk.blue("        Project(s) ".concat(cmdobj.only_deployed ? "(Deployed)" : "")));
        console.log(chalk.yellow("=".repeat(50)));
        console.log();
        if (cmdobj.only_deployed) {
            list.forEach(function (v, i) {
                console.log(i + 1, "\t", chalk.blue(v.hostname));
            });
        }
        else {
            list.forEach(function (v, i) {
                console.log(i + 1, "\t", chalk.blue(v.hostname), "\t", v.deployed ? chalk.green("Up") : chalk.grey("Down"));
            });
        }
        console.log("+-".repeat(25));
        console.log(chalk.yellow(list.length, " result(s) found"));
        console.log("-+".repeat(25));
    })
        .catch(utils_1.errLogger);
}
exports.handleProjectListing = handleProjectListing;
