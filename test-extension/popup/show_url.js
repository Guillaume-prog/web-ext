console.log("Hello world");
document.addEventListener("DOMContentLoaded", main);


async function main() {
    // const test = new StorageVariable("storage-test");
    // if (await test.is_empty()) await test.set("Wargh");

    // const storage_container = document.getElementById("storage");
    // storage_container.innerText = await test.get();

    const address_registry = new StorageVariable("address-registry")
    let address_registry_local = await address_registry.get()
    if (address_registry_local == null) address_registry_local = {}


    const loc_container = document.getElementById("url");
    const hostname = await getActiveTabHostname().catch(_err => "Wargh")
    loc_container.innerText = hostname

    const storage_container = document.getElementById("storage");
    let current_address = address_registry_local[hostname]
    if (!current_address) current_address = "None"

    storage_container.innerText = current_address

    document.getElementById("submit-button").addEventListener("click", async e => {
        const address_box = document.getElementById("address-box")
        const address = address_box.value
        // alert("user submitted: " + address)

        // if (!(hostname in address_registry_local)) address_registry_local[hostname] = []
        address_registry_local[hostname] = address

        await address_registry.set(address_registry_local)
    })
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