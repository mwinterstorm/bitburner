/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()

    // HACKING & CRAWLING
    await ns.tprint("Starting CENTRAL HACK CO-ORDINATOR...")
    await ns.run("hacks/coordinate.js");
    await ns.sleep(500)
    
    await ns.tprint("Starting REPORT...")
    await ns.run("utils/report.js");
    await ns.sleep(500)

    await ns.tprint("Starting DATACENTRE...")
    await ns.run("hacks/purchase.js");
    await ns.sleep(500)

    await ns.tprint("Starting HACK CRAWL...")
    await ns.run("hacks/install.js");
    await ns.sleep(500)
    await ns.tprint("...waiting to crawl servers...")
    await ns.sleep(5000)

    // GANGS
    await ns.tprint("Starting GANGS...")
    await ns.run("gangs/establishgang.js");
    await ns.sleep(150)
    await ns.tprint("...waiting for gangs...")
    await ns.sleep(12000)

    // STOCK MARKET
    let tradeAPI = 0
    if (ns.stock.hasWSEAccount() && ns.stock.hasTIXAPIAccess()) {
        tradeAPI = 1
        if (ns.stock.has4SData() && ns.stock.has4SDataTIXAPI()) {
            tradeAPI = 2
        }
    }
    if (tradeAPI == 2) {
        await ns.tprint("Starting TRADE...")
        await ns.run("stocks/trade.js");
    } else if (tradeAPI == 1) {
        await ns.tprint("Starting SIMPLE TRADE...")
        await ns.run("stocks/earlytrade.js");
    } else {
        await ns.tprint("Skipping TRADE, no API access...")
    }
    await ns.sleep(500)

    // START SERVER SCRIPTS
    await ns.tprint("Restarting HACKING on DATACENTRE and HOME...")
    await ns.run("hacks/restart.js");
    await ns.sleep(500)
    await ns.tprint("...waiting to crawl DATACENTRE...")
    await ns.sleep(5000)
    await ns.tprint("...exiting")
}