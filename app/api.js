(function () {
    'use strict';

    angular.module('app.api', ['ngCookies'])

        .constant('API_URL', "http://172.26.244.179:8080")

        .factory('ApiService', function ($http, $cookies, API_URL) {

            return {
                login: login,
                addUser: addUser,
                getUser: getUser,
                addBankAccount: addBankAccount,
                getBankAccount: getBankAccount,
                getCampaigns: getCampaigns,
                getCampaign: getCampaign,
                addCampaign: addCampaign,
                updateCampaign: updateCampaign,
                deleteCampaign: deleteCampaign,
                addContribution: addContribution,
                getContribution: getContribution,
                getCampaignContributions: getCampaignContributions,
                addAccessToken: addAccessToken
            };
                    
            function login(cb, user) {
                $http.get(API_URL + '/validateUser?username=' + user.username + '&password=' + user.password)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function addUser(cb, user) {
                $http.get(API_URL + '/addUser?username=' + user.email
                + '&password=' + user.password
                + '&email=' + user.email
                + '&firstname=' + user.first_name
                + '&lastname=' + user.last_name)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function getUser(cb, username) {
                $http.get(API_URL + '/getUser?username=' + username)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function addBankAccount(cb, username, account_number, bank_holder, bank_name) {
                $http.get(API_URL + '/addBankAccount?username=' + username
                + '&account_number=' + account_number
                + '&bank_holder=' + bank_holder
                + '&bank_name=' + bank_name)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function getBankAccount(cb, username) {
                $http.get(API_URL + '/user/currentBankAccount?username=' + username)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function getCampaigns(cb) {
            	$http.defaults.useXDomain = true
                $http.get(API_URL + '/getCampaigns')
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function getCampaign(cb, id) {
                $http.get(API_URL + '/getCampaign?id_campaign=' + id)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function addCampaign(cb, campaign, user) {
                $http.get(API_URL + '/addCampaign?image_url=' + campaign.image_url
                + '&name=' + campaign.name
                + '&type=' + campaign.type
                + '&description=' + campaign.description
                + '&target_amount=' + campaign.target_amount
                + '&currency=' + campaign.currency
                + '&id_receiving_account=' + user.bankAccount.id
                + '&creator_username=' + user.username)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function updateCampaign(cb, campaign, user) {
                $http.get(API_URL + '/updateCampaign?id_campaign=' + campaign.id
                + '&image_url=' + campaign.image_url
                + '&name=' + campaign.name
                + '&type=' + campaign.type
                + '&description=' + campaign.description
                + '&target_amount=' + campaign.target_amount
                + '&currency=' + campaign.currency
                + '&id_receiving_account=' + user.bankAccount.id
                + '&creator_username=' + user.username)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function deleteCampaign(cb, campaign) {
                $http.get(API_URL + '/deleteCampaign?id=' + campaign.id)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function addContribution(cb, campaign, contribution, user) {
                $http.get(API_URL + '/addContribution?id_campaign=' + campaign.id
                + '&source_username=' + user.username
                + '&currency=' + contribution.currency
                + '&description=' + contribution.description
                + '&amount=' + contribution.amount)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function getContribution(cb, id) {
                $http.get(API_URL + '/getContribution?id=' + id)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function getCampaignContributions(cb, id) {
                $http.get(API_URL + '/campaign/getContributions?id_campaign=' + id)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }

            function addAccessToken(cb, username, access_token) {
                $http.get(API_URL + '/addAccessToken?username=' + username + '&access_token=' + access_token)
                    .success(function (data, status, headers, config) { return cb(data); })
                    .error(function (data, status, headers, config) { return cb(data); });
            }
        });

})();