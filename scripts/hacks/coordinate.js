/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()
    const defaultTarget = ["nwo", "megacorp", "blade", "omnitek"]
    while (true) {
        var servers = ns.scan()
        for (let i = 0; i < servers.length; i++) {
            if (ns.scriptRunning("hacks/self.js", servers[i])) {
                if (ns.getServerMaxMoney(servers[i]) != 0) {
                    const reqlev = ns.getServerRequiredHackingLevel(servers[i])
                    const hacklev = ns.getHackingLevel()
                    const highlimit = 0.66 * hacklev
                    var lowlimit = 0.1 * hacklev
                    if (hacklev > 6000) {
                        lowlimit = 0.04 * hacklev
                    }
                    if (highlimit > reqlev) {
                        if (Math.random() < (reqlev / lowlimit)) {
                            while (!ns.tryWritePort(7, servers[i])) {
                                await ns.sleep(100)
                            }
                            ns.print("SUCCESS hack.js add: " + servers[i])
                        } else {
                            if (Math.random() < 0.1) {
                                while (!ns.tryWritePort(7, servers[i])) {
                                    await ns.sleep(100)
                                }
                            } else {
                                let targetSelect = Math.floor(Math.random() * defaultTarget.length);
                                if (ns.scriptRunning("hacks/self.js", defaultTarget[targetSelect])) {
                                    ns.print("Skipped: " + servers[i] + " defaulting to " + defaultTarget[targetSelect])
                                    ns.tryWritePort(6, defaultTarget[targetSelect])
                                } else {
                                    ns.print("Skipped: " + servers[i])
                                }
                            }
                        }
                    } else {
                        ns.print("WARN Hack too hard: " + servers[i])
                    }
                } else {
                    ns.print("FAIL No Money: " + servers[i])
                }
                await ns.sleep(100)
            }
            // then scan other servers and add
            let nextservers = ns.scan(servers[i])
            for (let n = 0; n < nextservers.length; n++) {
                if (!servers.includes(nextservers[n])) {
                    if (nextservers[n] != "home") {
                        if (nextservers[n].includes("markwr") == false) {
                            servers.push(nextservers[n])
                            await ns.sleep(100)
                        }
                    }
                }
            }
        }
    }
}