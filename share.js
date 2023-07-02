/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()
    while (true) {
        await ns.share()
        let report = "Reputation Gain: " + ns.formatPercent(ns.getSharePower() - 1)
        ns.print(report)
        if (Math.random() > 0.95) {
            ns.tryWritePort(8, report)
        }
    }
}