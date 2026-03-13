import os

def fix_runtime_order(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file in ['route.ts', 'page.tsx']:
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # If "use client" exists but is not first, move it to first
                lines = content.splitlines()
                if not lines: continue
                
                has_use_client = False
                use_client_line_idx = -1
                for i, line in enumerate(lines):
                    if line.strip() in ['"use client"', "'use client'"]:
                        has_use_client = True
                        use_client_line_idx = i
                        break
                
                if has_use_client and use_client_line_idx > 0:
                    print(f"Fixing order in {filepath}")
                    use_client_line = lines.pop(use_client_line_idx)
                    new_content = use_client_line + "\n" + "\n".join(lines)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

fix_runtime_order('src/app')
