$(document).ready(function () {
    var d = new Date();
    document.getElementById("date").innerHTML = getStringDate(d)
    setNewestNews(0)
})

function setNewestNews(page) {
    console.log("quah")
    $.get("https://yana-news-aggregator.herokuapp.com/v1/news", function (data) {
        document.getElementById("news_container").innerHTML = ""
        for (x of data.news) {
            document.getElementById("news_container").innerHTML += createNewsAsString(x)
        }

    });
}

function getStringDate(d) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
}

function createNewsAsString(news) {
    let d = new Date(news.datetime)
    let result = '<h3><a target="_blank"  href="' + news.url + '">' + news.title + "</a></h3>"
    result += "<h4>" + news.source + "</h4>"
    result += '<p class="text date">' + getStringDate(d) + " " + ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + "</p>"
    result += '<p class="text">' + news.body + "</p>"
    return result
}