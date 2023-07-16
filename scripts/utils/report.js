/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    await ns.sleep(100);
    ns.moveTail(0, 0);
    ns.resizeTail(950, 300);
    var maxwait = 500;
    var waitTimer = 0
    const earningsReportPeriod = 30000 // in seconds * 1000
    const aveEarnPeriod = 33 // in minutes
    var earnArr = [];
    var selfearnArr = [];
    var stockearArr = [];
    var divArr = [];
    var fraudArr = [];
    var gangArr = [];
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
            let selfeps = 0;
            let selfaveEarn = 0;
            await ns.tryWritePort(2, 0)
            if (selfearnings != "NULL PORT DATA") {
                selfeps = (selfearnings / (waitTimer / 1000))
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
            let reportSelf = "SELF          : $" + + ns.formatNumber(selfeps, 1, 1000, true) + "/s | $" + ns.formatNumber(selfaveEarn, 1, 1000, true) + "/s"

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
            let stockValue = ns.readPort(6)
            if (stockValue == "NULL PORT DATA") {
                stockValue = 0
            }
            let stockNumber = ns.readPort(7)
            if (stockNumber == "NULL PORT DATA") {
                stockNumber = 0
            }
            let reportTrade = "TRADING       : $" + ns.formatNumber(stockeps, 1, 1000, true) + "/s | $" + ns.formatNumber(stockave, 1, 1000, true) + "/s; Total Value Owned: $" + ns.formatNumber(stockValue, 1, 1000, true) + " in " + ns.formatNumber(stockNumber, 0, 1000, true) + " stocks"


            // gather dividend EPS
            let dividends = ns.peek(4);
            let divTotal = 0
            if (dividends == "NULL PORT DATA") {
                dividends = 0;
            }
            if (divArr.length > elength) {
                divArr.shift()
            }
            divArr.push(dividends)
            for (let e = 0; e < divArr.length; e++) {
                divTotal = divArr[e] + divTotal
            }
            let divAve = divTotal / divArr.length;
            let reportCorpDiv = "CORP dividends: $" + ns.formatNumber(dividends, 1, 1000, true) + "/s | $" + ns.formatNumber(divAve, 1, 1000, true) + "/s" 

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
            let reportCorpFraud = "CORP fraud    : $" + ns.formatNumber(fraudEPS, 1, 1000, true) + "/s | $" + ns.formatNumber(fraudAve, 1, 1000, true) + "/s"

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

            // calculate Share power
            let sharePower = ns.readPort(9);
            let shareArr = [];
            let shareAve = 0
            if (sharePower != "NULL PORT DATA") {
                if (shareArr.length > elength) {
                    shareArr.shift()
                }
                shareArr.push(sharePower)
                let shareTotal = 0
                for (s = 0; s < shareArr.length; s++) {
                    shareTotal = shareTotal + shareArr[s]
                }
                shareAve = ((shareTotal / shareArr.length) / (waitTimer / 1000))
            } else {
                sharePower = 0
            }
            let reportShare = "SHARE         : " + ns.formatNumber(sharePower, 1, 1000, true) + "% | " + ns.formatNumber(shareAve, 1, 1000, true) + "%"

            // Calc Karma
            let karma =  ns.heart.break()
            let karmaprogress = ( karma / -54000 ) * 100    
            let reportKarma = "KARMA         : " + ns.formatNumber( karma, 1, 1000, true ) + " | Progress: " + ns.formatNumber( karmaprogress, 1, 1000 ) + "%"    

            // REPORT
            let total30 = hackeps + selfeps + stockeps + dividends + fraudEPS
            let totalAve = hackaveEarn + selfaveEarn + stockave + divAve + fraudAve
            let time = getTime()
            let reportTime = time + " - INFO! EPS: last " + ns.formatNumber((waitTimer / 1000), 0, 0, true) + "s | last " + ns.formatNumber(((waitTimer / 1000) * earnArr.length) / 60, 1, 1000) + "mins"
            let reportTotal =   "SUCCESS! TOTAL: $" + ns.formatNumber(total30, 1, 1000, true) + "/s | $" + ns.formatNumber(totalAve, 1, 1000, true) + "/s"
            
            await ns.print(reportTotal)
            await ns.print(reportTime)
            if (hackaveEarn > 0 ){
                await ns.print(reportHack)
            }
            if (selfaveEarn > 0){
                await ns.print(reportSelf)
            }
            if (ns.scriptRunning("stocks/trade.js","home")) {
                await ns.print(reportTrade)
            } else if (stockNumber > 0 ) {
                await ns.print(reportTrade)
            }
            if (ns.corporation.hasCorporation()) {
                if (divAve > 0){   
                    await ns.print(reportCorpDiv)
                }
                if (fraudAve > 0) {
                    await ns.print(reportCorpFraud)
                }
            }
            if (gangAve > 0 ) {
                await ns.print(reportGang)
            }
            if (shareAve > 0 ) {
                await ns.print(reportShare)
            }
            if (karmaprogress > 0 && karmaprogress < 100) {
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