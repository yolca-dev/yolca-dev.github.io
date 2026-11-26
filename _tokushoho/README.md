# 特定商取引法に基づく表記

Memoreo・過去問レコードの 2 ページ(`memoreo-tokushoho/`・`kakomon-tokushoho/` の index.html)は、`data.json` から `build.py` が作る。

## 直し方

値段・プラン・住所などを変えるときは、ページを手で直さず、`data.json` を直す。

1. `data.json` を直す(共通の行は `common`、アプリごとの行は `apps` の `rows`)
2. `python3 _tokushoho/build.py`(2 ページを書く)
3. `python3 _tokushoho/build.py --check`(0 で終われば、ページと data.json が一致)

`--check` が 1 で終わるときは、違うファイル名が出る。手で直したページか、build.py を通していないページ。

## メモ

- フォルダ名を `_` で始めているのは、GitHub Pages(Jekyll)が公開しないため。実際に公開されないかは、公開の時に確かめる。
- 文面の中の「【要確認】」は未確認の印。確認が取れたら data.json から外す。

## 「（税込）」の出典(2026-11-26 に確かめた)

- Google Play: 「税率と付加価値税（VAT）」の「内税方式で対応する国」の一覧に日本がある。
  https://support.google.com/googleplay/android-developer/answer/138000?hl=ja
- App Store: Apple の Tech Talk「Explore App Store pricing upgrades」の説明文に "Prices advertised to customers in all countries except the U.S. and Canada include taxes" とある(日本の名指しではなく、除かれるのが米国とカナダだけ、という読み取り)。
  https://developer.apple.com/videos/play/tech-talks/110364/
  参考: 米国だけが税抜きで表示される、という説明 https://developer.apple.com/news/?id=4o5ie73a
- 値段を変えたり、ストアの税の扱いが変わったりしたら、上の 2 つをもう一度見る。

## 「解約しても、支払い済みの期間の終わりまで」の文を外した(2026-11-26 に確かめた)

- Apple の公式(サポートの「Cancel a subscription from Apple」)と RevenueCat の公式ドキュメント(Billing Issues & Grace Periods・Apple App Store & TestFlight・Common Webhook Flows・Testing Use Cases)を見たが、「解約しても今の期間の終わりまで使える」と明示する 1 文は見つからなかった(RevenueCat の Web Billing の Subscription Lifecycle にはあるが、Web Billing 専用でアプリの課金とは別)。そのため data.json からこの文を消した。
- Google の出典は見つかっている: https://support.google.com/googleplay/answer/7018481?hl=ja(「お支払い済みの期間中は定期購入を利用できます」)。Apple 側の出典が見つかれば、文を戻せる。
