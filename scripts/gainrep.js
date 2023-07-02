/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	// ns.tail()
	const files = ["spawn.js", "hack.js", "share.js", "rep.js"]
	const servers = ns.scan()
	servers.push("home")
	await ns.sleep(1500)
	for (let i = 0; i < servers.length; i++) {
		if (servers[i].includes("markwr") == true) {
			await ns.killall(servers[i])
			ns.scp(files, servers[i])
			await ns.exec("rep.js", servers[i])
			await ns.sleep(1500)
		} else if (servers[i] == "home") {
			ns.print("works?")
			await ns.scriptKill("hack.js", servers[i])
			await ns.exec("rep.js", servers[i])
			await ns.sleep(1500)
		}
	}
}