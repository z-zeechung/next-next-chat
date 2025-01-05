"use client"

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(new URL('./service-worker.js', import.meta.url).href).then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function (err) {
        console.error('ServiceWorker registration failed: ', err);
      });
    });
  }