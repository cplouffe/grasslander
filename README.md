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
		> replacing all external libraries currently used (very very limited) with available esri services when applicable (e.g., geolocate control by ip)

	Matt:
	~~Field/Bird activities~~
		Layer ordering for each step
		sidebar functionality (adding in zoomToFeature) for all in frame activities 
		grouped layer controls
		markerclusters for field activities and baseLayer data
		edit/update functions for activities from sidebar list click
		switchStep function/button mapping
		finalizw layer, control, and "step capability" accessible to user per setup step 
		editing "on" event simplification
		code documentation
		handle beta testing changes as needed
		relay codebase structure and features to OCS and code curator
		nav bar structure/layout

	Others:
		>UI/Procedural workflow comments/change suggestions
		
		>Create content in html for nav bar/forms/images/icons
		
		> Create and add aggregating baselayer data (e.g., ebird/NHIC data) with user contributions. Or, grid "bin-based" layer for other farmer data.
		
		>Creating and adding user "feedback" charts and info graphics --- i.e., the d3 charts Jen worked on and birdObservation infographics Cam has suggested. Right now limited to "Plight of the BoboLink" submenu of nav-bar, but can add to sidebar later if desired through tabs.

		>adding addition form inputs and feature service fields asking for more information than the information regarding "field descriptions" obtained June 6th, 2016.
		
		> Implementing any further changes in plateform capabilities and features (e.g., user registration/contact and landing page) following approval of he beta-testing phase (ending June 18th 2016) -- obviously excluding minor codebase clarification/assistance and on the event of initial codebase needs further debugging following plateform's initial deployment. 
		
		> user registration and authentication
		
		>database optimization and maintenance, as well as any database triggers or templates that need created or modified beyond beta-testing phase. Within reason. 
		
		>arcserver and feature service maintenance/adminstration.




