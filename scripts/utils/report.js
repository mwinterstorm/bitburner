/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    await ns.sleep(100);
    ns.moveTail(500, 0);
    ns.resizeTail(725, 470);
    var maxwait = 500;
    var waitTimer = 0
    const earningsReportPeriod = 30000 // in seconds * 1000
    const aveEarnPeriod = 60 // in minutes
    var earnArr = [];
    var selfearnArr = [];
    var stockearArr = [];
    var divArr = [];
    var fraudArr = [];
    var gangArr = [];
    let shareArr = [];
    let karmaArr = [];
    let hacknetArr = [];
    var karma = 0 //to allow calculating change
    while (true) {
        let wait = Math.floor(Math.random() * maxwait);
        if (wait < 25) {
            wait = 25
        }
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
            let elength = (aveEarnPeriod * 60 * 1000) / earningsReportPeriod

            // calculate earnings from hack.js 
            let earnings = ns.readPort(1)
            let hackeps = 0
            let hackaveEarn = 0
            await ns.tryWritePort(1, 0)
            if (earnings != "NULL PORT DATA") {
                hackeps = (earnings / (waitTimer / 1000))
                let totalEarn = 0
                if (earnArr.length > elength) {
                    earnArr.shift()
                }
                earnArr.push(earnings)
                for (let e = 0; e < earnArr.length; e++) {
                    totalEarn = earnArr[e] + totalEarn
                }
                hackaveEarn = ((totalEarn / earnArr.length) / (waitTimer / 1000))
            }
            let reportHack = "HACK          : $" + ns.formatNumber(hackeps, 1, 1000, true) + "/s | $" + ns.formatNumber(hackaveEarn, 1, 1000, true) + "/s"

            //calculate earnings from self.js
            let selfearnings = ns.readPort(2)
            await ns.tryWritePort(2, 0)
            let selfeps = 0;
            let selfaveEarn = 0;
            if (selfearnings != "NULL PORT DATA") {
                selfeps = (selfearnings * 1000 / (waitTimer / 1000)) / 1000
                let selftotalEarn = 0
                if (selfearnArr.length > elength) {
                    selfearnArr.shift()
                }
                selfearnArr.push(selfearnings)
                for (let e = 0; e < selfearnArr.length; e++) {
                    selftotalEarn = selfearnArr[e] + selftotalEarn
                }
                selfaveEarn = ((selftotalEarn / selfearnArr.length) / (waitTimer / 1000))
            }
            let reportSelf = "SELF          : $" + + ns.formatNumber(parseInt(selfeps), 1, 1000) + "/s | $" + ns.formatNumber(selfaveEarn, 1, 1000) + "/s"

            //calculate stock market EPS
            let stockearnings = ns.readPort(3)
            let stockeps = 0;
            let stockave = 0;
            await ns.tryWritePort(3, 0)
            if (stockearnings != "NULL PORT DATA") {
                stockeps = (stockearnings / (waitTimer / 1000))
                let stocktotalearn = 0
                if (stockearArr.length > elength) {
                    stockearArr.shift()
                }
                stockearArr.push(stockearnings)
                for (let e = 0; e < stockearArr.length; e++) {
                    stocktotalearn = stockearArr[e] + stocktotalearn
                }
                stockave = ((stocktotalearn / stockearArr.length) / (waitTimer / 1000))
            }
            let stockobj = ns.peek(6)
            let stockValue = 0
            let stockNumber = 0
            if (stockobj == "NULL PORT DATA") {
                stockValue = 0
                stockNumber = 0
            } else {
                stockobj = JSON.parse(stockobj)
                stockValue = +stockobj.overallValue
                stockNumber = +stockobj.numberStocks
            }
            let reportTrade = "TRADING       : $" + ns.formatNumber(stockeps, 1, 1000, true) + "/s | $" + ns.formatNumber(stockave, 1, 1000, true) + "/s; Total Value Owned: $" + ns.formatNumber(stockValue, 1, 1000, true) + " in " + ns.formatNumber(stockNumber, 0, 1000, true) + " stocks"

            // gather dividend EPS
            let corpobj = ns.peek(4);
            let dividends = 0
            let funds = 0
            let expenses = 0
            let revenue = 0
            let divTotal = 0
            let fraudCool = 0 //used with corporate fraud below
            let fraudPrice = 0 //used with corporate fraud below
            if (corpobj != "NULL PORT DATA") {
                corpobj = JSON.parse(corpobj)
                dividends =corpobj.dividends
                funds = corpobj.funds
                expenses = corpobj.expenses
                revenue = corpobj.revenue
                fraudCool = corpobj.saleCool / 600 //cooldown in minutes
                fraudPrice = corpobj.sharePrice
            }
            if (divArr.length > elength) {
                divArr.shift()
            }
            divArr.push(dividends)
            for (let e = 0; e < divArr.length; e++) {
                divTotal = divArr[e] + divTotal
            }
            let divAve = divTotal / divArr.length;
            let reportCorpDiv = "CORP dividends: $" + ns.formatNumber(dividends, 1, 1000, true) + "/s | $" + ns.formatNumber(divAve, 1, 1000, true) + "/s; Income: $" + ns.formatNumber(revenue - expenses, 1, 1000, true) + " | Funds: $" + ns.formatNumber(funds, 1, 1000, true)

            //calculate Corporate Fraud
            let fraudEarnings = ns.readPort(5)
            let fraudEPS = 0;
            let fraudAve = 0;
            await ns.tryWritePort(5, 0)
            if (fraudEarnings != "NULL PORT DATA") {
                fraudEPS = (fraudEarnings / (waitTimer / 1000))
                let fraudTotal = 0
                if (fraudArr.length > elength) {
                    fraudArr.shift()
                }
                fraudArr.push(fraudEarnings)
                for (let e = 0; e < fraudArr.length; e++) {
                    fraudTotal = fraudArr[e] + fraudTotal
                }
                fraudAve = ((fraudTotal / fraudArr.length) / (waitTimer / 1000))
            }
            let reportCorpFraud = "CORP fraud    : $" + ns.formatNumber(fraudEPS, 1, 1000, true) + "/s | $" + ns.formatNumber(fraudAve, 1, 1000, true) + "/s; Price: $" + ns.formatNumber(fraudPrice, 1, 1000, true) + " | Cooldown: " + ns.formatNumber(fraudCool, 1, 1000) + "mins"

            // gather gang earnings
            let gang = ns.peek(10);
            let gangTotal = 0
            if (gang == "NULL PORT DATA") {
                gang = 0;
            }
            if (gangArr.length > elength) {
                gangArr.shift()
            }
            gangArr.push(gang)
            for (let e = 0; e < gangArr.length; e++) {
                gangTotal = gangArr[e] + gangTotal
            }
            let gangAve = gangTotal / gangArr.length;
            let reportGang = "GANG          : $" + ns.formatNumber(gang, 1, 1000, true) + "/s | $" + ns.formatNumber(gangAve, 1, 1000, true) + "/s"

            // gather hacknet 
            let hacknet = ns.peek(11);
            let hacktotal = 0
            let hacknetEPS = 0
            let hacknetProfitPercent = 0
            if (hacknet == "NULL PORT DATA") {
                hacknetEPS = 0;
                hacknetProfitPercent = -1
            } else {
                hacknet = JSON.parse(hacknet)
                hacknetEPS = hacknet.totalEPS
                hacknetProfitPercent = (hacknet.totalEarnings / hacknet.totalCost) - 1
            }
            if (hacknetArr.length > elength) {
                hacknetArr.shift()
            }
            hacknetArr.push(hacknetEPS)
            for (let e = 0; e < hacknetArr.length; e++) {
                hacktotal = Number(hacknetArr[e]) + hacktotal
            }
            let hacknetAve = Number(hacktotal) / Number(hacknetArr.length);
            let reportHackNet = "HACKNET       : $" + ns.formatNumber(+hacknetEPS, 1, 1000) + "/s | $" + ns.formatNumber(+hacknetAve, 1, 1000) + "/s; Profit: " + ns.formatPercent(hacknetProfitPercent, 1)

            // calculate Share power
            let sharePower = parseFloat(ns.readPort(9));
            await ns.clearPort(9);
            let shareAve = 0
            if (sharePower != "NULL PORT DATA" && sharePower > 0) {
                if (shareArr.length > elength) {
                    shareArr.shift()
                }
                shareArr.push(sharePower)
                let shareTotal = 0
                for (let s = 0; s < shareArr.length; s++) {
                    shareTotal = shareTotal + shareArr[s]
                }
                shareAve = (shareTotal / shareArr.length)
            } else {
                sharePower = 0
                if (shareArr.length > elength) {
                    shareArr.shift()
                }
                shareArr.push(sharePower)
                if (shareArr.length >= 1) {
                    let shareTotal = 0
                    for (let s = 0; s < shareArr.length; s++) {
                        shareTotal = shareTotal + shareArr[s]
                    }
                    shareAve = (shareTotal / shareArr.length)
                } else {
                    shareAve = 0
                }
            }
            let reportShare = "SHARE         : " + ns.formatPercent(sharePower, 1) + " | " + ns.formatPercent(shareAve, 1)

            // Calc Karma
            let karmaOld = karma
            karma = ns.heart.break()
            let karmaChange = (karma - karmaOld) / (waitTimer / 1000)
            let karmaprogress = (karma / -54000)
            let reportKarma = ""
            let karmaTotal = 0
            let karmaAve = 0
            if (karmaOld != 0) {
                if (karmaArr.length > elength) {
                    karmaArr.shift()
                }
                karmaArr.push(karmaChange)
                for (let k = 0; k < karmaArr.length; k++) {
                    karmaTotal = karmaTotal + karmaArr[k]
                }
                karmaAve = karmaTotal / karmaArr.length
                let karmaTime = ((54000 + karma) / (((-karmaChange * 2) + -karmaAve) / 3)) / 60
                if (karmaChange < 0) {
                    reportKarma = "KARMA         : " + ns.formatNumber(karmaChange, 2, 1000, true) + "/s | " + ns.formatNumber(karmaAve, 2, 1000, true) + "/s; Progress: " + ns.formatPercent(karmaprogress, 1, 1000) + " | ETA: " + ns.formatNumber(karmaTime, 1, 1000) + " mins"
                } else {
                    reportKarma = "KARMA         : " + ns.formatNumber(karmaChange, 2, 1000, true) + "/s | " + ns.formatNumber(karmaAve, 2, 1000, true) + "/s; Progress: " + ns.formatPercent(karmaprogress, 1, 1000)
                }
            } else {
                reportKarma = "KARMA         : 0/s | " + ns.formatNumber(karma, 2, 1000, true) + "; Progress: " + ns.formatPercent(karmaprogress, 1, 1000)
            }

            // REPORT
            let total30 = hackeps + selfeps + stockeps + dividends + fraudEPS + hacknet
            let totalAve = hackaveEarn + selfaveEarn + stockave + divAve + fraudAve + hacknetAve
            let time = getTime()
            let reportTime = time + " - INFO! EPS: last " + ns.formatNumber((waitTimer / 1000), 0, 0, true) + "s | last " + ns.formatNumber(((waitTimer / 1000) * earnArr.length) / 60, 1, 1000) + "mins"
            let reportTotal = time + " - SUCCESS! TOTAL: $" + ns.formatNumber(total30, 1, 1000, true) + "/s | $" + ns.formatNumber(totalAve, 1, 1000, true) + "/s"

            await ns.print(reportTotal)
            await ns.print(reportTime)
            if (hackaveEarn > 0) {
                await ns.print(reportHack)
            }
            if (selfaveEarn > 0) {
                await ns.print(reportSelf)
            }
            if (stockave > 0) {
                await ns.print(reportTrade)
            } else if (stockNumber > 0) {
                await ns.print(reportTrade)
            }
            if (ns.corporation.hasCorporation()) {
                if (divAve > 0) {
                    await ns.print(reportCorpDiv)
                }
                if (fraudAve > 0) {
                    await ns.print(reportCorpFraud)
                }
            }
            if (gangAve > 0) {
                await ns.print(reportGang)
            }
            if (hacknetAve > 0) {
                await ns.print(reportHackNet)
            }
            if (shareAve > 0) {
                await ns.print(reportShare)
            }
            if (karmaprogress > 0 && karmaprogress < 1) {
                await ns.print(reportKarma)
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