/**
 * Remark plugin: Transform @handles into Twitter/X profile links.
 *
 * Converts `@username` in markdown text nodes into linked text:
 *   @CurveCap → <a href="https://x.com/CurveCap">CurveCap</a>
 *
 * Skips handles that are already inside links, code blocks, or inline code.
 * Applied globally to all blog posts via astro.config.mjs markdown config.
 */
import { visit } from 'unist-util-visit';

export function remarkTwitterHandles() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      // Skip text inside links or code
      if (!parent || parent.type === 'link' || parent.type === 'code' || parent.type === 'inlineCode') {
        return;
      }

      const handleRegex = /@([A-Za-z0-9_]{1,15})/g;
      const text = node.value;

      if (!handleRegex.test(text)) return;

      // Reset regex after test
      handleRegex.lastIndex = 0;

      // Split text around handles and build new nodes
      const children = [];
      let lastIndex = 0;
      let match;

      while ((match = handleRegex.exec(text)) !== null) {
        // Text before the handle
        if (match.index > lastIndex) {
          children.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }

        // The handle as a link (without @ sign)
        children.push({
          type: 'link',
          url: `https://x.com/${match[1]}`,
          children: [{ type: 'text', value: match[1] }],
        });

        lastIndex = match.index + match[0].length;
      }

      // Text after the last handle
      if (lastIndex < text.length) {
        children.push({ type: 'text', value: text.slice(lastIndex) });
      }

      // Replace the text node with our new nodes
      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
      }
    });
  };
}
