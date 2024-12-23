import React, { useEffect, useState } from 'react';

const TypingHero = () => {
  const [text, setText] = useState('');
  const fullText = "Reservá tu cancha de padel en Bahía Blanca con un solo click";
  const typingSpeed = 50;

  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [text]);

  return (
    <div className="min-h-[200px] flex items-center justify-center px-4" style={{marginBottom:"2rem"}}>
      <h1 className="text-4xl md:text-5xl font-bold"  >
        {text}
        <span className="animate-pulse" >|</span>
      </h1>
    </div>
  );
};

export default TypingHero;