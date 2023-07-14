/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    // ns.tail();

    const maxMembers = 12;

    // if not in gang wait until can join
    if (!ns.gang.inGang()) {
        let factions = ns.getPlayer().factions;
        let factionSelect = Math.floor(Math.random() * factions.length);
        if (factions.length > 0) {
            ns.gang.createGang(factions[factionSelect]);
            if (ns.gang.inGang()) { 
                var gangInfo = ns.gang.getGangInformation();
                let isHacking = "unknown";
                if (gangInfo.isHacking) {
                    isHacking = "hacking";
                } else {
                    isHacking = "criminal";
                };
                let time = getTime();
                let report = time + " - Created " + isHacking + " gang with: " + gangInfo.faction;
                ns.tprint(report);
                ns.print(report);
                await ns.tryWritePort(8, report)
                var catMembers = ns.gang.getMemberNames();
                if (catMembers.length < maxMembers) {
                    ns.spawn("/gangs/growgang.js", 1);
                } else {
                    ns.spawn("/gangs/rungang.js", 1);
                }
            }
        }
        if (!ns.gang.inGang()) {
            let time = getTime();
            let report = time + " - Cannot create gang. Exiting...";
            ns.tprint(report);
            ns.print(report);
            await ns.tryWritePort(8, report)
        }
    } else {
        var gangInfo = ns.gang.getGangInformation();
        let isHacking = "unknown";
        if (gangInfo.isHacking) {
            isHacking = "hacking";
        } else {
            isHacking = "criminal";
        };
        let time = getTime();
        let report = time + " - You have a " + isHacking + " gang with: " + gangInfo.faction;
        ns.tprint(report);
        ns.print(report);
        await ns.tryWritePort(8, report)
        let maxMembers = 12;
        var catMembers = ns.gang.getMemberNames();
        if (catMembers.length < maxMembers) {
            ns.spawn("/gangs/growgang.js", 1);
        } else {
            ns.spawn("/gangs/rungang.js", 1);
        }
    };
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