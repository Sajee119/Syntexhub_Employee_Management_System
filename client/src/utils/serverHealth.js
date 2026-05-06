export function startServerHealthPing(intervalMs = 300000) {
  const ping = async () => {
    try {
      await fetch('/api/health', { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    } catch {
      window.location.href = '/network-error';
    }
  };

  ping();
  setInterval(ping, intervalMs);
}
