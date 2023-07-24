/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    ns.disableLog("ALL");
    let corporation = ns.corporation.getCorporation()
    let totalShares = corporation.totalShares
    let myShares = corporation.numShares
    while (myShares < totalShares) {
        reportDividends(ns)
        corporation = await ns.corporation.getCorporation()
        myShares = corporation.numShares
        let outstandingShares = totalShares - myShares
        let purchasePrice = corporation.sharePrice;
        let money = await ns.getPlayer().money * (1 - (Math.random() / 3) )
        let purchaseshares = Math.floor(money / (purchasePrice * 1.1))
        if (purchaseshares > outstandingShares) {
            purchaseshares = outstandingShares
            // ns.print(purchaseshares)
            await ns.corporation.buyBackShares(purchaseshares);
            let time = getTime()
            let report = time + " - " + ns.formatNumber(purchaseshares,3,1000,true) + " shares purchased at $" + ns.formatNumber(purchasePrice,2,1000) + " ($" + ns.formatNumber(purchasePrice * purchaseshares,2,1000) + " total), " + ns.formatNumber((outstandingShares - purchaseshares),3,1000,true) + " outstanding"
            ns.print(report)
        } else if (purchaseshares <= 0 ) {
            // ns.print(purchaseshares)
            let time = getTime()
            ns.print(time + " - Waiting: " + ns.formatNumber((outstandingShares - purchaseshares),3,1000,true) + " outstanding")
            await ns.sleep(10000)
        } else {
            // ns.print(purchaseshares)
            await ns.corporation.buyBackShares(purchaseshares);
            let time = getTime()
            let report = time + " - " + ns.formatNumber(purchaseshares,3,1000,true) + " shares purchased at $" + ns.formatNumber(purchasePrice,2,1000) + " ($" + ns.formatNumber(purchasePrice * purchaseshares,2,1000) + " total), " + ns.formatNumber((outstandingShares - purchaseshares),3,1000,true) + " outstanding"
            ns.print(report)
        }
        await ns.sleep(1000)
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