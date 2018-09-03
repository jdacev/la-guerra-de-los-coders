module.exports = function(app) {

 require('../routes/users')(app);
 require('../routes/engines')(app);
}