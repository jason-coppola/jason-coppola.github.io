// Run before the async Google tag so configuration and events can queue safely.
window.dataLayer = window.dataLayer || [];
function gtag() {
    window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-YRN7DPL326');

// Preserve the early visibility setup without allowing inline JavaScript.
document.documentElement.style.visibility = 'visible';
