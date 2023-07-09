// requires 4s Market Data TIX API Access

// defines if stocks can be shorted (see BitNode 8)
const shortAvailable = false;

const commission = 100000;
var tradeActive = false;
var tradeMoney = 0
var money = 0
var overallValue = 0;


export async function main(ns) {
    ns.disableLog("ALL");
    // ns.tail();
    await ns.sleep(100);
    ns.moveTail(850, 0)
    ns.resizeTail(380, 300)

    while (true) {
        money = ns.getServerMoneyAvailable("home");
        tradeMoney = ((overallValue + money) / 2) - overallValue
        overallValue = 0
        tendStocks(ns);
        await ns.sleep(6 * 1000);
    }
}

function tendStocks(ns) {
    ns.print("");
    var stocks = getAllStocks(ns);

    stocks.sort((a, b) => b.profitPotential - a.profitPotential);

    var longStocks = new Set();
    var shortStocks = new Set();
    var numberStocks = 0

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

    for (const stock of stocks) {
        if (stock.longShares > 0) {
            if (stock.forecast > 0.5) {
                longStocks.add(stock.sym);
                // ns.print(`INFO ${stock.summary} LONG ${ns.formatNumber(stock.cost + stock.profit, 4, 1000, true)} ${ns.formatNumber(100 * stock.profit / stock.cost, 4, 1000, true)}%`);
                overallValue += (stock.cost + stock.profit);
                numberStocks += 1
            }
            else {
                const salePrice = ns.stock.sellStock(stock.sym, stock.longShares);
                const saleTotal = salePrice * stock.longShares;
                const saleCost = stock.longPrice * stock.longShares;
                const saleProfit = saleTotal - saleCost - 2 * commission;
                stock.shares = 0;
                shortStocks.add(stock.sym);
                let report = formattedTime + ` - SUCCESS ${stock.summary} SOLD for ${ns.formatNumber(saleProfit, 4, 1000, true)} profit`;
                ns.print(report)
                ns.tryWritePort(8, report)
            }
        }
        if (stock.shortShares > 0) {
            if (stock.forecast < 0.5) {
                shortStocks.add(stock.sym);
                // ns.print(`INFO ${stock.summary} SHORT ${ns.formatNumber(stock.cost + stock.profit, 4, 1000, true)} ${ns.formatNumber(100 * stock.profit / stock.cost, 4, 1000, true)}%`);
                overallValue += (stock.cost + stock.profit);
                numberStocks += 1
            }
            else {
                const salePrice = ns.stock.sellShort(stock.sym, stock.shortShares);
                const saleTotal = salePrice * stock.shortShares;
                const saleCost = stock.shortPrice * stock.shortShares;
                const saleProfit = saleTotal - saleCost - 2 * commission;
                stock.shares = 0;
                longStocks.add(stock.sym);
                let report = formattedTime + ` - SUCCESS ${stock.summary} SHORT SOLD for ${ns.formatNumber(saleProfit, 4, 1000, true)} profit`;
                ns.print(report)
                ns.tryWritePort(8, report)
            }
        }
    }

    for (const stock of stocks) {
        //ns.print(`INFO ${stock.summary}`);
        if (stock.forecast > 0.55) {
            longStocks.add(stock.sym);
            //ns.print(`INFO ${stock.summary}`);
            if (tradeActive == true) {
                const sharesToBuy = Math.min(stock.maxShares, Math.floor((tradeMoney - commission) / stock.askPrice));
                if (ns.stock.buyStock(stock.sym, sharesToBuy) > 0) {
                    let report = formattedTime + ` - INFO ${stock.summary} LONG BOUGHT ${ns.formatNumber(sharesToBuy, 4, 1000, true)}`;
                    ns.print(report);
                    ns.tryWritePort(8, report);    
                    tradeMoney -= (sharesToBuy * stock.askPrice) + commission;
                    overallValue += (sharesToBuy * stock.askPrice);
                    numberStocks += 1;
                };
            };
        }
        else if (stock.forecast < 0.45 && shortAvailable) {
            shortStocks.add(stock.sym);
            //ns.print(`INFO ${stock.summary}`);
            if (tradeActive == true) {
                const sharesToBuy = Math.min(stock.maxShares, Math.floor((tradeMoney - commission) / stock.bidPrice));
                if (ns.stock.buyShort(stock.sym, sharesToBuy) > 0) {
                    let report = formattedTime + ` - WARN ${stock.summary} SHORT BOUGHT ${ns.formatNumber(sharesToBuy, 4, 1000, true)}`;
                    ns.print(report);
                    ns.tryWritePort(8, report);    
                    tradeMoney = tradeMoney - ((sharesToBuy * stock.bidPrice) + commission)
                    overallValue += (sharesToBuy * stock.bidPrice)
                    numberStocks += 1
                }
            }
        }
    }
    if (Math.random() >= 0.82) {
        let report = formattedTime + " - Stock value: " + ns.formatNumber(overallValue, 4, 1000, true) + " (" + numberStocks + " stocks)";
        ns.print(report);
        ns.tryWritePort(8, report);
    };
    if (overallValue < money) {
        tradeActive = true;
    } else {
        tradeActive = false;
    };
};

export function getAllStocks(ns) {
    // make a lookup table of all stocks and all their properties
    const stockSymbols = ns.stock.getSymbols();
    const stocks = [];
    for (const sym of stockSymbols) {

        const pos = ns.stock.getPosition(sym);
        const stock = {
            sym: sym,
            longShares: pos[0],
            longPrice: pos[1],
            shortShares: pos[2],
            shortPrice: pos[3],
            forecast: ns.stock.getForecast(sym),
            volatility: ns.stock.getVolatility(sym),
            askPrice: ns.stock.getAskPrice(sym),
            bidPrice: ns.stock.getBidPrice(sym),
            maxShares: ns.stock.getMaxShares(sym),
        };

        var longProfit = stock.longShares * (stock.bidPrice - stock.longPrice) - 2 * commission;
        var shortProfit = stock.shortShares * (stock.shortPrice - stock.askPrice) - 2 * commission;
        stock.profit = longProfit + shortProfit;
        stock.cost = (stock.longShares * stock.longPrice) + (stock.shortShares * stock.shortPrice)

        // profit potential as chance for profit * effect of profit
        var profitChance = 2 * Math.abs(stock.forecast - 0.5);
        var profitPotential = profitChance * (stock.volatility);
        stock.profitPotential = profitPotential;

        stock.summary = `${stock.sym}: ${stock.forecast.toFixed(3)} ± ${stock.volatility.toFixed(3)}`;
        stocks.push(stock);
    }
    return stocks;
}
