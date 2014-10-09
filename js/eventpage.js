var n = webkitNotifications.createNotification('icon.png', 'Favorite stream(s) now online', "" + this.favoritesNew);
        n.show();

        setTimeout(function() {
            n.cancel();
        }, 10000);