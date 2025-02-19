// Stop Words
const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with', 'this',
  'your', 'you', 'they', 'or', 'but', 'not', 'what', 'which', 'their', 'there', 'have', 'has', 'can',
  'should', 'could', 'we']);

// Simulated Grammar Check
export function performGrammarCheck(text) {
  const errors = [];
  if (text.includes('a an')) errors.push({ message: 'Possible grammar error: use "a" or "an" correctly.' });
  if (text.length > 200) return { errors, suggestions: ['Shorten text for better readability.'] };
  return { errors, suggestions: [] };
}

export function extractKeywords(text) {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s,]/g, ''); // Remove special characters and punctuation
  const words = cleanText.split(/[\s,]+/);
  const keywords = words.filter(word => !stopWords.has(word) && word.length > 2);
  return { keywords, uniqueKeywords: [...new Set(keywords)] };
}

// SEO Analysis Function (Placeholder)
export function analyzeSEO() {
  // Placeholder for SEO analysis logic
  return {message: 'SEO Analysis Completed!'};
}
