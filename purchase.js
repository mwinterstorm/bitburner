/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
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
				await ns.sleep(5000)
				++i;
				await ns.sleep(10001);
			}
			await ns.sleep(10002);
		}
		// ++n
		await ns.sleep(10092);

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
						await ns.sleep(5003)
					}
				} else {
					await ns.print("WARN " + hostname + " is fully upgraded")
					if (maxed.includes(hostname) != true) {
						maxed.push(hostname)
					}
					await ns.sleep(5004)
				}
				++i;
				await ns.sleep(5005)
			}
			await ns.sleep(5006)
		}
		await ns.sleep(5007)
	}
	await ns.sleep(5008)
	await ns.print("SUCCESS All servers fully upgraded")
}