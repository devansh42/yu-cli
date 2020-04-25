//This file contains code for Authectication mechanism i.e. Signup And Login

import * as prompts from "prompts";
import * as fs from "fs";
import * as chalk from "chalk";
import { apiBackend } from "./fixed";
import { errLogger } from "./utils";
import { homedir } from 'os';
import { join } from "path";
let accessToken = "" //holds accestoken in memory

export const fetchAuthenticatedHeader = () => {
    return { "x-access-token": getAccessToken() };
}
const tokenFile = join(homedir(), ".access_token");

export function setAccessToken(token: string) {
    //Sets access token

    fs.writeFileSync(tokenFile, token); //Writting token
    accessToken = token;
}

//Retrives accesstoken either from memory or from file
function getAccessToken() {
    if (accessToken.length == 0) {
        try {
            let fc = fs.readFileSync(tokenFile);
            accessToken = fc.toString()

        } catch (err) {
            console.log(chalk.red("Authentication Required !!"))
            process.exit(0); //Exiting app
        }

    }
    return accessToken;
}



export async function handleLogin() {
    const result = await prompts([
        {
            name: "email",

            type: "text",
            message: "Email ? "
        },
        {
            name: "password",

            type: "password",
            message: "Password ? "
        }]
    );

    const { email, password } = result;
    const json = JSON.stringify({ email, password });

    fetch([apiBackend, "login"].join("/"), {
        method: "post",
        body: json,
    }).then(res => {
        switch (res.status) {
            case 200: //Everything is okay
                return res.json()
                break;
            case 403://Invalid credentials
                return Error("Authentiation Failed : Invalid Credentials");
                break;
            default:
                return Error("Internal Server Error");
                break;
        }
    }).then(res => {
        return res.data;
    })
        .then(data => {
            console.log("Welcome Again, ", data.email);
            setAccessToken(data.token);
        })
        .catch(errLogger);

}

export async function handleSignup() {

    //Let's signup user
    const result = await prompts([
        {
            name: "email",

            type: "text",
            message: "Email ? "
        },
        {
            name: "password",

            type: "password",
            message: "Password ? "
        }]
    );

    const { email, password } = result;
    const json = JSON.stringify({ email, password });
    fetch([apiBackend, "signup"].join("/"), {
        method: "post",
        body: json,
    }).then(res => {
        switch (res.status) {
            case 201:
                return res.json(); //Everything is perfect
                break;
            case 403: //User Already exists but credentials are wrong    
                return Error("Couldn't make your account : Account already exists, may be it doesn't belongs to you");
                break;
            case 200: //Account already exists and belongs to currnet user
                console.log(chalk.yellow("!! It seems you already have an account with this mail, please login"));
                break;
            default:
                return Error("Internal server error");
        }
    })
        .then(res => {
            return res.data;
        })
        .then(data => {
            console.log(chalk.green("Account Successfully Created!!"))
            setAccessToken(data.access_token);
        })
        .catch(errLogger)

}

