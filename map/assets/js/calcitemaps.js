/* calcite-maps - v0.0.1 - 2016-06-13
*  https://github.com/alaframboise/calcite-maps#readme
*  Copyright (c) 2016 Environmental Systems Research Institute, Inc.
*  Apache 2.0 License */
!function($){"use strict";var navbarSelector=".calcite-navbar .calcite-dropdown li > a",navbarToggleTarget="toggleNavbar",preventOverscrolling=!0;$(navbarSelector).on("click",function(e){if(e.currentTarget.dataset.target){var panelBody,panels,panel=$(e.currentTarget.dataset.target);if(panel.hasClass("panel"))panel.hasClass("in")?(panel.removeClass("in"),panel.collapse("show")):(panels=$(".calcite-panels .panel.in").not(e.currentTarget.dataset.target),panels.collapse("hide"),panel.collapse("show"),panelBody=panel.find(".panel-collapse"),panelBody.hasClass("in")||panelBody.collapse("show"));else if(e.currentTarget.dataset.target===navbarToggleTarget){var body=$("body");body.hasClass("calcite-nav-transparent")?body.removeClass("calcite-nav-transparent"):($(".calcite-panels .panel.in").collapse("hide"),body.addClass("calcite-nav-transparent"))}}}),$(".calcite-map").on("touchmove",function(e){preventOverscrolling&&e.preventDefault()}),$(".calcite-dropdown").on("show.bs.dropdown",function(){$(".calcite-dropdown-toggle").addClass("open")}),$(".calcite-dropdown").on("hide.bs.dropdown",function(){$(".calcite-dropdown-toggle").removeClass("open")})}(jQuery);
