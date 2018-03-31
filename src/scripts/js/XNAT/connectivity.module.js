/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 07/05/2015
 * Time: 11:00
 * To change this template use File | Settings | File Templates.
 */

var connectivityModule = angular.module('Optimise.connectivity',['ngResource']);


connectivityModule.factory('Experiments', function ($resource) {
    return function(project, subjectID) {
        //var url = "https://central.xnat.org/data/projects/"+project+"/subjects/"+subjectID+"/experiments?format=json";
        var url = "./api/xnat/proxy.php/data/projects/"+project+"/subjects/"+subjectID+"/experiments?format=json";
        return $resource(url,{},{});
    }
});

connectivityModule.factory('CIF_Data', function ($resource) {
    return function(subjectID) {
        var url = "./api/xnat/curlProxy.php/"+subjectID;
        return $resource(url,{},{});
    }
});

connectivityModule.factory('Scans', function ($resource) {
    return function(experimentURI) {
        //var url = "https://central.xnat.org"+experimentURI+"/scans?format=json";
        var url = "./api/xnat/proxy.php/"+experimentURI+"/scans?format=json";
        return $resource(url,{},{});
    }
});

connectivityModule.factory('Resources', function ($resource) {
    return function(scanURI) {
        //var url = "https://central.xnat.org"+scanURI+"/resources/?format=json";
        var url = "./api/xnat/proxy.php/"+scanURI+"/resources/?format=json";
        //console.log(url);
        return $resource(url,{},{});
    }
});

connectivityModule.factory('RawImage', function ($resource) {
    return function(experimentURI, resourceID) {
        //var url = "https://central.xnat.org"+experimentURI+"/resources/"+resourceID+"/files?format=json";
        var url = "./api/xnat/proxy.php/"+experimentURI+"/resources/"+resourceID+"/files?format=json";
        //console.log(url);
        return $resource(url,{},{});
    }
});

connectivityModule.factory('Snapshots', function ($resource) {
    return function(experimentURI, resourceID) {
        //var url = "https://central.xnat.org"+experimentURI+"/resources/"+resourceID+"/files?format=json";
        var url = "./api/xnat/proxy.php/"+experimentURI+"/resources/"+resourceID+"/files?format=json";
        //console.log(url);
        return $resource(url,{},{});
    }
});

connectivityModule.service('connectionServices', function($q, Experiments, Scans, Resources, Snapshots, RawImage, CIF_Data) {


    /*
    var getImagingExperiments = function(USUBJID) {
        var deferred = $q.defer();
        try {

            var data = {experiments:[], scans:[]};
            var experiments = getExperiments(USUBJID);
            experiments.then(function(experiments) {
                //console.log(experiments);

                for (var e = 0; e < experiments.length; e++) {
                    var anExperiment = {id: experiments[e].ID,
                        label:experiments[e].label,
                        date: experiments[e].date,
                        uri: experiments[e].URI};
                    data.experiments.push(anExperiment);
                    //console.log(data.experiments);
                    var scansFromExperiment = getScans(anExperiment.uri);
                    scansFromExperiment.then(function(scans) {
                        //console.log(scans);
                        for (var s = 0; s < scans.length; s++) {
                            var aScan = {id: scans[s].ID,
                                uri: scans[s].URI,
                                type:scans[s].type,
                                quality:scans[s].quality,
                                dicom:'',
                                thumbnail:'',
                                download:'',
                                //experimentID:anExperiment.id,
                                resourceID:'',
                                raw:[]};
                            aScan.dicom = aScan.uri+'?format=json';
                            aScan.download = aScan.uri+"/files?format=zip";
                            getResourcesFromAScan(aScan);
                            data.scans.push(aScan);
                        }
                    })
                }
            });
            //console.log(data);
            deferred.resolve(data);
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }
    */



//    var getImagingExperiments = function(USUBJID) {
//        var deferred = $q.defer();
//        try {
//
//            var cif_data = new CIF_Data(USUBJID);
//            cif_data.get({}, function(data) {
//                data.$promise.then(function() {
//                    deferred.resolve(data);
//                })
//            });
//            //console.log(data);
//            deferred.resolve(data);
//        } catch (e) {
//            deferred.reject(e);
//        }
//        return deferred.promise;
//    }

    var getResourcesFromAScan = function(aScan) {
        var resourcesFromAScan = getResources(aScan.uri);
        resourcesFromAScan.then(function(resources) {
            for (var r = 0; r < resources.length; r++) {
                var resourceID = resources[r].xnat_abstractresource_id;
                //console.log(resourceID);
                if (resources[r].format == 'GIF') {
                    //var snapshotOfAScan = getThumbnail(experimentURI, resourceID);
                    var snapshotOfAScan = getThumbnail(aScan.uri, resourceID);
                    snapshotOfAScan.then(function(thumbnail){
                        //console.log(thumbnail);
                        aScan.thumbnail = thumbnail.URI;
                    })
                }
                if (resources[r].format == 'DICOM') {
                    var raw = getRaw(aScan.uri, resourceID);
                    raw.then(function(raw){
                        //console.log(raw);
                        aScan.raw = raw;
                    })
                }
            }
        });
    }

    var getExperiments = function(USUBJID) {
        var deferred = $q.defer();
        try {
            var anExperiment = new Experiments('eTRIKS',USUBJID);
            anExperiment.get({}, function(data) {
                data.$promise.then(function() {
                    //console.log(data);
                    deferred.resolve(data.ResultSet.Result);
                })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    };

    // data/experiments/CENTRAL_E07330/scans?format=json
    var getScans = function(experimentURI) {
        var deferred = $q.defer();
        try {
            var scansFromExperiment = new Scans(experimentURI);
            scansFromExperiment.get({}, function(scanData) {
                scanData.$promise
                    .then(function() {
                        deferred.resolve(scanData.ResultSet.Result);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    };

    var getRaw = function(experimentURI, resourceID) {
        var deferred = $q.defer();
        try {
            var rawImages = new RawImage(experimentURI, resourceID) ;
            rawImages.get({}, function(imageData) {
                imageData.$promise.then(function() {
                    var rawImages = imageData.ResultSet.Result;
                    var rawURI = [];
                    for (var r = 0; r < rawImages.length; r++) {
                        rawURI.push(rawImages[r].URI);
                    }
                    deferred.resolve(rawURI);
                })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    // data/experiments/CENTRAL_E07330/scans/7/resources/123229201/files/CENTRAL_E07330_7_qc_t.gif
    var getThumbnail = function(experimentURI, resourceID) {
        var deferred = $q.defer();
        try {
            var snapshot = new Snapshots(experimentURI, resourceID);
            snapshot.get({}, function(imageData) {
                imageData.$promise.then(function() {
                    var thumbnails = imageData.ResultSet.Result;
                    if ((thumbnails != null) && (thumbnails.length > 0)) {

                        deferred.resolve(thumbnails[0]);
                    }
                    else
                        deferred.resolve('');
                })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    };

    var getResources = function (scanURI) {
        var deferred = $q.defer();
        try {
            var resourcesFromScan = new Resources(scanURI);
            resourcesFromScan.get({}, function(resourceData){
                resourceData.$promise.then(function() {
                    //console.log(resourceData);
                    deferred.resolve(resourceData.ResultSet.Result);
                });
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }



    return {
        //getImagingExperiments: getImagingExperiments,
        getExperiments:getExperiments,
        getScans: getScans
        //getSubjectsFromCIF: getSubjectsFromCIF
    }
});




/*
 var getExperiments = function() {
 var anExperiment = new Experiments('eTRIKS','CENTRAL_S04082');
 anExperiment.get({}, function(data) {
 data.$promise.then(function() {
 console.log(data);
 return data.$promise;
 })
 });
 };

 // data/experiments/CENTRAL_E07330/scans/7
 var getScanDetails = function(experimentID) {
 }

 // data/experiments/CENTRAL_E07330/scans?format=json
 var getScans = function(experimentURI) {
 var aScan = new Scans(experimentURI);
 aScan.get({}, function(data) {
 data.$promise.then(function() {
 //console.log(data);
 var scans = [];
 for (var e = 0; e < data.ResultSet.Result.length; e++) {
 var aScan = {id: data.ResultSet.Result[e].ID,
 uri: data.ResultSet.Result[e].URI,
 quality:data.ResultSet.Result[e].quality,
 type: data.ResultSet.Result[e].type
 };
 //console.log(anExperiment);
 getThumbnail(aScan);
 scans.push(aScan);
 }
 return scans;
 })
 });
 return null;
 };

 // data/experiments/CENTRAL_E07330/scans/7/resources/123229201/files/CENTRAL_E07330_7_qc_t.gif
 var getThumbnail = function(scan) {
 return getResource(scan);
 };

 var getResource = function (scan) {
 var resources = new Resources(scan.uri);
 resources.get({}, function(data) {
 data.$promise.then(function() {
 var results = data.ResultSet.Result;
 for (var r = 0; r < results.length; r++) {
 var resource = results [r];
 if (resource.content == 'SNAPSHOTS') {
 var resourceID = resource.xnat_abstractresource_id;
 console.log(resource);
 getSnapshot(scan.uri, resourceID);
 }
 if (resource.content == 'DICOM') {
 console.log(resource);
 }
 }
 })
 });
 }

 var getSnapshot = function (scanURI, resourceID) {
 var snapshot = new Snapshots(scanURI, resourceID);
 snapshot.get({}, function(data) {
 data.$promise.then(function() {
 var results = data.ResultSet.Result;
 for (var r = 0; r < results.length; r++) {
 var thumbnailURI = results [r];
 console.log(thumbnailURI.URI);
 }
 })
 });
 }
 */