export async function main(ns) {
    ns.disableLog("ALL");
    while (true) {
        await reportGang(ns);
        await establishGang(ns);
        await tendCats(ns);
        await ns.sleep(1000);
    }

}

async function reportGang(ns) {
    let gang = await ns.gang.getGangInformation() 
    let eps = gang.moneyGainRate
    await ns.clearPort(10);
    await ns.tryWritePort(10, eps);
}

async function establishGang(ns) {
    const cats = [
        "Reagan",
        "Thatcher",
        "Romeo",
        "Gusto",
        "Mimi",
        "Snoopy",
        "Junior",
        "Cat_Bot_0800",
        "Tim",
        "Catrick Von Liarson",
        "Cat_Bot_1100",
        "Sphinx",
        "Ramases",
        "Cat_Bot_1400",
        "Victor",
        "Cat Sixteen",
        "Roo McThatcherstein",
        "Raepocalypse",
        "Roomaggeddon",
        "Romaniac",
        "Cat_Bot_2100",
        "Fluffy",
        "Cat_Bot_2300",
        "Cat_Bot_2400",
        "Cat_Bot_2500",
        "Cat_Bot_2600",
        "Cat_Bot_2700",
        "Cat_Bot_2800",
        "Cat_Bot_2999",
        "Cat_Bot_3000"
    ];

    // recruit members and do easiest task
    let maxMembers = 12;
    var catMembers = ns.gang.getMemberNames();
    if (catMembers.length < maxMembers) {
        if (ns.gang.canRecruitMember()) {
            let cat = Math.floor(Math.random() * cats.length);
            if (!catMembers.includes(cats[cat])) {
                if (ns.gang.recruitMember(cats[cat])) {
                    let time = getTime();
                    let report = time + " - Recruited " + cats[cat]
                    ns.print(report);
                    ns.tprint(report);
                    await ns.tryWritePort(8, report);
                    let taskNames = ns.gang.getTaskNames();
                    let tasks = [];
                    for (let i = 0; i < taskNames.length; i++) {
                        if (taskNames[i] != "Unassigned") {
                            let taskStats = ns.gang.getTaskStats(taskNames[i]);
                            tasks.push(taskStats);
                        };
                    };
                    tasks.sort((a, b) => {
                        return a.difficulty - b.difficulty;
                    });
                    while (ns.gang.getMemberInformation(cats[cat]).task != tasks[0]) {
                        if (tasks[0].baseMoney * tasks[0].baseRespect > 0) {
                            ns.gang.setMemberTask(cats[cat], tasks[0].name);
                            let time = getTime();
                            ns.print(time + " - " + cats[cat] + " is doing " + tasks[0]);
                        } else {
                            tasks.splice[0, 1]
                        }
                        await ns.sleep(500);
                    };
                };
            } 
        }
    } else {
        let time = getTime();
        ns.tprint(time + " - Max gang members reached");
        ns.spawn("/gangs/rungang.js", 1);
    }
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

        if (ascendTimer <= 600) {
            ascendTimer = ascendTimer + (Math.floor(Math.random() * cats.length))
        } else {
            ascendTimer = 0
            let catSelect = Math.floor(Math.random() * cat.length);
            ns.gang.ascendMember(cat[catSelect])
            let time = getTime();
            ns.print(time + " - SUCCESS Ascended " + cat[catSelect])
        }
        let waitPause = Math.random() * 120000
        ns.print("Waiting: " + Math.floor(waitPause / 1000) + " seconds / " + ns.formatNumber((ascendTimer / 1800)*100, 4, 100, true) + "% to ascension")
        await ns.sleep(waitPause)
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