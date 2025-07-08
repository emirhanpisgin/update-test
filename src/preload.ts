
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronUpdater', {
  onUpdateState: (callback: (state: any) => void) => {
    ipcRenderer.on('update-state', (_event, state) => callback(state));
  },
  onLog: (callback: (log: any) => void) => {
    ipcRenderer.on('updater-log', (_event, log) => callback(log));
  },
  checkForUpdates: () => {
    ipcRenderer.send('check-for-updates');
  },
  downloadUpdate: () => {
    ipcRenderer.send('download-update');
  },
  installUpdate: () => {
    ipcRenderer.send('install-update');
  },
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version');
  },
});
