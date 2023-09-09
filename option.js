// Get references to the HTML elements
const proxyAddressInput = document.getElementById('proxyAddress');
const proxyPortInput = document.getElementById('proxyPort');
const applyProxyButton = document.getElementById('applyProxyButton');
const statusMessage = document.getElementById('status');

// Load saved proxy settings if available
chrome.storage.local.get(['proxyAddress', 'proxyPort'], (result) => {
  if (result.proxyAddress && result.proxyPort) {
    proxyAddressInput.value = result.proxyAddress;
    proxyPortInput.value = result.proxyPort;
  }
});

// Event listener for the "Apply Proxy Settings" button
applyProxyButton.addEventListener('click', () => {
  const proxyAddress = proxyAddressInput.value.trim();
  const proxyPort = proxyPortInput.value.trim();

  // Basic input validation
  if (!proxyAddress || !proxyPort) {
    setStatusMessage('Please provide both proxy address and port.', 'error');
    return;
  }

  // Save the proxy settings to local storage
  chrome.storage.local.set({ proxyAddress, proxyPort }, () => {
    setStatusMessage('Proxy settings saved successfully!', 'success');

    // Send a message to the background script to apply the proxy settings
    chrome.runtime.sendMessage({ action: 'applyProxySettings', proxyAddress, proxyPort }, (response) => {
      if (response && response.success) {
        setStatusMessage(response.message, 'success');
      } else {
        setStatusMessage(response ? response.message : 'Failed to apply proxy settings.', 'error');
      }
    });
  });
});

// Helper function to display status messages
function setStatusMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

// Add a click event listener to the "Toggle Proxy" button
toggleProxyButton.addEventListener('click', () => {
  // Toggle the proxy status
  proxyEnabled = !proxyEnabled;

  // Update the UI to reflect the proxy status
  if (proxyEnabled) {
    // Enable proxy - Implement the logic to turn on the proxy here
    // You can use chrome.proxy API or any other method you prefer
    // Display a message indicating that the proxy is enabled
    statusMessage.textContent = 'Proxy is now enabled.';
    statusMessage.style.color = 'green';
  } else {
    // Disable proxy - Implement the logic to turn off the proxy here
    // You can use chrome.proxy API or any other method you prefer
    // Display a message indicating that the proxy is disabled
    statusMessage.textContent = 'Proxy is now disabled.';
    statusMessage.style.color = 'red';
  }
});
