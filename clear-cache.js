// Script to help clear service worker and browser cache
(function() {
    // Function to unregister service worker
    async function unregisterServiceWorker() {
        try {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                    console.log('Service worker unregistered');
                }
                return true;
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
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
                console.log('Caches cleared');
                return true;
            }
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
        return false;
    }

    // Run on page load
    window.addEventListener('load', async function() {
        const serviceWorkerUnregistered = await unregisterServiceWorker();
        const cachesCleared = await clearCaches();
        
        if (serviceWorkerUnregistered || cachesCleared) {
            console.log('Cache cleared. Reloading page...');
            // Force reload without cache
            window.location.reload(true);
        }
    });
})(); 