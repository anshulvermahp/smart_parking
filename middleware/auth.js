const { getUser } = require("../config/auth");
const Users = require("../models/register");

async function setUserContext(req, res, next) {
    const token = req.cookies?.uuid;
    res.locals.user = null;
    req.user = null;

    if (token) {
        const decoded = getUser(token);
        if (decoded) {
            req.user = decoded;
            res.locals.user = decoded;
        }
    }
    // Prevent caching of session-dependent pages
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
}

async function restricToLoggedInUserOnly(req, res, next) {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
}


function requireRole(role) {
    return (req, res, next) => {
        const token = req.cookies?.uuid;
        const loginRoute = role === 'owner' ? '/owners/owner_login' : '/login';
        if (!token) return res.redirect(loginRoute);
        const decoded = getUser(token);
        if (!decoded) return res.redirect(loginRoute);
        const roles = decoded.roles || (decoded.role ? [decoded.role] : []);
        if (!roles.includes(role)) return res.status(403).redirect("/owners/owner_registration");
        req.user = decoded;
        req.user.roles = roles;
        return next();
    }
}

function requireAnyRole(roles) {
    return (req, res, next) => {
        const token = req.cookies?.uuid;
        if (!token) return res.redirect('/login');
        const decoded = getUser(token);
        if (!decoded) return res.redirect('/login');
        const currentRoles = decoded.roles || (decoded.role ? [decoded.role] : []);
        const allowed = currentRoles.some(r => roles.includes(r));
        if (!allowed) return res.status(403).send('You do not have permission to access this resource');
        req.user = decoded;
        req.user.roles = currentRoles;
        return next();
    }
}


module.exports =
{
    setUserContext,
    restricToLoggedInUserOnly,
    requireRole,
    requireAnyRole
}