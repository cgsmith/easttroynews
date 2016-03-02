var Storage = {
    getNews: function () {
        var news = kango.storage.getItem('news').results;
        document.getElementById('news').innerHTML = '';
        for (var item of news) {
            var newsArticle = document.createElement('p');
            var d = new Date(item.publish);
            newsArticle.textContent = d.toLocaleDateString() + ': ' + item.title;
            document.getElementById('news').appendChild(newsArticle);
        }
    }
};

KangoAPI.onReady(function () {
    Storage.getNews();
});