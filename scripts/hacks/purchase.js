/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	// ns.tail();
	// await ns.sleep(100);
	// ns.moveTail(690, 495)
	// ns.resizeTail(750, 300)
	const numberServers = ns.getPurchasedServerLimit()
	let n = 3
	const files = ["hacks/hack.js", "hacks/spawn.js"]
	// INITIAL PURCHASE OF SERVERS
	while (ns.getPurchasedServers().length < numberServers) {
		let ram = 2 ** n;
		let i = ns.getPurchasedServers().length;
		while (i < numberServers) {
			let time = getTime()
			let report = time + " - Purchasing: markwr-" + i + "... $" + ns.formatNumber(ns.getPurchasedServerCost(ram), 0) + " for " + ns.formatRam(ram,3) + " ram";
			await ns.print(report)
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				let hostname = ns.purchaseServer("markwr-" + i, ram);
				ns.scp(files, hostname);
				await ns.exec("hacks/spawn.js", hostname);
				let time = getTime();
				let report = time + " - SUCCESS Purchased: " + hostname + " with " + ns.formatRam(ram,3) + " RAM"
				await ns.print(report)
				await ns.tryWritePort(8, report) 
				++i;
				await ns.sleep(10001);
			}
			if (ns.getServerMoneyAvailable("home") < 325000000) {
				await ns.sleep(60002);
			} else {
				await ns.sleep(1000)
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
					let time = getTime();
					let report = time + " - INFO $" + cost1 + " ($" + (cost2) + ") to upgrade " + hostname + " to " + ns.formatRam(ram,3) + " ram.";
					await ns.print(report)
					if (ns.getServerMoneyAvailable("home") > (2 * ns.getPurchasedServerUpgradeCost(hostname, ram))) {
						await ns.upgradePurchasedServer(hostname, ram)
						let time = getTime()
						let report = time + " - SUCCESS Upgraded " + hostname + " to " + ns.formatRam(ram,3) + " RAM"
						await ns.print(report)
						await ns.tryWritePort(8, report)
						await ns.scriptKill("hacks/hack.js", hostname)
						await ns.scp(files, hostname);
						ns.exec("hacks/spawn.js", hostname);
						await ns.sleep(1003)
					}
				} else {
					let time = getTime()
					let report = time + " - WARN " + hostname + " is fully upgraded"
					await ns.print(report)
					await ns.tryWritePort(8, report)
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
	let time = getTime()
	let report = time + " - SUCCESS All servers fully upgraded"
	await ns.print(report)
	await ns.tprint(report)
	await ns.tryWritePort(8, report)

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