# bitburner
My Bitburner Scripts

## List of scripts
1. autostart.js: starts coordinate.js, purchase.ks, report.js, install.js, restart.js, trade.js, spawn.js
1. coordinate.js: populates port with servers for hack.js and self.js to hack - weighted towards optimatal hacking level
1. earlyTrade.js: runs Stock Market trades pre getting full TIX API access
1. gainrep.js: Changes 'home' plus all 'markwr' purchased servers to gaining rep
1. hack.js: Main script for hacking for 'home' and purchased servers - this is not optimised
1. install.js: trawls all servers, opens ports, nukes and installs scripts where possible
1. purchase.js: purchases servers, then upgrades - installs / runs scripts
1. rep.js: spawns share.js with max threads
1. report.js: central reporting of hack.js / self.js / share.js activity
1. restart.js: starts hack.js on 'home' and all purchased servers
1. scan.js: scans for servers needed to backdoor
1. self.js: Main script for hacking on third party servers - this is not optimised
1. sell.js: sells stocks that have made a profit
1. share.js: used to gain faction reputation
1. spawn.js: spawns hack.js or self.js with max threads
1. trade.ks: runs stock market trades, needs full TIX API access

## To do
1. install.js:
    1. get auto re running periodically
1. scan.js:
    1. also auto scan for nearby servers
