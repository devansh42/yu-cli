#!/usr/bin/env node
//Cli entry point

import { Command } from "commander";

import { handleLogin, handleSignup } from "./auth";
import { handleProjectListing } from "./info";
import { handleDown, handleUp } from "./updown";


const program = new Command();


program.version("0.0.1"); //Setting the version



program.command("login")
    .description("Authenticates current user")
    .action(handleLogin);

program.command("signup")
    .description("Signups current user")
    .action(handleSignup);

program.command("list") //List Projects
    .option("-d --only_deployed", " displays only deployed project", false)
    .description("List(s) your deployed projects")
    .action(handleProjectListing);

program.command("up <hostname> [type]") //Deploying Site
    .description("Deploys site at hostname, type specifies whether site is spa (Single Page Application) or regular, default is 'regular'")
    .action(handleUp);

program.command("down <hostname>") //UnDeploying Site
    .description("Undeploys given site")
    .action(handleDown);



program.parse(process.argv); //Parsing parameters