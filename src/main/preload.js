const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {

    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },

    on(channel, func) {

      console.log("......", channel)

      const validChannels = ['ipc-example', "poll_update"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },

    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },

    receive: (channel, func) => {

      console.log("...1...", channel)
      // let validChannels = ["fromMain"];
      // if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      // }
    },

  },
});
