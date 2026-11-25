// 生成物(eitango-app の docs/tools/promo/links/gen_site.js が links.json から作る。手で直さない)
// ストアのボタンに目印(App Store の ct・Google Play の utm_source)を付ける。クッキー・外部への送信は無い
// 目印つきのストアのリンクを作る関数(ページの中と、node の検査の両方で使う)。設定 C は links.json
function make(C) {
  var M = {};
  C.markers.forEach(function (m) { M[m.id] = m; });
  // 月ごとのキャンペーン名(日本時間の年-月。例 2026-12)。Google Play の utm_campaign にだけ入る
  function month(now) { return new Date((now || Date.now()) + 9 * 3600 * 1000).toISOString().slice(0, 7); }
  function apple(app, m) { return C.apps[app].appleBase + '?pt=' + C.pt + '&ct=' + m + '&mt=8'; }
  // now === null のときは月を付けない(JavaScript が動かないときに HTML に書いておく既定の形)
  function play(app, m, now) {
    var ref = 'utm_source=' + m + '&utm_medium=' + M[m].medium + (now === null ? '' : '&utm_campaign=' + month(now));
    return 'https://play.google.com/store/apps/details?id=' + C.apps[app].play + '&referrer=' + encodeURIComponent(ref);
  }
  // ?s=<目印>。表に無い値・目印なしは web(表に無い値は付けない=個人の情報などが紛れ込まない)
  function marker(search) {
    var s = /[?&]s=([a-z0-9]{1,30})(?:&|$)/.exec(search || '');
    return s && M[s[1]] ? s[1] : 'web';
  }
  function platform(ua, touch) {
    ua = ua || '';
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
    if (/Macintosh/.test(ua) && touch > 1) return 'ios'; // iPadOS は Mac と名乗る
    if (/Android/.test(ua)) return 'android';
    return 'other';
  }
  function site(app, m) { return '/?s=' + m + '#' + C.apps[app].anchor; }
  function findGo(name) { for (var i = 0; i < C.go.length; i++) if (C.go[i].name === name) return C.go[i]; return null; }
  function target(name, ua, touch, now) {
    var g = findGo(name);
    if (!g) return '/';
    var p = platform(ua, touch);
    if (p === 'ios') return apple(g.app, g.marker);
    if (p === 'android' && C.apps[g.app].android === 'play') return play(g.app, g.marker, now);
    return site(g.app, g.marker);
  }
  function appOfUrl(u) {
    var a = /^https:\/\/apps\.apple\.com\/.*\/id(\d+)/.exec(u), p = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=([\w.]+)/.exec(u);
    for (var k in C.apps) {
      if (a && C.apps[k].apple === a[1]) return k;
      if (p && C.apps[k].play === p[1]) return k;
    }
    return null;
  }
  // ページの中のストアのボタンすべてに、同じ目印を付ける
  function tag(doc, m, now) {
    var as = doc.querySelectorAll('a[href]');
    for (var i = 0; i < as.length; i++) {
      var h = as[i].getAttribute('href'), app = appOfUrl(h);
      if (!app) continue;
      if (/^https:\/\/apps\.apple\.com\//.test(h)) as[i].setAttribute('href', apple(app, m));
      else if (C.apps[app].play) as[i].setAttribute('href', play(app, m, now));
    }
  }
  function hub() { tag(document, marker(location.search)); }
  function go(name) {
    var g = findGo(name);
    if (!g) return;
    tag(document, g.marker);
    location.replace(target(name, navigator.userAgent, navigator.maxTouchPoints || 0));
  }
  return { C: C, month: month, apple: apple, play: play, marker: marker, platform: platform, target: target, appOfUrl: appOfUrl, tag: tag, hub: hub, go: go };
}
this.YolcaLinks = make({"pt":"129084556","apps":{"memoreo":{"name":"Memoreo","icon":"memoreo-icon.png","apple":"6790348995","appleBase":"https://apps.apple.com/app/apple-store/id6790348995","play":"com.yolca.memoreo","android":"play","anchor":"app-memoreo"},"kakomon":{"name":"過去問レコード","icon":"kakomon-icon.png","apple":"6802140240","appleBase":"https://apps.apple.com/jp/app/apple-store/id6802140240","play":"com.yolca.kakomon","android":"play","anchor":"app-kakomon"},"eitan":{"name":"必単 難関大","apple":"6823202018","appleBase":"https://apps.apple.com/jp/app/apple-store/id6823202018"}},"markers":[{"id":"memoprof","medium":"instagram","where":"Memoreo の Instagram のプロフィール","profile":"Memoreo の Instagram"},{"id":"memostory","medium":"instagram","where":"Memoreo の Instagram のストーリー"},{"id":"kouprof","medium":"instagram","where":"@studywithkou_med のプロフィール","profile":"@studywithkou_med"},{"id":"koustory","medium":"instagram","where":"@studywithkou_med のストーリー"},{"id":"web","medium":"web","where":"目印なしで yolca.dev に来た人"}],"go":[{"name":"memo-m","marker":"memostory","app":"memoreo"},{"name":"memo-k","marker":"memostory","app":"kakomon"},{"name":"kou-m","marker":"koustory","app":"memoreo"},{"name":"kou-k","marker":"koustory","app":"kakomon"}]});
