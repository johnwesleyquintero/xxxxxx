export function updateSnippetPreview(productTitleInput, bulletPointsInput, snippetTitle, snippetDescription) {
  snippetTitle.textContent = productTitleInput.value.substring(0, 60);
  const description = bulletPointsInput.value.split('\\n').map(b => b.trim()).filter(b => b).join(' - ').substring(0, 155);
  snippetDescription.textContent = description;
}
