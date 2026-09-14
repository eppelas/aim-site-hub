#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const registryName = 'tool-registry';
const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceHubName = 'AIM Site Hub Repo - aim-site-hub';
const candidates = [scriptRoot];
if (path.basename(scriptRoot) === workspaceHubName) candidates.push(path.dirname(scriptRoot));
// In the local workspace the JSON registry owns both HTML surfaces; in a
// standalone clone the repository registry owns index.html.
const workspaceDir = candidates.find((candidate) =>
  fs.existsSync(path.join(candidate, 'aim-site-hub.html')) &&
  fs.existsSync(path.join(candidate, 'website-ops', `${registryName}.json`)) &&
  fs.existsSync(path.join(candidate, workspaceHubName, 'index.html'))
);
const rootDir = workspaceDir || scriptRoot;
const repoDir = workspaceDir ? path.join(workspaceDir, workspaceHubName) : scriptRoot;
const hubPaths = workspaceDir
  ? [path.join(rootDir, 'aim-site-hub.html'), path.join(repoDir, 'index.html')]
  : [path.join(repoDir, 'index.html')];
const sourcePath = path.join(rootDir, 'website-ops', `${registryName}.json`);
const mirrorPath = path.join(repoDir, 'website-ops', `${registryName}.json`);
const sourceText = fs.readFileSync(sourcePath, 'utf8');
const registry = JSON.parse(sourceText);
const startMarker = '<!-- TOOL_REGISTRY_SUMMARY_START -->';
const endMarker = '<!-- TOOL_REGISTRY_SUMMARY_END -->';
const args = process.argv.slice(2);
if (args.some((arg) => !['--stdout', '--check'].includes(arg)) || args.length > 1) {
  throw new Error('Use no arguments to sync, --stdout to render without writes, or --check to compare without writes.');
}

if (!Array.isArray(registry.tools)) throw new Error('Tool registry must contain a tools array.');
const visibleTools = registry.tools.filter((tool) => tool.hubVisible !== false && tool.status !== 'hidden');
const groups = [
  { id: 'workshops', title: 'Архив мастерских V3', note: 'Старые варианты страниц и элементов. Локальный просмотр работает на компьютере проекта с запущенным AIM Site Hub.' },
  { id: 'feedback', title: 'Оценки дизайна', note: 'Замечания и предпочтения, накопленные при работе над вариантами сайта.' },
  { id: 'design', title: 'Визуальные инструменты', note: 'Инструменты для подготовки графики.' },
  { id: 'navigation', title: 'Локальные файлы', note: 'Каталог страниц на рабочем компьютере.' },
];
for (const tool of visibleTools) {
  requireHubText(tool, ['hubTitle', 'hubSummary', 'hubScope', 'hubGroup', 'hubHref', 'hubAction']);
  if (!groups.some(({ id }) => id === tool.hubGroup)) throw new Error(`Unknown hubGroup on ${tool.id}`);
}
const generated = groups.map((group) => {
  const tools = visibleTools.filter((tool) => tool.hubGroup === group.id);
  if (!tools.length) return '';
  return `          <div class="tool-group" data-tool-kind="${escapeHtml(group.id)}">
            <div class="tool-group-head">
              <h3>${escapeHtml(group.title)}</h3>
              <p class="summary">${escapeHtml(group.note)}</p>
            </div>
            <div class="grid tool-grid">
${tools.map(renderToolCard).join('\n')}
            </div>
          </div>`;
}).filter(Boolean).join('\n');

function renderToolCard(tool) {
  const externalAttrs = /^https?:\/\//.test(tool.hubHref) ? ' target="_blank" rel="noopener noreferrer"' : '';
  const preview = tool.previewImage ? `
            <span class="tool-card-preview">
              <img src="${escapeHtml(tool.previewImage)}" alt="${escapeHtml(tool.hubPreviewAlt || tool.hubTitle)}" loading="lazy" />
            </span>` : '';
  return `              <a class="card tool-card" data-search-item href="${escapeHtml(tool.hubHref)}"${externalAttrs}>
            <div class="label-row"><span class="pill">${escapeHtml(tool.hubScope)}</span></div>
${preview}
            <div>
              <h3>${escapeHtml(tool.hubTitle)}</h3>
              <p class="summary">${escapeHtml(tool.hubSummary)}</p>
            </div>
            <div class="actions"><span class="mini-button">${escapeHtml(tool.hubAction)}</span></div>
          </a>`;
}

if (args.includes('--stdout')) {
  process.stdout.write(`${generated}\n`);
} else {
  const checkOnly = args.includes('--check');
  const replacement = `${startMarker}\n${generated}\n        ${endMarker}`;
  // Validate every destination before writing either HTML surface.
  const results = hubPaths.map((hubPath) => {
    const before = fs.readFileSync(hubPath, 'utf8');
    if (before.split(startMarker).length !== 2 || before.split(endMarker).length !== 2) {
      throw new Error(`Expected one ${registryName} marker pair in ${path.relative(rootDir, hubPath)}`);
    }
    const start = before.indexOf(startMarker);
    const end = before.indexOf(endMarker) + endMarker.length;
    if (end < start) throw new Error(`Reversed ${registryName} markers in ${hubPath}`);
    const after = `${before.slice(0, start)}${replacement}${before.slice(end)}`;
    return { hubPath, before, after };
  });
  const mirrorBefore = fs.existsSync(mirrorPath) ? fs.readFileSync(mirrorPath, 'utf8') : null;
  const changed = results.some(({ before, after }) => before !== after) || mirrorBefore !== sourceText;
  if (!checkOnly) {
    for (const { hubPath, before, after } of results) {
      if (before !== after) fs.writeFileSync(hubPath, after);
    }
    if (mirrorBefore !== sourceText) fs.writeFileSync(mirrorPath, sourceText);
  }
  console.log(JSON.stringify({
    source: path.relative(rootDir, sourcePath),
    mode: checkOnly ? 'check' : 'sync',
    hubs: results.map(({ hubPath, before, after }) => ({
      hub: path.relative(rootDir, hubPath),
      status: before === after ? 'unchanged' : checkOnly ? 'needs-sync' : 'updated',
    })),
    mirror: mirrorBefore === sourceText ? 'unchanged' : checkOnly ? 'needs-sync' : 'updated',
  }, null, 2));
  if (checkOnly && changed) process.exitCode = 1;
}

function requireHubText(item, fields) {
  for (const field of fields) {
    if (typeof item[field] !== 'string' || !item[field].trim()) {
      throw new Error(`${registryName}: ${item.id || '(no id)'} needs employee-facing ${field}`);
    }
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
