// buttons.js
"use strict";
const MODULE_NAME = "buttons";

var raspi = require ('raspi');
var gpio = require('raspi-gpio');
const appRoot = require('app-root-path');
var screen = require (appRoot + '/modules/oled_display');

const L_pin = 27 
const R_pin = 23 
const C_pin = 4 
const U_pin = 17 
const D_pin = 22 
const A_pin = 5 
const B_pin = 6 

var pins = [L_pin, R_pin, C_pin, U_pin, D_pin, A_pin, B_pin];
var buttons = [];


function handleButton (pin, val) {
        
    screen.fillRect (0,0,15,10,0);
    screen.drawString (1, 8, 0, pin+"");
    
    switch (pin) {
        case L_pin:
            break;
            
        case R_pin:
            break;
            
        case C_pin:
            break;
            
        case U_pin:
            break;
            
        case D_pin:
            break;
            
        case A_pin:
            screen.drawCircle (40, 30, 10, val?0:1, true);
            break;
            
        case B_pin:
            screen.fillCircle (40, 30, 8, val?0:1, true);
            break;
            
        case L_pin:
            break;
            
        default:
            console.log ("unknown button: " + pin)
            
    }
}

function makeWatcher (pin) {
    return function (val) {
                handleButton (pin, val);
            }
}

function init () {
    raspi.init (() => {
        try {
            for (var i=0; i<pins.length; i++) {
                console.log ("making GPIO" + pins[i])
                buttons[i] = new gpio.DigitalInput({
                    pin:'GPIO'+pins[i],
                    pullResistor: gpio.PULL_UP});
                buttons[i].on ('change', makeWatcher (pins[i]));
            }
        }
        catch (err) {
            console.log ("buttons err: " + err)
        }
    });
}

function shutdown () {
}

module.exports = {
    init : init,
    shutdown : shutdown
}