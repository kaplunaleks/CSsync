const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

// SET ENV
process.env.NODE_ENV = 'dev';

let mainWindow;

// Listen for the app to be ready
app.on('ready',function(){
    // Create new window
    mainWindow = new BrowserWindow({});
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('close', function(){
        app.quit();
    });

    if(process.env.NODE_ENV !== 'dev'){
        // Disable main menu
        mainWindow.setMenu(null);
    } else {
        // Build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTamplate);
        // Insert menu
        Menu.setApplicationMenu(mainMenu);
    }
});

// Create menu template
const mainMenuTamplate = [
    {
        label: 'Dev',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    }
];

// Create SFTP connection
var Client = require('ssh2');
var connSettings = {
    host: 'ftp.compeng.ru',
    port: 22,
    username: 'adminsrv',
    password: 'PolInetaNet1761'
};

var conn = new Client();

conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
         if(err) throw err;
         
         sftp.readdir('/mnt/ftp/ANS', function(err, list) {
                if(err) throw err;
                // List the directory in the console
                var dirSize = 0;
                for(var f of list){
                    dirSize += f.attrs.size;
                }
                //console.log(JSON.stringify(list[0]));
                console.log(dirSize);
                // Do not forget to close the connection, otherwise you'll get troubles
                dirSize = 0;
                conn.end();
         });
    });
}).connect(connSettings);