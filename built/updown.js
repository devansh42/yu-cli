"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dns = require("dns");
var auth_1 = require("./auth");
var chalk = require("chalk");
var fixed_1 = require("./fixed");
var tar = require("tar");
var utils_1 = require("./utils");
var prompts = require("prompts");
var fs = require("fs");
var node_fetch_1 = require("node-fetch");
function handleUp(hostname, type) {
    return __awaiter(this, void 0, void 0, function () {
        var ttype, _a, buf, name_1, fd, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ttype = type || "regular";
                    if (!(["spa", "regular"].indexOf(ttype.toLocaleLowerCase()) > -1)) return [3 /*break*/, 5];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getDeployableDomain(hostname)];
                case 2:
                    hostname = _b.sent();
                    _a = readyFiles(), buf = _a[0], name_1 = _a[1];
                    fd = JSON.stringify({
                        hostname: hostname,
                        files: buf.toString("base64")
                    });
                    node_fetch_1.default([fixed_1.apiBackend, "up"].join("/"), {
                        method: "post",
                        body: fd
                    })
                        .then(function (res) {
                        switch (res.status) {
                            case 200:
                                var gr = chalk.green;
                                console.log(chalk.blue("+-".repeat(25)));
                                console.log(gr("Congratulations site uploaded!!"));
                                console.log(gr("Online at https://".concat(hostname).concat("/")));
                                console.log(chalk.blue("-+".repeat(25)));
                                break;
                            default:
                                return Error("Some internal error, try later");
                        }
                    })
                        .catch(utils_1.errLogger);
                    console.log(chalk.blue("Uploading site"));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.log(chalk.red("Domain Taken or Broken : ", error_1.message));
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.log(chalk.red("Invalid website type"));
                    _b.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handleUp = handleUp;
var domainRegex = /^[a-z0-9]+[a-z0-9-]*[a-z0-9]+$\.skydive\.me/;
function isValidDomain(domain) {
    return domain.match(domainRegex) !== null;
}
function getDeployableDomain(hostname) {
    return __awaiter(this, void 0, void 0, function () {
        var validDomain, _, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validDomain = false;
                    _a.label = 1;
                case 1:
                    if (!!validDomain) return [3 /*break*/, 7];
                    if (!!isValidDomain(hostname)) return [3 /*break*/, 2];
                    return [2 /*return*/, Promise.reject("Invalid Domain name")]; //Return from the function as user entered un processable domain name
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, dns.promises.lookup(hostname)];
                case 3:
                    _ = _a.sent();
                    console.log(chalk.yellow("Domain is already in use"));
                    console.log("Let me recommend you some domain");
                    return [4 /*yield*/, node_fetch_1.default([fixed_1.apiBackend, "recommend"].join("/").concat("?hostname=").concat(hostname), {
                            method: "get",
                            headers: auth_1.fetchAuthenticatedHeader()
                        })
                            .then(function (res) {
                            switch (res.status) {
                                case 200:
                                    return res.json();
                                default:
                                    console.log(chalk.red("Internal server error, please try later"));
                                    process.exit(0);
                            }
                        })
                            .then(function (res) {
                            return res.data.recommendings; //List of recommendings 
                        })
                            .then(function (recommendings) {
                            console.log(chalk.yellow("Here are some recommeding(s)"));
                            console.log(chalk.magenta(recommendings.join("\t")));
                            var properties = {
                                hostname: {
                                    required: true,
                                    type: "string",
                                    description: "Domain name : "
                                }
                            };
                            return prompts({
                                type: "text",
                                name: "hostname",
                                message: "Select domain name, you may select from recommedation ? "
                            });
                        })
                            .then(function (_a) {
                            var hostname = _a.hostname;
                            return hostname;
                        })];
                case 4:
                    hostname = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    validDomain = true;
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7: //Loop ends here
                return [2 /*return*/, hostname];
            }
        });
    });
} //Function ends here
//readyFiles, readfiles from the current files
function readyFiles() {
    var nw = Date.now();
    var name = ".yu.upload." + nw + ".tar.gz";
    var fstream = fs.createWriteStream(name);
    var cwd = process.cwd(); //Current Working Directory
    console.log(chalk.blue("Compressing... files"));
    tar.c({
        gzip: true
    }, [cwd]).pipe(fstream).close();
    console.log(chalk.blue("Compressed!!"));
    return [Buffer.from(fstream), name];
}
function handleDown(hostname) {
    var json = JSON.stringify({
        hostname: hostname //To be send to user
    });
    node_fetch_1.default([fixed_1.apiBackend, "down"].join("/"), {
        method: "post",
        body: json,
        headers: auth_1.fetchAuthenticatedHeader()
    }).then(function (res) {
        switch (res.status) {
            case 401:
                return Error("It seems this site doesn't belongs to you");
                break;
            case 200:
                return res.json();
                break;
            default:
                return Error("Couldn't reach to servers");
        }
    }).then(function () {
        console.log(chalk.green("Success! Your website has been undeployed !!"));
    })
        .catch(utils_1.errLogger);
}
exports.handleDown = handleDown;
