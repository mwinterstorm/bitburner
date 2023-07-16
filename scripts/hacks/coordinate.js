/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	// ns.tail()
	let installCount = 0
	while (true) {
		var servers = ns.scan()
        let hackedServers = 0
		for (let i = 0; i < servers.length; i++) {
			if (ns.scriptRunning("hacks/self.js", servers[i])) {
                hackedServers++
				if (ns.getServerMaxMoney(servers[i]) != 0) {
					const reqlev = ns.getServerRequiredHackingLevel(servers[i])
					const hacklev = ns.getHackingLevel()
					const highlimit = 0.66 * hacklev
					var lowlimit = 0.1 * hacklev
					if (hacklev > 6000) {
						lowlimit = 0.04 * hacklev
					}
					if (highlimit > reqlev) {
						if (Math.random() < (reqlev / lowlimit)) {
							while (!ns.tryWritePort(7, servers[i])) {
								await ns.sleep(25)
							}
							ns.tryWritePort(6, servers[i])
							ns.print("SUCCESS hack.js add: " + servers[i])
						} else {
							if (Math.random() < 0.1) {
								while (!ns.tryWritePort(7, servers[i])) {
									await ns.sleep(25)
								}
								ns.print("SUCCESS hack.js add: " + servers[i])
							} else {
								ns.print("WARN skipped: " + servers[i])

							}
						}
					} else {
						ns.print("WARN Hack too hard: " + servers[i])
					}
				} else {
					ns.print("FAIL No Money: " + servers[i])
				}
				await ns.sleep(25)
			}
			// then scan other servers and add
			let nextservers = ns.scan(servers[i])
			for (let n = 0; n < nextservers.length; n++) {
				if (!servers.includes(nextservers[n])) {
					if (nextservers[n] != "home") {
						if (nextservers[n].includes("markwr") == false) {
							servers.push(nextservers[n])
							await ns.sleep(25)
						}
					}
				}
			}
		}
		let installTrigger = 25 * servers.length
		if (installCount >= installTrigger) {
			await ns.run("hacks/install.js");
			let time = getTime();
			let report = time + " - Running install.js..."
			ns.print(report)
			await ns.tryWritePort(8, report)
			installCount = 0
		} else {
			let time = getTime();
			installCount = installCount + (servers.length - hackedServers)
			if (installCount >= installTrigger) { 
				await ns.run("hacks/install.js");
				let time = getTime();
				let report = time + " - Running install.js..."
				ns.print(report)
				await ns.tryWritePort(8, report)
				installCount = 0	
			}
			ns.print(time + " - Progress to next INSTALL run: " + ns.formatNumber((installCount / (installTrigger)*100), 4, 1000) + "%")
		}
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