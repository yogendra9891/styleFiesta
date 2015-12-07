var seraph = require('seraph');
var config = require('config');
var lodash = require('lodash');
var async = require('async');
var appUtils = require('./appUtils');
var logger  = require('./logger');

// create global db connections
var neoDB = seraph(config.get("neo4j"));

/**
 * Utility add-on function for seraph's find() function.
 * Parameters are exactly same as find(), but the callback is called with first node returned, or undefined.
 */
neoDB.findOne = function(){

    var args = [];
    for(var i = 0 ; i < arguments.length; i++){
        args.push(arguments[i]);
    }

    // try find callback from arguments and wrap it in our function.
    var index = lodash.findLastIndex(args,lodash.isFunction);
    if(index > -1){
        var cb = args[index];
        args[index] = function(err,nodes){
            cb(err, (nodes && nodes.length > 0) ? nodes[0] : undefined);
        };
    }

    // call find as usual
    neoDB.find.apply(neoDB.find,args);
};

/**
 * Utility add-on function for seraph's query() function.
 * Parameters are exactly same as query(), but the callback is called with first result returned, or undefined.
 */
neoDB.queryFirst = function(){

    var args = [];
    for(var i = 0 ; i < arguments.length; i++){
        args.push(arguments[i]);
    }

    // try find callback from arguments and wrap it in our function.
    var index = lodash.findLastIndex(args,lodash.isFunction);
    if(index > -1){
        var cb = args[index];
        args[index] = function(err,nodes){
            cb(err, (nodes && nodes.length > 0) ? nodes[0] : undefined);
        };
    }

    // call find as usual
    neoDB.query.apply(neoDB.query,args);
};

/**
 * Run query for a page of results using skip and limit values.
 * The result to callback is an object that contains skip,limit,hasPrev,hasNext and objects array (query results).
 * NOTE 1: the last part of provided query should NOT have SKIP and LIMIT clause, as these will be added by this function.
 * NOTE 2: The query must NOT use {skp} and {lmt} as query params, as these are added and used by this function.
 * @param {String} query - cypher query.
 * @param {Object} params - query params object, or an empty object. This is always required.
 * @param {Number} skip - skip this many records.
 * @param {Number} limit - limit records to this much.
 * @param {function(Error,{count:number,skip:number,limit:number,hasPrev:boolean,hasNext:boolean,objects:[*]})} callback - callback function.
 */
neoDB.queryPage = function(query,params,skip,limit,callback){
    // sanitize value as per app constraints
    skip = appUtils.ensureSkip(skip);
    limit = appUtils.ensureLimit(limit);

    // param values
    var skp = skip;
    var lmt = limit;

    // fetch one extra record from both ends of results
    if(skip > 0){
        skp--;
    }
    lmt++;

    query += ' SKIP {skp} LIMIT {lmt}';
    params = lodash.assign(params,{skp:skp,lmt:lmt});

    neoDB.query(query,params,function(err,results){
        if(err){
            callback(err,undefined);
        }else{
            var hasPrev = false;
            var hasNext = false;

            if(skp < skip){
                // there will always be previous if skip > 0 and we got some records.
                hasPrev = results.length > 0;

                // drop first record, if an extra was fetched before start point.
                results.shift();
            }


            if(results.length > limit){
                // there will be an extra record at the end as well, if we got more than we asked for.
                hasNext = true;

                //drop last record, if an extra was fetched after end point.
                results.pop();
            }

            // add metadata and return results.
            callback(undefined,{
                count:results.length,
                skip:skip,
                limit:limit,
                hasPrev:hasPrev,
                hasNext:hasNext,
                objects:results
            })
        }
    })

};

/**
 * Find a node by id and label.
 * @param {Number} id - node id.
 * @param {String} label - node label.
 * @param {function(Error,Object)} callback - callback function.
 */
neoDB.findByIdAndLabel = function(id,label,callback){

    if(!lodash.isString(label)){
        throw new Error("label should be a string.")
    }

    if(!lodash.isFunction(callback)){
        throw new Error("callback should be a function.")
    }

    var query = [
        ' MATCH (n:',label,')',
        ' WHERE id(n) = {nid}',
        ' RETURN n LIMIT 1 '
    ].join('');

    var params = {nid:appUtils.ensureId(id)};

    neoDB.queryFirst(query, params, callback);
};

/**
 * Creates indexes for given label and key(s) if not already existing.
 * @param {String} label - node label.
 * @param {String|[String]} keys - key or array of keys.
 * @param {function(Error)} [callback] - optional callback.
 */
neoDB.ensureIndexes = function(label,keys,callback){
    // covert to array if not.
    if(!lodash.isArray(keys)){
        keys = [keys];
    }

    // create indexes if not already created.
    async.eachSeries(keys,
        function(key,cb){
            neoDB.index.createIfNone(label,key,cb);
        },
        function(err){
            if(err){
                logger.error('INDEX','Error initiating index',err);
            }else{
                logger.info('INDEX','Index on label: ' + label + ' for keys: '+keys.join(','));
            }
            if(callback){
                callback(err);
            }
        }
    );
};

// define module
var dbUtils = {};
module.exports = dbUtils;

/**
 * Returns Neo4j DB driver instance
 * @return {Seraph|*}
 */
dbUtils.getNeoDB = function(){
    return neoDB;
};

