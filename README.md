# Electrekit -- Electron + Sveltekit

(ELECTRon + SveltEKIT)

This is a barebones install for an Electron app running SvelteKit with a static adapter.

Inspired by the [FractalHQ](https://github.com/FractalHQ/sveltekit-electron) implementation. Which adds support for Typescript, Eslint, Prettier, and SASS - but I didn't want all that when getting started.

## Quickstart

`npx degit malynium/electrekit`

`npm install`

[Usage](#usage)

Or for more up-front customization - like adding Typesript, Eslint, and Prettier - use the below steps to install manually.

## Install SvelteKit

`npm init svelte@next <desired-app-directory-name>` Ex, `my-app`

Choose whatever you'd like for the sveltekit setup options.

```
cd my-app
npm install
```

## Install and configure the static adapter in svelte.config.js

`npm i -D @sveltejs/adapter-static@next`

Import the adapter, disable SSR, and change the output of build files from 'build' to 'static.

```
// svelte.config.js

import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'static',
    }),
    ssr: false,
  }
};
```

## Install Electron and other packages

`npm i -D electron electron-serve @electron-forge/cli concurrently cross-env`

## Add main to package.json

```
// package.json

"main": "src/electron.cjs",
```

## Create and setup electron.cjs

`touch src/electron.cjs` || or whatever method you'd use to create a new file.

Insert the below code into src/electron.cjs

```
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

  // if running in a dev environment, sveltekit will fire up a local webserver, so load that. Otherwise, serve the static files created during the sveltekit build process
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
```

## Import Electron Forge

`npx electron-forge import`

## Replace all package.json scripts with these

```
"scripts": {
  "dev": "NODE_ENV=dev npm run dev:all",
  "dev:all": "concurrently -n=svelte,electron -c='#ff3e00',blue \"npm run dev:svelte\" \"npm run dev:electron\"",
  "dev:svelte": "svelte-kit dev",
  "dev:electron": "electron src/electron.cjs",
  "build": "cross-env NODE_ENV=production npm run build:svelte && npm run make",
  "build:svelte": "svelte-kit build",
  "start": "electron-forge start",
  "start:svelte": "svelte-kit start",
  "package": "electron-forge package",
  "make": "electron-forge make"
},
```

## Usage

### Development

SvelteKit runs a webserver, and Electron loads that page in it's window

`npm run dev`

### Build Svelte

SvelteKit creates your webapp and saves the files in the `static` directory, to prep for an Electron build.

`npm run build:svelte`

### Test Electron

Electron starts your app locally

`npm run start`

### Build Electron

For creating platform applications (macOS, Windows)

`npm run make`