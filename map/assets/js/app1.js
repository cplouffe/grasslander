$(window).load(function() {

    var map,
        featureList,
        layers = [],
        farmsSearch = [],
        fieldsSearch = [],
        activitiesSearch = [],
        parcelSearch = [],
        curFeature,
        // variable to track the layer being edited
        currentlyEditing = false,
        currentlyDeleting = false,
        // create a feature group for Leaflet Draw to hook into for delete functionality
        // track if we should disable custom editing as a result of other actions (create/delete)
        disableEditing = false,
        parcelLayer,
        farmLayer,
        fieldLayer,
        birdLayer,
        fieldEventLayer,
        username,
        birdEdit,
        fieldEventEdit,
        farmCheck = false,
        fieldCheck = false,
        activitCheck = false,
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
        $('#birdActivityDate').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true

        });
    });
    $(function() {
        $('#fieldActivityDate').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true

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
        "Imagery": imagery //,
    };

    /* Overlay Layers */
    https: //www.grasslander.org:6443/arcgis/rest/services/Grasslandbase/MapServer
    var aafc_inventory = L.tileLayer.wms('http://www.agr.gc.ca/atlas/services/imageservices/aafc_crop_inventory_2014_30m/ImageServer/WMSServer?', {
        layers: '0',
        attribution: 'AAFC Annual Crop Inventory 2014'
    });
    var studyArea = L.esri.featureLayer({
        url: 'https://www.grasslander.org:6443/arcgis/rest/services/Grasslandbase/MapServer/4'

    });
    var nhic_bobo = L.esri.featureLayer({
        url: 'https://www.grasslander.org:6443/arcgis/rest/services/Grasslandbase/MapServer/3'

    });
    var nhic_lark = L.esri.featureLayer({
        url: 'https://www.grasslander.org:6443/arcgis/rest/services/Grasslandbase/MapServer/2'

    });
    var ebird_bobo = L.esri.featureLayer({
        url: 'https://www.grasslander.org:6443/arcgis/rest/services/Grasslandbase/MapServer/1'

    });
    var ebird_lark = L.esri.featureLayer({
        url: 'https://www.grasslander.org:6443/arcgis/rest/services/Grasslandbase/MapServer/0'
    });

    var gLayers = {
        "NHIC BoboLink": nhic_bobo,
        "NHIC Meadowlark": nhic_lark,
        "eBird BoboLink": ebird_bobo,
        "eBird Meadowlark": ebird_lark,
        "Study Area": studyArea,
        "AAFC Crop Inventory 2014": aafc_inventory
    };


    // ebird_bobo.bindPopup(function(error, featureCollection) {
    //     if (error || featureCollection.features.length === 0) {
    //         return false;
    //     } else {
    //         return '<p>Bird Name: ' + featureCollection.features[0].properties.common_nam + "</p><p>Date Seen: " + featureCollection.features[0].properties.time_obser;
    //     }
    // });

    // ebird_lark.bindPopup(function(error, featureCollection) {
    //     if (error || featureCollection.features.length === 0) {
    //         return false;
    //     } else {
    //         return '<p>Bird Name: ' + featureCollection.features[0].properties.common_nam + "</p><p>Date Seen: " + featureCollection.features[0].properties.time_obser;
    //     }
    // });

    // ebird_lark.bindPopup(function(error, featureCollection) {
    //     if (error || featureCollection.features.length === 0) {
    //         return false;
    //     } else {
    //         return '<p>Bird Name: ' + featureCollection.features[0].properties.commonname + "</p><p>Date Seen: " + featureCollection.features[0].properties.last_obs;
    //     }
    // });
    // nhic_bobo.bindPopup(function(error, featureCollection) {
    //     if (error || featureCollection.features.length === 0) {
    //         return false;
    //     } else {
    //         return '<p>Bird Name: ' + featureCollection.features[0].properties.commonname + "</p><p>Date Seen: " + featureCollection.features[0].properties.last_obs;
    //     }
    // });


    function isMarkerInsidePolygon(marker, poly) {
        var polyPoints = poly.getLatLngs();
        var x = marker.getLatLng().lat,
            y = marker.getLatLng().lng;

        var inside = false;
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat,
                yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat,
                yj = polyPoints[j].lng;

            var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };

    var options = {
        // Show a checkbox next to non-exclusive group labels for toggling all
        groupCheckboxes: true
    };

    map = L.map("map", {
        zoom: 7,
        center: [43.5448, -80.2482],
        zoomControl: false,
        layers: [topo],
        // Needed to turn attribution control on for Geocod
        attributionControl: true
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Initialize Geocoder
    studyArea.addTo(map);


    initGeocoder();

    L.control.layers(baseMaps, gLayers).addTo(map);


    var bobolinkIcon = L.icon({
        iconUrl: 'http://vignette4.wikia.nocookie.net/farmville/images/9/93/Bobolink-icon.png/revision/latest?cb=20120719223918',
        iconSize: [35, 35],
        iconAnchor: [0, 0],
    });

    var fieldEventIcon = L.icon({
        iconUrl: 'https://www.wpclipart.com/working/agricultural/machines/combine_harvester.svg',
        iconSize: [45, 45],
        iconAnchor: [0, 0],
    });

    function initGeocoder() {

        // Specify provider
        var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider(),
            // Create the geocoding control and add it to the map
            searchControl = L.esri.Geocoding.geosearch({
                providers: [arcgisOnline],
                // Don't limit search based on zoom level
                useMapBounds: false,
                expanded: true,
                collapseAfterResult: false
            });
        // Add geocoderControl to navbar instead of map
        searchControl._map = map;

        var geocoderDiv = searchControl.onAdd(map);
        // Add to div in Navbar
        $('.form-group.has-feedback')[0].appendChild(geocoderDiv);

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

    // Handle feature creation for all layers

    function handleFeatureCreation(layer) {
        switch (layer) {


            case farmLayer:
                curFeature.properties.farm_comments = $('#farmComments').val();
                curFeature.properties.lot = $('#lotNumber').val();
                curFeature.properties.con = $('#conNumber').val();
                curFeature.properties.farm_type = $('#farmType').val();
                break;
            case fieldLayer:
                curFeature.properties.field_type = $('#fieldStatusSelect').val();
                curFeature.properties.field_status = $('#fieldTypeSelect').val();
                curFeature.properties.field_comments = $('#fieldComments').val();
                // Haven't handled field_id yet
                break;
            case birdLayer:
                console.log('line');

                curFeature.properties.username = username;
                curFeature.properties.comments = $('#birdComments').val();
                curFeature.properties.date = $('#birdActivityDate').val();
                // Need to spell this correctly in feature class...
                curFeature.properties.observiation_type = $('#birdObservationType').val();
                curFeature.properties.bird_type = $('#birdType').val();
                curFeature.properties.bird_activity = $('#birdActivity').val();
                break;
            case fieldEventLayer:

                curFeature.properties.username = username;
                curFeature.properties.comments = $('#fieldActivityComments').val();
                curFeature.properties.fdate = $('#fieldActivityDate').val();
                // Need to spell this correctly in feature class...
                curFeature.properties.activity = $('#fieldActivitySelect').val();


                break;
        }

        // Add new feature to layer
        console.log(curFeature);
        layer.addFeature(curFeature);
        curFeature = undefined;


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
                    message: '<strong>You have drawn an invalid polygon. Please redraw your field.</strong>' // message that will show when intersect
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
            marker: {
                icon: bobolinkIcon
            }, // disable polylines
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
            marker: {
                icon: fieldEventIcon
            },
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
        username = $('#username').val();
        var password = $('#password').val();
        // console.log(username);
        // console.log(password);

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

        // Configure authentication for a given layer

        function makeRequest(layer) {

            L.esri.request(layer.options.url, {
                where: '1=1'
            }, function(error, response) {
                console.log(1);
            });

        }

        // Show the editing modal for a given layer

        function showEditorModal(layer) {
            console.log('kk');
            switch (layer) {
                case farmLayer:
                    $("#addFarmAttributes").modal('show');
                    // submitDataFarm button for submit
                    break;
                case fieldLayer:
                    $("#addFieldAttributes").modal('show');
                    // submitDataField button for submit
                    break;
                case birdLayer:
                    $("#addBirdActivities").modal('show');
                    console.log('line');

                    // submitDataBird button for submit
                    break;
                case fieldEventLayer:
                    $("#addFieldActivities").modal('show');
                    console.log('line');

                    // submitDataBird button for submit
                    break;
            }

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
            farmLayer = L.esri.featureLayer({
                url: servicesUrl + '/Farms/FeatureServer/0',
                opacity: 1,
                style: farmStyle,
                token: response.token,
                onEachFeature: function(feature, layer) {
                    if (!farmCheck) farmCheck = true;
                    layer.options.fillColor = '#0000FF';
                    if (feature.properties) {
                        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.farm_id + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";

                    }
                }
            });
            layers.push(farmLayer);

            // grab fieldLayer polygons
            fieldLayer = L.esri.featureLayer({
                url: servicesUrl + '/Field/FeatureServer/0',
                opacity: 1,
                style: fieldStyle,
                token: response.token,
                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.type + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";

                    }
                }

            });
            layers.push(fieldLayer);

            // grab birdLayer points
            birdLayer = L.esri.featureLayer({
                url: servicesUrl + '/bird_observations/FeatureServer/0',
                token: response.token,
                pointToLayer: function(geojson, latlng) {
                    return L.marker(latlng, {
                        icon: bobolinkIcon
                    });
                },
            });
            layers.push(birdLayer);

            // grab fieldEventLayer points
            fieldEventLayer = L.esri.featureLayer({
                url: servicesUrl + '/field_events/FeatureServer/0',
                token: response.token,

                pointToLayer: function(geojson, latlng) {
                    return L.marker(latlng, {
                        icon: fieldEventIcon
                    });
                },




                fieldEventIcon
            });
            layers.push(fieldEventLayer);

            // Parcel layer
            // var parcelLayer = L.esri.dynamicMapLayer({
            parcelLayer = L.esri.featureLayer({
                // url: servicesUrl + '/Parcels/MapServer/0',
                url: servicesUrl + '/Parcels/FeatureServer/0',
                token: response.token,
                simplifyFactor: 1,
                cacheLayers: true,
                style: parcelStyle,
                maxZoom: 20,
                minZoom: 13
            });
            layers.push(parcelLayer);

            // Authenticate all layers used in app
            layers.forEach(configureAuth);
            // layers.forEach(makeRequest);



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

                sidebarClick(parseInt($(this).attr("id"), 10));

            });

            // Query features that need to populate the sidebar when map is panned/moved
            map.on("moveend", function(e) {
                syncSidebar();
            });

            // when we start using creation tools disable our custom editing
            map.on('draw:createstart', function() {
                disableEditing = true;
                console.log('line');

            });

            // when we start using deletion tools, hide attributes and disable custom editing
            map.on('draw:deletestart', function() {
                disableEditing = true;
                currentlyDeleting = true;
            });

            // listen to the draw created event
            map.on('draw:created', function(e) {
                // add the feature as GeoJSON (feature will be converted to ArcGIS JSON internally)
                // map.fireEvent('dataload', event);
                console.log('line');

                //var curLayer;
                // Set current feature
                curFeature = e.layer.toGeoJSON();
                // if (!currentlyEditing) currentlyEditing = e.layer;
                switch (stepNum) {
                    // Farms
                    case 1:
                        // console.log(curFeature);
                        curLayer = farmLayer;
                        // farmLayer.addFeature(curFeature);
                        // disableEditing = false;
                        // $("#addFarmAttributes").modal('show');
                        break;
                        // Fields
                    case 2:
                        curLayer = fieldLayer;
                        // fieldLayer.addFeature(curFeature);
                        // disableEditing = false;
                        // $("#addFieldAttributes").modal('show');
                        break;
                        // Birds
                    case 3:
                        console.log('line');


                        curLayer = birdLayer;
                        // disableEditing = false;
                        break;

                    case 4:
                        console.log('line');

                        curLayer = fieldEventLayer;
                        // disableEditing = false;
                        break;
                }

                console.log('line');

                showEditorModal(curLayer);
                //map.fireEvent('load', event);
                disableEditing = false;

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

                    console.log('line');

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

                } else if (stepNum == 4) {
                    console.log('line');

                    e.layers.eachLayer(function(layer) {
                        var id = layer.feature.id;
                        delArray.push(id);
                    });
                    fieldEventLayer.deleteFeatures(delArray, function(error, response) {
                        if (error) {
                            console.log(error, response);
                        }
                    });
                    disableEditing = false;
                    currentlyDeleting = false;
                }




            });


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
                map.removeControl(drawnFieldEvenControl);

                map.removeLayer(birdLayer);
                map.removeLayer(fieldEventLayer);
                map.removeLayer(drawnFieldEvents);
                map.removeLayer(drawnFarms);
                map.removeLayer(studyArea);
                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                // map.removeLayer(farmLayer);
                map.removeLayer(fieldLayer);
                // add our drawing controls to the map
                map.addControl(drawFarmControl);

                parcelLayer.addTo(map);
                farmLayer.addTo(map);
                map.addLayer(drawnFarms);
                $("#full-extent-btn").click(function() {
                    var bounds = L.latLngBounds([]);
                    var c = 0;
                    farmLayer.eachFeature(function(layer) {
                        if (layer) {
                            c += 1;
                            var layerBounds = layer.getBounds();
                            // extend the bounds of the collection to fit the bounds of the new feature
                            bounds.extend(layerBounds);
                        }

                    });
                    if (c > 0) {
                        console.log(bounds);

                        map.fitBounds(bounds);
                    }

                    $(".navbar-collapse.in").collapse("hide");
                    return false;
                });



                document.getElementById("full-extent-btn").click();

                $("#farmsetupinstructions").modal("show");

                // start editing a given layer
                function startEditingFarm(layer) {

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
                        // if not editing, add new feature
                    } else {
                        handleFeatureCreation(farmLayer);
                    }

                    currentlyEditing = undefined;
                }

                function handleFarmEdit(layer) {
                    // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                    // alert($('#exampleTextarea').val())
                    console.log(curFeature);
                    layer.feature.properties.farm_comments = $('#farmComments').val();
                    layer.feature.properties.lot = $('#lotNumber').val();
                    layer.feature.properties.con = $('#conNumber').val();
                    layer.feature.properties.farm_type = $('#farmType').val();
                    farmLayer.updateFeature({
                        type: 'Feature',
                        id: layer.feature.id,
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
                }

                // when new features are loaded clear our current guides and feature groups
                // then load the current features into the guides and feature group
                farmLayer.on('load', function() {

                    // wipe the current layers available for deltion and clear the current guide layers.
                    drawnFarms.clearLayers();
                    // for each feature push the layer representing that feature into the guides and deletion group
                    farmLayer.eachFeature(function(layer) {
                        if (layer) {


                            drawnFarms.addLayer(layer);
                            // extend the bounds of the collection to fit the bounds of the new feature

                        }

                    });
                    // once we've looped through all the features, zoom the map to the extent of the collection


                });



                parcelLayer.on('click', function(e) {
                    curFeature = e.layer.toGeoJSON();
                    if (currentlyDeleting) {

                    } else {
                        //drawnFarms.addLayer(e.layer);
                        //curFeature.properties.roll = e.layer.feature.properties.arn;
                        //console.log(curFeature);
                        farmLayer.addFeature(curFeature);
                        $("#addFarmAttributes").modal('show');
                        startEditingFarm(e.layer);

                        // $('#rollNumber').val(e.layer.feature.properties.roll);
                        $('#conNumber').val(e.layer.feature.properties.con);
                        $('#lotNumber').val(e.layer.feature.properties.lot);
                        $('#farmType').val(e.layer.feature.properties.farm_type);
                        $('#farmComments').val(e.layer.feature.properties.farm_comments);
                        map.removeLayer(e.layer);
                        displayAttributes(e.layer);
                    }

                });
                // Handle farm edits

                $("#submitDataFarm").click(function() {
                    stopEditingFarm();
                    $("#addFarmAttributes").modal('hide');
                    $("#proceed-modal").modal('show');
                });

            });

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $("#step2").click(function() {
                $("#full-extent-btn").click(function() {
                    var bounds = L.latLngBounds([]);
                    var c = 0;
                    farmLayer.eachFeature(function(layer) {
                        if (layer) {
                            c += 1;
                            var layerBounds = layer.getBounds();
                            // extend the bounds of the collection to fit the bounds of the new feature
                            bounds.extend(layerBounds);
                        }

                    });
                    if (c > 0) {
                        console.log(bounds);

                        map.fitBounds(bounds);
                    }

                    $(".navbar-collapse.in").collapse("hide");
                    return false;
                });

                document.getElementById("full-extent-btn").click();




                $("#step-modal").modal("hide");
                stepNum = 2;
                map.removeControl(drawFarmControl);
                map.removeControl(drawFieldControl);
                map.removeControl(drawBirdControl);
                map.removeControl(drawnFieldEvenControl);
                map.removeLayer(studyArea);
                map.removeLayer(parcelLayer);
                map.removeLayer(fieldLayer);
                map.removeLayer(farmLayer);
                map.removeLayer(birdLayer);
                map.removeLayer(fieldEventLayer);
                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                map.removeLayer(drawnFarms);
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
                    } else {
                        handleFeatureCreation(fieldLayer);
                    }
                    currentlyEditing = undefined;
                }

                function handleFieldEdit(layer) {

                    layer.feature.properties.field_id = layer.feature.id;
                    layer.feature.properties.field_type = $('#fieldStatusSelect').val();
                    layer.feature.properties.field_status = $('#fieldTypeSelect').val();
                    layer.feature.properties.field_comments = $('#fieldComments').val();
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
                farmLayer.addTo(map);



                birdLayer.bindPopup(function(evt) {
                    return L.Util.template('<p>Created By: {created_user}<br>Observed On: ' + new Date(evt.feature.properties.date) + '<br> Observation Type:{observiation_type}<br> Bird Activity: {bird_activity}<br> Comments:{comments}</p>', evt.feature.properties);
                });


                fieldEventLayer.bindPopup(function(evt) {
                    return L.Util.template('<p>Created By: {created_user}<br>Done On: ' + new Date(evt.feature.properties.fdate) + '<br> Activity Type:{activity}<br> Comments:{comments}</p>', evt.feature.properties);
                });

                // ebird_bobo.bindPopup(function (evt) {
                //   return L.Util.template('<p>{COMMON_NAM}<br>{SCIENTIFIC}<br>{NOTES}</p>', evt.feature.properties);
                // });
                document.getElementById("full-extent-btn").click();
                $("#addActivitySelect").modal("show");

            });


            $("#startBirdActivity").click(function() {

                birdLayer.bindPopup(function(evt) {
                    return L.Util.template('<p>Created By: {created_user}<br>Observed On: ' + new Date(evt.feature.properties.date) + '<br> Observation Type:{observiation_type}<br> Bird Activity: {bird_activity}<br> Comments:{comments}</p>', evt.feature.properties);
                });


                fieldEventLayer.bindPopup(function(evt) {

                    return L.Util.template('<p>Created By: {created_user}<br>Done On: ' + new Date(evt.feature.properties.fdate) + '<br> Activity Type:{activity}<br> Comments:{comments}</p>', evt.feature.properties);
                });

                $("#step-modal").modal("hide");
                stepNum = 3;
                map.removeControl(drawFarmControl);
                map.removeControl(drawFieldControl);
                map.removeControl(drawBirdControl);
                map.removeControl(drawnFieldEvenControl);
                map.removeLayer(studyArea);
                map.removeLayer(parcelLayer);
                map.removeLayer(fieldLayer);
                map.removeLayer(farmLayer);
                map.removeLayer(birdLayer);
                map.removeLayer(fieldEventLayer);
                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                map.removeLayer(drawnFarms);
                // add our drawing controls to the map
                map.addControl(drawBirdControl);
                farmLayer.addTo(map);
                fieldLayer.addTo(map);
                birdLayer.addTo(map);
                fieldEventLayer.addTo(map);
                map.addLayer(drawnBirds);


                $("#full-extent-btn").click(function() {
                    var bounds = L.latLngBounds([]);
                    var c = 0;
                    farmLayer.eachFeature(function(layer) {
                        if (layer) {
                            c += 1;
                            var layerBounds = layer.getBounds();
                            // extend the bounds of the collection to fit the bounds of the new feature
                            bounds.extend(layerBounds);
                        }

                    });
                    if (c > 0) {
                        console.log(bounds);

                        map.fitBounds(bounds);
                    }

                    $(".navbar-collapse.in").collapse("hide");
                    return false;
                });

                $("#full-extent-btn").click();







                var currentlyEditing = false;
                var currentlyDeleting = false;
                // create a feature group for Leaflet Draw to hook into for delete functionality
                // track if we should disable custom editing as a result of other actions (create/delete)
                var disableEditing = false;
                // start editing a given layer
                function startEditingBirds(layer) {
                    console.log('line');

                    if (!disableEditing) {
                        layer.editing.enable();
                        currentlyEditing = layer;
                    }
                }
                // stop editing a given layer
                function stopEditingBirds() {
                    // if a layer is being edited, finish up and disable editing on it afterward.
                    if (currentlyEditing) {
                        console.log('line');

                        handleBirdsEdit(currentlyEditing);
                        currentlyEditing.editing.disable();
                    } else {
                        console.log('line');

                        handleFeatureCreation(birdLayer);
                    }
                    currentlyEditing = undefined;
                }

                function handleBirdsEdit(layer) {
                    console.log('line');

                    layer.feature.properties.field_id = layer.feature.id;
                    layer.feature.properties.field_type = $('#fieldStatusSelect').val();
                    layer.feature.properties.field_status = $('#fieldTypeSelect').val();
                    layer.feature.properties.field_comments = $('#fieldComments').val();
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

                // when new features are loaded clear our current guides and feature groups
                // then load the current features into the guides and feature group
                birdLayer.on('load', function() {
                    console.log('line');

                    // wipe the current layers available for deltion and clear the current guide layers.
                    drawnBirds.clearLayers();
                    // for each feature push the layer representing that feature into the guides and deletion group
                    birdLayer.eachFeature(function(layer) {
                        drawnBirds.addLayer(layer);
                    });
                });


                $("#submitDataBird").click(function() {
                    handleFeatureCreation(birdLayer);
                    //stopEditingBirds();
                    console.log('line');

                    $("#addBirdActivities").modal('hide');
                    $("#step3").click();
                });


            });
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            $("#startFieldActivity").click(function() {
                birdLayer.bindPopup(function(evt) {
                    return L.Util.template('<p>Created By: {created_user}<br>Observed On: {created_date}<br> Observation Type:{observiation_type}<br> Bird Activity: {bird_activity}<br> Comments:{comments}</p>', evt.feature.properties);
                });


                fieldEventLayer.bindPopup(function(evt) {
                    return L.Util.template('<p>Created By: {created_user}<br>Done On: {created_date}<br> Activity Type:{activity}<br> Comments:{comments}</p>', evt.feature.properties);
                });

                $("#step-modal").modal("hide");
                stepNum = 4;
                map.removeControl(drawFarmControl);
                map.removeControl(drawFieldControl);
                map.removeControl(drawBirdControl);
                map.removeControl(drawnFieldEvenControl);
                map.removeLayer(studyArea);
                map.removeLayer(parcelLayer);
                map.removeLayer(fieldLayer);
                map.removeLayer(farmLayer);
                map.removeLayer(birdLayer);
                map.removeLayer(fieldEventLayer);
                map.removeLayer(drawnBirds);
                map.removeLayer(drawnFields);
                map.removeLayer(drawnFarms);
                // add our drawing controls to the map
                map.addControl(drawnFieldEvenControl);
                farmLayer.addTo(map);
                fieldLayer.addTo(map);
                birdLayer.addTo(map);
                fieldEventLayer.addTo(map);
                map.addLayer(drawnFieldEvents);


                $("#full-extent-btn").click(function() {
                    var bounds = L.latLngBounds([]);
                    var c = 0;
                    farmLayer.eachFeature(function(layer) {
                        if (layer) {
                            c += 1;
                            var layerBounds = layer.getBounds();
                            // extend the bounds of the collection to fit the bounds of the new feature
                            bounds.extend(layerBounds);
                        }

                    });
                    console.log(bounds);
                    if (c > 0) {


                        map.fitBounds(bounds);
                    }

                    $(".navbar-collapse.in").collapse("hide");
                    return false;
                });

                $("#full-extent-btn").click();






                var currentlyEditing = false;
                var currentlyDeleting = false;
                // create a feature group for Leaflet Draw to hook into for delete functionality
                // track if we should disable custom editing as a result of other actions (create/delete)
                var disableEditing = false;
                // start editing a given layer
                function startEditingFieldEvent(layer) {
                    console.log('line');
                    if (!disableEditing) {
                        console.log('line');

                        layer.editing.enable();
                        currentlyEditing = layer;
                    }
                }
                // stop editing a given layer
                function stopEditingFieldEvent() {
                    // if a layer is being edited, finish up and disable editing on it afterward.
                    if (currentlyEditing) {
                        console.log('line');

                        handleFieldEventEdit(currentlyEditing);
                        currentlyEditing.editing.disable();
                    } else {
                        console.log('line');

                        handleFeatureCreation(birdLayer);
                    }
                    currentlyEditing = undefined;
                }

                function handleFieldEventEdit(layer) {
                    console.log('line');

                    layer.feature.properties.field_id = layer.feature.id;
                    curFeature.properties.username = username;
                    curFeature.properties.comments = $('#fieldActivityComments').val();
                    curFeature.properties.fdate = $('#fieldActivityDate').val();
                    // Need to spell this correctly in feature class...
                    curFeature.properties.activity = $('#fieldActivitySelect').val();
                    fieldEventLayer.updateFeature({
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
                fieldEventLayer.on('load', function() {
                    console.log('line');

                    // wipe the current layers available for deltion and clear the current guide layers.
                    drawnFieldEvents.clearLayers();
                    // for each feature push the layer representing that feature into the guides and deletion group
                    fieldEventLayer.eachFeature(function(layer) {
                        drawnFieldEvents.addLayer(layer);
                    });
                });


                $("#submitDataFieldActivity").click(function() {
                    handleFeatureCreation(fieldEventLayer); //stopEditingFieldEvent();

                    $("#addFieldActivities").modal('hide');
                    $("#step3").click();
                });


            });





$('#startBirdActivity1').click(function() {
         document.getElementById('startBirdActivity').click();
        });

$('#startFieldActivity2').click(function() {

         document.getElementById('startFieldActivity').click();
        });





            function syncSidebar() {
                /* Empty sidebar features */
                $("#feature-list tbody").empty();
                /* Loop through theaters layer and add only features which are in the map bounds */
                // fieldLayer.eachFeature(function(layer) {
                //     if (map.hasLayer(fieldLayer)) {
                //         if (map.getBounds().contains(layer.getBounds())) {
                //             $("#feature-list tbody").append('<tr class="feature-row" title="fieldLayer" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.type + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                //         }
                //     }
                // });
                birdLayer.eachFeature(function(layer) {

                    if (map.hasLayer(layer)) {
                        if (layer) {
                            // if (map.getBounds().contains(layer)) {
                                $("#feature-list tbody").append('<tr class="feature-row" title="birdLayer" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/bobolink.png"></td><td class="feature-name">Bird Observation: ' + new Date(layer.feature.properties.date) + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                            // }
                        }
                    }
                });
                fieldEventLayer.eachFeature(function(layer) {

                    if (map.hasLayer(layer)) {
                        if (layer) {
                            // if (map.getBounds().contains(layer)) {
                                $("#feature-list tbody").append('<tr class="feature-row" title="fieldevents" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/combine_harvester.svg"></td><td class="feature-name"> Field Activity: ' + new Date(layer.feature.properties.fdate) + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                            // }
                        }

                    }
                });

                featureList = new List("features", {
                    valueNames: ["feature-name"]
                });
                featureList.sort("feature-name", {
                    order: "asc"
                });
            }

            //////////////////////////////////////////////////////////////////////

            // var locateControl = L.control.locate({
            //     position: "bottomleft",
            //     drawCircle: true,
            //     follow: true,
            //     setView: true,
            //     keepCurrentZoomLevel: true,
            //     markerStyle: {
            //         weight: 1,
            //         opacity: 0.8,
            //         fillOpacity: 0.8
            //     },
            //     circleStyle: {
            //         weight: 1,
            //         clickable: false
            //     },
            //     icon: "fa fa-location-arrow",
            //     metric: false,
            //     strings: {
            //         title: "My location",
            //         popup: "You are within {distance} {unit} from this point",
            //         outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
            //     },
            //     locateOptions: {
            //         minZoom: 14,
            //         maxZoom: 20,
            //         watch: true,
            //         enableHighAccuracy: true,
            //         maximumAge: 10000,
            //         timeout: 10000
            //     }
            // }).addTo(map);
            // /* Larger screens get expanded layer control and visible sidebar */
            // var isCollapsed;
            // if (document.body.clientWidth <= 767) {
            //     isCollapsed = true;
            // } else {
            //     isCollapsed = false;
            // }

            // Determine which step user should be at on log in

            function setLoginState(username) {

                var where;
                // layers.every(function(layer, i) {
                where = "created_user = '" + username + "'";
                // Check if user already has farms
                farmLayer.query().where(where).run(function(error, fc) {
                    if (fc && fc.features.length > 0) {
                        // Check if user has fields
                        fieldLayer.query().where(where).run(function(error, fc1) {
                            if (fc1 && fc1.features.length > 0) {
                                document.getElementById('step3').click();
                            } else {
                                document.getElementById('step2').click();
                            }
                        });
                    } else {
                        document.getElementById('step1').click();
                    }
                });

            }

            setLoginState(username, layers);


        });


        $("#featureModal").on("hidden.bs.modal", function(e) {
            $(document).on("mouseout", ".feature-row", clearHighlight);
        });

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

    });
});