import re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_nodes = []
        self.in_style_or_script = False

    def handle_starttag(self, tag, attrs):
        if tag in ['style', 'script']:
            self.in_style_or_script = True

    def handle_endtag(self, tag):
        if tag in ['style', 'script']:
            self.in_style_or_script = False

    def handle_data(self, data):
        if not self.in_style_or_script:
            clean = data.strip()
            if clean and len(clean) > 2 and not clean.startswith('.') and not clean.startswith('#') and '{' not in clean and '}' not in clean:
                self.text_nodes.append(clean)

def run():
    file_path = '/Users/bennie/.gemini/antigravity/brain/fd71f833-22aa-4e86-be65-ae1ce42d17ff/.system_generated/steps/526/content.md'
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    parser = TextExtractor()
    parser.feed(html)

    unique_nodes = []
    seen = set()
    for node in parser.text_nodes:
        if node not in seen:
            seen.add(node)
            unique_nodes.append(node)

    print("\n".join(unique_nodes[:200]))

if __name__ == '__main__':
    run()
