/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    await ns.sleep(100);
    ns.moveTail(0, 0);
    ns.resizeTail(850, 300);
    var maxwait = 500;
    var waitTimer = 0
    const earningsReportPeriod = 30000 // in seconds * 1000
    const aveEarnPeriod = 15 // in minutes
    var earnArr = [];
    while (true) {
        let wait = Math.random() * maxwait;
        let report = ns.readPort(8);
        if (report == "NULL PORT DATA") {
            await ns.sleep(wait)
            waitTimer = waitTimer + wait
        } else {
            await ns.print(report)
            await ns.sleep(wait)
            waitTimer = waitTimer + wait
        }
        if (waitTimer >= earningsReportPeriod) {
            let dividends = ns.readPort(2);
            if (dividends == "NULL PORT DATA") {    
                dividends = 0;
            }
            let earnings = ns.readPort(1)
            await ns.tryWritePort(1, 0)
            if (earnings != "NULL PORT DATA") {    
                let eps = ( earnings / ( waitTimer / 1000 ) ) + dividends
                let totalEarn = 0
                let elength = (aveEarnPeriod * 60 * 1000) / earningsReportPeriod
                if (earnArr.length <= elength) {
                    earnArr.push(earnings)
                    for (let e = 0; e < earnArr.length; e++) {
                        totalEarn = earnArr[e] + totalEarn
                    }
                } else {
                    earnArr.shift()
                    earnArr.push(earnings)
                    for (let e = 0; e < earnArr.length; e++) {
                        totalEarn = earnArr[e] + totalEarn
                    }
                }
                let aveEarn =  ((totalEarn / earnArr.length) / (waitTimer / 1000) ) + dividends
                let time = getTime()
                let earningsReport = time + " - SUCCESS! EPS: last " + ns.formatNumber((waitTimer / 1000 ), 0, 0, true) + "s = $" + ns.formatNumber(eps, 4, 1000, true) + "/s; average last " + ns.formatNumber(((waitTimer / 1000 ) * earnArr.length) / 60, 1, 1000) + "mins = $" + ns.formatNumber(aveEarn, 4, 1000, true) + "/s (excluding GANGS)"
                await ns.print(earningsReport)
            }
            waitTimer = 0
        }
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