/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    while (true) {
        await tendProducts(ns);
        await ns.sleep(120000)
    }
}

async function tendProducts(ns) {
    let corporation = ns.corporation.getCorporation();
    // ns.print(corporation);
    let divisionNames = corporation.divisions;
    // ns.print(divisionNames);

    // Get divisons
    var div = [];
    for (let i = 0; i < divisionNames.length; i++) {
        let divInfo = ns.corporation.getDivision(divisionNames[i]);
        div.push(divInfo)
    }
    // ns.print(divisions)

    for (let i = 0; i < div.length; i++) {
        if (div[i].makesProducts) {
            let divName = div[i].name;
            let divcities = div[i].cities;
            let divProds = div[i].products;
            let maxProds = div[i].maxProducts;
            for (let p = 0; p < divProds.length; p++) {
                let divProd = divProds[p];
                let aveDemand = 0;
                for (let c = 0; c < divcities.length; c++) {
                    let divcity = divcities[c];
                    let cityDemand = ns.corporation.getProduct(divName, divcity, divProd)
                    aveDemand = aveDemand + cityDemand
                }
                aveDemand = aveDemand / divcities.length
                if (aveDemand <= 1) { //discontinue product with low demand 
                    await ns.corporation.discontinueProduct(divName, divProd);
                    let index = divProds.indexOf(divProd);
                    divProds.splice(index, 1);
                    let time = getTime()
                    let report = time + "FAIL! " + divName + " is discontinuing product " + divProd;
                    await ns.print(report);
                    await ns.tryWritePort(8, report);
                }
            }
            if (divProds.length < maxProds) { //create new prod when space
                let number = Math.floor(Math.random() * 100);
                let newName = divName + "-" + number;
                let funds = (corporation.funds * .1) / 2;
                let rancity = Math.floor(Math.random()* divcities.length);
                let city = divcities[rancity];
                if (!divProds.includes(newName)) {
                    await ns.corporation.makeProduct(divName,city,newName, funds, funds) 
                    let time = getTime()
                    let report = time + "WARN! " + divName + " is creating product " + newName + " at " + city + " investing $" + 2 * funds;
                    await ns.print(report);
                    await ns.tryWritePort(8, report);
                }			

            }
        }
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