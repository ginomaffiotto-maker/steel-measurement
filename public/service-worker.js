// Service worker mínimo, sin caché — existe únicamente para que Chrome
// cumpla el requisito de "fetch handler registrado" y ofrezca instalar la
// app (ver beforeinstallprompt). No intercepta ni guarda nada: cada pedido
// va directo a la red, así nunca se puede ver una versión vieja cacheada.
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
