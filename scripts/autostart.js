/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()

    // start coordinate.js
    await ns.tprint("Starting coordinate.js")
    await ns.run("coordinate.js");
    await ns.sleep(500)

    // start purchase.js
    await ns.tprint("Starting purchase.js")
    await ns.run("purchase.js");
    await ns.sleep(500)

    // start report.js
    await ns.tprint("Starting report.js")
    await ns.run("report.js");
    await ns.sleep(500)

    // start install.js
    await ns.tprint("Starting install.js...")
    await ns.run("install.js");
    await ns.sleep(500)
    await ns.tprint("... waiting for install.js to crawl servers")
    await ns.sleep(5000)

    // start restart.js
    await ns.tprint("Restarting hack.js on purchased servers...")
    await ns.run("restart.js");
    await ns.sleep(500)
    await ns.tprint("... waiting for restart.js to crawl purchased servers")
    await ns.sleep(5000)

    // start trade.js
    await ns.tprint("Starting trade.js")
    await ns.run("trade.js");
    await ns.sleep(500)

    // start rungang.js
    await ns.tprint("Starting rungang.js")
    await ns.run("gangs/rungang.js");
    await ns.sleep(500)

    // start spawn.js and therefore hack.js
    await ns.tprint("Starting hack.js on home server via spawn.js...")
    await ns.tprint("...exiting")
    await ns.spawn("spawn.js",1);
}