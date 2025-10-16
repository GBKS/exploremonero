class FaviconUpdater {
  constructor() {
    this.icons = [];
  }

  /**
   * Find and save favicon elements for later reference
   */
  init() {
    const elements = document.querySelectorAll('link[rel=icon], link[rel=apple-touch-icon]');

    this.icons = [];
    elements.forEach((element, index) => {
      const sizes = element.getAttribute('sizes');

      this.icons.push({
        element: element,
        size: sizes ? sizes.split('x')[0] : '32', // Default to 32 if no size
        href: element.getAttribute('href')
      });
    });
  }

  /**
   * Reset favicons to original state
   */
  reset() {
    this.icons.forEach(icon => {
      icon.element.setAttribute('href', icon.href);
    });
  }

  /**
   * Update favicon with progress indicator
   * @param {number} percentage - Progress percentage (0-1)
   */
  progress(percentage) {
    if (percentage >= 1) {
      this.setComplete();
    } else {
      this.icons.forEach(icon => {
        this.drawProgress(icon, percentage);
      });
    }
  }

  /**
   * Set favicon to completed state (green check)
   */
  setComplete() {
    this.icons.forEach(icon => {
      // Use the check icon if available, otherwise draw progress
      const checkIconPath = `/icons/favicon-check-${icon.size}.png`;
      icon.element.setAttribute('href', checkIconPath);
    });
  }

  /**
   * Draw progress indicator on favicon
   * @param {Object} iconData - Icon configuration object
   * @param {number} percentage - Progress percentage (0-1)
   */
  drawProgress(iconData, percentage) {
    const size = parseInt(iconData.size) || 32;
    const lineWidth = Math.round(size / 8);
    const radius = size / 2 - lineWidth / 2;

    const startAngle = -90 / 180 * Math.PI;
    const angle = Math.min(1, Math.max(0, percentage)) * 360 - 90;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineWidth = lineWidth;

    // Draw background circle
    context.strokeStyle = '#000000';
    context.globalAlpha = 0.1;
    context.beginPath();
    context.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
    context.stroke();

    // Draw progress arc
    if (percentage === 1) {
      context.strokeStyle = '#03B96C'; // Green for complete
    } else {
      context.strokeStyle = '#3380FF'; // Blue for progress
    }
    context.globalAlpha = 1;

    context.beginPath();
    context.arc(size / 2, size / 2, radius, startAngle, angle / 180 * Math.PI);
    context.stroke();

    // Update favicon with canvas data
    iconData.element.setAttribute('href', canvas.toDataURL('image/png'));
  }
}

export const faviconUpdater = new FaviconUpdater();
