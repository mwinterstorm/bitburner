/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    ns.tail()
    await ns.sleep(100)
    ns.moveTail(0, 0)
    ns.resizeTail(850, 300)
    var maxwait = 500
    while (true) {
        wait = Math.random() * maxwait;
        let report = ns.readPort(8);
        if (report == "NULL PORT DATA") {
            await ns.sleep(wait)
        } else {
            await ns.print(report)
            await ns.sleep(wait)
        }
    }
}
