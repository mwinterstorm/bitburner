/** @param {NS} ns */
export async function main(ns) {
    ns.tail();

    const fraud = "corp/repurchaseFraud.js"
    const cooldown = ns.args[0];
    const spenders = [
        "stocks/trade.js",
        "stocks/earlyTrade.js",
        "hacks/purchase.js"
    ]

    await ns.sleep(cooldown)

    // Stop spenders
    var spendersRunning = [];
    for (s = 0; s < spenders.length; s++) {
        if (ns.scriptRunning(spenders[s])) {
            await ns.scriptKill(spenders[s], "home");
            spendersRunning.push[spenders[s]]
        }
    }

    // Report
    let time = getTime();
    let report = time + " - INFO! Spenders stopped (" + spendersRunning + ")...";
    ns.print(report)
    report = time + " - INFO! Starting Repurchase Fraud...";
    ns.print(report)

    // Spawn Repurchase Fruad
    await ns.spawn(fraud, 1, spendersRunning);
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