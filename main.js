import { extractKeywords, performGrammarCheck, analyzeSEO } from './components/seoAnalysis.js';
import { updateSnippetPreview } from './components/snippetPreview.js';
import { generateSimulatedCompetitorKeywords, compareCompetitor, displayCompetitorResults } from './components/competitorAnalysis.js';
import { debounce } from './utils/utility.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const analyzeButton = document.getElementById('analyze-button');
  const productTitleInput = document.getElementById('product-title');
  const bulletPointsInput = document.getElementById('bullet-points');
  const seoResults = document.getElementById('seo-results');
  const titleCharCount = document.getElementById('title-char-count');
  const previewTitle = document.getElementById('preview-title');
  const previewSalesPoints = document.getElementById('preview-sales-points');
  const competitorUrlInput = document.getElementById('competitor-url');
  const compareButton = document.getElementById('compare-button');
  const competitorResults = document.getElementById('competitor-results');
  const snippetTitle = document.getElementById('snippet-title');
  const snippetDescription = document.getElementById('snippet-description');

  // SEO Recommendations
  const SEO_RECOMMENDATIONS = {
    titleMaxLength: 70,
    bulletMaxLength: 200,
    idealBulletCount: { min: 3, max: 7 }
  };

  // Update Character Count
  function updateTitleCharCount() {
    const titleLength = productTitleInput.value.length;
    titleCharCount.textContent = `${titleLength}/70`;
    titleCharCount.classList.toggle('warning', titleLength > 70);
  }

  // Display Errors
  function showError(message) {
    seoResults.innerHTML = `<div class="error" role="alert"><h3>Error!</h3><p>${message}</p></div>`;
  }

  // Event Listeners with Debounce
  productTitleInput.addEventListener('input', debounce(updateTitleCharCount, 100));
  productTitleInput.addEventListener('input', debounce(() => updateSnippetPreview(productTitleInput, bulletPointsInput, snippetTitle, snippetDescription), 100));
  bulletPointsInput.addEventListener('input', debounce(() => updateSnippetPreview(productTitleInput, bulletPointsInput, snippetTitle, snippetDescription), 100));
  analyzeButton.addEventListener('click', () => {
    seoResults.innerHTML = '<div class="loading">Analyzing...</div>';
    setTimeout(() => {
      seoResults.innerHTML = `<p>${analyzeSEO().message}</p>`;
    }, 1000);
  });
  compareButton.addEventListener('click', () => compareCompetitor(competitorUrlInput, productTitleInput, competitorResults));

  console.log('SEO Analysis Tool Initialized');
});
