const isLogin = (req, res, next) => {
    if (!req.session.user) { 
        res.render('login');
    } else next();
};

module.exports = { isLogin };