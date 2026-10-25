# नया अपडेट — 3.1.0

**जाँच:** production build और 12 unit tests पास; 24 अक्टूबर 2026 npm audit में 0 reported vulnerabilities। इस सत्र में localhost server start को automatic approval review ने रोका, इसलिए नई browser/responsive और HTTP integration जाँच बाकी है। VPS पर launch से पहले उसे चलाएँ; विस्तृत जानकारी docs/VERIFICATION.md में है।

- Homepage: सबसे ऊपर automatically sliding learning cards; swipe, previous/next और pause controls। Card खोलने पर सीधा article content।
- **Admin → Homepage categories**: नाम, description, icon, local destination, क्रम और visibility। फोन पर दो columns (पहली चार categories 2×2), बड़े desktop पर चार columns।
- **Admin → YouTube videos**: YouTube URL डालें, title/description लिखें, Published चुनें। Thumbnail अपने आप दिखाई देगा। क्रम बदल सकते हैं; Archived करने पर video छिपेगा। Video click पर YouTube खुलेगा। आपके निर्देश पर कोई video पहले से नहीं भरा गया है।
- **Admin → Header & website → Academy logo**: PNG/JPEG/WebP (5 MB तक) upload करें। Image जाँच कर WebP में सुरक्षित रूप से save होती है।
- **Admin → Footer & information pages**: About, Contact, Privacy, Terms, Disclaimer और Editorial Policy पहले से published हैं। Content, title, क्रम और status edit कर सकते हैं; नया page भी जोड़ सकते हैं। ये आपके नए application में publish होते हैं, पुराने live domain पर deployment नहीं किया गया है।
- **Admin → Header & website**: section headings, introduction, header menu, brand, footer text और contact details।
- Library और admin की filter bars हटाई गई हैं। Header में साधारण text search है; articles सीधे खुलते हैं।

## लॉन्च से पहले अपना विवरण भरें
अपना सही contact email/phone जोड़ें। अपने original learning articles और अपने YouTube links publish करें। Default pages नई application की जानकारी के लिए लिखे गए हैं; उन्हें अपने संचालन और hosting के मुताबिक review करें। Policies/footer बन जाने से AdSense approval की गारंटी नहीं मिलती। पर्याप्त उपयोगी original content ज़रूरी है। Ads या analytics इस package में enabled नहीं हैं; बाद में जोड़ने पर privacy disclosure और लागू consent व्यवस्था अपडेट करनी होगी।

## 3.0 से update
पहले database और uploads का backup लें। 3.1 source से application रोककर update करें, npm ci, npm run build चलाएँ और restart करें। अपना DATA_DIR और .env बनाए रखें। नई tables/default pages पहली शुरुआत पर जुड़ते हैं; existing articles/accounts बने रहते हैं। पुराने About/Privacy/Terms setting fields को नये page editor में अपनी जरूरत के मुताबिक copy करें: पुराने custom text को स्वतः नए pages पर overwrite नहीं किया जाता। ये PHP zip या पुराने MySQL का migration नहीं है।

---

# Bihar Agriculture Academy — Next.js 3.0

यह नया Next.js project है। Public design Bihar Agriculture Academy के navy/orange header और learning-first homepage से प्रेरित है। Admin workflow दिए गए Dhaoo panel के folder, question और import workflow पर आधारित है। दोनों मूल ZIP और live website को बदला नहीं गया है।

## पहले यह जानें

- VPS / Node.js hosting के लिए है। PHP `public_html` में files डालने से यह नहीं चलेगा।
- Node.js 24 का maintained release और npm चाहिए। Database इसी server के private `DATA_DIR` में SQLite file है। एक application instance चलाएँ।
- यह नया database बनाता है। पुराने MySQL, PHP admin, Android API, accounts और uploads अपने-आप migrate नहीं होते। पुराने `.env`, SQL dump या PHP files इसमें copy न करें।
- कोई default admin password या production account package में नहीं है।

## अपने computer या VPS पर शुरू करें

Project folder खोलें:

```sh
npm ci
cp .env.example .env
```

Windows में `.env.example` की copy बनाकर नाम `.env` रखें। `.env` में local testing के लिए:

```dotenv
APP_ORIGIN=http://localhost:3000
DATA_DIR=./data
```

फिर:

```sh
npm run setup
npm run build
npm run start
```

Setup में अपना admin नाम, email और कम से कम 12 characters का password चुनें। Interactive terminal में password छिपा रहता है। पहले से admin होने पर setup उसे overwrite नहीं करेगा।

Browser में `http://localhost:3000` खोलें। Login के बाद admin को `/admin` पर भेजा जाता है। यदि port या hostname बदलें तो `APP_ORIGIN` में भी वही exact origin रखें; उसी address से browser खोलें।

## Admin कैसे इस्तेमाल करें

1. **Header & website:** Academy name, tagline, announcement, menu labels/links/order, search text, login/account labels, hero text/buttons, study card, footer, contact details, policies और accent colour बदलें। Menu editor में labels और local paths भरें; code edit नहीं करना है।
2. **Folders & sets:** Subject/chapter जैसे folders बनाएँ। Practice questions को `set` प्रकार के folder में link करें। Parent dropdown से move करें। 1,2,3 Sort natural number order लगाता है। Public visibility के लिए set और उसके सभी parent folders published होने चाहिए। Archive करके content छिपा सकते हैं; learner history सुरक्षित रहती है।
3. **Question bank:** MCQ लिखें, 2–5 consecutive options और सही answer चुनें। Review/active/hidden status चुनें। Bulk actions से publish, hide, link या unlink करें। Shared question का edit सभी linked sets में लागू होता है।
4. **Import questions:** Sample CSV download करें। CSV या CSV वाली ZIP upload करें, errors और preview देखें, फिर destination और questions-per-set चुनकर confirm करें। नए sets हमेशा draft बनते हैं। Duplicate questions reuse होते हैं; पुराने answer/status overwrite नहीं होते। Unfinished preview को इसी screen से resume कर सकते हैं।
5. **Articles & notes:** Article, short note, flashcard या one-liner लिखें। Blank line से paragraphs, `## ` से heading बनाएँ। Flashcard में पहली line prompt, अगली lines answer, फिर blank line दें। HTML execute नहीं होता। PDF upload इसी screen में है; draft PDF केवल staff download कर सकते हैं।
6. **Test patterns:** Question limit और duration तय करें। Students practice शुरू करते समय pattern चुन सकते हैं। Answer autosave, resume, timer, server-side marking और answer explanations हैं।
7. **Challenge calendar:** IST में आज या भविष्य की तारीख पर published set schedule करें। पर्याप्त active questions चाहिए। आज का challenge Practice page पर दिखता है।
8. **Learners & leaderboard:** Accounts खोजें, enable/disable करें। Disable करने पर sessions revoke होते हैं। Leaderboard completed practice sessions के total correct answers पर है; repeated practice फिर जुड़ती है। यह official exam rank नहीं है।

## Import limits

CSV: 8 MB, 20,000 rows. ZIP: 20 MB, अधिकतम 100 CSV files, हर CSV 8 MB और कुल extracted CSV 32 MB. एक import में अधिकतम 20,000 total rows. ZIP के CSV rows एक combined stream में sets में बाँटे जाते हैं; original directory tree recreate नहीं होता। Answer key A–E में एक correct option है।

## Sample content

नया project खाली library से शुरू होता है। केवल नए, खाली library में optional original sample content चाहिए तो:

```sh
npm run demo
```

यह SAMPLE-labelled subjects, articles और questions जोड़ता है; accounts नहीं बनाता। Screenshots इसी अलग sample/QA database से हैं। वह database ZIP में शामिल नहीं है।

## Password reset और staff role

Server terminal से:

```sh
npm run manage-user -- reset teacher@example.com
npm run manage-user -- role teacher@example.com editor
```

Account पहले register होना चाहिए। Roles: `student`, `editor`, `admin`. Role बदलने और password reset पर पुराने sessions revoke होते हैं। आखिरी active admin को demote नहीं किया जा सकता।

## VPS deployment

`docs/VPS-DEPLOYMENT.md` में systemd, Nginx, HTTPS, private data और backup के निर्देश हैं। `docs/VERIFICATION.md` में वास्तव में किए गए checks और सीमाएँ हैं।

## इस version की सीमा

यह पुराने DHAOO backend/API का drop-in replacement नहीं है। SQL dump import, पुराने users/password hashes का migration, Android app sync, payments, XP/coins/streak engine, graphical question parts, multi-correct/descriptive grading, negative marks और background 100,000-row imports इसमें implemented नहीं हैं। इन्हें working बताकर mock buttons नहीं दिए गए हैं। Existing MySQL data जोड़ने के लिए अलग migration mapping और acceptance test चाहिए। पुराने platform को इस नए project से replace करने से पहले staging पर review करें।
