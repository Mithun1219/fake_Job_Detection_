import sys

with open(r'c:\Users\lokhnadh\fake_Job_Detection\fake_Job_Detection\frontend\src\context\LanguageContext.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# The JS script replaced \\n with literal \n sequence in text:
# `\\n` got written as the two characters `\` and `n`.
text = text.replace(r'\n', '\n')
# Also \" or \'
text = text.replace(r'\'', "'")

with open(r'c:\Users\lokhnadh\fake_Job_Detection\fake_Job_Detection\frontend\src\context\LanguageContext.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed newlines.")
