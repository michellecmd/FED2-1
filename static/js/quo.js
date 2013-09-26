var APP = APP || {};

(function () {

	APP.quo = {

		pageInt: 0,

		startQuoJS: function () {
			$$("body").swipeLeft(function () {
				APP.quo.previousPage();
			}).swipeRight(function () {
				APP.quo.nextPage();
			});
		},

		previousPage: function () {
			if(APP.quo.pageInt != 0) {

			}
		}

	};

})();