export function useTimestamp() {

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return null;
    }
    try {
      let d = new Date(Date.parse(timestamp));
      return d.toLocaleString();
    } catch (error) {
      console.debug("Unable to format timestamp due to: " + error);
    }
  }
  // 
  function toLocalDate(epochTime) {
    return new Date(epochTime * 1000).toLocaleDateString();
  }
  // 
  function toLocalCurrency(amount) {
    return currencyFormatter.format(amount / 100);
  } 
  
  return {
    formatTimestamp, 
    toLocalDate,
    toLocalCurrency, 
  }
}
