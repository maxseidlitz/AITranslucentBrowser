const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const API_URL = 'https://api.anthropic.com/v1/messages'

interface GenerativeUIRequest {
  context: 'search' | 'website'
  data: Record<string, any>
  userQuery?: string
  websiteTitle?: string
}

interface GenerativeUIResponse {
  html: string
  css: string
  success: boolean
  error?: string
}

const SEARCH_PROMPT = `You are a UI designer. Generate a modern, dark-themed HTML + CSS UI for displaying academic paper search results.

Input data structure:
{
  "query": "user search query",
  "papers": [{"title": "...", "authors": [...], "year": 2024, "abstract": "...", "url": "...", "citations": 42}]
}

Requirements:
- Generate ONLY valid HTML/CSS (no JavaScript)
- Use Tailwind CSS classes (dark theme: bg-gray-800, text-white, etc.)
- Create a card-based layout for papers
- Include a search refinement bar at top
- Add filter sidebar (sources, year range)
- Responsive design
- NO external dependencies except Tailwind CDN link in <head>
- Embed CSS in <style> tag

Output format:
<html>
<head>
<style>/* Your CSS here */</style>
</head>
<body>
/* Your HTML here */
</body>
</html>`

const WEBSITE_PROMPT = `You are a UI designer specializing in data extraction and presentation.

Generate a modern HTML + CSS UI that extracts and displays key information from website content.

Input:
{
  "title": "website title",
  "url": "website URL",
  "content": "website text content (first 2000 chars)"
}

Requirements:
- Generate ONLY valid HTML/CSS (no JavaScript)
- Use Tailwind CSS (dark theme)
- Extract key sections from content and present in visual hierarchy
- Add back button and URL bar at top
- Include search/filter functionality if applicable
- NO external JS dependencies
- Embed CSS in <style> tag

Output format:
<html>
<head>
<style>/* CSS here */</style>
</head>
<body>
/* HTML here */
</body>
</html>`

// Fallback mock generator
async function generateMockUI(request: GenerativeUIRequest): Promise<GenerativeUIResponse> {
  const { generateGenerativeUIMock } = await import('./claude-mock')
  return generateGenerativeUIMock(request)
}

export async function generateGenerativeUI(
  request: GenerativeUIRequest
): Promise<GenerativeUIResponse> {
  if (!API_KEY) {
    console.warn('Claude API key not configured. Using mock UI.')
    return generateMockUI(request)
  }

  const prompt =
    request.context === 'search'
      ? `${SEARCH_PROMPT}\n\nGenerate UI for this data: ${JSON.stringify(request.data)}`
      : `${WEBSITE_PROMPT}\n\nGenerate UI for: ${JSON.stringify(request.data)}`

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Claude API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text || ''

    // Extract HTML from response
    const htmlMatch = content.match(/<html[\s\S]*<\/html>/i)
    if (!htmlMatch) {
      throw new Error('No valid HTML found in response')
    }

    return {
      html: htmlMatch[0],
      css: '',
      success: true,
    }
  } catch (error) {
    return {
      html: '',
      css: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
