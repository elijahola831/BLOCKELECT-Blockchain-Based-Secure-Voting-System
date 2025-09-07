// BLOCKELECT Service Worker
const CACHE_NAME = 'blockelect-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/index.html',
  '/analytics.html',
  '/official.html',
  '/offline.html',
  '/dist/app.bundle.js',
  '/css/index.css',
  '/css/official.css',
  '/css/analytics.css',
  '/css/alert.css',
  '/js/app.js',
  '/js/analytics.js',
  '/js/alert.js',
  '/icons/bootstrap-icons.css',
  '/assets/logo.svg',
  '/assets/favicon.svg',
  '/sounds/success.wav',
  '/sounds/error.wav',
  '/sounds/warning.wav',
  '/sounds/info.wav',
  '/manifest.json',
  // External CDN resources (cached versions)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Network-first resources (always try network first)
const NETWORK_FIRST_URLS = [
  '/api/',
  'http://127.0.0.1:7545'
];

// Cache-first resources (use cache if available)
const CACHE_FIRST_URLS = [
  '/assets/',
  '/sounds/',
  '/icons/',
  'https://cdn.jsdelivr.net'
];

self.addEventListener('install', event => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('[SW] App shell cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache app shell:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip POST requests (blockchain transactions)
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle API requests (network-first)
  if (isNetworkFirstUrl(request.url)) {
    event.respondWith(handleNetworkFirstRequest(request));
    return;
  }
  
  // Handle static assets (cache-first)
  if (isCacheFirstUrl(request.url)) {
    event.respondWith(handleCacheFirstRequest(request));
    return;
  }
  
  // Default: network-first for everything else
  event.respondWith(handleNetworkFirstRequest(request));
});

async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Update cache with fresh content (only for complete responses)
    if (networkResponse.ok && networkResponse.status !== 206 && networkResponse.status < 300) {
      const cache = await caches.open(CACHE_NAME);
      try {
        cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('[SW] Failed to cache navigation response:', cacheError.message);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for navigation, serving from cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page as fallback
    return caches.match(OFFLINE_URL);
  }
}

async function handleNetworkFirstRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Update cache for successful, complete responses
    if (networkResponse.ok && networkResponse.status !== 206 && networkResponse.status < 300) {
      const cache = await caches.open(CACHE_NAME);
      try {
        cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('[SW] Failed to cache network-first response:', cacheError.message);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, serving from cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'This request requires an internet connection' 
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

async function handleCacheFirstRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  // Fallback to network
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful, complete responses (not partial responses)
    if (networkResponse.ok && networkResponse.status !== 206 && networkResponse.status < 300) {
      const cache = await caches.open(CACHE_NAME);
      try {
        cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('[SW] Failed to cache response:', cacheError.message);
        // Continue without caching - don't break the response
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Both cache and network failed for:', request.url);
    throw error;
  }
}

function isNetworkFirstUrl(url) {
  return NETWORK_FIRST_URLS.some(pattern => url.includes(pattern));
}

function isCacheFirstUrl(url) {
  return CACHE_FIRST_URLS.some(pattern => url.includes(pattern));
}

// Handle background sync for offline vote submissions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'vote-submission') {
    event.waitUntil(handleOfflineVoteSync());
  }
});

async function handleOfflineVoteSync() {
  try {
    // Get pending votes from IndexedDB
    const pendingVotes = await getPendingVotes();
    
    for (const vote of pendingVotes) {
      try {
        // Try to submit the vote
        const response = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vote)
        });
        
        if (response.ok) {
          // Remove from pending votes
          await removePendingVote(vote.id);
          
          // Notify user of successful submission
          self.registration.showNotification('Vote Submitted', {
            body: 'Your vote has been successfully recorded on the blockchain.',
            icon: '/assets/pwa-icon-192.png',
            badge: '/assets/pwa-icon-72.png',
            tag: 'vote-success'
          });
        }
      } catch (error) {
        console.error('[SW] Failed to sync vote:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push event received');
  
  const options = {
    body: event.data ? event.data.text() : 'New election update available',
    icon: '/assets/pwa-icon-192.png',
    badge: '/assets/pwa-icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/assets/pwa-icon-72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/pwa-icon-72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BLOCKELECT Update', options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingVotes() {
  // Implementation would use IndexedDB to store/retrieve pending votes
  // This is a simplified version
  return [];
}

async function removePendingVote(voteId) {
  // Implementation would remove vote from IndexedDB
  console.log('[SW] Removing pending vote:', voteId);
}

// Periodic background sync for election updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'election-updates') {
    event.waitUntil(checkForElectionUpdates());
  }
});

async function checkForElectionUpdates() {
  try {
    const response = await fetch('/api/election-status');
    const data = await response.json();
    
    // Check if there are significant updates
    if (data.hasUpdates) {
      await self.registration.showNotification('Election Update', {
        body: data.message,
        icon: '/assets/pwa-icon-192.png',
        tag: 'election-update'
      });
    }
  } catch (error) {
    console.error('[SW] Failed to check election updates:', error);
  }
}

console.log('[SW] Service Worker loaded successfully');
