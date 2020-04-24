//Cli entry point
const { Command } = require("commander");
const https = require("https");
const fetch = require("node-fetch");
const chalk = require("chalk");
const dns = require("dns");
const prompts = require("prompts");
const fs = require("fs");
const tar = require("tar");
let accessToken = "";
const program = new Command();

const apiBackend = "dejdiede.com"
const appName = "";

const fetchAuthenticatedHeader = () => {
    return { "x-access-token": getAccessToken() };
}
const properties = [ //Authentication prompts properties
    {
        name: "Email",
        required: true,
        type: "email",
        description: "Email: ",
        message: "Please enter valid email"
    },
    {
        name: "Password",
        required: true,
        type: "string",
        description: "Password: ",
        message: "Please enter a strong password"
    }
];


program.version("0.0.1"); //Setting the version

program.command("up <hostname> [type]") //Deploying Site
    .description("Deploys site at hostname, type specifies whether site is spa (Single Page Application) or regular, default is 'regular'")
    .action((hostname, type) => {


    });

program.command("down <hostname>") //UnDeploying Site
    .description("Undeploys given site")
    .action((hostname) => {
        const json = JSON.stringify({
            hostname //To be send to user
        });

        fetch([apiBackend, "down"].join("/"), {
            method: "post",
            data: json,
            headers: fetchAuthenticatedHeader()
        }).then(res => {
            switch (res.status) {
                case "401":
                    return Error("It seems this site doesn't belongs to you");
                    break;
                case "200":
                    return res.json();
                    break;
                default:
                    return Error("Couldn't reach to servers");

            }
        }).then(() => {
            console.log(chalk.green("Success! Your website has been undeployed !!"));
        })
            .catch(errLogger);

    });

program.command("list") //List Projects
    .option("-d --only_deployed", " displays only deployed project", false)
    .description("List(s) your deployed projects")
    .action(cmdobj => {
        const q = new URLSearchParams();
        q.append("only_deployed", cmdobj.only_deployed);

        fetch([apiBackend, "list"].join("/").concat("?").concat(q.toString()), {
            method: "get",
            headers: fetchAuthenticatedHeader(),
        }).then(res => {
            switch (res.status) {
                case "200":
                    return res.json()
                    break;

                default:
                    return Error("Internal Server Error");
                    break;
            }
        })
            .then(res => {
                return res.data;
            })
            .then(list => {
                console.log(chalk.yellow("=".repeat(50)))
                console.log(chalk.blue("        Project(s)             "))
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
    });

program.command("login")
    .description("Authenticates current user")
    .action(() => {
        //Ask for credentials

        prompts.get({ properties }, (err, result) => {
            const { email, password } = result;
            const json = JSON.stringify({ email, password });
            fetch([apiBackend, "login"].join("/"), {
                method: "post",
                data: json,
            }).then(res => {
                switch (res.status) {
                    case "200": //Everything is okay
                        return res.json()
                        break;
                    case "403"://Invalid credentials
                        return Error("Authentiation Failed : Invalid Credentials");
                        break;
                    default:
                        return Error("Internal Server Error");
                        break;
                }
            })
                .then(res => {
                    return res.data;
                })
                .then(data => {
                    console.log("Welcome Again, ", data.email);
                    setAccessToken(data.token);
                })
                .catch(errLogger);
        })
    });

program.command("signup")
    .description("Signups current user")
    .action(() => {
        //Makes new account

        prompts.start();
        prompts.get({ properties }, (err, result) => {
            //Let's signup user
            const { email, password } = result;
            const json = JSON.stringify({ email, password });
            fetch([apiBackend, "signup"].join("/"), {
                method: "post",
                data: json,
            }).then(res => {
                switch (res.status) {
                    case "201":
                        return res.json(); //Everything is perfect
                        break;
                    case "403": //User Already exists but credentials are wrong    
                        return Error("Couldn't make your account : Account already exists, may be it doesn't belongs to you");
                        break;
                    case "200": //Account already exists and belongs to currnet user
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

        })
    })


async function getDeployableDomain(hostname) {
    let validDomain = false;
    const domainRegex = /^[a-z0-9]+[a-z0-9-]*[a-z0-9]+$\.skydive\.me/
    while (!validDomain) {
        if (hostname.match(domainRegex) == null) {
            return Error("Invalid Domain name");
        } else {
            //lets check for avi
            try {
                let _ = await dns.promises.lookup(hostname)
                console.log(chalk.yellow("Domain is already in use"));
                console.log("Let me recommend you some domain");
                fetch([apiBackend, "recommend"].join("/").concat("?hostname=").concat(hostname), {
                    method: "get",
                    headers: fetchAuthenticatedHeader()
                })
                    .then(res => { //Recommendation request chain
                        switch (res.status) {
                            case "200":
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
                        prompts.start();

                        prompts.get({ properties }, (err, result) => {
                            const hostname = result.hostname;
                            if (recommendings.indexOf(hostname) > -1) {
                                //choosen from recommendings

                            }
                        })
                    })
            } catch (err) {
                return hostname; //Can use hostname
            }






        }
    }
}


//Retrives accesstoken either from memory or from file
function getAccessToken() {
    if (accessToken.length == 0) {
        const filename = process.cwd().concat(".access_token");
        try {
            let fc = fs.readFileSync(filename);
            accessToken = fc.toString()

        } catch (err) {
            console.log(chalk.red("Authentication Required !!"))
            process.exit(0); //Exiting app
        }

    }
    return accessToken;
}

function readyFiles() {
    tar.c({
        gzip: true,

    }, process.cwd()).pip
    //   fetch.Request.prototype.
}


function setAccessToken(token) {
    //Sets access token
    const filename = process.cwd().concat(".access_token")
    fs.writeFileSync(filename, token); //Writting token
    accessToken = token;
}


function errLogger(err) {
    console.log(chalk.red(err.message));
}