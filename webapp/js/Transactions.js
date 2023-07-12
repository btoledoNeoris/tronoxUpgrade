let urlBaseXqt = function (service) {
    return `/XMII/Illuminator?service=Query&QueryTemplate=${service}&Content-Type=text/json`;
};
var oServices = {

    //commons
    getPlant: urlBaseXqt('building'),
    //configurations
    getWorkcenterTree: urlBaseXqt('Tronox/Configuration/Xacute/WorkCenterTreeXacuteQuery'),
    getWorkcenterId: urlBaseXqt('Tronox/Configuration/Xacute/WorkCenterIDXacuteQuery'),
    getWorkcenterGroup: urlBaseXqt('Tronox/Configuration/Xacute/WorkCenterGroupXacuteQuery'),
    getWorkcenterGroupApp: urlBaseXqt('Tronox/Configuration/Xacute/WorkCenterGroupActionsXacuteQuery'),
    getCharacteristicActions: urlBaseXqt('Tronox/Configuration/Xacute/CharacteristicActionsXacuteQuery'),
    getInsPlanActions: urlBaseXqt('Tronox/Configuration/Xacute/InspectionPlanActionsXacuteQuery'),
    getMaterialActions: urlBaseXqt('Tronox/Configuration/Xacute/MaterialActionsXacuteQuery'),
    getSPCRuleActions: urlBaseXqt('Tronox/Configuration/Xacute/SPCRuleActionsXacuteQuery')
};
