// Utility functions for data manipulation and text processing

export const tools = {
  /**
   * Get nested object property by path string
   * @param {Object} obj - The object to traverse
   * @param {string} path - Path like 'prop/nested/value'
   * @param {any} fallback - Fallback value if path not found
   * @returns {any} The found value or fallback
   */
  objectProperty(obj, path, fallback = null) {
    if (!obj || !path) return fallback;

    const keys = path.split('/');
    let result = obj;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return fallback;
      }
    }

    return result;
  },

  /**
   * Convert text to URL-friendly slug
   * @param {string} text - Text to convert
   * @param {string} separator - Separator character (default: '-')
   * @returns {string} URL-friendly slug
   */
  slug(text, separator = '-') {
    if (!text) return '';
    
    text = text.toString().toLowerCase().trim();

    const sets = [
      {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]'},
      {to: 'c', from: '[ÇĆĈČ]'},
      {to: 'd', from: '[ÐĎĐÞ]'},
      {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
      {to: 'g', from: '[ĜĞĢǴ]'},
      {to: 'h', from: '[ĤḦ]'},
      {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
      {to: 'j', from: '[Ĵ]'},
      {to: 'ij', from: '[Ĳ]'},
      {to: 'k', from: '[Ķ]'},
      {to: 'l', from: '[ĹĻĽŁ]'},
      {to: 'm', from: '[Ḿ]'},
      {to: 'n', from: '[ÑŃŅŇ]'},
      {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
      {to: 'oe', from: '[Œ]'},
      {to: 'p', from: '[ṕ]'},
      {to: 'r', from: '[ŔŖŘ]'},
      {to: 's', from: '[ßŚŜŞŠ]'},
      {to: 't', from: '[ŢŤ]'},
      {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
      {to: 'w', from: '[ẂŴẀẄ]'},
      {to: 'x', from: '[ẍ]'},
      {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
      {to: 'z', from: '[ŹŻŽ]'},
      {to: '-', from: '[·/_,:;\']'}
    ];

    // Apply character replacements
    sets.forEach(set => {
      text = text.replace(new RegExp(set.from, 'gi'), set.to);
    });

    // Clean up and format
    text = text
      .replace(/\s+/g, '-')         // Replace spaces with -
      .replace(/&/g, '-and-')       // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
      .replace(/\--+/g, '-')        // Replace multiple - with single -
      .replace(/^-+/, '')           // Trim - from start of text
      .replace(/-+$/, '');          // Trim - from end of text

    // Apply custom separator if provided
    if (separator !== '-') {
      text = text.replace(/-/g, separator);
    }

    return text;
  },

  /**
   * Format number with thousands separators
   * @param {number} num - Number to format
   * @param {string} separator - Thousands separator (default: ',')
   * @returns {string} Formatted number
   */
  formatNumber(num, separator = ',') {
    if (num === null || num === undefined) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  },

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix for truncated text (default: '...')
   * @returns {string} Truncated text
   */
  truncate(text, maxLength, suffix = '...') {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Generate random string
   * @param {number} length - Length of random string
   * @returns {string} Random string
   */
  randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};