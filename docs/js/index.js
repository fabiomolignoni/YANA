
var currentPage = 0
var typeOfPage = "latest"

$(document).ready(function () {
    var d = new Date();
    document.getElementById("date").innerHTML = getStringDate(d)
    loadLatest()
    // document.getElementById("previousButton").disabled = true;
})

function setLatest() {
    currentPage = 0
    loadLatest()
}

function searchByTopic() {
    currentPage = 0
    loadByTopic()
}

function loadLatest() {
    document.getElementById("search").style.display = "none"
    $.get("https://yana-news-aggregator.herokuapp.com/v1/news?page=" + currentPage, function (data) {
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
    let options = ""
    var e = document.getElementById("selectCategory");
    var category = e.options[e.selectedIndex].value;
    options += "?page=" + currentPage + "&"
    if (category != "all") {
        options += "category=" + category + "&"
    }
    e = document.getElementById("selectSource")
    var source = e.options[e.selectedIndex].value
    if (source != "all") {
        options += "source=" + source
    }
    e = document.getElementById("SelectTime")
    var time = e.options[e.selectedIndex].value
    if (time != "all") {
        let now = new Date()
        options += "from="
        switch (time) {
            case "1":
                now.setHours(now.getHours() - 2)
                break
            case "24":
                now.setDate(now.getDate() - 1)
                break
            case "7":
                now.setDate(now.getDate() - 7)
                break
            case "30":
                now.setMonth(now.setMonth() - 1)
                break
        }
        options += now.toISOString()
    }
    console.log("https://yana-news-aggregator.herokuapp.com/v1/news/" + values + options)
    $.get("https://yana-news-aggregator.herokuapp.com/v1/news/" + values + options, function (data) {
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
    let result = '<div class="news"><h3><a target="_blank"  href="' + news.url + '">' + news.title + "</a></h3>"
    result += "<h4>" + news.source + "</h4>"
    result += '<p class="text date">' + getStringDate(d) + " " + ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + "</p>"
    if (news.body != undefined)
        result += '<p class="text">' + news.body + "</p>"
    result += "<p<><b>Category:</b> " + news.category + "</p>"
    result += "<p><b>Topics:</b> " + news.tags.join(", ") + "</p><hr></div>"
    return result
}

function createSourceAsString(source) {
    let result = '<div class="news"><h3><a target="_blank"  href="' + source.url + '">' + source.name + "</a></h3>"
    result += '<p class="text date"><b>Language: </b>' + source.lang + "</p>"
    result += '<p class="text">' + source.description + "</p></div>"
    return result
}

function nextPage() {
    currentPage += 1
    if (currentPage == 1) {
        document.getElementById("previousButton").disabled = false;
    }
    if (typeOfPage == "latest") {
        loadLatest()
    } else if (typeOfPage == "topic") {
        loadByTopic()
    }
    $('html, body').animate({ scrollTop: 0 }, 'medium');
}
function previousPage() {
    if (currentPage > 0) {
        currentPage -= 1
        if (currentPage == 0) {
            document.getElementById("previousButton").disabled = true;
        }
        if (typeOfPage == "latest") {
            loadLatest()
        } else if (typeOfPage == "topic") {
            loadByTopic()
        }
    }
}