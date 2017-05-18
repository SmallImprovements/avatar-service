module.exports = initials => {
    if (typeof initials !== 'string') return false;
    if (initials.length < 1 || initials.length > 2) return false;
    return true;
};
