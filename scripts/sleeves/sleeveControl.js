/** @param {NS} ns */
export async function main(ns) {
    // ns.disableLog("ALL");
    ns.tail()
    let wait = 60 // in seconds
    while (true) {
        let sleeveArr = getSleeves(ns)
        for (let s = 0; s < sleeveArr.length; s++) {
            let sNum = sleeveArr[s].number
            let city = sleeveArr[s].city
            let waitModifier = (Math.random() * 10)
            if (Math.random() > (sleeveArr[sNum].sync / 100)) { // initialise 
                let returnmsg = await sleeveSync(ns, sleeveArr[sNum])
                wait = parseInt((wait * .93) + waitModifier)
                let time = getTime()
                ns.print(time + " - Initialising " + returnmsg.type + " for " + ns.formatNumber(wait, 1, 1000) + " secs - " + returnmsg.report)
                ns.print("main-1")
                await ns.sleep(((wait * 1000) / sleeveArr.length) + 500)
            } else if (Math.random() < (sleeveArr[sNum].shock / 100) && Math.random() < (sleeveArr[sNum].shock / 150)) { // initialise 
                let returnmsg = await sleeveSync(ns, sleeveArr[sNum])
                wait = parseInt((wait * .92) + waitModifier)
                let time = getTime()
                ns.print(time + " - Initialising " + returnmsg.type + " for " + ns.formatNumber(wait, 1, 1000) + " secs - " + returnmsg.report)
                ns.print("main-2")
                await ns.sleep(((wait * 1000) / sleeveArr.length) + 500)
            } else if (ns.heart.break() > -54000 && Math.random() < 0.70) { // 66% change to commit crime if cannot yet start a gang
                let returnmsg = await randomCrime(ns, sleeveArr[sNum])
                let time = getTime()
                ns.print(time + " - " + returnmsg.report)
                wait = returnmsg.wait
                ns.print("main-3")
                await ns.sleep((((wait * 1000) + 300) / sleeveArr.length) + 500)
            } else if (Object.keys(ns.getPlayer().jobs).length > 0 && Math.random() < 0.66) { // then 66% chance to work in Company
                let returnmsg = await randomCompany(ns, sleeveArr[sNum])
                let time = getTime()
                wait = (wait * .95) + waitModifier
                if (wait < 2) {
                    wait = wait + (Math.random() * 20)
                } else if (wait > 300) {
                    wait = wait - (Math.random() * 120)
                }
                let report = " - Waiting " + ns.formatNumber(wait, 1, 1000) + "s while working at " + returnmsg.job
                ns.print(time + report)
                ns.print("main-4")
                await ns.sleep(((wait * 1000) / sleeveArr.length) + 500)
            } else if (Math.random() < 0.66) { // then 66% chance to train physical 
                let physical = await trainPhysical(ns, sNum, city)
                let time = getTime()
                wait = physical.wait
                let report = " - Waiting " + ns.formatNumber(wait, 1, 1000) + "s while training " + physical.training
                ns.print(time + report)
                ns.print("main-5")
                await ns.sleep(((wait * 1000) / sleeveArr.length) + 500)
            } else if (Math.random() < 0.66) { // then 66% change to train mental 
                let mental = await trainMental(ns, sNum, city)
                let time = getTime()
                wait = mental.wait
                let report = " - Waiting " + ns.formatNumber(wait, 1, 1000) + "s while training " + mental.training
                ns.print(time + report)
                ns.print("main-6")
                await ns.sleep(((wait * 1000) / sleeveArr.length) + 500)
            } else { // otherwise commit crime
                let returnmsg = await randomCrime(ns, sleeveArr[sNum])
                let time = getTime()
                ns.print(time + " - " + returnmsg.report)
                wait = returnmsg.wait
                ns.print("main-7")
                await ns.sleep(((wait * 1000 + 150) / sleeveArr.length) + 500)
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

async function trainPhysical(ns, sNum, city) {
    const gyms = {
        "Aevum": "Snap Fitness Gym",
        "Sector-12": "Powerhouse Gym",
        "Volhaven": "Millenium Fitness Gym"
    }
    const physical = [
        "strength",
        "defense",
        "dexterity",
        "agility",
        // "charisma"
    ]
    let isTraining = false
    let player = ns.getPlayer().skills
    let playarr = Object.keys(player)
    while (isTraining == false) {
        if (gyms.hasOwnProperty(city)) {
            let minStat = playarr[0]
            let minValue = player[playarr[0]]
            let maxValue = 0
            for (let i = 0; i < playarr.length; i++) {
                var value = player[playarr[i]];
                if (value < minValue) {
                    minValue = value;
                    minStat = playarr[i]
                }
                if (value > maxValue && physical.includes(playarr[i])) {
                    maxValue = value
                }
            }
            let wait = Math.floor(60 * Math.random()) + 5
            if (maxValue > minValue && (maxValue - minValue) < 180) {
                wait = maxValue - minValue + 5
            }
            if (physical.includes(minStat)) {
                let gym = gyms[city]
                await ns.sleeve.setToGymWorkout(sNum, gym, minStat)
                isTraining = true
                let training = {
                    "wait": wait,
                    "training": minStat
                }
                return training
            } else {
                let statIndex = playarr.indexOf(minStat, 0)
                playarr.splice(statIndex, 1)
                ns.print("phy-1")
                await ns.sleep(1000)
            }
        } else {
            //travel to city
            let cities = Object.keys(gyms)
            let destination = cities[Math.floor(Math.random() * cities.length)]
            await ns.travel(sNum, destination)
            ns.print("phy-2")
            await ns.sleep(1000)
        }
    }
}

async function trainMental(ns, sNum, city) {
    const unis = {
        "Aevum": "Summit University",
        "Sector-12": "Rothman University",
        "Volhaven": "ZB Institute of Technology"
    }
    const mental = {
        "hacking": "Algorithms",
        "charisma": "Leadership"
    }
    let isTraining = false
    while (isTraining == false) {
        if (unis.hasOwnProperty(city)) {
            let wait = Math.floor(60 * Math.random()) + 5
            let uni = unis[city]
            let skills = Object.keys(mental)
            let skill = skills[Math.floor(Math.random() * skills.length)]
            let course = mental[skill]
            await ns.sleeve.setToUniversityCourse(sNum, uni, course)
            isTraining = true
            let training = {
                "wait": wait,
                "training": skill
            }
            return training
        } else {
            //travel to city
            let cities = Object.keys(unis)
            let destination = cities[Math.floor(Math.random() * cities.length)]
            await ns.travel(sNum, destination)
            ns.print("mental")
            await ns.sleep(1000)
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
