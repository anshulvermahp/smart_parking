const users = require("../models/register")
const { setUser } = require("../config/auth");
const bcrypt = require("bcrypt");
async function loginHandler(req, res) {

    let { email, password } = req.body



    if (!email || !password) {
        return res.status(400).render('login', { error: 'Email and password are required', next: req.body.next || '' });
    }
    try {
        try {

            const userdata = await users.findOne({ email });
            if (!userdata) return res.status(401).render('login', { error: 'Invalid credentials', next: req.body.next || '' });

            const isMatch = await bcrypt.compare(password, userdata.password);
            if (!isMatch) return res.status(401).render('login', { error: 'Invalid credentials', next: req.body.next || '' });

            const jwtToken = setUser(userdata);
            // set cookie with httpOnly and 7 day expiry
            res.cookie('uuid', jwtToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

            const redirectTo = req.body.next || '/profile';
            return res.redirect(redirectTo);
        } catch (error) {
            console.log('Login error:', error);
            return res.status(500).render('login', { error: 'Something went wrong, please try again later', next: req.body.next || '' });
        }



    }
    catch (error) {
        console.error("Unexpected error during login:", error)
        return res.status(500).render('login', { error: "Unexpected server error", next: req.body.next || '' });
    }

}


function loginPage(req, res) {
    res.render("login", { next: req.query.next || '' })
}

module.exports =
{
    loginHandler,
    loginPage,
    logoutHandler
}

function logoutHandler(req, res) {
    res.clearCookie('uuid');
    res.redirect('/login');
}
