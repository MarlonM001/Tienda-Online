import { Music, Music2 } from "lucide-react";
import { useAmbientMusic } from "../../hooks/useAmbientMusic";

export default function AmbientMusicButton() {
  const { playing, toggle, volume, setVolume } = useAmbientMusic();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        title={playing ? "Pausar música ambiental" : "Reproducir música ambiental"}
        className={
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition " +
          (playing
            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800")
        }
      >
        {playing ? <Music2 className="h-4 w-4 animate-pulse" /> : <Music className="h-4 w-4" />}
        {playing ? "Sonando" : "Música"}
      </button>
      {playing && (
        <input
          type="range"
          min={0}
          max={0.4}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 accent-blue-600"
          aria-label="Volumen"
        />
      )}
    </div>
  );
}
