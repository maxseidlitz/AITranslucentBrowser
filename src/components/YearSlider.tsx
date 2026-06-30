import { useState, useEffect } from 'react'

interface YearSliderProps {
  min: number
  max: number
  onSelect: (range: [number, number]) => void
}

export default function YearSlider({ min, max, onSelect }: YearSliderProps) {
  const [minYear, setMinYear] = useState(min)
  const [maxYear, setMaxYear] = useState(max)

  useEffect(() => {
    onSelect([minYear, maxYear])
  }, [minYear, maxYear, onSelect])

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-4 text-gray-200">Year Range</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 block mb-2">From: {minYear}</label>
          <input
            type="range"
            min={2000}
            max={2026}
            value={minYear}
            onChange={(e) => setMinYear(Math.min(parseInt(e.target.value), maxYear))}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-2">To: {maxYear}</label>
          <input
            type="range"
            min={2000}
            max={2026}
            value={maxYear}
            onChange={(e) => setMaxYear(Math.max(parseInt(e.target.value), minYear))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </div>
  )
}
