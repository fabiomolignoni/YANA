# YANA - Yet Another News Aggregator
This project was developed by Fabio Molignoni (M. 203201) for the course "Introduction to service design and engineering" at University of Trento. For more informations, write to me at fabio.molignoni@studenti.unitn.it 

The report for this project can be found at: https://drive.google.com/open?id=1ogfIluheJ7nQvOUyk9RY3rzCgRwmjiDa

The main goal of this project is to create a "topic-oriented" news aggregator. Each news is labeled with a set of tags, which identify the main topics of the article. When you perform a search, you can select only the news that contain some specified topics, for example selecting only news that talk about Trento and football. The labeling is done using "Dandelion", an external API which allows to extract entities from text. The news comes from four differents sources: *The New York Times, The Verge, The Guardian* and  *BBC news*.  Another imporant feature of this project is that it groups together the news of the different sources in 10 pre-defined categories. This was possible thanks to another external API, called uClassify. To clarify better the behaviour of the business centric service, I have created a web page which communicates only thorugh API and only with the "news-aggregator" service (which is the business centric service). The webpage is: https://fabiomolignoni.github.io/YANA/ (the source code for the webpage can be found at this [link](https://github.com/fabiomolignoni/YANA/tree/master/docs))

Some caveat for the webpage: all the services are hosted on different free Heroku servers which, after 30 minutes of inactivity, go into sleep mode. Therefore, when you consult the website, you may have to wait 5/6 seconds before seeing the news, since all the services have to wake up. After another 5/6 seconds the service will automatically update the news database, so you may want to reload the page to actually see the last news published.

**For more informations you are invited to download the pdf:** 
## Services links

| Service layer | Service name | Service Source Code | Service endpoint | Service API |
| ------- | ------- | ------- | ------- | ------- |
| Data service layer | News Headlines | [GitHub link](https://github.com/fabiomolignoni/YANA/tree/master/news_headlines) | [Heroku link](https://yana-news-headlines.herokuapp.com/v1) | [Apiary Link](https://yananewsheadlinesservice.docs.apiary.io) |
| Adapter Service layer | Rss Adapter| [GitHub link](https://github.com/fabiomolignoni/YANA/tree/master/rss_adapter) | [Heroku link](https://yana-rss-adapter.herokuapp.com/v1) | [Apiary Link](https://yanarssadapter.docs.apiary.io/) |
| Business logic service layer | News Logic| [GitHub link](https://github.com/fabiomolignoni/YANA/tree/master/news_logic) | [Heroku link](https://yana-news-logic.herokuapp.com/v1) | [Apiary Link](https://yananewslogic.docs.apiary.io/) |
| Process centric service layer | News Aggregator| [GitHub link](https://github.com/fabiomolignoni/YANA/tree/master/news_aggregator) | [Heroku link](https://yana-news-aggregator.herokuapp.com/v1) | [Apiary Link](https://yananewsaggregator.docs.apiary.io/) |