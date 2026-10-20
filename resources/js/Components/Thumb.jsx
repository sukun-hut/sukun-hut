import { Icon } from './Icons';

export default function Thumb({ src, emoji, alt = '' }) {
    if (src) {
        return <img src={src} alt={alt} loading="lazy" />;
    }
    if (emoji) {
        return <span aria-hidden="true">{emoji}</span>;
    }
    return <Icon name="shopping-bag" size={26} color="var(--pri)" />;
}
