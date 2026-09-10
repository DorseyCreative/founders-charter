/* Converts guides/*.md into styled HTML pages that match the Charter, plus an index.
   No dependencies. Handles the markdown subset these guides actually use. */
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'guides');

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, (_,c)=>`<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  const flushPara = buf => { if (buf.length) { out.push('<p>' + inline(buf.join(' ')) + '</p>'); buf.length = 0; } };
  let para = [];

  while (i < lines.length) {
    const L = lines[i];

    if (/^\s*$/.test(L)) { flushPara(para); i++; continue; }

    if (/^---+\s*$/.test(L)) { flushPara(para); out.push('<hr>'); i++; continue; }

    const h = L.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushPara(para); const n = h[1].length; out.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }

    // table
    if (/^\s*\|/.test(L) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i+1] || '')) {
      flushPara(para);
      const cells = r => r.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      const head = cells(L);
      i += 2;
      const body = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { body.push(cells(lines[i])); i++; }
      out.push('<div class="tw"><table><thead><tr>' + head.map(c=>`<th>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' + body.map(r=>'<tr>'+r.map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('') +
        '</tbody></table></div>');
      continue;
    }

    // blockquote
    if (/^>\s?/.test(L)) {
      flushPara(para);
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/,'')); i++; }
      out.push('<blockquote>' + mdToHtml(buf.join('\n')) + '</blockquote>');
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(L)) {
      flushPara(para);
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/,'')); i++; }
      out.push('<ol>' + items.map(t=>`<li>${inline(t)}</li>`).join('') + '</ol>');
      continue;
    }

    // unordered list (incl. checkbox)
    if (/^\s*[-*]\s+/.test(L)) {
      flushPara(para);
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/,'').replace(/^\[ \]\s*/,'☐ ').replace(/^\[x\]\s*/i,'☑ '));
        i++;
      }
      out.push('<ul>' + items.map(t=>`<li>${inline(t)}</li>`).join('') + '</ul>');
      continue;
    }

    para.push(L.trim());
    i++;
  }
  flushPara(para);
  return out.join('\n');
}

const CSS = fs.readFileSync(path.join(__dirname,'guides','_style.css'),'utf8');

function page(title, body, back) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<title>${esc(title)} — Founders' Charter</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${CSS}</style>
</head><body>
<div class="topbar"><div class="topbar-inner">
  <a class="back" href="${back}">← ${back === '../' ? 'Charter' : 'Guides'}</a>
  <span class="wordmark">Founders' Charter</span>
</div></div>
<main class="wrap">
${body}
</main>
</body></html>`;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md')).sort();
const meta = [];
for (const f of files) {
  const md = fs.readFileSync(path.join(DIR,f),'utf8');
  const title = (md.match(/^#\s+(.*)$/m) || [,f.replace(/\.md$/,'')])[1].replace(/\s+—.*$/,'').trim();
  const blurb = (md.match(/^\*(.+?)\*\s*$/m) || [,''])[1];
  const html = mdToHtml(md);
  fs.writeFileSync(path.join(DIR, f.replace(/\.md$/,'.html')), page(title, html, '../'));
  meta.push({ file: f.replace(/\.md$/,'.html'), title, blurb, words: md.split(/\s+/).length });
}

const idx = `<h1>Operating Guides</h1>
<p class="lede">Researched from the live system, not from general advice. Each one hands you the answer so the program can ask for the judgment.</p>
<div class="cards">` + meta.map(m =>
  `<a class="card" href="${m.file}"><h3>${esc(m.title)}</h3><p>${esc(m.blurb||'')}</p><span class="wc">${m.words.toLocaleString()} words</span></a>`
).join('') + `</div>`;
fs.writeFileSync(path.join(DIR,'index.html'), page('Operating Guides', idx, '../'));

console.log('built', meta.length, 'guides + index');
meta.forEach(m => console.log('  ', m.file, '—', m.title));
