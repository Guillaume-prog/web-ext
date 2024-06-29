console.log("Hello world");
document.addEventListener("DOMContentLoaded", main);


async function main() {
    const test = new StorageVariable("storage-test");
    if (await test.is_empty()) await test.set("Wargh");

    const storage_container = document.getElementById("storage");
    storage_container.innerText = await test.get();


    const loc_container = document.getElementById("url");
    getActiveTabHostname().then(hostname => {
        loc_container.innerText = hostname;
    }).catch(err => {
        console.err(err);
        loc_container.innerText = "Wargh";
    });
}


async function getActiveTabHostname() {
    const tabs = await browser.tabs.query({ active: true });
    if (tabs.length == 0) throw new Error("No active tab");

    const url = new URL(tabs[0].url);
    return (url.hostname == "") ? url.href : url.hostname;
}





class StorageVariable {
    constructor(name) {
        this.name = name;
    }

    async is_empty() {
        return (await this.get()) == null;
    }

    async get() {
        const value = await browser.storage.local.get(this.name);
        const is_empty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

        return is_empty(value) ? null : value[this.name];
    }

    async set(value) {
        let obj = {};
        obj[this.name] = value;

        await browser.storage.local.set(obj);
    }
}