#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This file contains test server implimentation for testng purposes
var express = require("express");
var tar = require("tar");
var fs = require("fs");
var app = express();
var testPort = 8080;
app.use(express.json()); //Middleware for parsing json object
app.post("/signup", function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    if (email.toString().indexOf("@") == -1 || password.toString().length < 8) {
        res.status(400).send("Invalid Email/Password");
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() === "12345678") {
        res.status(200).send("Please Login wiht given credentials");
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() !== "12345678") {
        res.status(403).send("User already exists");
    }
    else {
        res.status(201).json({
            data: {
                access_token: "somesecretcode"
            }
        });
    }
});
app.post("/login", function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    if (email.toString().indexOf("@") == -1 || password.toString().length < 8) {
        res.status(400).send("Invalid Email/Password");
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() === "12345678") {
        res.status(200).json({
            data: {
                access_token: "somesecretcode",
                email: "dev@gmail.com"
            }
        });
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() !== "12345678") {
        res.status(403).send("Invalid Credentials");
    }
});
app.use(function (req, res, next) {
    var token = req.get("x-access-token");
    if (token === "somesecretcode")
        next();
    else
        res.status(403).send("Invalid Access Token, Please Login Again");
});
app.get("/list", function (req, res) {
    var od = req.query.only_deployed || false;
    var ans = [
        { hostname: "1.falcon.com", deployed: true },
        { hostname: "2.falcon.com", deployed: true },
        { hostname: "3.falcon.com", deployed: false },
        { hostname: "4.falcon.com", deployed: true },
    ];
    res.status(200).json({
        data: od ? ans.filter(function (v, i) { return v.deployed == true; }) : ans
    });
});
app.get("/recommend", function (req, res) {
    var hostname = req.query.hostname;
    var domain = hostname.toString().split(".")[0];
    res.status(200)
        .json({
        data: { recommendings: ["s1", "s2", "s3"].map(function (v) { return domain.concat('-').concat(v); }) }
    });
});
app.post("/down", function (req, res) {
    var hostname = req.body.hostname;
    hostname = hostname.toString();
    console.log(hostname);
    if (hostname === "deployed.site.com") {
        res.status(200);
    }
    else if (hostname === "another.site.com") {
        res.status(401);
    }
    else if (hostname === "undeployed.site.com") {
        res.status(404);
    }
    else {
        res.status(500);
    }
    res.send();
});
app.post("/up", function (req, res) {
    var _a = req.body, hostname = _a.hostname, files = _a.files;
    console.log("Hostname:\t", hostname);
    console.log(files);
    fs.writeFileSync(".testfile.tar.gz", files, { encoding: "base64" });
    tar.t({ file: ".testfile.tar.gz" }).then(console.log);
    res.status(200).end();
});
app.listen(testPort, function () {
    console.log("Listening at 8080...");
});
