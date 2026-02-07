const users = require('../models/register');
const { getUser } = require('../config/auth');

async function homePage(req, res) {
    // res.locals.user is already set by setUserContext middleware
    // We can just render, or fetch more details if needed
    try {
        // If we want fresh data from DB for the home page anyway:
        if (req.user && req.user.id) {
            const user = await users.findById(req.user.id).lean();
            if (user) res.locals.user = user;
        }
        res.render('home');
    } catch (err) {
        console.error('Error rendering home page:', err);
        res.render('home'); // res.locals.user still exists from token
    }
}

module.exports = {
    homePage
}