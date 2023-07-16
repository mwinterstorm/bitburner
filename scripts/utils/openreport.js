/** @param {NS} ns */
export async function main(ns) {
    if (ns.isRunning("utils/report.js","home")) {
        let arr = ns.ps("home")
        let pid = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].filename == "utils/report.js") {
                pid = arr[i].pid
            }
        }
        ns.tail("utils/report.js","home")
        await ns.sleep(100);
        ns.moveTail(0, 0, pid);
        ns.resizeTail(950, 300, pid);
    } else {
        await ns.run("utils/report.js");
    }
}