const STATUS_TYPES = ['info', 'success', 'warning', 'error'];
let hideTimeoutId = null;
let footerNode = null;

function ensureFooter() {
  if (footerNode) return footerNode;
  footerNode = document.getElementById('core-footer');
  return footerNode;
}

function clearPendingHide() {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
}

function applyVisualState(type) {
  if (!footerNode) return;
  footerNode.classList.remove(
    'status-toast--info',
    'status-toast--success',
    'status-toast--warning',
    'status-toast--error',
    'is-visible',
  );

  const normalizedType = STATUS_TYPES.includes(type) ? type : 'info';
  footerNode.classList.add(`status-toast--${normalizedType}`);
}

function hideStatus() {
  if (!footerNode) return;
  footerNode.classList.remove('is-visible');
  footerNode.setAttribute('aria-hidden', 'true');
}

export function showTransientStatus(message, options = {}) {
  footerNode = ensureFooter();
  const fallbackNode = document.getElementById('genoma-status');

  if (!footerNode && !fallbackNode) {
    return;
  }

  const { type = 'info', duration = 4000 } = options;
  clearPendingHide();

  if (footerNode) {
    applyVisualState(type);
    footerNode.textContent = message;
    footerNode.classList.add('is-visible');
    footerNode.setAttribute('aria-hidden', 'false');
    hideTimeoutId = setTimeout(hideStatus, Math.max(1200, duration));
  }

  if (fallbackNode) {
    fallbackNode.textContent = message;
  }
}
