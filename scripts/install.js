/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	ns.tail()
	await ns.sleep(100);
	ns.moveTail(85, 495)
	ns.resizeTail(600, 300)
	while (true) {
		let time = getTime();
		ns.print(time + " - Running install...")
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
								let time = getTime();
								ns.print(time + " - SUCCESS Running self.js with " + threads + " threads on " + servers[i])
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
						let time = getTime();
						ns.print(time + " - WARN Nuked " + servers[i])
						await ns.sleep(500)
						let threads = Math.floor(ns.getServerMaxRam(servers[i]) / 2.45)
						if (threads >= 1) {
							await ns.exec("self.js", servers[i], threads, servers[i])
							let time = getTime();
							ns.print(time + " - SUCCESS Running self.js with " + threads + " threads on " + servers[i])
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
		time = getTime();
        let waitPause = Math.random() * 120000
        ns.print("... complete, waiting: " + Math.floor(waitPause / 1000) + " seconds")
        await ns.sleep(waitPause)
	}
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