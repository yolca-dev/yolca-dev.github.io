# Memoreo グループ招待ページ(2026-11-28・ブランチ memoreo-join-1128・公開していない)

リンクの形: `https://yolca.dev/memoreo/join/#<招待コード 10 文字>`(アプリの `lib/ranking/group_link.dart`)。
コードは `#` の後なので、ブラウザは配信元(GitHub Pages)へ送らない。ページは外へ何も送らない(解析タグ・外部の読み込みなし)。

| ファイル | 役目 |
|---|---|
| `memoreo/join/index.html` | アプリが入っていない人のページ(コード表示・コピー・アプリを開く・ストアへ)。5 言語を端末の言語で切り替え。noindex |
| `.well-known/apple-app-site-association` | iOS の Universal Links: `/memoreo/join/*` を Memoreo(`TSV38FPG86.com.yolca.memoreo`)で開いてよいことを示す |
| `.well-known/assetlinks.json` | Android の App Links: `com.yolca.memoreo` とアプリ署名鍵の SHA-256 |
| `_config.yml` | `include: [".well-known"]` だけ。GitHub Pages(Jekyll)は `.` で始まるフォルダを出さないため |

`.nojekyll` にしなかった理由: `.nojekyll` は Jekyll 自体を止めるので、今は Jekyll が隠している `_tokushoho/`(特商法ページの元データ・build.py)が公開されてしまう。`_config.yml` の include なら他は変わらない。

## 公開後に確かめること

1. `curl -sI https://yolca.dev/.well-known/apple-app-site-association` が **200** で、`Location:` が無い(リダイレクトしない)。`assetlinks.json` も同じ。Content-Type は assetlinks が `application/json`、AASA は拡張子が無いので `application/octet-stream` になる見込み(未確認)
2. Apple の CDN が取り込んだか: `https://app-site-association.cdn-apple.com/a/v1/yolca.dev` に中身が返る(反映に最大 24 時間)
3. assetlinks: Google の Statement List Generator and Tester(`https://developers.google.com/digital-asset-links/tools/generator`)で `yolca.dev` ・ `com.yolca.memoreo` ・ SHA-256 を入れて確かめる。端末では `adb shell pm get-app-links com.yolca.memoreo` が `yolca.dev: verified`
4. `https://yolca.dev/memoreo/join/#ABCDE12345` を開いて、コードが `ABCDE-12345` と出る・コピーできる
5. 実機: アプリが入っている端末で、メモなどに書いたリンクを長押し(iOS)/ タップ(Android)してアプリが開くか。**「アプリを開いて参加」ボタン(同じサイト内のリンク)で iOS がアプリを開くかは未確認**(iOS は同じドメイン内の移動では Universal Links を働かせないことがある。開かなければ、メモなどからのリンクを使う)
6. アプリ(この道が入った版)を出す前にファイルを置く。iOS はアプリを入れたとき(と約 1 週間ごと)に読む
