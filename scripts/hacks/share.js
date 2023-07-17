/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()
    while (true) {
        await ns.share()
        let time = getTime()
        let sharePower = ns.getSharePower() - 1
        let report = time + " - Reputation Gain: " + ns.formatPercent(sharePower)
        ns.print(report)
        if (Math.random() > 0.95) {
            // ns.tryWritePort(8, report)
        }
        await ns.clearPort(9);
        ns.tryWritePort(9, sharePower)
    }
}

function getTime() {
    const d = new Date();
    let hrs = d.getHours();
    let hours = hrs;
    if (hrs <= 9) { hours = "0" + hrs; }
    let min = d.getMinutes();
    let minutes = min;
    if (min <= 9) { minutes = "0" + min; }
    let sec = d.getSeconds();
    let seconds = sec;
    if (sec <= 9) { seconds = "0" + sec; }
    let formattedTime = hours + ':' + minutes + ':' + seconds;
    return formattedTime
}