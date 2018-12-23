$(document).ready(function () {
    var d = new Date();
    document.getElementById("date").innerHTML = getStringDate(d)
    loadLatest(0)
})

function loadLatest(page) {
    document.getElementById("search").style.display = "none"
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

function loadSources() {
    $.get("https://yana-news-aggregator.herokuapp.com/v1/sources", function (data) {
        document.getElementById("search").style.display = "none"
        document.getElementById("news_container").innerHTML = ""
        for (x of data) {
            document.getElementById("news_container").innerHTML += createSourceAsString(x)
        }
    });
}

function loadByTopic() {
    let values = document.getElementById("userTags").value.split(",")
    values = values.join("|")
    console.log(values)
    $.get("https://yana-news-aggregator.herokuapp.com/v1/news/" + values, function (data) {
        document.getElementById("search").style.display = "none"
        document.getElementById("news_container").innerHTML = ""
        for (x of data.news) {
            document.getElementById("news_container").innerHTML += createNewsAsString(x)
        }
    });
}

function byTopic() {
    document.getElementById("search").style.display = "block"
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

function createSourceAsString(source) {
    let result = '<h3><a target="_blank"  href="' + source.url + '">' + source.name + "</a></h3>"
    result += '<p class="text date"><b>Language: </b>' + source.lang + "</p>"
    result += '<p class="text">' + source.description + "</p>"
    return result
}