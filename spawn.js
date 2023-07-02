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
	let threads = Math.floor((freeram) / ns.getScriptRam("hack.js"))
	if (threads >= 1) {
		await ns.tprint("Starting hack.js with " + threads + " threads on " + server)
		await ns.spawn("hack.js", threads, threads, server)
	} else {
		await ns.tprint("Not enough RAM")
	}
}