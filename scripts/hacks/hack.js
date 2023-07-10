/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	// ns.tail()
	const host = ns.getHostname()
	const threads = ns.args[0]
	while (true) {
		let target = ns.readPort(7);
		while (target == "NULL PORT DATA") {
			// let error = "FAIL Empty Coordination Data (retrying in 5s): " + host + " " + target;
			// await ns.tryWritePort(8, error)
			// await ns.print(error)
			// await ns.sleep(5000)
			// target = ns.readPort(7);
			target = ns.readPort(6);
			let error = "FAIL Empty Coordination Data on " + host + " defaulting to " + target;
			await ns.tryWritePort(8, error)
			await ns.print(error)
			await ns.sleep(5000)
		}
		await ns.print("Target: " + target + " from " + host + "(" + threads + " threads)")
		let minsec = ns.getServerMinSecurityLevel(target);
		if ((minsec + 5) > (minsec * 1.33)) {
			var securityThresh = minsec + 5;
		} else {
			var securityThresh = minsec * 1.33
		}
		// random number for comparing to percentage of max money
		let moneyAvailable = ns.getServerMoneyAvailable(target)
		let monavail = ns.formatNumber(moneyAvailable, 4, 1000, true)
		let maxMoney = ns.getServerMaxMoney(target)
		let maxmon1 = ns.formatNumber(maxMoney, 4, 1000, true)
		let targ = Math.random();
		// calc percentage of max money
		let thres = moneyAvailable / maxMoney;
		// await ns.print("Selector: " + targ);
		// await ns.print("Target: " + thres);
		// check security and weaken if needed
		let seclev = ns.getServerSecurityLevel(target)
		if (seclev > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			let weaktime = ns.getWeakenTime(target);
			let weakMin = await Math.floor(weaktime / 60000)
			let weakSec = await (weaktime - (weakMin * 60000)) / 1000
			await ns.print("Weakening: " + weakMin + ":" + weakSec.toFixed(0) + " (" + seclev.toFixed(2) + " / " + securityThresh.toFixed(2) + ")")
			let weaklog = await ns.weaken(target);
			let weaklog2 = seclev - weaklog
			let report = "INFO Weakened " + target + " from " + host + ": " + seclev.toFixed(2) + " - " + weaklog.toFixed(2) + " = " + weaklog2.toFixed(2) + " (" + securityThresh.toFixed(2) + ")";
			await ns.print(report)
			// await ns.tryWritePort(8, report)
			// compare random to percentage of max money 
		} else if (targ > thres) {
			// more likely to grow when percentage of max money is low
			let growtime = ns.getGrowTime(target);
			let growMin = await Math.floor(growtime / 60000)
			let growSec = await (growtime - (growMin * 60000)) / 1000
			await ns.print("Growing: " + growMin + ":" + growSec.toFixed(0) + " (" + monavail + " / " + maxmon1 + ")")
			let growlog = await ns.grow(target);
			let monlog = moneyAvailable * growlog
			let monlog4 = ns.formatNumber(monlog, 4, 1000, true)
			let report = "WARN Grown " + target + " from " + host + ": " + ns.formatPercent(growlog - 1, 4) + " (" + monlog4 + " / " + maxmon1 + ")"
			await ns.print(report)
			// await ns.tryWritePort(8, report)
		} else {
			// more likely to hack if percentage of max money is high
			let hacktime = ns.getHackTime(target);
			let hackMin = await Math.floor(hacktime / 60000)
			let hackSec = await (hacktime - (hackMin * 60000)) / 1000
			await ns.print("Hacking: " + hackMin + ":" + hackSec.toFixed(0) + " (" + monavail + " / " + maxmon1 + ")")
			let hacklog = await ns.hack(target);
			let monlog2 = moneyAvailable - hacklog;
			let hacklog1 = ns.formatNumber(hacklog, 4, 1000, true)
			let monlog3 = ns.formatNumber(monlog2, 4, 1000, true)
			let report = "SUCCESS Hacked " + target + " from " + host + ": " + hacklog1 + " (" + monlog3 + " / " + maxmon1 + ")"
			await ns.print(report)
			await ns.tryWritePort(8, report)

		}
	}
}