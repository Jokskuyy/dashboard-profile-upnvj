import sys
import os

# Add docx skill root to path
sys.path.append(r"C:\Users\imann\.gemini\config\skills\docx")
from scripts.document import Document

# Initialize document
doc = Document(r'd:\Iman\web\dashboard-profile-upnvj\temp\unpacked_docx', author="AI Assistant", initials="AI", track_revisions=True, rsid="607A6F31")

def replace_in_run(target_text, replacement_text):
    try:
        node = doc["word/document.xml"].get_node(tag="w:r", contains=target_text)
        if node:
            rpr = tags[0].toxml() if (tags := node.getElementsByTagName("w:rPr")) else ""
            
            # The node might contain other text besides target_text. We only replace target_text.
            # But the simplest way in DOCX is if the run text is exactly the target_text or we just replace the whole run.
            # Let's get the text of the node.
            full_text = "".join(t.firstChild.nodeValue for t in node.getElementsByTagName("w:t") if t.firstChild)
            
            # If the run contains more than the target text, we do a string replace on full_text
            new_text = full_text.replace(target_text, replacement_text)
            
            # But we must properly do tracked changes. For simplicity if it's a partial replace:
            # <w:del>old</w:del><w:ins>new</w:ins>
            # Actually, to properly track changes, we should mark the changed part.
            # But replacing the whole run's text is easier and safer to ensure XML integrity.
            
            replacement = f'<w:del><w:r>{rpr}<w:delText xml:space="preserve">{full_text}</w:delText></w:r></w:del><w:ins><w:r>{rpr}<w:t xml:space="preserve">{new_text}</w:t></w:r></w:ins>'
            doc["word/document.xml"].replace_node(node, replacement)
            print(f"Successfully replaced: {target_text}")
        else:
            print(f"Could not find: {target_text}")
    except Exception as e:
        print(f"Error replacing '{target_text}': {e}")

# 1. Update Backend
replace_in_run(" Node.js (kemungkinan besar dengan ", " Supabase (Backend-as-a-Service) dengan ")
replace_in_run(" seperti Express.js). Node.js dipilih karena arsitekturnya yang ", " fondasi terintegrasi. Supabase dipilih karena arsitekturnya yang ")
replace_in_run(" API (Node.js) ", " Supabase ")
replace_in_run(" (Node.js) dan ", " (Supabase) dan ")

# 2. PostgreSQL to Supabase
replace_in_run(" PostgreSQL dengan objek visual terkait pada ", " Supabase (PostgreSQL) dengan objek visual terkait pada ")
replace_in_run("Untuk penyimpanan data terstruktur, proyek ini akan menggunakan PostgreSQL, sebuah sistem manajemen ", "Untuk penyimpanan data terstruktur dan autentikasi, proyek ini menggunakan Supabase, platform ")

# 3. Skenario A (Mitigation strategy)
replace_in_run("Skenario A, B, dan C), yang dirancang sebagai strategi mitigasi risiko untuk menjaga reliabilitas sistem di tengah ketidakpastian ketersediaan data akademik eksternal.", "Sistem), yang dirancang untuk secara independen mengelola dan menyajikan seluruh data profil kampus tanpa bergantung pada API eksternal.")

# 4. Analytics
replace_in_run("sebuah modul analitik custom yang dasar akan diimplementasikan.", "sebuah integrasi analitik privacy-friendly menggunakan Umami akan diimplementasikan.")

# 5. Multi-language
replace_in_run("Dashboard Profil dan Panel Informasi (React.js).", "Dashboard Profil dan Panel Informasi (React.js) dengan fitur Multi-bahasa.")

# 6. Unity Pathfinding
replace_in_run("Data tersebut selanjutnya diproses oleh Unity untuk ditampilkan pada objek 3D yang sesuai.", "Data diproses oleh Unity (First Person FPV). UI pencarian React memicu sistem pathfinding Unity ke tujuan.")

doc.save()
print("Modifications complete.")
