import { Search, X } from 'lucide-react'

interface SearchRefinerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchRefiner({ value, onChange, placeholder = 'Refine search...' }: SearchRefinerProps) {
  return (
    <div className="relative mb-6">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-4 text-gray-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  )
}
