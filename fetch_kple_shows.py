import urllib.request
import gzip
from html.parser import HTMLParser

class SimpleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_list = []
        self.in_script_or_style = False

    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style']:
            self.in_script_or_style = True

    def handle_endtag(self, tag):
        if tag in ['script', 'style']:
            self.in_script_or_style = False

    def handle_data(self, data):
        if not self.in_script_or_style:
            text = data.strip()
            if text and len(text) > 3 and '{' not in text and '}' not in text and not text.startswith('.'):
                self.text_list.append(text)

def run():
    url = 'https://kpletv.org/local-programming-6490'
    print(f"Fetching {url}...")
    try:
        req = urllib.request.Request(
            url, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Encoding': 'gzip, deflate'
            }
        )
        with urllib.request.urlopen(req) as response:
            raw_data = response.read()
            if response.info().get('Content-Encoding') == 'gzip':
                print("Decompressing gzip data...")
                raw_data = gzip.decompress(raw_data)
            else:
                # Fallback: if it starts with gzip magic bytes
                if raw_data.startswith(b'\x1f\x8b'):
                    print("Decompressing gzip data (magic bytes fallback)...")
                    raw_data = gzip.decompress(raw_data)
            
            html = raw_data.decode('utf-8', errors='ignore')
        
        parser = SimpleParser()
        parser.feed(html)
        
        print(f"Extracted {len(parser.text_list)} text nodes:")
        unique_nodes = []
        seen = set()
        for node in parser.text_list:
            if node not in seen:
                seen.add(node)
                unique_nodes.append(node)
                
        for node in unique_nodes[:150]:
            print("-", node)
            
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    run()
