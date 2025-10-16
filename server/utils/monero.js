/**
 * Monero node utility functions
 */

/**
 * Get available Monero nodes from runtime config
 * @returns {string[]} Array of node URLs
 */
export function getMoneroNodes() {
  const config = useRuntimeConfig()
  const nodesString = config.moneroNodes || ''
  return nodesString.split(',').map(node => node.trim()).filter(Boolean)
}

/**
 * Get a random Monero node from the available list
 * @returns {string} Random node URL
 */
export function getRandomMoneroNode() {
  const nodes = getMoneroNodes()
  return nodes[Math.floor(Math.random() * nodes.length)]
}

/**
 * Make a request to a Monero node with automatic failover
 * @param {string} endpoint - The RPC endpoint (e.g., '/get_transaction_pool')
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of nodes to try
 * @returns {Promise} Response from the node
 */
export async function fetchFromMoneroNode(endpoint, options = {}, maxRetries = 3) {
  const config = useRuntimeConfig()
  const timeout = config.moneroNodeTimeout || 10000
  const nodes = getMoneroNodes()
  
  // Shuffle nodes for random selection order
  const shuffledNodes = [...nodes].sort(() => 0.5 - Math.random())
  
  let lastError = null
  
  for (let i = 0; i < Math.min(maxRetries, shuffledNodes.length); i++) {
    const nodeUrl = shuffledNodes[i]
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(`${nodeUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        ...options
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`Node ${nodeUrl} responded with status: ${response.status} ${response.statusText}`)
      }
      
      return await response.json()
      
    } catch (error) {
      lastError = error
      console.warn(`Failed to fetch from node ${nodeUrl}:`, error.message)
      
      // If this is the last retry, throw the error
      if (i === Math.min(maxRetries, shuffledNodes.length) - 1) {
        break
      }
    }
  }
  
  // All nodes failed
  throw createError({
    statusCode: 503,
    message: `All Monero nodes failed. Last error: ${lastError?.message || 'Unknown error'}`
  })
}

/**
 * Specific helper for transaction pool requests
 * @returns {Promise} Transaction pool data
 */
export async function getTransactionPool() {
    const result = await fetchFromMoneroNode('/get_transaction_pool')

    // Delete some of the unused data to reduce payload size
    delete result.spent_key_images
    delete result.credits

    result.tx_count = result.transactions ? result.transactions.length : 0

    for (let transaction of result.transactions) {
        delete transaction.blob_size
        delete transaction.weight
        delete transaction.tx_blob
        delete transaction.last_failed_height
        delete transaction.last_failed_id_hash

        // Decode tx_json if it's a string
        if (transaction.tx_json && typeof transaction.tx_json === 'string') {
            try {
                transaction.tx_json = JSON.parse(transaction.tx_json)

                delete transaction.tx_json.extra
                delete transaction.tx_json.rctsig_prunable
                delete transaction.tx_json.rct_signatures
            } catch (e) {
                // Ignore JSON parse errors
            }
        }
    }

    return result
}

/**
 * Specific helper for block requests
 * @param {number|string} height - Block height
 * @param {string} hash - Block hash
 * @returns {Promise} Block data
 */
export async function getBlock(height, hash) {
  const result = await fetchFromMoneroNode('/json_rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'get_block',
      params: { height, hash }
    })
  })

  delete result.result.blob
  delete result.result.credits
  delete result.result.json

  return result.result;
}

/**
 * Specific helper for block range requests
 * @param {number} start - Block start height
 * @param {number} count - Number of blocks to fetch
 * @returns {Promise} Block data
 */
export async function getBlocks(start, count) {
  return await fetchFromMoneroNode('/json_rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'get_block_headers_range',
      params: { start_height: start, end_height: start + count - 1 }
    })
  })
}

/**
 * Specific helper for transaction requests
 * @param {string[]} transactionHashes - Array of transaction hashes
 * @returns {Promise} Transaction data
 */
export async function getTransactions(transactionHashes) {
  const result = await fetchFromMoneroNode('/get_transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      txs_hashes: transactionHashes,
      decode_as_json: true
    })
  })

  for (let tx of result.txs) {
    delete tx.as_hex
    tx.as_json = JSON.parse(tx.as_json)
  }

  // Loop over result.txs_as_json, decode each JSON string, and push to transactions array
  const transactions = []
  for (let txJson of result.txs_as_json) {
    try {
      const tx = JSON.parse(txJson)
      transactions.push(tx)
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  result.txs_as_json = transactions

  delete result.txs_as_hex
  delete result.txs_as_json

  return result
}

/**
 * Specific helper for transaction requests
 * @param {string} hash - Transaction hash
 * @returns {Promise} Transaction data
 */
export async function getTransaction(hash) {
  return await fetchFromMoneroNode('/get_transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      txs_hashes: [hash],
      decode_as_json: true
    })
  })
}

/**
 * Specific helper for daemon info requests
 * @returns {Promise} Daemon information
 */
export async function getNetworkInfo() {
  return await fetchFromMoneroNode('/get_info')
}