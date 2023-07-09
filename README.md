# bitburner
My Bitburner Scripts

1. copy and paste everything in aliases.md into terminal and run
1. 'autostart' then starts everything automatically.
1. other commands are in aliases.md

## List of scripts
### Utilities
#### Autostart
- utils/autostart.js: 
- starts other scripts (as noted below)
- if script requires API access (e.g. stock scripts), checks for access prior to starting
- can run with command *autostart* (after setting aliases)
#### SCAN
- utils.scan.js
- scans for servers needed to backdoor


#### Update rest

### Hacks
1. share.js: used to gain faction reputation
1. spawn.js: spawns hack.js or self.js with max threads
1. self.js: Main script for hacking on third party servers - this is not optimised
1. gainrep.js: Changes 'home' plus all 'markwr' purchased servers to gaining rep
1. hack.js: Main script for hacking for 'home' and purchased servers - this is not optimised
1. install.js: trawls all servers, opens ports, nukes and installs scripts where possible
1. purchase.js: purchases servers, then upgrades - installs / runs scripts
1. rep.js: spawns share.js with max threads
1. report.js: central reporting of hack.js / self.js / share.js activity
1. restart.js: starts hack.js on 'home' and all purchased servers
1. coordinate.js: populates port with servers for hack.js and self.js to hack - weighted towards optimatal hacking level

### Stocks
1. trade.ks: runs stock market trades, needs full TIX API access. Purchases when stocks make up less than 50% of total of money + stocks. Can sell anytime.
1. sell.js: sells stocks that have made a profit
1. earlyTrade.js: runs Stock Market trades pre getting full TIX API access

### Gangs



## To do
- to do the to do list

