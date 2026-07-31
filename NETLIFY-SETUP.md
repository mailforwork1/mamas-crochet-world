# Mama's Crochet World — Netlify Setup Guide

Aapki site ab **full working admin panel** ke saath tayyar hai. Ye guide follow karein,
20–25 minute mein live ho jayegi.

---

## Kya banaya gaya hai

| Cheez | Kaam |
|---|---|
| **Netlify Identity** | Email + password se admin login (invite-only) |
| **`/api/catalog`** | Products/prices/settings server par save aur load |
| **`/api/upload`** | Photos server par upload (Netlify Blobs) |
| **Publish button** | Ek click mein changes sab customers ke liye live |

Ahem baat: ab changes **sirf aapke browser mein nahi** rehte — "Publish changes"
dabate hi duniya bhar ke customers ko naya catalog dikhta hai.

---

## Step 1 — Code GitHub par daalein

```bash
cd mamas-crochet-world
git init
git add .
git commit -m "Mama's Crochet World"
git branch -M main
git remote add origin https://github.com/AAP-KA-USERNAME/mamas-crochet-world.git
git push -u origin main
```

GitHub par pehle ek **naya empty repository** bana lein (README add na karein).

---

## Step 2 — Netlify par deploy

1. [app.netlify.com](https://app.netlify.com) par sign up karein (GitHub se login sab se asaan hai)
2. **Add new site → Import an existing project → GitHub**
3. Apni repository chunein
4. Build settings **khud bhar jayengi** (`netlify.toml` se):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. **Deploy** dabayein

2–3 minute mein site live ho jayegi, jaise `mamas-crochet-world.netlify.app`

---

## Step 3 — Identity on karein (admin login ke liye)

1. Netlify dashboard mein site kholein
2. **Integrations** (ya purane UI mein **Site configuration**) → **Identity** → **Enable Identity**
3. Identity → **Registration** → **Invite only** par set karein
   > Ye bohot zaruri hai, warna koi bhi sign up kar sakta hai
4. Identity → **Invite users** → apna email daalein (jaise `mamascrochetworld@gmail.com`)
5. Email par invite ka link ayega → password set kar lein

---

## Step 4 — Admin email server par batayein

1. **Site configuration → Environment variables → Add a variable**
2. Key: `ADMIN_EMAILS`
3. Value: `mamascrochetworld@gmail.com`
   > Ek se zyada admin ho to comma se: `ek@gmail.com,doosra@gmail.com`
4. **Deploys → Trigger deploy → Deploy site** (variable lagane ke liye ek baar redeploy zaruri hai)

Ab sirf yehi email changes publish kar sakta hai. Koi aur Identity user login bhi
kar le to server uske changes **reject** kar dega.

---

## Step 5 — Admin panel istemal karein

1. Site kholein: `https://aapki-site.netlify.app/#/admin`
   > Ya footer mein copyright ke baad wale chhote nuqte `·` par click karein
2. **Sign in with email** → apna email aur password
3. Changes karein:
   - **Products** — naya product, price/photo/description badlein, delete
   - **Categories** — category aur sub-category ki images
   - **Settings** — Instagram handle, free wrapping limit, announcement bar
4. **● Publish changes** dabayein → changes foran live 🎉

Photos seedha computer se upload hoti hain — koi code chhune ki zarurat nahi.

---

## Custom domain (agar chahen)

**Domain management → Add a domain** → apna domain (jaise `mamascrochetworld.com`)
daalein aur DNS instructions follow karein. SSL certificate Netlify khud muft laga deta hai.

---

## Kharcha

Netlify ka free tier aapke liye kaafi zyada hai:

- 100 GB bandwidth / mahina
- 125,000 function calls / mahina
- 1,000 Identity users
- Blobs storage shamil

Ek chhoti shop ke liye ye bilkul kaafi hai — kuch dena nahi parega.

---

## Local par chalana (test karne ke liye)

```bash
npm install
npm run dev            # sirf frontend, admin "preview mode" mein
```

Functions ke saath poora test karna ho to:

```bash
npm install -g netlify-cli
netlify login
netlify link           # apni site se jorein
netlify dev            # ab /api/... bhi chalega
```

**Preview mode** (bina Netlify ke) mein admin ka login:
- Email: `mamascrochetworld@gmail.com`
- Passcode: `mama2026`

Ye sirf local ke liye hai — `src/auth.tsx` mein `DEV_ADMIN_PASSCODE` badal lein.

---

## Ek self-contained HTML file chahiye?

```bash
npm run build:single
```

`dist/index.html` mein poori site ek hi file mein aa jati hai (bina admin backend ke).

---

## Backup

Admin panel → **Settings → ↓ Download backup** se poore catalog ki JSON file mil jati
hai. Mahine mein ek baar zaroor le lein. Kuch galat ho jaye to **↑ Restore backup**
se wapas la sakte hain.

---

## Masla ho to

**"Not authorised" aa raha hai publish par**
→ `ADMIN_EMAILS` variable check karein ke bilkul wahi email hai jis se login kiya, aur
   variable lagane ke baad ek baar redeploy kiya tha ya nahi.

**Login window nahi khulti**
→ Identity enable hai? Aur browser mein ad-blocker to nahi chal raha?

**Photo upload fail**
→ Image 6 MB se chhoti honi chahiye. Bari photo ho to pehle compress kar lein.

**Changes customers ko nahi dikh rahe**
→ **Publish changes** dabaya tha? Sirf edit karna kaafi nahi, publish zaruri hai.
