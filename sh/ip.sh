#!/bin/sh
# call from /etc/rc.local:
#  su pi -c '/home/pi/oled_server/bin/www &'
#  su pi -c 'sh /home/pi/oled_server/rc.sh &'
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"cleardisplay"}' 'http://localhost:3000/oled'
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
    curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "Primary IP Address"}' 'http://localhost:3000/oled'
    JSON='{"cmd":"drawstring","x":1,"y":25, "color" : 1, "str": "'"$_IP"'"}'
    curl -XPOST -i -H "Content-type: application/json" -d "$JSON" 'http://localhost:3000/oled'
fi
