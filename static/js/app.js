var APP = APP || {};

(function () {
	"use strict";

	APP.settings = {
		networkPath: "https://api.leaguevine.com/v1/"
	};
	
	// Schedule pagina data
	APP.teams = {
		teamsArray: [ ],
		page: 0,
		limit: 5,

		getTeamsFromLeagueVine: function (page) {
			var self = this;

			var offset = page * this.limit;
			var httpLink = APP.settings.networkPath + 'tournament_teams/?tournament_ids=%5B19389%5D&order_by=%5Bseed%5D&limit=' + this.limit + '&offset=' + offset + '&access_token=6dd70849a7';

			this.page = page;
			
			promise.get(httpLink).then(function(error, text, xhr) {
			    if (error) {
			      console.log('Error ' + xhr.status);
			      return;
			    }

			    self.teamsArray = [];

			    var data = JSON.parse(text);

			    for(var i = 0; i < data.objects.length; i++) {
			    	APP.teams.teamsArray[i] = {
			    		id: data.objects[i].team_id,
			    		name: data.objects[i].team.name,
			    		seed: data.objects[i].seed,
			    	};
			    }

			    APP.page.render("teams");
			});
		},

		nextPage: function(){
			this.page++;

			this.getTeamsFromLeagueVine(this.page);			
		},

		previousPage: function(){
			if(this.page >= 1) {
				this.page--;

				this.getTeamsFromLeagueVine(this.page);			
			}
		}
	};

	APP.pools = {
		poolsArray: [],

		getPoolsFromLeagueVine: function () {
			var self = this;
			
			promise.get(APP.settings.networkPath + 'pools/?tournament_id=19389&order_by=%5Bname%5D&access_token=6dd70849a7').then(function(error, text, xhr) {
			    if (error) {
			      console.log('Error ' + xhr.status);
			      return;
			    }

			    self.poolsArray = [];

			    var data = JSON.parse(text);

			    for(var i = 0; i < data.objects.length; i++) {
			    	self.poolsArray[i] = {
			    		name: data.objects[i].name
			    	};
			    }

			    APP.page.render("pools");
			});
		}

	};
	
	// Controller 
	APP.controller = {
		init: function () {
			// Initialize router
			APP.router.init();
		}
	};

	// Router
	APP.router = {
		init: function () {
			/*routie('/:name', function(name) {
			    APP.page.render(name);
			});*/

			routie({
			    '/teams': function() {
			    	APP.teams.getTeamsFromLeagueVine(0);
			    	APP.page.render("teams");
			    },

			    '*': function() {
			    	APP.teams.getTeamsFromLeagueVine(0);
			    	APP.page.render("teams");
			    },

			    '/teams/:page': function(page) {
			    	APP.teams.getTeamsFromLeagueVine(page);
			    	APP.page.render("teams");
			    },


			    '/pools': function() {
			    	APP.pools.getPoolsFromLeagueVine();
			    	APP.page.render("pools");
			    }
			});
		},

		// Functie voor het veranderen van pagina zonder nieuwe reload
		change: function () {
            var route = window.location.hash.slice(2),
                sections = qwery('section[data-route]'),
                section = qwery('[data-route=' + route + ']')[0];  

            if (section) {
            	for (var i=0; i < sections.length; i++){
            		sections[i].classList.remove('activePage');
            	}
            	section.classList.add('activePage');
            }

            if (!route) {
            	sections[0].classList.add('activePage');
            }

		}
	};

	// Verschillende pagina's renderen
	APP.page = {
		render: function (route) {
			var data = APP[route];
			Transparency.render(qwery('[data-route='+ route +'')[0], data);
			APP.router.change();
		}
	}

	// DOM ready
	domready(function () {
		// Initialize de app
		APP.controller.init();
	});
	
})();