$(window).load(function() {
    var map,
        featureList,
        layers = [],
        farmsSearch = [],
        fieldsSearch = [],
        activitiesSearch = [],
        parcelSearch = [],
        parcelLayer,
        farmLayer,
        stepNum,
        baseUrl = 'https://www.grasslander.org:6443/arcgis',
        servicesUrl = baseUrl + '/rest/services/grasslander',
        tokenUrl = baseUrl + '/tokens/generateToken';

    $("#login-modal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#login-modal").modal("show");

    $(window).resize(function() {
        sizeLayerControl();
    });
    $(document).on("mouseout", ".feature-row", clearHighlight);
    $(document).ready(function() {
        $('.material-button-toggle').click(function() {
            $(this).toggleClass('open');
            $('.option').toggleClass('scale-on');
        });
    });
    $(function() {
        $('#datetimepicker10').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
            // },
            // function(start, end, label) {
            //     var years = moment().diff(start, 'years');
            //     alert("You are " + years + " years old.");
        });
    });

    if (!("ontouchstart" in window)) {
        $(document).on("mouseover", ".feature-row", function(e) {
            highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
        });
    }
    $(document).on("mouseout", ".feature-row", clearHighlight);
    $("#about-btn").click(function() {
        $("#aboutModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#legend-btn").click(function() {
        $("#legendModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });
    $("#login-btn").click(function() {
        $("#loginModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });
    $("#list-btn").click(function() {
        animateSidebar();
        return false;
    });
    $("#nav-btn").click(function() {
        $(".navbar-collapse").collapse("toggle");
        return false;
    });
    $("#sidebar-toggle-btn").click(function() {
        animateSidebar();
        return false;
    });
    $("#sidebar-hide-btn").click(function() {
        animateSidebar();
        return false;
    });

    function animateSidebar() {
        $("#sidebar").animate({
            width: "toggle"
        }, 350, function() {
            map.invalidateSize();
        });
    }

    function sizeLayerControl() {
        $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    }

    function clearHighlight() {
        highlight.clearLayers();
    }







    // $("#full-extent-btn").click(function() {
    //     map.fitBounds(farmLayer.layers.getBounds());
    //     $(".navbar-collapse.in").collapse("hide");
    //     return false;
    // });

    // workaround for old ie
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
    // closes sidebar
    document.getElementById('list-btn').click();
    /* Basemap Layers */
    var topo = L.esri.basemapLayer("Topographic");
    var streets = L.esri.basemapLayer("Streets");
    var imagery = L.esri.basemapLayer("Imagery");
    var natgeo = L.esri.basemapLayer("NationalGeographic");
    var ssadref = L.esri.basemapLayer("ShadedRelief");
    /* Overlay Layers */
    var highlight = L.geoJson(null);
    var highlightStyle = {
        stroke: false,
        fillColor: "#00FFFF",
        fillOpacity: 0.7,
        radius: 10
    };
    var baseMaps = {
        "Topographic": topo,
        "Streets": streets,
        "Imagery": imagery,
        "NationalGeographic": natgeo,
        "ShadedRelief": ssadref
    };

    /* Overlay Layers */
    var aafc_inventory = L.tileLayer.wms('http://www.agr.gc.ca/atlas/services/imageservices/aafc_crop_inventory_2014_30m/ImageServer/WMSServer?request=GetCapabilities&service=WMS', {
        layers: '0',
        attribution: 'AAFC Annual Crop Inventory 2014'
    });
    var studyArea = L.esri.featureLayer({
        url: servicesUrl + '/Grasslandbase/MapServer/4'

    });
    var nhic_bobo = L.esri.featureLayer({
        url: servicesUrl + '/Grasslandbase/MapServer/3'

    });
    var nhic_lark = L.esri.featureLayer({
        url: servicesUrl + '/Grasslandbase/MapServer/2'

    });
    var ebird_bobo = L.esri.featureLayer({
        url: servicesUrl + '/Grasslandbase/MapServer/1'

    });
    var ebird_lark = L.esri.featureLayer({
        url: servicesUrl + '/Grasslandbase/MapServer/0'
    });

    var gLayers = {
        "NHIC BoboLink": nhic_bobo,
        "NHIC Meadowlark": nhic_lark,
        "eBird BoboLink": ebird_bobo,
        "eBird Meadowlark": ebird_lark,
        "Study Area": studyArea,
        "AAFC Crop Inventory 2014": aafc_inventory


    };
    // Overlay layers are grouped
    var groupedOverlays = {
        "Bird Observations": {
            "NHIC BoboLink": nhic_bobo,
            "NHIC Meadowlark": nhic_lark,
            "eBird BoboLink": ebird_bobo,
            "eBird Meadowlark": ebird_lark
        },
        "Refernce Layers": {
            "Study Area": studyArea,
            // "AAFC Crop Inventory 2014": aafc_inventory
        }
    };

    var options = {
        // Show a checkbox next to non-exclusive group labels for toggling all
        groupCheckboxes: true
    };
    //L.control.groupedLayers(baseLayers, groupedOverlays, options).addTo(map);

    map = L.map("map", {
        zoom: 17,
        center: [43.6532, -79.3832],
        zoomControl: false,
        layers: [imagery],
        // Needed to turn attribution control on for Geocod
        attributionControl: true
    });


    // Initialize Geocoder
    initGeocoder();


    L.control.layers(baseMaps, gLayers).addTo(map);



    var bobolinkIcon = L.icon({
        iconUrl: 'http://vignette4.wikia.nocookie.net/farmville/images/9/93/Bobolink-icon.png/revision/latest?cb=20120719223918',
        iconSize: [25, 25],
        iconAnchor: [0, 0],
    });


    // var save_progress_button = L.Control.extend({
    //     options: {
    //         position: "bottomleft",
    //         title: "Send Message",
    //     },
    //     onAdd: function() {
    //         var a = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom1");
    //         return a.style.width = "30px", a.style.height = "30px", a.title = "Move to the next step...",
    //             a.onAdd = function() {
    //                 this._tooltip = this._createTooltip("Next Step")
    //             },
    //             a.onclick = function() {
    //                 switchStep();
    //             }, a
    //     }
    // });

    // map.addControl(new save_progress_button);




    //CAM - here is the geoseach controller. Can you remove it and add it to <input id="searchbox" type="text" placeholder="Search" class="form-control">

    // var geosearch = new L.Control.GeoSearch({
    //     provider: new L.GeoSearch.Provider.Esri()
    // }).addTo(map);

    function initGeocoder() {

        // Specify provider
        var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider(),
            // Create the geocoding control and add it to the map
            searchControl = L.esri.Geocoding.geosearch({
                providers: [arcgisOnline]
            });
        // Add geocoderControl to navbar instead of map
        searchControl._map = map;

        var geocoderDiv = searchControl.onAdd(map);
        // Add to div in Navbar
        $('.form-group.has-feedback')[0].appendChild(geocoderDiv);

        // meld.after(searchControl, 'clear', function() {
        //     $('.toolbar-header, .aicbr-logo').removeClass('geocoder-toggled');
        // });

    }


    ///////////////switch step function.

    function switchStep() {
        if (stepNum == 1) {
            console.log(stepNum);
            stepNum += 1;
            document.getElementById('step2').click();
        } else if (stepNum == 2) {
            console.log(stepNum);
            stepNum += 1;
            document.getElementById('step3').click();
        } else if (stepNum == 3) {
            console.log(stepNum);
            document.getElementById('step4').click();
        } else if (stepNum == 4) {
            // document.getElementById('step1').click();
            console.log(stepNum);
        }
    }

    // create a new farm Draw control
    var drawnFarms = L.featureGroup();
    var drawFarmControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnFarms, // allow editing/deleting of features in this group
            edit: false // disable the edit tool (since we are doing editing ourselves)
        },
        draw: {
            circle: false, // disable circles
            marker: false,
            rectangle: false, // disable polylines
            polyline: false, // disable polylines
            polygon: false // disable polygons. Only enable delete feature. Force people to select their parcels.
        }

    });




    var drawnFields = L.featureGroup();
    // create a new Leaflet Draw control
    var drawFieldControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnFields, // allow editing/deleting of features in this group
            edit: false // disable the edit tool (since we are doing editing ourselves)
        },
        draw: {
            circle: false, // disable circles
            marker: false,
            rectangle: false, // disable polylines
            polyline: false, // disable polylines
            polygon: {
                allowIntersection: false, // polygons cannot intersect thenselves
                drawError: {
                    color: 'red', // color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // message that will show when intersect
                },
            }
        }
    });
    // create a new Leaflet Draw control
    var drawnBirds = L.featureGroup();
    var drawBirdControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnBirds, // allow editing/deleting of features in this group
            edit: false // disable the edit tool (since we are doing editing ourselves)
        },
        draw: {
            circle: false,
            rectangle: false, // disable circles
            // disable polylines
            polyline: false, // disable polylines
            polygon: false
        }
    });
    // create a new Leaflet Draw control
    var drawnFieldEvents = L.featureGroup();
    var drawnFieldEvenControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnFieldEvents, // allow editing/deleting of features in this group
            edit: false // disable the edit tool (since we are doing editing ourselves)
        },
        draw: {
            circle: false,
            rectangle: false, // disable circles
            // disable polylines
            polyline: false, // disable polylines
            polygon: false
        }
    });
    // styles and icons here
    var parcelStyle = {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 0.55
    };
    var farmStyle = {
        "color": "#00cc66",
        "weight": 1,
        "opacity": 0.55
    };
    var fieldStyle = {
        "color": "#ffff99",
        "weight": 1,
        "opacity": 0.55
    };

    ///////////////////////
    //LOGIN
    ///////////////////////
    $("#loginbtn").click(function() {

        //grab username from login modal
        var username = $('#username').val();
        var password = $('#password').val();
        console.log(username);
        console.log(password);

        // define feature services and authenticate user

        // authentication

        function serverAuth(callback) {
            L.esri.post(tokenUrl, {
                username: username,
                password: password,
                f: 'json',
                expiration: 86400,
                client: 'referer',
                referer: window.location.origin
            }, callback);
        }

        // Restart login process

        function restartLogin(error) {

            console.log(error);
            // Make prettier and into a modal down the line...
            alert('The username or password you entered is incorrect. Please provide valid credentials to log in.');
            $('#login-modal').modal('show');

        }

        // Configure authentication for a given layer

        function configureAuth(layer) {

                layer.on('authenticationrequired', function(e) {
                    serverAuth(function(error, response) {
                        e.authenticate(response.token);
                    });
                });

        }

        // Log user into app
        serverAuth(function(error, response) {

            // If user does not provide valid credentials, stop log in process
            if (error) {
                restartLogin(error);
                return;
            }

            // Hacking together because data-dismiss is causing issues
            $('#login-modal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

            // $('#login-modal').modal('hide');

            // Farm layer authentication
            var farmLayer = L.esri.featureLayer({
                url: servicesUrl + '/Farms/FeatureServer/0',
                opacity: 1,
                style: farmStyle,
                token: response.token,
                onEachFeature: function(feature, layer) {
                    layer.options.fillColor = '#0000FF';
                    if (feature.properties) {
                        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.farm_id + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
                        //Can assing 'on click' modal hear, but moving it to "draw:created" to make attribute popup fire after creating

                        // // layer.on({
                        // //     click: function(e) {
                        // //         $("#feature-title").html(feature.properties.type);
                        // //         $("#feature-info").html(content);
                        // //         $("#featureModal").modal("show");
                        // //         highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                        // //     }
                        // // });
                        // $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                        // farmsSearch.push({
                        //     name: "testing", //layer.feature.properties.NAME,
                        //     address: layer.feature.properties.ADDRESS1,
                        //     source: "Farms",
                        //     id: L.stamp(layer),
                        //     lat: layer.feature.geometry.coordinates[1],
                        //     lng: layer.feature.geometry.coordinates[0]
                        // });
                    }
                }
            });
            layers.push(farmLayer);

            // grab fieldLayer polygons
            var fieldLayer = L.esri.featureLayer({
                url: servicesUrl + '/Field/FeatureServer/0',
                opacity: 1,
                style: fieldStyle,
                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.type + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
                        //Can assing 'on click' modal hear, but moving it to "draw:created" to make attribute popup fire after creating

                        // layer.on({
                        //     click: function(e) {
                        //         $("#feature-title").html(feature.properties.type);
                        //         $("#feature-info").html(content);
                        //         $("#featureModal").modal("show");
                        //         highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                        //     }
                        // });
                        // $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                        // fieldsSearch.push({
                        //     name: "testing", //layer.feature.properties.NAME,
                        //     address: layer.feature.properties.ADDRESS1,
                        //     source: "Fields",
                        //     id: L.stamp(layer),
                        //     lat: layer.feature.geometry.coordinates[1],
                        //     lng: layer.feature.geometry.coordinates[0]
                        // });
                    }
                }

            });
            layers.push(fieldLayer);

            // grab birdLayer points
            var birdLayer = L.esri.featureLayer({
                url: servicesUrl + '/BirdSightings2/FeatureServer/0' //,
            });
            layers.push(birdLayer);

            // grab fieldEventLayer points
            var fieldEventLayer = L.esri.featureLayer({
                url: servicesUrl + '/BirdSightings2/FeatureServer/0'
            });
            layers.push(fieldEventLayer);

            // Parcel layer
            // var parcelLayer = L.esri.dynamicMapLayer({
            var parcelLayer = L.esri.featureLayer({
                // url: servicesUrl + '/Parcels/MapServer/0',
                url: servicesUrl + '/Parcels/FeatureServer/0',
                simplifyFactor: 2,
                cacheLayers: true,
                style: parcelStyle,
                maxZoom: 20,
                minZoom: 13
            });
            layers.push(parcelLayer);

            // Authenticate all layers used in app
            layers.forEach(configureAuth);


            function sidebarClick(id) {
                console.log(id);
                var layer = layerGroup.getLayer(id);
                map.setView(layer.getBounds(), 17);
                layer.fire("click");
                /* Hide sidebar and go to the map on small screens */
                if (document.body.clientWidth <= 767) {
                    $("#sidebar").hide();
                    map.invalidateSize();
                }
            }

            $(document).on("click", ".feature-row", function(e) {
                $(document).off("mouseout", ".feature-row", clearHighlight);
                console.log($(this).context);

                // sidebarClick(parseInt($(this).attr("id"), 10));

            });

            /// These grab the features within map bounds and add them to the map as a list. Ideally (above function) when you click on these their attribute modal will pop up showing you their detials.
            function syncSidebar() {
                /* Empty sidebar features */
                $("#feature-list tbody").empty();
                /* Loop through theaters layer and add only features which are in the map bounds */
                fieldLayer.eachFeature(function(layer) {
                    if (map.hasLayer(fieldLayer)) {
                        console.log(layer);
                        if (map.getBounds().contains(layer.getBounds())) {
                            $("#feature-list tbody").append('<tr class="feature-row" title="fieldLayer" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.type + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                        }
                    }
                });
                farmLayer.eachFeature(function(layer) {
                    if (map.hasLayer(farmLayer)) {
                        if (map.getBounds().contains(layer.getBounds())) {
                            $("#feature-list tbody").append('<tr class="feature-row" title="farmLayer" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/ic_nature_black_24px.svg"></td><td class="feature-name">' + layer.feature.properties + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                        }
                    }
                });
                // farmLayer.eachFeature(function(layer) {
                //     if (map.hasLayer(farmLayer)) {
                //         if (map.getBounds().contains(layer.getBounds())) {
                //             $("#feature-list tbody").append('<tr class="feature-row" title="farmLayer" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/ic_nature_black_24px.svg"></td><td class="feature-name">' + layer.feature.properties + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                //         }
                //     }
                // });
                /* Update list.js featureList */
                featureList = new List("features", {
                    valueNames: ["feature-name"]
                });
                featureList.sort("feature-name", {
                    order: "asc"
                });
            }

            // Query features that need to populate the sidebar when map is panned/moved
            map.on("moveend", function(e) {
                syncSidebar();
            });

            // when we start using creation tools disable our custom editing
            map.on('draw:createstart', function() {
                disableEditing = true;
            });

            // when we start using deletion tools, hide attributes and disable custom editing
            map.on('draw:deletestart', function() {
                disableEditing = true;
                currentlyDeleting = true;
            });

            // listen to the draw created event
            map.on('draw:created', function(e) {
                // add the feature as GeoJSON (feature will be converted to ArcGIS JSON internally)

                if (stepNum == 1) {
                    console.log(e.layer.toGeoJSON());
                    farmLayer.addFeature(e.layer.toGeoJSON());
                    disableEditing = false;
                    $("#addFarmAttributes").modal('show');
                } else if (stepNum == 2) {
                    console.log(e.layer.toGeoJSON());
                    fieldLayer.addFeature(e.layer.toGeoJSON());
                    disableEditing = false;
                    $("#addFieldAttributes").modal('show');
                } else if (stepNum == 3) {
                    birdLayer.addFeature(e.layer.toGeoJSON());
                    disableEditing = false;
                    $("#addBirdActivities").modal('show');

                }


            });

            // listen to the draw deleted event
            map.on('draw:deleted', function(e) {
                var delArray = [];
                if (stepNum == 1) {
                    e.layers.eachLayer(function(layer) {
                        var id = layer.feature.id;
                        delArray.push(id);
                    });
                    farmLayer.deleteFeatures(delArray, function(error, response) {
                        if (error) {
                            console.log(error, response);
                        }
                    });
                    disableEditing = false;
                    currentlyDeleting = false;

                } else if (stepNum == 2) {
                    e.layers.eachLayer(function(layer) {
                        var id = layer.feature.id;
                        delArray.push(id);
                    });
                    fieldLayer.deleteFeatures(delArray, function(error, response) {
                        if (error) {
                            console.log(error, response);
                        }
                    });
                    disableEditing = false;
                    currentlyDeleting = false;
                } else if (stepNum == 3) {
                    e.layers.eachLayer(function(layer) {
                        var id = layer.feature.id;
                        delArray.push(id);
                    });
                    birdLayer.deleteFeatures(delArray, function(error, response) {
                        if (error) {
                            console.log(error, response);
                        }
                    });
                    disableEditing = false;
                    currentlyDeleting = false;

                }

            });
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Feature query for user-specific step selection
            // var farmQuery = new L.esri.query(farmLayer);

            // studyArea.getLayer(1);
            console.log(studyArea);
            //console.log(farmLayer.query().within(L.LatLng([85, -180]),L.LatLng([-85,180]));


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // decided to remove the setup selection app in favor of just doing a 1-drop down setup menu on the nav bar. Removing the "next step" save button in favor
            // of a "Add more" or "Proceed" modal for the setup step transitions.

            $("#proceed-button").click(function() {

                $("#proceed-modal").modal("hide");

                switchStep();
                return false;
            });
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $("#step1").click(function() {
                stepNum = 1;


                map.removeControl(drawFarmControl);
                map.removeControl(drawFieldControl);
                map.removeControl(drawBirdControl);
                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                // map.removeLayer(farmLayer);
                map.removeLayer(fieldLayer);
                // add our drawing controls to the map
                map.addControl(drawFarmControl);

                // parcelLayer.addTo(map);
                // farmLayer.addTo(map);
                map.addLayer(parcelLayer);
                map.addLayer(farmLayer);
                map.addLayer(drawnFarms);
                parcelLayer.bringToBack();

                $("#farmsetupinstructions").modal("show");
                // variable to track the layer being edited
                var currentlyEditing = false;
                var currentlyDeleting = false;
                // create a feature group for Leaflet Draw to hook into for delete functionality
                // track if we should disable custom editing as a result of other actions (create/delete)
                var disableEditing = false;
                // start editing a given layer
                function startEditingFarm(layer) {
                    $('#exampleTextarea').val = layer.feature.properties.title;
                    // read only
                    //document.getElementById("exampleInputEmail1").value = layer.feature.properties.TRANPLANID;
                    if (!disableEditing) {
                        layer.editing.enable();
                        currentlyEditing = layer;
                    }
                }
                // stop editing a given layer
                function stopEditingFarm() {
                    // if a layer is being edited, finish up and disable editing on it afterward.
                    if (currentlyEditing) {
                        handleFarmEdit(currentlyEditing);
                        currentlyEditing.editing.disable();
                    }
                    currentlyEditing = undefined;
                }

                function handleFarmEdit(layer) {
                    // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                    // alert($('#exampleTextarea').val())
                    layer.feature.properties.farm_id = $('#farm_id').val();
                    layer.feature.properties.roll = $('#rollNumber').val();
                    layer.feature.properties.con = $('#conNumber').val();
                    layer.feature.properties.con = $('#lotNumber').val();
                    layer.feature.properties.con = $('#lotNumber').val();
                    layer.feature.properties.farm_type = $('#farm_type').val();
                    farmLayer.updateFeature({
                        type: 'Feature',
                        id: layer.feature.farm_id,
                        geometry: layer.toGeoJSON().geometry,
                        properties: layer.feature.properties
                    }, function(error, response) {
                        if (response) {
                            console.log("response");
                        }
                    });
                }

                function displayAttributes(layer) {
                    console.log(layer.feature.properties);
                    // $('#exampleTextarea').val(layer.feature.properties.title);
                }
                // // when clicked, stop editing the current feature and edit the clicked feature
                // farmLayer.on('click', function(e) {
                //     startEditingFarm(e.layer);
                //     if (!currentlyDeleting) {
                //         $('#rollNumber').val(e.layer.feature.properties.roll);
                //         $('#conNumber').val(e.layer.feature.properties.con);
                //         $('#lotNumber').val(e.layer.feature.properties.lot);
                //         $('#farm_type').val(e.layer.feature.properties.farm_type);
                //         $('#farm_id').val(e.layer.feature.properties.farm_id);
                //         $("#addFarmAttributes").modal('show');
                //         displayAttributes(e.layer);
                //     }
                // });
                // when new features are loaded clear our current guides and feature groups
                // then load the current features into the guides and feature group
                farmLayer.on('load', function() {
                    // wipe the current layers available for deltion and clear the current guide layers.
                    drawnFarms.clearLayers();
                    // for each feature push the layer representing that feature into the guides and deletion group
                    farmLayer.eachFeature(function(layer) {
                        drawnFarms.addLayer(layer);
                    });
                });
                parcelLayer.on('click', function(e) {
                    e.layer.bringToBack();
                    feature = e.layer.toGeoJSON();
                    feature.properties.roll = e.layer.feature.properties.arn;
                    farmLayer.addFeature(feature);

                    $('#rollNumber').val(e.layer.feature.properties.roll);
                    $('#conNumber').val(e.layer.feature.properties.con);
                    $('#lotNumber').val(e.layer.feature.properties.lot);
                    $('#farm_type').val(e.layer.feature.properties.farm_type);
                    $('#farm_id').val(e.layer.feature.properties.farm_id);
                    $("#addFarmAttributes").modal('show');
                    displayAttributes(e.layer);
                    // switch (e.layer.options.fillColor) {
                    //     case '#0000FF':
                    //         e.layer.setStyle({
                    //             fillColor: "#ff7800"
                    //         });
                    //         e.layer.options.fillColor = '#ff7800';
                    //         var id = e.layer.feature.id
                    //             // farmLayer.deleteFeature(id);
                    //             // farmLayer.addFeature(e.layer.toGeoJSON());
                    //         e.layer.bringToBack()
                    //         farmLayer.addFeature(e.layer.toGeoJSON());
                    //         break;
                    //     case "#ff7800":
                    //         e.layer.setStyle({
                    //             fillColor: "#0000FF"
                    //         });
                    //         e.layer.options.fillColor = '#0000FF';
                    //         var id = e.layer.feature.id
                    //         farmLayer.deleteFeature(id);
                    //         // farmLayer.deleteFeature(id);
                    //         // e.layer.bringToBack()
                    //         break;
                    //     case null:
                    //         e.layer.setStyle({
                    //             fillColor: "#0000FF"
                    //         });
                    //         e.layer.options.fillColor = '#0000FF';
                    //         var id = e.layer.feature.id
                    //         farmLayer.deleteFeature(id);
                    //         e.layer.bringToBack()

                    //         break;
                    // }
                });
                $("#submitDataFarm").click(function() {
                    stopEditingFarm();
                    $("#addFarmAttributes").modal('hide');
                    $("#proceed-modal").modal('show');


                    $('#rollNumber').val(e.layer.feature.properties.roll);
                    $('#conNumber').val(e.layer.feature.properties.con);
                    $('#lotNumber').val(e.layer.feature.properties.lot);
                    $('#farm_type').val(e.layer.feature.properties.farm_type);
                    $('#farm_id').val(e.layer.feature.properties.farm_id);
                    $("#addFarmAttributes").modal('show');
                    displayAttributes(e.layer);
                    // switch (e.layer.options.fillColor) {
                    //     case '#0000FF':
                    //         e.layer.setStyle({
                    //             fillColor: "#ff7800"
                    //         });
                    //         e.layer.options.fillColor = '#ff7800';
                    //         var id = e.layer.feature.id
                    //             // farmLayer.deleteFeature(id);
                    //             // farmLayer.addFeature(e.layer.toGeoJSON());
                    //         e.layer.bringToBack()
                    //         farmLayer.addFeature(e.layer.toGeoJSON());
                    //         break;
                    //     case "#ff7800":
                    //         e.layer.setStyle({
                    //             fillColor: "#0000FF"
                    //         });
                    //         e.layer.options.fillColor = '#0000FF';
                    //         var id = e.layer.feature.id
                    //         farmLayer.deleteFeature(id);
                    //         // farmLayer.deleteFeature(id);
                    //         // e.layer.bringToBack()
                    //         break;
                    //     case null:
                    //         e.layer.setStyle({
                    //             fillColor: "#0000FF"
                    //         });
                    //         e.layer.options.fillColor = '#0000FF';
                    //         var id = e.layer.feature.id
                    //         farmLayer.deleteFeature(id);
                    //         e.layer.bringToBack()

                    //         break;
                    // }
                });
                $("#submitDataFarm").click(function() {
                    stopEditingFarm();
                    $("#addFarmAttributes").modal('hide');
                    $("#proceed-modal").modal('show');

                });
            });

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $("#step2").click(function() {
                $("#step-modal").modal("hide");
                stepNum = 2;
                map.removeControl(drawFarmControl);
                map.removeControl(drawFieldControl);
                map.removeControl(drawBirdControl);
                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                map.removeLayer(parcelLayer);
                map.removeLayer(farmLayer);
                map.removeLayer(fieldLayer);
                // add our drawing controls to the map
                map.addControl(drawFieldControl);
                farmLayer.addTo(map);
                fieldLayer.addTo(map);
                map.addLayer(drawnFields);

                $("#fieldsetupinstructions").modal("show");

                var currentlyEditing = false;
                var currentlyDeleting = false;
                // create a feature group for Leaflet Draw to hook into for delete functionality
                // track if we should disable custom editing as a result of other actions (create/delete)
                var disableEditing = false;
                // start editing a given layer
                function startEditingField(layer) {
                    // $('#exampleTextarea').val = layer.feature.properties.title;
                    // read only
                    if (!disableEditing) {
                        layer.editing.enable();
                        currentlyEditing = layer;
                    }
                }
                // stop editing a given layer
                function stopEditingField() {
                    // if a layer is being edited, finish up and disable editing on it afterward.
                    if (currentlyEditing) {
                        handleFieldEdit(currentlyEditing);
                        currentlyEditing.editing.disable();
                    }
                    currentlyEditing = undefined;
                }

                function handleFieldEdit(layer) {
                    // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                    // alert($('#exampleTextarea').val())
                    // layer.feature.properties.title = $('#exampleTextarea').val();
                    // layer.feature.properties.daterep = $('#datetimepicker10').val();
                    layer.feature.properties.field_id = layer.feature.id;
                    layer.feature.properties.date = new Date();
                    layer.feature.properties.type = $('#type').val();
                    layer.feature.properties.activity = $('#activity').val();
                    layer.feature.properties.farm_type = $('#farm_type').val();
                    fieldLayer.updateFeature({
                        type: 'Feature',
                        id: layer.feature.id,
                        geometry: layer.toGeoJSON().geometry,
                        properties: layer.feature.properties
                    }, function(error, response) {
                        if (response) {
                            console.log("pass");
                        }
                    });
                }

                function displayAttributes(layer) {
                    console.log(layer.feature.properties);
                    // $('#exampleTextarea').val(layer.feature.properties.title);
                }

                // when new features are loaded clear our current guides and feature groups
                // then load the current features into the guides and feature group
                fieldLayer.on('load', function() {
                    // wipe the current layers available for deltion and clear the current guide layers.
                    drawnFields.clearLayers();
                    // for each feature push the layer representing that feature into the guides and deletion group
                    fieldLayer.eachFeature(function(layer) {
                        drawnFields.addLayer(layer);
                    });
                });


                $("#submitDataField").click(function() {
                    stopEditingField();
                    $("#addFieldAttributes").modal('hide');
                    $("#proceed-modal").modal('show');

                });
            });
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $("#step3").click(function() {
                // $("#activitysetupinstructions").modal("show");
                stepNum = 3;
                map.removeControl(drawFarmControl);
                map.removeControl(drawFieldControl);
                map.removeControl(drawBirdControl);
                map.removeLayer(parcelLayer);
                map.removeLayer(fieldLayer);
                map.removeLayer(farmLayer);

                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                map.removeLayer(drawnFarms);

                $("#addActivitySelect").modal("show");



                $("#startBirdActivity").click(function() {
                    // $("#addActivitySelect").modal("hide");
                    $("#birdactivitysetupinstructions").modal("show");





                    // add our drawing controls to the
                    farmLayer.addTo(map);
                    fieldLayer.addTo(map);
                    farmLayer.bringToBack();
                    birdLayer.addTo(map);
                    // fieldEventLayer.addTo(map);
                    map.addControl(drawBirdControl);
                    // create a feature group for Leaflet Draw to hook into for delete functionality
                    map.addLayer(drawnBirds);
                    var currentlyEditing = false;
                    var currentlyDeleting = false;

                    // track if we should disable custom editing as a result of other actions (create/delete)
                    var disableEditing = false;
                    // start editing a given layer
                    function startEditingBird(layer) {
                        // $('#exampleTextarea').val = layer.feature.properties.title;
                        // read only
                        if (!disableEditing) {
                            layer.editing.enable();
                            currentlyEditing = layer;
                        }
                    }
                    // stop editing a given layer
                    function stopEditingBird() {
                        // if a layer is being edited, finish up and disable editing on it afterward.
                        if (currentlyEditing) {
                            handleBirdEdit(currentlyEditing);
                            currentlyEditing.editing.disable();
                        }
                        currentlyEditing = undefined;
                    }

                    function handleBirdEdit(layer) {
                        // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                        // alert($('#exampleTextarea').val())
                        // layer.feature.properties.title = $('#exampleTextarea').val();
                        // layer.feature.properties.daterep = $('#datetimepicker10').val();
                        layer.feature.properties.field_id = layer.feature.id;
                        layer.feature.properties.date = new Date();
                        layer.feature.properties.type = $('#type').val();
                        layer.feature.properties.activity = $('#activity').val();
                        layer.feature.properties.farm_type = $('#farm_type').val();
                        birdLayer.updateFeature({
                            type: 'Feature',
                            id: layer.feature.id,
                            geometry: layer.toGeoJSON().geometry,
                            properties: layer.feature.properties
                        }, function(error, response) {
                            if (response) {
                                console.log("pass");
                            }
                        });
                    }




                    function displayAttributes(layer) {
                        console.log(layer.feature.properties);
                        // $('#exampleTextarea').val(layer.feature.properties.title);
                    }
                    // when clicked, stop editing the current feature and edit the clicked feature
                    birdLayer.on('click', function(e) {
                        // stopEditing();
                        startEditingBird(e.layer);
                        if (!currentlyDeleting) {
                            // $('#exampleTextarea').val(e.layer.feature.properties.title);
                            $("#addBirdActivities").modal('show');
                            displayAttributes(e.layer);
                        }
                    });
                    // when clicked, stop editing the current feature and edit the clicked feature
                    // when new features are loaded clear our current guides and feature groups
                    // then load the current features into the guides and feature group
                    birdLayer.on('load', function() {
                        // wipe the current layers available for deltion and clear the current guide layers.
                        drawnBirds.clearLayers();
                        // for each feature push the layer representing that feature into the guides and deletion group
                        birdLayer.eachFeature(function(layer) {
                            drawnBirds.addLayer(layer);
                        });
                    });

                    $("#submitDataBird").click(function() {
                        stopEditingBird();
                        $("#addBirdActivities").modal('hide');
                    });
                });

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                $("#startFieldActivity").click(function() {

                    //$("#fieldactivitysetupinstructions").modal("show");


                    map.removeControl(drawFarmControl);
                    map.removeControl(drawFieldControl);
                    map.removeControl(drawBirdControl);
                    map.removeLayer(parcelLayer);
                    map.removeLayer(fieldLayer);
                    map.removeLayer(farmLayer);

                    map.removeLayer(drawnBirds);
                    map.removeLayer(drawnFields);
                    map.removeLayer(drawnFarms);

                    // add our drawing controls to the
                    farmLayer.addTo(map);
                    fieldLayer.addTo(map);


                    // birdLayer.addTo(map);
                    farmLayer.bringToBack();
                    fieldEventLayer.addTo(map);
                    var currentlyEditing = false;
                    var currentlyDeleting = false;
                    map.addLayer(drawnFieldEvents);
                    map.addControl(drawnFieldEvenControl);
                    // track if we should disable custom editing as a result of other actions (create/delete)
                    var disableEditing = false;
                    // start editing a given layer

                    function startEditingFieldEvent(layer) {
                        // $('#exampleTextarea').val = layer.feature.properties.title;
                        // read only
                        if (!disableEditing) {
                            layer.editing.enable();
                            currentlyEditing = layer;
                        }
                    }
                    // stop editing a given layer
                    function stopEditingFieldEvent() {
                        // if a layer is being edited, finish up and disable editing on it afterward.
                        if (currentlyEditing) {
                            handleFieldEventEdit(currentlyEditing);
                            currentlyEditing.editing.disable();
                        }
                        currentlyEditing = undefined;
                    }

                    function handleFieldEventEdit(layer) {
                        // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                        // alert($('#exampleTextarea').val())
                        // layer.feature.properties.title = $('#exampleTextarea').val();
                        // layer.feature.properties.daterep = $('#datetimepicker10').val();



                        // layer.feature.properties = {};
                        // layer.feature.properties.field_id = layer.feature.id;
                        // layer.feature.properties.date = new Date();
                        // layer.feature.properties.type = $('#type').val();
                        // layer.feature.properties.activity = $('#activity').val();
                        // layer.feature.properties.farm_type = $('#farm_type').val();



                        console.log(layer);
                        id = layer._leaflet_id;
                        geom = layer.toGeoJSON().geometry;
                        properties = layer.toGeoJSON().properties;
                        properties.test = "test";
                        properties.something = "something";
                        console.log(geom);
                        console.log(properties);
                        //update properties as per form values

                        fieldEventLayer.updateFeature({
                            type: 'Feature',
                            id: id,
                            geometry: geom,
                            properties: properties
                        }, function(error, response) {
                            if (response) {
                                console.log("pass");
                            } else if (error) {
                                console.log(error);
                            }
                        });
                    }




                    function displayAttributes(layer) {
                        console.log(layer.feature.properties);
                        // $('#exampleTextarea').val(layer.feature.properties.title);
                    }
                    // when clicked, stop editing the current feature and edit the clicked feature

                    fieldLayer.on('click', function(e) {

                        // stopEditing();
                        // startEditingFieldEvent(e.layer);
                        //
                        marker = L.marker(e.layer.getBounds().getCenter());
                        drawnFieldEvents.addLayer(marker);

                        lay = drawnFieldEvents.getLayers()[drawnFieldEvents.getLayers().length - 1];
                        id = lay._leaflet_id;
                        feature = lay.toGeoJSON();
                        feature.properties.id = id;
                        console.log(feature);
                        fieldEventLayer.addFeature(feature, function(error, response) {
                            if (response) {
                                console.log("pass");
                            } else if (error) {
                                console.log(error);
                            }
                        });
                        startEditingFieldEvent(lay);

                        drawnFieldEvents.clearLayers();
                        $("#addFieldActivities").modal('show');
                        // if (!currentlyDeleting) {
                        //     // $('#exampleTextarea').val(e.layer.feature.properties.title);
                        //     displayAttributes(e.layer);
                        // }
                    });



                    // when clicked, stop editing the current feature and edit the clicked feature
                    // when new features are loaded clear our current guides and feature groups
                    // then load the current features into the guides and feature group
                    fieldEventLayer.on('load', function() {
                        // wipe the current layers available for deltion and clear the current guide layers.
                        drawnFieldEvents.clearLayers();
                        // for each feature push the layer representing that feature into the guides and deletion group
                        fieldEventLayer.eachFeature(function(layer) {
                            drawnFieldEvents.addLayer(layer);
                        });
                    });

                    $("#submitDataFieldEvent").click(function() {
                        stopEditingFieldEvent();
                        $("#addFieldActivities").modal('hide');
                    });

                });
            });


            //////////////////////////////////////////////////////////////////////

            var locateControl = L.control.locate({
                position: "bottomright",
                drawCircle: true,
                follow: true,
                setView: true,
                keepCurrentZoomLevel: true,
                markerStyle: {
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.8
                },
                circleStyle: {
                    weight: 1,
                    clickable: false
                },
                icon: "fa fa-location-arrow",
                metric: false,
                strings: {
                    title: "My location",
                    popup: "You are within {distance} {unit} from this point",
                    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
                },
                locateOptions: {
                    minZoom: 14,
                    maxZoom: 20,
                    watch: true,
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 10000
                }
            }).addTo(map);
            /* Larger screens get expanded layer control and visible sidebar */
            var isCollapsed;
            if (document.body.clientWidth <= 767) {
                isCollapsed = true;
            } else {
                isCollapsed = false;
            }

        });



        //  Prevent hitting enter from refreshing the page
        // $("#searchbox").keypress(function(e) {
        //     if (e.which == 13) {
        //         e.preventDefault();
        //     }
        // });

        $("#featureModal").on("hidden.bs.modal", function(e) {
            $(document).on("mouseout", ".feature-row", clearHighlight);
        });

        /* Typeahead search functionality */
        // $(document).one("ajaxStop", function() {
        //     $("#loading").hide();
        //     sizeLayerControl();
        //     /* Fit map to boroughs bounds */
        //     map.fitBounds(boroughs.getBounds());
        //     featureList = new List("features", {
        //         valueNames: ["feature-name"]
        //     });
        //     featureList.sort("feature-name", {
        //         order: "asc"
        //     });

        //     var farmsBH = new Bloodhound({
        //         name: "Farms",
        //         datumTokenizer: function(d) {
        //             return Bloodhound.tokenizers.whitespace(d.name);
        //         },
        //         queryTokenizer: Bloodhound.tokenizers.whitespace,
        //         local: farmsSearch,
        //         limit: 10
        //     });
        //     var parcelBH = new Bloodhound({
        //         name: "Parcels",
        //         datumTokenizer: function(d) {
        //             return Bloodhound.tokenizers.whitespace(d.name);
        //         },
        //         queryTokenizer: Bloodhound.tokenizers.whitespace,
        //         local: parcelSearch,
        //         limit: 10
        //     });

        //     var fieldsBH = new Bloodhound({
        //         name: "Fields",
        //         datumTokenizer: function(d) {
        //             return Bloodhound.tokenizers.whitespace(d.name);
        //         },
        //         queryTokenizer: Bloodhound.tokenizers.whitespace,
        //         local: fieldsSearch,
        //         limit: 10
        //     });

        //     var activitiesBH = new Bloodhound({
        //         name: "Activities",
        //         datumTokenizer: function(d) {
        //             return Bloodhound.tokenizers.whitespace(d.name);
        //         },
        //         queryTokenizer: Bloodhound.tokenizers.whitespace,
        //         local: activitiesSearch,
        //         limit: 10
        //     });

        //     var geonamesBH = new Bloodhound({
        //         name: "GeoNames",
        //         datumTokenizer: function(d) {
        //             return Bloodhound.tokenizers.whitespace(d.name);
        //         },
        //         queryTokenizer: Bloodhound.tokenizers.whitespace,
        //         remote: {
        //             url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
        //             filter: function(data) {
        //                 return $.map(data.geonames, function(result) {
        //                     return {
        //                         name: result.name + ", " + result.adminCode1,
        //                         lat: result.lat,
        //                         lng: result.lng,
        //                         source: "GeoNames"
        //                     };
        //                 });
        //             },
        //             ajax: {
        //                 beforeSend: function(jqXhr, settings) {
        //                     settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
        //                     $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        //                 },
        //                 complete: function(jqXHR, status) {
        //                     $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        //                 }
        //             }
        //         },
        //         limit: 10
        //     });
        //     activitiesBH.initialize();
        //     farmsBH.initialize();
        //     parcelBH.initialize();
        //     fieldsBH.initialize();
        //     geonamesBH.initialize();


        //     /* Highlight search box text on click */
        //     $("#searchbox").click(function() {
        //         $(this).select();
        //     });





        //     /* instantiate the typeahead UI */
        //     $("#searchbox").typeahead({
        //         minLength: 3,
        //         highlight: true,
        //         hint: false
        //     },
        //     {
        //         name: "Farms",
        //         displayKey: "name",
        //         source: farmsBH.ttAdapter(),
        //         templates: {
        //             header: "<h4 class='typeahead-header'>Activities</h4>"
        //         }
        //     },
        //     {
        //         name: "Fields",
        //         displayKey: "name",
        //         source: fieldsBH.ttAdapter(),
        //         templates: {
        //             header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
        //             suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        //         }
        //     },
        //     {
        //         name: "Parcels",
        //         displayKey: "ARN",
        //         source: parcelBH.ttAdapter(),
        //         templates: {
        //             header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
        //             suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        //         }
        //     },
        //     {
        //         name: "Activities",
        //         displayKey: "name",
        //         source: activitiesBH.ttAdapter(),
        //         templates: {
        //             header: "<h4 class='typeahead-header'>class='fa  fa-pagelines'<img src='fa fa-pagelines' width='24' height='28'>&nbsp;Fields</h4>",
        //             suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        //         }
        //     },
        //     {
        //         name: "GeoNames",
        //         displayKey: "name",
        //         source: geonamesBH.ttAdapter(),
        //         templates: {
        //             header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
        //         }
        //     }).on("typeahead:selected", function(obj, datum) {
        //         if (datum.source === "farmLayer") {
        //             map.fitBounds(datum.bounds);
        //         }
        //         if (datum.source === "Farm") {
        //             if (!map.hasLayer(farmLayer)) {
        //                 map.addLayer(farmLayer);
        //             }
        //             map.setView([datum.lat, datum.lng], 17);
        //             if (map._layers[datum.id]) {
        //                 map._layers[datum.id].fire("click");
        //             }
        //         }
        //         if (datum.source === "Fields") {
        //             if (!map.hasLayer(fieldLayer)) {
        //                 map.addLayer(fieldLayer);
        //             }
        //             map.setView([datum.lat, datum.lng], 17);
        //             if (map._layers[datum.id]) {
        //                 map._layers[datum.id].fire("click");
        //             }
        //         }
        //         if (datum.source === "Parcels") {
        //             if (!map.hasLayer(parcelLayer)) {
        //                 map.addLayer(parcelLayer);
        //             }
        //             map.setView([datum.lat, datum.lng], 17);
        //             if (map._layers[datum.id]) {
        //                 map._layers[datum.id].fire("click");
        //             }
        //         }
        //         if (datum.source === "GeoNames") {
        //             map.setView([datum.lat, datum.lng], 14);
        //         }
        //         if ($(".navbar-collapse").height() > 50) {
        //             $(".navbar-collapse").collapse("hide");
        //         }
        //     }).on("typeahead:opened", function() {
        //         $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
        //         $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
        //     }).on("typeahead:closed", function() {
        //         $(".navbar-collapse.in").css("max-height", "");
        //         $(".navbar-collapse.in").css("height", "");
        //     });
        //     $(".twitter-typeahead").css("position", "static");
        //     $(".twitter-typeahead").css("display", "block");


        // });

        var listItem = $('#setupDropdown > li');

        $(listItem).click(function() {
            $(listItem).removeClass('js-is-active');
            $(this).toggleClass('js-is-active');

        });

        $('#step1d').click(function() {
            stepNum = 4;
            switchStep();
        });

        $('#step2d').click(function() {
            stepNum = 1;
            switchStep();
        });

        $('#step3d').click(function() {
            stepNum = 2;
            switchStep();
        });

        $('#step4d').click(function() {
            stepNum = 2;
            alert("User setups page isn't available yet. Please email ***** to have any changes done to your account.");
            // switchStep()
        });



        // function getEventTarget(e) {
        //     e = e || window.event;
        //     return e.target || e.srcElement;
        // }


        // var ul = document.getElementById('setupDropdown');
        // ul.onclick = function(event) {
        //     var target = getEventTarget(event);
        //     console.log(target.innerHTML);
        // };

    });
});
