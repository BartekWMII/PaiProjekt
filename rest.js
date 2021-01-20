var db = require('./db')
var login = require('./login')
var collectionRest = require('./collectionRest')
var transfer = require('./transfer')
const lib = require('./lib')
const { validate } = require('uuid')

module.exports = {

    handle: function(env) {
        switch(env.parsedUrl.pathname) {
            case '/login':
                login.handle(env)
                break
            case '/person':
                if(env.sessionData.role == 1/* [1, 2].includes(env.sessionData.role) */) {
                    /*
                    var options = {}
                    options.availableMethods = env.sessionData.role == 1 ? [ 'GET', 'POST', 'PUT', 'DELETE'] : [ 'GET' ]
                    options.projectionGet = env.sessionData.role == 2 ? [ '_id', 'firstName', 'lastName' ] : null
                    */
                    collectionRest.handle(env, db.personCollection,function(env,collection){
                        // if(env.req.method == 'DELETE' && new Date().getHours() >= 16)return false
                        if(env.req.method == 'POST' && (!personValidate(env.payload) || personExists(env.payload, collection))) return false
                        if(collection != db.personCollection) return false
                        return true
                    } /*, options */)
                } else {
                    lib.serveError(env.res, 403, 'permission denied')
                }
                break
            case '/personList':
                if(env.sessionData.role == 2 && env.req.method == 'GET') {
                    transfer.personList(env)
                } else {
                    lib.serveError(env.res, 403, 'permission denied')
                }
                break
            case '/group':
                collectionRest.handle(env, db.groupCollection)
                break
            case '/transfer':
                if(env.sessionData.role == 2) {
                    transfer.perform(env)
                } else {
                    lib.serveError(env.res, 403, 'permission denied')
                }
                break
            default:
                return false
        }
        return true
    }

}