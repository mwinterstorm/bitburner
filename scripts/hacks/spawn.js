/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	// ns.tail()
	const server = ns.getHostname();
	let maxram = ns.getServerMaxRam(server);
	let usedram = ns.getServerUsedRam(server);
	let freeram = maxram - usedram;
	if (server == "home") {
		freeram = freeram - 32
	} 
	let threads = Math.floor((freeram) / ns.getScriptRam("hacks/hack.js"))
	if (threads >= 1) {
		let report = "Starting hack.js with " + threads + " threads on " + server
		await ns.print(report)
		await ns.tryWritePort(8, report)
		await ns.spawn("hacks/hack.js", threads, threads, server)
	} else {
		let report = "Not enough RAM"
		await ns.print(report)
		await ns.tryWritePort(8, report)

	}
}
