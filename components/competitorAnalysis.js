import { extractKeywords } from './seoAnalysis.js';

export function generateSimulatedCompetitorKeywords(userKeywords) {
  const competitorKeywords = new Set(userKeywords);
  userKeywords.forEach(keyword => {
    if (keyword.length > 4) {
      competitorKeywords.add(keyword + 's');
      competitorKeywords.add(keyword.slice(0, -1));
    }
    competitorKeywords.add(keyword + ' analysis');
  });
  return Array.from(competitorKeywords);
}

export function compareCompetitor(competitorUrlInput, productTitleInput, competitorResults) {
  const competitorUrl = competitorUrlInput.value.trim();
  if (!competitorUrl) return showError('Please enter a competitor URL.');

  // Basic URL validation
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(competitorUrl)) {
    return showError('Please enter a valid competitor URL.');
  }

  const userKeywords = extractKeywords(productTitleInput.value).uniqueKeywords;
  const simulatedCompetitorKeywords = generateSimulatedCompetitorKeywords(userKeywords);
  const missingKeywords = simulatedCompetitorKeywords.filter(keyword => !userKeywords.some(userKeyword => userKeyword.toLowerCase() === keyword.toLowerCase()));
  displayCompetitorResults(missingKeywords, competitorResults);
}

export function displayCompetitorResults(missingKeywords, competitorResults) {
  competitorResults.innerHTML = missingKeywords.length === 0
    ? '<p>Your keywords cover the same topics as the competitor.</p>'
    : `<h3>Missing Competitor Keywords:</h3><ul>${missingKeywords.map(keyword => `<li>${keyword}</li>`).join('')}</ul>`;
}
