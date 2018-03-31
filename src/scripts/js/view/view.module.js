/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 12:50
 * To change this template use File | Settings | File Templates.
 */

var viewModule =  angular.module('Optimise.view',[]);

viewModule.service('viewService', function(){

    var setView;
    var view = {"Section":'Patient', "DisableInputFields":true}
    var offlineWork = true;
    var viewConfig = null;
    var authenticated = false;
    var viewConfigMap;

    var setConfiguration = function(data) {
        //viewConfigMap = new Map();
        viewConfig = data;
    }

    var getConfiguration = function() {
        return viewConfig;
    }

    var getConfigurationRoot = function() {
        return viewConfig.name;
    }

    var getConfigurationSetting = function(term) {
        if (viewConfig!= null) {
            if (viewConfig.children) {
                for (var s = 0; s < viewConfig.children.length; s++){
                    //console.log(viewConfig.children[s].name);
                    if (viewConfig.children[s].name == term){
                        //console.log(term+" found");
                        var setting = viewConfig.children[s];
                        //console.log(term+" "+setting.include);
                        return setting.include;
                    }
                    var config = getChildConfigurationSetting(viewConfig.children[s], term);
                    if (config == true)
                        return true;
                }
            }
        }
        return false;
    }

    var getChildConfigurationSetting = function(child, term) {
        if (child != null) {
            if (child.children != null) {
                for (var s = 0; s < child.children.length; s++){
                    //console.log(child.children[s].name);
                    if (child.children[s].name == term){

                        var setting = child.children[s];
                        //console.log(term+" "+setting.include);
                        return setting.include;
                    }
                    var config = getChildConfigurationSetting(child.children[s], term);
                    if (config == true)
                        return true;
                }
            }
        }

        return false;
    }

    var setOffline = function (offline) {
        offlineWork = offline;
    }

    var workOffline = function () {
        return offlineWork;
    }

    setView = function (viewName, disable) {
        view.Section = viewName;
        view.DisableInputFields = disable;
    };

    var getView = function() {
        return view;
    }

    var setAuthenticated = function(status) {
        authenticated = status;
    }

    var isAuthenticated = function() {
        return authenticated;
    }


    return {
        setView: setView,
        getView: getView,
        setOffline: setOffline,
        workOffline: workOffline,
        setConfiguration: setConfiguration,
        getConfiguration: getConfiguration,
        getConfigurationSetting: getConfigurationSetting,
        setAuthenticated: setAuthenticated,
        isAuthenticated: isAuthenticated,
        getConfigurationRoot: getConfigurationRoot
    };
})