const fs = require('fs');
const cheerio = require('cheerio');

// Path to the coverage HTML file
const coverageHtmlPath = 'coverage/ikilote/magma/index.html';
// Path to the README and home files
const filesPath = ['README.md', 'public/assets/doc/home.md'];
// Palette (red, yellow, green)
const palette = ['e05d44', 'f9cd0b', '4D9221'];

// Function to extract coverage data from HTML
function extractCoverageData(html) {
    const $ = cheerio.load(html);
    const coverageData = [];

    $('.fl.pad1y.space-right2').each((i, el) => {
        const percentage = $(el).find('.strong').text().trim().replace('%', '');
        const type = $(el).find('.quiet').text().trim();
        const fraction = $(el).find('.fraction').text().trim();

        coverageData.push({
            percentage: `${percentage}%`,
            type,
            fraction,
            color: percentage < 60 ? palette[0] : percentage < 80 ? palette[1] : palette[2],
        });
    });

    return coverageData;
}

// Function to generate badge URLs
function generateBadgeUrls(coverageData) {
    return coverageData.map(
        data =>
            `https://test.ikilote.net/badge-custom.php?label=${encodeURIComponent(data.type)}&value=${encodeURIComponent(data.percentage)}&valueBgColor=${data.color}`,
    );
}

// Function to update a file
function updateReadme(filePath, badgeUrls, coverageData, markdomn) {
    let readmeContent = fs.readFileSync(filePath, 'utf8');

    // Generate markdown for badges
    const badgesMarkdown = coverageData
        .map((data, i) =>
            markdomn
                ? `[![${data.type} ${data.percentage} (${data.fraction})](${badgeUrls[i]})](http://magma.ikilote.net/coverage/ikilote/magma/index.html)`
                : `<a href="http://magma.ikilote.net/coverage/ikilote/magma/index.html"> ![${data.type} ${data.percentage} (${data.fraction})](${badgeUrls[i]}) </a>`,
        )
        .join('\n');

    // Section to add/modify
    const badgeSection = `## Coverage\n\n${badgesMarkdown}\n\n`;

    // Replace or add the section
    if (readmeContent.includes('# Coverage')) {
        readmeContent = readmeContent.replace(/## Coverage[\s\S]*?(?=#|$)/, badgeSection);
    } else {
        readmeContent = `${badgeSection}\n${readmeContent}`;
    }

    fs.writeFileSync(filePath, readmeContent, 'utf8');

    console.log(`Coverage badges updated in ${filePath}!`);
}

// Read the HTML file
const html = fs.readFileSync(coverageHtmlPath, 'utf8');
const coverageData = extractCoverageData(html);
const badgeUrls = generateBadgeUrls(coverageData);

// Update files
updateReadme(filesPath[0], badgeUrls, coverageData, true);
updateReadme(filesPath[1], badgeUrls, coverageData, false);
