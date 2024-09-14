"use client";
import React, { useEffect, useRef, useState } from 'react';
import ItemLayout from "./ItemLayout";

const AboutDetails = () => {
  const canvasRef = useRef(null);
  const [spinText, setSpinText] = useState('SPIN');
  const [spinBackground, setSpinBackground] = useState('#fff');
  const [spinColor, setSpinColor] = useState('#fff');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');

  const sectors = [
    { color: "#FFBC03", text: "#333333", label: "Sweets" },
    { color: "#FF5A10", text: "#333333", label: "Prize draw" },
    { color: "#FFBC03", text: "#333333", label: "Sweets" },
    { color: "#FF5A10", text: "#333333", label: "Prize draw" },
    { color: "#FFBC03", text: "#333333", label: "Sweets + Prize draw" },
    { color: "#FF5A10", text: "#333333", label: "You lose" },
    { color: "#FFBC03", text: "#333333", label: "Prize draw" },
    { color: "#FF5A10", text: "#333333", label: "Sweets" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / sectors.length;

    let ang = 0;
    let angVel = 0;
    const friction = 0.991;
    let spinButtonClicked = false;

    const getIndex = () => Math.floor(sectors.length - (ang / TAU) * sectors.length) % sectors.length;

    const drawSector = (sector, i) => {
      const ang = arc * i;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = sector.color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, ang, ang + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();
      ctx.translate(rad, rad);
      ctx.rotate(ang + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = sector.text;
      ctx.font = "bold 30px 'Lato', sans-serif";
      ctx.fillText(sector.label, rad - 10, 10);
      ctx.restore();
    };

    const rotate = () => {
      const sector = sectors[getIndex()];
      canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
      setSpinText(!angVel ? "SPIN" : sector.label);
      setSpinBackground(sector.color);
      setSpinColor(sector.text);
    };

    const frame = () => {
      if (!angVel && spinButtonClicked) {
        const finalSector = sectors[getIndex()];
        setResult(`Congratulations! You won: ${finalSector.label}`);
        setShowResult(true);
        spinButtonClicked = false;
        return;
      }

      angVel *= friction;
      if (angVel < 0.002) angVel = 0;
      ang += angVel;
      ang %= TAU;
      rotate();
    };

    const engine = () => {
      frame();
      requestAnimationFrame(engine);
    };

    const init = () => {
      sectors.forEach(drawSector);
      rotate();
      engine();
    };

    init();

    const handleSpin = () => {
      if (!angVel) {
        angVel = Math.random() * (0.45 - 0.25) + 0.25;
      }
      spinButtonClicked = true;
    };

    const spinButton = document.getElementById('spin');
    spinButton.addEventListener('click', handleSpin);

    return () => {
      spinButton.removeEventListener('click', handleSpin);
    };
  }, []);

  return (
    <section className="w-full min-h-screen py-1">
      <div className="grid w-full grid-cols-12 gap-4 xs:gap-6 md:gap-8">
        <ItemLayout className={" col-span-full lg:col-span-8 row-span-2 flex-col items-start"}>
          <h2 className="w-full text-xl text-left capitalize md:text-2xl">Spin the Wheel</h2>
          <div id="spin_the_wheel">
            <canvas ref={canvasRef} id="wheel" width="500" height="500"></canvas>
            <div
              id="spin"
              style={{ background: spinBackground, color: spinColor }}
            >
              {spinText}
            </div>
          </div>
        </ItemLayout>
      </div>
      {showResult && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-transparent rounded-lg shadow-lg backdrop-blur">
            <h3 className="mb-4 text-xl font-bold">Result</h3>
            <p>{result}</p>
            <button
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => setShowResult(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        #spin_the_wheel {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        #wheel {
          display: block;
        }

        #spin {
          font: 1.5em/0 "Lato", sans-serif;
          user-select: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30%;
          height: 30%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 8px currentColor, 0 0px 15px 5px rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          transition: 0.8s;
        }

        #spin::after {
          content: "";
          position: absolute;
          top: -17px;
          border: 10px solid transparent;
          border-bottom-color: currentColor;
          border-top: none;
        }
      `}</style>
    </section>
  );
};

export default AboutDetails;