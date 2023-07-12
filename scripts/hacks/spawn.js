/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	// ns.tail();

	// OPTIONS
	let hack = "hacks/hack.js";
	let spawn = "hacks/spawn.js";
	let scriptRestart = "hacks/restart.js";
	let reserveRAM = 32; //RAM to be reserved on home computer
	let maxThreads = [32, 64, 128, 256, 512]; //Max threads to run on each instance - random selected for each instance

	const server = ns.getHostname();
	const maxram = ns.getServerMaxRam(server);
	let usedram = ns.getServerUsedRam(server);
	const hackRAM = ns.getScriptRam(hack);
	const spawnRAM = ns.getScriptRam(spawn);
	const scriptRestartRAM = ns.getScriptRam(scriptRestart);
	let freeram = maxram - usedram + spawnRAM;
	if (server == "home") {
		freeram = freeram - reserveRAM;
		if (ns.scriptRunning(scriptRestart, server)) {
			freeram = freeram + scriptRestartRAM;
		}
	};
	let counter = 0; //Counter for instances on server
	while (freeram >= hackRAM) {
		let threads = Math.floor((freeram) / ns.getScriptRam(hack));
		let maxIndex = Math.floor(Math.random() * maxThreads.length)
		if (threads >= 1) {
			if (threads > maxThreads[maxIndex] ) {
				threads = maxThreads[maxIndex];
				let report = "Starting hack.js with " + threads + " threads on " + server
				await ns.print(report)
				await ns.tryWritePort(8, report)
				await ns.run(hack, threads, threads, server + "." + counter);
				freeram = freeram - (threads * hackRAM);
				counter++
			} else {
				let report = "Starting hack.js with " + threads + " threads on " + server
				await ns.print(report)
				await ns.tryWritePort(8, report)
				await ns.spawn(hack, threads, threads, server + "." + counter)
				freeram = freeram - (threads * hackRAM)
				counter++
			};
		} else {
			let report = "Not enough RAM"
			await ns.print(report)
			await ns.tryWritePort(8, report)
			
		}
		await ns.sleep(500)
	};
}
