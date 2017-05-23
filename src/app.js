const express = require('express');
const app = express();
const path = require('path');
const textToSVG = require('text-to-svg').loadSync(path.resolve(__dirname, 'font.woff'));
const COLOR = require('./color');

const SIZE = 400;
const FONT_SIZE = SIZE * 0.5;

const svg = (initials, color) => {
    const path = textToSVG.getPath(initials, {
        x: FONT_SIZE,
        y: FONT_SIZE,
        fontSize: FONT_SIZE,
        anchor: 'center middle',
        attributes: { fill: '#FFFFFF' },
    });
    return `<svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 ${SIZE} ${SIZE}">
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

module.exports = app.get(
    '/:index/:initials.svg',
    (req, res, next) => {
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
    },
    (req, res) => {
        const { initials, index } = req.params;
        const color = COLOR[index];
        const avatar = svg(initials, color);
        res.type('image/svg+xml').send(avatar);
    }
);
