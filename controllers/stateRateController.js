const StateRate = require('../models/stateRate');

// LEDs: list
exports.state_rate_list = function(req, res, next) {
    StateRate.find()
    .exec(function(err, state_rate_list){
        if(err){ return next(err); }

        let template_context = {
            title: 'State Rates',
            user: req.session.user,
            state_rate_list: state_rate_list
        };

        res.render('state_rate_list', template_context);
    });
};