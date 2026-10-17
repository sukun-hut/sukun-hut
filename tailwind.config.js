/** @type {import('tailwindcss').Config} */
export default {
    content: ['./resources/**/*.blade.php', './resources/**/*.jsx'],
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)', card: 'var(--card)', ink: 'var(--ink)', mut: 'var(--mut)',
                pri: 'var(--pri)', onpri: 'var(--onpri)', acc: 'var(--acc)', line: 'var(--line)', soft: 'var(--soft)',
            },
            fontFamily: {
                sans: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
                display: ['"Baloo Da 2"', '"Hind Siliguri"', 'sans-serif'],
            },
        },
    },
    corePlugins: { preflight: false },
    plugins: [],
};
