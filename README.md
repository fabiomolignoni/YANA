# YANA
_Yet Another News Aggregator_

## COSE DA SISTEMARE
### NEWS AGGREGATOR
- fixare il fatto che guardian non mette ora giusta
- effettua una POST in automatico ogni 10 minuti
- deve passare page e pageSize a newsLogic
- aggiungere path di default per non definito
- gestire errori e reject delle promises
- separando le funzioni
- commentare codice
- scrivere api
### UI
- reperire dati da pc fisso
- aggiungere caricamento
- aggiungere search per tempo

***
YANA is a news aggregator. Yes, another news aggregator. Why develop it? Well, because as of today, there isn't a real point of reference for this kind of service that developers could use to implement their own application. The famous "Google News", for example, has deprecated its API from May of 2011. Other competitors, such as "NewsAPI", allow only few possibilities to extract news. For my project, I have therefore decided to implement a service that allows user to extract news from the major online newspapers.
***

## Dev TIME
1. ``News Headlines``: salva tutte le notizie. Viene utilizzato come "database" dei miei dati. Offre interfaccia CRUD, anche se in realtà dopo si utilizzerà solo la POST e la GET. Ogni entry è definita da un JSON: {
id: id_notizia,
source: id_nome
"author": nome_autore,
"title": titolo,
"url": url_notizia_completa
"urlImage": url_eventuale_image,
"datetime": timestamp orario,
"body": body della notizia
"category": categoria
"tags": [lista di tags]
} Richiede variabile environment: MONGOOSE_URL endpoint: https://yana-news-headlines.herokuapp.com/v1
apiary: https://yananewsheadlinesservice.docs.apiary.io/

2. ``rss Adapter``: trasforma xml the verge in jsone  trasforma xml the BBC in json endpoint: https://yana-rss-adapter.herokuapp.com apiary: https://yanarssadapter.docs.apiary.io

4. ``Headline interface``: ha il compito di astrarre il servizio _News Headlines_. In particolare, data una notizia, se esiste la aggiorna, altrimenti ne crea una categorizzandola e dandole i tag appropriati. Permette anche di recuperare tutte le note con i vari filtri. https://yana-news-logic.herokuapp.com/v1

5. ``Aggregator API``: Il vero e proprio aggregatore. Questo si occupa di contattare tutte le api, aggiornare le note tramite _Headline interface_  e recuperare quelle necessarie.
