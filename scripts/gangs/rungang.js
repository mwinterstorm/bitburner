export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    await ns.sleep(100);
	ns.moveTail(85, 495)
	ns.resizeTail(600, 300)
    while (true) {
        await tendCats(ns)
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

async function tendCats(ns) {
    // define cats
    const cats = ns.gang.getMemberNames();

    // determine tasks 
    let taskNames = ns.gang.getTaskNames();
    let tasks = [];
    for (let i = 0; i < taskNames.length; i++) {
        let taskStats = ns.gang.getTaskStats(taskNames[i])
        tasks.push(taskStats)
    }
    var crimes = []; // task with positive rep
    var justice = []; // task with negative wanted 
    for (let c = 0; c < tasks.length; c++) {
        if (tasks[c].baseWanted < 0) {
            justice.push(tasks[c])
        } else if (tasks[c].baseRespect > 0) {
            crimes.push(tasks[c])
        }
    }

    let ascendTimer = 0

    while (true) {
        let info = ns.gang.getGangInformation();
        let infoPenalty = (1 - info.wantedPenalty) * 100;
        let infoChange = info.wantedLevelGainRate;
        if (infoPenalty > 80) {
            while (infoChange >= 0) {
                //convert a random badcat to ethical
                let catSelect = Math.floor(Math.random() * cats.length);
                let justiceSelect = Math.floor(Math.random() * justice.length);
                ns.gang.setMemberTask(cats[catSelect], justice[justiceSelect].name);
                let time = getTime();
                ns.print(time + " - " + cats[catSelect] + " is doing " + justice[justiceSelect].name);
                let waitPause = Math.random() * 120000
                ns.print("Waiting after justice: " + Math.floor(waitPause / 1000) + " seconds")
                await ns.sleep(waitPause)
            }
        } else if (infoPenalty <= 5) {
            //convert a random cat to crime
            let catSelect = Math.floor(Math.random() * cats.length);
            let crimeSelect = Math.floor(Math.random() * crimes.length);
            ns.gang.setMemberTask(cats[catSelect], crimes[crimeSelect].name);
            let time = getTime();
            ns.print(time + " - " + cats[catSelect] + " is doing " + crimes[crimeSelect].name);
        }

        if (ascendTimer <= 1800) {
            ascendTimer = ascendTimer + (Math.floor(Math.random() * cats.length))
        } else {
            ascendTimer = 0
            let catSelect = Math.floor(Math.random() * cat.length);
            ns.gang.ascendMember(cat[catSelect])
            let time = getTime();
            ns.print(time + " - SUCCESS Ascended " + cat[catSelect])
            ns.tprint(time + " - SUCCESS Ascended " + cat[catSelect])
        }
        let waitPause = Math.random() * 120000
        ns.print("Waiting: " + Math.floor(waitPause / 1000) + " seconds / " + ns.formatNumber((ascendTimer / 1800)*100, 4, 100, true) + "% to ascension")
        await ns.sleep(waitPause)
    }
}

