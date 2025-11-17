const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nfcAPI", {
  onReaderStatus: (callback) => {
    ipcRenderer.on("reader-status", (event, data) => callback(data));
  },
  onCardDetected: (callback) => {
    ipcRenderer.on("card-detected", (event, data) => callback(data));
  },
  onCardRemoved: (callback) => {
    ipcRenderer.on("card-removed", () => callback());
  },
  onUrlDetected: (callback) => {
    ipcRenderer.on("url-detected", (event, data) => callback(data));
  },
  onTagProcessed: (callback) => {
    ipcRenderer.on("tag-processed", (event, data) => callback(data));
  },
  onDataRead: (callback) => {
    ipcRenderer.on("data-read", (event, data) => callback(data));
  },
  onError: (callback) => {
    ipcRenderer.on("error", (event, data) => callback(data));
  },
  onPlaySound: (callback) => {
    ipcRenderer.on("play-sound", (event, data) => callback(data));
  },
  setBooth: (boothId, boothName) => {
    ipcRenderer.send("set-booth", { boothId, boothName });
  },
});
