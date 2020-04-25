import * as chalk from "chalk";

export function errLogger(err: Error) {
    console.log(chalk.red(err.message));
}