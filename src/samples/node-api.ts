import { ipcRenderer } from 'electron';

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
  ipcRenderer.invoke('open-win', 'ping').then(r => console.log(r));
});
