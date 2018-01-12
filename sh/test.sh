#!/bin/sh
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"cleardisplay"}' 'http://localhost:3000/oled'
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "This is a test script"}' 'http://localhost:3000/oled'
