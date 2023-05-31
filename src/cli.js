#!/usr/bin/env node

import chalk from "chalk";
import getLinks from "./file-reader.js";
import fs from "fs";
import validList from "./http-validation.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { validate } from "./path-validation.js";

async function log(path, result, shouldValid) {
    if (shouldValid) {
        console.log(chalk.green("valid link list"), chalk.yellow(path));
        console.log(await validList(result));
    } else {
        console.log(chalk.green("link list"), chalk.yellow(path));
        console.log(result);
    }
}

function processDirectory(dirPath, shouldValid) {
    fs.promises
        .readdir(dirPath)
        .then((files) =>
            files.forEach((fileName) =>
                processFile(`${dirPath}/${fileName}`, shouldValid)
            )
        );
}

function processFile(filePath, shouldValid) {
    getLinks(filePath).then((result) => log(filePath, result, shouldValid));
}

function processText(path, shouldValid) {
    validate(path)
        .ifInvalid(processError)
        .ifValid((path, stats) => processStuff(path, stats, shouldValid));
}

function processError(path, error) {
    if (error.code === "ENOENT") {
        console.log(chalk.red(`${path} 'no such file or directory'`));
    }
}

function processStuff(stuffPath, stuff, shouldValid) {
    if (stuff.isFile()) {
        processFile(stuffPath, shouldValid);
    } else if (stuff.isDirectory()) {
        processDirectory(stuffPath, shouldValid);
    } else {
        console.log("unknown alien stuff");
    }
}

/**
 * npm run cli -- --path ./arquivos/texto.md --should-valid
 */
function init() {
    const args = yargs(hideBin(process.argv)).argv;
    processText(args.path, args.shouldValid);
}

init();
