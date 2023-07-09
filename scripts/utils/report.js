/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    ns.tail()
    await ns.sleep(100)
    ns.moveTail(0, 0)
    ns.resizeTail(850, 300)
    var time = 500
    while (true) {
        let report = ns.readPort(8);
        // get time
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
        // END Calc time
        if (report == "NULL PORT DATA") {

        } else {
            await ns.print(formattedTime + " - " + report)
        }
        await ns.sleep(time)
        if (time < 900) {
            time = time + 1
        } else {
            time = 500
        }
    }
}
