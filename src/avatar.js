const SIZE = 400;

module.exports = (initials, color) =>
    `<svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 ${SIZE} ${SIZE}">
            <rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="${color || '#ffeeee'}" stroke-width="0" />
            <text x="50%" y="68%" text-anchor="middle" fill="white" font-family="Helvetica, Arial, sans-serif" font-size="${SIZE * 0.5}">${initials}</text>
    </svg>`;
