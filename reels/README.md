# FNGN Dijital — Günlük Reels

Instagram (@fngndijital) için 1080×1920 bilgilendirici reels. Remotion ile kodlanmış, marka kiti `src/brand.tsx` içinde
(site ile aynı renkler: `#080808` zemin, `#E26205` turuncu; Bricolage Grotesque + Hanken Grotesk + Instrument Serif italik).

## Komutlar
```bash
npm install
npm run studio                       # canlı önizleme
npx remotion render src/index.ts Reel01-Dikkat out/fngn-reel-01-dikkat.mp4 --crf=18
```

## Müzik
ElevenLabs Music (`eleven_music_v2_5`) ile üretilen enstrümantal altlıklar: `public/music01.mp3` (Reel 01), `public/music02.mp3` (Reel 02).
Her reelde bir `musicVolume` zarfı var: girişte dolu, konuşma altında kısık (ducking), vurgu anından önce kısa sessizlik, outroda yükselir.
Render sonrası Instagram için ses seviyesi normalize edilir:
```bash
ffmpeg -i out/reel.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k final.mp4
```

## Yeni bir reel eklemek
1. Seslendirme: ElevenLabs, ses **Atakan – Deep, Warm & Confident** (`e9a1KJ0kRpwPORrz92UT`), model `eleven_v4`. MP3'ü `public/` içine koy.
2. Cümle zamanlarını ölç: `ffmpeg -i public/vo.mp3 -af silencedetect=n=-38dB:d=0.18 -f null -`
3. `src/reels/Reel01Dikkat.tsx`'i kopyala, `T` zaman tablosunu ve sahneleri güncelle, `src/Root.tsx`'e kaydet.
4. `Chrome` (üst marka bandı + ilerleme çubuğu) ve `Outro` (logo + CTA) her reelde ortak kalır.

## Reel 01 — "Dikkat pahalıdır"
Seslendirme metni:
> Dikkat... pahalıdır. Çünkü kitlenizin mesajınızı anlamaya çalışarak geçirdiği her saniye... kaybettiğiniz bir saniyedir.
> Müşteri kaybedersiniz. İvme kaybedersiniz. Fırsat kaybedersiniz. Pazarı kazanan markalar daha gürültülü değil.
> Daha net. Daha keskin. Daha bilinçli. Sürtünmeyi kaldırırlar. Anlaşılmayı hızlandırırlar. Kararı zahmetsiz kılarlar.
> Çünkü netlik bir avantaj değil... bir kaldıraçtır.

## Reel 02 — "Viral içeriğin formülü"
Kanca → Vaat → Değer → Açık Döngü 1 → Değer → Açık Döngü 2 → Değer → (Ama bir şey daha var…) → CTA → "Bunun ekran görüntüsünü al."

## Reel 03 — "Logonuz markanızın belki %10'u"
Renk → Yazı tipi → Şekiller → Fotoğraflar → Ses → Her yerde test. Örnek marka olarak FNGN'in kendi kimliği kullanılır.
Altyazı zamanları ElevenLabs Scribe ile çıkarılan kelime zamanlarından gelir (`W` dizisi).

## Reel 04 — "Bütün yolu görmen gerekmiyor"
Gece yolu (farlar 50 m gösterir) → Türkiye haritası Edirne→Kars (1.600 km = 32.000 × 50 m) → "Beklemeyi bırak" damgası → ışık huzmesinde adımlar → "50 metre yeterli."
Türkiye silüeti `src/reels/turkiye.ts` içinde, basitleştirilmiş koordinatlardan üretilmiştir (yaklaşık).

## Reel 05 — "Tavuk mu, yumurta mı?"
İllüstrasyonlu hikâye: paradoks döngüsü → Delil A (Andrew Chen, *The Cold Start Problem*, 2021) + boş parti →
Delil B (2016 Model 3 tanıtımı, 1 haftada 300.000+ kapora) → "Çok yakında" söz / "Şimdi satışta" yalan → rahatsız edici gerçek → "insanlarla başlayın".
Çizim kiti: `src/reels/illus.tsx` (tavuk, yumurta, döngü, maskot, kalabalık, araba, tabela, bilet…) sonraki hikâye reel'lerinde de kullanılabilir.

## Reel 06 — "Kolay bir hayır değil, bir seçim sunun"
Minimal çizgi animasyon: "sadece bakıyorum" (sonuç ← sebep) → "Yardımcı olabilir miyim?" = izin sorusu → kolay "hayır" →
iki seçenek + "Hangisini seçerdiniz?" → cevap + neden → kapı değil ürün → DM'de "Fiyat ne?" → iki paket → Satış kuralı #1.
Zamanlar cümle düzeyinde, silencedetect ile ölçüldü (`PH` dizisi).

## Reel 07 — "Marka kimliği nedir?"
Buzdağı: %20 marka ifadesi (görünen) / %80 marka stratejisi (suyun altı) → süreç (Keşif → Strateji → Tasarım → Geliştirme → Yayın) →
strateji diyagramı → moodboard → logo yönleri → temas noktaları → "Strateji anlam verir, tasarım o anlamı iletir" → site telefonlu CTA.
Telefondaki görüntü yerel olarak çalıştırılan sitenin TR mobil ekran görüntüsüdür (`public/site/fngn-mobile-tr.jpg`); kişisel bilgi
içermemesi için "Hakkımda" bölümünden önce kırpılmıştır. Videolarda kişi adı kullanılmaz, yalnızca marka (FNGN Dijital).
