export default function Thumb({ src, emoji, alt = '' }) {
    return src ? <img src={src} alt={alt} loading="lazy" /> : <span aria-hidden="true">{emoji || '🛍️'}</span>;
}
