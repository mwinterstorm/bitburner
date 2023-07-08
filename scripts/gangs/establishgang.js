/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    // ns.tail();

    // if not in gang wait until can join
    if (!ns.gang.inGang()) {
        while (!ns.gang.inGang()) {
            let factions = ns.getPlayer().factions;
            let factionSelect = Math.floor(Math.random() * factions.length);
            ns.gang.createGang(factions[factionSelect]);
            await ns.sleep(5000);
        };
        var gangInfo = ns.gang.getGangInformation();
        let isHacking = "unknown";
        if (gangInfo.isHacking) {
            isHacking = "hacking";
        } else {
            isHacking = "criminal";
        };
        let time = getTime();
        ns.tprint(time + " - Created " + isHacking + " gang with: " + gangInfo.faction);
        let maxMembers = 12;
        var catMembers = ns.gang.getMemberNames();
        if (catMembers.length < maxMembers) {
            ns.spawn("/gangs/growgang.js", 1);
        } else {
            ns.spawn("/gangs/rungang.js", 1);
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
        ns.tprint(time + " - You have a " + isHacking + " gang with: " + gangInfo.faction);
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