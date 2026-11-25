#!/usr/bin/env python3
"""特定商取引法に基づく表記の 3 ページを _tokushoho/data.json から作る。
使い方: python3 _tokushoho/build.py          書く
        python3 _tokushoho/build.py --check  書かずに、今のファイルと同じかだけ調べる(違えば 1 で終わる)
"""
import html
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

# memoreo-tokushoho/index.html(11/22 の案)の meta と style をそのまま写したもの。{title} だけ差し替える
HEAD = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
  :root {
    --ink: #1a2238;
    --muted: #5b6478;
    --line: #e3e7ef;
    --accent: #3d5a99;
    --bg: #ffffff;
    --head: #f5f7fc;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Roboto, sans-serif;
    color: var(--ink);
    background: var(--bg);
    line-height: 1.8;
    -webkit-text-size-adjust: 100%;
  }
  .wrap { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
  header.app { border-bottom: 2px solid var(--accent); padding-bottom: 20px; margin-bottom: 8px; }
  header.app h1 { font-size: 1.5rem; margin: 0 0 4px; letter-spacing: .02em; }
  header.app p { margin: 0; color: var(--muted); font-size: .92rem; }
  section.policy { margin: 40px 0 64px; }
  h2.doctitle { font-size: 1.3rem; margin: 0 0 4px; }
  .effective { color: var(--muted); font-size: .85rem; margin: 0 0 28px; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 24px; }
  th, td { border: 1px solid var(--line); padding: 12px 14px; vertical-align: top; text-align: left; }
  th { background: var(--head); width: 30%; font-weight: 600; }
  td p { margin: 0 0 10px; }
  td p:last-child { margin-bottom: 0; }
  ul { margin: 0 0 10px; padding-left: 20px; }
  li { margin-bottom: 4px; }
  a { color: var(--accent); word-break: break-all; }
  footer { border-top: 1px solid var(--line); margin-top: 48px; padding-top: 20px; color: var(--muted); font-size: .85rem; text-align: center; }
  @media (max-width: 560px) {
    th, td { display: block; width: 100%; }
    th { border-bottom: none; }
  }
</style>
</head>
'''


def e(s):
    return html.escape(s, quote=True)


def block(b, common):
    if "p" in b:
        return "<p>%s</p>" % e(b["p"])
    if "ul" in b:
        return "<ul>\n" + "\n".join("            <li>%s</li>" % e(x) for x in b["ul"]) + "\n          </ul>"
    if "mail" in b:
        return '<p><a href="mailto:%s">%s</a></p>' % (e(b["mail"]), e(b["mail"]))
    if b.get("abroad"):
        return "<p>%s</p>" % e(common["abroad"])
    raise ValueError("知らないブロック: %r" % (b,))


def row(r, common):
    if "common" in r:
        r = common[r["common"]]
    tds = "\n          ".join(block(b, common) for b in r["td"])
    return "      <tr>\n        <th>%s</th>\n        <td>\n          %s\n        </td>\n      </tr>" % (e(r["th"]), tds)


def page(data, app):
    common = data["common"]
    title = "%s 特定商取引法に基づく表記" % app["name"]
    rows = "\n".join(row(r, common) for r in app["rows"])
    related = "／".join('<a href="%s">%s</a>' % (e(u), e(t)) for t, u in app["related"])
    return (
        HEAD.replace("{title}", e(title))
        + '''<body>
<div class="wrap">
  <header class="app">
    <h1>%s</h1>
    <p>特定商取引法に基づく表記</p>
  </header>
  <section class="policy">
    <h2 class="doctitle">特定商取引法に基づく表記</h2>
    <p class="effective">最終更新日：%s</p>

    <table>
%s
    </table>

    <p>関連するページ：%s</p>
  </section>
  <footer>Yolca</footer>
</div>
</body>
</html>
''' % (e(app["name"]), e(data["updated"]), rows, related)
    )


def main():
    check = "--check" in sys.argv[1:]
    data = json.loads((HERE / "data.json").read_text(encoding="utf-8"))
    bad = []
    for app in data["apps"]:
        out = page(data, app)
        p = ROOT / app["path"]
        if check:
            cur = p.read_text(encoding="utf-8") if p.exists() else None
            if cur != out:
                bad.append(app["path"])
        else:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(out, encoding="utf-8", newline="\n")
            print("書いた:", app["path"])
    if check:
        for b in bad:
            print("違う:", b)
        if bad:
            sys.exit(1)
        print("一致: %d ページ" % len(data["apps"]))


if __name__ == "__main__":
    main()
