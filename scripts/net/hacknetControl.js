/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    const upgradedelay = 2
    let upgradecount = 0
    while (true) {
        let numberServers = await ns.hacknet.numNodes()
        if (numberServers === 0) {
            await ns.hacknet.purchaseNode()
        }
        if (upgradecount >= upgradedelay) {
            await growNet(ns)
            upgradecount = 0
        } else {
            upgradecount = upgradecount + 1
        }
        await reporting(ns)
        await ns.sleep(30000)
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
    let money = await ns.getPlayer().money
    if (hacknetEarnings > (1.1 * hacknetCost)) {
        if (numberServers < maxServers && Math.random() < 0.25) {
            if (money > 100 * ns.hacknet.getPurchaseNodeCost())
            await ns.hacknet.purchaseNode()
        } else {
            let randomServer = Math.floor(Math.random() * numberServers)
            let totalProduction = ns.hacknet.getNodeStats(randomServer)
            let randomiseUpgrade = Math.random()
            if (randomiseUpgrade < 0.1) {
                let cost = await ns.hacknet.getCoreUpgradeCost(randomServer)
                if (money >= 100 * cost && totalProduction > cost) {
                    await ns.hacknet.upgradeCore(randomServer)
                }
            } else if (randomiseUpgrade < .35) {
                let cost = await ns.hacknet.getRamUpgradeCost(randomServer)
                if (money >= 100 * cost && totalProduction > cost) {
                    await ns.hacknet.upgradeRam(randomServer)
                }
            } else {
                let cost = await ns.hacknet.getLevelUpgradeCost(randomServer)
                if (money >= 100 * cost && totalProduction > cost) {
                    await ns.hacknet.upgradeLevel(randomServer)
                }
            }
        }
    }
}
