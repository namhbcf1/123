// Script to help clear service worker and browser cache
(function() {
    // Check if we're on GitHub Pages
    const isGitHubPages = location.hostname.includes('github.io');
    const repoName = isGitHubPages ? location.pathname.split('/')[1] || '' : '';
    
    // Function to unregister service worker
    async function unregisterServiceWorker() {
        try {
            if ('serviceWorker' in navigator) {
                // Get all service worker registrations
                const registrations = await navigator.serviceWorker.getRegistrations();
                let unregisteredCount = 0;
                
                for (let registration of registrations) {
                    // On GitHub Pages, the scope will include the repository name
                    console.log('Found service worker with scope:', registration.scope);
                    await registration.unregister();
                    console.log('Service worker unregistered');
                    unregisteredCount++;
                }
                
                return unregisteredCount > 0;
            }
        } catch (error) {
            console.error('Error unregistering service worker:', error);
        }
        return false;
    }

    // Function to clear caches
    async function clearCaches() {
        try {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                const deletedCount = await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                ).then(results => results.filter(Boolean).length);
                
                console.log(`Cleared ${deletedCount} caches`);
                return deletedCount > 0;
            }
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
        return false;
    }
    
    // Add GitHub Pages specific URL parameters to avoid caching
    function addNoCacheParam(url) {
        const parsedUrl = new URL(url, window.location.origin);
        parsedUrl.searchParams.set('cache_bust', Date.now());
        return parsedUrl.toString();
    }

    // Run on page load with slight delay to ensure service worker has registered
    window.addEventListener('load', function() {
        // Wait a bit to ensure page is fully loaded
        setTimeout(async function() {
            const serviceWorkerUnregistered = await unregisterServiceWorker();
            const cachesCleared = await clearCaches();
            
            if (serviceWorkerUnregistered || cachesCleared) {
                console.log('Cache cleared. Reloading page...');
                
                // For GitHub Pages, add a cache-busting parameter
                if (isGitHubPages) {
                    window.location.href = addNoCacheParam(window.location.href);
                } else {
                    // Force reload without cache
                    window.location.reload(true);
                }
            }
        }, 1000);
    });
})(); 