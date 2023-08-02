
/** @param {NS} ns */
export async function main(ns) {
    // ns.tail()
    ns.disableLog("ALL");
    const upgrades = await ns.hacknet.getHashUpgrades()
    while (true) {
        let wait = Math.random() * 10000
        await raiseCash(ns, upgrades)
        await ns.sleep(wait)
    }
}

async function raiseCash(ns, upgrades) {
    let cost = ns.hacknet.hashCost(upgrades[0], 1)
    let multiplier = 1000000
    let capacity = ns.hacknet.hashCapacity()
    let hashes = ns.hacknet.numHashes()
    if ((hashes / capacity) > Math.random() / 2) {
        let x = Math.floor(hashes / cost)
        for (let y = 1; y < x; y++) {
            await ns.hacknet.spendHashes(upgrades[0])
        }
        ns.print("SUCCESS! Raised $" + ns.formatNumber(x * multiplier, 3, 1000, true))
        // need to add better existing earnings report handling in - read port and add new earnings
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

