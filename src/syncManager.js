class SyncManager {
  constructor(server) {
    this.server = server;
    // setInterval(() => this.syncTimerCompleteHandler(), 3000);
    setTimeout(() => this.syncTimerCompleteHandler(), 3000);
  }

  init() {
    // console.log('SheetData IS ALIIIIVVVEEEE and AUTHORISED!!;');
  }

  syncTimerCompleteHandler() {
    console.log('____ >>> SYNC BABY <<< ______');
    this.server.virtualObject.forceSync(this.server.virtualObject.syncComplete);
  }

}

module.exports = SyncManager;