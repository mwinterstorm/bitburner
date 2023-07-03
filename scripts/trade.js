// requires 4s Market Data TIX API Access

// defines if stocks can be shorted (see BitNode 8)
const shortAvailable = false;

const commission = 100000;
var tradeActive = false;
var tradeMoney = 0
var money = 0

export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();

    while (true) {
        money = ns.getServerMoneyAvailable("home");
        tradeMoney = money / 2
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
    var overallValue = 0;

    for (const stock of stocks) {
        if (stock.longShares > 0) {
            if (stock.forecast > 0.5) {
                longStocks.add(stock.sym);
                ns.print(`INFO ${stock.summary} LONG ${ns.formatNumber(stock.cost + stock.profit, 4,1000,true)} ${ns.formatNumber(100 * stock.profit / stock.cost, 4,1000,true)}%`);
                overallValue += (stock.cost + stock.profit);
            }
            else {
                const salePrice = ns.stock.sellStock(stock.sym, stock.longShares);
                const saleTotal = salePrice * stock.longShares;
                const saleCost = stock.longPrice * stock.longShares;
                const saleProfit = saleTotal - saleCost - 2 * commission;
                stock.shares = 0;
                shortStocks.add(stock.sym);
                ns.print(`WARN ${stock.summary} SOLD for ${ns.formatNumber(saleProfit, 4,1000,true)} profit`);
            }
        }
        if (stock.shortShares > 0) {
            if (stock.forecast < 0.5) {
                shortStocks.add(stock.sym);
                ns.print(`INFO ${stock.summary} SHORT ${ns.formatNumber(stock.cost + stock.profit, 4,1000,true)} ${ns.formatNumber(100 * stock.profit / stock.cost, 4,1000,true)}%`);
                overallValue += (stock.cost + stock.profit);
            }
            else {
                const salePrice = ns.stock.sellShort(stock.sym, stock.shortShares);
                const saleTotal = salePrice * stock.shortShares;
                const saleCost = stock.shortPrice * stock.shortShares;
                const saleProfit = saleTotal - saleCost - 2 * commission;
                stock.shares = 0;
                longStocks.add(stock.sym);
                ns.print(`WARN ${stock.summary} SHORT SOLD for ${ns.formatNumber(saleProfit, 4,1000,true)} profit`);
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
                    ns.print(`WARN ${stock.summary} LONG BOUGHT ${ns.formatNumber(sharesToBuy, 4,1000,true)}`);
                    tradeMoney = tradeMoney - (sharesToBuy * stock.askPrice)
                }
            }
        }
        else if (stock.forecast < 0.45 && shortAvailable) {
            shortStocks.add(stock.sym);
            //ns.print(`INFO ${stock.summary}`);
            if (tradeActive == true) {
                const sharesToBuy = Math.min(stock.maxShares, Math.floor((tradeMoney - commission) / stock.bidPrice));
                if (ns.stock.buyShort(stock.sym, sharesToBuy) > 0) {
                    ns.print(`WARN ${stock.summary} SHORT BOUGHT ${ns.formatNumber(sharesToBuy, 4, 1000, true)}`);
                    tradeMoney = tradeMoney - (sharesToBuy * stock.bidPrice)
                }
            }
        }
    }
    ns.print("Stock value: " + ns.formatNumber(overallValue, 4, 1000, true));
    if (overallValue < money) {
        tradeActive = true
    } else {
        tradeActive = false
    }

    // send stock market manipulation orders to hack manager
    var growStockPort = ns.getPortHandle(1); // port 1 is grow
    var hackStockPort = ns.getPortHandle(2); // port 2 is hack
    if (growStockPort.empty() && hackStockPort.empty()) {
        // only write to ports if empty
        for (const sym of longStocks) {
            //ns.print("INFO grow " + sym);
            growStockPort.write(getSymServer(sym));
        }
        for (const sym of shortStocks) {
            //ns.print("INFO hack " + sym);
            hackStockPort.write(getSymServer(sym));
        }
    }
}

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

function getSymServer(sym) {
    const symServer = {
        "WDS": "",
        "ECP": "ecorp",
        "MGCP": "megacorp",
        "BLD": "blade",
        "CLRK": "clarkinc",
        "OMTK": "omnitek",
        "FSIG": "4sigma",
        "KGI": "kuai-gong",
        "DCOMM": "defcomm",
        "VITA": "vitalife",
        "ICRS": "icarus",
        "UNV": "univ-energy",
        "AERO": "aerocorp",
        "SLRS": "solaris",
        "GPH": "global-pharm",
        "NVMD": "nova-med",
        "LXO": "lexo-corp",
        "RHOC": "rho-construction",
        "APHE": "alpha-ent",
        "SYSC": "syscore",
        "CTK": "comptek",
        "NTLK": "netlink",
        "OMGA": "omega-net",
        "JGN": "joesguns",
        "SGC": "sigma-cosmetics",
        "CTYS": "catalyst",
        "MDYN": "microdyne",
        "TITN": "titan-labs",
        "FLCM": "fulcrumtech",
        "STM": "stormtech",
        "HLS": "helios",
        "OMN": "omnia",
        "FNS": "foodnstuff"
    }

    return symServer[sym];

}