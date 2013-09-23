var APP = APP || {};

(function () {
	// Data objecten
	APP.schedule = {
		scheduleArray: [
			{ date: "Monday, 9:00am", team1: "Chasing", team1Score: "13", team2: "Amsterdam Money Gang", team2Score: "9"},
			{ date: "Monday, 9:00am", team1: "Boomsquad", team1Score: "15", team2: "Beast Amsterdam", team2Score: "11"},
			{ date: "Monday, 10:00am", team1: "Beast Amsterdam", team1Score: "14", team2: "Amsterdam Money Gang", team2Score: "12"},
			{ date: "Monday, 10:00am", team1: "Chasing", team1Score: "5", team2: "Burning Snow", team2Score: "15"},
			{ date: "Monday, 11:00am", team1: "Boomsquad", team1Score: "11", team2: "Amsterdam Money Gang", team2Score: "15"},    
			{ date: "Monday, 11:00am", team1: "Burning Snow", team1Score: "15", team2: "Beast Amsterdam", team2Score: "6"},
			{ date: "Monday, 12:00pm", team1: "Chasing", team1Score: "8", team2: "Beast Amsterdam", team2Score: "15"},
			{ date: "Monday, 12:00pm", team1: "Boomsquad", team1Score: "15", team2: "Burning Snow", team2Score: "8"},
			{ date: "Monday, 1:00pm", team1: "Chasing", team1Score: "15", team2: "Boomsquad", team2Score: "14"},
			{ date: "Monday, 1:00pm", team1: "Burning Snow", team1Score: "15", team2: "Amsterdam Money Gang", team2Score: "11"}
		]
	};

	APP.game = {
		title:'Pagina 2',
		description:'Pagina 2 is de tweede pagina'
	};

	APP.ranking = {
		title:'Pagina 3',
		description:'Pagina 3 is de derde pagina'
	};
	
	// Controller Init
	APP.controller = {
		init: function () {
			// Initialize router
			APP.controller.orderArray();
			APP.router.init();
		}, 
		
		orderArray: function () {
			var newOrderArray = [];
			
			for(var i = 0; i < APP.schedule.scheduleArray.length; i++) {
				var score1 = parseFloat(APP.schedule.scheduleArray[i].team1Score),
					score2 = parseFloat(APP.schedule.scheduleArray[i].team2Score);
					
				if(score1 > score2) {
					newOrderArray[i] = APP.schedule.scheduleArray[i];
				} else if(score1 < score2) {
					var tempScore1 = score1,
						tempScore2 = score2,
						tempTeam1 = APP.schedule.scheduleArray[i].team1,
						tempTeam2 = APP.schedule.scheduleArray[i].team2;
					
					APP.schedule.scheduleArray[i].team1Score = tempScore2;
					APP.schedule.scheduleArray[i].team2Score = tempScore1;
					
					APP.schedule.scheduleArray[i].team1 = tempTeam2;
					APP.schedule.scheduleArray[i].team2 = tempTeam1;
					
					newOrderArray[i] = APP.schedule.scheduleArray[i];
				} else {
					newOrderArray[i] = APP.schedule.scheduleArray[i];
				}
			}
			
			APP.schedule.scheduleArray = newOrderArray;
		}
	};

	// Router
	APP.router = {
		init: function () {
	  		routie({
			    '/schedule': function() {
			    	APP.page.schedule();
				},
			    '/game': function() {
			    	APP.page.game();
			    },

			    '/ranking': function() {
			    	APP.page.ranking();
			    },
			    '*': function() {
			    	APP.page.schedule();
			    }
			});
		},

		change: function () {
            var route = window.location.hash.slice(2),
                sections = qwery('section[data-route]'),
                section = qwery('[data-route=' + route + ']')[0];  

            if (section) {
            	for (var i=0; i < sections.length; i++){
            		sections[i].classList.remove('active');
            	}
            	section.classList.add('active');
            }

            if (!route) {
            	sections[0].classList.add('active');
            }

		}
	};

	// Pages
	APP.page = {
		schedule: function () {
			Transparency.render(qwery('[data-route=schedule')[0], APP.schedule);
			APP.router.change();
		},

		game: function () {
			Transparency.render(qwery('[data-route=game')[0], APP.game);
			APP.router.change();
		},

		ranking: function () {
			Transparency.render(qwery('[data-route=ranking')[0], APP.ranking);
			APP.router.change();
		}
	}
	// DOM ready
	domready(function () {
		APP.controller.init();
	});
	
})();