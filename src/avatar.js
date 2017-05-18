const path = require('path');
const textToSVG = require('text-to-svg').loadSync(path.resolve(__dirname, 'font.woff'));
const SIZE = 400;
const FONT_SIZE = SIZE * 0.5;

const text = initials =>
    textToSVG.getPath(initials, {
        x: FONT_SIZE,
        y: FONT_SIZE,
        fontSize: FONT_SIZE,
        anchor: 'center middle',
        attributes: { fill: '#FFFFFF' },
    });
const svg = (text, color) =>
    `<svg
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
            ${text}
    </svg>`;

module.exports = (initials, color) => svg(text(initials), color);
