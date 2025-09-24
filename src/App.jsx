import React, { useMemo, useState } from "react";

const STAGES = [
  {
    id: "1-1",
    level: 1,
    subStage: 1,
    title: "チャバネゴキブリを見分けよう",
    detailLevel: 1,
    learning: {
      topic: "チャバネゴキブリの特徴",
      summary: "キッチンや飲食店で最もよく見かける小型のゴキブリ。",
      points: [
        "体長は約13〜16mmとコンパクト。",
        "前胸背板に2本のくっきりした黒い筋が走る。",
        "温かい場所や家電の裏側に集まりやすい。",
      ],
      funFact: "卵鞘を持ち歩き、ふ化直前に置いていく習性があるよ。",
    },
    question: {
      prompt: "これは何？",
      choices: ["チャバネゴキブリ", "クロゴキブリ", "ヤマトゴキブリ", "トビイロゴキブリ"],
      answer: 0,
      hint: "胸の2本線に注目しよう。",
    },
    victory: {
      shout: "チャバネゴキブリを撃退！",
      message: "こまめに水気を拭き取ると住みにくくできるよ。",
    },
  },
  {
    id: "1-2",
    level: 1,
    subStage: 2,
    title: "クロゴキブリのポイント",
    detailLevel: 1,
    learning: {
      topic: "クロゴキブリは光沢のある黒色",
      summary: "日本の都市部で多い大型種。夜行性で湿った場所を好む。",
      points: [
        "体長は3cm前後で艶のある黒褐色。",
        "翅が長く、驚くと滑空することがある。",
        "下水道やマンホールの周辺から侵入しやすい。",
      ],
      funFact: "幼虫期は褐色だが、成虫になると黒っぽく艶が出る。",
    },
    question: {
      prompt: "これは何？",
      choices: ["クロゴキブリ", "ワモンゴキブリ", "オオゴキブリ", "チャバネゴキブリ"],
      answer: 0,
      hint: "真っ黒で大きい体がヒント。",
    },
    victory: {
      shout: "クロゴキブリを撃退！",
      message: "排水口の清掃と隙間の封鎖で侵入を防ごう。",
    },
  },
  {
    id: "1-3",
    level: 1,
    subStage: 3,
    title: "ワモンゴキブリの模様",
    detailLevel: 1,
    learning: {
      topic: "ワモンゴキブリは胸の輪模様が目印",
      summary: "大型で暖かい地域に多い種類。室内に侵入すると大暴れ。",
      points: [
        "前胸背板の中央に輪（リング）模様。",
        "赤みのある茶色で体長は3〜4cmとビッグサイズ。",
        "湿った場所と温かい環境を好む。",
      ],
      funFact: "飛ぶ力が強く、壁をよじ登るのも得意。",
    },
    question: {
      prompt: "これは何？",
      choices: ["ワモンゴキブリ", "クロゴキブリ", "ヤマトゴキブリ", "サツマゴキブリ"],
      answer: 0,
      hint: "胸のリング模様を見つけてね。",
    },
    victory: {
      shout: "ワモンゴキブリを撃退！",
      message: "水回りの湿気対策で居心地をなくそう。",
    },
  },
  {
    id: "2-1",
    level: 2,
    subStage: 1,
    title: "ヤマトゴキブリの暮らし",
    detailLevel: 2,
    learning: {
      topic: "ヤマトゴキブリは日本原産",
      summary: "屋外でも見かける日本原産のゴキブリ。寒さにも比較的強い。",
      points: [
        "体長は25〜35mmで黒褐色。",
        "オスは翅が長く、メスは短め。",
        "湿った落ち葉や下水道の周辺で生活する。",
      ],
      funFact: "冬でも見られる数少ない種類。",
    },
    question: {
      prompt: "これは何？",
      choices: ["ヤマトゴキブリ", "クロゴキブリ", "モリチャバネゴキブリ", "イエゴキブリ"],
      answer: 0,
      hint: "寒さに強い在来種だよ。",
    },
    victory: {
      shout: "ヤマトゴキブリを撃退！",
      message: "玄関まわりの落ち葉を片付けて侵入を防ごう。",
    },
  },
  {
    id: "2-2",
    level: 2,
    subStage: 2,
    title: "トビイロゴキブリの色",
    detailLevel: 2,
    learning: {
      topic: "トビイロゴキブリは栗色のボディ",
      summary: "南の地域でよく見られる中型種。全身が均一な茶色で落ち着いた色合い。",
      points: [
        "体長は約28mm、濃い栗色。",
        "翅に模様がなくマットな質感。",
        "夜間に活発で、光を嫌って素早く逃げる。",
      ],
      funFact: "英語名は\"Smokybrown\"。燻したような色が語源。",
    },
    question: {
      prompt: "これは何？",
      choices: ["トビイロゴキブリ", "ヤマトゴキブリ", "クロゴキブリ", "ワモンゴキブリ"],
      answer: 0,
      hint: "羽に模様がない栗色ボディ。",
    },
    victory: {
      shout: "トビイロゴキブリを撃退！",
      message: "屋外の植木鉢まわりを乾燥させると近寄りにくい。",
    },
  },
  {
    id: "2-3",
    level: 2,
    subStage: 3,
    title: "イエゴキブリの模様",
    detailLevel: 2,
    learning: {
      topic: "イエゴキブリは黄色い帯が特徴",
      summary: "乾燥した場所にも強く、家具の高い位置に潜むこともある小型種。",
      points: [
        "体長は10〜14mmで淡い茶色。",
        "胸部と腹部に薄黄色の帯模様。",
        "乾燥に強く、天井付近にも潜む。",
      ],
      funFact: "英語名は\"Brown-banded cockroach\"。帯模様がそのまま名前に。",
    },
    question: {
      prompt: "これは何？",
      choices: ["イエゴキブリ", "チャバネゴキブリ", "クロゴキブリ", "ワモンゴキブリ"],
      answer: 0,
      hint: "淡い黄色の帯に注目。",
    },
    victory: {
      shout: "イエゴキブリを撃退！",
      message: "家具の上も含めて掃除機をかけて隠れ家を減らそう。",
    },
  },
  {
    id: "3-1",
    level: 3,
    subStage: 1,
    title: "モリチャバネゴキブリの生活",
    detailLevel: 3,
    learning: {
      topic: "モリチャバネゴキブリはメスだけで増える",
      summary: "熱帯原産で観葉植物や温室から広がった種類。メスだけでも殖える不思議なゴキブリ。",
      points: [
        "体長は20〜25mm、こげ茶色。",
        "翅が短く、土にもぐるのが得意。",
        "単為生殖でメスだけでも繁殖する。",
      ],
      funFact: "同じ仲間が植木鉢の土から出てくることがあるよ。",
    },
    question: {
      prompt: "これは何？",
      choices: ["モリチャバネゴキブリ", "ヤマトゴキブリ", "トビイロゴキブリ", "ヒメマルゴキブリ"],
      answer: 0,
      hint: "翅が短く丸みがある姿。",
    },
    victory: {
      shout: "モリチャバネゴキブリを撃退！",
      message: "鉢植えの土を乾かしぎみにすると住みにくい。",
    },
  },
  {
    id: "3-2",
    level: 3,
    subStage: 2,
    title: "ヒメマルゴキブリの丸い体",
    detailLevel: 3,
    learning: {
      topic: "ヒメマルゴキブリはつややかな丸ボディ",
      summary: "落ち葉の下などにいる小型の森のゴキブリ。丸い体つきがチャームポイント。",
      points: [
        "体長は15mm前後で丸みが強い。",
        "胸部に薄い模様が入り、光沢がある。",
        "動きは比較的おだやか。",
      ],
      funFact: "ペットとして飼育されることもある。",
    },
    question: {
      prompt: "これは何？",
      choices: ["ヒメマルゴキブリ", "モリチャバネゴキブリ", "イエゴキブリ", "サツマゴキブリ"],
      answer: 0,
      hint: "ころんとした丸い体つき。",
    },
    victory: {
      shout: "ヒメマルゴキブリを撃退！",
      message: "落ち葉の下はこまめに掃いていこう。",
    },
  },
  {
    id: "3-3",
    level: 3,
    subStage: 3,
    title: "オオゴキブリの迫力",
    detailLevel: 3,
    learning: {
      topic: "オオゴキブリは日本最大級",
      summary: "森林に住む巨大なゴキブリ。艶消しの黒色で厚みがある。",
      points: [
        "体長は45〜60mmとビッグサイズ。",
        "翅は退化していて飛べない。",
        "朽ち木の中で暮らし、家の中にはほとんど出ない。",
      ],
      funFact: "木をかじってトンネルを作る力持ち。",
    },
    question: {
      prompt: "これは何？",
      choices: ["オオゴキブリ", "クロゴキブリ", "ワモンゴキブリ", "チャバネゴキブリ"],
      answer: 0,
      hint: "艶消しブラックの超大型。",
    },
    victory: {
      shout: "オオゴキブリを撃退！",
      message: "倒木を片付けて生息場所を整理しよう。",
    },
  },
  {
    id: "4-1",
    level: 4,
    subStage: 1,
    title: "サツマゴキブリの模様",
    detailLevel: 4,
    learning: {
      topic: "サツマゴキブリは縁どりが黄色",
      summary: "九州以南で見られる比較的大型の種類。翅の縁が明るく彩られる。",
      points: [
        "体長は30mmほどで赤褐色。",
        "前胸背板や腹部の縁が黄色くふちどられる。",
        "湿った落ち葉や石の下を好む。",
      ],
      funFact: "夜になると街灯に引き寄せられることも。",
    },
    question: {
      prompt: "これは何？",
      choices: ["サツマゴキブリ", "ヤエヤマゴキブリ", "オオゴキブリ", "トビイロゴキブリ"],
      answer: 0,
      hint: "縁どりの黄色がヒント。",
    },
    victory: {
      shout: "サツマゴキブリを撃退！",
      message: "庭木の落ち葉を減らすと出会いが減るよ。",
    },
  },
  {
    id: "4-2",
    level: 4,
    subStage: 2,
    title: "ヤエヤマゴキブリの力強さ",
    detailLevel: 4,
    learning: {
      topic: "ヤエヤマゴキブリは南の島の大型種",
      summary: "沖縄や八重山諸島で見られる大型種。翅が短く、脚がとても力強い。",
      points: [
        "体長は40mm前後でずんぐりした体。",
        "翅が短く、ほとんど飛ばない。",
        "夜行性で落ち葉や果実を食べる。",
      ],
      funFact: "防衛のために甘い香りを出すことがある。",
    },
    question: {
      prompt: "これは何？",
      choices: ["ヤエヤマゴキブリ", "サツマゴキブリ", "モリチャバネゴキブリ", "マダガスカルゴキブリ"],
      answer: 0,
      hint: "翅が短い大型の南国ローチ。",
    },
    victory: {
      shout: "ヤエヤマゴキブリを撃退！",
      message: "甘い餌の放置は厳禁。こまめに片付けよう。",
    },
  },
  {
    id: "4-3",
    level: 4,
    subStage: 3,
    title: "アフリカヒラタゴキブリのシルエット",
    detailLevel: 4,
    learning: {
      topic: "アフリカヒラタゴキブリはぺたんとした体",
      summary: "ペットとしても人気の平たいゴキブリ。樹皮のすき間に潜むのが得意。",
      points: [
        "体長は30mmほどで扁平な体。",
        "翅は半透明でまだら模様。",
        "夜行性で乾いた木の隙間に棲む。",
      ],
      funFact: "驚くと素早く木の裏側に回り込むよ。",
    },
    question: {
      prompt: "これは何？",
      choices: ["アフリカヒラタゴキブリ", "マダガスカルゴキブリ", "オレンジヘッドローチ", "デュビア"],
      answer: 0,
      hint: "平たく扁平な体に注目。",
    },
    victory: {
      shout: "アフリカヒラタゴキブリを撃退！",
      message: "木材のすき間をふさぐと安心。",
    },
  },
  {
    id: "5-1",
    level: 5,
    subStage: 1,
    title: "マダガスカルオオゴキブリの鳴き声",
    detailLevel: 5,
    learning: {
      topic: "マダガスカルオオゴキブリは威嚇で鳴く",
      summary: "世界最大級。空気を吐いて「シュー」と鳴くことで有名。",
      points: [
        "体長は60mmを超えることもある。",
        "艶のある黒〜こげ茶で節がはっきり。",
        "オスは角のような突起があり、威嚇時に鳴く。",
      ],
      funFact: "英語ではHissing Cockroach。ペットとしても人気。",
    },
    question: {
      prompt: "これは何？",
      choices: ["マダガスカルオオゴキブリ", "ヤエヤマゴキブリ", "サツマゴキブリ", "モリチャバネゴキブリ"],
      answer: 0,
      hint: "ずっしり太く、角のような突起があるよ。",
    },
    victory: {
      shout: "マダガスカルオオゴキブリを撃退！",
      message: "厚みのある体でもスプレーでしっかり対応。",
    },
  },
  {
    id: "5-2",
    level: 5,
    subStage: 2,
    title: "オレンジヘッドローチの配色",
    detailLevel: 5,
    learning: {
      topic: "オレンジヘッドローチは頭部が鮮やか",
      summary: "飼育餌としても知られる中南米原産の大型種。頭が明るいオレンジ色。",
      points: [
        "体長は45mm前後で厚みがある。",
        "頭部がオレンジ色、胸部は黒。",
        "湿った木の中や落ち葉を食べる。",
      ],
      funFact: "繁殖力が高く、飼育箱では大繁殖する。",
    },
    question: {
      prompt: "これは何？",
      choices: ["オレンジヘッドローチ", "マダガスカルオオゴキブリ", "アフリカヒラタゴキブリ", "デュビア"],
      answer: 0,
      hint: "オレンジ色の頭が最大のヒント。",
    },
    victory: {
      shout: "オレンジヘッドローチを撃退！",
      message: "生ゴミを密閉して餌を遮断しよう。",
    },
  },
  {
    id: "5-3",
    level: 5,
    subStage: 3,
    title: "デュビア（アルゼンチンモリゴキブリ）",
    detailLevel: 5,
    learning: {
      topic: "デュビアは温厚でずんぐり",
      summary: "爬虫類の餌として有名なアルゼンチンモリゴキブリ。メスは翅が短い。",
      points: [
        "体長は40〜45mmでずんぐりした体型。",
        "オスは長い翅、メスは短い翅で丸い。",
        "暖かく湿った環境で群れを作る。",
      ],
      funFact: "騒音が少なく飼育がしやすいと人気。",
    },
    question: {
      prompt: "これは何？",
      choices: ["デュビア", "オレンジヘッドローチ", "ヤエヤマゴキブリ", "アフリカヒラタゴキブリ"],
      answer: 0,
      hint: "丸い体と短い翅の組み合わせ。",
    },
    victory: {
      shout: "デュビアを撃退！",
      message: "暖かい隙間を作らないのがコツ。",
    },
  },
];

const TOTAL_STAGES = STAGES.length;

const getStageName = (stage) => {
  if (!stage) return "";
  const { question, title } = stage;
  if (question && Array.isArray(question.choices)) {
    const answerIndex = Math.max(0, Math.min(question.answer ?? 0, question.choices.length - 1));
    return question.choices[answerIndex];
  }
  return title;
};

const StageBadge = ({ stage, status }) => {
  const base = "px-3 py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all";
  const label = `レベル${stage.level}-${stage.subStage}`;
  if (status === "done") {
    return <span className={`${base} bg-emerald-500/10 border-emerald-400 text-emerald-700`}>{label}</span>;
  }
  if (status === "active") {
    return <span className={`${base} bg-orange-100 border-orange-300 text-orange-700`}>{label}</span>;
  }
  return <span className={`${base} bg-white border-neutral-200 text-neutral-400`}>{label}</span>;
};

const StageTimeline = ({ currentIndex, phase }) => (
  <div className="flex flex-wrap gap-2">
    {STAGES.map((stage, index) => {
      const isDone = index < currentIndex || (index === currentIndex && phase === "result");
      const isActive = index === currentIndex && phase !== "result";
      const status = isDone ? "done" : isActive ? "active" : "todo";
      return <StageBadge key={stage.id} stage={stage} status={status} />;
    })}
  </div>
);

const createRoachMotion = (stage) => {
  const direction = Math.random() > 0.5 ? "ltr" : "rtl";
  const startX = direction === "ltr" ? "-240px" : "260px";
  const endX = direction === "ltr" ? "260px" : "-240px";
  const midX = `${(Math.random() - 0.5) * 60}px`;
  const verticalStart = (Math.random() - 0.5) * 26;
  const verticalEnd = verticalStart + (Math.random() - 0.5) * 24;
  const verticalMid = (verticalStart + verticalEnd) / 2 + (Math.random() - 0.5) * 16;
  const levelFactor = Math.min(stage?.level ?? 1, 5);
  const baseDuration = 3.6 - levelFactor * 0.28;
  const duration = Math.max(2.4, baseDuration + (Math.random() - 0.5) * 1.2);
  const delay = Math.random() * 0.6;
  const startTiltMagnitude = 8 + Math.random() * 6;
  const endTiltMagnitude = 6 + Math.random() * 6;
  const tiltStart = direction === "ltr" ? -startTiltMagnitude : startTiltMagnitude;
  const tiltEnd = direction === "ltr" ? endTiltMagnitude : -endTiltMagnitude;
  const tiltMid = (Math.random() - 0.5) * 12;

  return {
    startX,
    midX,
    endX,
    verticalStart,
    verticalMid,
    verticalEnd,
    tiltStart,
    tiltMid,
    tiltEnd,
    duration,
    delay,
  };
};

const StageVisual = ({
  stage,
  interactive = false,
  onActivate,
  isTarget = false,
  instruction,
  motionSeed = 0,
}) => {
  const baseClass =
    "relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-inner";

  const handleKeyDown = (event) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate?.();
    }
  };

  if (!stage) {
    return (
      <div className={`${baseClass} flex items-center justify-center bg-neutral-50 text-sm font-medium text-neutral-400`}>
        出現を待っています…
      </div>
    );
  }

  const palette = [
    { bg: "#FEF2F2", body: "#F87171", accent: "#FDA4AF", stroke: "#B91C1C" },
    { bg: "#FFFBEB", body: "#F59E0B", accent: "#FCD34D", stroke: "#B45309" },
    { bg: "#E0F2FE", body: "#0284C7", accent: "#7DD3FC", stroke: "#0C4A6E" },
    { bg: "#E2E8F0", body: "#475569", accent: "#CBD5F5", stroke: "#1F2937" },
    { bg: "#111827", body: "#F97316", accent: "#FACC15", stroke: "#FB923C" },
  ][Math.min(stage.level - 1, 4)];

  const motion = useMemo(() => {
    if (!interactive) return null;
    return createRoachMotion(stage);
  }, [interactive, stage?.id, motionSeed]);

  const motionStyle =
    interactive && motion
      ? {
          "--roach-start-x": motion.startX,
          "--roach-mid-x": motion.midX,
          "--roach-end-x": motion.endX,
          "--roach-y-start": `${motion.verticalStart}px`,
          "--roach-y-mid": `${motion.verticalMid}px`,
          "--roach-y-end": `${motion.verticalEnd}px`,
          "--roach-tilt-start": `${motion.tiltStart}deg`,
          "--roach-tilt-mid": `${motion.tiltMid}deg`,
          "--roach-tilt-end": `${motion.tiltEnd}deg`,
          animationDuration: `${motion.duration}s`,
          animationDelay: `${motion.delay}s`,
        }
      : undefined;

  const roachGroupProps = interactive
    ? {
        className: "roach-sweep",
        style: motionStyle,
        key: `${stage.id}-${motionSeed}`,
      }
    : { key: `${stage.id}-static` };

  const gradientId = `goki-body-${stage.id}`;
  const highlightId = `goki-highlight-${stage.id}`;
  const centerX = 120;
  const centerY = 92;
  const bodyLength = 110 + stage.level * 12;
  const bodyWidth = 48 + stage.level * 6;
  const segments = 4 + stage.subStage;

  const segmentElements = Array.from({ length: segments }, (_, idx) => {
    const ratio = segments === 1 ? 0 : idx / (segments - 1);
    const offsetY = (ratio - 0.5) * (26 + stage.level * 3);
    const rx = bodyLength / 2 - ratio * (10 + stage.level);
    const ry = bodyWidth / 2 - ratio * (6 + stage.level * 0.5);
    return (
      <ellipse
        key={`segment-${idx}`}
        cx={centerX}
        cy={centerY + offsetY}
        rx={Math.max(rx, 14)}
        ry={Math.max(ry, 12)}
        fill={`url(#${gradientId})`}
        opacity={0.85 - ratio * 0.2}
      />
    );
  });

  const legLength = 34 + stage.level * 8;
  const legWidth = 2.8 + stage.level * 0.4;
  const legOffsets = [-1.1, 0, 1.1];
  const legs = [];
  legOffsets.forEach((offset, rowIdx) => {
    [-1, 1].forEach((side) => {
      const x1 = centerX + side * (bodyLength / 2 - 8);
      const y1 = centerY + offset * (bodyWidth / 1.8);
      const bend = 12 + rowIdx * 4;
      const x2 = x1 + side * (legLength + rowIdx * 4);
      const y2 = y1 + (side === -1 ? -bend : bend);
      legs.push(
        <line
          key={`leg-${rowIdx}-${side}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={palette.stroke}
          strokeWidth={legWidth}
          strokeLinecap="round"
          opacity={0.85}
        />
      );
      if (stage.level >= 3) {
        const x3 = x2 + side * (14 + stage.level * 2);
        const y3 = y2 + (side === -1 ? -10 : 10);
        legs.push(
          <line
            key={`leg-tip-${rowIdx}-${side}`}
            x1={x2}
            y1={y2}
            x2={x3}
            y2={y3}
            stroke={palette.stroke}
            strokeWidth={legWidth * 0.7}
            strokeLinecap="round"
            opacity={0.7}
          />
        );
      }
    });
  });

  const antennae = [-1, 1].map((side) => {
    const startX = centerX + side * (bodyWidth * 0.45);
    const startY = centerY - bodyWidth * 0.95;
    const ctrlX = startX + side * (48 + stage.subStage * 6);
    const ctrlY = startY - (60 + stage.level * 6);
    const endX = startX + side * (88 + stage.level * 12);
    const endY = startY - (70 + stage.level * 9);
    return (
      <path
        key={`antenna-${side}`}
        d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
        stroke={palette.stroke}
        strokeWidth={2.3}
        strokeLinecap="round"
        fill="none"
        opacity={0.8}
      />
    );
  });

  const interactiveClass = interactive
    ? "cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400"
    : "";
  const targetClass = isTarget ? "ring-4 ring-rose-200" : "";

  return (
    <div
      className={`${baseClass} ${interactiveClass} ${targetClass}`.trim()}
      onClick={interactive ? onActivate : undefined}
      onKeyDown={handleKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${getStageName(stage)}をタップ` : undefined}
    >
      <svg viewBox="0 0 240 180" className="h-full w-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.accent} />
            <stop offset="70%" stopColor={palette.body} />
            <stop offset="100%" stopColor={palette.stroke} />
          </linearGradient>
          <radialGradient id={highlightId} cx="20%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="240" height="180" fill={palette.bg} />
        <g opacity={0.25} fill="#ffffff">
          <circle cx="28" cy="32" r="18" />
          <circle cx="214" cy="146" r="22" />
          <circle cx="210" cy="32" r="14" />
        </g>
        <g {...roachGroupProps}>
          {segmentElements}
          <ellipse
            cx={centerX}
            cy={centerY - bodyWidth * 0.58}
            rx={bodyWidth * 0.45}
            ry={bodyWidth * 0.35}
            fill={palette.stroke}
            opacity={0.85}
          />
          <ellipse
            cx={centerX}
            cy={centerY - bodyWidth * 0.32}
            rx={bodyWidth * 0.6}
            ry={bodyWidth * 0.48}
            fill={`url(#${gradientId})`}
          />
          <ellipse
            cx={centerX}
            cy={centerY + bodyWidth * 0.08}
            rx={bodyWidth * 0.85}
            ry={bodyWidth * 0.62}
            fill={`url(#${gradientId})`}
            opacity={0.92}
          />
          <ellipse
            cx={centerX}
            cy={centerY}
            rx={bodyWidth * 0.7}
            ry={bodyWidth * 0.45}
            fill={`url(#${highlightId})`}
            opacity={0.5}
          />
          {legs}
          {antennae}
          <circle
            cx={centerX - bodyWidth * 0.25}
            cy={centerY - bodyWidth * 0.72}
            r={4 + stage.level}
            fill="#111827"
            opacity={0.65}
          />
          <circle
            cx={centerX + bodyWidth * 0.25}
            cy={centerY - bodyWidth * 0.72}
            r={4 + stage.level}
            fill="#111827"
            opacity={0.65}
          />
        </g>
      </svg>
      <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
        レベル{stage.level}-{stage.subStage}
      </div>
      <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-neutral-600 shadow-sm">
        {stage.learning.topic}
      </div>
      {interactive && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-rose-500 shadow-sm">
            {instruction || "ターゲットならタップで撃退"}
          </span>
        </div>
      )}
    </div>
  );
};

const VictoryScene = ({ stage }) => {
  const level = Math.min(stage.level || 1, 5);
  const palette = [
    { glow: "#FCD34D", beam: "#F97316" },
    { glow: "#34D399", beam: "#10B981" },
    { glow: "#60A5FA", beam: "#2563EB" },
    { glow: "#A78BFA", beam: "#7C3AED" },
    { glow: "#FBBF24", beam: "#F59E0B" },
  ][level - 1];
  const gradientId = `victory-${stage.id}`;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border-2 border-emerald-300 bg-emerald-50 shadow-inner">
      <svg viewBox="0 0 240 180" className="w-full h-full">
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="240" height="180" fill={`url(#${gradientId})`} />
        <g stroke={palette.beam} strokeWidth="12" strokeLinecap="round" opacity="0.45">
          <line x1="20" y1="160" x2="220" y2="20" />
          <line x1="20" y1="20" x2="220" y2="160" />
        </g>
        <g transform="translate(120 90)" opacity="0.75">
          <ellipse cx="0" cy="24" rx="58" ry="24" fill="rgba(16,185,129,0.3)" />
          <path
            d="M -36 -20 C -18 -60, 18 -60, 36 -20 L 30 28 C 10 36, -10 36, -30 28 Z"
            fill="#1F2937"
          />
          <line x1="-50" y1="-10" x2="-90" y2="-40" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />
          <line x1="50" y1="-10" x2="90" y2="-40" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />
          <circle cx="-12" cy="-32" r="6" fill="#FBBF24" />
          <circle cx="12" cy="-32" r="6" fill="#FBBF24" />
        </g>
        <g stroke={palette.beam} strokeWidth="4" strokeLinecap="round">
          <line x1="30" y1="30" x2="70" y2="20" />
          <line x1="210" y1="120" x2="170" y2="130" />
          <line x1="120" y1="0" x2="120" y2="26" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-emerald-700 drop-shadow-sm">
        撃退成功！
      </div>
    </div>
  );
};

const LearningCard = ({ stage, onStart }) => (
  <section className="space-y-6 rounded-[32px] border border-orange-200 bg-white/95 p-8 shadow-sm">
    <div className="text-sm font-semibold text-orange-500">STEP 1: ゴキブリの知識をインプット</div>
    <div className="grid gap-6 md:grid-cols-[1.1fr_minmax(0,0.9fr)]">
      <StageVisual stage={stage} isTarget />
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            ターゲット: {getStageName(stage)}
          </span>
          <h2 className="text-2xl font-bold text-neutral-900">{stage.title}</h2>
        </div>
        <p className="text-sm leading-relaxed text-neutral-600">{stage.learning.summary}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
          {stage.learning.points.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs text-neutral-600">
          {stage.learning.funFact}
        </div>
        <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
          出現したゴキブリがターゲットと一致したら即タップ。それ以外は落ち着いてやり過ごそう。
        </div>
        <div className="flex justify-end">
          <button
            onClick={onStart}
            className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]"
          >
            理解した。殺す。
          </button>
        </div>
      </div>
    </div>
  </section>
);

const HuntCard = ({ stage, currentRoach, onRoachTap, onSkip, message, encounterCount }) => (
  <section className="space-y-6 rounded-[32px] border border-neutral-200 bg-white/95 p-8 shadow-sm">
    <div className="text-sm font-semibold text-rose-500">STEP 2: ターゲットを撃退</div>
    <div className="grid gap-6 md:grid-cols-[1.2fr_minmax(0,0.9fr)]">
      <StageVisual
        stage={currentRoach}
        interactive
        onActivate={onRoachTap}
        instruction="ターゲットなら即タップ！"
        motionSeed={encounterCount}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-neutral-900">ターゲットが出るまで待ち構えよう</h3>
          <p className="text-xs text-neutral-500">ヒント: {stage.question.hint}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-600">
          ターゲット: {getStageName(stage)}
          <span className="ml-2 text-[10px] text-rose-400">（出現回数 {encounterCount} 回）</span>
        </div>
        <div className="space-y-1 text-sm text-neutral-600">
          <p>・表示されたゴキブリがターゲットならタップして撃退。</p>
          <p>・違う種類のときは落ち着いて「スルーする」を押して次を待とう。</p>
          <p>・誤ってタップすると学習からやり直しだ。</p>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-rose-400 hover:bg-rose-50"
        >
          スルーする（別のゴキブリを待つ）
        </button>
        {message && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            {message}
          </div>
        )}
      </div>
    </div>
  </section>
);

const ResultCard = ({ stage, onNext, isFinal }) => (
  <section className="space-y-6 rounded-[32px] border border-emerald-300 bg-white/95 p-8 shadow-lg">
    <div className="text-sm font-semibold text-emerald-600">STEP 3: 撃退完了</div>
    <VictoryScene stage={stage} />
    <div className="space-y-2 text-center">
      <h3 className="text-2xl font-bold text-neutral-900">{stage.victory.shout}</h3>
      <p className="text-sm text-neutral-600">{stage.victory.message}</p>
    </div>
    <div className="flex justify-center">
      <button
        onClick={onNext}
        className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-transform hover:scale-[1.02]"
      >
        {isFinal ? "コンプリート！結果を見る" : "次のステージへ"}
      </button>
    </div>
  </section>
);

const FailCard = ({ stage, mistake, onRetry }) => {
  const mistakeName = getStageName(mistake) || "別のゴキブリ";
  return (
    <section className="space-y-6 rounded-[32px] border border-rose-200 bg-white/95 p-8 shadow-lg">
      <div className="text-sm font-semibold text-rose-500">STEP 2: 撃退失敗</div>
      <div className="grid gap-6 md:grid-cols-[1.1fr_minmax(0,0.9fr)]">
        <StageVisual stage={mistake} />
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-neutral-900">
            これは {mistakeName} だった！
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600">
            狙うべきは {getStageName(stage)}。違う種類を叩いてしまったので、もう一度特徴を頭に入れよう。
          </p>
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            ターゲット: {getStageName(stage)} / 誤爆: {mistakeName}
          </div>
          <button
            onClick={onRetry}
            className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]"
          >
            学び直して再挑戦
          </button>
        </div>
      </div>
    </section>
  );
};

const CompletionCard = ({ onRestart }) => (
  <section className="space-y-6 rounded-[32px] border border-emerald-300 bg-white p-8 text-center shadow-xl">
    <div className="text-sm font-semibold text-emerald-600">全ステージクリア！</div>
    <h2 className="text-3xl font-bold text-neutral-900">全15種のターゲットを撃退完了！</h2>
    <p className="text-sm text-neutral-600">
      特徴を覚えてターゲットが現れた瞬間にタップできるようになった。観察力と反応速度が磨かれたね。
    </p>
    <div className="mx-auto w-full max-w-md">
      <VictoryScene stage={{ id: "complete", level: 5 }} />
    </div>
    <button
      onClick={onRestart}
      className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]"
    >
      もう一度挑戦する
    </button>
  </section>
);

export default function App() {
  const [stageIndex, setStageIndex] = useState(0);
  const [phase, setPhase] = useState("learn");
  const [statusMessage, setStatusMessage] = useState("");
  const [isCleared, setIsCleared] = useState(false);
  const [currentRoach, setCurrentRoach] = useState(null);
  const [encounterCount, setEncounterCount] = useState(0);
  const [mistakeRoach, setMistakeRoach] = useState(null);

  const stage = STAGES[stageIndex];
  const clearedCount = stageIndex + (phase === "result" ? 1 : 0);
  const progress = Math.min(clearedCount / TOTAL_STAGES, 1);

  const clearCurrentRoach = () => {
    setCurrentRoach(null);
    setEncounterCount(0);
  };

  const createEncounter = (avoidId) => {
    const others = STAGES.filter((item) => item.id !== stage.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const sample = shuffled.slice(0, Math.min(3, shuffled.length));
    const candidates = [stage, ...sample];
    const filtered = avoidId ? candidates.filter((item) => item.id !== avoidId) : candidates;
    const pool = filtered.length > 0 ? filtered : candidates;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleStartHunt = () => {
    const next = createEncounter();
    setCurrentRoach(next);
    setEncounterCount(1);
    setStatusMessage("ターゲットが現れるまで目を凝らそう。違う種類はスルー！");
    setMistakeRoach(null);
    setPhase("hunt");
  };

  const handleSkip = () => {
    if (phase !== "hunt") return;
    const next = createEncounter(currentRoach?.id);
    setCurrentRoach(next);
    setEncounterCount((prev) => (prev === 0 ? 1 : prev + 1));
    setStatusMessage("別のゴキブリが現れた。焦らずターゲットを見極めよう。");
  };

  const handleRoachTap = () => {
    if (phase !== "hunt" || !currentRoach) return;
    if (currentRoach.id === stage.id) {
      setStatusMessage("");
      setPhase("result");
      setMistakeRoach(null);
      clearCurrentRoach();
    } else {
      setMistakeRoach(currentRoach);
      setStatusMessage("");
      setPhase("fail");
      clearCurrentRoach();
    }
  };

  const handleNext = () => {
    clearCurrentRoach();
    setStatusMessage("");
    if (stageIndex >= STAGES.length - 1) {
      setIsCleared(true);
      setPhase("result");
      return;
    }
    setStageIndex((prev) => prev + 1);
    setPhase("learn");
    setMistakeRoach(null);
  };

  const handleRetry = () => {
    setPhase("learn");
    setStatusMessage("");
    clearCurrentRoach();
    setMistakeRoach(null);
  };

  const handleRestart = () => {
    setStageIndex(0);
    setPhase("learn");
    setStatusMessage("");
    setIsCleared(false);
    clearCurrentRoach();
    setMistakeRoach(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-neutral-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <header className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Goki Explorer</p>
            <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">ゴキブリ撃退任務</h1>
            <p className="text-sm text-neutral-600">
              レベル1-1から5-3まで、合計15種のゴキブリを学び、ターゲットが現れた瞬間にタップして撃退しよう。
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white/80 p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <div className="flex flex-col justify-between text-xs text-neutral-500 sm:flex-row">
                <span>現在: レベル{stage.level}-{stage.subStage}</span>
                <span>進行度: {Math.round(progress * 100)}%</span>
                <span>残り: {TOTAL_STAGES - Math.min(clearedCount, TOTAL_STAGES)} 体</span>
              </div>
            </div>
          </div>
          <StageTimeline currentIndex={stageIndex} phase={phase} />
        </header>

        {isCleared ? (
          <CompletionCard onRestart={handleRestart} />
        ) : (
          <>
            {phase === "learn" && <LearningCard stage={stage} onStart={handleStartHunt} />}
            {phase === "hunt" && (
              <HuntCard
                stage={stage}
                currentRoach={currentRoach}
                onRoachTap={handleRoachTap}
                onSkip={handleSkip}
                message={statusMessage}
                encounterCount={encounterCount}
              />
            )}
            {phase === "fail" && <FailCard stage={stage} mistake={mistakeRoach} onRetry={handleRetry} />}
            {phase === "result" && (
              <ResultCard stage={stage} onNext={handleNext} isFinal={stageIndex === STAGES.length - 1} />
            )}
          </>
        )}

        <footer className="py-6 text-center text-[11px] text-neutral-500">
          © {new Date().getFullYear()} Goki Explorer — オフライン学習用コンテンツ
        </footer>
      </div>
    </div>
  );
}
