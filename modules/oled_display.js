// oled_screen.js
"use strict";
const MODULE_NAME = "oled_display";

var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    OLED = require('oled-i2c-bus');

var font = require('oled-font-5x7');
 
var opts = {
    width: 128,
    height: 64,
    address: 0x3C
};
 
var oled = new OLED(i2cBus, opts);
clearScreen(0);

//-----------------------------------------------------------------

function clearScreen (color) {
    oled.fillRect (0,0,opts.width,opts.height,color);
}

//-----------------------------------------------------------------

function dimDisplay (dim) {
    oled.dimDisplay (dim);
}

//-----------------------------------------------------------------

function invertDisplay (invert) {
    oled.invertDisplay (invert);
}

//-----------------------------------------------------------------

function drawPixel (pixelArray, updateNow) { // [[x,y,c],...]
    oled.drawPixel (pixelArray, updateNow);            
}

//-----------------------------------------------------------------

function drawString (x, y, color, str) {
    oled.setCursor (x, y);
    oled.writeString (font, 1, str, color, true);            
}

//-----------------------------------------------------------------

function fillRect (x0, y0, x1, y1, color) {
    oled.fillRect (x0, y0, x1, y1, color);
}

//-----------------------------------------------------------------

function drawLine (x0, y0, x1, y1, color) {
    oled.drawLine (x0, y0, x1, y1, color);
}


//-----------------------------------------------------------------

function drawBitmap (data) {
    oled.drawBitmap (data);
}

//-----------------------------------------------------------------

function drawPngFile (path, dither) {
    var pngtolcd = require ('png-to-lcd');
    try {
        pngtolcd (path, dither, function (err, image) {
            oled.buffer = image;
            oled.update ();
        })
    }
    catch (err) {
        console.log ("drawPngFile err: " + err);
    }
}

//-----------------------------------------------------------------

function startScroll (dirLR, startRow, stopRow) {
    oled.startScroll (dirLR, startRow, stopRow);
}


//-----------------------------------------------------------------

function stopScroll () {
    oled.stopScroll ();
}


//-----------------------------------------------------------------

function turnOnDisplay () {
    oled.turnOnDisplay ();
}


//-----------------------------------------------------------------

function turnOffDisplay () {
    oled.turnOffDisplay ();
}


//-----------------------------------------------------------------

function drawCircle (x0, y0, r, color, immed) {
    var f = 1 - r;
    var ddF_x = 1;
    var ddF_y = -2 * r;
    var x = 0;
    var y = r;

    oled.drawPixel(
        [[x0, y0 + r, color],
        [x0, y0 - r, color],
        [x0 + r, y0, color],
        [x0 - r, y0, color]],
        false
    );

    while(x < y) {
        if (f >=0) {
            y--;
            ddF_y += 2;
            f += ddF_y;
        }
        x++;
        ddF_x += 2;
        f += ddF_x;

        oled.drawPixel(
            [[x0 + x, y0 + y, color],
            [x0 - x, y0 + y, color],
            [x0 + x, y0 - y, color],
            [x0 - x, y0 - y, color],
            [x0 + y, y0 + x, color],
            [x0 - y, y0 + x, color],
            [x0 + y, y0 - x, color],
            [x0 - y, y0 - x, color]],
            false
        );
    }
    if (immed)
        oled.update();
}

//-----------------------------------------------------------------

function fillCircleHelper (x0, y0, r, cornername, delta, color) {
    var f     = 1 - r;
    var ddF_x = 1;
    var ddF_y = -2 * r;
    var x     = 0;
    var y     = r;

    while (x<y) {
        if (f >= 0) {
            y--;
            ddF_y += 2;
            f     += ddF_y;
        }
        x++;
        ddF_x += 2;
        f     += ddF_x;

        var xpx = x0+x;
        var xpy = x0+y;
        var ymy = y0-y;
        var ymx = y0-x;
        var xmx = x0-x;
        var xmy = x0-y;
        
        if (cornername & 0x1) {
            oled.drawLine(xpx, ymy, xpx, ymy+(2*y+1+delta), color, false);
            oled.drawLine(xpy, ymx, xpy, ymx+(2*x+1+delta), color, false);
        }
        if (cornername & 0x2) {
            oled.drawLine(xmx, ymy, xmx, ymy+(2*y+1+delta), color, false);
            oled.drawLine(xmy, ymx, xmy, ymx+(2*x+1+delta), color, false);
        }
    }
        
}

//-----------------------------------------------------------------

function fillCircle (x0, y0, r, color, immed) {
//https://github.com/adafruit/Adafruit-GFX-Library
    oled.drawLine (x0, y0-r, x0, (y0-r) + (2*r+1), color, false);
    
    fillCircleHelper (x0, y0, r, 3, 0, color);
    
    if (immed)
        oled.update();
}


module.exports = {
    clearDisplay : clearScreen,
    clearScreen : clearScreen,
    dimDisplay : dimDisplay,
    invertDisplay : invertDisplay,
    drawPixel : drawPixel,
    drawString : drawString,
    drawBitmap : drawBitmap,
    drawPngFile : drawPngFile,
    fillRect : fillRect,
    drawLine : drawLine,
    startScroll : startScroll,
    stopScroll : stopScroll,
    turnOnDisplay : turnOnDisplay,
    turnOffDisplay : turnOffDisplay,
    drawCircle : drawCircle,
    fillCircle : fillCircle
}