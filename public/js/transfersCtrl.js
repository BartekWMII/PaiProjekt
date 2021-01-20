var app = angular.module('paionline')

app.controller('TransfersCtrl', [ '$http', 'common', function($http, common) {
    console.log('Kontroler TransfersCtrl startuje')
    var ctrl = this

    ctrl.formatDateTime = common.formatDateTime

    ctrl.history = []
    
    ctrl.recipients = []
    ctrl.recipient = null

    ctrl.uniqueHistory=[]
    ctrl.MyUniqueHistory = []
    ctrl.uniqueHistoryHelper = null
    

    ctrl.transfer = {
        delta: 1.00
    }
    ctrl.transfer2 = {
        delta: 1.00
    }

    ctrl.amount = 0
    
    
    var refreshHistory = function() {
        $http.get('/transfer').then(
            function(res) {
                ctrl.history = res.data

                for(var i = 0; i < ctrl.history.length; i++) {
                    if(ctrl.history[i].delta < 0) {
                        ctrl.MyUniqueHistory.push(ctrl.history[i])
                    }
                }
                
                ctrl.uniqueHistory = []
                for(var i = 0; i < ctrl.MyUniqueHistory.length; i++) {
                    var j;
                    for(j = 0; j < i; j++) {
                        if(ctrl.MyUniqueHistory[i].recipient == ctrl.MyUniqueHistory[j].recipient) {
                            break
                        }
                    }
                    if(i == j) {
                        ctrl.uniqueHistory.push(ctrl.MyUniqueHistory[i])
                    }
                }
                $http.delete('/transfer').then(
                    function(res) { ctrl.amount = res.data.amount },
                    function(err) {}
                )
            },
            function(err) {}    
        )
    }

    refreshHistory()

    ctrl.doTransfer = function() {
        $http.post('/transfer?recipient=' + ctrl.uniqueHistoryHelper.recipient, ctrl.transfer).then(
            function(res) {
                refreshHistory()
            },
            function(err) {}
        )
    }

    ctrl.doTransfer2 = function() {
        $http.post('/transfer?recipient=' + ctrl.recipient._id, ctrl.transfer2).then(
            function(res) {
                refreshHistory()
            },
            function(err) {}
        )
    }

    $http.get('/personList').then(
        function(res) {
            ctrl.recipients = res.data
            // ctrl.recipient = ctrl.recipients[0]
            ctrl.recipient = null
        
        }, 
        function(err) {
            ctrl.recipients = []
            ctrl.recipient = null
        }
    )
}])