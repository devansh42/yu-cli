#!/usr/bin/env node
"use strict";
//Cli entry point
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var auth_1 = require("./auth");
var info_1 = require("./info");
var updown_1 = require("./updown");
var program = new commander_1.Command();
program.version("1.1.1"); //Setting the version
program.command("login")
    .description("Authenticates current user")
    .action(auth_1.handleLogin);
program.command("signup")
    .description("Signups current user")
    .action(auth_1.handleSignup);
program.command("list") //List Projects
    .option("-d --only_deployed", " displays only deployed project", false)
    .description("List(s) your deployed projects")
    .action(info_1.handleProjectListing);
program.command("up <hostname> [type]") //Deploying Site
    .description("Deploys site at hostname, type specifies whether site is spa (Single Page Application) or regular, default is 'regular'")
    .action(updown_1.handleUp);
program.command("down <hostname>") //UnDeploying Site
    .description("Undeploys given site")
    .action(updown_1.handleDown);
program.parse(process.argv); //Parsing parameters
