// Early ethereum property protection - must run before any wallet extensions
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  let originalEthereum = null;
  let isProtected = false;
  
  // Store any existing ethereum object
  if (window.ethereum) {
    originalEthereum = window.ethereum;
  }
  
  // Create a proxy that prevents property redefinition
  const ethereumProxy = new Proxy({}, {
    set(target, prop, value) {
      if (prop === 'ethereum' && isProtected) {
        console.warn('Prevented ethereum property override by wallet extension');
        return true; // Pretend it succeeded
      }
      return Reflect.set(target, prop, value);
    },
    
    get(target, prop) {
      if (prop === 'ethereum') {
        return originalEthereum;
      }
      return Reflect.get(target, prop);
    },
    
    defineProperty(target, prop, descriptor) {
      if (prop === 'ethereum' && isProtected) {
        console.warn('Prevented ethereum property redefinition by wallet extension');
        return true; // Pretend it succeeded
      }
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
  
  // Override Object.defineProperty for window specifically
  const originalDefineProperty = Object.defineProperty;
  const originalDefineProperties = Object.defineProperties;
  
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === window && prop === 'ethereum' && isProtected) {
      console.warn('Blocked ethereum property redefinition on window');
      return obj;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  Object.defineProperties = function(obj, properties) {
    if (obj === window && properties.ethereum && isProtected) {
      console.warn('Blocked ethereum properties redefinition on window');
      // Remove ethereum from properties before applying
      const filtered = { ...properties };
      delete filtered.ethereum;
      return originalDefineProperties.call(this, obj, filtered);
    }
    return originalDefineProperties.call(this, obj, properties);
  };
  
  // Protect ethereum property on window
  try {
    Object.defineProperty(window, 'ethereum', {
      get() {
        return originalEthereum;
      },
      set(value) {
        if (!isProtected) {
          originalEthereum = value;
          console.log('Ethereum provider set:', value?.constructor?.name || 'unknown');
        } else {
          console.warn('Ethereum provider change blocked');
        }
      },
      configurable: false // Make it non-configurable to prevent redefinition
    });
  } catch (error) {
    console.warn('Could not protect ethereum property initially:', error.message);
  }
  
  // Enable protection after a short delay to allow legitimate setup
  setTimeout(() => {
    isProtected = true;
    console.log('Ethereum property protection enabled');
    
    // Try to restore ethereum if it was cleared
    if (!window.ethereum && originalEthereum) {
      try {
        Object.defineProperty(window, 'ethereum', {
          value: originalEthereum,
          writable: false,
          configurable: false
        });
      } catch (error) {
        console.warn('Could not restore ethereum:', error.message);
      }
    }
  }, 100);
  
  // Global error handler for wallet extension conflicts
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('ethereum')) {
      console.warn('Ethereum-related error caught:', event.message);
      event.preventDefault();
    }
  });
  
})();