const CACHE_NAME = 'pc-builder-cache-v4';
const STATIC_CACHE = 'tpc-static-cache-v4';
const DYNAMIC_CACHE = 'tpc-dynamic-cache-v4';

// Get the repository name for GitHub Pages
const getRepoName = () => {
  const pathArray = location.pathname.split('/');
  // If on GitHub Pages, the first segment after the domain will be the repo name
  return pathArray.length > 1 ? `/${pathArray[1]}` : '';
};

// Add repo name to paths for GitHub Pages compatibility
const repoName = self.location.pathname.split('/')[1] || '';
const repoPrefix = repoName ? `/${repoName}` : '';

// Danh sách tài nguyên tĩnh cần cache ngay khi cài đặt
const STATIC_ASSETS = [
  `${repoPrefix}/`,
  `${repoPrefix}/index.html`,
  `${repoPrefix}/styles.css`,
  `${repoPrefix}/buildsan.css`,
  `${repoPrefix}/modal-styles.css`,
  `${repoPrefix}/buildsan.js`,
  `${repoPrefix}/enums.js`,
  `${repoPrefix}/modal-handler.js`,
  `${repoPrefix}/component-connector.js`,
  `${repoPrefix}/manifest.json`,
  `${repoPrefix}/images/icon-192.png`,
  `${repoPrefix}/components-data.js`,
  `${repoPrefix}/clear-cache.js`
];

// Danh sách domain cần cache
const CACHE_DOMAINS = [
  'cdn.sheetjs.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'unpkg.com'
];

// Function to safely add items to cache - ignores failures
const safeCacheAdd = async (cache, url) => {
  try {
    await cache.add(url);
    console.log(`Successfully cached: ${url}`);
  } catch (error) {
    console.log(`Failed to cache: ${url} - ${error.message}`);
    // Continue despite error
  }
};

// Cài đặt service worker
self.addEventListener('install', event => {
  // Force activation of the new service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        // Use Promise.all with safeCacheAdd to handle errors gracefully
        return Promise.all(STATIC_ASSETS.map(url => safeCacheAdd(cache, url)));
      })
      .catch(error => {
        console.error('Error during service worker install:', error);
      })
  );
});

// Xử lý các yêu cầu fetch
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Check if it's an asset from our own origin - adjust for GitHub Pages
  const isOwnHost = url.hostname === self.location.hostname;
  if (!isOwnHost && !CACHE_DOMAINS.some(domain => url.hostname.includes(domain))) {
    return; // Skip non-cacheable cross-origin requests
  }
  
  // Always get the latest HTML from network
  if (url.pathname.endsWith('.html') || 
      url.pathname === '/' || 
      url.pathname === `${repoPrefix}/` || 
      url.pathname === repoPrefix) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Handle images specially - provide fallback
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return the cached response if we have it
          if (response) {
            return response;
          }
          
          // Otherwise try to fetch from network
          return fetch(event.request).catch(() => {
            // If both cache and network fail, return a placeholder or transparent image
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="#999">Image</text></svg>',
              { 
                headers: { 'Content-Type': 'image/svg+xml' } 
              }
            );
          });
        })
    );
    return;
  }
  
  // Check if the request is for a static asset (with GitHub Pages prefix handling)
  const requestPath = url.pathname.startsWith(repoPrefix) 
    ? url.pathname.substring(repoPrefix.length) 
    : url.pathname;
    
  const isStaticAsset = STATIC_ASSETS.some(asset => {
    const assetPath = asset.startsWith(repoPrefix) 
      ? asset.substring(repoPrefix.length) 
      : asset;
    return requestPath === assetPath || requestPath.includes(assetPath);
  });

  // Chiến lược cache-first cho tài nguyên tĩnh
  if (isStaticAsset || 
      url.pathname.includes('/images/') || 
      CACHE_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    // Chiến lược network-first cho các tài nguyên động
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Kích hoạt service worker và xóa cache cũ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete all caches except the current ones
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Chiến lược cache-first (ưu tiên cache)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Fetch failed:', error);
    // Có thể trả về một trang lỗi hoặc nội dung dự phòng
    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
}

// Chiến lược network-first (ưu tiên mạng)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Fetch failed, falling back to cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Trả về lỗi nếu không có trong cache
    return new Response('Network error and no cache available', { 
      status: 504, 
      headers: { 'Content-Type': 'text/plain' } 
    });
  }
} 