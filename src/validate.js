module.exports = initials => {
    if (typeof initials !== 'string') return false;
    if (initials.length < 1 || initials.length > 2) return false;
    if (initials.indexOf('<') !== -1) return false;
    return true;
};
