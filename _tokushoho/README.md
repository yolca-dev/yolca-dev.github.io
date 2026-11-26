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
