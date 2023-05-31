import chalk from "chalk";
import fs from "fs";

function fetchLinks(text) {
    const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
    const captures = [...text.matchAll(regex)];
    const result = captures.map((capture) => ({ [capture[1]]: capture[2] }));
    // console.log(result)
    return result.length !== 0 ? result : "no links";
}

function handleError(error) {
    console.log(error);
    throw new Error(chalk.red(error.code, "error on reading file"));
}

async function getLinks(path) {
    try {
        const encoding = "utf-8";
        const text = await fs.promises.readFile(path, encoding);
        return fetchLinks(text);
    } catch (error) {
        handleError(error);
    }
}

// function getFileWithThen(path) {
//     const encoding = "utf-8";
//     fs.promises
//         .readFile(path, encoding)
//         .then((text) => console.log(chalk.green(text)))
//         .catch(handleError);
// }

export default getLinks;
