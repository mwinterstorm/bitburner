var profitCliff = 1.00

/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    ns.disableLog("ALL");
    const upgrades = await ns.hacknet.getHashUpgrades()
    while (true) {
        let wait = Math.random() * 10000
        await raiseCash(ns, upgrades)
        await growNet(ns, upgrades)
        await ns.sleep(wait)
    }
}

async function raiseCash(ns, upgrades) {
    // ns.print(upgrades)
    let cost = ns.hacknet.hashCost(upgrades[0], 1)
    let multiplier = 1000000
    let capacity = ns.hacknet.hashCapacity()
    let hashes = ns.hacknet.numHashes()
    if ((hashes / capacity) > Math.random() && (hashes / capacity) > .125) {
        let numberServers = await ns.hacknet.numNodes()
        let randomServer = Math.floor(Math.random() * numberServers)
        let cacheCost = ns.hacknet.getCacheUpgradeCost(randomServer, 1)
        let money = await ns.getPlayer().money
        let cacheLevel = ns.hacknet.getNodeStats(randomServer).cache
        if (cacheCost < (money / cacheLevel) && money > cacheCost) {
            ns.hacknet.upgradeCache(randomServer, 1)
            let time = getTime()
            ns.print(time + " - INFO! Upgrade cache of " + randomServer + " to level " + (cacheLevel + 1) + ", cost $" + ns.formatNumber(cacheCost, 3, 1000, true))
        }
        let x = Math.floor(hashes / cost)
        for (let y = 1; y < x; y++) {
            await ns.hacknet.spendHashes(upgrades[0])
        }
        let time = getTime()
        ns.print(time + " - SUCCESS! Raised $" + ns.formatNumber(x * multiplier, 3, 1000, true))
        let port = ns.readPort(11)
        let report 
        if (port != "NULL PORT DATA") {
            port = JSON.parse(port)
            let currentEarnings = +port.totalEPS
            report = {
                "totalEPS": (x * multiplier) + currentEarnings,
                "totalEarnings": +ns.getMoneySources().sinceInstall.hacknet,
                "totalCost": -ns.getMoneySources().sinceInstall.hacknet_expenses
            }
        } else {
            report = {
                "totalEPS": (x * multiplier),
                "totalEarnings": +ns.getMoneySources().sinceInstall.hacknet,
                "totalCost": -ns.getMoneySources().sinceInstall.hacknet_expenses
            }
        }
        let string = JSON.stringify(report);
        await ns.tryWritePort(11, string);
    } else {
        let port = ns.readPort(11)
        let report 
        if (port != "NULL PORT DATA") {
            port = JSON.parse(port)
            let currentEarnings = +port.totalEPS
            report = {
                "totalEPS": Number(0) + currentEarnings,
                "totalEarnings": +ns.getMoneySources().sinceInstall.hacknet,
                "totalCost": -ns.getMoneySources().sinceInstall.hacknet_expenses
            }
        } else {
            report = {
                "totalEPS": Number(0),
                "totalEarnings": +ns.getMoneySources().sinceInstall.hacknet,
                "totalCost": -ns.getMoneySources().sinceInstall.hacknet_expenses
            }
        }
        let string = JSON.stringify(report);
        await ns.tryWritePort(11, string);
    }
}

async function growNet(ns, upgrades) {
    let numberServers = await ns.hacknet.numNodes()
    let hacknetEarnings = await ns.getMoneySources().sinceInstall.hacknet
    let money = await ns.getPlayer().money
    if (numberServers === 0) { // initial purchase of servers
        await ns.hacknet.purchaseNode()
        numberServers++
    }
    if (hacknetEarnings === 0) {
        let randomServer = Math.floor(Math.random() * numberServers)
        let cost = await ns.hacknet.getLevelUpgradeCost(randomServer)
        if (cost < money) {
            let newServerCost = ns.hacknet.getPurchaseNodeCost()
            if (newServerCost < money) {
                await ns.hacknet.purchaseNode()
                money = money - newServerCost
            }
            let time = getTime()
            ns.print(time + " - INFO! Upgrade Level of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true))
            await ns.hacknet.upgradeLevel(randomServer)
            money = money - cost
        }
    }
    let maxServers = await ns.hacknet.maxNumNodes()
    let hacknetCost = await -ns.getMoneySources().sinceInstall.hacknet_expenses
    let hacknetProfit = hacknetEarnings - hacknetCost
    let cashCost = ns.hacknet.hashCost(upgrades[0], 1)
    let cashHash = 1000000
    let cashMultiplier = cashHash / cashCost
    if (hacknetEarnings > (profitCliff * hacknetCost)) {
        let newServerCost = ns.hacknet.getPurchaseNodeCost()
        if (numberServers < maxServers && hacknetProfit > ((1.1 * profitCliff) * newServerCost)) {
            ns.print("Attempt to purchase new server")
            if (newServerCost < money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1)))) {
                let time = getTime()
                ns.print(time + " - SUCCESS! Purchased new server " + ", cost $" + ns.formatNumber(newServerCost, 3, 1000, true))
                await ns.hacknet.purchaseNode()
                profitCliff = profitCliff + 1
            } else {
                let time = getTime()
                ns.print(time + " - FAIL! Purchase new server, required profit: " + ns.formatPercent(((1.1 * profitCliff) * newServerCost)/ hacknetProfit - 1) + " & money: $" + ns.formatNumber(money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))),3,1000, true))

            }
        }
        let randomServer = Math.floor(Math.random() * numberServers)
        let totalProduction = ns.hacknet.getNodeStats(randomServer).totalProduction * cashMultiplier
        let randomiseUpgrade = Math.random()
        if (randomiseUpgrade < 0.1) {
            let cost = await ns.hacknet.getCoreUpgradeCost(randomServer)
            ns.print("Attempt to upgrade Core of " + randomServer + ", cost $" + ns.formatNumber(cost, 3, 1000, true) + " prod: " + ns.formatNumber(totalProduction, 3, 1000, true))
            if (cost < money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))) && totalProduction > cost * profitCliff) {
                let time = getTime()
                ns.print(time + " - INFO! Upgrade Core of " + randomServer + ", cost $" + ns.formatNumber(cost, 3, 1000, true))
                await ns.hacknet.upgradeCore(randomServer)
                profitCliff = profitCliff + 0.5
            } else {
                let time = getTime()
                ns.print(time + " - FAIL! Upgrade Core of " + randomServer + ", required profit: " + ns.formatPercent(profitCliff - 1) + " & money: $" + ns.formatNumber(money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))),3,1000, true))
            }
        } else if (randomiseUpgrade < .35) {
            let cost = await ns.hacknet.getRamUpgradeCost(randomServer)
            ns.print("Attempt to upgrade RAM of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true) + " prod: " + ns.formatNumber(totalProduction, 3, 1000, true))
            if (cost < money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))) && totalProduction > cost * profitCliff) {
                let time = getTime()
                ns.print(time + " - INFO! Upgrade RAM of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true))
                await ns.hacknet.upgradeRam(randomServer)
                profitCliff = profitCliff + 0.2
            } else {
                let time = getTime()
                ns.print(time + " - FAIL! Upgrade RAM of " + randomServer + ", required profit: " + ns.formatPercent(profitCliff - 1) + " & money: $" + ns.formatNumber(money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))),3,1000, true))
            }
        } else if (randomiseUpgrade < .94) {
            let cost = await ns.hacknet.getLevelUpgradeCost(randomServer)
            ns.print("Attempt to upgrade Level of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true) + " prod: " + ns.formatNumber(totalProduction, 3, 1000, true))
            if (cost < money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))) && totalProduction > cost * profitCliff) {
                let time = getTime()
                ns.print(time + " - INFO! Upgrade Level of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true))
                await ns.hacknet.upgradeLevel(randomServer)
                profitCliff = profitCliff + 0.1
            } else {
                let time = getTime()
                ns.print(time + " - FAIL! Upgrade Level of " + randomServer + ", required profit: " + ns.formatPercent(profitCliff - 1) + " & money: $" + ns.formatNumber(money * ((1 / (numberServers ^ 2)) + (1 - numberServers / (numberServers + 1))),3,1000, true))
            }
        }

    } else { 
        if (profitCliff > 0.01) {
            profitCliff = profitCliff - (0.003 * Math.random())
            if (Math.random() < 0.1) {
                let time = getTime()
            }
            ns.print(time + " - FAIL! required profit: " + ns.formatPercent(profitCliff - 1) )
        } else {
            profitCliff = 2.5
            let time = getTime()
            ns.print(time + " - FAIL! required profit: " + ns.formatPercent(profitCliff - 1) )

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