// NOTE Doesn't work for shorted shares

const commission = 100000;

export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();

    while (true) {
        tendStocks(ns);
        await ns.sleep(5 * 1000);
    }
}

function tendStocks(ns) {
    ns.print("");
    var stocks = getAllStocks(ns);
    for (const stock of stocks) {
        if (stock.profit > 2 * commission) {
            const salePrice = ns.stock.sellStock(stock.sym, stock.longShares);
            const saleTotal = salePrice * stock.longShares;
            const saleCost = stock.longPrice * stock.longShares;
            const saleProfit = saleTotal - saleCost - 2 * commission;
            stock.shares = 0;
            ns.print(`WARN ${stock.summary} SOLD for ${ns.formatNumber(saleProfit, 4,1000,true)} profit`);

        }
    }}

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
