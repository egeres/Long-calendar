/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { globalShortcut } from 'electron';
import { directory_setup }            from "./long_calendar_functionality";
import { get_sources_in_data_folder } from "./long_calendar_functionality";
import { get_config }                 from "./long_calendar_functionality";
import { override_config }            from "./long_calendar_functionality";

const electron = require('electron');
const fs       = require('fs');
const chokidar = require('chokidar')


let path_directory_data : string = path.join(__dirname, "..", "..", "data");
global.config = {}

console.log("...")
console.log(get_sources_in_data_folder(path_directory_data))

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors')
const app_express = express();

app_express.use(bodyParser.urlencoded({extended:false}));
app_express.use(bodyParser.json());
app_express.use(cors())

app_express.get("/sources_in_data_folder", (_req: any, res: any) => {
  res.json(
    get_sources_in_data_folder(path_directory_data)
  )
})

app_express.get("/get_file_data", (req: any, res: any) => {

  try
  {
    let rawdata = fs.readFileSync(req.query.path_file);

    if (rawdata === "")
    {
      res.json({
        "status"     : "error",
        "description": "File is empty",
      })
    }

    let data    = JSON.parse(rawdata);
    res.json({
        "status": "success",
        "data"  : data
    });
  }
  catch (exception)
  {
    res.json({
      "status"     : "error",
      "description": exception.toString(),
    })
  }

});

app_express.post("/set_config_prop", (req: any, res: any) => {

  console.log(req.query.target,)
  console.log(req.body,)

  override_config(
    path.join(__dirname, "..", ".."),
    req.query.target,
    req.body,
  )

})
app_express.listen(17462, () => { console.log("Listening") })



export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}


let mainWindow: BrowserWindow | null = null;
let mainWindow_ishidden : boolean                 = false;
let mainWindow_cantogglehidden_cooldown : boolean = true;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  let monitorWidth  = electron.screen.getPrimaryDisplay().size.width;
  let monitorHeight = electron.screen.getPrimaryDisplay().size.height;

  mainWindow = new BrowserWindow({
    show           : false,
    frame          : false, // Frameless
    autoHideMenuBar: true,  // No upper menu
    transparent    : true,

    width  : monitorWidth ,
    height : monitorHeight,

    icon          : getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {

    globalShortcut.register('Alt+E', () => {

      if (mainWindow_cantogglehidden_cooldown) {

        // The cooldown is set
        mainWindow_cantogglehidden_cooldown = false;
        setTimeout(() => {mainWindow_cantogglehidden_cooldown = true;}, 300);
        
        // We toggle the state of the window
        if (mainWindow !== null)
        {
          if (!mainWindow_ishidden) {
            mainWindow?.hide()
            mainWindow_ishidden = true;
          }
          else {
            mainWindow?.show()
            mainWindow_ishidden = false;
          }
        }
      }
        
    })

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {

    directory_setup(
      path.join(__dirname, "..", "..")
    );
    
    global.config = get_config(
      path.join(__dirname, "..", "..")
    )

    function update_front(path)
    {
      console.log(path)
      mainWindow.webContents.send('poll_update'  , {'path': path});
      // mainWindow.webContents.send('poll_update_2', {'path': path});
    }

    let watcher = chokidar.watch(
      path.join(__dirname, "..", "..", "data", "*.json"),
      {
        ignored         : "config.json",
        persistent      : true,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval      : 100
        },
      }
    );
    watcher
      .on('add',    function(path ) { update_front(path) /* console.log('File', path, 'has been added');   */ })
      .on('change', function(path ) { update_front(path) /* console.log('File', path, 'has been changed'); */ })
      .on('unlink', function(path ) { update_front(path) /* console.log('File', path, 'has been removed'); */ })
      .on('error',  function(error) { console.error('Error happened', error); })
    

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
