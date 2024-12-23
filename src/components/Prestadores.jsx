import React from "react";
import Card from "./Card";
import { useSelector } from "react-redux";
import logo from "./assets/VARIANTE-1.png"

const BallSVG = () => (
  <svg viewBox="0 0 76 76" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M66.6 13C66.5 12.9 66.4 12.8 66.4 12.7C59.4 4.9 49.2 0 38 0C26.7 0 16.6 4.9 9.7 12.7C9.6 12.8 9.5 12.9 9.4 13C3.6 19.7 0 28.4 0 38C0 48.3 4.2 57.7 10.9 64.6C11 64.7 11 64.7 11.1 64.8C11.1 64.8 11.1 64.8 11.2 64.9C11.3 65 11.3 65.1 11.4 65.1C18.3 71.8 27.7 76 38 76C59 76 76 59 76 38C76 28.4 72.4 19.7 66.6 13ZM63.1 57.8C55.4 50.9 51.7 44 52.1 37.3C52.7 28.5 60 21.8 63.7 18.9C67.7 24.2 70 30.8 70 38C70 45.5 67.4 52.4 63.1 57.8ZM12.3 18.9C16.1 21.8 23.9 28.7 24.5 37.8C25 44.7 21.2 51.7 13.4 58.6C8.8 53 6 45.8 6 38C6 30.8 8.4 24.2 12.3 18.9ZM17.8 62.8C26.9 54.6 31.2 46.1 30.6 37.4C29.8 26.2 21.2 18.1 16.4 14.5C22.1 9.2 29.7 6 38 6C46.3 6 53.9 9.2 59.6 14.5C55.1 18.1 46.8 26 46.1 36.9C45.5 45.6 49.8 54.1 58.9 62.2C53.3 67 46 70 38 70C30.3 70 23.3 67.3 17.8 62.8Z" fill="#26B24D"/>
  </svg>
);

const Prestadores = () => {
  const prestadores = useSelector((state) => state.reservas.prestadores);

  return (
    <div className="bgPrestador relative min-h-screen">
      <div className="circle circle-1">
        <div className="w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <BallSVG />
        </div>
      </div>
      <div className="circle circle-2">
      <BallSVG />
      </div>
      <div className="circle circle-3">
      <BallSVG />
      </div>

      <div className="cont-Cards">
        {prestadores?.map((prestador) => (
          <Card
            key={prestador?.id}
            prestador={prestador.attributes}
            idPrestador={prestador?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Prestadores;