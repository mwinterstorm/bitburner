/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail()
    let wait = 60 // in seconds
    while (true) {
        let sleeveArr = getSleeves(ns)
        for (let s = 0; s < sleeveArr.length; s++) {
            let sNum = sleeveArr[s].number
            let city = sleeveArr[s].city
            let waitModifier = (Math.random() * 10)

            // If committing crime, wait until finish
            if (sleeveArr[s].task.type == "CRIME") {
                let crimewait = (sleeveArr[s].task.cyclesNeeded - sleeveArr[s].task.cyclesWorked) / 5
                let time = getTime()
                ns.print(time + " - CRIME: Sleeve " + sNum + " is waiting " + crimewait + "s to finish " + sleeveArr[s].task.crimeType)
                await ns.sleep(crimewait * 1000 + 200)
            }

            // select activity - Initialising
            if (Math.random() > (sleeveArr[sNum].sync / 200) && sleeveArr[sNum].sync < 100) { // initialise where SYNC not 100% with high probability (decreases as sync improves)
                await sleeveSync(ns, sleeveArr[sNum])
                wait = parseInt((wait * .95) + waitModifier)
                await ns.sleep(((wait * 1000) / sleeveArr.length))
            } else if (Math.random() < (sleeveArr[sNum].shock / 150) && sleeveArr[sNum].sync == 100) { // initialise  
                await sleeveSync(ns, sleeveArr[sNum])
                wait = parseInt((wait * .92) + waitModifier)
                await ns.sleep(((wait * 1000) / sleeveArr.length))

            // Commit crimes if don't have enough karma to form gang
            } else if (ns.heart.break() > -54000 && Math.random() < 0.70) { // 70% chance to commit crime if cannot yet start a gang
                let returnmsg = await randomCrime(ns, sleeveArr[sNum])
                wait = returnmsg.wait
                await ns.sleep((((wait * 1000)) / sleeveArr.length))

            // Main random activities
            } else if (Object.keys(ns.getPlayer().jobs).length > 0 && Math.random() < 0.66) { // then 66% chance to work in Company
                await randomCompany(ns, sleeveArr[sNum])
                wait = (wait * .95) + waitModifier
                if (wait < 2) {
                    wait = wait + (Math.random() * 20)
                } else if (wait > 300) {
                    wait = wait - (Math.random() * 180)
                }
                await ns.sleep(((wait * 1000) / sleeveArr.length))
            } else if (Math.random() < 0.66 && ns.getPlayer().factions > 0) { // then 66% change to work in a random Faction
                await randomFaction(ns, sleeveArr[sNum])
                wait = (wait * .95) + waitModifier
                if (wait < 2) {
                    wait = wait + (Math.random() * 20)
                } else if (wait > 300) {
                    wait = wait - (Math.random() * 180)
                }
                await ns.sleep(((wait * 1000) / sleeveArr.length))
            } else if (Math.random() < 0.66) { // then 66% chance to train mental 
                let physical = await trainMental(ns, sNum, city)
                wait = physical.wait
                await ns.sleep(((wait * 1000) / sleeveArr.length))
            } else if (Math.random() < 0.66) { // then 66% change to train physical 
                let mental = await trainPhysical(ns, sNum, city)
                wait = mental.wait
                await ns.sleep(((wait * 1000) / sleeveArr.length))
            } else if (Math.random() < 0.08) { // then 8% chance to randomly travel 
                const cities = [
                    "Aevum",
                    "Chongqing",
                    "Ishima",
                    "New Tokyo",
                    "Sector-12",
                    "Volhaven"
                ]
                let destination = cities[Math.floor(Math.random() * cities.length)]
                let time = getTime()
                ns.print(time = "TRAVEL: Sleeve " + sNum + " is travelling to " + destination + " from " + city)
                await ns.sleeve.travel(sNum, destination)
                await ns.sleep(((wait * 1000 + 5000) / sleeveArr.length) - waitModifier)
            } else { // otherwise commit crime
                let returnmsg = await randomCrime(ns, sleeveArr[sNum])
                wait = returnmsg.wait
                await ns.sleep(((wait * 1000 + 200) / sleeveArr.length))
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
        if (sleeveTask === null) {
            sleeveTask = "idle"
        }
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
        type = "SYNCING"
    } else if (sleeve.shock >= 20) {
        if (sleeve.task.type != "RECOVERY") {
            await ns.sleeve.setToShockRecovery(sleeve.number)
        }
        type = "SHOCK REDUCTION"
    } else if (Math.random() < (sleeve.shock / 100)) {
        if (sleeve.task.type != "RECOVERY") {
            await ns.sleeve.setToShockRecovery(sleeve.number)
        }
        type = "SHOCK REDUCTION"
    }
    let returnmsg = {
        "report": "SYNC: " + ns.formatNumber(sleeve.sync, 1, 1000) + "% | SHOCK: " + ns.formatNumber(sleeve.shock, 1, 1000) + "%",
        "number": sleeve.number,
        "type": type,
        "sync": sleeve.sync,
        "shock": sleeve.shock
    }
    let time = getTime()
    ns.print(time + " - INITIALISING: Sleeve " + returnmsg.number + " is " + returnmsg.type + "; " + returnmsg.report)
    return 
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
    let time = getTime()
    let report = time + "CRIME: Sleeve " + sleeve.number + " is committing " + crimes[crimeSelect] + " (" + wait + "s)"
    let returnmsg = {
        "report": report,
        "wait": wait
    }
    ns.print(returnmsg.report)
    return returnmsg
}

async function randomCompany(ns, sleeve) { // converts one random sleeve into crime
    const jobs = Object.keys(ns.getPlayer().jobs)
    let jobselect = Math.floor(Math.random() * jobs.length)
    try {
        await ns.sleeve.setToCompanyWork(sleeve.number, jobs[jobselect])
        let returnmsg = {
            "sleeve": sleeve.number,
            "job": jobs[jobselect]
        }
        let time = getTime()
        let report = " - JOB: Sleeve " + returnmsg.sleeve + " is working at " + returnmsg.job
        ns.print(time + report)
        return 
    } catch (error) {
        await randomFaction(ns, sleeve)
        return 
    }
}

async function randomFaction(ns, sleeve) { // converts one random sleeve into a random faction
    const tasks = {
        "Aevum": ["field", "hacking", "security"],
        "Bachman & Associates": ["field", "hacking", "security"],
        "BitRunners": ["hacking"],
        "Blade Industries": ["field", "hacking", "security"],
        "The Black Hand": ["field", "hacking"],
        "Clarke Incorporated": ["field", "hacking", "security"],
        "The Covenant": ["field", "hacking"],
        "CyberSec": ["hacking"],
        "Daedalus": ["field", "hacking"],
        "ECorp": ["field", "hacking", "security"],
        "Four Sigma": ["field", "hacking", "security"],
        "Fulcrum Secret Technologies": ["hacking", "security"],
        "Illuminati": ["field", "hacking"],
        "Ishima": ["field", "hacking", "security"],
        "KuaiGong International": ["field", "hacking", "security"],
        "MegaCorp": ["field", "hacking", "security"],
        "Netburners": ["hacking"],
        "New Tokyo": ["field", "hacking", "security"],
        "NiteSec": ["hacking"],
        "NWO": ["field", "hacking", "security"],
        "OmniTek Incorporated": ["field", "hacking", "security"],
        "Sector-12": ["field", "hacking", "security"],
        "Silhouette": ["field", "hacking"],
        "Slum Snakes": ["field", "hacking", "security"],
        "Speakers for the Dead": ["field", "hacking", "security"],
        "The Syndicate": ["field", "hacking", "security"],
        "Tetrads": ["field", "security"],
        "Tian Di Hui": ["hacking", "security"],
    }
    const factions = ns.getPlayer().factions
    let factionSelect = Math.floor(Math.random() * factions.length)
    let faction = factions[factionSelect]
    if (Object.keys(tasks).includes(faction)) {
        let factionTasks = tasks[faction]
        let taskSelect = Math.floor(Math.random() * factionTasks.length)
        let task = factionTasks[taskSelect]
        try {
            await ns.sleeve.setToFactionWork(sleeve.number, faction, task)
            let returnmsg = {
                "sleeve": sleeve.number,
                "faction": faction,
                "task": task
            }
            let time = getTime()
            let report = " - FACTION: Sleeve " + sNum + " is working at " + returnmsg.faction + " doing " + returnmsg.task
            ns.print(time + report)
            return 
        } catch (error) {
            await randomCrime(ns, sleeve)
            return 
        }
    } else {
        ns.sleeve.setToIdle(sleeve.number)
        let returnmsg = {
            "sleeve": sleeve.number,
            "faction": "idle",
            "task": "idle"
        }
        let time = getTime()
        let report = " - FACTION: Sleeve " + returnmsg.sleeve + " is working at " + returnmsg.faction + " doing " + returnmsg.task
        ns.print(time + report)
        return 
    }
}

async function trainPhysical(ns, sNum, city) { // trains in the weakest physical skill
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
                let physical = {
                    "wait": wait,
                    "training": minStat
                }
                let report = getTime() + " - PHYSICAL: Sleeve " + sNum + " is training " + physical.training
                ns.print(report)
                return physical
            } else {
                let statIndex = playarr.indexOf(minStat, 0)
                playarr.splice(statIndex, 1)
                await ns.sleep(1000)
            }
        } else {
            //travel to city
            let cities = Object.keys(gyms)
            let destination = cities[Math.floor(Math.random() * cities.length)]
            await ns.sleeve.travel(sNum, destination)
            let time = getTime()
            ns.print(time + " - TRAVEL: Sleeve " + sNum + " is travelling to " + destination + " from " + city)
            await ns.sleep(1000)
            city = destination
        }
    }
}

async function trainMental(ns, sNum, city) { // trains randomly in either hacking or charisma
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
            if (Math.random() > 0.33) {
                skill = "hacking"
            }
            let course = mental[skill]
            await ns.sleeve.setToUniversityCourse(sNum, uni, course)
            isTraining = true
            let training = {
                "wait": wait,
                "training": skill
            }
            let time = getTime()
            let report = " - STUDY: Sleeve " + sNum + " is studying " + training.training
            ns.print(time + report)
            return training
        } else {
            //travel to city
            let cities = Object.keys(unis)
            let destination = cities[Math.floor(Math.random() * cities.length)]
            await ns.sleeve.travel(sNum, destination)
            let time = getTime()
            ns.print(time + " - TRAVEL: Sleeve " + sNum + " is travelling to " + destination + " from " + city)
            await ns.sleep(1000)
            city = destination
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