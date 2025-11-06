# 🔒 Data Security & Privacy Guide

## ⚠️ Problem: Public Repository = Public Data

Ketika deploy ke GitHub Pages dengan repository public:
- ❌ Semua orang bisa lihat source code
- ❌ File JSON di `/public/data` bisa diakses siapa saja
- ❌ Tidak ada authentication di static site
- ❌ Data pribadi (email, nama, dll) terekspos

---

## ✅ Solutions (Ranked by Security Level)

### 🔐 **Level 1: Anonymize & Obfuscate (Basic)**

**Untuk:** Demo/Portfolio dengan data tidak sensitif

**Cara:**

#### 1. Gunakan Data Mock/Dummy
```typescript
// ❌ JANGAN: Data asli
{
  name: "Dr. John Doe",
  email: "john.doe@upnvj.ac.id",
  phone: "+62 812-3456-7890"
}

// ✅ LAKUKAN: Data dummy
{
  name: "Prof. Demo User",
  email: "demo@example.com",
  phone: "+62 XXX-XXXX-XXXX"
}
```

#### 2. Gunakan Data Protection Utils
```typescript
import { sanitizeData, anonymizePersonalData } from '@/utils/dataProtection';

// Mask sensitive fields
const safeData = sanitizeData(data, ['email', 'phone']);

// Or anonymize completely
const anonymousData = anonymizePersonalData(data, {
  replaceNames: true,
  maskEmails: true,
  hidePhone: true
});
```

#### 3. Obfuscate Data Files
```typescript
import { obfuscateData, deobfuscateData } from '@/utils/dataProtection';

// Before committing to GitHub
const obfuscated = obfuscateData(yourData);
// Save obfuscated string to file

// In app, deobfuscate
const data = deobfuscateData(obfuscatedString);
```

**Kelebihan:**
- ✅ Gratis
- ✅ Mudah implement
- ✅ Tetap bisa demo

**Kekurangan:**
- ⚠️ Bukan security sejati (hanya obfuscation)
- ⚠️ Bisa di-reverse oleh tech-savvy user
- ⚠️ Tidak cocok untuk data sensitif nyata

---

### 🔒 **Level 2: Environment Variables (Better)**

**Untuk:** Data semi-sensitif, API keys

**Cara:**

#### 1. Setup `.env` files
```bash
# .env.local (NOT committed to Git)
VITE_API_KEY=your_secret_key
VITE_DATA_ENCRYPTION_KEY=your_encryption_key
```

#### 2. Add to `.gitignore`
```gitignore
# Environment files
.env.local
.env.*.local
*.key

# Data files
/public/data-private/
/src/data/sensitive/
```

#### 3. Use GitHub Secrets for deploy
- GitHub repo → Settings → Secrets and variables → Actions
- Add secrets
- Reference in workflow:
```yaml
env:
  VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

**Kelebihan:**
- ✅ Keys tidak di commit ke GitHub
- ✅ Different values dev vs production

**Kekurangan:**
- ⚠️ Values tetap ada di built JS (bisa di-view source)
- ⚠️ Hanya aman untuk API keys, bukan data user

---

### 🛡️ **Level 3: Private Repository (Recommended)**

**Untuk:** Data asli tapi tetap pakai GitHub Pages

**Cara:**

#### 1. Set Repository to Private
- GitHub repo → Settings → Danger Zone
- Change visibility → Private
- GitHub Pages tetap bisa jalan! ✅

#### 2. Limit Access
- Settings → Collaborators
- Hanya add orang yang dipercaya

**Kelebihan:**
- ✅ Source code tidak publik
- ✅ Data JSON tidak bisa dilihat orang lain
- ✅ GitHub Pages tetap bisa diakses publik
- ✅ GRATIS untuk unlimited private repos

**Kekurangan:**
- ⚠️ Built site tetap publik (data bisa di-extract dari network)
- ⚠️ Tidak bisa showcase di profil GitHub

---

### 🔐 **Level 4: Backend Authentication (Production)**

**Untuk:** Data sensitif nyata, need login

**Setup:**

#### Option A: Supabase (Recommended)
```bash
npm install @supabase/supabase-js

# 1. Create project at supabase.com
# 2. Import SQL schema
# 3. Enable Row Level Security (RLS)
# 4. Setup auth
```

#### Option B: Firebase
```bash
npm install firebase

# 1. Create project at firebase.google.com
# 2. Setup Firestore with rules
# 3. Enable authentication
```

**Benefits:**
- ✅ Real authentication
- ✅ Data tidak di frontend
- ✅ Row-level security
- ✅ Audit logs

---

## 🎯 Recommendation for Your Project

### Current State Analysis:

**Your Data:**
```
/public/data/
  ├── dashboard-data.json  ← Statistik umum (OK untuk public)
  └── faculties.json       ← Info fakultas (OK untuk public)
```

**Data Sensitivity Level:**
- Dashboard stats: ✅ Public (jumlah mahasiswa, dosen, dll)
- Faculty info: ✅ Public (nama fakultas, program studi)
- Unity WebGL: ✅ Public (map kampus)

### ✅ **Recommended Approach:**

#### Scenario 1: **Data Asli Tidak Sensitif**
(Hanya statistik umum, tidak ada data pribadi)

**Solution:** Deploy as is
```bash
# No changes needed
# Deploy to GitHub Pages
```

#### Scenario 2: **Ada Email/Kontak Asli**

**Solution:** Anonymize before commit
```typescript
// src/utils/preparePublicData.ts
import { anonymizePersonalData } from './dataProtection';

export function prepareForPublic(data: any[]) {
  return data.map(item => 
    anonymizePersonalData(item, {
      maskEmails: true,
      hidePhone: true,
    })
  );
}
```

#### Scenario 3: **Data Sangat Sensitif**

**Solution:** Private repo + Backend
1. Make repo private
2. Use Supabase for real data
3. Frontend fetch from API with auth

---

## 📋 Security Checklist

### Before Making Repo Public:

- [ ] Review all files in `/public/data/`
- [ ] No real emails, phones, addresses
- [ ] No API keys or secrets in code
- [ ] No passwords (even hashed ones)
- [ ] Check commit history for leaked data
- [ ] Test with `git log -p` to see all changes
- [ ] Add sensitive patterns to `.gitignore`

### Files to Check:
```bash
# Search for emails
git grep -i "@upnvj.ac.id"

# Search for phone numbers
git grep -E "\+?62[0-9-]+"

# Search for potential API keys
git grep -i "api[_-]?key"
git grep -i "secret"
git grep -i "token"
```

### Clean Git History (if leaked):
```bash
# Remove sensitive file from ALL history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: Destructive!)
git push origin --force --all
```

---

## 🛠️ Implementation Steps

### Step 1: Audit Current Data

1. Check all JSON files
2. Identify sensitive information
3. Decide security level needed

### Step 2: Apply Protection

**If using mock data:**
```bash
# Create anonymized versions
node scripts/anonymize-data.js
```

**If using obfuscation:**
```typescript
// Use provided utils
import { obfuscateData } from '@/utils/dataProtection';
```

**If using private repo:**
```bash
# Just make repo private in GitHub settings
```

### Step 3: Update README

Add security notice:
```markdown
## Data Privacy

This project uses [anonymized/mock/obfuscated] data.
No real personal information is stored in this repository.
```

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
1. Commit `.env` files with real secrets
2. Put real emails in public JSON
3. Store passwords (even if encrypted) in frontend
4. Think obfuscation = encryption
5. Commit API keys to Git

### ✅ DO:
1. Use environment variables for keys
2. Keep sensitive data out of Git entirely
3. Use backend for real authentication
4. Review code before making repo public
5. Document security decisions

---

## 📊 Decision Matrix

| Data Type | Public Repo | Private Repo | Backend Needed |
|-----------|------------|--------------|----------------|
| Public stats | ✅ Safe | ✅ Safe | ❌ No |
| Faculty info | ✅ Safe | ✅ Safe | ❌ No |
| Generic contacts | ⚠️ Anonymize | ✅ Safe | ❌ No |
| Real emails | ❌ Don't | ⚠️ Careful | ✅ Yes |
| Phone numbers | ❌ Don't | ⚠️ Careful | ✅ Yes |
| Student records | ❌ Never | ❌ Never | ✅ Required |
| Login credentials | ❌ Never | ❌ Never | ✅ Required |

---

## 🎓 Summary

### For Your Dashboard:

**If data is already public (website UPNVJ):**
✅ Safe to use as-is

**If data contains personal info:**
⚠️ Anonymize OR use private repo

**If need real auth & data management:**
🔐 Use backend (Supabase recommended)

**Current recommendation:**
Since your data appears to be general statistics:
✅ **Safe to deploy publicly**
✅ Just verify no personal emails/phones
✅ Use provided utils if needed

---

## 📞 Questions?

Check:
1. Is this info already on UPNVJ website? → Safe
2. Would I mind if everyone sees this? → Your judgment
3. Contains personal identifiers? → Anonymize or backend

**Remember:** GitHub Pages is PUBLIC by default.
Even with private repo, deployed site is accessible to anyone!

For truly sensitive data, you MUST use backend authentication.
