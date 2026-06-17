function categorizeFacility(name) {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('lab') || lowerName.includes('laboratorium')) return 'Laboratorium';
    if (lowerName.includes('perpustakaan') || lowerName.includes('ruang baca')) return 'Perpustakaan & Ruang Baca';
    if (lowerName.includes('kelas') || lowerName.includes('kuliah') || lowerName.includes('akademik')) return 'Ruang Kuliah';
    if (lowerName.includes('auditorium') || lowerName.includes('aula') || lowerName.includes('teater')) return 'Auditorium & Aula';
    if (lowerName.includes('olahraga') || lowerName.includes('senam') || lowerName.includes('lapangan')) return 'Fasilitas Olahraga';
    if (lowerName.includes('masjid') || lowerName.includes('musholla') || lowerName.includes('ibadah')) return 'Fasilitas Ibadah';
    if (lowerName.includes('kantin') || lowerName.includes('food')) return 'Kantin & Food Court';
    if (lowerName.includes('dosen') || lowerName.includes('kaprodi') || lowerName.includes('kajur')) return 'Ruang Dosen';
    if (lowerName.includes('bem') || lowerName.includes('hima') || lowerName.includes('senat') || lowerName.includes('ukm')) return 'Ruang Kegiatan Mahasiswa';
    if (lowerName.includes('layanan') || lowerName.includes('administrasi') || lowerName.includes('tata usaha') || lowerName.includes('loket')) return 'Administrasi & Layanan';
    if (lowerName.includes('studio') || lowerName.includes('podcast') || lowerName.includes('siaran')) return 'Studio & Produksi Media';
    if (lowerName.includes('penelitian') || lowerName.includes('riset')) return 'Pusat Penelitian';
    if (lowerName.includes('lounge') || lowerName.includes('gazebo') || lowerName.includes('area santai')) return 'Area Mahasiswa';
    if (lowerName.includes('gudang') || lowerName.includes('toilet') || lowerName.includes('server') || lowerName.includes('panel') || lowerName.includes('pantry') || lowerName.includes('lift')) return 'Fasilitas Umum';

    // Fallback if we really can't determine
    return 'Lainnya';
}

function generateDescription(name, category) {
    if (category === 'Laboratorium') return `Laboratorium komputer untuk kegiatan praktikum dan riset`;
    if (category === 'Ruang Dosen') return `Ruang kerja dan transit untuk ${name.replace(/^Ruang\s+/i, '')}`;
    if (category === 'Ruang Kegiatan Mahasiswa') return `Ruang sekretariat dan pusat kegiatan mahasiswa untuk ${name.replace(/^Ruang\s+/i, '')}`;
    if (category === 'Fasilitas Umum') return `Fasilitas umum dan infrastruktur pendukung gedung`;
    
    // Default fallback
    return `Fasilitas ${name} yang mendukung kegiatan operasional dan kemahasiswaan`;
}

function processFacilityLine(line) {
    // The regex matches SQL INSERT tuples for facilities:
    // ('Nama', 'Deskripsi', 'Lokasi', lantai, foto_url, id_gedung, 'tipe_fasilitas')
    // We must be careful with varying amounts of spaces or NULLs.
    
    const facilityRegex = /^\s*\('([^']+)',\s*(?:'([^']*)'|NULL|\$\$.*?\$\$),\s*(?:'([^']*)'|NULL),\s*(?:[^,]+),\s*(?:[^,]+|\s*NULL\s*|\s*'.*?'\s*),\s*\d+,\s*(?:'([^']+)'|NULL)\)(,?)\s*$/;
    const match = line.match(facilityRegex);
    
    if (!match) return line;

    const name = match[1];
    let currentDesc = match[2] || '';
    let location = match[3] || '';
    const currentType = match[4] || '';
    const trailingComma = match[5] || '';

    // Calculate new type and description
    const newType = categorizeFacility(name);
    
    // Always regenerate desc if it's empty, too short, or generic
    let newDesc = currentDesc;
    if (newDesc.length < 10 || newDesc.toLowerCase().includes('ruang untuk')) {
        newDesc = generateDescription(name, newType);
    }

    // Reconstruction using simple string replacement or regex replacement to maintain exact non-captured parts
    // To be perfectly safe, we replace the specific parts in the string
    // This is a naive regex replace, for real code we should split by comma outside quotes
    // Let's implement a safer splitter.
    
    let parts = line.split(/,(?=(?:(?:[^']*'){2})*[^']*$)/); 
    // This splits by comma only outside of single quotes.
    
    if (parts.length >= 7) {
        // parts[0] is ('Nama'
        // parts[1] is 'Deskripsi' or '' or $$...$$
        // parts[6] is 'tipe_fasilitas') or 'tipe_fasilitas'),
        
        // Update type (last part)
        parts[6] = parts[6].replace(/'[^']+'/, `'${newType}'`);
        
        // Update description (second part)
        // using $$ quoting
        parts[1] = ` $$${newDesc}$$`;
        
        return parts.join(',');
    }

    return line;
}

export {
    processFacilityLine,
    categorizeFacility,
    generateDescription
};
