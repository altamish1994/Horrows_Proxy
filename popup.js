// Get references to the HTML elements
const proxyAddressInput = document.getElementById('proxyAddress');
const proxyPortInput = document.getElementById('proxyPort');
const applyProxyButton = document.getElementById('applyProxyButton');
const statusMessage = document.getElementById('status');

const toggleProxyButton = document.getElementById('toggleProxyButton'); // Reference to the new button

let proxyEnabled = true; 

// Load saved proxy settings if available
chrome.storage.local.get(['proxyAddress', 'proxyPort'], (result) => {
  if (result.proxyAddress && result.proxyPort) {
    proxyAddressInput.value = result.proxyAddress;
    proxyPortInput.value = result.proxyPort;
  }
});

// Event listener for the "Apply Proxy Settings" button
applyProxyButton.addEventListener('click', () => {

	if(proxyEnabled){
	  // Sending a message to the background script
		chrome.runtime.sendMessage({ type: 'applyProxySettings', data: dataToSend }, (response) => {
		  if (chrome.runtime.lastError) {
		    console.error(chrome.runtime.lastError);
		  } else {
		    // Handle the response from the background script (if any)
		    console.log('Message sent to background script.');
		  }
		});
  	}
  	else{
  		setStatusMessage('Proxy Not enabled','error');
  	}
});

// Add a click event listener to the "Toggle Proxy" button
toggleProxyButton.addEventListener('click', () => {
  // Toggle the proxy status
  proxyEnabled = !proxyEnabled;

  // Update the UI to reflect the proxy status
  if (proxyEnabled) {
    enableProxy();
  } else {
    disableProxy();
  }
});



// Helper function to display status messages
function setStatusMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

function disableProxy() 
{
	chrome.proxy.settings.clear({}, () => {
	if (chrome.runtime.lastError) {
		// Display an error message if proxy removal fails
		setStatusMessage('Failed to remove proxy settings.', 'error' );
	} else {
		// Display a success message if proxy is removed successfully
		setStatusMessage('Proxy settings removed.', 'success');
	}
	});
}

function enableProxy()
{
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
	    var msg= 'some';
	    chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, () => {
	      if (chrome.runtime.lastError) {
	      msg='Failed to apply proxy settings';
		setStatusMessage('Failed to apply proxy settings.', 'error');
	      } else {
	      msg='Proxy settings applied successfully.';
		setStatusMessage('Proxy settings applied successfully.', 'error');
	      }
	    });
	  });
	  return;
}
