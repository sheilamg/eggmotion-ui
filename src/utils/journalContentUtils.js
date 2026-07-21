export const EMPTY_BODY = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export function isEmptyBody(body) {
  if (!body?.content?.length) return true;
  return body.content.every((node) => {
    if (node.type !== 'paragraph') return false;
    return !node.content?.length;
  });
}

export function plainTextToBody(text) {
  if (!text?.trim()) return EMPTY_BODY;
  const lines = text.split('\n');
  return {
    type: 'doc',
    content: lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : [],
    })),
  };
}

export function parseJournalBody(content) {
  if (content?.body && content.bodyFormat === 'tiptap-json') {
    return content.body;
  }
  if (content?.body?.type === 'doc') {
    return content.body;
  }
  if (content?.text) {
    return plainTextToBody(content.text);
  }
  return EMPTY_BODY;
}

export function extractPlainText(body) {
  if (!body?.content) return '';
  const parts = [];
  const walk = (nodes) => {
    nodes.forEach((node) => {
      if (node.type === 'text') {
        parts.push(node.text);
      } else if (node.type === 'hardBreak') {
        parts.push('\n');
      } else if (node.content) {
        walk(node.content);
        if (node.type === 'paragraph') parts.push('\n');
      }
    });
  };
  walk(body.content);
  return parts.join('').replace(/\n+$/, '');
}

export function getEntryPreviewText(entry) {
  const content = entry?.content;
  if (!content) return '';
  if (content.text?.trim()) return content.text.trim();
  return extractPlainText(parseJournalBody(content)).trim();
}

export function normalizeSticker(raw, index = 0) {
  const x = raw.x ?? 20 + (index % 5) * 12;
  const y = raw.y ?? 20 + Math.floor(index / 5) * 12;
  return {
    id: raw.id || `${Date.now()}-${index}`,
    type: raw.type || (raw.src ? 'drawing' : 'emoji'),
    emoji: raw.emoji || '✨',
    src: raw.src || null,
    x,
    y,
    rotation: raw.rotation ?? raw.rot ?? 0,
    scaleX: raw.scaleX ?? 1,
    scaleY: raw.scaleY ?? 1,
  };
}

export function normalizeStickers(stickers) {
  if (!Array.isArray(stickers)) return [];
  return stickers.map((s, i) => normalizeSticker(s, i));
}

export function hasEntryContent(title, body, stickers) {
  if (title?.trim()) return true;
  if (Array.isArray(stickers) && stickers.length > 0) return true;
  return !isEmptyBody(body);
}

export function buildJournalContent(title, body, stickers) {
  const plain = extractPlainText(body);
  return {
    title: title || '',
    body,
    bodyFormat: 'tiptap-json',
    text: plain,
    stickers: normalizeStickers(stickers),
  };
}
