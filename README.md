# oled_server
node.js server for drawing on the AdaFruit 128x64 OLED Bonnet for Raspberry Pi

If you're experienced with node.js (Express.js) projects, the important stuff is in the `routes/oled.js` file. 
If you aren't so node.js savvy, then you should download the GitHub repository to your Raspberry Pi and enter 
the following (assumes that you have node.js installed and oled_server downloaded to your pi user's home directory):

```
cd /home/pi/oled_server
npm install
/home/pi/oled_server/bin/www
```

Once it is installed and running, you can test it with:

`curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "This is a test"}' 'http://localhost:3000/oled'`

Other supported commands include:

```
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"fillrect","x0":1,"y0":10, "x1": 32, "y1":32, "color" : 1}' 'http://localhost:3000/oled'
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawline","x0":1,"y0":10, "x1": 32, "y1":32, "color" : 1}' 'localhost:3000/oled'
curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"cleardisplay"}' 'http://localhost:3000/oled'
```

Additional functions are available in modules/oled_display.js, but haven't been added to
the routes in routes/oled.js yet.

I have the following commands at the end of my /etc/rc.local file to start up the server on boot and show an initial message with the Pi's IP address:
```
su pi -c '/home/pi/oled_server/bin/www &'
su pi -c 'sh /home/pi/oled_server/rc.sh &'
```
/home/pi/rc.sh has the following contents:

```
  #!/bin/sh
  sleep 10
  _IP=$(hostname -I) || true
  if [ "$_IP" ]; then
      curl -XPOST -i -H "Content-type: application/json" -d '{"cmd":"drawstring","x":1,"y":10, "color" : 1, "str": "Welcome to EtherPi"}' 'http://localhost:3000/oled'
      JSON='{"cmd":"drawstring","x":1,"y":25, "color" : 1, "str": "'"$_IP"'"}'
      curl -XPOST -i -H "Content-type: application/json" -d "$JSON" 'http://localhost:3000/oled'
  fi
```
As a work in progress, support has been added for a basic menu driven UI that can
be worked from the OLED Bonnet's joystick and buttons. On start-up a menu JSON file
is loaded from the file specified on the command line, or an internal demo menu is used
if none is specified.

These menus can have commands that execute external shell scripts, and these scripts
can call back to the web services to draw on the OLED screen (the 'exec' command in
menu definitions). In addition, the menu JSON can refer to other menus that can be 
loaded when selected (the 'menu' command in menu definitions).

Up and down move the selection cursor. Right executes the current menu choice. Left
redraws the current menu, and button #6 (B) toggles the OLED display on and off. (it
defaults to off upon start-up).

See the source code in modules/buttons.js for more details.

