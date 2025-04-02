"use client"; // Necesario para usar useRef en Next.js

import { useRef } from "react";

export default function SoundButton({ haikuId, updateHaikuTime }) {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <form action={updateHaikuTime} className="flex items-center flex-col justify-center">
      {/* Campo oculto con el ID del Haiku */}
      <input name="id" type="hidden" defaultValue={haikuId} />

      {/* Botón con imagen de sprite y funcionalidad de audio */}
      <button
        type="submit"
        onClick={playSound}
        className="bg-red-600 rounded-full w-[190px] h-[180px] text-white font-semibold p-6 text-4xl flex flex-col justify-center items-center
        bg-[url('https://www.myinstants.com/media/images/transparent_button_sprite.png')] 
        bg-[-10px_-12px] active:bg-[-220px_-12px] border-none cursor-pointer"
      >
        <div className="w-[110px] h-[100px] overflow-hidden rounded-full"></div>
      </button>

      {/* Elemento de audio oculto */}
      <audio ref={audioRef} src="https://www.myinstants.com/media/sounds/red-circle-meme.mp3" />
    </form>
  );
}
