/**
 * Created by AO.Diwei on 2016/9/28.
 */
var app = require('../app.js');
app.controller('NavCtrl', function ($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $userInfo, $state) {
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };
    $scope.close = function () {
        $mdSidenav('left').close()
            .then(function () {
                //console.debug("close LEFT is done");
            });
    };

    $scope.$state = $state;

    // $scope.isActive = function (viewLocation) {
    //     console.log(viewLocation, $location.path());
    //     return viewLocation === $location.path();
    // };

    $scope.menu = [
        {
            lin: 'main.tabs',
            title: '数据录入',
            icon: 'dashboard'
        },
        {
            lin: 'main.upload_xml',
            title: '上传数据文件(xml)',
            icon: 'cloud_upload'
        },
        {
            lin: 'main.show_data',
            title: '浏览数据',
            icon: 'grid_on'
        },
        {
            lin: 'main.record_statistic',
            title: '录入榜',
            icon: 'trending_up'
        },
        {
            lin: 'main.ml_predict',
            title: '机器诊断',
            icon: 'note_add'
        }
    ];
    $scope.admin = [
        {
            lin: 'main.admin',
            title: '注册管理',
            icon: 'group'
        },
        {
            lin: 'main.upload_csv',
            title: '上传基本信息(csv)',
            icon: 'cloud_upload'
        }

    ];

    $scope.userInfo = $userInfo.getUserInfo;


    $scope.alert = '';
    $scope.showListBottomSheet = function ($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event
        }).then(function (clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
        });
    };

    $scope.showAdd = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
            targetEvent: ev,
        })
            .then(function (answer) {
                $scope.alert = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.alert = 'You cancelled the dialog.';
            });
    };
});