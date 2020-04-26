import { apiBackend } from "./fixed";
import { fetchAuthenticatedHeader } from "./auth";
import * as chalk from "chalk";
import fetch from "node-fetch";
import { errLogger } from "./utils";

export function handleProjectListing(cmdobj) {
    const q = new URLSearchParams();
    q.append("only_deployed", cmdobj.only_deployed);

    fetch([apiBackend, "list"].join("/").concat("?").concat(q.toString()), {
        method: "get",
        headers: fetchAuthenticatedHeader(),
    }).then(res => {
        switch (res.status) {
            case 200:
                return res.json()
                break;

            default:
                throw Error("Internal Server Error");
                break;
        }
    })
        .then(res => {
            return res.data;
        })
        .then(list => {
            console.log(chalk.yellow("=".repeat(50)))
            console.log(chalk.blue("        Project(s) ".concat(cmdobj.only_deployed ? "(Deployed)" : "") ))
            console.log(chalk.yellow("=".repeat(50)))
            console.log()
            if (cmdobj.only_deployed) {
                list.forEach((v, i) => {
                    console.log(i + 1, "\t", chalk.blue(v.hostname))
                })
            } else {
                list.forEach((v, i) => {
                    console.log(i + 1, "\t", chalk.blue(v.hostname), "\t", v.status ? chalk.green("Up") : chalk.grey("Down"))
                })
            }
            console.log("+-".repeat(25))
            console.log(chalk.yellow(list.length, " result(s) found"));
            console.log("-+".repeat(25))

        })
        .catch(errLogger)
}