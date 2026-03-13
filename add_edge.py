import os

def add_edge_runtime(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file in ['route.ts', 'page.tsx']:
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if "export const runtime = 'edge'" not in content and 'export const runtime = "edge"' not in content:
                    print(f"Updating {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write("export const runtime = 'edge';\n" + content)

add_edge_runtime('src/app')
