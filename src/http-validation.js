function handleError(error) {
    if (error.cause.code === "ENOTFOUND") {
        return "NOT FOUND";
    } else {
        return "unknown error";
    }
}

function checkStatus(urls) {
    const arrStatus = Promise.all(
        urls.map(async (url) => {
            try {
                const response = await fetch(url, { method: "HEAD" });
                return `${response.status} - ${response.statusText}`;
            } catch (error) {
                return handleError(error);
            }
        })
    );
    return arrStatus;
}

function fetchUrls(links) {
    return links.map((objLink) => Object.values(objLink).join());
}

export default async function validList(links) {
    const urls = fetchUrls(links);
    const arrStatus = await checkStatus(urls);
    return links.map((link, index) => ({
        ...link,
        status: arrStatus[index],
    }));
}
