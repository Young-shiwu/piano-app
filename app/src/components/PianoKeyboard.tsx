// 虚拟钢琴键盘：白键横排 + 黑键叠加。active 集合里的键会高亮。
import { isBlackKey, midiToName } from '../lib/music';
import './PianoKeyboard.css';

interface Props {
  active: Set<number>;
  low?: number;   // 起始 midi（默认 C4=60）
  high?: number;  // 结束 midi（默认 B5=83）
  onPress?: (midi: number) => void;
}

export default function PianoKeyboard({ active, low = 60, high = 83, onPress }: Props) {
  const whites: number[] = [];
  for (let m = low; m <= high; m++) if (!isBlackKey(m)) whites.push(m);

  return (
    <div className="kbd">
      <div className="kbd-white-row">
        {whites.map((m) => {
          // 该白键左侧要不要挂黑键：看它前一个半音是不是黑键
          const prevBlack = m - 1 >= low && isBlackKey(m - 1) ? m - 1 : null;
          return (
            <div
              key={m}
              className={`kbd-white${active.has(m) ? ' on' : ''}`}
              onPointerDown={() => onPress?.(m)}
            >
              {prevBlack !== null && (
                <div
                  className={`kbd-black${active.has(prevBlack) ? ' on' : ''}`}
                  onPointerDown={(e) => { e.stopPropagation(); onPress?.(prevBlack); }}
                />
              )}
              <span className="kbd-label">{midiToName(m).startsWith('C') && !midiToName(m).includes('#') ? midiToName(m) : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
