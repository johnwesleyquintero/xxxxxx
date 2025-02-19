document.getElementById('metaTitle').addEventListener('input', function() {
    document.getElementById('previewTitle').textContent = this.value;
    document.getElementById('titleCount').textContent = `${this.value.length}/70`;
});

document.getElementById('salesPoints').addEventListener('input', function() {
    const points = this.value.split('\n').filter(line => line.trim().length > 0);
    const list = document.getElementById('previewSalesPoints');
    list.innerHTML = "";
    points.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        list.appendChild(li);
    });
});

document.getElementById('startAnalysis').addEventListener('click', function() {
    const title = document.getElementById('metaTitle').value;
    const salesPoints = document.getElementById('salesPoints').value.split('\n').filter(line => line.trim().length > 0);

    let score = 0;

    // Title Analysis
    let titleAnalysis = "✅ Good Length";
    if (title.length > 70) {
        titleAnalysis = "❌ Title exceeds 70 characters";
        score -= 10;
    } else if (title.length > 60) {
        titleAnalysis = "⚠️ Title slightly too long";
        score -= 5;
    } else {
        score += 10;
    }

    document.getElementById('titleAnalysis').textContent = titleAnalysis;

    // Keyword Frequency
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\\s]/g, ''); // Remove special characters and punctuation
    const words = cleanTitle.split(/\s+/);
    const keywordCounts = {};
    words.forEach(word => {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
    });

    let keywordText = Object.entries(keywordCounts).map(([word, count]) => {
        return `<span class="highlight">${word}</span>: ${count} occurrences`;
    }).join(', ');

    document.getElementById('keywordFrequency').innerHTML = keywordText || "No keywords found";

    // Bullet Point Analysis
    let bulletAnalysis = "";
    if (salesPoints.length > 6) {
        bulletAnalysis = "⚠️ Too many bullet points (recommended: 4-6)";
        score -= 5;
    } else {
        score += 10;
    }

    // Sanitize HTML to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    salesPoints.forEach(point => {
        if (point.length > 200) {
            bulletAnalysis += `<br>❌ Bullet too long: "${escapeHTML(point.substring(0, 50))}..."`;
            score -= 5;
        } else if (point.length < 50) {
            bulletAnalysis += `<br>⚠️ Bullet too short: "${escapeHTML(point)}"`;
            score -= 2;
        } else {
            score += 5;
        }
    });

    document.getElementById('bulletAnalysis').innerHTML = bulletAnalysis || "✅ Bullet points are well optimized.";

    // Final Score
    document.getElementById('seoScore').textContent = score;
});
