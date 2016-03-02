function EastTroyChecker() {
    var self = this;
    self.init();
    self.refresh();
    Storage.getNews();
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        kango.browser.tabs.create({url: 'https://easttroy.org/news/'});
        self.refresh();
    });
    window.setInterval(function(){self.refresh()}, self._refreshTimeout);
}

EastTroyChecker.prototype = {

    _refreshTimeout: 60*1000*15,    // 15 minutes
    _feedUrl: 'https://easttroy.org/api/v1/news/',

    /**
     * Sets text to offline, button gray, and value to 0
     * @private
     */
    _setOffline: function() {
        kango.ui.browserButton.setTooltipText(kango.i18n.getMessage('Offline'));
        kango.ui.browserButton.setIcon('icons/button_gray.png');
        kango.ui.browserButton.setBadgeValue(0);
    },

    /**
     * Set news count
     * @param news object
     * @private
     */
    _setNewCount: function(news) {
        kango.ui.browserButton.setTooltipText(news.results[0].title); // Using first result as tooltip
        kango.ui.browserButton.setIcon('icons/button.png');
        //not setting count yet - soon?
        //kango.ui.browserButton.setBadgeValue(this._getBadgeNumber(news.count));
    },

    _getBadgeNumber: function(count) {
        var badgeCount = count - kango.storage.getItem('newsUnread');
        kango.storage.setItem('newsUnread', badgeCount);
        return badgeCount;
    },

    /**
     * Set the unread value to 0
     */
    init: function() {
        kango.storage.setItem('newsUnread', 0);
    },

    /**
     * Request for more news! Pass to _setNewCount to update our icon and count
     */
    refresh: function() {
        var details = {
            url: this._feedUrl,
            method: 'GET',
            async: true,
            contentType: 'json'
        };
        var self = this;
        kango.xhr.send(details, function(data) {
            if (data.status == 200 && data.response != null) {
                var news = data.response;
                kango.storage.setItem('news', news);
                self._setNewCount(news);
            }
            else { // something went wrong
                self._setOffline();
            }
        });
    }
};

var extension = new EastTroyChecker();

