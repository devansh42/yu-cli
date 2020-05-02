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
var auth_1 = require("./auth");
var chalk = require("chalk");
var fixed_1 = require("./fixed");
var tar = require("tar");
var utils_1 = require("./utils");
var prompts = require("prompts");
var fs = require("fs");
var node_fetch_1 = require("node-fetch");
var path_1 = require("path");
var os_1 = require("os");
function handleUp(hostname, type) {
    return __awaiter(this, void 0, void 0, function () {
        var ttype, name_1, buf, fd, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ttype = type || "regular";
                    if (!(["spa", "regular"].indexOf(ttype.toLocaleLowerCase()) > -1)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getDeployableDomain(hostname)];
                case 2:
                    hostname = _a.sent();
                    name_1 = readyFiles();
                    buf = fs.readFileSync(name_1, { encoding: "base64" });
                    fd = JSON.stringify({
                        hostname: hostname,
                        type: ttype.toLocaleLowerCase(),
                        files: buf,
                        wd: process.cwd()
                    });
                    node_fetch_1.default([fixed_1.apiBackend, "up"].join("/"), {
                        method: "post",
                        body: fd,
                        headers: auth_1.fetchAuthenticatedHeader()
                    })
                        .then(function (res) {
                        switch (res.status) {
                            case 200:
                                var gr = chalk.green;
                                console.log(chalk.blue("+-".repeat(25)));
                                console.log(gr("Congratulations site uploaded!!"));
                                console.log(gr("Online at https://".concat(hostname).concat("/")));
                                console.log(chalk.blue("-+".repeat(25)));
                                return name_1;
                                break;
                            case 403:
                                throw Error("Authentication Failed: Please Login");
                            default:
                                throw Error("Some internal error, try later");
                        }
                    })
                        .then(function (tempfilename) {
                        fs.unlinkSync(tempfilename);
                    })
                        .catch(utils_1.errLogger);
                    console.log(chalk.blue("Uploading site"));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(chalk.red("Domain Taken or Broken : ", error_1.message));
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.log(chalk.red("Invalid website type"));
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handleUp = handleUp;
var subDomainRegex = /^[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?$/;
function isValidDomain(domain) {
    //return domain.match(domainRegex) !== null
    if (domain.endsWith(fixed_1.serviceDomain)) {
        if (domain.split(/\./).length == 3) {
            var s = domain.split(/\./)[0];
            return subDomainRegex.test(s);
        }
        else
            return false;
    }
    else
        return false;
}
function getDeployableDomain(hostname) {
    return __awaiter(this, void 0, void 0, function () {
        var validDomain, exists, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validDomain = false;
                    _a.label = 1;
                case 1:
                    if (!!validDomain) return [3 /*break*/, 9];
                    if (!!isValidDomain(hostname)) return [3 /*break*/, 2];
                    throw Error("Invalid Domain name"); //Return from the function as user entered un processable domain name
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, isHostExists(hostname)];
                case 3:
                    exists = _a.sent();
                    if (!exists) return [3 /*break*/, 5];
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
                                case 400:
                                    throw Error("Broken Request : Unvalid Hostname");
                                    break;
                                case 403:
                                    throw Error("Authentication Required!");
                                    break;
                                default:
                                    console.log(chalk.red("Internal server error, please try later"));
                                    process.exit(0);
                            }
                        })
                            .then(function (recommendings) {
                            console.log(chalk.yellow("Here are some recommeding(s)"));
                            console.log(chalk.magenta(recommendings.join("\t")));
                            return prompts({
                                type: "text",
                                name: "hostname",
                                message: "Select domain name, you may select from recommedation ? "
                            }, {
                                onCancel: function () { process.exit(0); }
                            });
                        })
                            .then(function (_a) {
                            var hostname = _a.hostname;
                            return hostname.concat(".").concat(fixed_1.serviceDomain);
                        })
                            .catch(function (err) {
                            console.log(chalk.red("Couldn't Complete request : ", err.message));
                            process.exit(0);
                        })];
                case 4:
                    hostname = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    validDomain = true;
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.log(chalk.red("Couldn't Complete request : ", err_1.message));
                    process.exit(0);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 1];
                case 9: //Loop ends here
                return [2 /*return*/, hostname];
            }
        });
    });
} //Function ends here
//readyFiles, readfiles from the current files
function readyFiles() {
    var nw = Date.now();
    var name = path_1.join(os_1.tmpdir(), ".yu.upload." + nw + ".tar.gz");
    // const fstream = fs.createWriteStream(name);
    var cwd = process.cwd(); //Current Working Directory
    console.log(chalk.blue("Compressing... files"));
    tar.c({
        sync: true,
        file: name,
        gzip: true,
    }, [cwd]);
    console.log(chalk.blue("Compressed!!"));
    return name;
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
                throw Error("It seems this site doesn't belongs to you");
                break;
            case 404:
                throw Error("Site is not deployed either");
            case 200:
                return;
                break;
            default:
                throw Error("Couldn't reach to servers");
        }
    }).then(function () {
        console.log(chalk.green("Success! Your website has been undeployed !!"));
    })
        .catch(utils_1.errLogger);
}
exports.handleDown = handleDown;
function isHostExists(hostname) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default([fixed_1.apiBackend, "host"].join("/").concat("?hostname=").concat(hostname), {
                        method: "get",
                        headers: auth_1.fetchAuthenticatedHeader()
                    })];
                case 1:
                    r = _a.sent();
                    switch (r.status) {
                        case 400:
                            throw Error("Invalid Domain name");
                            break;
                        case 403:
                            throw Error("Authentication Failed : Login Again");
                        case 200:
                            return [2 /*return*/, true];
                        case 404:
                            return [2 /*return*/, false];
                        default:
                            throw Error("Internal server error");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
