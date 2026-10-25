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

// استقبال الإشعار وقراءة البيانات المرسلة من البايثون فقط
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);

    const customData = payload.data || {};
    
    const title = customData.title || "تحديث جديد";
    const body = customData.body || "";
    const image = customData.image || "";
    const targetUrl = customData.url; // الرابط القادم من البايثون حصرياً

    const options = {
        body: body,
        icon: "https://images.icon-icons.com/2136/PNG/512/google_games_icon_131690.png",
        image: image,
        data: {
            url: targetUrl
        }
    };

    self.registration.showNotification(title, options);
});

// فتح الرابط المرسل من البايثون بدقة عند النقر
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); 

    // جلب الرابط من الـ payload المُرسل من البايثون حصرياً
    var targetUrl = event.notification.data ? event.notification.data.url : null;

    if (!targetUrl) {
        return; // لو مفيش رابط مرسل، لا تقم بأي إجراء لتجنب فتح روابط خاطئة
    }

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
