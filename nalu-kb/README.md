# Ask Nalu (NaluAsk) Knowledge Base Pack — Vibe Network

This folder contains the complete, RAG-optimized knowledge base pack for **Ask Nalu** (`vbn_k_2026_vibenetwork`), covering both **Vibe Network platform documentation** (`01`–`06`) and the **live catalog of networks, creators, marketplace products, series/episodes, and broadcast transcripts** (`07`–`11`).

---

## Knowledge Base Inventory (`/nalu-kb/`)

### Part A — Core Platform & Architecture (`01`–`06`)
1. `01_vibe_platform_overview_and_contact.txt` — Platform overview, Digital Media Sovereignty, site navigation routes, and official Las Vegas HQ / phone (`702-575-2633`) / email (`Info@vibenetwork.tv`, `enterprise@vibenetwork.tv`) directory.
2. `02_channels_vs_networks_n2n_guide.txt` — Viewer vs. Creator Channel vs. Enterprise N2N Network guide, Command Center features, revenue splits, and valuation comparison.
3. `03_creator_features_monetization_and_affiliates.txt` — Going live, VODs & 90s previews, monthly subscriptions, live tipping, 1-on-1 `/call/` bookings, Shopify/native storefronts, Stripe Connect payouts, built-in CRM, and the 5% `?ref=` Affiliate Program.
4. `04_ai_translation_and_voice_cloning.txt` — WWTC 100+ language translation (TTS, TTT, STT, STS), ElevenLabs voice cloning, translated video caption overlays, and voice dictation.
5. `05_flagship_networks_directory.txt` — Executive summaries of flagship networks hosted on Vibe (AVO Network & Colleges, Christian Revival Network / KPLE-TV, Muscle & Fitness / Olympia, Global Combat Collective, B2K Network, KvK Bonaire, Courtney Bee).
6. `06_onboarding_support_and_legal_faq.txt` — Sign-up & password recovery, Automated Business Network Setup Wizard, Admin Dashboard guide, Terms of Service, Privacy/data deletion, DMCA, and payment/refund rules.

### Part B — Live Ecosystem, Creator, Store & Transcript Catalog (`07`–`11`)
7. `07_active_networks_and_avo_colleges_catalog.txt` — All 52 active white-label networks, including all 21 licensed AVO University NIL storefronts, Muscle & Fitness / Olympia / Wings of Strength sub-networks, B2K artist networks, Bonaire merchants, KPLE-TV Healing Rooms schedule, GCC, Sacred Serpent, and Las Vegas Food Truck hub.
8. `08_creator_channels_and_athletes_directory.txt` — All 90+ active creator channels, Mr. & Ms. Olympia champions, Wings of Strength pro athletes & Hall of Fame legends, Wild 'N Out & comedy hosts, AVO student-athlete campus ambassadors, and recent public channel posts.
9. `09_marketplace_and_merchandise_catalog.txt` — All 65 verified Marketplace & Creator Store items (`/marketplace`, `/product/:id`) with exact USD pricing, AVO 21-school Shopify collections, and GCC live fight ticket tiers.
10. `10_shows_series_episodes_and_vod_catalog.txt` — All 28 broadcast TV series, 20 full *Doc Wales Diaries* episodes (with synopses and dialogue), VOD/music videos, WatchLive curated clips, and Destinito Cinema films.
11. `11_vibe_video_transcripts_and_dialogue.txt` — 66 deduplicated, speaker-labeled transcripts across Vibe & partner broadcasts.

### Supplemental PDFs (`/public/`)
- `../public/benefits_of_owning_a_channel_and_network.pdf` — Official Strategic Business Whitepaper.
- `../public/GCC_Website_Leadership_Final.pdf` — Global Combat Collective leadership & network brief.

---

## Regenerating the Catalog Files

Whenever new networks, creators, products, series, or transcripts are added to Supabase, regenerate `07`–`11` via:

```bash
node scripts/generate_nalu_catalog_kb.mjs
```

Re-uploading any updated `.txt` file into the NaluAsk Client Portal (`https://nalu-enterprise.pages.dev/client-portal`) automatically replaces the previous chunks for that filename.

---

## Multi-Tenant Ask Nalu Configuration in Vibe UI

- **Master Admin (`/master-admin` → Enterprise AI):** Switch between **Vibe Network (Global Master Default)** and any active **White-Label Tenant Network** to toggle the Ask Nalu bubble on/off or assign a dedicated tenant `naluWidgetKey` and `naluPortalKey` (persisted in `whitelabel_configs.theme`).
- **Business Admin Dashboard (`Enterprise AI (Ask Nalu)`):** Network owners can toggle the Ask Nalu widget on/off for their network or connect their own isolated NaluAsk keys without exposing Vibe Master's portal credentials.
