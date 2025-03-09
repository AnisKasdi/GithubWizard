document.getElementById('theme').addEventListener('change', (e) => {
    document.body.classList.toggle('light', !e.target.checked);
});

function generateProfile() {
    const githubUsername = document.getElementById('github-username').value.trim();
    if (!githubUsername) {
        alert("Please enter your GitHub username!");
        return;
    }
    const name = document.getElementById('name').value || githubUsername;
    const bio = document.getElementById('bio').value || "Tell the world about yourself!";
    const status = document.querySelector('input[name="status"]:checked').value;
    const location = document.getElementById('location').value;
    const pronouns = document.getElementById('pronouns').value;
    const email = document.getElementById('email').value;
    const twitter = document.getElementById('twitter').value;
    const linkedin = document.getElementById('linkedin').value;
    const website = document.getElementById('website').value;
    const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s) || ["Skill 1", "Skill 2"];
    const badges = Array.from(document.querySelectorAll('.form-group input[id^="badge-"]:checked')).map(cb => cb.value);
    const statsTheme = document.querySelector('input[name="stats-theme"]:checked').value;
    const projects = document.getElementById('projects').value.split('\n').map(p => p.trim()).filter(p => p);

    let markdown = `<h1 align="center">${name}</h1>\n\n`;
    if (status) markdown += `<p align="center"><strong>${status}</strong></p>\n\n`;
    if (location || pronouns) {
        markdown += `<p align="center">`;
        if (location) markdown += `<i class="fas fa-map-marker-alt"></i> ${location} `;
        if (pronouns) markdown += `| ${pronouns}`;
        markdown += `</p>\n\n`;
    }

    markdown += `## <i class="fas fa-user"></i> About Me\n${bio}\n\n`;

    if (email || twitter || linkedin || website) {
        markdown += `## <i class="fas fa-address-book"></i> Contact\n`;
        if (email) markdown += `- <i class="fas fa-envelope"></i> [${email}](mailto:${email})\n`;
        if (twitter) markdown += `- <i class="fab fa-twitter"></i> [@${twitter}](https://twitter.com/${twitter})\n`;
        if (linkedin) markdown += `- <i class="fab fa-linkedin"></i> [${linkedin.split('/').pop()}](https://${linkedin})\n`;
        if (website) markdown += `- <i class="fas fa-globe"></i> [${website.split('/')[2] || website}](${website})\n`;
        markdown += `\n`;
    }

    markdown += `## <i class="fas fa-tools"></i> Skills\n${skills.map(s => `- ${s}`).join('\n')}\n\n`;

    if (badges.length > 0) {
        markdown += `## <i class="fas fa-award"></i> Badges\n`;
        badges.forEach(b => {
            if (b === 'github-stars') {
                markdown += `![GitHub Stars](https://img.shields.io/github/stars/${githubUsername}?style=social)\n`;
            } else if (b === 'commits') {
                markdown += `![Commits](https://img.shields.io/github/commit-activity/m/${githubUsername}/${githubUsername}?style=social)\n`;
            } else {
                markdown += `![${b}](https://img.shields.io/badge/-${b}-brightgreen?style=flat-square&logo=${b})\n`;
            }
        });
        markdown += `\n`;
    }

    markdown += `## <i class="fas fa-chart-line"></i> Stats\n`;
    markdown += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=${statsTheme})\n`;
    markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=${statsTheme})\n\n`;

    if (projects.length > 0) {
        markdown += `## <i class="fas fa-folder-open"></i> Featured Projects\n${projects.map(p => `- [${p.split(' - ')[0]}](https://github.com/${githubUsername}/${p.split(' - ')[0].replace(/\s/g, '-')}) - ${p.split(' - ')[1] || 'No description'}`).join('\n')}\n`;
    }

    markdown += `## <i class="fas fa-users"></i> Social\n`;
    markdown += `![Followers](https://img.shields.io/github/followers/${githubUsername}?style=social)\n`;
    markdown += `![Profile Views](https://komarev.com/ghpvc/?username=${githubUsername}&color=blue)\n`;

    document.getElementById('preview').innerHTML = marked.parse(markdown);
    return markdown;
}

function downloadProfile() {
    const markdown = generateProfile();
    if (!markdown) return; // Arrête si pas de username
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'README.md';
    link.click();
}

function downloadProject() {
    const projectName = document.getElementById('project-name').value || "MyProject";
    const projectDesc = document.getElementById('project-desc').value || "A cool project";
    const languages = Array.from(document.querySelectorAll('.form-group input[id^="lang-"]:checked')).map(cb => cb.value);
    const projectType = document.querySelector('input[name="project-type"]:checked').value;
    const license = document.querySelector('input[name="license"]:checked').value;
    const themeColor = document.getElementById('theme-color').value;
    const addGitignore = document.getElementById('gitignore').checked;
    const addTests = document.getElementById('tests').checked;
    const addDeps = document.getElementById('deps').checked;
    const addContributing = document.getElementById('contributing').checked;

    const zip = new JSZip();
    let readme = `# <i class="fas fa-file-code"></i> ${projectName}\n\n`;
    readme += `${projectDesc}\n\n`;
    readme += `## <i class="fas fa-info-circle"></i> Details\n`;
    readme += `- **Type**: ${projectType}\n`;
    readme += `- **Languages**: ${languages.join(', ') || 'None selected'}\n`;
    readme += `- **Theme Color**: ${themeColor}\n\n`;
    if (languages.length > 0) {
        readme += languages.map(lang => `![${lang}](https://img.shields.io/badge/-${lang}-${themeColor.replace('#', '')}?style=flat-square&logo=${lang})`).join(' ') + '\n';
    }
    zip.file('README.md', readme);

    languages.forEach(lang => {
        if (lang === 'java') {
            zip.file(`src/${projectName}.java`, `public class ${projectName} {\n    public static void main(String[] args) {\n        System.out.println("Hello from ${projectName}!");\n    }\n}`);
            if (addTests) zip.file(`test/${projectName}Test.java`, `public class ${projectName}Test {\n    public static void main(String[] args) {\n        System.out.println("Test passed!");\n    }\n}`);
            if (addDeps) zip.file('pom.xml', `<project>\n    <groupId>com.example</groupId>\n    <artifactId>${projectName.toLowerCase()}</artifactId>\n    <version>1.0</version>\n</project>`);
        } else if (lang === 'python') {
            zip.file(`${projectName}.py`, `print("Hello from ${projectName}!")`);
            if (addTests) zip.file(`test_${projectName}.py`, `assert True, "Test passed!"`);
            if (addDeps) zip.file('requirements.txt', '# Add your dependencies here');
        } else if (lang === 'javascript') {
            zip.file(`${projectName}.js`, `console.log("Hello from ${projectName}!");`);
            if (addTests) zip.file(`test_${projectName}.js`, `console.assert(true, "Test passed!");`);
            if (addDeps) zip.file('package.json', `{\n    "name": "${projectName.toLowerCase()}",\n    "version": "1.0.0",\n    "main": "${projectName}.js"\n}`);
        } else if (lang === 'typescript') {
            zip.file(`${projectName}.ts`, `console.log("Hello from ${projectName}!");`);
            if (addTests) zip.file(`test_${projectName}.ts`, `console.assert(true, "Test passed!");`);
            if (addDeps) zip.file('package.json', `{\n    "name": "${projectName.toLowerCase()}",\n    "version": "1.0.0",\n    "main": "${projectName}.js",\n    "dependencies": {"typescript": "^4.0.0"}\n}`);
        } else if (lang === 'cpp') {
            zip.file(`${projectName}.cpp`, `#include <iostream>\nint main() {\n    std::cout << "Hello from ${projectName}!" << std::endl;\n    return 0;\n}`);
            if (addTests) zip.file(`test_${projectName}.cpp`, `#include <cassert>\nint main() {\n    assert(true);\n    return 0;\n}`);
        }
    });

    if (addGitignore) {
        zip.file('.gitignore', `*.log\nnode_modules/\n*.class\n*.o`);
    }

    if (license === 'mit') {
        zip.file('LICENSE', `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${document.getElementById('name').value || 'Your Name'}\n\n[Standard MIT License text here...]`);
    } else if (license === 'apache') {
        zip.file('LICENSE', `Apache License 2.0\n\nCopyright ${new Date().getFullYear()} ${document.getElementById('name').value || 'Your Name'}\n\n[Standard Apache text here...]`);
    } else if (license === 'gpl') {
        zip.file('LICENSE', `GNU GPL v3\n\nCopyright ${new Date().getFullYear()} ${document.getElementById('name').value || 'Your Name'}\n\n[Standard GPL text here...]`);
    }

    if (addContributing) {
        zip.file('CONTRIBUTING.md', `# Contributing to ${projectName}\n\nFeel free to submit pull requests or open issues!`);
    }

    zip.generateAsync({ type: 'blob' }).then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${projectName}.zip`;
        link.click();
    });
}