'use strict';
var configure_mod = require('../config/configure.js');
var configure = new configure_mod();

angular.module('medApp.upload-data', ['ngRoute', 'angularFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/upload-data', {
            templateUrl: 'data/upload-data.html',
            controller: 'uploadController'
        });
    }])

    .controller('uploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: configure.data_host + 'upload-file'
        });

        // FILTERS

        uploader.filters.push(
            //{
            //    name: 'customFilter',
            //    fn: function (item /*{File|FileLikeObject}*/, options) {
            //        return this.queue.length < 10;
            //    }
            //},
            {
                name: 'xmlFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|xml|'.indexOf(type) !== -1;
                }
            }
        );

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
            alert("选择的文件有非xml文件");
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }]);