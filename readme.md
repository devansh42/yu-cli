# Yu Cli 
    This is the Cli for Yu Static Site Hosting Service

## Installation
    Install it in just one step 
        npm i -g yucloud-cli
## Build 
    Build this project with npm run build

## Testing: 
    In Order to test this project, first set current environment to development environment
    set YU_DEV_ENV to 1

## Usage: 
    Usage: built [options] [command]

    Options:
        -V, --version         output the version number
        -h, --help            display help for command

    Commands:
        login                 Authenticates current user
        signup                Signups current user
        list [options]        List(s) your deployed projects
        up <hostname> [type]  Deploys site at hostname, type specifies whether site is spa (Single Page Application) or
                                regular, default is 'regular'
        down <hostname>       Undeploys given site
        help [command]        display help for command
            

