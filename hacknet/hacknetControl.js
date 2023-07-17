/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    const upgradedelay = 10
    let upgradecount = 0
    while (true) {
        let numberServers = ns.hacknet.numNodes()
        if (numberServers == 0) {
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
    let number = ns.hacknet.numNodes()
    let totalProd = 0
    for (let i = 0; i < number; i++) {
        let node = ns.hacknet.getNodeStats(i)
        totalProd = totalProd + node.production
    }
    await ns.clearPort(11);
    await ns.tryWritePort(11, totalProd);
}

async function growNet(ns) {
    let maxServers = ns.hacknet.maxNumNodes()
    let numberServers = ns.hacknet.numNodes()
    let hacknetEarnings = ns.getMoneySources().sinceInstall.hacknet
    let hacknetCost = ns.getMoneySources().sinceInstall.hacknet_expenses
    let money = ns.getPlayer().money
    if (hacknetEarnings > (2 * hacknetCost)) {
        if (numberServers < maxServers) {
            ns.hacknet.purchaseNode()
        } else {
            let randomServer = Math.floor(Math.random() * numberServers)
            let randomiseUpgrade = Math.random()
            if (randomiseUpgrade < 0.2) {
                let cost = ns.hacknet.getCoreUpgradeCost(randomServer)
                if (money >= 2 * cost) {
                    ns.hacknet.upgradeCore(randomServer)
                }
            } else if (randomiseUpgrade < .5) {
                let cost = ns.hacknet.getRamUpgradeCost(randomServer)
                if (money >= 2 * cost) {
                    ns.hacknet.upgradeRam(randomServer)
                }
            } else {
                let cost = ns.hacknet.getLevelUpgradeCost(randomServer)
                if (money >= 2 * cost) {
                    ns.hacknet.upgradeLevel(randomServer)
                }
            }
        }
    }
}
