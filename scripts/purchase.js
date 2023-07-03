/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	await ns.sleep(100);
	ns.moveTail(690, 495)
	ns.resizeTail(750, 300)
	const numberServers = ns.getPurchasedServerLimit()
	let n = 3
	const files = ["hack.js", "spawn.js"]
	// INITIAL PURCHASE OF SERVERS
	while (ns.getPurchasedServers().length < numberServers) {
		let ram = 2 ** n;
		let i = ns.getPurchasedServers().length;
		while (i < numberServers) {
			await ns.print("Purchasing: $" + ns.formatNumber(ns.getPurchasedServerCost(ram), 0) + " for " + ram + " ram")
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				let hostname = ns.purchaseServer("markwr-" + i, ram);
				ns.scp(files, hostname);
				await ns.exec("spawn.js", hostname);
				await ns.print("SUCCESS Purchased: " + hostname + " with " + ram + "GB RAM") 
				++i;
				await ns.sleep(1001);
			}
		}
		await ns.sleep(1002);
	}
	// ONCE HAVE MAX SERVER - UPGRADE
	if (ns.getPurchasedServers().length == numberServers) {
		await ns.print(ns.getPurchasedServerMaxRam() + " max RAM")
		let maxed = [];
		while (maxed.length < numberServers) {
			await ns.print("Upgrading")
			let i = 0; 
			while (i < numberServers) {
				let hostname = "markwr-" + i;
				let currentn = ns.getServerMaxRam(hostname)
				let ram = currentn * 2;
				if (ram <= ns.getPurchasedServerMaxRam()) {
                    let cost = ns.getPurchasedServerUpgradeCost(hostname, ram)
                    let cost1 = ns.formatNumber(cost, 4, 1000, true);
                    let cost2 = ns.formatNumber(2 * cost, 4,1000,true);
					await ns.print("INFO $" + cost1 + " ($" + (cost2) + ") to upgrade " + hostname + " to " + ram + "GB ram.")
					if (ns.getServerMoneyAvailable("home") > (2 * ns.getPurchasedServerUpgradeCost(hostname, ram))) {
						await ns.upgradePurchasedServer(hostname, ram)
						await ns.print("SUCCESS Upgraded " + hostname + " to " + ram + "GB RAM")
						await ns.scriptKill("hack.js", hostname)
						await ns.scp(files, hostname);
						ns.exec("spawn.js", hostname);
						await ns.sleep(1003)
					}
				} else {
					await ns.print("WARN " + hostname + " is fully upgraded")
					if (maxed.includes(hostname) != true) {
						maxed.push(hostname)
					}
				}
				++i;
				await ns.sleep(1004)
			}
		}
	}
	await ns.sleep(1005)
	await ns.print("SUCCESS All servers fully upgraded")
}