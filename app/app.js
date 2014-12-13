(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'ngCookies', 'app.api'])

        .constant('OAUTH2_URL', 'https://apisandbox.ingdirect.es/authserver/oauth2/authorization?client_id=HomebankApp&redirect_uri=http://localhost&response_type=token&grant_type=implicit')

        .value('USER', {
            'username': 'UID14201',
            'bankAccount': { 'id': 'NL31INGX0007946820' }
        })

        .value('USER2', {
            'username': 'UID14204',
            'bankAccount': { 'id': 'NL26INGX0003097446' }
        })

        .filter('reverse', function () {
            return function (items) {
                if (items !== undefined) {
                    return items.slice().reverse();
                }
            };
        })

        .config(function ($routeProvider) {

            $routeProvider.
                when('/access_token=:accessToken', {
                    redirectTo: '/'
                }).
                when('/', {
                    templateUrl: 'tpl/home.html',
                    controller: 'CampaignListCtrl'
                }).
                when('/campaigns', {
                    templateUrl: 'tpl/campaign_list.html',
                    controller: 'CampaignListCtrl'
                }).
                when('/campaign/new', {
                    templateUrl: 'tpl/campaign_form.html',
                    controller: 'CampaignDetailCtrl'
                }).
                when('/campaign/:campaignId', {
                    templateUrl: 'tpl/campaign_detail.html',
                    controller: 'CampaignDetailCtrl'
                }).
                when('/campaign/edit/:campaignId', {
                    templateUrl: 'tpl/campaign_form.html',
                    controller: 'CampaignDetailCtrl'
                }).
                when('/campaign/:campaignId/contribute', {
                    templateUrl: 'tpl/contribute_form.html',
                    controller: 'CampaignDetailCtrl'
                }).
                when('/user/:username', {
                    templateUrl: 'tpl/user_detail.html',
                    controller: 'UserDetailCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        })

        .controller('DefaultCtrl', function ($scope, $cookies, $routeParams, $timeout, OAUTH2_URL, ApiService) {

            $scope.oath2_url = OAUTH2_URL;
            $scope.categories = [
                'Baby shower',
                'Office gift',
                'Family',
                'Charity',
                'Party',
                'Friend in need'
            ];

            $scope.$on('$routeChangeSuccess', function () {
                if ($routeParams.accessToken !== undefined) {
                    var accessToken = $cookies.accessToken = $routeParams.accessToken;
                    ApiService.addAccessToken(function () {}, "username", accessToken);
                }
            });

            $scope.login = function (user) {
                ApiService.login(function (result) {
                    if (result !== null) {
                        $scope.alert = result.result == "true"
                            ? { 'type': 'success', 'message': "Logged in." }
                            : { 'type': 'danger', 'message': "Wrong credentials." };
                        $timeout(function () { $scope.alert = null; }, 3000);

                        if (result.result == "true") {
                            $("#sys_popup_common").fadeOut(function () {
                                $("body").off("keydown.closePopup");
                            });
                            $(document).find("#sys_header_right").html("<span>Logged in as: " + user.username + "</span>");
                        }
                    } else {
                        $scope.alert = { 'type': 'danger', 'message': "Service unavailable." };
                    }
                }, user);
            };

            $scope.register = function (user) {
                if (user.email !== undefined
                    && user.password !== undefined
                    && user.first_name !== undefined
                    && user.last_name !== undefined
                    && user.password == user.re_password
                    && user.email == user.re_email) {
                    ApiService.addUser(function (result) {
                        $scope.alert = result !== null
                            ? (result.result == "true"
                            ? { 'type': 'success', 'message': "User created." }
                            : { 'type': 'danger', 'message': "Something went wrong." })
                            : { 'type': 'danger', 'message': "Service unavailable." };
                        $timeout(function () { $scope.alert = null; }, 3000);
                        $("#sys_popup_common").fadeOut(function () {
                            $("body").off("keydown.closePopup");
                        });
                    }, user);
                } else {
                    $scope.alert = { 'type': 'danger', 'message': 'Please enter all required fields.' };
                    $timeout(function () { $scope.alert = null; }, 3000);
                }
            };
        })

        .controller('CampaignListCtrl', function ($scope, ApiService) {

            ApiService.getCampaigns(function (campaigns) {
                angular.forEach(campaigns, function (campaign, key) {
                    ApiService.getUser(function (user) {
                        campaigns[key].user = user;
                    }, campaign.creator_username);
                });

                $scope.campaigns = campaigns;
            });
        })

        .controller('CampaignDetailCtrl', function ($scope, $location, $timeout, $window, $cookies, $routeParams, ApiService, OAUTH2_URL, USER, USER2) {

            $scope.campaign = {};
            $scope.contribution = {};

            if ($routeParams.campaignId !== undefined) {
                ApiService.getCampaign(function (campaign) {
                    $scope.campaign = campaign;
                    ApiService.getCampaignContributions(function (contributions) {
                        $scope.campaignContributions = contributions;
                    }, campaign.id);
                    ApiService.getUser(function (user) {
                        $scope.campaign.user = user;
                    }, campaign.creator_username);
                }, $routeParams.campaignId);
            }

            $scope.contributeToCampaign = function (campaign, contribution) {
                if ($cookies.accessToken !== undefined) {
                    ApiService.addContribution(function (result) {
                        $scope.$parent.alert = result !== null
                            ? (result.result == "true"
                            ? { 'type': 'success', 'message': "Succesfully contributed to the campaign." }
                            : { 'type': 'danger', 'message': "Something went wrong." })
                            : { 'type': 'danger', 'message': "Service unavailable." };
                        $timeout(function () { $scope.$parent.alert = null; }, 3000);

                        ApiService.getCampaign(function (campaign) {
                            $scope.campaign = campaign;
                        }, campaign.id);

                        if (result !== null && result.result == "true") {
                            $location.path('/campaign/' + campaign.id);
                        }
                    }, campaign, contribution, USER2);
                } else {
                    $window.location.href = OAUTH2_URL;
                }
            };
            $scope.editCampaign = function (campaign) {
                $location.path('/campaign/edit/' + campaign.id);
            };
            $scope.saveCampaign = function (campaign) {
                if (campaign.id !== undefined) {
                    ApiService.updateCampaign(function (result) {
                        $scope.$parent.alert = result !== null
                            ? (result.result == "true"
                            ? { 'type': 'success', 'message': "Succesfully saved the campaign." }
                            : { 'type': 'danger', 'message': "Something went wrong." })
                            : { 'type': 'danger', 'message': "Service unavailable." };
                        $timeout(function () { $scope.$parent.alert = null; }, 3000);
                        $location.path("/campaign/" + campaign.id);
                    }, campaign, USER);
                } else {
                    ApiService.addCampaign(function (result) {
                        $scope.$parent.alert = result !== null
                            ? (result.result == "true"
                            ? { 'type': 'success', 'message': "Succesfully created the campaign." }
                            : { 'type': 'danger', 'message': "Something went wrong." })
                            : { 'type': 'danger', 'message': "Service unavailable." };
                        $timeout(function () { $scope.$parent.alert = null; }, 3000);

                        if (result !== null && result.result == "true") {
                            $scope.campaign = {};
                            $location.path("/campaign/" + result.key);
                        }
                    }, campaign, USER);
                }
            };
            $scope.deleteCampaign = function (campaign) {
                ApiService.deleteCampaign(function (result) {
                    $scope.$parent.alert = result !== null
                        ? (result.result == "true"
                        ? { 'type': 'success', 'message': "Succesfully deleted the campaign." }
                        : { 'type': 'danger', 'message': "Something went wrong." })
                        : { 'type': 'danger', 'message': "Service unavailable." };
                }, campaign);
            };
        })

        .controller('UserDetailCtrl', function ($scope, $location, $window, $cookies, $routeParams, ApiService, OAUTH2_URL, USER) {

            if ($routeParams.username !== undefined) {
                ApiService.getUser(function (user) {
                    $scope.user = user;
                }, $routeParams.username);
            }
        })

})();