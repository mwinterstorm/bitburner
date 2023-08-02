/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	await ns.sleep(100);
	ns.moveTail(385, 295)
	ns.resizeTail(600, 300)
	let args = ns.args[0];
	let host = "home";
	var servers = ns.scan(host);
	var target = [ "CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave"];
	if (args) {
		target.unshift(args);
	}
	await ns.sleep(1000)
	await setuppass(ns)
	for (let t = 0; t < target.length; t++) {
		var target2 = [""];
		ns.print("INFO Scanning for: " + target[t])
		await firstpass(target[t])
		await ns.sleep(500)
	}

	function setuppass(ns) {
		for (let i = 0; i < servers.length; i++) {
			let nextservers = ns.scan(servers[i])
			for (let n = 0; n < nextservers.length; n++) {
				if (!servers.includes(nextservers[n])) {
					servers.push(nextservers[n])
				}
			}
		}
	}

	async function firstpass(mark) {
		for (let i = 0; i < servers.length; i++) {
			let nextservers = ns.scan(servers[i])
			host = servers[i]
			for (let n = 0; n < nextservers.length; n++) {
				if (mark == nextservers[n]) {
					let serverDetails = ns.getServer(mark)
					let requiredHack = serverDetails.requiredHackingSkill
					let backdoor = serverDetails.backdoorInstalled
					if (backdoor) {
						ns.print("SUCCESS " + nextservers[n] + " is BACKDOORED")
						return
					} else {
						if (ns.hasRootAccess(servers[i]) == true) {
							ns.print("WARN " + nextservers[n] + " (LVL: " + requiredHack + ")" + " is ROOTED and next to " + host)
						} else {
							ns.print("FAIL " + nextservers[n] +  " (LVL: " + requiredHack + ")" + " is not ROOTED and next to " + host)
						}
						target2.push(host)
					}
					if (!backdoor) {
						while (target2.length >= 1) {
							for (let y = 0; y < target2.length; y++) {
								if (target2[y] != "home") {
									await secondpass(target2[y])
								} else {
									return
								}
								await ns.sleep(500)
							}
						}
					}

				}
			}
		}
	}

	function secondpass(mark) {
		for (let i = 0; i < servers.length; i++) {
			let nextservers = ns.scan(servers[i])
			host = servers[i]
			for (let n = 0; n < nextservers.length; n++) {
				if (mark == nextservers[n]) {
					ns.print(nextservers[n] + " is next to " + host)
					target2.push(host)
					let index = target2.indexOf(mark)
					target2.splice(index, 1)
					return
				}
			}
		}
	}
}


