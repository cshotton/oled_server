// buttons.js
"use strict";
const MODULE_NAME = "buttons";

var raspi = require ('raspi');
var gpio = require('raspi-gpio');
const appRoot = require('app-root-path');
var screen = require (appRoot + '/modules/oled_display');
const exec = require ('child_process').exec;

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

var displayState = true;
var waitForButton = false;

var currentMenu = {
        "title" : "Internal Test Menu",
        "prev"  : null,
        "items" : [
                {
                    "msg" : "test 1",
                    "action" : {
                            "cmd" : "exec",
                            "arg" : "sh " + appRoot + "/sh/test.sh"
                        }
                },
                {
                    "msg" : "test 2",
                    "action" : {
                            "cmd" : "",
                            "arg" : ""
                        }
                },
                {
                    "msg" : "test 3",
                    "action" : {
                            "cmd" : "",
                            "arg" : ""
                        }
                }
            ]
    };
    
//-----------------------------------------------------------------------
 
function loadFile(path, opts) {
    const fs = require('fs'); //inside here because implementation may change and it's not used anywhere else
    var data = "";
    try {
//		console.log ("loading file " + path);
        data = fs.readFileSync(path, opts);
//        console.log("loadFile completed. " + path);
        return data;
    } catch (err) {
        console.log ("Error loadFile " + path + ": " + err);
        console.log ("loadfile error: " + JSON.stringify (err));
        return data;
    }
}

//-----------------------------------------------------------------------
 
function loadCurrentMenu (path) {
	console.log ("loading currentMenu: " + path);
	if (path !== undefined && path.length)
		try {
			var menu = JSON.parse (loadFile (path, null));
			if (menu) {
				currentMenu = menu;
			}
		} catch (err) {
			console.log ("loadCurrentMenu error: " + JSON.stringify (err));
		}
}

//-----------------------------------------------------------------------
 
function setMenuCursor (item) {
    screen.fillRect (0, menuTitleHeight, cursorIndent-1, screenHeight-1, 0);
    screen.drawString (1,menuTitleHeight + (item)*lineHeight,1,">");
}
   
//-----------------------------------------------------------------------
 
function drawMenu (menu) {
    screen.clearScreen(0);
    if (menuTitleHeight) { //there is a title to draw
        //screen.fillRect (0,0,screenWidth-1,menuTitleHeight,1);
        screen.drawString (1, 0, 1, menu.title);    
    }
    
    for (var i=0;i<menuItemCount; i++) {
        var y = menuTitleHeight + (i) * lineHeight;
//        console.log ("item: "+i+": "+menu.items[i].msg+" @"+y);
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
    
//    console.log ("running menu: " + menu.title + "\nitem count: " + menuItemCount);
    
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

function doMenuChoice (menu, item) {
    switch (menu.items[item].action.cmd) {
        case 'exec':
            var arg = menu.items[item].action.arg;
//            console.log ("Running " + arg);
            
            var cmd = exec (arg, (error, stdout, stderr) => {
                    if (error !== null) {
                        console.log ("exec error: " + error);
                    }
                });
            break;
            
        case 'menu':
			var arg = menu.items[item].action.arg;
			loadCurrentMenu (arg);
			runMenu (currentMenu);
			break;
    
        default:
            console.log ('menu action not processed: ');
    }

}

 
//-----------------------------------------------------------------------
 
function handleButton (pin, val) {
        
    if (waitForButton) { //this is the first button press before starting the menuItemCount
        if (val) {
            waitForButton = false;
            runMenu (currentMenu);
            return;
        }
    }
    
    switch (pin) {
        case L_pin:
            if (val)
                runMenu (currentMenu);
            break;
            
        case R_pin:
            if (val)
                doMenuChoice (currentMenu, currentMenuItem);
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
            if (val) {
                displayState = !displayState;
                if (displayState) {
                    screen.turnOnDisplay();
                }
                else {
                    screen.turnOffDisplay();
                }
            }
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
 
function init (firstMenuPath, splashScreen) {
    raspi.init (() => {
        try {
            for (var i=0; i<pins.length; i++) {
//                console.log ("making GPIO" + pins[i])
                buttons[i] = new gpio.DigitalInput({
                    pin:'GPIO'+pins[i],
                    pullResistor: gpio.PULL_UP});
                buttons[i].on ('change', makeWatcher (pins[i]));
            }
            
            //start the main menu
            loadCurrentMenu (firstMenuPath);
            screen.clearScreen(0);
            if (splashScreen)
                screen.drawPngFile (splashScreen, false);
            displayState = true;
            waitForButton = true;
            
//            runMenu (currentMenu);
        }
        catch (err) {
//            console.log ("buttons err: " + err)
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