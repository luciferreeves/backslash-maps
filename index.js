const {app, BrowserWindow, Menu} = require('electron')
const url = require('url')
const path = require('path')
const shell = require('electron').shell
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280, 
    height: 800,
    minWidth: 1024,
    minHeight: 600,
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
    win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  var menu = Menu.buildFromTemplate([
    {
        label: 'BackSlash Maps',
        submenu: [
          {
            label:'BackSlash Linux Home',
            click() { 
                shell.openExternal('http://www.backslashlinux.com')
            } 
          },
            {
              label:'Exit', 
              click() { 
                  app.quit() 
              }, 
              accelerator: 'CmdOrCtrl+Q'
          }
        ]
    }
])
Menu.setApplicationMenu(menu);
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})