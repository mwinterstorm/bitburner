/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	// ns.tail()
	const server = ns.getHostname();
	let maxram = ns.getServerMaxRam(server);
	let usedram = ns.getServerUsedRam(server);
	let freeram = maxram - usedram;
	if (server == "home") {
		freeram = freeram - 4.7
	} 
	let threads = Math.floor((freeram) / ns.getScriptRam("share.js"))
	if (threads >= 1) {
		await ns.tprint("Starting share.js with " + threads + " threads on " + server)
		await ns.spawn("share.js", threads, threads, server)
	} else {
		await ns.tprint("Not enough RAM")
	}
}
