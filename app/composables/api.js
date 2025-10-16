// events, useMoneroStore, and config are auto-imported by Nuxt

class ApiService {
  constructor() {
    this.id = 'api';
    this.log = !false; // Set to true for debug logging
    this.store = null; // Will be initialized when needed
  }

  makeRequest(url, successCallback, errorCallback, lazy) {
    if (this.log) {
      console.log(this.id + '.makeRequest: ' + url);
    }

    if (lazy) {
      this.makeLazyRequest(url, successCallback, errorCallback);
    } else {
      this.makeRegularRequest(url, successCallback, errorCallback);
    }
  }

  // Helper method for AJAX requests using fetch API
  async makeRegularRequest(url, successCallback, errorCallback) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (successCallback) successCallback(data);
    } catch (error) {
      console.error('Request failed:', error);
      if (errorCallback) errorCallback(error);
    }
  }

  // Helper method for lazy requests using useLazyFetch
  makeLazyRequest(url, successCallback, errorCallback) {
    const { data, error } = useLazyFetch(url);

    watch(error, newError => {
      if (newError && errorCallback) {
        errorCallback(newError);
      }
    });

    watch(data, (newValue) => {
      if (newValue && successCallback) {
        successCallback(newValue);
      }
    });
  }

  getStore() {
    if (!this.store) {
      this.store = useMoneroStore();
    }
    return this.store;
  }

  baseUrl() {
    return this.getStore().testnet
      ? config.api.testnet
      : config.api.mainnet;
  }

  loadMockData(filename, successCallback, errorCallback) {
    if (this.log) {
      console.log(this.id + '.loadMockData: ' + filename);
    }

    const url = '/mock_data/' + filename;

    this.makeRequest(
      url,
      successCallback,
      errorCallback || function () {
        console.error('Failed to load mock data: ' + filename);
      }
    );
  }

  enableMockData() {
    config.useMockData = true;
    console.log('Mock data enabled. API calls will use data from mock_data folder.');
  }

  disableMockData() {
    config.useMockData = false;
    console.log('Mock data disabled. API calls will use real endpoints.');
  }

  toggleMockData() {
    config.useMockData = !config.useMockData;
    console.log('Mock data ' + (config.useMockData ? 'enabled' : 'disabled') + '.');
    return config.useMockData;
  }

  // Network info
  networkinfo(lazy = true) {
    if (this.log) {
      console.log(this.id + '.networkinfo');
    }

    events.call('api-networkinfo-start');

    if (config.useMockData) {
      this.loadMockData('networkinfo.json', (result) => this.onNetworkinfo(result), (result) => this.onNetworkinfoError(result));
      return;
    }

    this.makeRequest(
      '/api/networkinfo',
      (result) => this.onNetworkinfo(result),
      (error) => this.onNetworkinfoError(error),
      lazy
    );
    // const { data, error } = useLazyFetch('/api/networkinfo')

    // watch(error, newError => {
    //   this.onNetworkinfoError(newError);
    // });

    // watch(data, (newValue) => {
    //   if (newValue) {
    //     this.onNetworkinfo(newValue);
    //   }
    // })
  }

  onNetworkinfo(result) {
    if (this.log) {
      console.log(this.id + '.onNetworkinfo', result);
    }

    this.getStore().updateNetworkinfo(result);
    events.call('api-networkinfo-end', result);
  }

  onNetworkinfoError(result) {
    if (this.log) {
      console.log(this.id + '.onNetworkinfoError', result);
    }

    events.call('api-networkinfo-error');
  }

  // Transactions
  transactions(hashes, lazy = true) {
    if (this.log) {
      console.log(this.id + '.transactions', hashes);
    }

    if(!hashes || hashes.length === 0) {
      console.log(this.id + '.transactions: No hashes provided, skipping.');
      return;
    }

    events.call('api-transactions-start');

    if (config.useMockData) {
      this.loadMockData('transactions.json', (result) => this.onTransactions(result), (result) => this.onTransactionsError(result));
      return;
    }

    const url = '/api/transactions?h=' + hashes.join(',');

    this.makeRequest(
      url,
      (result) => this.onTransactions(result),
      (error) => this.onTransactionsError(error),
      lazy
    );

    // const { data, error } = useLazyFetch(url)

    // watch(error, newError => {
    //   this.onTransactionsError(newError);
    // });

    // watch(data, (newValue) => {
    //   if (newValue) {
    //     this.onTransactions(newValue);
    //   }
    // })
  }

  onTransactions(result) {
    if (this.log) {
      console.log(this.id + '.onTransactions', result);
    }
      console.log(this.id + '.onTransactions', result);

    events.call('api-transactions-end', result);
    this.getStore().updateTransactions(result);
  }

  onTransactionsError(result) {
    if (this.log) {
      console.log(this.id + '.onTransactionsError', result);
    }
      console.log(this.id + '.onTransactionsError', result);

    events.call('api-transactions-error');
  }

  // Transaction
  // transaction(hash) {
  //   if (this.log) {
  //     console.log(this.id + '.transaction');
  //   }

  //   events.call('api-transaction-start');

  //   if (config.useMockData) {
  //     this.loadMockData('transaction.json', (result) => this.onTransaction(result), (result) => this.onTransactionError(result));
  //     return;
  //   }

  //   const url = '/api/transaction/' + hash;

  //   const { data, error } = useLazyFetch(url)

  //   watch(error, newError => {
  //     this.onTransactionError(newError);
  //   });

  //   watch(data, (newValue) => {
  //     if (newValue) {
  //       this.onTransaction(newValue);
  //     }
  //   })
  // }

  // onTransaction(result) {
  //   if (this.log) {
  //     console.log(this.id + '.onTransaction', result);
  //   }
  //     console.log(this.id + '.onTransaction', result);

  //   this.getStore().updateTransaction(result);
  //   events.call('api-transaction-end', result);
  // }

  // onTransactionError(result) {
  //   if (this.log) {
  //     console.log(this.id + '.onTransactionError', result);
  //   }

  //   events.call('api-transaction-error');
  // }

  // Mempool
  async mempool(lazy = true) {
    if (this.log) {
      console.log(this.id + '.mempool');
    }

    events.call('api-mempool-start');

    if (config.useMockData) {
      this.loadMockData('mempool-new.json', (result) => this.onMempool(result), (result) => this.onMempoolError(result));
      return;
    }

    this.makeRequest(
      '/api/mempool',
      (result) => this.onMempool(result),
      (error) => this.onMempoolError(error),
      lazy
    );

    // const { data, error } = useLazyFetch('/api/mempool')

    // watch(error, newError => {
    //   this.onMempoolError(newError);
    //   console.error('error', newError, error);
    // });

    // watch(data, (newValue) => {
    //   if (newValue) {
    //     console.log('Data loaded:', newValue)
    //     console.log('Transactions:', newValue.transactions?.length)
    //     this.onMempool(newValue);
    //   }
    // })
  }

  onMempool(result) {
    if (this.log) {
      console.log(this.id + '.onMempool', result);
    }

    events.call('api-mempool-end', result);
    this.getStore().updateMempool(result);
  }

  onMempoolError(result) {
    if (this.log) {
      console.log(this.id + '.onMempoolError', result);
    }

    events.call('api-mempool-error');
  }

  // Block
  block(heightOrHash, lazy = true) {
    if (this.log) {
      console.log(this.id + '.block', heightOrHash);
    }

    events.call('api-block-start');

    if (config.useMockData) {
      this.loadMockData('block.json', (result) => this.onBlock(result), (result) => this.onBlockError(result));
      return;
    }

    this.makeRequest(
      '/api/block/'+heightOrHash,
      (result) => this.onBlock(result),
      (error) => this.onBlockError(error),
      lazy
    );

    // const { data, error } = useLazyFetch('/api/block/'+heightOrHash)

    // watch(error, newError => {
    //   this.onBlockError(newError);
    //   console.error('error', newError, error);
    // });

    // watch(data, (newValue) => {
    //   if (newValue) {
    //     this.onBlock(newValue);
    //   }
    // })
  }

  onBlock(result) {
    if (this.log) {
      console.log(this.id + '.onBlock', result);
    }

    this.getStore().updateBlock(result);
    events.call('api-block-end', result);
  }

  onBlockError(result) {
    if (this.log) {
      console.log(this.id + '.onBlockError', result);
    }

    events.call('api-block-error');
  }

  // Blocks
  blocks(startHeight, count, lazy = true) {
    if (this.log) {
      console.log(this.id + '.blocks', startHeight, count);
    }

    events.call('api-blocks-start');

    if (config.useMockData) {
      this.loadMockData('blocks.json', (result) => this.onBlocks(result), (result) => this.onBlocksError(result));
      return;
    }

    this.makeRequest(
      '/api/blocks?start=' + startHeight + '&count=' + count,
      (result) => this.onBlocks(result),
      (error) => this.onBlocksError(error),
      lazy
    );

    // const { data, error } = useLazyFetch('/api/blocks?start=' + startHeight + '&count=' + count)

    // watch(error, newError => {
    //   this.onBlocksError(newError);
    // });

    // watch(data, (newValue) => {
    //   if (newValue) {
    //     this.onBlocks(newValue);
    //   }
    // })
  }

  onBlocks(result) {
    if (this.log) {
      console.log(this.id + '.onBlocks', result);
    }
      console.log(this.id + '.onBlockaas', result);

    this.getStore().updateBlocks(result.result?.headers);
    events.call('api-blocks-end', result.result?.headers);
  }

  onBlocksError(result) {
    if (this.log) {
      console.log(this.id + '.onBlocksError', result);
    }

    events.call('api-blocks-error');
  }

  // Search
  search(query, lazy = true) {
    if (this.log) {
      console.log(this.id + '.search');
    }

    events.call('api-search-start');

    if (config.useMockData) {
      // Use _search-transaction.json as default, could be made dynamic based on query
      this.loadMockData('search-transaction.json', (result) => this.onSearch(result), (result) => this.onSearchError(result));
      return;
    }

    this.makeRequest(
      '/api/search/?q=' + encodeURIComponent(query),
      (result) => this.onSearch(result),
      (error) => this.onSearchError(error),
      lazy
    );

    // const url = '/api/search/?q=' + encodeURIComponent(query);

    // const { data, error } = useLazyFetch(url)

    // watch(error, newError => {
    //   this.onSearchError(newError);
    // });

    // watch(data, (newValue) => {
    //   if (newValue) {
    //     this.onSearch(newValue);
    //   }
    // })
  }

  onSearch(result) {
    if (this.log) {
      console.log(this.id + '.onSearch', result);
    }

    this.getStore().updateSearchresults(result);
    events.call('api-search-end', result);
  }

  onSearchError(result) {
    if (this.log) {
      console.log(this.id + '.onSearchError', result);
    }

    events.call('api-search-error');
  }
}

export const api = new ApiService();
