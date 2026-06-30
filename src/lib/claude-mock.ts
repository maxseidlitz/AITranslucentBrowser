// Mock Claude API for local development/testing

export async function generateGenerativeUIMock(request: any) {
  const context = request.context
  const data = request.data

  if (context === 'search') {
    const query = data.query
    const papers = data.papers || []

    const papersHtml = papers
      .slice(0, 5)
      .map(
        (p: any) => `
      <div class="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">${p.title || 'Untitled'}</h3>
        <p class="text-sm text-gray-600 mb-3">
          ${(p.authors || []).slice(0, 3).join(', ')}
          ${p.authors && p.authors.length > 3 ? `+${p.authors.length - 3}` : ''}
          <span class="ml-2">• ${p.year || 'N/A'}</span>
        </p>
        ${p.abstract ? `<p class="text-sm text-gray-700 mb-3 line-clamp-2">${p.abstract}</p>` : ''}
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>${p.citations || 0} citations</span>
          <a href="${p.url || '#'}" target="_blank" class="text-blue-600 hover:underline">View Paper →</a>
        </div>
      </div>
    `
      )
      .join('')

    const html = `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width: 900px; margin: 0 auto; }
  </style>
</head>
<body class="py-8">
  <div class="container px-4">
    <div class="bg-white rounded-lg shadow-xl p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
      <p class="text-gray-600 mb-4">Query: <span class="font-semibold">"${query}"</span></p>

      <div class="flex gap-2 flex-wrap mb-6">
        <input type="text" placeholder="Refine search..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Search</button>
      </div>

      <div class="grid grid-cols-3 gap-2 mb-6">
        <div class="text-sm">
          <label class="flex items-center gap-2">
            <input type="checkbox" checked class="w-4 h-4"> Semantic Scholar
          </label>
        </div>
        <div class="text-sm">
          <label class="flex items-center gap-2">
            <input type="checkbox" checked class="w-4 h-4"> arXiv
          </label>
        </div>
        <div class="text-sm">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4"> CrossRef
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Papers</h2>
      ${papersHtml}
    </div>
  </div>
</body>
</html>
    `

    return {
      html,
      css: '',
      success: true,
    }
  }

  // Website context
  const title = data.title || 'Website'
  const url = data.url || '#'
  const content = (data.content || '').substring(0, 300)

  const html = `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow-lg">
      <div class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">${title}</h1>
        <p class="text-sm text-blue-100">${url}</p>
      </div>
      <div class="p-6">
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-700 leading-relaxed">${content}...</p>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-200">
          <a href="${url}" target="_blank" class="text-blue-600 hover:underline font-medium">
            Visit Original Website →
          </a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `

  return {
    html,
    css: '',
    success: true,
  }
}
