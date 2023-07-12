const commission = 100000;
var stocksExist = true
var TotalProfit = 0
var TotalValue = 0
var StockNumber = 0

export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	await ns.sleep(100);
	ns.moveTail(850, 30)
	ns.resizeTail(380, 270)
	while (stocksExist == true) {
		await ns.scriptKill("stocks/trade.js", "home")
		await ns.scriptKill("stocks/earlyTrade.js", "home")
		StockNumber = 0
		tendStocks(ns);
		await ns.sleep(5 * 1000);
	} 
	ns.print("All Stocks Sold for $" + ns.formatNumber(TotalValue, 4, 1000, true) + "(Profit: $" + ns.formatNumber(TotalProfit, 4, 1000, true) + ")")
}

function tendStocks(ns) {
	ns.print("");
	var stocks = getAllStocks(ns);

    var overallValue = 0
	for (const stock of stocks) {
		if (stock.profit > 2 * commission) {
			const salePrice = ns.stock.sellStock(stock.sym, stock.longShares);
			const saleTotal = salePrice * stock.longShares;
			const saleCost = stock.longPrice * stock.longShares;
			const saleProfit = saleTotal - saleCost - 2 * commission;
			stock.shares = 0;
			ns.print(`SUCCESS ${stock.summary} SOLD for ${ns.formatNumber(saleProfit, 4, 1000, true)} profit`);
			TotalProfit += saleProfit
			TotalValue += saleTotal
		} else if (stock.longShares >= 1) {
			const saleProfit = ((stock.bidPrice - stock.longPrice) * stock.longShares) - (2 * commission);
			const stockValue = (stock.bidPrice * stock.longShares)
			ns.print(`FAIL ${stock.summary}: ${ns.formatNumber(saleProfit, 4, 1000, true)} of ${ns.formatNumber(stockValue, 4, 1000, true)}`)
            overallValue += stockValue
			++StockNumber
		}
	}
  ns.print("SELLING: Remaining = $" + ns.formatNumber(overallValue, 4, 1000, true))
	ns.print("SELLING: Value sold = $" + ns.formatNumber(TotalValue, 4, 1000, true))
	ns.print("SELLING: Profit = $" + ns.formatNumber(TotalProfit, 4, 1000, true))

	if (StockNumber == 0) {
		stocksExist = false
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
