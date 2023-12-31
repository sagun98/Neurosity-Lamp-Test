### Binary/Digital Lights
```
kasa --host 192.168.0.140 --type "plug" on
kasa --host 192.168.0.140 --type "plug" off
```

### Analog lights
```
kasa --host 192.168.0.108 --type "bulb" on 
kasa --host 192.168.0.108 --type "bulb" off 
kasa --host 192.168.0.108 --type "bulb" brightness 100
kasa --host 192.168.0.108 --type "bulb" brightness 0
```

// Source bash profile 
source ~/.bash_profile

// Start the server
npm start 