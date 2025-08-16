// Service Worker for MapleStory Party Finder
// Handles push notifications and background sync

const CACHE_NAME = 'maple-party-finder-v1';
const urlsToCache = [
  '/',
  '/icons/maple-leaf.png',
  '/icons/badge.png',
  '/icons/chat.png',
  '/icons/party-invite.png',
  '/icons/party-update.png',
  '/icons/buff.png',
  '/icons/reputation.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app resources');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Error caching resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('📲 Push notification received');
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('❌ Error parsing push data:', error);
  }

  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icons/maple-leaf.png',
    badge: '/icons/badge.png',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    tag: data.tag || 'default',
    vibrate: [200, 100, 200], // Vibration pattern
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MapleStory Party Finder', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  const action = event.action;

  // Handle different notification actions
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Try to find an existing window
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if none exists
      if (clients.openWindow) {
        let url = '/';
        
        // Navigate to specific sections based on notification type
        if (data.type === 'chat') {
          url = '/?tab=parties&chat=true';
        } else if (data.type === 'party-invite') {
          url = '/?tab=parties&invite=' + data.partyId;
        } else if (data.type === 'buff-schedule') {
          url = '/?tab=buffs';
        } else if (data.type === 'reputation') {
          url = '/?tab=profile';
        }
        
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'chat-message-sync') {
    event.waitUntil(syncChatMessages());
  } else if (event.tag === 'party-action-sync') {
    event.waitUntil(syncPartyActions());
  }
});

// Sync chat messages when back online
async function syncChatMessages() {
  try {
    console.log('💬 Syncing offline chat messages...');
    
    // Get offline messages from IndexedDB or localStorage
    const offlineMessages = getOfflineMessages();
    
    for (const message of offlineMessages) {
      try {
        await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
        
        // Remove from offline storage after successful sync
        removeOfflineMessage(message.id);
      } catch (error) {
        console.error('❌ Error syncing message:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error in chat sync:', error);
  }
}

// Sync party actions when back online
async function syncPartyActions() {
  try {
    console.log('🎉 Syncing offline party actions...');
    
    const offlineActions = getOfflinePartyActions();
    
    for (const action of offlineActions) {
      try {
        await fetch('/api/parties/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(action),
        });
        
        removeOfflinePartyAction(action.id);
      } catch (error) {
        console.error('❌ Error syncing party action:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error in party sync:', error);
  }
}

// Helper functions for offline storage
function getOfflineMessages() {
  try {
    const messages = localStorage.getItem('offline-chat-messages');
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    return [];
  }
}

function removeOfflineMessage(messageId) {
  try {
    const messages = getOfflineMessages();
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('offline-chat-messages', JSON.stringify(filteredMessages));
  } catch (error) {
    console.error('Error removing offline message:', error);
  }
}

function getOfflinePartyActions() {
  try {
    const actions = localStorage.getItem('offline-party-actions');
    return actions ? JSON.parse(actions) : [];
  } catch (error) {
    return [];
  }
}

function removeOfflinePartyAction(actionId) {
  try {
    const actions = getOfflinePartyActions();
    const filteredActions = actions.filter(action => action.id !== actionId);
    localStorage.setItem('offline-party-actions', JSON.stringify(filteredActions));
  } catch (error) {
    console.error('Error removing offline party action:', error);
  }
}

// Message to confirm service worker is running
console.log('🍁 MapleStory Party Finder Service Worker loaded successfully!');
