/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	// ns.tail()
	const files = ["spawn.js", "hack.js"]
	const servers = ns.scan()
	servers.push("home")
	await ns.sleep(1500)
	for (let i = 0; i < servers.length; i++) {
		if (servers[i].includes("markwr") == true) {
			await ns.killall(servers[i])
			ns.scp(files, servers[i])
			await ns.exec("spawn.js", servers[i])
			await ns.sleep(1500)
		}
		if (servers[i].includes("home") == true) {
			await ns.scriptKill("share.js", servers[i])
			await ns.exec("spawn.js", servers[i])
			await ns.sleep(1500)
		}
	}
}