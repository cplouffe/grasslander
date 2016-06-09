"# grasslander" 
todo list:

	Priority for Cam:
		> tie esri geocoding control to searchbar
			--reported as done as of 6/8
				-- using the search bar totally as a "geocoding" service instead of searching by arn in the farmsetup step. By using geolocate by ip button and/or address search we hope that land owners can identify their own properties without the need of searching by a 16 digit number at this stage - given the loading query function being a bit of an issue with the feature service and preloading every possible value into a search cache "client side" being way too much demand. Future solutions include "fuzzy queries" in esriFeatureServices with perhaps something like elasticsearch. Meanwhile - cam has rightly replaced the feature search services that were limited to finding "your farm name" type of attribute fields with being a dedicated geocoding address search bar. This was an ongoing issue that solved for a more important function (i.e., address search). Recommend those in contact with farmers during intial testing phase - definatel ask their arn # and compare it/correct their user-selected delination for congurence between the parcel data and user-defined features as early as possible.
		
		> user login error popup (registration/forgot pwd forms to follow)
			 - more or less done. Just checking is "token" request was a success or error (right, cam?)



		> fix birdSightingFeatureService2 to accept updates (server)
			- as Cam pointed out this featureservice has all of the same permissions as the rest - so shouldn't be having an issue- so will look into the editing function/rest-request with more detail. Cam - as I noted below - I am getting similar errors from adding and updating point features with both my bird and field activity layers (both are points!). I'm really stuck on this as the error response is more or less " Unable to complete updatefeatures request with Array[1]" despite these being very similar to those calls using polygons. However, fieldEventsLayer/step3 seems to be a bit of a problem child if you wouldn't mind looking into these issues.

		>start creating html/bootstrap forms with corresponding inputs to each feature service field
			<!-- 	tie field values to input form fields for edit and add
			- ensure fields for feature.properties are being populated with correct format by each form field or are autopopulated from client/server (e.g., farm.properties.roll = parcel.properties.arn or date fieds to server date or client date default) -->
			Will assign to mt if you can focus on issue with activity issue above!
		
		>create page loading event (right after feature authentications) to determine which "step" to take user to based on if layers exists / farmLayer = step1 -> if fieldLayer = step2-> addActivities =step3
		
		
		>create/delete popup confrimations for each setup step and activity add/remove
			- pushed off until the end of "matts list" and/or "beta testing" suggestions
		
		>enable "delete last created feature" when "cancel button" is pushed during "add attributes" modals in each step
					- pushed off until the end of "matts list" and/or "beta testing" suggestions. Right now users need to deliberitly delete last created feature when "cancel" is clicked during modal/ attribute form pops up


		>format styles for all button (e.g., colors and size), text/content layout (e.g., fonttypes), and input type fields (e.g., drop down vs textField) for each instruction step, attribute form, "activity select" and proceed "switchStep" modal design.

			- As Colin reiterated today: most of the minor suggestions to be done "after the release" along with many other "minor details".If not a minor issue I will confirm with some of the most involved stakeholders as an effort to resolve  anything that us "unknowing" however: incases that "knowing means ~ marketing someone like J.Beiber" I'd rather forfet my charge than  untill now to present a "congruent" and "consistent" format matching standards of quality expected with the pedegree Esri (Brent),  withing elements part of the sight, these things definately take as back seat in terms of focusing on handling major functionality issues and/or when they may arise within the next two weeks (for me). Giving preference instead of asthetic nature (very open to change/comment) and critiques regarding  replacing all external libraries currently used (very very limited) with available esri services when applicable (e.g., geolocate control by ip)

	Matt:
	~~Field/Bird activities~~
			still having update/add issues with birdactivities and fieldacitivites - check server config and had to update fieldactivities to accept add/update/transaction.
		Layer ordering for each step
			- seems to be fixed. Should always order farms, fields, bird/field activities from bottom to top. 
		sidebar functionality (adding in zoomToFeature) for all in frame activities 
		grouped layer controls
			seemingly done at the moment...will remove ag inventory until can find out while broken images
		markerclusters for field activities and baseLayer data
			- will do once add activies for birds/fields is functional. 
		edit/update functions for activities from sidebar list click
			-will do once bird/field activities are fully functional
		switchStep function/button mapping
			-done
		finalizw layer, control, and "step capability" accessible to user per setup step
			-seemingly done.
		editing "on" event simplification
1		code documentation
			-will do as I go and revise before handing off
		handle beta testing changes as needed
			-limited input/changes to major bugs and/or deemed important changes that cause minor delay in initial release.
		relay codebase structure and features to OCS and code curator
			- yet to do, end of initial beta/as needed next week
		nav bar structure/layout
			- done? rearranged "setup" menu to be sole step transition aside from "proceed" button that is prompted only after creating a new feature between each step sequentially. May want to add an additional option of "no changes". Also may want to re-implement a double-click, "change attribute" modal for each setup step to change attributes instead of requiring the deletion/redelinitation of features at each step. 

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




