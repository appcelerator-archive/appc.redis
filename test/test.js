var async = require('async'),
    common = require('./common'),
    should = require('should'),
    TestModel;

describe('appc.redis', function() {

    before(function() {
        TestModel = common.Arrow.Model.extend('appc.redis/base', 'testUser', {
            fields:{
                fname:{
                    type: String, required: false
                },
                lname:{
                    type: String, required: false
                },
                age:{
                    type: Number, required: false
                }
            }
        });
    });

    describe('#create', function(){

        it('should create instances', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {
                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);
                next();
            });

        });

    });

    describe('#findOne', function(){

        it('should handle bad ids', function(next) {
            TestModel.findOne('a_bad_id', function(err) {
                should(err).be.ok;
                next();
            });
        });

        it('should find an instance by ID', function(next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                var id = createdInstance.getPrimaryKey();
                TestModel.findOne(id, function(err, foundInstance) {
                    should(err).not.be.ok;
                    should(foundInstance).be.an.Object;

                    should(foundInstance.getPrimaryKey()).equal(id);
                    should(foundInstance.fname).equal(fname);
                    should(foundInstance.lname).equal(lname);

                    next();
                });

            });

        });

        it('should find an instance by field value', function(next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.findOne({
                    fname: fname
                }, function(err, foundInstance) {
                    should(err).not.be.ok;
                    should(foundInstance).be.an.Object;

                    should(foundInstance.getPrimaryKey()).equal(createdInstance.getPrimaryKey());
                    should(foundInstance.fname).equal(fname);
                    should(foundInstance.lname).equal(lname);

                    next();
                });

            });

        });

        it('should limit fields using sel', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.findOne({
                    sel: {
                        fname: 1
                    }
                }, function (err, foundInstance) {
                    should(err).not.be.ok;
                    should(foundInstance).be.an.Object;

                    should(foundInstance.fname).equal('James');
                    should(foundInstance.lname).not.be.ok;

                    next();
                });

            });

        });

        it('should limit fields using unsel', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.findOne({
                    unsel: {
                        lname: 1
                    }
                }, function (err, foundInstance) {
                    should(err).not.be.ok;
                    should(foundInstance).be.an.Object;

                    should(foundInstance.fname).equal('James');
                    should(foundInstance.lname).not.be.ok;

                    next();
                });

            });

        });

    });

    describe('#find', function() {

        it('should find a single instance', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                var id = createdInstance.getPrimaryKey();
                TestModel.find({
                    fname: fname
                }, function (err, collection) {
                    should(err).not.be.ok;
                    should(collection).be.an.Array;

                    var foundInstance = collection[0];

                    should(foundInstance.getPrimaryKey()).equal(id);
                    should(foundInstance.fname).equal(fname);
                    should(foundInstance.lname).equal(lname);

                    next();
                });

            });

        });

        it('should find multiple instances', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance1) {
                should(err).not.be.ok;
                should(createdInstance1).be.an.Object;

                TestModel.create({
                    fname: fname,
                    lname: lname
                }, function (err, createdInstance2) {
                    should(err).not.be.ok;
                    should(createdInstance2).be.an.Object;

                    TestModel.find({
                        fname: fname
                    }, function (err, collection) {
                        should(err).not.be.ok;
                        should(collection).be.an.Array;

                        should(collection).have.length(2);
                        should(collection[0].fname).equal(fname);
                        should(collection[0].lname).equal(lname);
                        should(collection[1].fname).equal(fname);
                        should(collection[1].lname).equal(lname);

                        next();
                    });

                });

            });

        });

        it('should limit instances', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance1) {
                should(err).not.be.ok;
                should(createdInstance1).be.an.Object;

                TestModel.create({
                    fname: fname,
                    lname: lname
                }, function (err, createdInstance2) {
                    should(err).not.be.ok;
                    should(createdInstance2).be.an.Object;

                    TestModel.find({
                        limit: 1,
                        order: {
                            fname: 1
                        },
                        where: {
                            fname: fname
                        }
                    }, function (err, foundInstance) {
                        should(err).not.be.ok;
                        should(foundInstance).be.an.Object;

                        should(foundInstance.fname).equal(fname);
                        should(foundInstance.lname).equal(lname);

                        next();
                    });

                });

            });

        });

        it('should limit fields using sel', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.find({
                    limit: 1,
                    sel: {
                        fname: 1
                    },
                    where: {
                        lname: lname
                    }
                }, function (err, foundInstance) {
                    should(err).not.be.ok;
                    should(foundInstance).be.an.Object;

                    should(foundInstance.fname).equal('James');
                    should(foundInstance.lname).not.be.ok;

                    next();
                });

            });

        });

        it('should limit fields using unsel', function (next) {

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.find({
                    limit: 1,
                    unsel: {
                        lname: 1
                    },
                    where: {
                        lname: lname
                    }
                }, function (err, foundInstance) {
                    should(err).not.be.ok;
                    should(foundInstance).be.an.Object;

                    should(foundInstance.fname).equal('James');
                    should(foundInstance.lname).not.be.ok;

                    next();
                });

            });

        });

    });

    describe('#findAll', function() {

        it('should find all instances', function(next) {

            var fname = 'James',
                lname = 'Smith';

            var count = 0;

            async.whilst(
                function () { return count < 100; },
                function (callback) {
                    count++;
                    TestModel.create({
                        fname: fname + count,
                        lname: lname + count
                    }, function(err, record){
                        should(err).not.be.ok;
                        should(record).be.an.Object;
                        callback();
                    });
                },
                function (err) {
                    should(err).not.be.ok;

                    TestModel.findAll(function(err, collection){
                        should(err).not.be.ok;
                        should(collection).be.an.Array;

                        should(collection).have.lengthOf(100);

                        next();
                    });
                }
            );

        });

        it('should limit to 1000 instances', function(next) {

            var fname = 'James',
                lname = 'Smith';

            var count = 0;

            async.whilst(
                function () { return count < 1010; },
                function (callback) {
                    count++;
                    TestModel.create({
                        fname: fname + count,
                        lname: lname + count
                    }, function(err, record){
                        should(err).not.be.ok;
                        should(record).be.an.Object;
                        callback();
                    });
                },
                function (err) {
                    should(err).not.be.ok;

                    TestModel.findAll(function(err, collection){
                        should(err).not.be.ok;
                        should(collection).be.an.Array;

                        should(collection).have.lengthOf(1000);

                        next();
                    });
                }
            );

        });

    });

    describe('#delete and #deleteAll', function() {

        it('should remove an instance', function(next){

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.findAll(function (err, collection1) {
                    should(err).not.be.ok;
                    should(collection1).be.an.Array;

                    should(collection1.length).equal(1);
                    should(collection1[0].fname).equal(fname);
                    should(collection1[0].lname).equal(lname);

                    collection1[0].delete(function(){

                        TestModel.findAll(function (err, collection2) {
                            should(err).not.be.ok;
                            should(collection2).be.an.Array;

                            should(collection2.length).equal(0);

                            next();

                        });

                    });

                });

            });

        });

        it('should remove all instances', function(next){

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance1) {
                should(err).not.be.ok;
                should(createdInstance1).be.an.Object;

                TestModel.create({
                    fname: fname,
                    lname: lname
                }, function (err, createdInstance2) {
                    should(err).not.be.ok;
                    should(createdInstance2).be.an.Object;

                    TestModel.findAll(function (err, collection1) {
                        should(err).not.be.ok;
                        should(collection1).be.an.Array;

                        should(collection1.length).equal(2);

                        TestModel.deleteAll(function(){

                            TestModel.findAll(function (err, collection2) {
                                should(err).not.be.ok;
                                should(collection2).be.an.Array;

                                should(collection2.length).equal(0);

                                next();

                            });

                        });

                    });

                });

            });

        });

    });

    describe('#save', function(){

        it('should update an instance', function(next){

            var fname = 'James',
                lname = 'Smith';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function (err, createdInstance) {
                should(err).not.be.ok;
                should(createdInstance).be.an.Object;

                TestModel.findAll(function (err, collection1) {
                    should(err).not.be.ok;
                    should(collection1).be.an.Array;

                    should(collection1.length).equal(1);
                    should(collection1[0].fname).equal(fname);
                    should(collection1[0].lname).equal(lname);

                    collection1[0].set('lname', 'Jameson');

                    collection1[0].save(function(){

                        TestModel.findAll(function (err, collection2) {
                            should(err).not.be.ok;
                            should(collection2).be.an.Array;

                            should(collection2.length).equal(1);
                            should(collection2[0].fname).equal(fname);
                            should(collection2[0].lname).equal('Jameson');

                            next();

                        });

                    });

                });

            });

        });

    });

    describe('#expire', function(){

        it('should set an expiration', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {

                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);

                instance.expire(60, function(err, success){

                    should(err).not.be.ok;
                    should(success).be.true;

                    instance.ttl(function(err, ttl){

                        should(err).not.be.ok;
                        should(ttl).be.greaterThan(50).and.lessThan(61);

                        next();

                    });

                });

            });

        });

    });

    describe('#expireAt', function(){

        it('should set an expiration using millis', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {

                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);

                var ttl = 1000 * 60 * 60;

                instance.expireAt(Date.now() + ttl, function(err, success){

                    should(err).not.be.ok;
                    should(success).be.true;

                    instance.ttl(function(err, ttl){

                        should(err).not.be.ok;
                        should(ttl).be.greaterThan(ttl - 5).and.lessThan(ttl + 1);

                        next();

                    });

                });

            });

        });

        it('should set an expiration using a string', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {

                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);

                var ttl = 1000 * 60 * 60;

                instance.expireAt(new Date(Date.now() + ttl).toISOString(), function(err, success){

                    should(err).not.be.ok;
                    should(success).be.true;

                    instance.ttl(function(err, ttl){

                        should(err).not.be.ok;
                        should(ttl).be.greaterThan(ttl - 5).and.lessThan(ttl + 1);

                        next();

                    });

                });

            });

        });

        it('should set an expiration using a date', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {

                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);

                var ttl = 1000 * 60 * 60;

                instance.expireAt(new Date(Date.now() + ttl), function(err, success){

                    should(err).not.be.ok;
                    should(success).be.true;

                    instance.ttl(function(err, ttl){

                        should(err).not.be.ok;
                        should(ttl).be.greaterThan(ttl - 5).and.lessThan(ttl + 1);

                        next();

                    });

                });

            });

        });

    });

    describe('#persist', function(){

        it('should clear an expiration', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {

                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);

                instance.expire(60, function(err, success){

                    should(err).not.be.ok;
                    should(success).be.true;

                    instance.ttl(function(err, ttl){

                        should(err).not.be.ok;
                        should(ttl).be.greaterThan(50).and.lessThan(61);

                        instance.persist(function(err, success){

                            should(err).not.be.ok;
                            should(success).be.true;

                            instance.ttl(function(err, ttl){

                                should(err).not.be.ok;
                                should(ttl).eql(-1);

                                next();

                            });

                        });

                    });

                });

            });

        });

    });

    describe('#keys', function(){

        it('should retrieve keys for a Model', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance) {

                should(err).not.be.ok;
                should(instance).be.an.Object;
                should(instance.getPrimaryKey()).be.a.String;
                should(instance.fname).equal(fname);
                should(instance.lname).equal(lname);

                instance.keys(function(err, keys){

                    should(err).not.be.ok;
                    should(keys).be.ok;
                    should(keys).be.an.Array;
                    should(keys.length).eql(1);
                    should(keys).containEql(instance.getPrimaryKey());

                    next();

                });

            });

        });

        it('should retrieve a given number of keys for a Model', function(next) {

            var fname = 'Hello world',
                lname = 'Test';

            TestModel.create({
                fname: fname,
                lname: lname
            }, function(err, instance1) {

                should(err).not.be.ok;
                should(instance1).be.an.Object;
                should(instance1.getPrimaryKey()).be.a.String;
                should(instance1.fname).equal(fname);
                should(instance1.lname).equal(lname);

                TestModel.create({
                    fname: fname,
                    lname: lname
                }, function(err, instance2) {

                    should(err).not.be.ok;
                    should(instance2).be.an.Object;
                    should(instance2.getPrimaryKey()).be.a.String;
                    should(instance2.fname).equal(fname);
                    should(instance2.lname).equal(lname);

                    instance1.keys(function(err, keys){

                        should(err).not.be.ok;
                        should(keys).be.ok;
                        should(keys).be.an.Array;
                        should(keys.length).eql(2);
                        should(keys).containEql(instance1.getPrimaryKey());
                        should(keys).containEql(instance2.getPrimaryKey());

                        instance2.keys(1, function(err, keys){

                            should(err).not.be.ok;
                            should(keys).be.ok;
                            should(keys).be.an.Array;
                            should(keys.length).eql(1);

                            next();

                        });

                    });

                });

            });

        });

    });

    afterEach(function(next){
        TestModel.deleteAll(function(err){
            if(err){
                return next(err);
            }
            TestModel.getConnector().client['flushdb'](next);
        });
    });

});