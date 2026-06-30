interface SourceFilterProps {
  sources: string[]
  selected: string[]
  onSelect: (selected: string[]) => void
}

export default function SourceFilter({ sources, selected, onSelect }: SourceFilterProps) {
  const toggleSource = (source: string) => {
    if (selected.includes(source)) {
      onSelect(selected.filter((s) => s !== source))
    } else {
      onSelect([...selected, source])
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 text-gray-200">Sources</h3>
      <div className="space-y-2">
        {sources.map((source) => (
          <label key={source} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(source)}
              onChange={() => toggleSource(source)}
              className="rounded bg-gray-700 border-gray-600 text-blue-600 accent-blue-600 cursor-pointer"
            />
            <span className="text-sm text-gray-300 group-hover:text-gray-100">{source}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
