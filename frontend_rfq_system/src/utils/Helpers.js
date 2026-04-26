export const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

export const formatDateTime = (timestamp) => new Date(timestamp).toLocaleString('en-US', { 
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
});

export const calculateRankings = (bids) => {
  return [...bids].sort((a, b) => {
    if (a.totalAmount === b.totalAmount) return a.submittedAt - b.submittedAt;
    return a.totalAmount - b.totalAmount;
  }).map((bid, index) => ({ ...bid, rank: index + 1 }));
};

export const formatCountdown = (ms) => {
  if (ms <= 0) return "00:00";
  const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
  const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
};