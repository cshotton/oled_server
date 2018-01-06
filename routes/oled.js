var express = require('express');
var router = express.Router();

/* POST /oled command */
// curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "This is a test"}' 'http://localhost:3000/oled'

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

console.log ("oled route initialized");

function clearScreen (color) {
    oled.fillRect (0,0,opts.width,opts.height,color);
}

function doCommand (cmd) {
//    console.log ("doCommand: " + JSON.stringify (cmd));
    
    var status = {
        response: "OK",
        message: "OK"
    };
    
    switch (cmd.cmd) {
        case "drawstring":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "This is a test"}' 'http://etherpi.local:3000/oled'
            oled.setCursor (cmd.x * 1, cmd.y * 1);
            oled.writeString (font, 1, cmd.str, cmd.color*1, true);            
            break;
            
        case "fillrect":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"fillrect","x0":1,"y0":10, "x1": 32, "y1":32, "color" : 1}' 'http://etherpi.local:3000/oled'
            oled.fillRect (cmd.x0-0, cmd.y0-0, cmd.x1-0, cmd.y1-0, cmd.color-0);
            break;
            
        case "drawline":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawline","x0":1,"y0":10, "x1": 32, "y1":32, "color" : 1}' 'http://etherpi.local:3000/oled'
            oled.drawLine (cmd.x0-0, cmd.y0-0, cmd.x1-0, cmd.y1-0, cmd.color-0);
            break;
            
        case "cleardisplay":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"cleardisplay"}' 'http://etherpi.local:3000/oled'
            oled.clearDisplay ();
            break;
            
        default:
            status.response = "ERR";
            status.message = "Command " + cmd.cmd + " not supported.";
            break;
    }
    
    return status;
}

router.post('/', function(req, res, next) {
    var status = {
        response: "OK",
        message: "OK"
    };
    
//    console.log ("oled: " + JSON.stringify(req.body));
    
    try {
        status = doCommand (req.body);
    }
    catch (err) {
        status.response = "ERR";
        status.message = JSON.stringify (err);
        console.log ("oled error: " + status.message);
    }
    
    res.send(status);
});

module.exports = router;
