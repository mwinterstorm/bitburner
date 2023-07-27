
/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    ns.disableLog("ALL");
    const upgrades = await ns.hacknet.getHashUpgrades()
    while (true) {
        await raiseCash(ns, upgrades)
        await growNet(ns, upgrades)
        await reporting(ns, upgrades)
        await ns.sleep(Math.random() * 10000)
    }
}

async function raiseCash(ns, upgrades) {
    // ns.print(upgrades)
    let cost = ns.hacknet.hashCost(upgrades[0],1)
    let multiplier = 1000000
    let capacity = ns.hacknet.hashCapacity()
    let hashes = ns.hacknet.numHashes()
    if ((hashes / capacity) > Math.random()) {
        let numberServers = await ns.hacknet.numNodes()
        let randomServer = Math.floor(Math.random() * numberServers)
        let cacheCost = ns.hacknet.getCacheUpgradeCost(randomServer, 1)
        let money = await ns.getPlayer().money
        let cacheLevel = ns.hacknet.getNodeStats(randomServer).cache
        if (cacheCost < (money / cacheLevel) && money > cacheCost) {
            ns.hacknet.upgradeCache(randomServer,1)
            ns.print("INFO! Upgrade cache of " + randomServer + " to level " + (cacheLevel + 1) + ", cost $" + ns.formatNumber( cacheCost , 3, 1000, true) )
        }
        let x = Math.floor(hashes / cost)
        for (let y = 1; y < x; y++ ) {
            await ns.hacknet.spendHashes(upgrades[0])
        }
        ns.print("SUCCESS! Raised $" + ns.formatNumber(x * multiplier, 3, 1000, true))
        await ns.sleep(20000)
    } 

}

async function reporting(ns, upgrades) {
    let number = await ns.hacknet.numNodes()
    let totalProd = 0
    let cashCost = ns.hacknet.hashCost(upgrades[0],1)
    let cashHash = 1000000
    let cashMultiplier = cashHash / cashCost
    for (let i = 0; i < number; i++) {
        let node = await ns.hacknet.getNodeStats(i)
        totalProd = totalProd + node.production
    }
    let report = {
        "totalEPS": totalProd * cashMultiplier,
        "totalEarnings": +ns.getMoneySources().sinceInstall.hacknet,
        "totalCost": -ns.getMoneySources().sinceInstall.hacknet_expenses
    }
    let string = JSON.stringify(report);
    await ns.clearPort(11);
    await ns.tryWritePort(11, string);

}

async function growNet(ns, upgrades) {
    let numberServers = await ns.hacknet.numNodes()
    if (numberServers === 0) {
        await ns.hacknet.purchaseNode()
        numberServers++
    }
    let maxServers = await ns.hacknet.maxNumNodes()
    let hacknetEarnings = await ns.getMoneySources().sinceInstall.hacknet
    let hacknetCost = await -ns.getMoneySources().sinceInstall.hacknet_expenses
    let hacknetProfit = hacknetEarnings - hacknetCost
    let money = await ns.getPlayer().money
    let cashCost = ns.hacknet.hashCost(upgrades[0],1)
    let cashHash = 1000000
    let cashMultiplier = cashHash / cashCost
    if (hacknetEarnings > (1.0 * hacknetCost)) {
        let newServerCost = ns.hacknet.getPurchaseNodeCost()
        if (numberServers < maxServers && hacknetProfit > (1.1 * newServerCost)) {
            ns.print("Attempt to purchase new server")
            if (newServerCost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) ) {
                await ns.hacknet.purchaseNode()
            }
        }
        let randomServer = Math.floor(Math.random() * numberServers)
        let totalProduction = ns.hacknet.getNodeStats(randomServer).totalProduction * cashMultiplier
        let randomiseUpgrade = Math.random()
        if (randomiseUpgrade < 0.1) {
            let cost = await ns.hacknet.getCoreUpgradeCost(randomServer)
            ns.print("Attempt to upgrade Core of " + randomServer + ", cost $" + ns.formatNumber( cost , 3, 1000, true) + " prod: " + ns.formatNumber(totalProduction, 3, 1000, true))
            if (cost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) && totalProduction > cost) {
                ns.print("INFO! Upgrade Core of " + randomServer + ", cost $" + ns.formatNumber( cost , 3, 1000, true) )
                await ns.hacknet.upgradeCore(randomServer)
            }
        } else if (randomiseUpgrade < .35) {
            let cost = await ns.hacknet.getRamUpgradeCost(randomServer)
            ns.print("Attempt to upgrade RAM of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true) + " prod: " + ns.formatNumber(totalProduction, 3, 1000, true))
            if (cost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) && totalProduction > cost) {
                ns.print("INFO! Upgrade RAM of " + randomServer + ", cost: " + ns.formatNumber(cost, 3, 1000, true) )
                await ns.hacknet.upgradeRam(randomServer)
            }
        } else if (randomiseUpgrade < .94) {
            let cost = await ns.hacknet.getLevelUpgradeCost(randomServer)
            ns.print("Attempt to upgrade Level of " + randomServer + ", cost: " + ns.formatNumber(cost, 3 , 1000, true) + " prod: " + ns.formatNumber(totalProduction, 3, 1000, true))
            if (cost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) && totalProduction > cost) {
                ns.print("INFO! Upgrade Level of " + randomServer + ", cost: " + ns.formatNumber(cost, 3 , 1000, true) )
                await ns.hacknet.upgradeLevel(randomServer)
            }
        }

    }
}
