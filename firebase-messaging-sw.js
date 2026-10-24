importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCH83QJQLQgxFidFwRRJmPepVh3DhmHfg8",
    authDomain: "megafrp-41498.firebaseapp.com",
    projectId: "megafrp-41498",
    storageBucket: "megafrp-41498.firebasestorage.app",
    messagingSenderId: "894020727561",
    appId: "1:894020727561:web:b81dd580e872a64e7019d8"
});

const messaging = firebase.messaging();

// استقبال الرسالة في الخلفية وعرضها يدوياً لضمان تمرير رابط النقر بدقة
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);

    const title = payload.data.title || "تحديث جديد";
    const options = {
        body: payload.data.body || "",
        icon: payload.data.icon || "",
        image: payload.data.image || "",
        data: {
            url: payload.data.url || ""
        }
    };

    self.registration.showNotification(title, options);
});

// الحدث المسؤول عن فتح الرابط عند النقر على الإشعار
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // إغلاق الإشعار

    var targetUrl = event.notification.data && event.notification.data.url 
        ? event.notification.data.url 
        : "https://appdowntele.blogspot.com/p/stores2.html?R=2";

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
