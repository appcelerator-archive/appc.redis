var Arrow = require('arrow');

module.exports = Arrow.createModel('base', {

    connector: 'appc.redis',

    fields: { },

    expire: function expire(seconds, callback){
        return this.getConnector().expire(this.getModel(), this, seconds, callback);
    },

    expireAt: function expireAt(date, callback){
        return this.getConnector().expireAt(this.getModel(), this, date, callback);
    },

    keys: function keys(limit, callback){
        return this.getConnector().keys(this.getModel(), limit, callback);
    },

    persist: function persist(callback){
        return this.getConnector().persist(this.getModel(), this, callback);
    },

    ttl: function ttl(callback){
        return this.getConnector().ttl(this.getModel(), this, callback);
    }

});