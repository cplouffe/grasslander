"# grasslander" 
todo list:

	Priority for Cam:
		> tie esri geocoding control to searchbar
		
		> fix birdSightingFeatureService2 to accept updates (server)
		
		>start creating html/bootstrap forms with corresponding inputs to each feature service field
			- tie field values to input form fields for edit and add
			- ensure fields for feature.properties are being populated with correct format by each form field or are autopopulated from client/server (e.g., farm.properties.roll = parcel.properties.arn or date fieds to server date or client date default)
		
		>create page loading event (right after feature authentications) to determine which "step" to take user to based on if layers exists / farmLayer = step1 -> if fieldLayer = step2-> addActivities =step3
		
		>user login error popup (registration/forgot pwd forms to follow)
		
		>create/delete popup confrimations for each setup step and activity add/remove
		
		>enable "delete last created feature" when "cancel button" is pushed during "add attributes" modals in each step

		>format styles for all button (e.g., colors and size), text/content layout (e.g., fonttypes), and input type fields (e.g., drop down vs textField) for each instruction step, attribute form, "activity select" and proceed "switchStep" modal design.

	Matt:
		Field/Bird activities
		Layer ordering for each step
		sidebar functionality (adding in zoomToFeature) for all in frame activities 
		grouped layer controls
		markerclusters for field activities and baseLayer data
		edit/update functions for activities from sidebar list click
		switchStep function/button mapping
		editing "on" event simplification
		code documentation
		nav bar structure

	Others:
		UI comments
		content in html for nav bar/forms/images/icons
