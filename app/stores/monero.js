import { defineStore } from 'pinia'

export const useMoneroStore = defineStore('monero', {
  state: () => ({
    language: null, // Will be initialized when storage is available
    transactions: null,
    transaction: null,
    block: null,
    blocks: null,
    dailyTransactionStats: null,
    mempool: null,
    outputs: null,
    outputsblocks: null,
    emission: null,
    networkinfo: null,
    searchresults: null,
    version: null,
    rawtransaction: null,
    rawblock: null,
    themetoggled: false,
    testnet: false,
    _initialized: false
  }),

  actions: {
    // Initialize store with data from storage (call this when store is first used)
    initializeStore() {
      if (this._initialized) return;

      // These will be available as auto-imported composables when called from components
      if (typeof storage !== 'undefined') {
        this.language = storage.getLocal('language');
        this.block = storage.getLocal('block');
        this.blocks = storage.getLocal('blocks');
        this.outputsblocks = storage.getLocal('outputsblocks');
        this.emission = storage.getLocal('emission');
        this.version = storage.getLocal('version');
        this.rawtransaction = storage.getLocal('rawtransaction');
        this.rawblock = storage.getLocal('rawblock');
        this.themetoggled = storage.getLocal('themetoggled', false);
      }

      this._initialized = true;
    },

    updateLanguage(data) {
      // Use storage when available (client-side)
      if (typeof storage !== 'undefined') {
        if (config?.isDev) {
          console.log('store.updateLanguage', data);
        }
        storage?.setLocal('language', data);
      }
      this.language = data;
    },

    updateTransactions(data) {
      if (config?.isDev) {
        console.log('store.updateTransactions', data);
      }

      let transactions = this.transactions;
      if (!transactions) {
        transactions = [];
      }

      transactions.push(data.data);
      this.transactions = transactions;
    },

    clearTransactions(data) {
      console.log('store.clearTransactions', data);
      this.transactions = null;
    },

    updateTransaction(data) {
      if (config?.isDev) {
        console.log('store.updateTransaction', data);
      }
      this.transaction = data;
      storage?.setLocal('transaction', data);
    },

    updateBlock(data) {
      if (config?.isDev) {
        console.log('store.updateBlock', data);
      }
      this.block = data;
      storage?.setLocal('block', data);
    },

    updateBlocks(data) {
      if (config?.isDev) {
        console.log('store.updateBlocks', data);
      }
      this.blocks = data;
      storage?.setLocal('blocks', data);
    },

    updateMempool(data) {
      if (config?.isDev) {
        console.log('store.updateMempool', data);
      }
      this.mempool = data;
      storage?.setLocal('mempool', data);
    },

    updateOutputs(data) {
      if (config?.isDev) {
        console.log('store.updateOutputs', data);
      }
      this.outputs = data;
    },

    updateOutputsblocks(data) {
      if (config?.isDev) {
        console.log('store.updateOutputsblocks', data);
      }
      this.outputsblocks = data;
      storage?.setLocal('outputsblocks', data);
    },

    updateEmission(data) {
      if (config?.isDev) {
        console.log('store.updateEmission', data);
      }
      this.emission = data;
      storage?.setLocal('emission', data);
    },

    updateDailyTransactionStats(data) {
      if (config?.isDev) {
        console.log('store.updateDailyTransactionStats', data);
      }
      this.dailyTransactionStats = data;
    },

    updateNetworkinfo(data) {
      if (config?.isDev) {
        console.log('store.updateNetworkinfo', data);
      }
        console.log('store.updateNetworkinfo', data);
      this.networkinfo = data;
    },

    updateSearchresults(data) {
      if (config?.isDev) {
        console.log('store.updateSearchresults', data);
      }
      this.searchresults = data;
    },

    updateVersion(data) {
      if (config?.isDev) {
        console.log('store.updateVersion', data);
      }
      this.version = data;
      storage?.setLocal('version', data);
    },

    updateRawtransaction(data) {
      if (config?.isDev) {
        console.log('store.updateRawtransaction', data);
      }
      this.rawtransaction = data;
      storage?.setLocal('rawtransaction', data);
    },

    updateRawblock(data) {
      if (config?.isDev) {
        console.log('store.updateRawblock', data);
      }
      this.rawblock = data;
      storage?.setLocal('rawblock', data);
    },

    updateTestnet(data) {
      if (config?.isDev) {
        console.log('store.updateTestnet', data);
      }
      this.testnet = data;
    }
  }
});
