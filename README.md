# collab-sequencer

a collaborative music sequencer built for people who want to collaboratively sequence music.

![screenshot](http://i.imgur.com/ycIJ5WH.png)

built using:

* [Node](http://nodejs.org/)
* [Express](http://expressjs.com/)
* [Backbone](http://backbonejs.org/)/[Underscore](http://underscorejs.org/)
* [RequireJS](http://requirejs.org/)
* [jQuery](http://jquery.com/)

grab all dependencies by building on any unix system with node installed:

```bash
npm install
npm start
```

windows users have to install bower with `npm install -g bower`, then install bower stuff before `npm start`

```bash
bower install
```

requires a redis server running (see `configuration.js`)
