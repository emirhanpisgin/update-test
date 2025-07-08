
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronUpdater', {
  onUpdateState: (callback: (state: any) => void) => {
    ipcRenderer.on('update-state', (_event, state) => callback(state));
  },
  checkForUpdates: () => {
    ipcRenderer.send('check-for-updates');
  },
});
