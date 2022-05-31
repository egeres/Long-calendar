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
import { set_config_prop }            from "./long_calendar_functionality";
import { get_config_prop }            from "./long_calendar_functionality";
import { get_config_default }         from "./long_calendar_functionality";

import chalk from 'chalk';
const electron = require('electron');
const fs       = require('fs');
const chokidar = require('chokidar')
const util     = require('util');
const exec     = util.promisify(require('child_process').exec);
const hjson    = require('hjson');

let path_dir_root : string = path.join(__dirname, "..", "..");

let last = path.basename(path_dir_root)
if (last == "app.asar")
{
  path_dir_root = path.dirname(app.getPath('exe'))
}

let path_directory_data : string = path.join(path_dir_root, "data");
global.config = get_config_default()

directory_setup(path_dir_root);



if (global?.config?.window?.recalculate_data_on_launch)
{
  // WIP: This code needs to be refactored into a method to avoid duplication!
  if (global?.config?.window?.recalculate_data_command)
  {
    let out = exec(
      global?.config?.window?.recalculate_data_command,
      {"cwd":path_dir_root}
    )
    .then( x   => console.log(chalk.green('-'), "Finished..."))
    .catch(err => console.log)
  }
}

ipcMain.on('set_config_prop', async (event, arg) => {
  set_config_prop(path_dir_root,arg,);
});

ipcMain.on('sources_in_data_folder', async (event, arg) => {
  // event.reply('sources_in_data_folder', get_sources_in_data_folder(path_directory_data));
  event.returnValue = get_sources_in_data_folder(path_directory_data)
});

ipcMain.on('get_config_prop', async (event, arg) => {
  global.config = get_config(path_dir_root);
  let out = get_config_prop(arg);
  event.returnValue = out;
});

ipcMain.on('get_file_data', async (event, arg) => {

  try
  {
    let rawdata = fs.readFileSync(arg);

    if (rawdata === "") { event.reply('sources_in_data_folder', "File is empty"); }

    let data = hjson.parse(rawdata.toString())
    
    // res.json({
    //     "status": "success",
    //     "data"  : data
    // });

    // event.reply('sources_in_data_folder', data);

    event.returnValue = ({
        "status": "success",
        "data"  : data,
    });

  }
  catch (exception)
  {
    // console.log(exception)
    // res.json({
    //   "status"     : "error",
    //   "description": exception.toString(),
    // })
    // event.reply('sources_in_data_folder', exception.toString());

    event.returnValue = ({
      "status": "error",
      "data"  : exception.toString(),
    });

  }

});

ipcMain.on('reload', async (event) => {

  // WIP: This code needs to be refactored into a method to avoid duplication!
  if (global?.config?.window?.recalculate_data_command)
  {
    let out = exec(
      global?.config?.window?.recalculate_data_command,
      {"cwd":path_dir_root}
    )
    .then( x   => console.log(chalk.green('-'), "Finished executing script..."))
    .catch(err => console.log)
  }

});

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors')
const app_express = express();

app_express.use(bodyParser.urlencoded({extended:false}));
app_express.use(bodyParser.json());
app_express.use(cors())

// app_express.get("/sources_in_data_folder", (_req: any, res: any) => {
//   res.json(
//     get_sources_in_data_folder(path_directory_data)
//   )
// })

// app_express.get("/get_config", (_req: any, res: any) => {
//   res.json(
//     get_config(
//       path_dir_root
//     )
//   )
// })

// app_express.get("/get_file_data", (req: any, res: any) => {
//   try
//   {
//     let rawdata = fs.readFileSync(req.query.path_file);
//     if (rawdata === "")
//     {
//       res.json({
//         "status"     : "error",
//         "description": "File is empty",
//       })
//     }
//     // let data = JSON.parse(rawdata);
//     // let data = hjson.parse("{a:0}")
//     let data = hjson.parse(rawdata.toString())
//     res.json({
//         "status": "success",
//         "data"  : data
//     });
//   }
//   catch (exception)
//   {
//     console.log(exception)
//     res.json({
//       "status"     : "error",
//       "description": exception.toString(),
//     })
//   }
// });

// app_express.post("/set_config_prop", (req: any, res: any) => {
//   set_config_prop(
//     path_dir_root,
//     req.body,
//   )
//   res.send("ok");
// })

// app_express.post("/get_config_prop", (req: any, res: any) => {
//   global.config = get_config(path_dir_root)
//   // console.log(req.body)
//   // res.json({
//   //   value: get_config_prop(req.body)
//   // });
//   // console.log("/get_config_prop")
//   // console.log(req.query.target)
//   // console.log(req.body)
//   // res.json({
//   //   value: get_config_prop(req.query.target)
//   // });
//   let out = get_config_prop(req.body,)
//   console.log(out)
//   res.json(out);
// })

// app_express.get("/reload", (req: any, res: any) => {
//   // WIP: This code needs to be refactored into a method to avoid duplication!
//   if (global?.config?.window?.recalculate_data_command)
//   {
//     let out = exec(
//       global?.config?.window?.recalculate_data_command,
//       {"cwd":path_dir_root}
//     )
//     .then( x   => console.log(chalk.green('-'), "Finished..."))
//     .catch(err => console.log)
//   }
//   res.send("Finished!");
// });

app_express.get("/set_fullscreen_off", (req: any, res: any) => {
  mainWindow?.setFullScreen(false)
});

app_express.get("/set_fullscreen_on", (req: any, res: any) => {
  mainWindow?.setFullScreen(true)
});

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
  // console.log(msgTemplate(arg));
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

  // monitorWidth  = 1000;
  // monitorHeight =  500;

  // console.log("Config:")
  // console.log(global.config)


  // let show_frame   = false;
  // let is_resizable = false;
  // if (global?.config?.fullscreen === undefined)
  // {
  // }
  // else
  // {
  //   show_frame   = ! global?.config?.fullscreen
  //   is_resizable =   global?.config?.fullscreen
  // }

  let windows_configuration = {
    show           : false,
    resizeable     : false,
    movable        : false,
    frame          : false, // Si es una ventana frameless
    fullscreen     : true ,
    // alwaysOnTop    : true ,
    autoHideMenuBar: true ,
    transparent    : true ,

    width          : monitorWidth ,
    height         : monitorHeight,
    icon           : getAssetPath('icon.png'),
    webPreferences : {
      preload : path.join(__dirname, 'preload.js'),
      devTools: true,
    },
  }

  if (global?.config?.window?.fullscreen !== undefined && (!global?.config?.window?.fullscreen))
  {
    // windows_configuration.frame       = true;
    // windows_configuration.resizeable  = true;
    // windows_configuration.movable     = true;
    // windows_configuration.fullscreen  = false;
    // windows_configuration.alwaysOnTop = true;
    
    windows_configuration = {
      autoHideMenuBar: true ,
      // transparent    : true ,
      icon           : getAssetPath('icon.png'),
      webPreferences : {
        // nodeIntegration : true,
        // contextIsolation: false,
        preload         : path.join(__dirname, 'preload.js'),
        devTools        : true,
      },
    }
  }

  mainWindow = new BrowserWindow(windows_configuration);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {

    globalShortcut.register(global?.config?.window?.shortcut ?? "Alt+E", () => {

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

    directory_setup(path_dir_root);
    
    global.config = get_config(path_dir_root)

    function update_front(path)
    {
      if (mainWindow && mainWindow?.webContents)
      {
        mainWindow.webContents.send('poll_update', {'path': path});
      }
    }

    let watcher = chokidar.watch(
      path.join(path_dir_root, "data", "*.json"),
      {
        ignored : [
          path.join(path_directory_data, "config.json"),
        ],
        persistent      : true,
        awaitWriteFinish: {
          stabilityThreshold: global.config?.window?.reload_interval ?? 2000,
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
