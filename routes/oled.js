var express = require('express');
var router = express.Router();
const appRoot = require('app-root-path');
var screen = require (appRoot + '/modules/oled_display');

/* POST /oled command */
// curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "This is a test"}' 'http://localhost:3000/oled'

//-----------------------------------------------------------------

function doCommand (cmd) {
//    console.log ("doCommand: " + JSON.stringify (cmd));
    
    var status = {
        response: "OK",
        message: "OK"
    };
    
    switch (cmd.cmd) {
        case "drawstring":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "This is a test"}' 'http://etherpi.local:3000/oled'
            screen.drawString (cmd.x-0, cmd.y-0, cmd.color-0, cmd.str);
            break;
            
        case "fillrect":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"fillrect","x0":1,"y0":10, "x1": 32, "y1":32, "color" : 1}' 'http://etherpi.local:3000/oled'
            screen.fillRect (cmd.x0-0, cmd.y0-0, cmd.x1-0, cmd.y1-0, cmd.color-0);
            break;
            
        case "drawline":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawline","x0":1,"y0":10, "x1": 32, "y1":32, "color" : 1}' 'http://etherpi.local:3000/oled'
            screen.drawLine (cmd.x0-0, cmd.y0-0, cmd.x1-0, cmd.y1-0, cmd.color-0);
            break;
            
        case "cleardisplay":
            // curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"cleardisplay"}' 'http://etherpi.local:3000/oled'
            screen.clearDisplay (cmd.color?1:0);
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
