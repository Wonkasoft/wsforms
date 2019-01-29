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
           window.requestFileSystem(type, size, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {create: true, exclusive: true}, function(fileEntry) {
                 alert('File creation successfull!')
              }, errorCallback);
           }

           function errorCallback(error) {
              alert("ERROR: " + error.code)
           }
            
        }

        function writeFile(data) {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {create: true}, function(fileEntry) {
                 fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                       alert('Thank you!');
                    };

                    fileWriter.onerror = function(e) {
                       alert('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], {type: 'text/plain'});
                    fileWriter.write(blob);
                 }, errorCallback);
              }, errorCallback);
           }

           function errorCallback(error) {
              alert("ERROR: " + error.code)
           }
        }

        function readFile(data) {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {}, function(fileEntry) {

                 fileEntry.file(function(file) {

                    var reader = new FileReader(file);
                    reader.onloadend = function(e) {
                       var txtArea = document.getElementById('notes');
                       txtArea.value = this.result;
                       var appendFile = this.result.split(",");
                       appendFile.push(data);
                       console.log(appendFile);
                       writeFile(appendFile);
                    };
                    reader.readAsText(file);
                 }, createFile);
              }, createFile);
           }

           function errorCallback(error) {
              alert("ERROR: " + error.code)
           }
        }

        function removeFile(myfile) {
           var type = window.PERSISTENT;
           var size = 5*1024*1024;
           window.requestFileSystem(type, size, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile('formdata.txt', {create: false}, function(fileEntry) {

                 fileEntry.remove(function() {
                    alert('File removed.');
                 }, errorCallback);
              }, errorCallback);
           }

           function errorCallback(error) {
              alert("ERROR: " + error.code)
           }
        }

        document.getElementById("submit").addEventListener("click", submitbtn);
        document.getElementById("exportData").addEventListener("click", downloadFile);


        function submitbtn() {
            var e = this.event;
            var data = [];
            var inputs = document.getElementsByTagName('input');
            var notes = document.getElementById('notes');

            for (var i = 0; i < inputs.length; i++) {
                data.push(inputs[i].value);
            }
            data.push(notes.value.replace(/,/g,""));
            try {
              readFile(data);
          } catch(err) {
              console.log("Error while writing data " +err);
          }
          // console.log(data);
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
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
      
    }

};

app.initialize();
