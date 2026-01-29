// Configuration file - API keys are now handled securely on the backend
// Frontend only contains non-sensitive configuration

window.CONFIG = {
    // API endpoints
    API_BASE_URL: '/api',
    
    // No API keys exposed in frontend for security
    // All API calls go through backend endpoints
};

console.log('✓ Config loaded - API keys secured on backend');
