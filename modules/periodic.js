var ccxt = require ('ccxt');
const appRoot = require('app-root-path');
var screen = require (appRoot + '/modules/oled_display');
const quote_delay = 20000;
const frame_delay = 3000;

var next_quote_time = 0;
var next_frame_time = 0;
var taskID = null;
var exchange = new ccxt['binanceus']({ enableRateLimit:true});

function init () {
    screen.clearScreen (0);
    taskID = setInterval(run, frame_delay);
}

function getTickers () {
    exchange.fetchTicker ("BTC/USDT")
    .then (ticker=>{
        //console.log (`Bid: ${ticker['bid']}, Ask: ${ticker['ask']}`);
        screen.fillRect (0, 11, 128, 64, 0);
        screen.drawString (0, 20, 1, `BTC: ${ticker['bid']}`);
    })
}

let color = 0;

function run () {
    color = color ? 0 : 1;
    screen.fillCircle (5, 5, 4, color, true);

    let ticks = Date.now();
    if (next_quote_time < ticks) {
        next_quote_time = ticks + quote_delay;
        getTickers ();
    }
}


function shutdown () {
    screen.clearScreen (0);
}


module.exports = {
    init : init,
    run : run,
    shutdown : shutdown
}