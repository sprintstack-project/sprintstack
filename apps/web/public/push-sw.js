// Shows SprintStack's pushes (sent through FCM by apps/api) and opens the app when one is clicked.
// Registered by src/lib/push.ts. Plain JS: it's served as is, outside the Next build.

// FCM delivers { notification: { title, body }, data: { notificationId, type, … } }.
const parse = (event) => {
  try {
    return event.data?.json() ?? {};
  } catch {
    return {};
  }
};

self.addEventListener('push', (event) => {
  const { notification = {}, data = {} } = parse(event);
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // A focused tab already shows it in the bell.
      if (clients.some((client) => client.focused)) return;
      return self.registration.showNotification(notification.title ?? 'SprintStack', {
        body: notification.body,
        icon: '/icon-192.png',
        // One OS notification per bell notification, even if FCM retries.
        tag: data.notificationId,
        data,
      });
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const open = clients.find((client) => new URL(client.url).origin === self.location.origin);
      if (open) return open.focus();
      return self.clients.openWindow('/dashboard');
    }),
  );
});
