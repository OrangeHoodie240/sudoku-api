const jsonwebtoken = require('jsonwebtoken');
const ExpressError = require('../ExpressError');
const config = require('../config');

/**
 * Middleware. Searches req.query and req.body for a token. If a token is found it is verified and its payload attached to 
 * req.query as req.query.token. If the verification fails an error is thrown. If no token is found it returns next()
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function searchForToken(req, res, next){
    let token = req.query.token || req.body.token;
    if(token){
        try{
            token = jsonwebtoken.verify(token, config.secretKey);
            req.query.token = token;
        }
        catch(err){
            return next(new ExpressError("Invalid Token", 400));
        }
    }
    return next(); 
}


/**
 * Requires req.token to be present. Throw an exception if not, otherwise returns next()
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function authenticate(req, res, next){
    if(!req.query.token){
        return next(new ExpressError('Authentication required', 400));
    }
    return next();
}


/**
 * Requires the id on the token to match the id in the query string
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function requireExactUser(req, res, next){
    let userId = req.token.id;
    let queryStringId = req.query.id;  
    if(userId !== queryStringId){
        return next(new ExpressError('Error! Authentication Required', 400));
    }
    return next();
}

module.exports = {searchForToken, authenticate, requireExactUser};