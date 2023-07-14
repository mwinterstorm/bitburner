/** @param {NS} ns */
export async function main(ns) {
    ns.tail();

    const fraudManager = "corp/fraudManager.js";
    var spenders = ns.args[0].split(",");

    let corporation = ns.corporation.getCorporation();
    let myShares = corporation.numShares;
    let saleShares = myShares - 1;
    let salePrice = corporation.sharePrice;
    let cooldown = corporation.shareSaleCooldown + 10000;

    // MARKET MANIPULATION
    await ns.corporation.sellShares(saleShares);
    corporation = ns.corporation.getCorporation();
    let purchasePrice = corporation.sharePrice;
    await ns.corporation.buyBackShares(saleShares);
    corporation = ns.corporation.getCorporation();
    let finalShares = corporation.numShares;

    // Report
    if (finalShares == myShares) {
        let time = getTime();
        let profit = (saleShares * salePrice) - (saleShares * purchasePrice);
        let report = time + " - SUCCESS! Market manipulated and $" + ns.formatNumber(profit, 4, 1000, true) + " stolen";
        ns.print(report);
    } else {
        let time = getTime();
        let sharesLost = myShares - finalShares;
        let profit = (saleShares * salePrice) - ((saleShares - sharesLost) * purchasePrice);
        let report = time + " - FAIL! Market manipulated and $" + ns.formatNumber(profit, 4, 1000, true) + " stolen but " + ns.formatNumber(sharesLost, 4, 1000, true) + " shares lost";
        ns.print(report);
    }

    // Restart Spenders
    let startedSpenders = [];
    for (let s = 0; s < spenders.length; s++) {
        if (!ns.scriptRunning(spenders[s], "home")) {
            let time = getTime();
            let report = time + "- INFO! Starting Spender: " + spenders[s] + "..."
            ns.print(report);
            await ns.run(spenders[s], 1);
            startedSpenders.push(spenders[s]);
        }
    }
    if (startedSpenders >= 1) {
        let time = getTime()
        let report = time +  " - INFO! Spenders Restarted: " + startedSpenders
        ns.print(report)
    } else {
        let time = getTime()
        let report = time +  " - INFO! No Spenders to restart..."
        ns.print(report)
    }

    let time = getTime()
    let report = time +  " - WARN! Exiting and starting Fraud Manager..."
    ns.print(report)
    await ns.spawn(fraudManager, 1, cooldown)

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