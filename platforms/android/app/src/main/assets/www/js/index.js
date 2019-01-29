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
            console.log(cordova.file.applicationDirectory);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        function gotFS(fileSystem) {
            fileSystem.root.getDirectory("DO_NOT_DELETE", 
                {create: true, exclusive: false}, 
                gotDirEntry, 
                fail);
        }
        function gotDirEntry(dirEntry) {
            dir = dirEntry;
            dirEntry.getFile("sample.json", 
                {create: false, exclusive: false}, 
                readSuccess, 
                fileDonotexist);
        }
        function fileDonotexist(dirEntry) {
            dir.getFile("sample.json", 
                {create: true, exclusive: false}, 
                gotFileEntry, 
                fail);
        }
        function gotFileEntry(fileEntryWrite) {
            fileEntryWrite.createWriter(gotFileWriter, fail);
        }
        function gotFileWriter(writer) {
            writer.onerror = function(evt) {
            };
            writer.write(localData);
            writer.onwriteend = function(evt) {
                dir.getFile("sample.json", 
                    {create: false, exclusive: false}, 
                    readSuccess, 
                    fail);
            };
        }
        function readSuccess(fileE) {
            fileE.file(readAsText, fail);
        }
        function fail(error) {
            console.log("fail");
        }
        function readAsText(readerDummy) {
            var reader = new FileReader();

            reader.onloadstart = function(evt) {};
            reader.onprogress = function(evt) {};
            reader.onerror = function(evt) {};

            reader.onloadend = function(evt) {
                console.log("read success");
            };
            reader.readAsText(readerDummy);
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }

};

app.initialize();
