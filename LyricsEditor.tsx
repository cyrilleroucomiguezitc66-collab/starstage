import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Lyric } from '../types';

interface LyricsEditorProps {
  sessionId: string;
  lyrics: Lyric[];
  onLyricsUpdate: (lyrics: Lyric[]) => void;
}

interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
}

export default function LyricsEditor({ sessionId, lyrics, onLyricsUpdate }: LyricsEditorProps) {
  const [lines, setLines] = useState<LyricLine[]>([
    { text: '', startTime: 0, endTime: 0 }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lyrics.length > 0) {
      setLines(lyrics.map(lyric => ({
        text: lyric.line_text,
        startTime: Math.floor(lyric.start_time / 1000),
        endTime: Math.floor(lyric.end_time / 1000)
      })));
    }
  }, [lyrics]);

  const addLine = () => {
    setLines([...lines, { text: '', startTime: 0, endTime: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof LyricLine, value: string | number) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string): number => {
    const [mins, secs] = timeStr.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
  };

  const saveLyrics = async () => {
    setIsSaving(true);
    try {
      await supabase
        .from('lyrics')
        .delete()
        .eq('session_id', sessionId);

      const lyricsData = lines
        .filter(line => line.text.trim())
        .map((line, index) => ({
          session_id: sessionId,
          line_text: line.text,
          start_time: line.startTime * 1000,
          end_time: line.endTime * 1000,
          line_order: index
        }));

      if (lyricsData.length > 0) {
        const { data, error } = await supabase
          .from('lyrics')
          .insert(lyricsData)
          .select();

        if (error) throw error;
        if (data) onLyricsUpdate(data);
      }

      alert('Paroles enregistrées avec succès!');
    } catch (error) {
      console.error('Error saving lyrics:', error);
      alert('Erreur lors de la sauvegarde des paroles');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Paroles Karaoké</h3>
        <button
          onClick={saveLyrics}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {lines.map((line, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={line.text}
                onChange={(e) => updateLine(index, 'text', e.target.value)}
                placeholder="Texte de la ligne..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formatTime(line.startTime)}
                onChange={(e) => updateLine(index, 'startTime', parseTime(e.target.value))}
                placeholder="00:00"
                className="w-20 px-2 py-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="py-2">-</span>
              <input
                type="text"
                value={formatTime(line.endTime)}
                onChange={(e) => updateLine(index, 'endTime', parseTime(e.target.value))}
                placeholder="00:05"
                className="w-20 px-2 py-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => removeLine(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addLine}
        className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-500 hover:text-blue-600"
      >
        <Plus className="w-5 h-5" />
        Ajouter une ligne
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 Format de temps: MM:SS (ex: 00:30 pour 30 secondes)</p>
      </div>
    </div>
  );
}