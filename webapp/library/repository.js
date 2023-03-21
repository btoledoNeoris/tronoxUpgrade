let baseUrl = (typeTrx,path) => {
    var base, cType;
    if(typeTrx == "X") {
        base = '/XMII/Illuminator?QueryTemplate=';
        cType = '&Content-Type=text/json';
    }
    if(typeTrx == "R") {
        base = '/XMII/Runner?Transaction=';
        cType = '&OutputParameter=*';
    }

    let typePath = `${base}${path}${cType}`
    return typePath
}
var getTrx = {
    getWorkCenterDetailSelectQuery: baseUrl('X','Tronox/Configuration/Query/WorkCenterDetailSelectQuery'),
    getPlantByUserSelectQuery: baseUrl('X','Tronox/Common/Query/PlantByUserSelectQuery'),

};
var setTrx = {
};
