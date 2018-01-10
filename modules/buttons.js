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

const screenHeight = 64;
const screenWidth = 128;
const lineHeight = 10;
const cursorIndent = 10;

var pins = [L_pin, R_pin, C_pin, U_pin, D_pin, A_pin, B_pin];
var buttons = [];

var testMenu = {
        'title' : 'Pick something',
        'prev'  : null,
        'items' : [
                {
                    'msg' : 'Line One',
                    'action' : {
                            'cmd' : '',
                            'arg' : ''
                        }
                },
                {
                    'msg' : 'Line Two',
                    'action' : {
                            'cmd' : '',
                            'arg' : ''
                        }
                },
                {
                    'msg' : 'Line Three',
                    'action' : {
                            'cmd' : '',
                            'arg' : ''
                        }
                },
                {
                    'msg' : 'Line Four',
                    'action' : {
                            'cmd' : '',
                            'arg' : ''
                        }
                },
                {
                    'msg' : 'Line Five',
                    'action' : {
                            'cmd' : '',
                            'arg' : ''
                        }
                }
            ]
    };
    
//-----------------------------------------------------------------------
 
function setMenuCursor (item) {
    screen.fillRect (0, menuTitleHeight, cursorIndent-1, screenHeight-1, 0);
    screen.drawString (1,menuTitleHeight + (item)*lineHeight,1,">");
}
   
//-----------------------------------------------------------------------
 
function drawMenu (menu) {
    screen.clearDisplay();
    if (menuTitleHeight) { //there is a title to draw
        //screen.fillRect (0,0,screenWidth-1,menuTitleHeight,1);
        screen.drawString (1, 0, 1, menu.title);    
    }
    
    for (var i=0;i<menuItemCount; i++) {
        var y = menuTitleHeight + (i) * lineHeight;
        console.log ("item: "+i+": "+menu.items[i].msg+" @"+y);
        screen.drawString (cursorIndent, y, 1, menu.items[i].msg);
    }
}

//-----------------------------------------------------------------------
 
var menuItemCount = 0;
var currentMenuItem = 0;
var menuTitleHeight = 0;

function runMenu (menu) {
    //set up the values for this menu
    menuItemCount = menu.items.length;
    currentMenuItem = 0;
    if (menu.title.length) {
        menuTitleHeight = lineHeight;
    }
    else {
        menuTitleHeight = 0;
    }
    
    console.log ("running menu: " + menu.title + "\nitem count: " + menuItemCount);
    
    drawMenu (menu);
    setMenuCursor (currentMenuItem);
}

//-----------------------------------------------------------------------

function moveCursor (dir) {
    switch (dir) {
        case 'up':
            if (currentMenuItem)
                currentMenuItem--;
            break;
            
        case 'down':
            if (currentMenuItem<(menuItemCount-1))
                currentMenuItem++;
            break;
    }
    
    setMenuCursor (currentMenuItem);
}
 
//-----------------------------------------------------------------------
 
function handleButton (pin, val) {
        
    //screen.fillRect (0,0,15,10,0);
   // screen.drawString (1, 8, 0, pin+"");
    
    switch (pin) {
        case L_pin:
            //screen.startScroll ('left', 0, 5);
            break;
            
        case R_pin:
            //screen.startScroll ('right', 0, 5);
            break;
            
        case C_pin:
            break;
            
        case U_pin:
            if (val)
                moveCursor ('up');
            break;
            
        case D_pin:
            if (val)
                moveCursor ('down');
            break;
            
        case A_pin:
            //screen.drawCircle (40, 30, 11, val?0:1, true);
            break;
            
        case B_pin:
            if (val)
                runMenu (testMenu);
            break;
            
        default:
            console.log ("unknown button: " + pin)
            
    }
}

//-----------------------------------------------------------------------
 
function makeWatcher (pin) {
    return function (val) {
                handleButton (pin, val);
            }
}

//-----------------------------------------------------------------------
 
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

//-----------------------------------------------------------------------
 
function shutdown () {
}

//-----------------------------------------------------------------------
 
module.exports = {
    init : init,
    shutdown : shutdown
}