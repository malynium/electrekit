const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve')

const loadStaticFiles = serve({ directory: 'static' })
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV === 'dev'

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // if running in a dev environment, sveltekit will fire up a local webserver, so load that. Otherwise, serve static files output by sveltekit during the build process
  dev ? win.loadURL(`http://localhost:${port}`) : loadStaticFiles(win)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})