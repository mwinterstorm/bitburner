/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	ns.tail()
	await ns.sleep(100);
	ns.moveTail(85, 495)
	ns.resizeTail(600, 300)
	const files = ["self.js"]
	const servers = ns.scan()
	const hacklev = ns.getHackingLevel()
	var checkHacks = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	var hacks = []
	for (let h = 0; h < checkHacks.length; h++) {
		if (ns.fileExists(checkHacks[h], "home")) {
			hacks.push(checkHacks[h])
		}
	}
	await ns.sleep(500)
	for (let i = 0; i < servers.length; i++) {
		if (servers[i].includes("markwr") == false) {
			ns.scp(files, servers[i])
			let hackreq = ns.getServerRequiredHackingLevel(servers[i])
			if (ns.hasRootAccess(servers[i]) == true) {
				if (!ns.isRunning("self.js", servers[i], servers[i])) {
					if (hackreq <= hacklev) {
						let threads = Math.floor(ns.getServerMaxRam(servers[i]) / ns.getScriptRam("self.js"))
						if (threads >= 1) {
							await ns.exec("self.js", servers[i], threads, servers[i])
							ns.print("SUCCESS Running self.js with " + threads + " threads on " + servers[i])
							await ns.sleep(500)
						}
					}
				}
			} else {
				let portreq = ns.getServerNumPortsRequired(servers[i])
				if (portreq <= hacks.length) {
					for (let t = 0; t < hacks.length; t++) {
						if (hacks[t] == "BruteSSH.exe") {
							ns.brutessh(servers[i])
						}
						if (hacks[t] == "FTPCrack.exe") {
							ns.ftpcrack(servers[i])
						}
						if (hacks[t] == "relaySMTP.exe") {
							ns.relaysmtp(servers[i])
						}
						if (hacks[t] == "HTTPWorm.exe") {
							ns.httpworm(servers[i])
						}
						if (hacks[t] == "SQLInject.exe") {
							ns.sqlinject(servers[i])
						}
					}
					await ns.nuke(servers[i])
					ns.print("WARN Nuked " + servers[i])
					await ns.sleep(500)
						let threads = Math.floor(ns.getServerMaxRam(servers[i]) / 2.45)
						if (threads >= 1) {
							await ns.exec("self.js", servers[i], threads, servers[i])
							ns.print("Running self.js with " + threads + " threads")
							await ns.sleep(500)
						}
				}
			}
		}
		let nextservers = ns.scan(servers[i])
		for (let n = 0; n < nextservers.length; n++) {
			if (!servers.includes(nextservers[n])) {
				if (nextservers[n] != "home") {
					if (nextservers[n].includes("markwr") == false) {
						servers.push(nextservers[n])
					}
				}
			}
		}
	}
}