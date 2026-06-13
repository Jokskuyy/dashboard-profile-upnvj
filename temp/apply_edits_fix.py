import sys
import codecs
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
sys.path.append(r"C:\Users\imann\.gemini\config\skills\docx")
from scripts.document import Document

doc = Document(r'd:\Iman\web\dashboard-profile-upnvj\temp\unpacked_docx2', author="AI Assistant", initials="AI", track_revisions=True, rsid="607A6F31")

def replace_in_run(target_text, replacement_text, line_number=None):
    try:
        # Note: XML line numbers change after each save if elements are added. 
        # But we saved `doc.save(validate=False)` which re-formatted the XML.
        # Since the line numbers from grep were on the original XML, they might have shifted!
        # It's safer to use line_number=range(12500, 13000) or find by other attributes.
        
        # Let's search by string first, if multiple, we'll try to find the one near 'Dashboard Profil'.
        # Actually, `get_node` will fail if multiple. 
        if line_number:
            node = doc["word/document.xml"].get_node(tag="w:r", contains=target_text, line_number=line_number)
        else:
            node = doc["word/document.xml"].get_node(tag="w:r", contains=target_text)
            
        if node:
            rpr = tags[0].toxml() if (tags := node.getElementsByTagName("w:rPr")) else ""
            full_text = "".join(t.firstChild.nodeValue for t in node.getElementsByTagName("w:t") if t.firstChild)
            new_text = full_text.replace(target_text, replacement_text)
            replacement = f'<w:del><w:r>{rpr}<w:delText xml:space="preserve">{full_text}</w:delText></w:r></w:del><w:ins><w:r>{rpr}<w:t xml:space="preserve">{new_text}</w:t></w:r></w:ins>'
            doc["word/document.xml"].replace_node(node, replacement)
            print(f"Successfully replaced: {target_text}")
        else:
            print(f"Could not find: {target_text}")
    except Exception as e:
        print(f"Error replacing '{target_text}': {e}")

replace_in_run("API (Node.js) ", "API Supabase ")
replace_in_run(" (React.js).", " (React.js) dengan fitur Multi-bahasa.", line_number=range(12000, 13000))

doc.save(validate=False)
