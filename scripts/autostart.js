/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()

    // GET INFO
    var info = ns.getPlayer();

    // start coordinate.js
    await ns.tprint("Starting CENTRAL HACK CO-ORDINATOR...")
    await ns.run("coordinate.js");
    await ns.sleep(500)

    // start purchase.js
    await ns.tprint("Starting DATACENTRE...")
    await ns.run("purchase.js");
    await ns.sleep(500)

    // start report.js
    await ns.tprint("Starting REPORT...")
    await ns.run("report.js");
    await ns.sleep(500)

    // start install.js
    await ns.tprint("Starting HACK CRAWL...")
    await ns.run("install.js");
    await ns.sleep(500)
    await ns.tprint("... waiting to crawl servers")
    await ns.sleep(5000)

    // start trade.js
    let tradeAPI = false
    if (info.hasTixApiAccess && info.hasWseAccount) { 
        if (info.has4SDataTixApi && info.has4SData) {
            tradeAPI = true
        }
    }
    if (tradeAPI) {
        await ns.tprint("Starting TRADE...")
        await ns.run("trade.js");
    } else {
        await ns.tprint("Skipping TRADE, no API access...")
    }
    await ns.sleep(500)

    // start rungang.js
    await ns.tprint("Starting GANGS")
    await ns.run("gangs/establishgang.js");
    await ns.sleep(10000)

    // start restart.js
    await ns.tprint("Restarting HACKING on DATACENTRE and HOME...")
    await ns.run("restart.js");
    await ns.sleep(500)
    await ns.tprint("... waiting to crawl DATACENTRE")
    await ns.sleep(5000)
    await ns.tprint("...exiting")
}