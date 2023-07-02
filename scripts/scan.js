/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	ns.tail()
	let host = "home"
	const servers = ns.scan(host)
	const target = ["run4theh111z", "I.I.I.I", "CSEC", "avmnite-02h", "The-Cave"]
	await ns.sleep(500)
	for (let i = 0; i < servers.length; i++) {
		let nextservers = ns.scan(servers[i])
		for (let n = 0; n < nextservers.length; n++) {
			if (!servers.includes(nextservers[n])) {
				if (nextservers[n] != "home") {
					if (!nextservers[n].includes("markwr")) {
						servers.push(nextservers[n])
						host = servers[i]
						if (target.includes(nextservers[n])) {
							if (ns.hasRootAccess(servers[i]) == true) {
								ns.print("SUCCESS " + nextservers[n] + " is ROOTED and next to " + host)
								await ns.sleep(500)
							} else {
								ns.print("FAIL " + nextservers[n] + " is not ROOTED and next to " + host)
								await ns.sleep(500)

							}
						}
					}
				}
			}
		}
	}
}
