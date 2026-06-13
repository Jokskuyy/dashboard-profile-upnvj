import zipfile
import xml.etree.ElementTree as ET
import io

word_namespace = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
docx_path = r'd:\Iman\web\dashboard-profile-upnvj\temp\Tugas_Akhir_Formatted.docx'
with zipfile.ZipFile(docx_path) as docx:
    tree = ET.XML(docx.read('word/document.xml'))

text = '\n'.join(''.join(node.text for node in paragraph.iter(word_namespace + 't') if node.text) for paragraph in tree.iter(word_namespace + 'p') if ''.join(node.text for node in paragraph.iter(word_namespace + 't') if node.text))

with io.open(r'd:\Iman\web\dashboard-profile-upnvj\temp\Tugas_Akhir_Formatted_utf8.txt', 'w', encoding='utf-8') as f:
    f.write(text)
