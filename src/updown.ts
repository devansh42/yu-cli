import { fetchAuthenticatedHeader, fetchMultipartAuthenticatedHeader } from "./auth";
import * as chalk from "chalk";
import { serviceDomain, apiBackend } from "./fixed";
import * as tar from "tar";
import { errLogger } from "./utils";
import * as prompts from "prompts";
import * as fs from "fs";
import fetch from "node-fetch";
import { join } from "path";
import { tmpdir } from "os";
import * as FormData from "form-data";
import { extname } from "path";
export async function handleUp(hostname: string, type?: String) {
    const ttype = type || "regular";
    if (["spa", "regular"].indexOf(ttype.toLocaleLowerCase()) > -1) {
        try {

            hostname = await getDeployableDomain(hostname);
            const name = readyFiles();
            const cont = fs.readFileSync(name);
            const fd = new FormData();

            fd.append("files", cont, {
                filename: extname(name),
                filepath: name,
                contentType: "application/octet-stream"
            });

            fd.append("hostname", hostname);
            fd.append("type", ttype.toLocaleLowerCase());
            fd.append("wd", process.cwd())

            fetch([apiBackend, "up"].join("/"), {
                method: "post",
                body: fd,
                headers: fetchMultipartAuthenticatedHeader()
            })
                .then(res => {
                    switch (res.status) {
                        case 200:
                            const gr = chalk.green;
                            console.log(chalk.blue("+-".repeat(25)));

                            console.log(gr("Congratulations site uploaded!!"))
                            console.log(gr("Online at https://".concat(hostname).concat("/")))
                            console.log(chalk.blue("-+".repeat(25)));
                            return name;
                            break;
                        case 400:
                            throw Error("Invalid Request : It seems you just sent invalid parameters in request")
                            break;
                        case 403:
                            throw Error("Authentication Failed: Please Login")
                        default:
                            throw Error("Some internal error, try later");
                    }
                })
                .then((tempfilename: string) => {
                    fs.unlinkSync(tempfilename);
                })
                .catch(errLogger);


            console.log(chalk.blue("Uploading site.."));
        } catch (error) {
            console.log(chalk.red("Domain Taken or Broken : ", error.message));
        }

    } else {
        console.log(chalk.red("Invalid website type"));
    }
}

const subDomainRegex = /^[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?$/





function isValidDomain(domain: String): Boolean {
    //return domain.match(domainRegex) !== null
    if (domain.endsWith(serviceDomain)) {
        if (domain.split(/\./).length == 3) {
            const s = domain.split(/\./)[0];

            return subDomainRegex.test(s);

        } else return false
    } else return false;
}

async function getDeployableDomain(hostname: string): Promise<string> {
    let validDomain = false;
    while (!validDomain) { //Loop until valid domain found or cli terminated 
        if (!isValidDomain(hostname)) {
            throw Error("Invalid Domain name, use domain like test.gstatic.tech"); //Return from the function as user entered un processable domain name
        } else {
            //lets check for avi
            try {
                let exists = await isHostExists(hostname);
                if (exists) {
                    console.log(chalk.yellow("Domain is already in use"));
                    console.log("Let me recommend you some domain");

                    hostname = await fetch([apiBackend, "recommend"].join("/").concat("?hostname=").concat(hostname), {
                        method: "get",
                        headers: fetchAuthenticatedHeader()
                    })
                        .then(res => { //Recommendation request chain
                            switch (res.status) {
                                case 200:
                                    return res.json()
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
                        .then(recommendings => {
                            console.log(chalk.yellow("Here are some recommeding(s)"))
                            console.log(chalk.green(recommendings.join("\t")))

                            return prompts({
                                type: "text",
                                name: "hostname",
                                message: "Select domain name, you may select from recommedation ? "

                            }, {
                                onCancel: () => { process.exit(0) }
                            })
                        })
                        .then(({ hostname }) => {
                            return hostname.concat(".").concat(serviceDomain);
                        })
                        .catch(err => {
                            console.log(chalk.red("Couldn't Complete request : ", err.message))
                            process.exit(0);

                        })
                } else {
                    validDomain = true
                }

            } catch (err) {
                console.log(chalk.red("Couldn't Complete request : ", err.message))
                process.exit(0);
            }






        } //Else ends here
    } //Loop ends here
    return hostname;
} //Function ends here



//readyFiles, readfiles from the current files
function readyFiles(): string {
    const nw = Date.now();
    const name = join(tmpdir(), ".yu.upload." + nw + ".tar.gz");
    // const fstream = fs.createWriteStream(name);
    const cwd = process.cwd(); //Current Working Directory
    console.log(chalk.blue("Compressing... files"))
    tar.c({
        sync: true,
        file: name,
        gzip: true,

    }, [cwd])
    console.log(chalk.blue("Compressed!!"))
    return name;

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
    }).then(() => {
        console.log(chalk.green("Success! Your website has been undeployed !!"));
    })
        .catch(errLogger);

}


async function isHostExists(hostname: string) {
    const r = await fetch([apiBackend, "host"].join("/").concat("?hostname=").concat(hostname), {
        method: "get",
        headers: fetchAuthenticatedHeader()
    })
    switch (r.status) {
        case 400:
            throw Error("Invalid Domain name");
            break;
        case 403:
            throw Error("Authentication Failed : Login Again");
        case 200:
            return true;
        case 404:
            return false;
        default:
            throw Error("Internal server error")

    }
}