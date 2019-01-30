/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            readFile();
        }

        function createFile() {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback);

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {create: true, exclusive: true, type: 'text/plain'}, function(fileEntry) {
                 console.log('File creation successful!');
                 readFile(fileEntry.file);
              }, errorCallback);
           }
            
        }

        function writeFile(data) {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback);

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {create: false}, function(fileEntry) {
                    var reader = '';
                    fileEntry.file(function(file) {
                        reader = new FileReader(file);
                        reader.readAsText(file);
                        reader.onloadend = function(e) {
                             fileEntry.createWriter(function(fileWriter) {
                                var data_appended = [];
                                if ( reader.result !== '' ) {
                                    var get_result = JSON.parse( reader.result );
                                    get_result.forEach( function( record ) {
                                        data_appended.push( record );
                                    } );
                                    data_appended.push( JSON.parse( data ) );
                                    data_appended = JSON.stringify( data_appended );
                                    var blob = new Blob([data_appended], {type: 'text/plain'});
                                    fileWriter.write(blob);
                                } else {
                                    data_appended.push( JSON.parse( data ) );
                                    data_appended = JSON.stringify( data_appended );
                                    var blob = new Blob([data_appended], {type: 'text/plain'});
                                    fileWriter.write(blob);
                                }
                                fileWriter.onwriteend = function(e) {
                                   console.log('Thank you!');
                                   readFile(fileEntry.file);
                                };

                                fileWriter.onerror = function(e) {
                                   console.log('Write failed: ' + e.toString());
                                };
                            });
                        }
                 }, errorCallback);
              }, errorCallback);
           }

        }

        function readFile(data) {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback);

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {}, function(fileEntry) {

                 fileEntry.file(function(file) {
                    var reader = new FileReader(file);
                    reader.readAsText(file);
                    reader.onloadend = function(e) {
                        if ( document.getElementById('datatable') && reader.result !== '' ) {
                            var file_data = JSON.parse( reader.result );
                            var table_headers = document.getElementById('table-headers');
                            var table_content = document.getElementById('table-content');
                            file_data.forEach( function( record ) {
                                var create_tr = document.createElement('TR');
                                record.forEach( function( record_info ) {
                                    var create_td = document.createElement('TD');
                                    create_td.appendChild( document.createTextNode( record_info ) );
                                    create_tr.appendChild( create_td );
                                } );
                                table_content.appendChild( create_tr );
                            } );
                        }
                    };
                 }, createFile);
              }, createFile);
           }

        }

        function removeFile(myfile) {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback);

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {create: false}, function(fileEntry) {

                 fileEntry.remove(function() {
                    alert('All data has been deleted.');
                 }, errorCallback);
              }, errorCallback);
           }
        }

        if ( document.getElementById("submit") ) {
            document.getElementById("submit").addEventListener("click", submitbtn);
        }
        if ( document.getElementById("export-btn") ) {
            document.getElementById("export-btn").addEventListener("click", exportCSV);
        }
        if ( document.getElementById("delete-btn") ) {
            document.getElementById("delete-btn").addEventListener("click", removeFile);
        } 

        

        function submitbtn(e) {
            e.preventDefault();
            var data = [];
            var inputs = document.getElementsByTagName('input');
            var notes = document.getElementById('notes');

            for (var i = 0; i < inputs.length; i++) {
                data.push(inputs[i].value);
            }
            data.push(notes.value.replace(/,/g,""));
            data = JSON.stringify( data );
            try {
              writeFile(data);
              for (var i = 0; i < inputs.length; i++) {
                  inputs[i].value = '';
              }
              notes.value = '';
          } catch(err) {
              console.log("Error while writing data " +err);
          }
        }

        function errorCallback(error) {
            alert("ERROR: " + error.code);
        }

        function exportCSV(data) {
          let csvContent = "data:text/csv;charset=utf-8,";
          rows.forEach(function(rowArray){
             let row = rowArray.join(",");
             csvContent += row + "\r\n";
          }); 

          var encodedUri = encodeURI(csvContent);
          window.open(encodedUri);
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
      
    }

};

app.initialize();
