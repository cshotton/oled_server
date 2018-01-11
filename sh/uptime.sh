#!/bin/sh
up=`uptime`
load=`echo $up|awk '{print $8 $9 $10}'`
since=`echo $up|awk '{print $3}'`
users=`echo $up|awk '{print $4}'`
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"cleardisplay"}' 'http://localhost:3000/oled'
JSON='{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "Up '"$since"'"}'
curl -XPOST -i -H "Content-type: application/json" -d "$JSON" 'http://localhost:3000/oled'
JSON='{"cmd":"drawstring","x":1,"y":20, "color" : 1, "str": "Users '"$users"'"}'
curl -XPOST -i -H "Content-type: application/json" -d "$JSON" 'http://localhost:3000/oled'
JSON='{"cmd":"drawstring","x":1,"y":30, "color" : 1, "str": "'"$load"'"}'
curl -XPOST -i -H "Content-type: application/json" -d "$JSON" 'http://localhost:3000/oled'
#echo $since
#echo $users
#echo $load