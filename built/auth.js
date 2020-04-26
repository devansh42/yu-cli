"use strict";
//This file contains code for Authectication mechanism i.e. Signup And Login
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
var prompts = require("prompts");
var fs = require("fs");
var chalk = require("chalk");
var fixed_1 = require("./fixed");
var utils_1 = require("./utils");
var os_1 = require("os");
var path_1 = require("path");
var node_fetch_1 = require("node-fetch");
var accessToken = ""; //holds accestoken in memory
exports.fetchAuthenticatedHeader = function () {
    return {
        "x-access-token": getAccessToken(),
        "content-type": "application/json"
    };
};
exports.fetchUnAuthenticateHeader = function () {
    return {
        "content-type": "application/json"
    };
};
var tokenFile = path_1.join(os_1.homedir(), ".access_token");
function setAccessToken(token) {
    //Sets access token
    fs.writeFileSync(tokenFile, token); //Writting token
    accessToken = token;
}
exports.setAccessToken = setAccessToken;
//Retrives accesstoken either from memory or from file
function getAccessToken() {
    if (accessToken.length == 0) {
        try {
            var fc = fs.readFileSync(tokenFile);
            accessToken = fc.toString();
        }
        catch (err) {
            console.log(chalk.red("Authentication Required !!"));
            process.exit(0); //Exiting app
        }
    }
    return accessToken;
}
function handleLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var result, email, password, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompts([
                        {
                            name: "email",
                            type: "text",
                            message: "Email ? "
                        },
                        {
                            name: "password",
                            validate: function (password) { return password.length < 8 ? "Password should be of atleast 8 characters" : true; },
                            type: "password",
                            message: "Password ? "
                        }
                    ], {
                        onCancel: function () { process.exit(0); }
                    })];
                case 1:
                    result = _a.sent();
                    email = result.email, password = result.password;
                    json = JSON.stringify({ email: email, password: password });
                    node_fetch_1.default([fixed_1.apiBackend, "login"].join("/"), {
                        method: "post",
                        body: json,
                        headers: exports.fetchUnAuthenticateHeader()
                    }).then(function (res) {
                        switch (res.status) {
                            case 200: //Everything is okay
                                return res.json();
                                break;
                            case 403: //Invalid credentials
                                throw Error("Authentiation Failed : Invalid Credentials");
                                break;
                            case 400:
                                throw Error("Invalid Email/Password");
                                break;
                            default:
                                throw Error("Internal Server Error");
                                break;
                        }
                    }).then(function (res) {
                        return res.data;
                    })
                        .then(function (data) {
                        console.log("Welcome Again, ", data.email);
                        setAccessToken(data.access_token);
                    })
                        .catch(utils_1.errLogger);
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleLogin = handleLogin;
function handleSignup() {
    return __awaiter(this, void 0, void 0, function () {
        var result, email, password, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompts([
                        {
                            name: "email",
                            type: "text",
                            message: "Email ? "
                        },
                        {
                            name: "password",
                            validate: function (password) { return password.length < 8 ? "Password should be of atleast 8 characters" : true; },
                            type: "password",
                            message: "Password ? "
                        }
                    ], {
                        onCancel: function () { process.exit(0); }
                    })];
                case 1:
                    result = _a.sent();
                    email = result.email, password = result.password;
                    json = JSON.stringify({ email: email, password: password });
                    node_fetch_1.default([fixed_1.apiBackend, "signup"].join("/"), {
                        method: "post",
                        body: json,
                        headers: exports.fetchUnAuthenticateHeader()
                    }).then(function (res) {
                        switch (res.status) {
                            case 201:
                                return res.json(); //Everything is perfect
                                break;
                            case 400:
                                throw Error("Invalid Email/Password");
                                break;
                            case 403: //User Already exists but credentials are wrong    
                                throw Error("Couldn't make your account : Account already exists, may be it doesn't belongs to you");
                                break;
                            case 200: //Account already exists and belongs to currnet user
                                console.log(chalk.yellow("!! It seems you already have an account with this mail, please login"));
                                process.exit(0);
                                break;
                            default:
                                throw Error("Internal server error");
                        }
                    })
                        .then(function (res) {
                        return res.data;
                    })
                        .then(function (data) {
                        console.log(chalk.green("Account Successfully Created!!"));
                        setAccessToken(data.access_token);
                    })
                        .catch(utils_1.errLogger);
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleSignup = handleSignup;
