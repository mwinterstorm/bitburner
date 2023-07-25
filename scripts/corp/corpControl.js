const divTarget = 0.01
const fraudScript = "corp/repurchaseFraud.js"
const minSleep = 30 //time in sec to min sleep between runs
const maxSleep = 60 //time in sec to min sleep between runs

export async function main(ns) {
    ns.tail()
    ns.disableLog("ALL");
    /** @param {NS} ns */
    while (true) {
        let status = await reportDividends(ns);
        await tendProducts(ns);
        if (status.saleCool != 0) {
            await buyBackShares(ns);
        } else if (Math.random() < 0.33) {
            await ns.spawn(fraudScript, 1, "auto");
            await ns.sleep(10000)
        } else {
            await buyBackShares(ns);
        }
        let sleep = Math.floor(Math.random() * maxSleep);
        if (sleep <= minSleep) {
            sleep = 30;
        }
        await ns.sleep(sleep * 1000);
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
    return obj
}

async function buyBackShares(ns) {
    let corporation = ns.corporation.getCorporation()
    let myShares = corporation.numShares
    let totalShares = corporation.totalShares
    let buyback
    if (myShares < totalShares) {
        ns.corporation.issueDividends(1)
        let outstandingShares = totalShares - myShares
        let purchasePrice = corporation.sharePrice;
        let money = await ns.getPlayer().money * (1 - (Math.random() / 4))
        let purchaseshares = Math.floor(money / (purchasePrice * 1.1))
        if (purchaseshares > outstandingShares) {
            purchaseshares = outstandingShares
            // ns.print(purchaseshares)
            await ns.corporation.buyBackShares(purchaseshares);
            let time = getTime()
            let report = time + " - " + ns.formatNumber(purchaseshares, 3, 1000, true) + " shares purchased at $" + ns.formatNumber(purchasePrice, 2, 1000) + " ($" + ns.formatNumber(purchasePrice * purchaseshares, 2, 1000) + " total), " + ns.formatNumber((outstandingShares - purchaseshares), 3, 1000, true) + " (" + ns.formatPercent((1 - (myShares + purchaseshares) / totalShares)) + ") outstanding"
            ns.print(report)
        } else if (purchaseshares <= 0) {
            // ns.print(purchaseshares)
            let time = getTime()
            ns.print(time + " - Not enough $$$: " + ns.formatNumber((outstandingShares - purchaseshares), 3, 1000, true) + " (" + ns.formatPercent((1 - (myShares + purchaseshares)) / totalShares) + ") outstanding")
        } else {
            // ns.print(purchaseshares)
            await ns.corporation.buyBackShares(purchaseshares);
            let time = getTime()
            let report = time + " - " + ns.formatNumber(purchaseshares, 3, 1000, true) + " shares purchased at $" + ns.formatNumber(purchasePrice, 2, 1000) + " ($" + ns.formatNumber(purchasePrice * purchaseshares, 2, 1000) + " total), " + ns.formatNumber((outstandingShares - purchaseshares), 3, 1000, true) + " (" + ns.formatPercent((1 - (myShares + purchaseshares) / totalShares)) + ") outstanding"
            ns.print(report)
        }
        buyback = true
    } else {
        ns.corporation.issueDividends(divTarget)
        buyback = false
    }
    return buyback
}

async function tendProducts(ns) {
    let corporation = ns.corporation.getCorporation();
    let divisionNames = corporation.divisions;
    const minDemand = 1;

    // Get divisons
    var div = [];
    for (let i = 0; i < divisionNames.length; i++) {
        let divInfo = ns.corporation.getDivision(divisionNames[i]);
        div.push(divInfo)
    }

    // Get products and tend
    for (let i = 0; i < div.length; i++) {
        if (div[i].makesProducts) {
            let divName = div[i].name;
            let divcities = div[i].cities;
            let divProds = div[i].products;
            let maxProds = div[i].maxProducts;
            for (let p = 0; p < divProds.length; p++) {
                let divProd = divProds[p];
                let aveDemand = 0;
                for (let c = 0; c < divcities.length; c++) {
                    let divcity = divcities[c];
                    let productInfo = ns.corporation.getProduct(divName, divcity, divProd)
                    let cityDemand = productInfo.demand;
                    aveDemand = aveDemand + cityDemand
                    if (productInfo.developmentProgress == 100) { //set products to sell
                        await ns.corporation.sellProduct(divName, divcity, divProd, "MAX", "MP", true)
                        if (ns.corporation.hasResearched(divName, "Market-TA.II")) {
                            await ns.corporation.setProductMarketTA2(divName, divProd, true)
                        }
                    } else {
                        aveDemand = aveDemand + (minDemand * 1024) //ensure products being developed are not discontinued
                    }
                }
                aveDemand = aveDemand / divcities.length
                if (aveDemand <= minDemand) { //discontinue product with low demand 
                    await ns.corporation.discontinueProduct(divName, divProd);
                    let index = divProds.indexOf(divProd);
                    divProds.splice(index, 1);
                    let time = getTime()
                    let report = time + " - FAIL! " + divName + " is discontinuing product " + divProd;
                    await ns.print(report);
                    await ns.tryWritePort(8, report);
                }
            }
            if (divProds.length < maxProds) { //create new prod when space
                let number = Math.floor(Math.random() * 100);
                let newName = divName + "-" + number;
                let funds = (corporation.funds * .1) / 2;
                let rancity = Math.floor(Math.random() * divcities.length);
                let city = divcities[rancity];
                if (!divProds.includes(newName)) {
                    await ns.corporation.makeProduct(divName, city, newName, funds, funds)
                    let time = getTime()
                    let report = time + " - WARN! " + divName + " is creating product " + newName + " at " + city + " investing $" + 2 * ns.formatNumber(funds,3,1000);
                    await ns.print(report);
                    await ns.tryWritePort(8, report);
                }

            }
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