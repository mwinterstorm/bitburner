/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    ns.disableLog("ALL");
    const sleeveScripts = [
        "sleeves/sleeveControl.js"
    ]
    for (let s = 0; s < sleeveScripts.length; s++) {
        if (ns.scriptRunning(sleeveScripts[s], "home")) {
            await ns.scriptKill(sleeveScripts[s], "home");
        }
    }
    while (true) {
        let sleeveArr = await getSleeves(ns)
        for (let s = 0; s < sleeveArr.length; s++) {
            let sNum = sleeveArr[s].number
            let city = sleeveArr[s].city
            let training = await trainStat(ns, sNum, city)
            ns.print("Training " + training.training + " for " + training.wait + "s")
            await ns.sleep(training.wait * 1000)
        }
    }
}

async function trainStat(ns, sNum, city) {
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
            if (maxValue > minValue) {
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
            }
            await ns.sleep(wait * 100)
        } else {
            //travel to city
            let cities = Object.keys(gyms)
            let destination = cities[Math.floor(Math.random() * cities.length)]
            await ns.travel(sNum, destination)
            await ns.sleep(1000)
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