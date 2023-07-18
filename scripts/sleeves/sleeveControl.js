/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail()
    let avesync = 0
    let wait = 60 // in seconds
    while (avesync < 100) {
        let sleeveArr = getSleeves(ns)
        let sleeve = sleeveArr[Math.floor(Math.random() * sleeveArr.length)]
        if (Math.random() > (sleeve.sync / 100)) {
            let returnmsg = await sleeveSync(ns, sleeveArr)
            avesync = returnmsg.avesync
            ns.print("Initialising SYNC " + returnmsg.report)
            await ns.sleep(wait * 1000)
        } else if (Math.random() < (sleeve.shock / 100) && sleeve.shock > 90) {
            let returnmsg = await sleeveSync(ns, sleeveArr)
            avesync = returnmsg.avesync
            ns.print("Initialising SHOCK " + returnmsg.report)
            await ns.sleep(wait * 1000)
        } else {
            let returnmsg = await randomCrime(ns, sleeveArr)
            ns.print(returnmsg.report)
            wait = returnmsg.wait
            await ns.sleep(wait * 1000 + 150)
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

async function sleeveSync(ns, sleeveArr) { //when less than 100% synced will sync, then will reduce shock to under 90%
    // max sync
    let avesync = 0
    let aveshock = 0
    for (let s = 0; s < sleeveArr.length; s++) {
        let sleeve = sleeveArr[s]
        if (sleeve.sync < 100) {
            if (sleeve.task.type != "SYNCHRO") {
                await ns.sleeve.setToSynchronize(sleeve.number)
            }
            avesync = avesync + sleeve.sync
            aveshock = aveshock + sleeve.shock
        } else if (sleeve.shock >= 90) {
            if (sleeve.task.type != "RECOVERY") {
                await ns.sleeve.setToShockRecovery(sleeve.number) 
            }
            avesync = avesync + sleeve.sync
            aveshock = aveshock + sleeve.shock
        } else {
            avesync = avesync + sleeve.sync
            aveshock = aveshock + sleeve.shock
        }
    }
    avesync = avesync / sleeveArr.length
    aveshock = aveshock / sleeveArr.length
    let report = "AVESYNC: " + ns.formatNumber(avesync,1,1000) + "%; AVESHOCK: " + ns.formatNumber(aveshock, 1, 1000) + "%; NUMBERSLEEVES: " + sleeveArr.length
    let returnmsg = {
        "report": report,
        "avesync": avesync
    }
    return returnmsg
}

async function randomCrime(ns, sleeveArr) { // converts one random sleeve into crime
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
    let sleeveSelect = Math.floor(Math.random() * sleeveArr.length)
    let crimeSelect = Math.floor(Math.random() * crimes.length)
    await ns.sleeve.setToCommitCrime(sleeveSelect,crimes[crimeSelect])
    let wait = (ns.sleeve.getTask(sleeveSelect).cyclesNeeded / 5) 
    let report =  "Waiting " + wait + "s while committing " + crimes[crimeSelect]
    let returnmsg = {
        "report": report,
        "wait": wait
    }
    return returnmsg
}

