import { Mic, Volume2, Music } from 'lucide-react';

interface KaraokeControlsProps {
  vocalReduction: number;
  pitchAdjustment: number;
  onVocalReductionChange: (value: number) => void;
  onPitchAdjustmentChange: (value: number) => void;
}

export default function KaraokeControls({
  vocalReduction,
  pitchAdjustment,
  onVocalReductionChange,
  onPitchAdjustmentChange
}: KaraokeControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Music className="w-5 h-5 text-blue-600" />
        Contrôles Karaoké
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Volume2 className="w-4 h-4" />
              Réduction vocale
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {vocalReduction}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={vocalReduction}
            onChange={(e) => onVocalReductionChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Réduit les voix dans l'audio original
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mic className="w-4 h-4" />
              Ajustement de tonalité
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {pitchAdjustment > 0 ? '+' : ''}{pitchAdjustment} demi-tons
            </span>
          </div>
          <input
            type="range"
            min="-12"
            max="12"
            value={pitchAdjustment}
            onChange={(e) => onPitchAdjustmentChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-12</span>
            <span>0</span>
            <span>+12</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">💡 Conseils</p>
        <ul className="text-xs space-y-1 ml-4 list-disc">
          <li>Réduction vocale: Augmentez pour chanter sur l'instrumental</li>
          <li>Tonalité: Ajustez selon votre tessiture vocale</li>
        </ul>
      </div>
    </div>
  );
}