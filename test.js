var raspi = require ('raspi');
var gpio = require('raspi-gpio');
const L_pin = 27 
const R_pin = 23 
const C_pin = 4 
const U_pin = 17 
const D_pin = 22 
const A_pin = 5 
const B_pin = 6 

var pins = [L_pin, R_pin, C_pin, U_pin, D_pin, A_pin, B_pin];
var xpins = [A_pin, B_pin];
var buttons = [];


console.log ("Starting raspi-gpio")

process.on ('SIGINT', function () {
        console.log ('\ncleaning up buttons');
    });

function makeWatcher (pin) {
    return function (val) {
                console.log ("GPIO" + pin + ": " + val)
            }
}

var test = null;

console.log ("init")
raspi.init (() => {
    try {
        console.log ("starting to allocate pins")
        for (var i=0; i<pins.length; i++) {
            console.log ("making GPIO" + pins[i])
            buttons[i] = new gpio.DigitalInput({
                pin:'GPIO'+pins[i],
                pullResistor: gpio.PULL_UP});
            buttons[i].on ('change', makeWatcher (pins[i]));
        }
    }
    catch (err) {
        console.log ("err: " + err)
    }
    console.log ("pins done")
});
    
console.log ("done")
/**/
