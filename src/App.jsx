import { useEffect, useMemo, useRef, useState } from 'react';
import chabaneImage from './assets/chabane.png';
import chabaneInfernoImage from './assets/chabane2.png';
import yamatoImage from './assets/yamato.png';
import yamatoInfernoImage from './assets/yamato2.png';
import kuroImage from './assets/kuro.png';
import kuroInfernoImage from './assets/kuro2.png';
import wamonImage from './assets/wamon.png';
import wamonInfernoImage from './assets/wamon2.png';
import logoImage from '../logo.png';
import domeRewardImage from '../dome.png';
import decoyNuImage from './assets/decoy_nu.png';
import decoyShinchanImage from './assets/decoy_shinchan.png';
import decoySutabaImage from './assets/decoy_sutaba.png';
import decoyHeijiImage from './assets/decoy_heiji.png';
import superRoachImage from './assets/unko.png';

const MAX_LIVES = 3;
const DEFAULT_KILL_TARGET = 10;

const DIFFICULTIES = {
  yasashisa: {
    label: 'やさしさモード',
    description: '奴らが来る。',
    flavor: 'きゃわわなGを駆逐せよ。フォースと共に。',
    roachRatio: 0.65,
    spawnInterval: 1100,
    speedRange: [2500, 4400],
    spawnCountRange: [2, 3],
    killTarget: 10,
    decoys: ['badge', 'light', 'capsule', 'heiji'],
  },
  inferno: {
    label: '地獄モード',
    description: 'まさに地獄。可愛さ皆無。初速MAXの地上最強繁殖モンスター。',
    hint: '光り輝きし"モノ"が我々を導いてくれるかも知れない…',
    flavor: '怒りを力に変え、一匹残らず駆逐せよ。フォースと共に。',
    roachRatio: 0.6,
    spawnInterval: 900,
    speedRange: [2400, 4200],
    spawnCountRange: [2, 4],
    killTarget: 100,
    decoys: ['capsule', 'drone', 'spark', 'heiji'],
  },
};

const SUPER_ROACH = {
  type: 'super',
  label: 'す〜ぱ〜キラキラ☆うんこちゃん',
  killCount: 100,
  spawnChance: 1 / 30,
};

const STAGES = [
  {
    id: 'stage-1',
    order: 1,
    species: 'チャバネゴキブリ',
    intro:
      '小型の侵略者。ちっちゃGを見つけたら多分こいつ。',
    facts: [
      '体長は約13mm。薄茶色で室内の家具に溶け込む。',
      '湿った場所と甘い匂いを好む。パンくずは最大のごちそう。',
      '卵鞘を抱えて歩き回るため、見つけたら即座に駆逐するのが鉄則。',
    ],
    tip: '換気扇とシンクの隙間を徹底的に封鎖しよう。',
    stageType: 'flash',
    instructions: '一瞬だけ現れるターゲットを即座に見極め、Gだけをタップせよ。Gでは無いものに触れたらライフを失う。',
    roachImage: chabaneImage,
    roachImages: {
      yasashisa: chabaneImage,
      inferno: chabaneInfernoImage,
    },
    roachAlt: 'チャバゴキブリのターゲット',
  },
  {
    id: 'stage-2',
    order: 2,
    species: 'ヤマトゴキブリ',
    intro:
      '日本原産の黒褐色の兵。ズミー発狂レベル100',
    facts: [
      '体長は25〜35mm。オスは長い翅で滑空する。',
      '寒さにも比較的強く、玄関やベランダから侵入してくる。',
      '湿った落ち葉や排水口の周りが前線基地。',
    ],
    tip: '玄関マットと落ち葉を掃除して侵入経路を断とう。',
    stageType: 'shooter',
    instructions:
      '画面をタップしてレーザーを発射。複数で迫るGは撃墜していない限り進行し続ける。こちらの陣地に侵入される前に全て撃ち落とせ。',
    roachImage: yamatoImage,
    roachImages: {
      yasashisa: yamatoImage,
      inferno: yamatoInfernoImage,
    },
    roachAlt: 'ヤマトゴキブリのターゲット',
  },
  {
    id: 'stage-3',
    order: 3,
    species: 'クロゴキブリ',
    intro:
      '漆黒の悪魔。掃除機で吸って掃除機ごと捨てる羽目になる。',
    facts: [
      '体長は30〜40mm。厚みのある光沢ボディで存在感抜群。',
      '夜行性で、冷蔵庫裏や排水管の周辺に潜む。',
      '繁殖力が高く、1匹見たら巣が近いと疑え。',
    ],
    tip: '排水溝ネットと生ゴミ管理で補給路を断つ。',
    stageType: 'classic',
    instructions: '画面を横切るターゲットからGだけをタップで駆逐。誤射に注意。',
    roachImage: kuroImage,
    roachImages: {
      yasashisa: kuroImage,
      inferno: kuroInfernoImage,
    },
    roachAlt: 'クロゴキブリのターゲット',
  },
  {
    id: 'stage-4',
    order: 4,
    species: 'ワモンゴキブリ',
    intro:
      'G界の帝王。防御力0のズミーにはなす術なし。',
    facts: [
      '体長は35〜45mm。赤みのある茶色とリング模様が特徴。',
      '水回りから天井まで自在に移動し、飛翔力も高い。',
      '湿度80%以上を好む。空調を弱めると一気に勢力図を塗り替える。',
    ],
    tip: '換気と除湿で奴らの王国を崩壊させろ。',
    stageType: 'saber',
    instructions: '接近してくるGが斬撃範囲に入った瞬間にライトセーバーを振り下ろせ。タイミングが命だ。',
    roachImage: wamonImage,
    roachImages: {
      yasashisa: wamonImage,
      inferno: wamonInfernoImage,
    },
    roachAlt: 'ワモンゴキブリのターゲット',
  },
];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function getRoachProfile(difficulty) {
  if (difficulty === 'inferno' && Math.random() < SUPER_ROACH.spawnChance) {
    return { roachType: SUPER_ROACH.type, killCount: SUPER_ROACH.killCount };
  }

  return { roachType: 'standard', killCount: 1 };
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

function RoachGraphic({ difficulty }) {
  switch (difficulty) {
    case 'yasashisa':
      return (
        <div className="roach-graphic roach-normal">
          <span className="segment" />
          <span className="segment" />
          <span className="segment" />
          <span className="antenna left" />
          <span className="antenna right" />
        </div>
      );
    case 'inferno':
      return (
        <div className="roach-graphic roach-inferno">
          <span className="glow" />
          <span className="core" />
          <span className="antenna left" />
          <span className="antenna right" />
        </div>
      );
    default:
      return null;
  }
}

function getStageRoachImage(stage, difficulty) {
  if (!stage) {
    return null;
  }

  if (stage.roachImages) {
    if (difficulty && stage.roachImages[difficulty]) {
      return stage.roachImages[difficulty];
    }

    if (stage.roachImages.default) {
      return stage.roachImages.default;
    }
  }

  return stage.roachImage ?? null;
}

function getRoachOrientationClass(stage, direction) {
  const stageId = stage?.id;

  if (stageId === 'stage-2' || stageId === 'stage-4') {
    return 'roach-orientation-down';
  }

  if (stageId === 'stage-3') {
    if (direction === 'left') {
      return 'roach-orientation-right';
    }

    if (direction === 'right') {
      return 'roach-orientation-left';
    }
  }

  return null;
}

function StageRoach({ stage, difficulty, roachType = 'standard', direction }) {
  if (roachType === SUPER_ROACH.type) {
    return (
      <div
        className={[
          'roach-graphic',
          'roach-super',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <img
          src={superRoachImage}
          alt={`${SUPER_ROACH.label}のターゲット`}
          className="roach-image roach-super-image"
        />
      </div>
    );
  }

  const orientationClass = getRoachOrientationClass(stage, direction);

  const roachImage = getStageRoachImage(stage, difficulty);
  if (roachImage) {
    return (
      <div
        className={['roach-graphic', orientationClass]
          .filter(Boolean)
          .join(' ')}
      >
        <img
          src={roachImage}
          alt={stage?.roachAlt ?? `${stage?.species ?? 'G'}のターゲット`}
          className="roach-image"
        />
      </div>
    );
  }

  return <RoachGraphic difficulty={difficulty} />;
}

const DECOY_ASSETS = {
  badge: {
    src: decoyNuImage,
    alt: 'デコイ：ぬいぐるみのターゲット',
  },
  light: {
    src: decoyShinchanImage,
    alt: 'デコイ：しんちゃんのターゲット',
  },
  capsule: {
    src: decoySutabaImage,
    alt: 'デコイ：スタバアイテムのターゲット',
  },
  drone: {
    src: decoyNuImage,
    alt: 'デコイ：ぬいぐるみのターゲット',
  },
  spark: {
    src: decoyShinchanImage,
    alt: 'デコイ：しんちゃんのターゲット',
  },
  hero: {
    src: decoySutabaImage,
    alt: 'デコイ：スタバアイテムのターゲット',
  },
  heiji: {
    src: decoyHeijiImage,
    alt: 'デコイ：へいじのターゲット',
  },
  default: {
    src: decoyNuImage,
    alt: 'デコイターゲット',
  },
};

function DecoyGraphic({ variant }) {
  const decoyAsset = DECOY_ASSETS[variant] ?? DECOY_ASSETS.default;

  return (
    <div className="decoy">
      <img
        src={decoyAsset.src}
        alt={decoyAsset.alt}
        className="decoy-image"
      />
    </div>
  );
}

function ClassicFloatingObject({ stage, object, difficulty, onTap, reduceMotion }) {
  const objectStyle = {
    top: `${object.top}%`,
    animationDuration: `${object.duration}ms`,
  };

  const containerClassName = [
    'encounter-object',
    reduceMotion ? 'reduce-motion' : null,
    reduceMotion ? null : `from-${object.direction}`,
  ]
    .filter(Boolean)
    .join(' ');
  const targetClassName = reduceMotion ? 'touch-target reduce-motion' : 'touch-target';

  if (reduceMotion) {
    objectStyle.left = `${object.staticLeft}%`;
    objectStyle.animation = 'none';
    objectStyle.transform = 'translate(-50%, -50%)';
    objectStyle.opacity = 1;
  }

  return (
    <div
      className={containerClassName}
      style={objectStyle}
    >
      <button
        type="button"
        className={targetClassName}
        onClick={() => onTap(object)}
        style={{ transform: `scale(${object.scale})` }}
      >
        {object.isRoach ? (
          <StageRoach
            stage={stage}
            difficulty={difficulty}
            roachType={object.roachType}
            direction={object.direction}
          />
        ) : (
          <DecoyGraphic variant={object.variant} />
        )}
      </button>
    </div>
  );
}

function FlashStage({ stage, difficulty, difficultyConfig, roachRatio, onSuccess, onMistake, shouldReduceMotion }) {
  const [objects, setObjects] = useState([]);
  const timersRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setObjects([]);

    if (!difficultyConfig) {
      return () => {};
    }

    const baseAppearanceDuration = Math.max(
      Math.min(difficultyConfig.spawnInterval * 0.6, 900),
      420,
    );
    const spawn = () => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const isRoach = Math.random() < roachRatio;
      const variantPool = difficultyConfig.decoys ?? [];
      const variant = variantPool.length > 0 ? variantPool[randomBetween(0, variantPool.length - 1)] : 'badge';
      const top = randomBetween(18, 82);
      const left = randomBetween(18, 82);
      let appearanceDuration = baseAppearanceDuration;
      let scale = Math.random() * 0.4 + 0.8;

      const roachProfile = isRoach ? getRoachProfile(difficulty) : null;
      if (roachProfile?.roachType === SUPER_ROACH.type) {
        appearanceDuration = Math.min(Math.floor(appearanceDuration * 1.8), 2200);
        scale = Math.max(scale, 1.35);
      }
      const newObject = {
        id,
        isRoach,
        variant,
        top,
        left,
        scale,
        appearanceDuration,
        ...(roachProfile ?? {}),
      };
      setObjects((prev) => [...prev, newObject]);

      const timeout = setTimeout(() => {
        setObjects((prev) => prev.filter((item) => item.id !== id));
      }, appearanceDuration);
      timersRef.current.push(timeout);
    };

    spawn();
    intervalRef.current = setInterval(spawn, difficultyConfig.spawnInterval);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [difficultyConfig, roachRatio, difficulty]);

  const handleTap = (object) => {
    setObjects((prev) => prev.filter((item) => item.id !== object.id));
    if (object.isRoach) {
      onSuccess(object.killCount ?? 1, { roachType: object.roachType });
    } else {
      onMistake();
    }
  };

  if (!difficultyConfig) {
    return null;
  }

  return (
    <div className="stage-flash">
      {objects.length === 0 && (
        <div className="stage-placeholder">ズミーが敵影を探知中…</div>
      )}
      {objects.map((object) => {
        const className = [
          'flash-target',
          shouldReduceMotion ? 'reduce-motion' : null,
        ]
          .filter(Boolean)
          .join(' ');
        const style = {
          top: `${object.top}%`,
          left: `${object.left}%`,
          animationDuration: `${object.appearanceDuration}ms`,
          transform: `translate(-50%, -50%) scale(${object.scale})`,
        };
        if (shouldReduceMotion) {
          style.animation = 'none';
          style.opacity = 1;
        }

        return (
          <button
            key={object.id}
            type="button"
            className={className}
            style={style}
            onClick={() => handleTap(object)}
          >
            {object.isRoach ? (
              <StageRoach stage={stage} difficulty={difficulty} roachType={object.roachType} />
            ) : (
              <DecoyGraphic variant={object.variant} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ShooterStage({ stage, difficulty, difficultyConfig, onSuccess, onMistake, shouldReduceMotion }) {
  const [roaches, setRoaches] = useState([]);
  const [lasers, setLasers] = useState([]);
  const roachTimeoutsRef = useRef(new Map());
  const spawnIntervalRef = useRef(null);
  const containerRef = useRef(null);
  const roachElementsRef = useRef(new Map());
  const ignoreNextClickRef = useRef(false);
  const lastPointerDownTimeRef = useRef(0);

  const registerRoachElement = (roachId) => (node) => {
    if (node) {
      roachElementsRef.current.set(roachId, node);
    } else {
      roachElementsRef.current.delete(roachId);
    }
  };

  useEffect(() => {
    roachTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    roachTimeoutsRef.current.clear();
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    setRoaches([]);
    roachElementsRef.current.clear();

    if (!difficultyConfig) {
      return () => {};
    }

    let spawnInterval = difficultyConfig.spawnInterval ?? 1000;
    let [minSpawn, maxSpawn] = difficultyConfig.spawnCountRange ?? [1, 1];

    if (stage?.id === 'stage-2') {
      spawnInterval = Math.max(Math.floor(spawnInterval * 1.35), 300);
      minSpawn = Math.max(1, minSpawn - 1);
      maxSpawn = Math.max(minSpawn, maxSpawn - 1);
    }

    const spawn = () => {
      const spawnCount = randomBetween(minSpawn, maxSpawn);

      for (let index = 0; index < spawnCount; index += 1) {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}-${index}`;
        const x = randomBetween(12, 88);
        let duration = randomBetween(
          difficultyConfig.speedRange[0],
          difficultyConfig.speedRange[1],
        );
        const roachProfile = getRoachProfile(difficulty);
        if (roachProfile?.roachType === SUPER_ROACH.type) {
          duration = Math.floor(duration * 1.5);
        }
        const roach = { id, x, duration, ...roachProfile };
        setRoaches((prev) => [...prev, roach]);

        const timeout = setTimeout(() => {
          setRoaches((prev) => prev.filter((item) => item.id !== id));
          roachTimeoutsRef.current.delete(id);
          onMistake();
        }, duration);
        roachTimeoutsRef.current.set(id, timeout);
      }
    };

    spawn();
    spawnIntervalRef.current = setInterval(spawn, spawnInterval);

    return () => {
      roachTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      roachTimeoutsRef.current.clear();
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    };
  }, [difficultyConfig, onMistake, difficulty, stage]);

  const resolvePointerPosition = (event, fallbackRect = null) => {
    const nativeEvent = event?.nativeEvent ?? event;
    let pointerX = event?.clientX;
    let pointerY = event?.clientY;

    if ((typeof pointerX !== 'number' || Number.isNaN(pointerX)) && nativeEvent) {
      const touch = nativeEvent.changedTouches?.[0] ?? nativeEvent.touches?.[0];
      if (touch) {
        pointerX = touch.clientX;
      }
    }

    if ((typeof pointerY !== 'number' || Number.isNaN(pointerY)) && nativeEvent) {
      const touch = nativeEvent.changedTouches?.[0] ?? nativeEvent.touches?.[0];
      if (touch) {
        pointerY = touch.clientY;
      }
    }

    if (fallbackRect) {
      if (typeof pointerX !== 'number' || Number.isNaN(pointerX)) {
        pointerX = fallbackRect.left + fallbackRect.width / 2;
      }

      if (typeof pointerY !== 'number' || Number.isNaN(pointerY)) {
        pointerY = fallbackRect.top + fallbackRect.height / 2;
      }
    }

    return { pointerX, pointerY };
  };

  const selectTargetRoach = (forcedTargetId, pointerXPx, clampedXPercent) => {
    let targetedRoach = null;
    let bestHorizontalFit = Infinity;
    let bestDepthScore = -Infinity;

    if (forcedTargetId) {
      targetedRoach = roaches.find((roach) => roach.id === forcedTargetId) ?? null;
    }

    if (!targetedRoach) {
      roaches.forEach((roach) => {
        const element = roachElementsRef.current.get(roach.id);
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const tolerancePx = Math.max(rect.width * 0.6, 40);
        const horizontalDistancePx =
          typeof pointerXPx === 'number' ? Math.abs(centerX - pointerXPx) : Infinity;
        const isWithinColumn =
          typeof pointerXPx === 'number'
            ? horizontalDistancePx <= tolerancePx
            : Math.abs((roach.x ?? 0) - clampedXPercent) <= 12;

        if (!isWithinColumn) {
          return;
        }

        const effectiveDistance =
          typeof pointerXPx === 'number'
            ? horizontalDistancePx
            : Math.abs((roach.x ?? 0) - clampedXPercent);
        const depthScore = rect.bottom;

        if (
          !targetedRoach ||
          effectiveDistance < bestHorizontalFit - 0.5 ||
          (Math.abs(effectiveDistance - bestHorizontalFit) <= 0.5 && depthScore > bestDepthScore)
        ) {
          targetedRoach = roach;
          bestHorizontalFit = effectiveDistance;
          bestDepthScore = depthScore;
        }
      });

      if (!targetedRoach) {
        roaches.forEach((roach) => {
          const distance = Math.abs((roach.x ?? 0) - clampedXPercent);
          if (distance <= 12 && distance < bestHorizontalFit) {
            targetedRoach = roach;
            bestHorizontalFit = distance;
            bestDepthScore = -Infinity;
          }
        });
      }
    }

    return targetedRoach;
  };

  const fireLaser = ({ xPercent, clientX, clientY, forcedTargetId = null }) => {
    const clampedXPercent = Math.min(Math.max(typeof xPercent === 'number' ? xPercent : 0, 0), 100);
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const laser = { id, x: clampedXPercent };
    setLasers((prev) => [...prev, laser]);
    setTimeout(() => {
      setLasers((prev) => prev.filter((item) => item.id !== id));
    }, 500);

    const containerRect = containerRef.current?.getBoundingClientRect() ?? null;
    const pointerXPx =
      typeof clientX === 'number'
        ? clientX
        : containerRect
          ? containerRect.left + (clampedXPercent / 100) * containerRect.width
          : null;

    const targetedRoach = selectTargetRoach(forcedTargetId, pointerXPx, clampedXPercent);

    if (!targetedRoach) {
      return;
    }

    const timeoutId = roachTimeoutsRef.current.get(targetedRoach.id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      roachTimeoutsRef.current.delete(targetedRoach.id);
    }

    setRoaches((prev) => prev.filter((roach) => roach.id !== targetedRoach.id));

    const isSuperRoach = targetedRoach.roachType === SUPER_ROACH.type;
    const points =
      targetedRoach.killCount ?? (isSuperRoach ? SUPER_ROACH.killCount : 1);
    onSuccess(points, { roachType: targetedRoach.roachType });
  };

  const handleStageFire = (event) => {
    if (!difficultyConfig) {
      return;
    }

    if (event.type === 'pointerdown') {
      lastPointerDownTimeRef.current = Date.now();
      ignoreNextClickRef.current = true;
    } else if (event.type === 'click' && ignoreNextClickRef.current) {
      const elapsed = Date.now() - lastPointerDownTimeRef.current;
      ignoreNextClickRef.current = false;
      if (elapsed < 600) {
        return;
      }
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const { pointerX, pointerY } = resolvePointerPosition(event, rect);

    if (typeof pointerX !== 'number' || typeof pointerY !== 'number') {
      return;
    }

    const rawXPercent = ((pointerX - rect.left) / rect.width) * 100;
    const clampedXPercent = Math.min(Math.max(rawXPercent, 0), 100);

    fireLaser({ xPercent: clampedXPercent, clientX: pointerX, clientY: pointerY });
  };

  const handleStageKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const pointerX = rect.left + rect.width / 2;
    const pointerY = rect.top + rect.height;
    fireLaser({ xPercent: 50, clientX: pointerX, clientY: pointerY });
  };

  const handleRoachInput = (event, roach) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'pointerdown') {
      lastPointerDownTimeRef.current = Date.now();
      ignoreNextClickRef.current = true;
    } else if (event.type === 'click' && ignoreNextClickRef.current) {
      const elapsed = Date.now() - lastPointerDownTimeRef.current;
      ignoreNextClickRef.current = false;
      if (elapsed < 600) {
        return;
      }
    }

    const elementRect = event.currentTarget?.getBoundingClientRect?.() ?? null;
    const { pointerX, pointerY } = resolvePointerPosition(event, elementRect ?? undefined);

    fireLaser({
      xPercent: roach.x,
      clientX: pointerX,
      clientY: pointerY,
      forcedTargetId: roach.id,
    });
  };

  if (!difficultyConfig) {
    return null;
  }

  return (
    <div
      className="stage-shooter"
      onPointerDown={handleStageFire}
      onClick={handleStageFire}
      onKeyDown={handleStageKeyDown}
      role="button"
      aria-label="レーザー発射エリア"
      tabIndex={0}
      ref={containerRef}
    >
      <div className="shooter-sky" />
      {roaches.length === 0 && (
        <div className="stage-placeholder">ズミーが照準を合わせている…</div>
      )}
      {roaches.map((roach) => {
        const style = {
          left: `${roach.x}%`,
          animationDuration: `${roach.duration}ms`,
        };
        if (shouldReduceMotion) {
          style.animation = 'none';
          style.top = '30%';
        }
        const className = [
          'shooter-roach',
          shouldReduceMotion ? 'reduce-motion' : null,
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <div
            key={roach.id}
            className={className}
            style={style}
            ref={registerRoachElement(roach.id)}
            onPointerDown={(event) => handleRoachInput(event, roach)}
            onClick={(event) => handleRoachInput(event, roach)}
          >
            <StageRoach stage={stage} difficulty={difficulty} roachType={roach.roachType} />
          </div>
        );
      })}
      {lasers.map((laser) => (
        <div key={laser.id} className="laser-beam" style={{ left: `${laser.x}%` }} />
      ))}
      <div className="shooter-ship" />
    </div>
  );
}

function ClassicStage({ stage, difficulty, difficultyConfig, roachRatio, onSuccess, onMistake, shouldReduceMotion }) {
  const [objects, setObjects] = useState([]);
  const timersRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setObjects([]);

    if (!difficultyConfig) {
      return () => {};
    }

    const spawn = () => {
      const [minSpawn, maxSpawn] = difficultyConfig.spawnCountRange ?? [1, 1];
      const spawnCount = randomBetween(minSpawn, maxSpawn);
      const variantPool = difficultyConfig.decoys ?? [];

      for (let index = 0; index < spawnCount; index += 1) {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}-${index}`;
        const isRoach = Math.random() < roachRatio;
        let duration = randomBetween(
          difficultyConfig.speedRange[0],
          difficultyConfig.speedRange[1],
        );
        const top = randomBetween(8, 80);
        let scale = Math.random() * 0.4 + 0.8;
        const variant = variantPool.length > 0 ? variantPool[randomBetween(0, variantPool.length - 1)] : 'badge';
        const staticLeft = randomBetween(12, 88);
        const direction = Math.random() < 0.5 ? 'left' : 'right';
        const roachProfile = isRoach ? getRoachProfile(difficulty) : null;
        if (roachProfile?.roachType === SUPER_ROACH.type) {
          duration = Math.floor(duration * 1.6);
          scale = Math.max(scale, 1.35);
        }
        const newObject = {
          id,
          isRoach,
          duration,
          top,
          scale,
          variant,
          staticLeft,
          direction,
          ...(roachProfile ?? {}),
        };
        setObjects((prev) => [...prev, newObject]);
        const timeout = setTimeout(() => {
          setObjects((prev) => prev.filter((item) => item.id !== id));
        }, duration);
        timersRef.current.push(timeout);
      }
    };

    spawn();
    intervalRef.current = setInterval(spawn, difficultyConfig.spawnInterval);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [difficultyConfig, roachRatio, difficulty]);

  const handleObjectTap = (object) => {
    setObjects((prev) => prev.filter((item) => item.id !== object.id));
    if (object.isRoach) {
      onSuccess(object.killCount ?? 1, { roachType: object.roachType });
    } else {
      onMistake();
    }
  };

  if (!difficultyConfig) {
    return null;
  }

  return (
    <>
      {objects.map((object) => (
        <ClassicFloatingObject
          key={object.id}
          stage={stage}
          object={object}
          difficulty={difficulty}
          onTap={handleObjectTap}
          reduceMotion={shouldReduceMotion}
        />
      ))}
      {objects.length === 0 && <div className="stage-placeholder">ズミーが敵の気配を探知中…</div>}
    </>
  );
}

function SaberStage({ stage, difficulty, difficultyConfig, onSuccess, onMistake, shouldReduceMotion }) {
  const [enemies, setEnemies] = useState([]);
  const [slashes, setSlashes] = useState([]);
  const timeoutsRef = useRef(new Map());
  const intervalRef = useRef(null);

  useEffect(() => {
    timeoutsRef.current.forEach((timeouts) => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    });
    timeoutsRef.current.clear();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setEnemies([]);

    if (!difficultyConfig) {
      return () => {};
    }

    const spawn = () => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const x = randomBetween(32, 68);
      let duration = randomBetween(
        Math.max(difficultyConfig.speedRange[0], 1600),
        Math.max(difficultyConfig.speedRange[1], 2200),
      );
      const roachProfile = getRoachProfile(difficulty);
      if (roachProfile?.roachType === SUPER_ROACH.type) {
        duration = Math.floor(duration * 1.35);
      }
      const strikeStart = duration * 0.55;
      const strikeEnd = duration * 0.72;
      const enemy = {
        id,
        x,
        duration,
        status: 'approach',
        strikeStart,
        strikeEnd,
        ...roachProfile,
      };
      setEnemies((prev) => [...prev, enemy]);

      const readyTimeout = setTimeout(() => {
        setEnemies((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'strike' } : item)),
        );
      }, strikeStart);
      const failTimeout = setTimeout(() => {
        setEnemies((prev) => prev.filter((item) => item.id !== id));
        timeoutsRef.current.delete(id);
        onMistake();
      }, strikeEnd);
      const cleanupTimeout = setTimeout(() => {
        setEnemies((prev) => prev.filter((item) => item.id !== id));
        timeoutsRef.current.delete(id);
      }, duration);

      timeoutsRef.current.set(id, [readyTimeout, failTimeout, cleanupTimeout]);
    };

    spawn();
    intervalRef.current = setInterval(spawn, Math.max(difficultyConfig.spawnInterval, 900));

    return () => {
      timeoutsRef.current.forEach((timeouts) => {
        timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      });
      timeoutsRef.current.clear();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [difficultyConfig, onMistake, difficulty]);

  const registerSlash = () => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setSlashes((prev) => [...prev, id]);
    setTimeout(() => {
      setSlashes((prev) => prev.filter((slashId) => slashId !== id));
    }, 350);
  };

  const handleStrike = () => {
    registerSlash();
    setEnemies((prev) => {
      const readyEnemy = prev.find((enemy) => enemy.status === 'strike');
      if (!readyEnemy) {
        onMistake();
        return prev;
      }

      const timeouts = timeoutsRef.current.get(readyEnemy.id);
      if (timeouts) {
        timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutsRef.current.delete(readyEnemy.id);
      }

      onSuccess(readyEnemy.killCount ?? 1, { roachType: readyEnemy.roachType });
      return prev.filter((enemy) => enemy.id !== readyEnemy.id);
    });
  };

  if (!difficultyConfig) {
    return null;
  }

  return (
    <div className="stage-saber" onClick={handleStrike} role="presentation">
      {enemies.length === 0 && <div className="stage-placeholder">気配を研ぎ澄ませ…</div>}
      {enemies.map((enemy) => {
        const className = [
          'saber-enemy',
          enemy.status === 'strike' ? 'strike-ready' : null,
          shouldReduceMotion ? 'reduce-motion' : null,
        ]
          .filter(Boolean)
          .join(' ');
        const style = {
          left: `${enemy.x}%`,
          animationDuration: `${enemy.duration}ms`,
        };
        if (shouldReduceMotion) {
          style.animation = 'none';
          style.transform = 'translate(-50%, -50%) scale(1)';
        }
        return (
          <div key={enemy.id} className={className} style={style}>
            <StageRoach stage={stage} difficulty={difficulty} roachType={enemy.roachType} />
          </div>
        );
      })}
      {slashes.map((id) => (
        <div key={id} className="saber-slash" />
      ))}
      <div className="saber-hilt" />
    </div>
  );
}

function StagePlayArea({
  stage,
  difficulty,
  difficultyConfig,
  roachRatio,
  onSuccess,
  onMistake,
  shouldReduceMotion,
}) {
  if (!difficultyConfig) {
    return <div className="stage-placeholder">難易度設定を読み込み中…</div>;
  }

  switch (stage.stageType) {
    case 'flash':
      return (
        <FlashStage
          stage={stage}
          difficulty={difficulty}
          difficultyConfig={difficultyConfig}
          roachRatio={roachRatio}
          onSuccess={onSuccess}
          onMistake={onMistake}
          shouldReduceMotion={shouldReduceMotion}
        />
      );
    case 'shooter':
      return (
        <ShooterStage
          stage={stage}
          difficulty={difficulty}
          difficultyConfig={difficultyConfig}
          onSuccess={onSuccess}
          onMistake={onMistake}
          shouldReduceMotion={shouldReduceMotion}
        />
      );
    case 'classic':
      return (
        <ClassicStage
          stage={stage}
          difficulty={difficulty}
          difficultyConfig={difficultyConfig}
          roachRatio={roachRatio}
          onSuccess={onSuccess}
          onMistake={onMistake}
          shouldReduceMotion={shouldReduceMotion}
        />
      );
    case 'saber':
      return (
        <SaberStage
          stage={stage}
          difficulty={difficulty}
          difficultyConfig={difficultyConfig}
          onSuccess={onSuccess}
          onMistake={onMistake}
          shouldReduceMotion={shouldReduceMotion}
        />
      );
    default:
      return <div className="stage-placeholder">未定義のステージです。</div>;
  }
}

function StageIntro({ stage, killTarget, onStart, difficulty }) {
  const roachImage = getStageRoachImage(stage, difficulty);
  const showMosaic = difficulty === 'inferno';
  const roachAlt = stage.roachAlt ?? `${stage.species}のターゲット`;

  return (
    <section className="rounded-3xl bg-white/5 px-5 py-6 text-white shadow-lg shadow-black/30 backdrop-blur">
      <p className="text-sm font-semibold text-emerald-200">ステージ{stage.order}</p>
      <h2 className="mt-1 flex items-center gap-3 text-2xl font-black text-white">
        {roachImage ? (
          <img
            src={roachImage}
            alt={roachAlt}
            className={[
              'h-12 w-12 rounded-full bg-white/10 object-contain p-1',
              showMosaic ? 'roach-image-mosaic' : null,
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ) : null}
        <span>{stage.species}</span>
        <span className="ml-2 text-sm font-medium text-emerald-200"></span>
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-emerald-100/90">{stage.intro}</p>
      <ul className="mt-4 space-y-2 text-xs leading-relaxed text-emerald-100/80">
        {stage.facts.map((fact) => (
          <li key={fact} className="flex items-start gap-2">
            <span className="mt-[3px] block h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span>{fact}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
          <span className="font-semibold text-emerald-200">ズミー指令:</span> {stage.tip}
        </div>
        <div className="rounded-2xl border border-emerald-200/40 bg-slate-900/60 px-4 py-3 text-xs text-emerald-100/80">
          この作戦の撃破目標は <span className="font-semibold text-emerald-200">{killTarget}体</span>。
          誤射を避けつつ目標数を倒せ。
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-900/40 transition hover:brightness-105"
      >
        【駆逐する】
      </button>
    </section>
  );
}

const SUPER_ROACH_STAGE_MESSAGES = {
  1: '【す〜ぱ〜キラキラ☆うんこちゃん】を見つけたよ！ステージクリアだよ！',
  2: '【す〜ぱ〜キラキラ☆うんこちゃん】を見つけたよ！ステージクリアだよ！そういう仕様だよ！',
  3: '【す〜ぱ〜キラキラ☆うんこちゃん】を見つけたよ！ステージクリアだよ！そういう仕様だよ！疑問を持ってはいけないよ！',
  4: 'うんこにばっかり頼ってないで実力で勝負しろよな。',
};

function StageClear({
  stage,
  isLastStage,
  killTarget,
  onNext,
  onFinal,
  onBackToMenu,
  showSuperRoachMessage = false,
  difficulty,
  canViewInfernoReward = false,
  onViewInfernoReward,
}) {
  return (
    <section className="rounded-3xl bg-white/5 px-5 py-6 text-white shadow-lg shadow-emerald-900/40 backdrop-blur">
      <p className="text-sm font-semibold text-emerald-200">ズミー勝利</p>
      <h2 className="mt-1 text-2xl font-black text-white">
        {stage.species}を完全駆逐！
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-emerald-100/90">
        ズミーはターゲットを{killTarget}匹撃破し、{stage.codename} G軍の制圧に成功した。
      </p>
      {difficulty === 'inferno' && (
        <p className="mt-4 rounded-2xl border border-emerald-300/60 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed text-emerald-50">
          地獄モード制覇の証が解禁された！「豪華景品を見る」ボタンから確認せよ。
        </p>
      )}
      {showSuperRoachMessage && SUPER_ROACH_STAGE_MESSAGES[stage.order] && (
        <p className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-50">
          {SUPER_ROACH_STAGE_MESSAGES[stage.order]}
        </p>
      )}
      {isLastStage ? (
        <>
          <p className="mt-4 text-xs text-emerald-100/80">
            銀河は一時の平和を取り戻した。しかしズミーの戦いは終わらない——
          </p>
          <div className="mt-6 grid gap-3">
            {canViewInfernoReward && (
              <button
                type="button"
                onClick={onViewInfernoReward}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-300 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-900/40 transition hover:brightness-105"
              >
                豪華景品を見る
              </button>
            )}
            <button
              type="button"
              onClick={onFinal}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-900/40 transition hover:brightness-105"
            >
              最終報告を見る
            </button>
            <button
              type="button"
              onClick={onBackToMenu}
              className="justify-self-end rounded-xl border border-emerald-300/60 bg-transparent px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
            >
              難易度選択に戻る
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-900/40 transition hover:brightness-105"
          >
            次のステージへ
          </button>
          <button
            type="button"
            onClick={onBackToMenu}
            className="justify-self-end rounded-xl border border-emerald-300/60 bg-transparent px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
          >
            難易度選択に戻る
          </button>
        </div>
      )}
    </section>
  );
}

function DefeatCard({ stage, onRetry, onBackToMenu }) {
  return (
    <section className="rounded-3xl bg-white/4 px-5 py-6 text-white shadow-lg shadow-black/40 backdrop-blur">
      <p className="text-sm font-semibold text-rose-300">ズミー敗北</p>
      <h2 className="mt-1 text-2xl font-black text-white">{stage.species}に押し切られた…</h2>
      <p className="mt-4 text-sm leading-relaxed text-rose-100/80">
        ゴキブリ如きに負け続ける人生でいいのか、ズミー。己を奮い立たせろ。
      </p>
      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-rose-900/50 transition hover:brightness-105"
        >
          同じステージに再挑戦
        </button>
        <button
          type="button"
          onClick={onBackToMenu}
          className="justify-self-end rounded-xl border border-rose-200/60 bg-transparent px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-200/10"
        >
          難易度選択に戻る
        </button>
      </div>
    </section>
  );
}

function InfernoReward({ onViewFinal, onRestart }) {
  return (
    <section className="rounded-3xl bg-white/5 px-5 py-6 text-white shadow-lg shadow-emerald-900/50 backdrop-blur">
      <p className="text-sm font-semibold text-emerald-200">豪華景品</p>
      <h2 className="mt-1 text-3xl font-black text-white">👏Congratulations🎉</h2>
      <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-emerald-200/40 bg-slate-900/60 p-6 text-center">
        <img
          src={domeRewardImage}
          alt="どめ3歳からのスペシャルご褒美"
          className="w-full max-w-xs rounded-2xl border border-emerald-200/40 shadow-lg shadow-emerald-900/40"
        />
        <p className="text-lg font-semibold text-emerald-50">(どめ5歳)</p>
      </div>
      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={onViewFinal}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-900/40 transition hover:brightness-105"
        >
          最終報告を見る
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="justify-self-end rounded-xl border border-emerald-300/60 bg-transparent px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
        >
          難易度選択に戻る
        </button>
      </div>
    </section>
  );
}

function FinalReport({ difficulty, onRestart }) {
  const config = DIFFICULTIES[difficulty];
  return (
    <section className="rounded-3xl bg-white/5 px-5 py-6 text-white shadow-lg shadow-emerald-900/50 backdrop-blur">
      <p className="text-sm font-semibold text-emerald-200">GOKI WARS 完了報告</p>
      <h2 className="mt-1 text-3xl font-black text-white">ズミーの勝利！</h2>
      <p className="mt-4 text-sm leading-relaxed text-emerald-100/90">
        地獄のG軍を駆逐した！銀河と県立大学に平和が戻った。
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 px-6 py-3 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-900/40 transition hover:brightness-105"
      >
        タイトルへ戻る
      </button>
    </section>
  );
}

function DifficultySelect({ onSelect }) {
  return (
    <section className="rounded-3xl bg-white/5 px-5 py-6 text-white shadow-lg shadow-emerald-900/40 backdrop-blur">
      <p className="text-sm font-semibold text-emerald-200">作戦難易度を選択</p>
      <p className="mt-4 text-sm leading-relaxed text-emerald-100/90">
        Gを駆逐せよ。難易度ごとに設定された撃破数を達成すればステージクリア。
        誤射はライフを奪い、3回ミスすると作戦は失敗となる。
      </p>
      <div className="mt-6 grid gap-4">
        {Object.entries(DIFFICULTIES).map(([key, config]) => (
          <button
            type="button"
            key={key}
            onClick={() => onSelect(key)}
            className="rounded-2xl border border-emerald-200/40 bg-emerald-500/10 px-4 py-4 text-left transition hover:bg-emerald-300/10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{config.label}</p>
            <p className="mt-1 text-lg font-bold text-white">{config.title}</p>
            <p className="mt-2 text-xs text-emerald-100/80">{config.description}</p>
            {config.hint ? (
              <p className="mt-1 text-[10px] text-emerald-200/70">{config.hint}</p>
            ) : null}
            <p className="mt-3 text-[11px] text-emerald-100/60">{config.flavor}</p>
            <p className="mt-3 text-[11px] text-emerald-100/70">
              撃破目標: {config.killTarget}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [phase, setPhase] = useState('difficulty');
  const [stageIndex, setStageIndex] = useState(0);
  const [killCount, setKillCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [motionOverride, setMotionOverride] = useState(null);
  const [defeatedSuperRoachThisStage, setDefeatedSuperRoachThisStage] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  const stage = useMemo(() => STAGES[stageIndex], [stageIndex]);
  const isLastStage = stageIndex === STAGES.length - 1;
  const difficultyConfig = difficulty ? DIFFICULTIES[difficulty] : null;
  const killTarget = difficultyConfig?.killTarget ?? DEFAULT_KILL_TARGET;
  const stageAdjustedRoachRatio = useMemo(() => {
    if (!difficultyConfig) {
      return 0;
    }
    const penaltyPerStage = 0.1;
    const minimumRatio = 0.2;
    const adjusted = difficultyConfig.roachRatio - stageIndex * penaltyPerStage;
    return Math.max(adjusted, minimumRatio);
  }, [difficultyConfig, stageIndex]);
  const shouldReduceMotion = motionOverride ?? prefersReducedMotion;
  const isMotionManuallyEnabled = motionOverride === false;
  const appClassName = `min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white${
    isMotionManuallyEnabled ? ' motion-override-animated' : ''
  }`;

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const { body } = document;

    if (isMotionManuallyEnabled) {
      body.classList.add('motion-override-animated');
    } else {
      body.classList.remove('motion-override-animated');
    }

    return () => {
      body.classList.remove('motion-override-animated');
    };
  }, [isMotionManuallyEnabled]);

  const handleSelectDifficulty = (key) => {
    setDifficulty(key);
    setPhase('intro');
    setStageIndex(0);
    setKillCount(0);
    setLives(MAX_LIVES);
    setDefeatedSuperRoachThisStage(false);
  };

  const handleStartStage = () => {
    setKillCount(0);
    setLives(MAX_LIVES);
    setDefeatedSuperRoachThisStage(false);
    setPhase('play');
  };

  const handleSuccessfulHit = (count = 1, options = {}) => {
    const { roachType } = options ?? {};
    if (roachType === SUPER_ROACH.type) {
      setDefeatedSuperRoachThisStage(true);
    }
    setKillCount((prev) => {
      const next = prev + count;
      if (next >= killTarget) {
        setPhase('stageClear');
      }
      return next;
    });
  };

  const handleMistake = () => {
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setPhase('defeat');
      }
      return Math.max(next, 0);
    });
  };

  const handleNextStage = () => {
    if (isLastStage) {
      return;
    }
    setStageIndex((prev) => prev + 1);
    setKillCount(0);
    setLives(MAX_LIVES);
    setDefeatedSuperRoachThisStage(false);
    setPhase('intro');
  };

  const handleRetryStage = () => {
    setKillCount(0);
    setLives(MAX_LIVES);
    setDefeatedSuperRoachThisStage(false);
    setPhase('intro');
  };

  const handleBackToMenu = () => {
    setDifficulty(null);
    setStageIndex(0);
    setKillCount(0);
    setLives(MAX_LIVES);
    setDefeatedSuperRoachThisStage(false);
    setPhase('difficulty');
  };

  const handleGoToFinalReport = () => {
    setPhase('complete');
  };

  const handleViewInfernoReward = () => {
    if (difficulty === 'inferno') {
      setPhase('reward');
    }
  };

  const handleCloseInfernoReward = () => {
    setPhase('complete');
  };

  const livesDisplay = useMemo(() => {
    return Array.from({ length: MAX_LIVES }, (_, index) => index < lives);
  }, [lives]);

  return (
    <div className={appClassName}>
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
        <header className="space-y-3 text-center">
          <img
            src={logoImage}
            alt="GokiCare ロゴ"
            className="hero-logo mx-auto h-50 w-auto"
          />
          <p className="text-xs text-emerald-100/80">
            この世に蔓延るGを一匹残らず駆逐するため、ジェダイの騎士ズミーが立ち上がる。フォースの力で銀河を守れ！
          </p>
        </header>

        {phase === 'difficulty' && <DifficultySelect onSelect={handleSelectDifficulty} />}

        {phase !== 'difficulty' && difficultyConfig && (
          <section className="rounded-3xl border border-emerald-200/20 bg-white/5 px-5 py-4 text-xs text-emerald-100/80 shadow-inner shadow-black/30 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300">Difficulty</p>
                <p className="text-sm font-semibold text-white">{difficultyConfig.title}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300">Stage</p>
                <p className="text-sm font-semibold text-white">
                  {stage.order} / {STAGES.length} — {stage.species}
                </p>
              </div>
              {phase === 'play' && (
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300">残り撃破数</p>
                  <p className="text-sm font-semibold text-white">
                    {Math.max(killTarget - killCount, 0)} 体
                  </p>
                </div>
              )}
            </div>
            {prefersReducedMotion && !isMotionManuallyEnabled && (
              <div className="mt-4 rounded-2xl border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-[11px] text-emerald-100/80">
           
                <button
                  type="button"
                  onClick={() => setMotionOverride(false)}
                  className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 px-3 py-2 text-[11px] font-semibold text-slate-900 shadow shadow-emerald-900/30 transition hover:brightness-105"
                >
                  アニメーションを有効にする
                </button>
              </div>
            )}
            {isMotionManuallyEnabled && (
              <div className="mt-4 rounded-2xl border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-[11px] text-emerald-100/80">
                <p className="font-semibold text-emerald-200">アニメーションを手動で有効化中</p>
                <p className="mt-1 leading-relaxed">
                  簡略表示に戻す場合は下のボタン
                </p>
                <button
                  type="button"
                  onClick={() => setMotionOverride(null)}
                  className="mt-3 w-full rounded-xl border border-emerald-300/50 px-3 py-2 text-[11px] font-semibold text-emerald-100 transition hover:bg-emerald-300/10"
                >
                  端末設定に合わせる
                </button>
              </div>
            )}
          </section>
        )}

        {phase === 'intro' && (
          <StageIntro
            stage={stage}
            killTarget={killTarget}
            onStart={handleStartStage}
            difficulty={difficulty}
          />
        )}

        {phase === 'play' && (
          <section className="flex flex-col gap-4">
            <div className="rounded-3xl border border-emerald-200/30 bg-emerald-500/10 px-5 py-4 text-xs text-emerald-100/80 shadow-inner shadow-black/30 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-200">撃破数 {killCount} / {killTarget}</span>
                <div className="flex items-center gap-1 text-lg">
                  {livesDisplay.map((alive, index) => (
                    <span key={index} className={alive ? 'text-rose-300' : 'text-slate-600'}>
                      {alive ? '❤' : '✖'}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-emerald-100/70">{stage.instructions}</p>
              {difficulty === 'inferno' && (
                <p className="mt-3 rounded-2xl border border-emerald-300/50 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold leading-relaxed text-emerald-50">
                  地獄モードをクリアしたら豪華景品がもらえるかも！？
                </p>
              )}
            </div>

            <div className="relative h-[320px] w-full overflow-hidden rounded-[32px] border border-emerald-200/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-inner shadow-black/60">
              <div className="absolute inset-x-0 top-3 flex justify-center text-[11px] font-semibold uppercase tracking-[0.4em] text-emerald-200/70">
                TARGET: {stage.species}
              </div>
              <StagePlayArea
                key={`${stage.id}-${difficulty}`}
                stage={stage}
                difficulty={difficulty}
                difficultyConfig={difficultyConfig}
                roachRatio={stageAdjustedRoachRatio}
                onSuccess={handleSuccessfulHit}
                onMistake={handleMistake}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          </section>
        )}

        {phase === 'stageClear' && (
          <StageClear
            stage={stage}
            isLastStage={isLastStage}
            killTarget={killTarget}
            onNext={handleNextStage}
            onFinal={handleGoToFinalReport}
            onBackToMenu={handleBackToMenu}
            showSuperRoachMessage={defeatedSuperRoachThisStage}
            difficulty={difficulty}
            canViewInfernoReward={difficulty === 'inferno' && isLastStage}
            onViewInfernoReward={handleViewInfernoReward}
          />
        )}

        {phase === 'defeat' && <DefeatCard stage={stage} onRetry={handleRetryStage} onBackToMenu={handleBackToMenu} />}

        {phase === 'reward' && difficulty === 'inferno' && (
          <InfernoReward onViewFinal={handleCloseInfernoReward} onRestart={handleBackToMenu} />
        )}

        {phase === 'complete' && difficulty && <FinalReport difficulty={difficulty} onRestart={handleBackToMenu} />}

        <footer className="pb-6 pt-2 text-center text-[11px] text-emerald-100/50">
          © 2025 ZUMI WARS / G Strikes Back
        </footer>
      </div>
    </div>
  );
}

