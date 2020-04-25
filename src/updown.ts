import * as dns from "dns";
import { fetchAuthenticatedHeader } from "./auth";
import * as chalk from "chalk";
import { apiBackend } from "./fixed";
import * as tar from "tar";
import { errLogger } from "./utils";
import * as prompts from "prompts";
import * as fs from "fs";
import fetch from "node-fetch";

export async function handleUp(hostname: string, type?: String) {
    const ttype = type || "regular";
    if (["spa", "regular"].indexOf(ttype.toLocaleLowerCase()) > -1) {
        try {

            hostname = await getDeployableDomain(hostname);
            const [buf, name] = readyFiles();
            const fd = JSON.stringify({
                hostname,
                files: buf.toString("base64")
            });

            fetch([apiBackend, "up"].join("/"), {
                method: "post",
                body: fd
            })
                .then(res => {
                    switch (res.status) {
                        case 200:
                            const gr = chalk.green;
                            console.log(chalk.blue("+-".repeat(25)));

                            console.log(gr("Congratulations site uploaded!!"))
                            console.log(gr("Online at https://".concat(hostname).concat("/")))
                            console.log(chalk.blue("-+".repeat(25)));
                            break;
                        default:
                            return Error("Some internal error, try later");
                    }
                })
                .catch(errLogger);


            console.log(chalk.blue("Uploading site"));
        } catch (error) {
            console.log(chalk.red("Domain Taken or Broken : ", error.message));
        }

    } else {
        console.log(chalk.red("Invalid website type"));
    }
}

const domainRegex = /^[a-z0-9]+[a-z0-9-]*[a-z0-9]+$\.skydive\.me/

function isValidDomain(domain: String): Boolean {
    return domain.match(domainRegex) !== null
}

async function getDeployableDomain(hostname: string): Promise<string> {
    let validDomain = false;
    while (!validDomain) { //Loop until valid domain found or cli terminated 
        if (!isValidDomain(hostname)) {
            return Promise.reject("Invalid Domain name"); //Return from the function as user entered un processable domain name
        } else {
            //lets check for avi
            try {
                let _ = await dns.promises.lookup(hostname)
                console.log(chalk.yellow("Domain is already in use"));
                console.log("Let me recommend you some domain");

                hostname = await fetch([apiBackend, "recommend"].join("/").concat("?hostname=").concat(hostname), {
                    method: "get",
                    headers: fetchAuthenticatedHeader()
                })
                    .then(res => { //Recommendation request chain
                        switch (res.status) {
                            case 200:
                                return res.json();
                            default:
                                console.log(chalk.red("Internal server error, please try later"));
                                process.exit(0);
                        }
                    })
                    .then(res => {
                        return res.data.recommendings; //List of recommendings 
                    })
                    .then(recommendings => {
                        console.log(chalk.yellow("Here are some recommeding(s)"))
                        console.log(chalk.magenta(recommendings.join("\t")))
                        const properties = {
                            hostname: {
                                required: true,
                                type: "string",
                                description: "Domain name : "
                            }
                        }
                        return prompts({
                            type: "text",
                            name: "hostname",
                            message: "Select domain name, you may select from recommedation ? "

                        })
                    })
                    .then(({ hostname }) => {
                        return hostname
                    })


            } catch (err) {
                validDomain = true;
            }






        } //Else ends here
    } //Loop ends here
    return hostname;
} //Function ends here



//readyFiles, readfiles from the current files
function readyFiles(): [Buffer, string] {
    const nw = Date.now();
    const name = ".yu.upload." + nw + ".tar.gz";
    const fstream = fs.createWriteStream(name);
    const cwd = process.cwd(); //Current Working Directory
    console.log(chalk.blue("Compressing... files"))
    tar.c({
        gzip: true
    }, [cwd]).pipe(fstream).close();
    console.log(chalk.blue("Compressed!!"))
    return [Buffer.from(fstream), name];

}





export function handleDown(hostname: String) {
    const json = JSON.stringify({
        hostname //To be send to user
    });

    fetch([apiBackend, "down"].join("/"), {
        method: "post",
        body: json,
        headers: fetchAuthenticatedHeader()
    }).then(res => {
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
    }).then(() => {
        console.log(chalk.green("Success! Your website has been undeployed !!"));
    })
        .catch(errLogger);

}