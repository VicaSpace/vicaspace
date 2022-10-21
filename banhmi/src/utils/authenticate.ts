const requireAuth = function(req, res, next) {
    // TODO: check auth here
    // res.status(403).send({'error': 'Not Authenticated'})
    next();
}

export default requireAuth