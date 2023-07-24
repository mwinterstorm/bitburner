/** @param {NS} ns */

export async function main(ns) {
    ns.tail()
    ns.disableLog("ALL");
    const corpscripts = [
        "corp/buyback.js",
        "corp/corpControl.js"
    ]
    var corprunning = [];
    for (let s = 0; s < corpscripts.length; s++) {
        if (ns.scriptRunning(corpscripts[s], "home")) {
            await ns.scriptKill(corpscripts[s], "home");
            corprunning.push(corpscripts[s])
        }
    }
    await reportDividends(ns);
    await commitInsiderTrading(ns);
    let startedscripts = [];
    if (corprunning.length >= 1) {
        for (let s = 0; s < corprunning.length; s++) {
            if (!ns.scriptRunning(corprunning[s], "home")) {
                let time = getTime();
                let report = time + " - INFO! Starting Sript: " + corprunning[s] + "..."
                ns.print(report);
                await ns.tryWritePort(8, report)
                await ns.run(corprunning[s], 1);
                startedscripts.push(corprunning[s]);
            }
        }
    }
    if (startedscripts.length >= 1) {
        let time = getTime()
        let report = time + " - INFO! Scripts Restarted: " + startedscripts
        ns.print(report)
        await ns.tryWritePort(8, report)
    } else {
        let time = getTime()
        let report = time + " - INFO! No Scripts to restart..."
        ns.print(report)
        await ns.tryWritePort(8, report)
    }
}

async function reportDividends(ns) {
    let corporation = ns.corporation.getCorporation();
    // Dividends for reporting
    let dividends = corporation.dividendEarnings
    let funds = corporation.funds
    let revenue = corporation.revenue
    let expenses = corporation.expenses
    let saleCool = corporation.shareSaleCooldown
    let sharePrice = corporation.sharePrice
    let obj = {
        "dividends": dividends,
        "funds": funds,
        "revenue": revenue,
        "expenses": expenses,
        "saleCool": saleCool,
        "sharePrice": sharePrice
    }
    let string = JSON.stringify(obj);
    await ns.clearPort(4);
    await ns.tryWritePort(4, string);
}

async function commitInsiderTrading(ns) {
    let corporation = ns.corporation.getCorporation();
    let cooldown = corporation.shareSaleCooldown
    let myShares = corporation.numShares;
    let salePrice = corporation.sharePrice;
    let saleShares = myShares - 1;
    const spenders = [
        "hacks/purchase.js",
        "net/hacknetControl.js",
        "stocks/earlyTrade.js",
        "stocks/trade.js"
    ]

    // MARKET MANIPULATION
    if (cooldown == 0) {

        // Stop spenders
        var spendersRunning = [];
        for (let s = 0; s < spenders.length; s++) {
            if (ns.scriptRunning(spenders[s], "home")) {
                await ns.scriptKill(spenders[s], "home");
                spendersRunning.push(spenders[s])
            }
        }

        // Report
        let time = getTime();
        let arg = spendersRunning.toString();
        let report = time + " - INFO! Spenders stopped (" + arg + ")...";
        ns.print(report)
        await ns.tryWritePort(8, report)
        report = time + " - INFO! Starting Repurchase Fraud...";
        ns.print(report)
        await ns.tryWritePort(8, report)

        // Manipulate Market
        await ns.corporation.sellShares(saleShares);
        corporation = await ns.corporation.getCorporation();
        let purchasePrice = corporation.sharePrice;
        await ns.corporation.buyBackShares(saleShares);
        corporation = await ns.corporation.getCorporation();
        let finalShares = corporation.numShares;
        cooldown = (corporation.shareSaleCooldown * 10) + 10000;

        // Report
        if (finalShares == myShares) {
            let time = getTime();
            let profit = (saleShares * salePrice) - (saleShares * purchasePrice);
            let report = time + " - SUCCESS! Market manipulated and $" + ns.formatNumber(profit, 4, 1000, true) + " stolen";
            ns.print(report);
            await ns.tryWritePort(8, report)
            let currentEarnings = ns.readPort(5);
            if (currentEarnings != "NULL PORT DATA") {
                let totalEarnings = currentEarnings + profit
                await ns.tryWritePort(5, totalEarnings)
            }
        } else {
            let time = getTime();
            let sharesLost = myShares - finalShares;
            let profit = (saleShares * salePrice) - ((saleShares - sharesLost) * purchasePrice);
            let report = time + " - FAIL! Market manipulated and $" + ns.formatNumber(profit, 4, 1000, true) + " stolen but " + ns.formatNumber(sharesLost, 4, 1000, true) + " shares lost";
            ns.print(report);
            await ns.tryWritePort(8, report)
            let currentEarnings = ns.readPort(5);
            if (currentEarnings != "NULL PORT DATA") {
                let totalEarnings = currentEarnings + profit
                await ns.tryWritePort(5, totalEarnings)
            }
        }

        // Restart Spenders
        let startedSpenders = [];
        if (spendersRunning.length >= 1) {
            for (let s = 0; s < spendersRunning.length; s++) {
                if (!ns.scriptRunning(spendersRunning[s], "home")) {
                    let time = getTime();
                    let report = time + " - INFO! Starting Spender: " + spendersRunning[s] + "..."
                    ns.print(report);
                    await ns.tryWritePort(8, report)
                    await ns.run(spendersRunning[s], 1);
                    startedSpenders.push(spendersRunning[s]);
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