/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail()
    let avesync = 0
    let wait = 60 // in seconds
    while (true) {
        let sleeveArr = getSleeves(ns)
        for (let s = 0; s < sleeveArr.length; s++) {
            let sNum = sleeveArr[s].number
            let waitModifier = (Math.random() / 10)
            if (Math.random() > (sleeveArr[sNum].sync / 100)) {
                let returnmsg = await sleeveSync(ns, sleeveArr[sNum])
                wait = parseInt((wait * .93) + waitModifier)
                let time = getTime()
                ns.print(time + " - Initialising " + returnmsg.type + " for " + ns.formatNumber(wait, 1, 1000) + " secs - " + returnmsg.report)
                await ns.sleep(wait * 1000)
            } else if (Math.random() < (sleeveArr[sNum].shock / 100) && Math.random() < (sleeveArr[sNum].shock / 150)) {
                let returnmsg = await sleeveSync(ns, sleeveArr[sNum])
                wait = parseInt((wait * .92) + waitModifier)
                let time = getTime()
                ns.print(time + " - Initialising " + returnmsg.type + " for " + ns.formatNumber(wait, 1, 1000) + " secs - " + returnmsg.report)
                await ns.sleep(wait * 1000)
            } else if (ns.heart.break() > -54000 && Math.random() < 0.70) {
                let returnmsg = await randomCrime(ns, sleeveArr[sNum])
                let time = getTime()
                ns.print(time + " - " + returnmsg.report)
                wait = returnmsg.wait
                await ns.sleep(wait * 1000 + 150)
            } else if (Object.keys(ns.getPlayer().jobs).length > 0) {
                let returnmsg = await randomCompany(ns, sleeveArr[sNum])
                let time = getTime()
                wait = (wait * .95) + waitModifier
                let report = " - Waiting " + ns.formatNumber(wait,1,1000) + "s while working at " + returnmsg.job
                ns.print(time + " - " + report)
                await ns.sleep(wait * 1000)
            } else {
                let returnmsg = await randomCrime(ns, sleeveArr[sNum])
                let time = getTime()
                ns.print(time + " - " + returnmsg.report)
                wait = returnmsg.wait
                await ns.sleep(wait * 1000 + 150)
            }
        }
    }
}

function getSleeves(ns) { //returns an array of each sleeve
    let numberSleeves = ns.sleeve.getNumSleeves()
    let sleeveArr = []
    for (let s = 0; s < numberSleeves; s++) {
        let sleeveNumber = s
        let sleeveInfo = ns.sleeve.getSleeve(sleeveNumber)
        let sleeveTask = ns.sleeve.getTask(sleeveNumber)
        let shock = sleeveInfo.shock
        let sync = sleeveInfo.sync
        let city = sleeveInfo.city
        let sleeve = {
            "number": sleeveNumber,
            "shock": shock,
            "sync": sync,
            "city": city,
            "task": sleeveTask
        }
        sleeveArr.push(sleeve)
    }
    return sleeveArr
}

async function sleeveSync(ns, sleeve) { //when less than 100% synced will sync, then will reduce shock to under 90%
    // max sync
    let type
    if (sleeve.sync < 100) {
        if (sleeve.task.type != "SYNCHRO") {
            await ns.sleeve.setToSynchronize(sleeve.number)
        }
        type = "SYNC"
    } else if (sleeve.shock >= 90) {
        if (sleeve.task.type != "RECOVERY") {
            await ns.sleeve.setToShockRecovery(sleeve.number)
        }
        type = "SHOCK"
    } else if (Math.random() < (sleeve.shock / 100) ^ 2) {
        if (sleeve.task.type != "RECOVERY") {
            await ns.sleeve.setToShockRecovery(sleeve.number)
        }
        type = "SHOCK"
    }
    let returnmsg = {
        "report": "SLEEVE: " + sleeve.number + " SYNC: " + ns.formatNumber(sleeve.sync, 1, 1000) + "% | SHOCK: " + ns.formatNumber(sleeve.shock, 1, 1000) + "%",
        "number": sleeve.number,
        "type": type,
        "sync": sleeve.sync,
        "shock": sleeve.shock
    }
    return returnmsg
}

async function randomCrime(ns, sleeve) { // converts one random sleeve into crime
    const crimes = [
        "Assassination",
        "Bond Forgery",
        "Deal Drugs",
        "Grand Theft Auto",
        "Heist",
        "Homicide",
        "Kidnap",
        "Larceny",
        "Mug",
        "Rob Store",
        "Shoplift",
        "Traffick Arms"
    ]
    let crimeSelect = Math.floor(Math.random() * crimes.length)
    await ns.sleeve.setToCommitCrime(sleeve.number, crimes[crimeSelect])
    let wait = (ns.sleeve.getTask(sleeve.number).cyclesNeeded / 5)
    let report = "Waiting " + wait + "s while committing " + crimes[crimeSelect]
    let returnmsg = {
        "report": report,
        "wait": wait
    }
    return returnmsg
}

async function randomCompany(ns, sleeve) { // converts one random sleeve into crime
    const jobs = Object.keys(ns.getPlayer().jobs)
    let jobselect = Math.floor(Math.random() * jobs.length)
    await ns.sleeve.setToCompanyWork(sleeve.number, jobs[jobselect])
    let returnmsg = {
        "job": jobs[jobselect]
    }
    return returnmsg
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
