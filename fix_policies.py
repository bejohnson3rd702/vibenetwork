import re

with open('supabase_schema.sql', 'r') as f:
    content = f.read()

# Find all CREATE POLICY statements
# Format: CREATE POLICY "Name" ON public.table_name ...
matches = re.finditer(r'CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+public\.([a-zA-Z0-9_]+)', content)

# Create a list of DROP statements
drops = []
for match in matches:
    policy_name = match.group(1)
    table_name = match.group(2)
    drop_stmt = f'DROP POLICY IF EXISTS "{policy_name}" ON public.{table_name};'
    
    # We want to insert the drop statement right before the CREATE statement
    content = content.replace(match.group(0), drop_stmt + '\n' + match.group(0))

with open('supabase_schema.sql', 'w') as f:
    f.write(content)
