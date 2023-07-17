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
	var target = ["run4theh111z", "I.I.I.I", "avmnite-02h", "CSEC", "The-Cave"];
	target.unshift(args);
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
					if (ns.hasRootAccess(servers[i]) == true) {
						ns.print("SUCCESS " + nextservers[n] + " is ROOTED and next to " + host)
					} else {
						ns.print("FAIL " + nextservers[n] + " is not ROOTED and next to " + host)
					}
					target2.push(host)
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

	function secondpass(mark) {
		for (let i = 0; i < servers.length; i++) {
			let nextservers = ns.scan(servers[i])
			host = servers[i]
			for (let n = 0; n < nextservers.length; n++) {
				if (mark == nextservers[n]) {
					ns.print("WARN " + nextservers[n] + " is next to " + host)
					target2.push(host)
					let index = target2.indexOf(mark)
					target2.splice(index, 1)
					return
				}
			}
		}
	}
}


