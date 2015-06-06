var Arrow = require('arrow');

var expire, expireAt, persist, ttl;

var Ephemeral = Arrow.Model.extend('ephemeral', {

    connector: 'appc.redis',

    fields: { },

    expire: function (seconds, callback){
        !expire && (expire = getConnectorDelegate(this, 'expire'));
        return expire(this.getModel(), this, seconds, callback);
    },

    expireAt: function (date, callback){
        !expireAt && (expireAt = getConnectorDelegate(this, 'expireAt'));
        return expireAt(this.getModel(), this, date, callback);
    },

    ids: function (limit, callback){
        return this.getConnector().ids(this.getModel(), limit, callback);
    },

    persist: function (callback){
        !persist && (persist = getConnectorDelegate(this, 'persist'));
        return persist(this.getModel(), this, callback);
    },

    ttl: function (callback){
        !ttl && (ttl = getConnectorDelegate(this, 'ttl'));
        return ttl(this.getModel(), this, callback);
    }

});

function getConnectorDelegate(ctx, method){
    return ctx.getConnector().getDelegateMethod(ctx.getModel(), method);
}

module.exports = Ephemeral;