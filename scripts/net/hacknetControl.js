/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    while (true) {
        let numberServers = await ns.hacknet.numNodes()
        if (numberServers === 0) {
            await ns.hacknet.purchaseNode()
        }
        await growNet(ns)
        await reporting(ns)
        await ns.sleep(5000)
    }
}

async function reporting(ns) {
    let number = await ns.hacknet.numNodes()
    let totalProd = 0
    for (let i = 0; i < number; i++) {
        let node = await ns.hacknet.getNodeStats(i)
        totalProd = totalProd + node.production
    }
    let report = {
        "totalEPS": totalProd,
        "totalEarnings": +ns.getMoneySources().sinceInstall.hacknet,
        "totalCost": -ns.getMoneySources().sinceInstall.hacknet_expenses
    }
    let string = JSON.stringify(report);
    await ns.clearPort(11);
    await ns.tryWritePort(11, string);

}

async function growNet(ns) {
    let maxServers = await ns.hacknet.maxNumNodes()
    let numberServers = await ns.hacknet.numNodes()
    let hacknetEarnings = await ns.getMoneySources().sinceInstall.hacknet
    let hacknetCost = await -ns.getMoneySources().sinceInstall.hacknet_expenses
    let hacknetProfit = hacknetEarnings - hacknetCost
    let money = await ns.getPlayer().money
    if (hacknetEarnings > (1.0 * hacknetCost)) {
        let newServerCost = ns.hacknet.getPurchaseNodeCost()
        if (numberServers < maxServers && hacknetProfit > (2.4 * newServerCost)) {
            ns.print("Attempt to purchase new server")
            if (newServerCost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) ) {
                await ns.hacknet.purchaseNode()
            }
        }
        let randomServer = Math.floor(Math.random() * numberServers)
        let totalProduction = ns.hacknet.getNodeStats(randomServer).totalProduction
        let randomiseUpgrade = Math.random()
        if (randomiseUpgrade < 0.1) {
            let cost = await ns.hacknet.getCoreUpgradeCost(randomServer)
            ns.print("Attempt to upgrade Core, cost" + cost + " prod: " + totalProduction)
            if (cost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) && totalProduction > cost) {
                await ns.hacknet.upgradeCore(randomServer)
            }
        } else if (randomiseUpgrade < .35) {
            let cost = await ns.hacknet.getRamUpgradeCost(randomServer)
            ns.print("Attempt to upgrade RAM, cost: " + cost + " prod: " + totalProduction)
            if (cost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) && totalProduction > cost) {
                await ns.hacknet.upgradeRam(randomServer)
            }
        } else {
            let cost = await ns.hacknet.getLevelUpgradeCost(randomServer)
            ns.print("Attempt to upgrade Level, cost: " + cost + " prod: " + totalProduction)
            if (cost < money * ( ( 1 / ( numberServers ^ 2 ) ) + ( 1 - numberServers / ( numberServers + 1 ) ) ) && totalProduction > cost) {
                await ns.hacknet.upgradeLevel(randomServer)
            }
        }

    }
}
