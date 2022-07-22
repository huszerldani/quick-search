const {app, BrowserWindow, Tray, Menu, globalShortcut} = require('electron')
const path = require('path')

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1200,
    height: 800,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL('https://google.com')
}

let tray = null
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  tray = new Tray('./img/tray_icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open window',
      click: () => {
        openOrShow()
      }
    }, {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('Quick search')
  tray.setContextMenu(contextMenu)

  tray.on('click', function(e){
    openOrShow()
  })

  const ret = globalShortcut.register('CommandOrControl+L', () => {
    openOrShow(true)
  })
})

function openOrShow(closeIfOpened) {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    if (mainWindow.isMaximized()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  }
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    //app.quit()
  }
})
