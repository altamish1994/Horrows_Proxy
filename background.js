// Listen for messages from the popup script (popup.js)
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'applyProxySettings') {
    const proxyAddress = message.proxyAddress;
    const proxyPort = message.proxyPort;

    // Validate input (you may want to perform more robust validation)
    if (!proxyAddress || !proxyPort) {
      sendResponse({ success: false, message: 'Please provide both proxy address and port.' });
      return;
    }

    chrome.storage.local.set({ proxyAddress, proxyPort }, () => {
    
	    // Configure the proxy settings
	    const proxyConfig = {
	      mode: 'fixed_servers',
	      rules: {
		singleProxy: {
		  scheme: 'http',  // Change to 'https' if needed
		  host: proxyAddress,
		  port: parseInt(proxyPort),
		},
	      },
	    };

	    // Apply the proxy settings
	    chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, () => {
	      if (chrome.runtime.lastError) {
		sendResponse({ success: false, message: 'Failed to apply proxy settings.' });
	      } else {
		sendResponse({ success: true, message: 'Proxy settings applied successfully.' });
	      }
	    });
	});
  }
  
  if (message.action === 'clearProxySettings') {
    chrome.proxy.settings.clear({}, () => {
    if (chrome.runtime.lastError) {
      // Display an error message if proxy removal fails
      sendResponse({ success: false, message: 'Failed to remove proxy settings.' });
    } else {
      // Display a success message if proxy is removed successfully
      sendResponse({ success: true, message: 'Proxy settings removed.' });
    }
  });
  }
});
