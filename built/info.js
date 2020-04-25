"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fixed_1 = require("./fixed");
var auth_1 = require("./auth");
var chalk = require("chalk");
var utils_1 = require("./utils");
function handleProjectListing(cmdobj) {
    var q = new URLSearchParams();
    q.append("only_deployed", cmdobj.only_deployed);
    fetch([fixed_1.apiBackend, "list"].join("/").concat("?").concat(q.toString()), {
        method: "get",
        headers: auth_1.fetchAuthenticatedHeader(),
    }).then(function (res) {
        switch (res.status) {
            case 200:
                return res.json();
                break;
            default:
                return Error("Internal Server Error");
                break;
        }
    })
        .then(function (res) {
        return res.data;
    })
        .then(function (list) {
        console.log(chalk.yellow("=".repeat(50)));
        console.log(chalk.blue("        Project(s)             "));
        console.log(chalk.yellow("=".repeat(50)));
        console.log();
        if (cmdobj.only_deployed) {
            list.forEach(function (v, i) {
                console.log(i + 1, "\t", chalk.blue(v.hostname));
            });
        }
        else {
            list.forEach(function (v, i) {
                console.log(i + 1, "\t", chalk.blue(v.hostname), "\t", v.status ? chalk.green("Up") : chalk.grey("Down"));
            });
        }
        console.log("+-".repeat(25));
        console.log(chalk.yellow(list.length, " result(s) found"));
        console.log("-+".repeat(25));
    })
        .catch(utils_1.errLogger);
}
exports.handleProjectListing = handleProjectListing;
