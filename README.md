# BackSlash Maps

A Simple Maps Application via Electron Framework

## Prerequisites:

- NodeJS with NPM. Check your version of NodeJS by running `node -v` in a terminal.
- A PC running macOS or Windows (For release build)

## How to start:

- Install git on your Linux by running one of the following commands. Git comes pre-installed on macOS. 

  - #### Ubuntu/Debian:

    `sudo apt-get install git`

  - #### Arch

    `sudo pacman -S git`

  - #### Fedora

    `sudo dnf install git`

  - #### CentOS

    `sudo yum install git`

- Start a Terminal and clone the repository:

  ```
  git clone https://github.com/luciferreeves/backslash-maps.git
  ```

- Navigate to the repo folder:

  ```
  cd backslash-maps
  ```

- Install Node Modules and Dependencies:

  ```
  npm install
  ```

- Start the App via terminal:

  ```
  npm start
  ```

## How to build:

You can build the app for either macOS or Linux. To build for any or all of the platforms, run the following commands based upon your needs:

```
npm run package-mac
npm run package-linux
```

## How to create DEB file:

The app creates an unpackaged version of Linux build. What you may be interested in is creating a DEB file for Ubuntu and Debian Systems. Start this by installing *electron-installer-debian* package. You might want to run the command as administrator using **sudo** before the command:

```
npm install -g electron-installer-debian
```

Next, create a file called **debian.json** in the root directory (where **index.js** is located). Write the following contents in there:

```json
{
  "dest": "release-builds/",
  "icon": "assets/icon.png",
  "categories": [
    "Utility"
  ],
  "lintianOverrides": [
    "changelog-file-missing-in-native-package"
  ]
}
```

Now update the following code in the **package.json** already present in the folder, in the scripts section:

```json
...

"scripts": {
    "start": "electron .",
    "package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icon.icns --prune=true --out=release-builds",
    "package-linux": "electron-packager . backslash-maps --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icon.png --prune=true --out=release-builds",
  "create-debian-installer": "electron-installer-debian --src release-builds/backslash-maps-linux-x64/ --arch amd64 --config debian.json"
  },

...
```

To create a debian installer, first package the app as per regular method by running `npm run package-linux` and then run the following command:

```
npm run create-debian-installer
```



## Packaging the App for Windows:

Packaging for Windows is not included in the scripts currently but this can be done quite, easily. You will need a Windows machine for this with NodeJS installed. First download an icon for the app by [clicking here](https://cloud.backslashlinux.com/index.php/s/TZb9sZCLS58ZCGE/download) and move the icon to **assets** folder Now update the following code in the **package.json** already present in the folder, in the scripts section:

```json
...

"scripts": {
 "start": "electron .",
 "package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icon.icns --prune=true --out=release-builds",
 "package-linux": "electron-packager . backslash-maps --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icon.png --prune=true --out=release-builds",
 "create-debian-installer": "electron-installer-debian --src release-builds/backslash-maps-linux-x64/ --arch amd64 --config debian.json",
  "package-win": "electron-packager . backslash-maps --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icon.ico --prune=true --out=release-builds --version-string.CompanyName=\"BackSlash Linux\" --version-string.FileDescription=BackSlashMaps --version-string.ProductName=\"BackSlash Maps\"",  
 },

...
```

After updating the code, run:

```
npm run package-win
```



## Creating Windows .exe installer:

Start by installing the following package by running the command in your terminal:

```
npm install --save-dev electron-winstaller
```

Create a new file called **createinstaller.js** in **installers/windows/** (you would need to create the folder) and write the following code in it:

```javascript
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'BackSlash-Maps-win32-ia32/'),
    authors: 'BackSlash Linux',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'backslash-maps.exe',
    setupExe: 'BackSlashMapsInstaller.exe',
    setupIcon: path.join(rootPath, 'assets', 'icon.ico')
  })
}
```

Now to handle squirrel events, create a file called **setupEvents.js** in the folder **installers/** and write the following code in it:

```javascript
const electron = require('electron')
const app = electron.app

module.exports = {
handleSquirrelEvent: function() {
 if (process.argv.length === 1) {
 return false;
 }

 const ChildProcess = require('child_process');
 const path = require('path');

 const appFolder = path.resolve(process.execPath, '..');
 const rootAtomFolder = path.resolve(appFolder, '..');
 const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
 const exeName = path.basename(process.execPath);
 const spawn = function(command, args) {
 let spawnedProcess, error;

 try {
 spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
 } catch (error) {}

 return spawnedProcess;
 };

 const spawnUpdate = function(args) {
 return spawn(updateDotExe, args);
 };

 const squirrelEvent = process.argv[1];
switch (squirrelEvent) {
 case '--squirrel-install':
 case '--squirrel-updated':
 // Optionally do things such as:
 // - Add your .exe to the PATH
 // - Write to the registry for things like file associations and
 // explorer context menus

 // Install desktop and start menu shortcuts
 spawnUpdate(['--createShortcut', exeName]);

 setTimeout(app.quit, 1000);
 return true;

 case '--squirrel-uninstall':
 // Undo anything you did in the --squirrel-install and
 // --squirrel-updated handlers

 // Remove desktop and start menu shortcuts
 spawnUpdate(['--removeShortcut', exeName]);

 setTimeout(app.quit, 1000);
 return true;

 case '--squirrel-obsolete':
 // This is called on the outgoing version of your app before
 // we update to the new version - it's the opposite of
 // --squirrel-updated

 app.quit();
 return true;
}
}
}
```

Now go to **index.js** and add the following code in the beginning:

```javascript
//handle setupevents as quickly as possible
 const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }

const electron = require('electron')

...
```

Update the scripts section in **package.json** as follows:

```
...

"scripts": {
 "start": "electron .",
 "package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icon.icns --prune=true --out=release-builds",
 "package-linux": "electron-packager . backslash-maps --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icon.png --prune=true --out=release-builds",
 "create-debian-installer": "electron-installer-debian --src release-builds/backslash-maps-linux-x64/ --arch amd64 --config debian.json",
  "package-win": "electron-packager . backslash-maps --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icon.ico --prune=true --out=release-builds --version-string.CompanyName=\"BackSlash Linux\" --version-string.FileDescription=BackSlashMaps --version-string.ProductName=\"BackSlash Maps\"",  
 },
   "create-installer-win": "node installers/windows/createinstaller.js",

...
```

Finally run the following commands to create a Windows installer:

```
npm run package-win
npm run create-installer-win
```



## Creating DMG installer for macOS

Start by running the following command in the terminal:

```
npm install electron-installer-dmg --save-dev
```

Next, create the macOS package:

```
npm run package-mac
```

Run the following command to generate the dmg installer:

```
electron-installer-dmg ./release-builds/BackSlash\ Maps-darwin-x64/BackSlash\ Maps.app backslash-maps
```


