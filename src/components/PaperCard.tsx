import { ExternalLink, BookOpen, Users, Calendar } from 'lucide-react'

interface Author {
  name: string
}

interface PaperCardProps {
  paper: {
    paperId: string
    title: string
    authors: Author[]
    year: number
    venue: string
    citationCount: number
    url: string
    abstract?: string
  }
}

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors p-6">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="font-semibold text-lg line-clamp-2 flex-1">{paper.title}</h3>
        <a
          href={paper.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          <ExternalLink size={18} className="text-blue-400" />
        </a>
      </div>

      <div className="space-y-3">
        {/* Authors */}
        <div className="flex items-start gap-2">
          <Users size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-400">
            {paper.authors.slice(0, 3).map((a) => a.name).join(', ')}
            {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
          </div>
        </div>

        {/* Year & Venue */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {paper.year}
          </div>
          {paper.venue && (
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              {paper.venue}
            </div>
          )}
        </div>

        {/* Citations */}
        <div className="text-sm text-gray-500">
          {paper.citationCount} citations
        </div>

        {/* Abstract */}
        {paper.abstract && (
          <p className="text-sm text-gray-400 line-clamp-3">{paper.abstract}</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors">
          View Paper
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors">
          Save
        </button>
      </div>
    </div>
  )
}
