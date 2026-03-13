import os

def remove_edge_runtime(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file in ['route.ts', 'page.tsx']:
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                # Check if first line is edge runtime
                if lines and "export const runtime = 'edge'" in lines[0]:
                    print(f"Removing edge runtime from {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.writelines(lines[1:])

remove_edge_runtime('src/app')
