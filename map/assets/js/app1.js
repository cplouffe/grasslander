  $(window).load(function() {
      $("#login-modal").modal("show");



      $(window).resize(function() {
          sizeLayerControl();
      });


      $(document).on("mouseout", ".feature-row", clearHighlight);



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

      $(document).on("click", ".feature-row", function(e) {
          $(document).off("mouseout", ".feature-row", clearHighlight);
          sidebarClick(parseInt($(this).attr("id"), 10));
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

      $("#full-extent-btn").click(function() {
          map.fitBounds(boroughs.getBounds());
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

      function sidebarClick(id) {
          var layer = markerClusters.getLayer(id);
          map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
          layer.fire("click");
          /* Hide sidebar and go to the map on small screens */
          if (document.body.clientWidth <= 767) {
              $("#sidebar").hide();
              map.invalidateSize();
          }
      }

      function swithcstep() {
          if (stepNum == 1) {
              console.log(stepNum);
              stepNum += 1;
              document.getElementById('step2').click();
          } else if (stepNum == 2) {
              console.log(stepNum);
              stepNum += 1;
          } else if (stepNum == 3) {
              console.log(stepNum);
          }
      }









      // workaround for old ie
      if (!window.location.origin) {
          window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      }
      // closes sidebar
      document.getElementById('list-btn').click();
      /* Basemap Layers */
      var topo = L.esri.basemapLayer("Topographic")
      var streets = L.esri.basemapLayer("Streets")
      var imagery = L.esri.basemapLayer("Imagery")
      var natgeo = L.esri.basemapLayer("NationalGeographic")
      var ssadref = L.esri.basemapLayer("ShadedRelief")
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


      var bobolinkIcon = L.icon({
          iconUrl: 'http://vignette4.wikia.nocookie.net/farmville/images/9/93/Bobolink-icon.png/revision/latest?cb=20120719223918',
          iconSize: [25, 25],
          iconAnchor: [0, 0],

      });

      var map = L.map("map", {
          zoom: 17,
          center: [43.6532, -79.3832],
          zoomControl: false,
          layers: [imagery],
          attributionControl: false
      });
      var parcelMapserver, stepNum;



      L.control.layers(baseMaps).addTo(map);
      var save_progress_button = L.Control.extend({
          options: {
              position: "bottomleft",
              title: "Send Message",
          },
          onAdd: function() {
              var a = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom1");
              return a.style.width = "30px", a.style.height = "30px", a.title = "Move to the next step...",
                  a.onAdd = function() {
                      this._tooltip = this._createTooltip("Next Step")
                  },
                  a.onclick = function() {
                      swithcstep();

                  }, a
          }
      });
      map.addControl(new save_progress_button);


      // create a new Leaflet Draw control
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
              polygon: {
                  allowIntersection: false, // polygons cannot intersect thenselves
                  drawError: {
                      color: 'red', // color the shape will turn when intersects
                      message: '<strong>Oh snap!<strong> you can\'t draw that!' // message that will show when intersect
                  },
              }
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
      var drawBirdSightings = new L.Control.Draw({
          edit: {
              featureGroup: drawnBirds, // allow editing/deleting of features in this group
              edit: false // disable the edit tool (since we are doing editing ourselves)
          },
          draw: {
              circle: false, // disable circles
              marker: {
                  icon: bobolinkIcon
              },
              square: false, // disable polylines
              polyline: false, // disable polylines
              polygon: false
          }

      });




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

      $("#loginbtn").click(function() {
          var parcelMapserver = L.esri.featureLayer({
              url: 'https://www.grasslander.org:6443/arcgis/rest/services/grasslander/Parcels/MapServer/0',
              simplifyFactor: 1,
              cacheLayers: true,
              style: parcelStyle,
              maxZoom: 20,
              minZoom: 15
          });




          username = $('#username').val();
          password = $('#password').val();
          console.log(username);
          console.log(password);

          function serverAuth(callback) {
              L.esri.post('https://www.grasslander.org:6443/arcgis/tokens/generateToken', {
                  username: username,
                  password: password,
                  f: 'json',
                  expiration: 86400,
                  client: 'referer',
                  referer: window.location.origin
              }, callback);
          }

          serverAuth(function(error, response) {
              var fieldLayer = L.esri.featureLayer({
                  url: 'https://www.grasslander.org:6443/arcgis/rest/services/grasslander/Field/FeatureServer/0',
                  opacity: 1,
                  style: fieldStyle,
                  token: response.token
              });

              fieldLayer.on('authenticationrequired', function(e) {
                  serverAuth(function(error, response) {
                      e.authenticate(response.token);
                  });
              });

              serverAuth(function(error, response) {
                  var farmLayer = L.esri.featureLayer({
                      url: 'https://www.grasslander.org:6443/arcgis/rest/services/grasslander/Farms/FeatureServer/0',
                      opacity: 1,
                      style: farmStyle,
                      token: response.token
                  }).addTo(map);

                  farmLayer.on('authenticationrequired', function(e) {
                      serverAuth(function(error, response) {
                          e.authenticate(response.token);
                      });
                  });




                  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                  $("#step-modal").modal("show");

                  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  $("#step1").click(function() {
                      stepNum = 1;
                      $("#step-modal").modal("hide");

                      parcelMapserver.addTo(map);
                      farmLayer.addTo(map);
                      // variable to track the layer being edited
                      var currentlyEditing = false;
                      var currentlyDeleting = false;

                      // create a feature group for Leaflet Draw to hook into for delete functionality

                      map.addLayer(drawnFarms);

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
                              handleEdit(currentlyEditing);
                              currentlyEditing.editing.disable();
                          }
                          currentlyEditing = undefined;
                      }

                      function handleEdit(layer) {
                          // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                          // alert($('#exampleTextarea').val())

                          layer.feature.properties.farm_id = $('#farm_id').val();
                          layer.feature.properties.roll = $('#rollNumber').val();
                          layer.feature.properties.con = $('#conNumber').val();
                          layer.feature.properties.con = $('#lotNumber').val();
                          layer.feature.properties.farm_type = $('#farm_type').val();
                          farmLayer.updateFeature({
                              type: 'Feature',
                              id: layer.feature.farm_id,
                              geometry: layer.toGeoJSON().geometry,
                              properties: layer.feature.properties
                          }, function(error, response) {
                              if (response) {
                                  console.log("response")
                              }
                          });
                      }

                      function displayAttributes(layer) {
                          console.log(layer.feature.properties);

                          // $('#exampleTextarea').val(layer.feature.properties.title);

                      }
                      // when clicked, stop editing the current feature and edit the clicked feature
                      farmLayer.on('click', function(e) {
                          // stopEditing();

                          startEditingFarm(e.layer);
                          if (!currentlyDeleting) {
                              $('#rollNumber').val(e.layer.feature.properties.roll);
                              $('#conNumber').val(e.layer.feature.properties.con);
                              $('#lotNumber').val(e.layer.feature.properties.lot);
                              $('#farm_type').val(e.layer.feature.properties.farm_type);

                              $('#farm_id').val(e.layer.feature.properties.farm_id);


                              $("#addFarmAttributes").modal('show');
                              displayAttributes(e.layer);
                          }
                      });

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

                      parcelMapserver.on('click', function(e) {
                          console.log(e.layer.options.fillColor);
                          switch (e.layer.options.fillColor) {

                              case '#0000FF':
                                  e.layer.setStyle({
                                      fillColor: "#ff7800"
                                  });
                                  e.layer.options.fillColor = '#ff7800';
                                  var id = e.layer.feature.id
                                      // farmLayer.deleteFeature(id);  
                                      // farmLayer.addFeature(e.layer.toGeoJSON());
                                      // e.layer.bringToBack()
                                  break;
                              case "#ff7800":
                                  e.layer.setStyle({
                                      fillColor: "#0000FF"
                                  });
                                  e.layer.options.fillColor = '#0000FF';
                                  var id = e.layer.feature.id
                                      // farmLayer.deleteFeature(id);
                                      // e.layer.bringToBack()
                                  break;
                              case null:
                                  e.layer.setStyle({
                                      fillColor: "#0000FF"
                                  });
                                  e.layer.options.fillColor = '#0000FF';
                                  var id = e.layer.feature.id
                                      // farmLayer.deleteFeature(id);
                                      // e.layer.bringToBack()
                                  break;
                          }
                      });


                      // add our drawing controls to the map
                      map.addControl(drawFarmControl);

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
                          console.log(e.layer.toGeoJSON());


                          farmLayer.addFeature(e.layer.toGeoJSON());

                          disableEditing = false;
                      });


                      // listen to the draw deleted event
                      map.on('draw:deleted', function(e) {

                          var delArray = [];
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
                      });
                      $("#submitDataFarm").click(function() {
                          stopEditingFarm();

                          $("#addFarmAttributes").modal('hide');
                      });


                  });

                  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                  $("#step2").click(function() {
                      parcelMapserver.eachFeature(function(layer) {
                          if (layer.options.fillColor == "#0000FF") {
                              feature = layer.toGeoJSON();
                              feature.properties.farm_id = feature.properties.arn;
                              console.log(feature);
                              farmLayer.addFeature(feature);

                          }
                      });
                      map.removeControl(drawFarmControl);
                      map.removeLayer(parcelMapserver);
                      fieldLayer.addTo(map);

                      map.removeLayer(drawnFarms);
                      var currentlyEditing = false;
                      var currentlyDeleting = false;

                      // create a feature group for Leaflet Draw to hook into for delete functionality

                      map.addLayer(drawnFields);

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
                              handleEdit(currentlyEditing);
                              currentlyEditing.editing.disable();
                          }
                          currentlyEditing = undefined;
                      }

                      function handleEdit(layer) {
                          // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                          // alert($('#exampleTextarea').val())

                          // layer.feature.properties.title = $('#exampleTextarea').val();
                          // layer.feature.properties.daterep = $('#datetimepicker10').val();
                          layer.feature.properties.field_id = layer.feature.id;
                          layer.feature.properties.date =  new Date();
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
                                  console.log("pass")
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

                          startEditingField(e.layer);
                          if (!currentlyDeleting) {
                              // $('#exampleTextarea').val(e.layer.feature.properties.title);
                              $("#addFieldAttributes").modal('show');
                              displayAttributes(e.layer);
                          }
                      });



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


                      // add our drawing controls to the map
                      map.addControl(drawFieldControl);

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
                          console.log(e.layer.toGeoJSON());


                          fieldLayer.addFeature(e.layer.toGeoJSON());

                          disableEditing = false;
                      });


                      // listen to the draw deleted event
                      map.on('draw:deleted', function(e) {

                          var delArray = [];
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
                      });
                      $("#submitDataField").click(function() {
                          stopEditingField();
                          $("#addFieldAttributes").modal('hide');
                      });


                  });



                  // // variable to track the layer being edited
                  // var currentlyEditing = false;
                  // var currentlyDeleting = false;

                  // // create a feature group for Leaflet Draw to hook into for delete functionality
                  // var drawnItems = L.featureGroup();
                  // map.addLayer(drawnItems);

                  // // track if we should disable custom editing as a result of other actions (create/delete)
                  // var disableEditing = false;

                  // // start editing a given layer
                  // function startEditing(layer) {
                  //     $('#exampleTextarea').val = layer.feature.properties.title;
                  //     // read only
                  //     //document.getElementById("exampleInputEmail1").value = layer.feature.properties.TRANPLANID;
                  //     if (!disableEditing) {
                  //         layer.editing.enable();
                  //         currentlyEditing = layer;
                  //     }
                  // }

                  // // stop editing a given layer
                  // function stopEditing() {
                  //     // if a layer is being edited, finish up and disable editing on it afterward.
                  //     if (currentlyEditing) {
                  //         handleEdit(currentlyEditing);
                  //         currentlyEditing.editing.disable();
                  //     }
                  //     currentlyEditing = undefined;
                  // }

                  // function handleEdit(layer) {
                  //     // convert the layer to GeoJSON and build a new updated GeoJSON object for that feature
                  //     // alert($('#exampleTextarea').val())

                  //     layer.feature.properties.title = $('#exampleTextarea').val();
                  //     layer.feature.properties.daterep = $('#datetimepicker10').val();
                  //     // document.getElementById("exampleTextarea").value;
                  //     // console.log(layer.feature.properties.PEDDISTRIC);
                  //     editingLayer.updateFeature({
                  //         type: 'Feature',
                  //         id: layer.feature.id,
                  //         geometry: layer.toGeoJSON().geometry,
                  //         properties: layer.feature.properties
                  //     }, function(error, response) {
                  //         if (response) {
                  //             console.log("pass")
                  //         }
                  //     });
                  // }

                  // function displayAttributes(layer) {
                  //     console.log(layer.feature.properties.title);
                  //     console.log($('#exampleTextarea').val());
                  //     $('#exampleTextarea').val(layer.feature.properties.title);

                  // }


                  // // when a pedestrian district is clicked, stop editing the current feature and edit the clicked feature
                  // editingLayer.on('click', function(e) {
                  //     // stopEditing();

                  //     startEditing(e.layer);
                  //     if (!currentlyDeleting) {
                  //         $('#exampleTextarea').val(e.layer.feature.properties.title);
                  //         $("#addAttributes").modal('show');
                  //         displayAttributes(e.layer);
                  //     }
                  // });

                  // // when pedestrian districts start loading (because of pan/zoom) stop editing
                  // // editingLayer.on('loading', function() {
                  // //     stopEditing();
                  // // });

                  // // when new features are loaded clear our current guides and feature groups
                  // // then load the current features into the guides and feature group
                  // editingLayer.on('load', function() {
                  //     // wipe the current layers available for deltion and clear the current guide layers.
                  //     drawnItems.clearLayers();

                  //     // for each feature push the layer representing that feature into the guides and deletion group
                  //     editingLayer.eachFeature(function(layer) {
                  //         drawnItems.addLayer(layer);
                  //     });
                  // });






                  // // create a new Leaflet Draw control
                  // var drawControl = new L.Control.Draw({
                  //     edit: {
                  //         featureGroup: drawnItems, // allow editing/deleting of features in this group
                  //         edit: false // disable the edit tool (since we are doing editing ourselves)
                  //     },
                  //     draw: {
                  //         circle: false, // disable circles
                  //         marker: true,
                  //         square: false, // disable polylines
                  //         polyline: false, // disable polylines
                  //         polygon: {
                  //             allowIntersection: false, // polygons cannot intersect thenselves
                  //             drawError: {
                  //                 color: 'red', // color the shape will turn when intersects
                  //                 message: '<strong>Oh snap!<strong> you can\'t draw that!' // message that will show when intersect
                  //             },
                  //         }
                  //     }
                  // });




                  // // add our drawing controls to the map
                  // map.addControl(drawControl);

                  // // when we start using creation tools disable our custom editing
                  // map.on('draw:createstart', function() {
                  //     disableEditing = true;
                  // });

                  // // when we start using deletion tools, hide attributes and disable custom editing
                  // map.on('draw:deletestart', function() {
                  //     disableEditing = true;
                  //     currentlyDeleting = true;
                  // });

                  // // listen to the draw created event
                  // map.on('draw:created', function(e) {
                  //     // add the feature as GeoJSON (feature will be converted to ArcGIS JSON internally)
                  //     console.log(e.layer.toGeoJSON());
                  //     console.log(editingLayer);

                  //     editingLayer.addFeature(e.layer.toGeoJSON());
                  //     //editingLayer.addfeature(e.layer.toGeoJSON());
                  //     disableEditing = false;
                  // });


                  // // listen to the draw deleted event
                  // map.on('draw:deleted', function(e) {

                  //     var delArray = [];
                  //     e.layers.eachLayer(function(layer) {
                  //         var id = layer.feature.id;
                  //         delArray.push(id);
                  //     });

                  //     editingLayer.deleteFeatures(delArray, function(error, response) {

                  //         if (error) {
                  //             console.log(error, response);
                  //         }
                  //     });
                  //     disableEditing = false;
                  //     currentlyDeleting = false;
                  // });




                  function syncSidebar() {
                      /* Empty sidebar features */
                      $("#feature-list tbody").empty();
                      /* Loop through theaters layer and add only features which are in the map bounds */
                      fieldLayer.eachFeature(function(layer) {
                          if (map.hasLayer(fieldLayer)) {
                              console.log(layer);
                              if (map.getBounds().contains(layer.getBounds())) {
                                  $("#feature-list tbody").append('<tr class="feature-row" id="sa"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                              }
                          }
                      });
                      /* Loop through museums layer and add only features which are in the map bounds */
                      // museums.eachLayer(function (layer) {
                      //   if (map.hasLayer(museumLayer)) {
                      //     if (map.getBounds().contains(layer.getLatLng())) {
                      //       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                      //     }
                      //   }
                      // });
                      /* Update list.js featureList */
                      featureList = new List("features", {
                          valueNames: ["feature-name"]
                      });
                      featureList.sort("feature-name", {
                          order: "asc"
                      });
                  }


                  map.on("moveend", function(e) {
                      syncSidebar();
                  });




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
                  if (document.body.clientWidth <= 767) {
                      var isCollapsed = true;
                  } else {
                      var isCollapsed = false;

                  }

              });
          });
      });
  });