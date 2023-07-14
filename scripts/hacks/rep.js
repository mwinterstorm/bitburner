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
	let threads = Math.floor((freeram) / ns.getScriptRam("hacks/share.js"))
	if (threads >= 1) {
		let time = getTime()
		let report = time + " - Starting share.js with " + threads + " threads on " + server
		await ns.print(report)
		await ns.tryWritePort(8, report)
		await ns.spawn("hacks/share.js", threads, threads, server)
	} else {
		let time = getTime()
		let report = time + "- FAIL! Not enough RAM for SHARE"
		await ns.print(report)
		await ns.tryWritePort(8, report)

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
