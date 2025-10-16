// Number and currency formatting utilities

export const accounting = {
  /**
   * Format number with comma thousands separators
   * @param {number} amount - Number to format
   * @param {number} fixed - Number of decimal places
   * @returns {string} Formatted number
   */
  formatNumber(amount, fixed = 0) {
    if (typeof amount !== 'number') return '0';
    
    return amount.toFixed(fixed).replace(/./g, (c, i, a) => {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  },

  /**
   * Format money with units (K, M, B)
   * @param {number} amount - Amount to format
   * @param {number} divide - Division factor (1000, 1000000, 1000000000)
   * @param {number} fixed - Number of decimal places
   * @returns {string} Formatted money with units
   */
  formatMoney(amount, divide = 1, fixed = 2) {
    if (typeof amount !== 'number') return '0';
    
    const result = amount / divide;
    let formattedResult = result.toFixed(fixed).replace(/./g, (c, i, a) => {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });

    // Add unit suffix
    switch (divide) {
      case 1000:
        formattedResult += ' K';
        break;
      case 1000000:
        formattedResult += ' M';
        break;
      case 1000000000:
        formattedResult += ' B';
        break;
    }

    return formattedResult;
  },

  /**
   * Format Monero amounts (similar to Bitcoin formatting but for XMR)
   * @param {number} amount - Monero amount
   * @param {boolean} prependSymbol - Whether to prepend XMR symbol
   * @param {boolean} useAtomicUnits - Whether to use atomic units for small amounts
   * @returns {string} Formatted Monero amount
   */
  formatMonero(amount, prependSymbol = false, useAtomicUnits = false) {
    if (typeof amount !== 'number') return '0';
    
    let result = '';

    if (useAtomicUnits && amount < 0.000001) {
      // Use atomic units (piconero) for very small amounts
      if (prependSymbol) {
        result += 'pXMR ';
      }
      result += Math.round(amount * Math.pow(10, 12) * 10000) / 10000;
    } else {
      if (prependSymbol) {
        result += 'XMR ';
      }
      // Round to 12 decimal places (Monero precision)
      result += Math.round(amount * Math.pow(10, 12)) / Math.pow(10, 12);
    }

    return result;
  },

  /**
   * Format Bitcoin amounts
   * @param {number} amount - Bitcoin amount
   * @param {boolean} prependSymbol - Whether to prepend BTC symbol
   * @param {boolean} useSatoshi - Whether to use satoshis for small amounts
   * @returns {string} Formatted Bitcoin amount
   */
  formatBitcoin(amount, prependSymbol = false, useSatoshi = false) {
    if (typeof amount !== 'number') return '0';
    
    let result = '';

    if (useSatoshi && amount < 0.0001) {
      if (prependSymbol) {
        result += 'SAT ';
      }
      result += Math.round(amount * 100000000 * 10000) / 10000;
    } else {
      if (prependSymbol) {
        result += 'BTC ';
      }
      result += Math.round(amount * 100000) / 100000;
    }

    return result;
  },

  /**
   * Generate color based on positive/negative value (green/red)
   * @param {number} percentage - Value between -max and +max
   * @param {number} max - Maximum absolute value
   * @returns {string} RGB color string
   */
  colorizeNumberGreenAndRed(percentage, max = 1) {
    const green = [3, 185, 108];
    const red = [235, 27, 10];
    const gray = [128, 128, 128];

    const isPositive = percentage > 0;
    const normalizedPercentage = Math.min(Math.abs(percentage), max) / max;

    let [r, g, b] = gray;

    if (isPositive) {
      r += (green[0] - r) * normalizedPercentage;
      g += (green[1] - g) * normalizedPercentage;
      b += (green[2] - b) * normalizedPercentage;
    } else {
      r += (red[0] - r) * normalizedPercentage;
      g += (red[1] - g) * normalizedPercentage;
      b += (red[2] - b) * normalizedPercentage;
    }

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  },

  /**
   * Generate color from grey to orange based on percentage
   * @param {number} percentage - Value between 0 and 1
   * @returns {string} RGB color string
   */
  colorizeNumberGreyAndOrange(percentage) {
    const r = 187 + (255 - 187) * percentage;
    const g = 187 + (149 - 187) * percentage;
    const b = 187 + (0 - 187) * percentage;

    return `rgb(${Math.round(Math.max(0, Math.min(255, r)))}, ${Math.round(Math.max(0, Math.min(255, g)))}, ${Math.round(Math.max(0, Math.min(255, b)))})`;
  },

  /**
   * Generate greyscale color based on percentage
   * @param {number} percentage - Value between -1 and 1 (-1=black, 0=grey, 1=white)
   * @returns {string} RGB color string
   */
  colorizeNumberGrey(percentage) {
    const value = 128 + 128 * percentage;
    const clampedValue = Math.round(Math.max(0, Math.min(255, value)));
    
    return `rgb(${clampedValue}, ${clampedValue}, ${clampedValue})`;
  }
};