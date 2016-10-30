/**
 * Created by AO.Diwei on 2016/10/19.
 */
var app = require('../app.js');
app.controller('uploadXmlCtrl', function($scope, FileUploader, $commonFun) {
    var uploader = $scope.uploader = new FileUploader({
           url: '/data/upload-xml'
       });
       uploader.filters.push(
           {
               name: 'xmlFilter',
               fn: function (item /*{File|FileLikeObject}*/, options) {
                   var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                   return '|xml|'.indexOf(type) !== -1;
               }
           }
       );

       uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
           console.info('onWhenAddingFileFailed', item, filter, options);
           var msg =  "选择的文件" + item.name + "不是xml文件";
           $commonFun.showSimpleToast(msg, "error-toast");
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

       //console.info('uploader', uploader);
   });

app.controller('uploadCsvCtrl', function($scope, FileUploader, $commonFun) {
    var uploader = $scope.uploader = new FileUploader({
           url: '/data/upload-csv'
       });
       uploader.filters.push(
           {
               name: 'CsvFilter',
               fn: function (item /*{File|FileLikeObject}*/, options) {
                   var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                   return '|csv|'.indexOf(type) !== -1;
               }
           }
       );

       uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
           console.info('onWhenAddingFileFailed', item, filter, options);
           var msg =  "选择的文件" + item.name + "不是xml文件";
           $commonFun.showSimpleToast(msg, "error-toast");
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

       //console.info('uploader', uploader);
   });
