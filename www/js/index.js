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
                                if ( reader.result !== '' ) {
                                    var data_appended = [];
                                    data_appended.push(reader.result);
                                    data_appended.push(data);
                                    var blob = new Blob(data_appended, {type: 'text/plain'});
                                    fileWriter.write(blob);
                                } else {
                                    var blob = new Blob([data], {type: 'text/plain'});
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
                        console.log( reader.result );
                        
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
                    alert('File removed.');
                 }, errorCallback);
              }, errorCallback);
           }
        }

        document.getElementById("submit").addEventListener("click", submitbtn);
        document.getElementById("exportData").addEventListener("click", downloadFile);


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

        function downloadFile(file) {
           var fileTransfer = new FileTransfer();
           var file = file;
           var fileURL =  "///storage/emulated/0/DCIM/formdata.csv";

           fileTransfer.download(
              file, fileURL, function(entry) {
                 console.log("download complete: " + entry.toURL());
              },
                
              function(error) {
                 console.log("download error source " + error.source);
                 console.log("download error target " + error.target);
                 console.log("download error code" + error.code);
              },
                
              false, {
                 headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                 }
              }
           );
        }

        function errorCallback(error) {
            alert("ERROR: " + error.code);
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
      
    }

};

app.initialize();
