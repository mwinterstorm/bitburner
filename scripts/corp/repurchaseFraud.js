/** @param {NS} ns */
export async function main(ns) {
    // ns.tail();

    const fraudManager = "corp/fraudManager.js";
    var spenders = ns.args[0].split(",");

    let corporation = ns.corporation.getCorporation();
    let myShares = corporation.numShares;
    let saleShares = myShares - 1;
    let salePrice = corporation.sharePrice;
    let checkcool = corporation.shareSaleCooldown
    let cooldown = 300000
    const staticcool = 0

    // Dividends for reporting
    let dividends = corporation.dividendEarnings
    ns.clearPort(2)
    await ns.tryWritePort(2, dividends)

    // MARKET MANIPULATION
    if (checkcool == staticcool) {
        await ns.corporation.sellShares(saleShares);
        corporation = ns.corporation.getCorporation();
        let purchasePrice = corporation.sharePrice;
        await ns.corporation.buyBackShares(saleShares);
        corporation = ns.corporation.getCorporation();
        let finalShares = corporation.numShares;
        cooldown = (corporation.shareSaleCooldown * 10) + 10000;

        // Report
        if (finalShares == myShares) {
            let time = getTime();
            let profit = (saleShares * salePrice) - (saleShares * purchasePrice);
            let report = time + " - SUCCESS! Market manipulated and $" + ns.formatNumber(profit, 4, 1000, true) + " stolen";
            ns.print(report);
            await ns.tryWritePort(8, report)
            let currentEarnings = ns.readPort(1);
            if (currentEarnings != "NULL PORT DATA") {
                let totalEarnings = currentEarnings + profit
                await ns.tryWritePort(1, totalEarnings)
            }
        } else {
            let time = getTime();
            let sharesLost = myShares - finalShares;
            let profit = (saleShares * salePrice) - ((saleShares - sharesLost) * purchasePrice);
            let report = time + " - FAIL! Market manipulated and $" + ns.formatNumber(profit, 4, 1000, true) + " stolen but " + ns.formatNumber(sharesLost, 4, 1000, true) + " shares lost";
            ns.print(report);
            await ns.tryWritePort(8, report)
            let currentEarnings = ns.readPort(1);
            if (currentEarnings != "NULL PORT DATA") {
                let totalEarnings = currentEarnings + profit
                await ns.tryWritePort(1, totalEarnings)
            }
        }

        // Restart Spenders
        let startedSpenders = [];
        if (spenders.length >= 1) {
            for (let s = 0; s < spenders.length; s++) {
                if (!ns.scriptRunning(spenders[s], "home")) {
                    let time = getTime();
                    let report = time + " - INFO! Starting Spender: " + spenders[s] + "..."
                    ns.print(report);
                    await ns.tryWritePort(8, report)
                    await ns.run(spenders[s], 1);
                    startedSpenders.push(spenders[s]);
                }
            }
        }
        if (startedSpenders.length >= 1) {
            let time = getTime()
            let report = time + " - INFO! Spenders Restarted: " + startedSpenders
            ns.print(report)
            await ns.tryWritePort(8, report)
        } else {
            let time = getTime()
            let report = time + " - INFO! No Spenders to restart..."
            ns.print(report)
            await ns.tryWritePort(8, report)
        }
        let time = getTime()
        let report = time + " - WARN! Exiting and starting Fraud Manager..."
        ns.print(report)
        await ns.tryWritePort(8, report)
        await ns.spawn(fraudManager, 1, cooldown)
    } else {
        let time = getTime()
        let report = time + " - FAIL! Cannot sell shares..."
        ns.print(report)
        await ns.tryWritePort(8, report)

        // Restart Spenders
        let startedSpenders = [];
        if (spenders.length >= 1) {
            for (let s = 0; s < spenders.length; s++) {
                if (!ns.scriptRunning(spenders[s], "home")) {
                    let time = getTime();
                    let report = time + " - INFO! Starting Spender: " + spenders[s] + "..."
                    ns.print(report);
                    await ns.tryWritePort(8, report)
                    await ns.run(spenders[s], 1);
                    startedSpenders.push(spenders[s]);
                }
            }
        }
        if (startedSpenders.length >= 1) {
            let time = getTime()
            let report = time + " - INFO! Spenders Restarted: " + startedSpenders
            ns.print(report)
            await ns.tryWritePort(8, report)
        } else {
            let time = getTime()
            let report = time + " - INFO! No Spenders to restart..."
            ns.print(report)
            await ns.tryWritePort(8, report)
        }
        time = getTime()
        report = time + " - WARN! Exiting and starting Fraud Manager..."
        ns.print(report)
        await ns.tryWritePort(8, report)
        await ns.spawn(fraudManager, 1, cooldown)
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