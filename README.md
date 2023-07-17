# bitburner
My Bitburner Scripts

1. copy and paste everything in aliases.md into terminal and run
1. 'autostart' then starts everything automatically.
1. other commands are in aliases.md / mentioned below

# List of scripts
## **Utilities**
### AUTOSTART
- utils/autostart.js: 
- starts other scripts (as noted below)
- if script requires API access (e.g. stock scripts), checks for access prior to starting
- can run with command *autostart* (after setting aliases)
### KARMA
- utils/karma.js
- cmd line to report Karma
### OPENREPORT
- utils/openreport.js
- opens report window or starts report
- can run with command *report* (after setting aliases)
### REPORT
- utils/report.js
- started by AUTOSTART
- centralised reporting window
- other scripts provide data to report here 
### SCAN
- utils/scan.js
- scans for servers needed to backdoor and lists all connections
- can run with command *markscan* (after setting aliases)

## **Hacks**
### COORDINATE
- hacks/coordinate.js
- provides coordination to HACK / SELF so they hack better servers more often
- publishes coordination data on ports 19 (backup coordination) and 20 (main coordination)
- started by AUTOSTART
- also runs INSTALL periodically to install SELF on new servers that can hack
### GAINREP
- hacks/gainrep.js
- switches home and purchased servers to increasing reputation gains
- can run with command *gainrep* (after setting aliases)
### HACK
- hacks/hack.js
- runs hack(), grow(), weaken() on home and purchased servers
- relies on COORDINATE to set target
- started by SPAWN (which is started by RESTART / AUTOSTART) 
### INSTALL
- hacks/install.js
- crawls all third party servers and installs self.js when able
- started by AUTOSTART
- also run periodically by COORDINATE
### PURCHASE
- hacks/purchase.js
- purchases servers and upgrades them
- started by AUTOSTART
- will exit when all purcased servers upgraded
- $$$ Spends money $$$
### REP
- hacks/rep.js
- spawns share.js with max threads / kills hack.js
- started by GAINREP
### RESTART
- hacks/restart.js
- switches home and purcased servers to hacking
- started by AUTOSTART
- can run with command *hackstart* (after setting aliases)
### SELF
- hacks/self.js
- runs hack(), grow(), weaken() on third party servers
- relies on COORDINATE to set target or defaults to self (also 33% of time will hack self)
- started by INSTALL (which is started by AUTOSTART) 
### SHARE
- hacks/share.js
- provides reputation gains for factions ONLY (not companies)
- started by REP (which is started by GAINREP)
### SPAWN
- hacks/spawn.js
- spawns hack.js with max threads / kills share.js
- started by RESTART (which is started by AUTOSTART)

## **Stocks**
### EARLYTRADE
- stocks/earlyTrade.js
- early pre 4s API access trading script
- requires TIX API access
- started by AUTOSTART (if has TIX API access)
- $$$ Spends money $$$
### SELL
- stocks/sell.js
- stops EARLYTRADE and TRADE and sells owned stocks when will turn a profit
- can run with command *sell* (after setting aliases)
### TRADE
- stocks/trade.js
- advanced trading script. Purchases when stocks make up less than 50% of total of money + stocks. Can sell anytime.
- requires TIX API and 4S API access
- started by AUTOSTART (if has TIX API and 4S API access)
- can run with command *trade* (after setting aliases)
- $$$ Spends money $$$

## **Gangs**
### ESTABLISHGANG
- gangs/establishgang.js
- checks whether have a gang and if not, whether can start one. Starts gang if can
- starts either GROWGANG or RUNGANG if have a gang / gang started depending on whether have max members
- started by AUTOSTART
### GROWGANG
- gangs/growgang.js
- recruits new members when can until hit max members
- changes member tasks randomly and to ensure that penalty doesn't get too high
- started by ESTABLISHGANG
### RUNGANG
- gangs/rungang.js
- changes member tasks randomly and to ensure that penalty doesn't get too high
- started by ESTABLISHGANG

## **Corporations**
### CORPCONTROL
- corp/corpControl.js
- reports dividends (if any) to REPORT
- discontinues products where demand under 1, and develops new products
- sets sale on new products
- commits repurchase fraud when able, including by stoping and restarting spenders
- started by AUTOSTART (if corporation exists)
