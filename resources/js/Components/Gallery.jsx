import { useRef, useState } from 'react';

export default function Gallery({ images, emoji, hue, alt }) {
    const ref = useRef(null);
    const [i, setI] = useState(0);
    const list = images.length ? images : [null];
    const go = (d) => ref.current.scrollBy({ left: d * ref.current.clientWidth, behavior: 'smooth' });
    const onScroll = () => setI(Math.round(ref.current.scrollLeft / ref.current.clientWidth));

    return (
        <div className="gal">
            <div className="sl" ref={ref} onScroll={onScroll}>
                {list.map((s, k) => (s
                    ? <img key={k} src={s} alt={alt} />
                    : <div key={k} style={{ background: `hsl(${hue} 45% 88%)` }}>{emoji || '🛍️'}</div>))}
            </div>
            {list.length > 1 && (
                <>
                    <button className="ar l" onClick={() => go(-1)} aria-label="আগের ছবি">‹</button>
                    <button className="ar r" onClick={() => go(1)} aria-label="পরের ছবি">›</button>
                    <div className="dots">{list.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
                </>
            )}
        </div>
    );
}
