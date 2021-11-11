const express = require('express');
const compression = require('compression');
const path = require('path');
const textToSVG = require('text-to-svg').loadSync(path.resolve(__dirname, '..', 'font.woff'));
const COLOR = require('./color');
const sharp = require('sharp');
const app = express();
app.use(compression());

const SIZE = 400;
const FONT_SIZE = SIZE * 0.5;
const BASELINE_OFFSET_MULTIPLIER = 0.035;
const HEADERS = {
    'Cache-Control': 'public, max-age=31536000',
};

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args), ...args));

const svg = (initials, color) => {
    const metrics = textToSVG.getMetrics(initials, {
        fontSize: FONT_SIZE,
    });

    const targetWidth = SIZE * 0.9;
    const usedFontSize = metrics.width < targetWidth ? FONT_SIZE : FONT_SIZE * (targetWidth / metrics.width);

    const path = textToSVG.getPath(initials, {
        x: SIZE / 2,
        y: SIZE / 2 + usedFontSize * BASELINE_OFFSET_MULTIPLIER,
        fontSize: usedFontSize,
        anchor: 'center middle',
        attributes: { fill: '#FFFFFF' },
    });

    return `<svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
            <rect
                x="0"
                y="0"
                width="${SIZE}"
                height="${SIZE}"
                fill="${color || '#ffeeee'}"
                stroke-width="0"
            />
            ${path}
    </svg>`;
};

const toSvg = (req, res) => {
    const { initials, index } = req.params;
    const color = COLOR[index];
    return svg(initials, color);
};

const handleSvg = compose(
    (avatar, req, res) => {
        res.type('image/svg+xml')
            .set(HEADERS)
            .send(avatar);
    },
    toSvg
);

const handlePng = compose(
    (avatarPromise, svg, req, res) => {
        avatarPromise
            .then(avatar =>
                res
                    .type('image/png')
                    .set(HEADERS)
                    .send(avatar)
            )
            .catch(err => res.status(500).send(err));
    },
    avatarSvg => {
        return sharp(Buffer.from(avatarSvg))
            .png()
            .toBuffer();
    },
    toSvg
);

const isValid = (req, res, next) => {
    const isValid = (() => {
        const { initials } = req.params;
        if (typeof initials !== 'string') return false;
        if (initials.length < 1 || initials.length > 2) return false;
        return true;
    })();
    if (!isValid) {
        res.status(400).send('Invalid requests parameters');
        return;
    }
    next();
};

app.get('/api/avatars/:index/:initials.svg', isValid, handleSvg);

app.get('/api/avatars/:index/:initials.png', isValid, handlePng);

module.exports = app;
