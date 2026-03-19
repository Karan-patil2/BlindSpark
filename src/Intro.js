import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import fireAnimationData from './animations/fire.json';
import './Intro.css';

export default function Intro() {
  const [fireVisible, setFireVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [glowVisible, setGlowVisible] = useState(false);
  const [ctaVisible,  setCtaVisible]  = useState(false);
  const [tagVisible,  setTagVisible]  = useState(false);
  const [firePos,     setFirePos]     = useState(null);

  // explosion
  const [fireSize,    setFireSize]    = useState({ w: 60, h: 60 });
  const [fireOffset,  setFireOffset]  = useState({ x: 0, y: 0 });
  const [orangeFlood, setOrangeFlood] = useState(false);
  const [blackFlood,  setBlackFlood]  = useState(false);

  const containerRef = useRef(null);
  const iRef         = useRef(null);
  const navigate     = useNavigate();

  const measureI = () => {
    if (!iRef.current || !containerRef.current) return;
    const iRect = iRef.current.getBoundingClientRect();
    const cRect = containerRef.current.getBoundingClientRect();
    const cx     = iRect.left + iRect.width  / 2 - cRect.left;
    const topOfI = iRect.top  - cRect.top;
    setFirePos({ left: cx - 30 - 6, top: topOfI - 60 });
  };

  useEffect(() => {
    measureI();
    window.addEventListener('resize', measureI);
    const t1 = setTimeout(() => { setFireVisible(true); setGlowVisible(true); }, 2000);
    const t2 = setTimeout(() => setTextVisible(true), 2700);
    const t3 = setTimeout(() => setTagVisible(true),  4200);
    const t4 = setTimeout(() => setCtaVisible(true),  5000);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      window.removeEventListener('resize', measureI);
    };
  }, []);

  const handleEnter = () => {
    if (!firePos || !containerRef.current) return;

    const cRect  = containerRef.current.getBoundingClientRect();
    const screenW = cRect.width;
    const screenH = cRect.height;

    // Current fire center
    const fireCX = firePos.left + 30;
    const fireCY = firePos.top  + 30;

    // We grow the fire to cover the full screen
    // Final size needs to be big enough to fill screen from fire's position
    const maxDim = Math.max(screenW, screenH) * 2.8;

    // Step 1 — start growing fire smoothly over 1s
    setFireSize({ w: maxDim, h: maxDim });
    // Recentre the fire div as it grows (keep it centred on the "I")
    setFireOffset({
      x: fireCX - maxDim / 2,
      y: fireCY - maxDim / 2,
    });

    // Step 2 — once fire fills screen, flood orange (at 0.9s)
    setTimeout(() => setOrangeFlood(true), 900);

    // Step 3 — fade to black (at 1.6s)
    setTimeout(() => setBlackFlood(true), 1600);

    // Step 4 — navigate (at 2.4s)
    setTimeout(() => navigate('/login'), 2400);
  };

  // Where the fire div should be positioned
  const fireStyle = fireOffset.x !== 0
    ? { left: fireOffset.x, top: fireOffset.y }
    : firePos
      ? { left: firePos.left, top: firePos.top }
      : {};

  return (
    <div className="intro-container" ref={containerRef}>

      {/* Orange flood overlay */}
      <div className={`orange-flood ${orangeFlood ? 'visible' : ''} ${blackFlood ? 'to-black' : ''}`} />

      {/* Ambient glow */}
      {firePos && (
        <div
          className={`ambient-glow ${glowVisible ? 'visible' : ''}`}
          style={{ left: firePos.left + 30, top: firePos.top + 30 }}
        />
      )}

      {/* Brand */}
      <div className="brand-wrapper">
        <span className={`brand-name ${textVisible ? 'fade-in' : ''}`}>
          BL
          <span className="letter-i-anchor" ref={iRef}>I</span>
          NDSPARK
        </span>
      </div>

      {/* Fire — grows from dot size to full screen */}
      {firePos && (
        <div
          className={`fire-wrapper ${fireVisible ? 'visible' : ''}`}
          style={{
            ...fireStyle,
            width:  fireSize.w,
            height: fireSize.h,
            transition: fireSize.w > 60
              ? 'width 1s cubic-bezier(0.4, 0, 0.2, 1), height 1s cubic-bezier(0.4, 0, 0.2, 1), left 1s cubic-bezier(0.4, 0, 0.2, 1), top 1s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
          }}
        >
          <Lottie
            animationData={fireAnimationData}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Tagline */}
      <p className={`tagline ${tagVisible ? 'visible' : ''}`}>
        Ignite your edge
      </p>

      {/* Enter CTA */}
      <div className={`enter-cta ${ctaVisible ? 'visible' : ''}`}>
        <div className="pulse-line" />
        <button className="enter-btn" onClick={handleEnter}>
          Enter
        </button>
      </div>

    </div>
  );
}
