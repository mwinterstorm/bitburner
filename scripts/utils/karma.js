/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    // ns.tail()
    const karma =  ns.heart.break()
    const progress = ( karma / -54000 ) * 100
    ns.tprint("Karma: " + ns.formatNumber( karma, 4, 1000 ) + " / Progress: " + ns.formatNumber( progress, 4, 1000 ) + "%" )
}