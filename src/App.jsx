import React, { useEffect, useMemo, useRef, useState } from "react";

// GokiCare – 子ども向け（だけど大人にも効く）ごほうび付き強化版
// 単一ファイルReact。Tailwind前提。localStorageで進捗＆報酬を保存。
// 露骨な実物描写は使わず、抽象SVGのみ。段階クリアでコイン＆ごほうび解放。

// --- 永続化ユーティリティ ---
const LS_KEY = "gokicare.v2";
const save = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; } };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// --- ごほうび定義（子ども向けに見えるが甘すぎないトーン） ---
// type: theme=配色, sticker=画面に貼れるシール, sfx=ご褒美ジングル（将来拡張）
const REWARDS = [
  { id: "th_sakura", type: "theme", name: "さくら配色", rarity: "common" },
  { id: "th_mint", type: "theme", name: "ミント配色", rarity: "common" },
  { id: "th_midnight", type: "theme", name: "ミッドナイト配色", rarity: "rare" },
  { id: "st_star", type: "sticker", name: "きらきらスター", rarity: "common" },
  { id: "st_ribbon", type: "sticker", name: "リボンバッジ", rarity: "common" },
  { id: "st_crystal", type: "sticker", name: "クリスタル", rarity: "rare" },
  { id: "st_wing", type: "sticker", name: "羽", rarity: "epic" },
];

// rarityに応じた重み（抽選確率）
const RARITY_WEIGHT = { common: 70, rare: 25, epic: 5 };

// --- 抽象“対象”のSVG（実物は出さない） ---
function AbstractBug({ intensity = 1, animate = false, theme = "default" }) {
  const legs = clamp(Math.round(intensity), 0, 10);
  const jitter = animate ? (Math.sin(Date.now()/200) * 0.5) : 0;
  const bodyLen = 60 + intensity * 4;
  const bodyWid = 28 + intensity * 2;
  const cx = 100, cy = 80 + jitter;
  const legsArr = Array.from({ length: legs });
  const fill = theme === "midnight" ? "#111827" : theme === "mint" ? "#D1FAE5" : theme === "sakura" ? "#FCE7F3" : "#E5E7EB";
  const body = theme === "midnight" ? "#9CA3AF" : "#111827";
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="0" y="0" width="200" height="160" fill={fill} />
      <ellipse cx={cx} cy={cy} rx={bodyLen/2} ry={bodyWid/2} fill={body} opacity={0.5} />
      <circle cx={cx + bodyLen/2 - 6} cy={cy - 4} r={8} fill={body} opacity={0.4} />
      {legsArr.map((_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const off = Math.floor(i/2);
        const sx = cx + side * (bodyWid/2);
        const sy = cy - bodyWid/2 + off * (bodyWid/legs || 1);
        const ex = sx + side * (18 + intensity*1.2);
        const ey = sy + (side>0? -6:6);
        return <line key={i} x1={sx} y1={sy} x2={ex} y2={ey} stroke={body} opacity={0.5} strokeWidth={2}/>;
      })}
    </svg>
  );
}

function BreathingGuide({ running }) {
  const [phase, setPhase] = useState(0); // 0 吸う / 1 止める / 2 吐く
  const [t, setT] = useState(0);
  const scheme = [4, 4, 6];
  useEffect(() => {
    if (!running) return;
    let s = performance.now();
    let id;
    const tick = (now) => {
      const dt = (now - s) / 1000; s = now;
      setT((prev) => {
        const next = prev + dt; 
        if (next >= scheme[phase]) { setPhase((p)=> (p+1)%3); return 0; }
        return next;
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running, phase]);
  const label = ["吸う","止める","吐く"][phase];
  const total = scheme[phase] || 1;
  const ratio = t/total;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-40 h-40 rounded-full border-2 border-neutral-300 grid place-items-center">
        <div className="transition-all duration-300 ease-linear" style={{ width: `${60 + 60*ratio}%`, height: `${60 + 60*ratio}%`}}>
          <div className="w-full h-full rounded-full bg-neutral-300/60" />
        </div>
      </div>
      <div className="text-sm text-neutral-600">{label} … {Math.ceil(total - t)} 秒</div>
    </div>
  );
}

const Tab = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm rounded-full border ${active? "bg-black text-white border-black": "bg-white text-black border-neutral-300 hover:bg-neutral-50"}`}>{children}</button>
);

// 段階プリセット（より子供向けの表現）
const DEFAULT_STEPS = [
  { id: "a1", label: "レベル1：まるとせん", intensity: 1, rewardCoin: 5 },
  { id: "a2", label: "レベル2：あしがすこし", intensity: 3, rewardCoin: 7 },
  { id: "a3", label: "レベル3：かたちがはっきり", intensity: 5, rewardCoin: 9 },
  { id: "a4", label: "レベル4：かげのシルエット", intensity: 7, rewardCoin: 12 },
  { id: "a5", label: "レベル5：ちょっとだけリアル", intensity: 9, rewardCoin: 15 },
];

// バッジ条件
const BADGES = [
  { id: "b_starter", name: "はじめの一歩", desc: "最初のレベルをクリア", rule: (s)=> s.idx >= 0 },
  { id: "b_streak3", name: "3れんしゅうデー", desc: "3日連続で練習", rule: (s)=> s.streak >= 3 },
  { id: "b_clear", name: "だんかいマスター", desc: "全レベルをクリア", rule: (s)=> s.idx >= (s.steps?.length-1) },
];

// 抽選ヘルパ
function drawReward(unlockedIds) {
  const pool = REWARDS.filter(r => !unlockedIds.includes(r.id));
  if (pool.length === 0) return null;
  const weighted = [];
  pool.forEach(r => { const w = RARITY_WEIGHT[r.rarity] || 1; for (let i=0;i<w;i++) weighted.push(r); });
  return weighted[Math.floor(Math.random()*weighted.length)];
}

export default function GokiCare() {
  const saved = load();
  const [tab, setTab] = useState(saved.tab || "play");
  const [steps, setSteps] = useState(saved.steps || DEFAULT_STEPS);
  const [idx, setIdx] = useState(saved.idx || 0);
  const [sessionSec, setSessionSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [blur, setBlur] = useState(saved.blur ?? 12);
  const [dim, setDim] = useState(saved.dim ?? 0.2);
  const [panic, setPanic] = useState(false);
  const [breath, setBreath] = useState(true);

  // ゲーム化要素
  const [coins, setCoins] = useState(saved.coins || 0);
  const [xp, setXp] = useState(saved.xp || 0);
  const level = 1 + Math.floor(xp / 50);
  const [unlocked, setUnlocked] = useState(saved.unlocked || []); // reward id 配列
  const [badges, setBadges] = useState(saved.badges || []); // バッジ id 配列
  const [theme, setTheme] = useState(saved.theme || "default");
  const [rewardModal, setRewardModal] = useState(null); // {coins, reward}

  // ストリーク（日付）
  const todayStr = new Date().toDateString();
  const [lastPlayed, setLastPlayed] = useState(saved.lastPlayed || null);
  const [streak, setStreak] = useState(saved.streak || 0);

  useEffect(()=>{
    // セッションタイマー
    if (!running) return; const id = setInterval(()=> setSessionSec(s=> s+1), 1000); return ()=> clearInterval(id);
  }, [running]);

  useEffect(()=>{
    // 保存
    save({ tab, steps, idx, blur, dim, coins, xp, unlocked, badges, theme, lastPlayed, streak });
  }, [tab, steps, idx, blur, dim, coins, xp, unlocked, badges, theme, lastPlayed, streak]);

  // ストリーク更新（初期読み込み時）
  useEffect(()=>{
    if (!lastPlayed) { setLastPlayed(todayStr); setStreak(1); return; }
    if (lastPlayed === todayStr) return; // 同日
    const prev = new Date(lastPlayed); const now = new Date(todayStr);
    const diff = Math.round((now - prev)/(1000*60*60*24));
    if (diff === 1) setStreak(s=> s+1); else setStreak(1);
    setLastPlayed(todayStr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cur = steps[idx] || steps[0];

  const applyBadges = (stateLike) => {
    const newOnes = BADGES.filter(b => !badges.includes(b.id) && b.rule({ ...stateLike, steps })).map(b=> b.id);
    if (newOnes.length) setBadges(prev=> [...prev, ...newOnes]);
  };

  const handleFinish = () => {
    setRunning(false);
    setSessionSec(0);

    // コイン & XP
    const gainCoin = cur?.rewardCoin || 5;
    const gainXp = 10 + (cur?.intensity || 1);

    // 抽選でごほうび
    const reward = drawReward(unlocked);
    setCoins(c=> c + gainCoin);
    setXp(x=> x + gainXp);

    if (reward) {
      setUnlocked(u=> [...u, reward.id]);
      if (reward.type === "theme") {
        // テーマ即適用も可（選択はRewardsタブで変更可）
        if (theme === "default") setTheme(reward.id.startsWith("th_")? reward.id.split("_")[1] : theme);
      }
    }

    setRewardModal({ coins: gainCoin, xp: gainXp, reward });

    // 次へ
    setIdx((i)=> clamp(i+1, 0, steps.length-1));

    // バッジ条件チェック
    applyBadges({ idx: idx+1, streak });
  };

  const resetView = () => { setBlur(12); setDim(0.2); };

  // 見た目テーマ
  const appBg = theme === "midnight" ? "bg-slate-900 text-slate-100" : theme === "mint" ? "bg-emerald-50" : theme === "sakura" ? "bg-pink-50" : "bg-neutral-50";

  return (
    <div className={`min-h-screen ${appBg} p-4 md:p-8 transition-colors`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">GokiCare — ごほうびトレーナー</h1>
            <p className="text-sm opacity-70">抽象イラストで“ちょっとずつ慣れる”。クリアでもらえるコインとごほうびで継続を支援。</p>
          </div>
          <div className="text-right">
            <div className="text-sm">Lv {level} ・ XP {xp}</div>
            <div className="text-sm">コイン {coins} ・ 連続 {streak}日</div>
          </div>
        </header>

        <div className="flex gap-2 mb-4">
          {[
            ["play","あそぶ"],
            ["learn","まなぶ"],
            ["rewards","ごほうび"],
            ["log","きろく"],
            ["settings","せってい"],
          ].map(([key, label]) => (
            <Tab key={key} active={tab===key} onClick={()=> setTab(key)}>{label}</Tab>
          ))}
        </div>

        {panic && (
          <div className="mb-4 p-4 rounded-xl bg-red-50/80 border border-red-200">
            <div className="font-semibold mb-2">いったん きゅうけい</div>
            <p className="text-sm mb-3 opacity-80">画面の動きを止めました。ゆっくり すって、止めて、はいて。水をちょっと飲もう。</p>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-black text-white" onClick={()=> setPanic(false)}>さいかい</button>
              <button className="px-3 py-2 rounded-lg bg-neutral-200" onClick={()=> { setPanic(false); setRunning(false); resetView(); }}>きょうはおわり</button>
            </div>
          </div>
        )}

        {tab === "learn" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">こわさは“がくしゅう”で弱くなる</h2>
            <ul className="list-disc pl-5 text-sm space-y-2 opacity-80">
              <li>むりはしない。こわくなったらパニックボタン。</li>
              <li>1レベル 1–3分。こわさが少し下がるのを待つのがコツ。</li>
              <li>実物は出さない。まる・せん・かげで“れんそう”に慣れる。</li>
            </ul>
            <div className="rounded-xl border bg-white/70 backdrop-blur p-4 text-sm">
              <div className="font-semibold mb-1">リフレーム</div>
              <p>体のドキドキは「ほんとうのあぶないサイン」じゃないこともある。“ちょっとだけ続ける”をえらべたら◎。</p>
            </div>
          </section>
        )}

        {tab === "play" && (
          <section className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white/80 backdrop-blur p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm opacity-70">レベル</div>
                <div className="text-xs opacity-70">{idx+1} / {steps.length}</div>
              </div>
              <div className="font-semibold">{cur?.label}</div>
              <div className="aspect-[5/4] rounded-xl overflow-hidden border mt-3 relative">
                <div className="absolute inset-0" style={{ filter: `blur(${blur}px) brightness(${1-dim})` }}>
                  <AbstractBug intensity={cur?.intensity || 1} animate={running} theme={theme} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs opacity-70 mb-1">ぼかし（強→弱）</div>
                  <input type="range" min={0} max={20} value={blur} onChange={(e)=> setBlur(parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="text-xs opacity-70 mb-1">暗さ（強→弱）</div>
                  <input type="range" min={0} max={0.8} step={0.05} value={dim} onChange={(e)=> setDim(parseFloat(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button onClick={()=> setRunning((r)=> !r)} className="px-3 py-2 rounded-lg bg-black text-white">{running? "いちじていし": "スタート"}</button>
                <button onClick={handleFinish} className="px-3 py-2 rounded-lg bg-neutral-200">クリア！</button>
                <button onClick={()=> setPanic(true)} className="px-3 py-2 rounded-lg bg-red-600 text-white">パニック</button>
                <div className="ml-auto text-xs opacity-70">けいか: {Math.floor(sessionSec/60)}:{String(sessionSec%60).padStart(2,'0')}</div>
              </div>

              <div className="mt-3">
                <div className="text-xs opacity-70 mb-1">SUDS（いまのこわさ）</div>
                <input type="range" min={0} max={100} defaultValue={40} className="w-full" />
              </div>
            </div>

            <div className="rounded-xl border bg-white/80 backdrop-blur p-4 flex flex-col items-center gap-4">
              <div className="text-sm opacity-70">呼吸ガイド</div>
              <BreathingGuide running={true} />
              <div className="text-xs opacity-70">すって4秒・とめて4秒・はいて6秒</div>
            </div>
          </section>
        )}

        {tab === "rewards" && (
          <section className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white/80 backdrop-blur p-4">
              <div className="font-semibold mb-2">もっているごほうび</div>
              <div className="grid grid-cols-2 gap-2">
                {unlocked.length === 0 && <div className="text-sm opacity-70">まだないよ。レベルをクリアすると もらえるよ！</div>}
                {unlocked.map(id => {
                  const r = REWARDS.find(x=> x.id===id);
                  if (!r) return null;
                  const isTheme = r.type === "theme";
                  return (
                    <div key={r.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-xs opacity-60">{r.rarity}</div>
                      </div>
                      {isTheme && (
                        <button className="px-2 py-1 text-sm rounded bg-black text-white" onClick={()=> setTheme(r.id.split("_")[1])}>つかう</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border bg-white/80 backdrop-blur p-4">
              <div className="font-semibold mb-2">バッジ</div>
              <div className="grid grid-cols-2 gap-2">
                {BADGES.map(b => {
                  const has = badges.includes(b.id);
                  return (
                    <div key={b.id} className={`border rounded-lg p-3 ${has? "": "opacity-40"}`}>
                      <div className="text-sm font-medium">{b.name}</div>
                      <div className="text-xs opacity-70">{b.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {tab === "log" && (
          <section className="rounded-xl border bg-white/80 backdrop-blur p-4">
            <div className="text-sm opacity-70 mb-2">しんちょく</div>
            <div className="w-full h-3 rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full bg-black" style={{ width: `${((idx+1)/steps.length)*100}%`}} />
            </div>
            <div className="text-xs opacity-70 mt-2">到達レベル: {idx+1} / {steps.length}</div>
            <div className="text-xs opacity-70 mt-1">れんぞく: {streak}日 / コイン: {coins} / XP: {xp} / Lv {level}</div>
          </section>
        )}

        {tab === "settings" && (
          <section className="rounded-xl border bg-white/80 backdrop-blur p-4 space-y-4">
            <div className="font-semibold">レベル編集</div>
            <div className="space-y-2">
              {steps.map((s, i)=> (
                <div key={s.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
                  <input className="border rounded-lg p-2 text-sm" value={s.label} onChange={(e)=>{
                    const v = e.target.value; setSteps(prev=> prev.map((p,pi)=> pi===i? {...p,label:v}:p));
                  }} />
                  <div className="text-xs opacity-70">強度</div>
                  <input type="number" min={1} max={10} value={s.intensity} onChange={(e)=>{
                    const v = clamp(parseInt(e.target.value||"1"),1,10);
                    setSteps(prev=> prev.map((p,pi)=> pi===i? {...p,intensity:v}:p));
                  }} className="w-20 border rounded-lg p-2 text-sm" />
                  <button className="px-2 py-2 rounded-lg bg-neutral-100" onClick={()=> setSteps(prev=> prev.filter((_,pi)=> pi!==i))}>削除</button>
                </div>
              ))}
              <button className="px-3 py-2 rounded-lg bg-black text-white" onClick={()=> setSteps(prev=> [...prev, { id: crypto.randomUUID(), label: "あたらしいレベル", intensity: 5, rewardCoin: 5 }])}>レベルを追加</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg bg-neutral-200" onClick={()=> { setIdx(0); resetView(); }}>はじめから</button>
              <button className="px-3 py-2 rounded-lg bg-red-600 text-white" onClick={()=> { localStorage.removeItem(LS_KEY); location.reload(); }}>ぜんぶリセット</button>
            </div>
            <div className="text-xs opacity-70">※ これは医療機器でも診断ツールでもありません。つらいときは専門家へ。</div>
          </section>
        )}

        {rewardModal && (
          <div className="fixed inset-0 bg-black/40 grid place-items-center p-4" onClick={()=> setRewardModal(null)}>
            <div className="max-w-sm w-full bg-white rounded-2xl p-5 shadow-xl" onClick={(e)=> e.stopPropagation()}>
              <div className="text-lg font-bold mb-2">クリア！ごほうび</div>
              <div className="text-sm mb-3">コイン +{rewardModal.coins} / XP +{rewardModal.xp}</div>
              {rewardModal.reward ? (
                <div className="mb-3">
                  <div className="text-sm">あたらしく てにいれた！</div>
                  <div className="mt-2 p-3 border rounded-lg">
                    <div className="font-medium">{rewardModal.reward.name}</div>
                    <div className="text-xs opacity-60">{rewardModal.reward.rarity}</div>
                  </div>
                </div>
              ) : (
                <div className="mb-3 text-sm opacity-70">今回は しゅつげん なし（つぎに期待！）</div>
              )}
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-black text-white" onClick={()=> { setRewardModal(null); setTab("rewards"); }}>ごほうびを見る</button>
                <button className="px-3 py-2 rounded-lg bg-neutral-200" onClick={()=> setRewardModal(null)}>とじる</button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-[11px] opacity-60">
          © {new Date().getFullYear()} GokiCare — client-side only / no tracking
        </footer>
      </div>
    </div>
  );
}
