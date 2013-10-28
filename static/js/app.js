var APP = APP || {};

/* I am awesome! */

(function () {
	"use strict";

	APP.settings = {
		networkPath: "https://api.leaguevine.com/v1/"
	};

	APP.utils = {
		dateFormat: function(dateToChange) {
			var year = dateToChange.substring(0, 4),
				month = dateToChange.substring(5, 7),
				day = dateToChange.substring(8, 10),
				hour = dateToChange.substring(11, 13),
				minutes = dateToChange.substring(14, 16);

			return day + "-" + month + "-" + year + " " + hour + ":" + minutes;
		},

		spinner: {
			object: document.getElementById('spinner'),
			show: function () {
				this.object.className = "spinner";
			},
			hide: function () {
				this.object.className = "nospin";
			} 
		},
		
		error: {
			object: document.getElementById('error'),
			show: function (text) {
				this.object.className = "error";
				this.object.innerHTML = text;

				APP.utils.spinner.hide();

				var self = this;

				setTimeout(function () {
					self.hide();
				}, 3000);
			},
			hide: function () {
				this.object.className = "noerror";
				this.object.innerHTML = " ";
			}
		}
	}

	/*APP.spinner = {
		object: document.getElementById('spinner'),
		show: function () {
			this.object.className = "spinner";
		},
		hide: function () {
			this.object.className = "nospin";
		}
	};*/

	/*APP.error = {
		object: document.getElementById('error'),
		show: function (text) {
			this.object.className = "error";
			this.object.innerHTML = text;

			APP.spinner.hide();

			var self = this;

			setTimeout(function () {
				self.hide();
			}, 3000);
		},
		hide: function () {
			this.object.className = "noerror";
			this.object.innerHTML = " ";
		}
	};*/
	
	// Schedule pagina data
	APP.teams = {
		teamsArray: [ ],
		page: 0,
		limit: 5,

		getTeamsFromLeagueVine: function (page) {
			APP.utils.spinner.show();
			var self = this;

			var offset = page * this.limit;
			var httpLink = APP.settings.networkPath + 'tournament_teams/?tournament_ids=%5B19389%5D&order_by=%5Bseed%5D&limit=' + this.limit + '&offset=' + offset + '&access_token=6dd70849a7';

			this.page = page;
			
			promise.get(httpLink).then(function(error, text, xhr) {
			    if (error) {
			      APP.utils.error.show('Error: ' + xhr.status);
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
			    APP.utils.spinner.hide();
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
			APP.utils.spinner.show();
			var self = this;
			
			promise.get(APP.settings.networkPath + 'pools/?tournament_id=19389&order_by=%5Bname%5D&access_token=6dd70849a7').then(function(error, text, xhr) {
			    if (error) {
			      APP.utils.error.show('Error: ' + xhr.status);
			      return;
			    }

			    self.poolsArray = [];

			    var data = JSON.parse(text);

			    for(var i = 0; i < data.objects.length; i++) {
			    	self.poolsArray[i] = {
			    		name: "Pool " + data.objects[i].name,
			    		id: data.objects[i].id
			    	};

			    	self.poolsArray[i].teams = [];

			    	for(var y = 0; y < data.objects[i].standings.length; y++) {
			    		self.poolsArray[i].teams[y] = {
			    			name: data.objects[i].standings[y].team.name,
			    			wins: data.objects[i].standings[y].wins,
			    			losses: data.objects[i].standings[y].losses,
			    			points_scored: data.objects[i].standings[y].points_scored,
			    			points_allowed: data.objects[i].standings[y].points_allowed,
			    			plus_minus: data.objects[i].standings[y].plus_minus
			    		};
			    	}
					
					self.poolsArray[i].teams.sort(function(a,b) {
						return a.wins + b.wins;
					});

			    }

			    APP.page.render("pools");
			    APP.utils.spinner.hide();
			});
		}

		/*directives: [{
			link: {
				href: function(params) {
					return this.id;
				}
			}
		}]*/
	};

	APP.poolsMatches = {

		poolsMatchesArray: [],

		getPoolsMatchesFromLeagueVine: function (poolID) {

			APP.utils.spinner.show();
			var self = this;
			
			promise.get(APP.settings.networkPath + 'games/?tournament_id=19389&pool_id=' + poolID + '&order_by=%5Bstart_time%5D&access_token=578aa0b8aa').then(function(error, text, xhr) {
			    if (error) {
			      APP.utils.error.show('Error: ' + xhr.status);
			      return;
			    }

			    self.poolsMatchesArray = [];

			    var data = JSON.parse(text);
			    console.log(data);

			    for(var i = 0; i < data.objects.length; i++) {
			    	self.poolsMatchesArray[i] = {
			    		id: data.objects[i].id,
			    		team1: data.objects[i].team_1.name,
			    		team2: data.objects[i].team_2.name,
			    		team1Score: data.objects[i].team_1_score,
			    		team2Score: data.objects[i].team_2_score,
			    		startTime: APP.utils.dateFormat(data.objects[i].start_time)
			    	};
			    }

			    APP.page.render("poolsMatches");
			    APP.utils.spinner.hide();
			});

		}
	};

	APP.match = {

		getMatchScore: function (matchID) {
			APP.utils.spinner.show();
			var self = this;
			
			promise.get(APP.settings.networkPath + 'game_scores/?game_id=' + matchID + '&order_by=%5B\'id\'%5D&access_token=578aa0b8aa').then(function(error, text, xhr) {
			    if (error) {
			      APP.error.show('Error: ' + xhr.status);
			      return;
			    }

			    self.matchDetails = [];

			    var data = JSON.parse(text);

			    var length = data.objects.length-1;

			    self.matchDetails = {
		    		team1Score: data.objects[length].team_1_score,
		    		team2Score: data.objects[length].team_2_score
			    };
			    

			    APP.page.render("match");
			    APP.utils.spinner.hide();
			});
		},

		saveMatch: function () {
			var score1 = document.getElementById('team1_score').value;
			var score2 = document.getElementById('team2_score').value;

			

			APP.utils.error.show("1: " + score1 + "<br />2: " + score2);
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
			    // '*': function() {
			    // 	APP.teams.getTeamsFromLeagueVine(0);
			    // 	APP.page.render("teams");
			    // },

			    '/teams': function() {
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
			    },


			    '/poolsMatches/:pool': function(pool) {
			    	APP.poolsMatches.getPoolsMatchesFromLeagueVine(pool);
			    	//APP.page.render("poolsMatches");
			    },


			    '/match/:matchID': function(matchID) {
			    	APP.match.getMatchScore(matchID);
			    	APP.page.render("match");
			    }
			});
		},

		// Functie voor het veranderen van pagina zonder nieuwe reload
		change: function () {
            
            var sections = qwery('section[data-route]'),
            	route 	 = window.location.hash.slice(2);
        	
        	for(var i = 0; i < sections.length; i++) {
        		sections[i].classList.remove('activePage');
        	}
			
			if(route.search("/") != -1)
				route = route.substring(0, route.search("/"));
        	
        	var sectionToChange = qwery('[data-route=' + route + ']')[0];

        	sectionToChange.classList.add('activePage');

		}
	};

	// Verschillende pagina's renderen
	APP.page = {
		render: function (route) {
			var data = APP[route];

			var directives = {
				poolsArray: {
					link: {
						href: function(params) {
							return "#/poolsMatches/" + this.id;
						}
					}
				},

				poolsMatchesArray: {
					link: {
						href: function(params) {
							return "#/match/" + this.id;
						}
					}
				},

				matchDetails: {
					team1_score: {
						value: function(params) {
							return this.team1Score;
						}
					},
					team2_score: {
						value: function(params) {
							return this.team2Score;
						}
					}
				}
			};
			Transparency.render(qwery('[data-route='+ route +'')[0], data, directives);
			APP.router.change();
		}
	}

	// DOM ready
	domready(function () {
		// Initialize de app
		APP.controller.init();
	});
	
})();
