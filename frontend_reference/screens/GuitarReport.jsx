// GuitarReport.jsx — Hobby "report" page (reference screen)
//
// Adapted from https://github.com/ZJJJJY/Huickathon_S3_29
//   - Source page:   src/app/report/[hobby]/page.tsx
//   - Source data:   src/data/reports/guitar.json
//   - Renderers:     src/components/report/*.tsx (MarkdownBlock,
//                    BudgetTiers, Timeline, Cards, QA, Citations,
//                    VideoRefCard, SectionRenderer)
//
// The original is a Next.js + Tailwind page that fetches /api/report.
// Here it is inlined as a single static screen so it slots into the
// MIRAGE prototype shell (PhoneFrame + `.screen` + CSS-var tokens).

// ─── Data (verbatim from data/reports/guitar.json) ──────────
const GUITAR_REPORT = {
  hobby_id: 'guitar',
  hobby_name: '吉他',
  category: 'skill_growth',
  category_label: '技能成长',
  neon_color: '#3EE8FF',
  sections: [
    {
      id: 'intro',
      title: '是什么',
      content: {
        type: 'markdown',
        text: `## 🎸 吉他——门槛最低、回报最高的乐器之一

吉他是一种弦乐器，分为**民谣吉他**（木吉他，适合弹唱流行歌）、**古典吉他**（尼龙弦，偏古典指弹）和**电吉他**（需音箱，适合摇滚/蓝调）。新手入坑绝大多数选**民谣吉他**，上手快、曲库大、自带伴奏属性。

学了吉他能做什么？
- 🎵 **自弹自唱**：配上一首《漠河舞厅》或《晴天》，随时随地都是舞台
- 🎶 **指弹演奏**：不唱歌也能用吉他演奏完整旋律，一个人就是一支乐队
- 🎤 **聚会神器**：篝火晚会、宿舍夜话，人手一把吉他的人永远是焦点
- 📱 **创作分享**：写一段简单的和弦进行，就能在小红书收获第一批粉丝

和钢琴相比，吉他**无需固定场地**，背着走哪弹哪；和尤克里里相比，吉他**曲库更广、表现力更强**，同样的学习时间能换来更高的「天花板」。

更重要的是——**三个月就能自娱自乐**，半年就能弹唱几十首歌。还在犹豫什么，拿起来就是了！`,
      },
      citations: ['xhs_68b3b611000000001d0087ab', 'xhs_68c3d86e000000001c012746', 'xhs_6663f80f000000000c019078'],
      video_refs: ['douyin_7500585749051854089'],
    },
    {
      id: 'budget',
      title: '要花多少钱',
      content: {
        type: 'budget_tiers',
        tiers: [
          {
            name: '入门',
            price_range: '¥500-1000',
            items: [
              '民谣吉他：费森CLR300面单（¥698）/ 萨伽SF700面单（¥998）/ 雅马哈F310合板（¥949）',
              '调音器或调音App（免费）',
              '拨片若干（¥5-10）',
              '教材《吉他自学三月通》（约¥30）',
            ],
            note: '够弹流行歌主歌+副歌，面单音色比合板明显好一档，同价位优先选面单',
          },
          {
            name: '进阶',
            price_range: '¥1000-2500',
            items: [
              '民谣吉他：多斐恩C510（¥900+）/ 泰玛TS5（¥1500左右）',
              '变调夹（¥20-50，降低按弦难度）',
              '节拍器App或实体节拍器（¥0-80）',
              '悦器社App（免费/订阅，6000+曲谱+教学）',
            ],
            note: '弦距低、手感好，适合练习时间更长、想进阶弹唱或指弹的玩家',
          },
          {
            name: '高阶',
            price_range: '¥2500+',
            items: [
              '全单吉他：楚门海豚物语（¥2500+，弦距低适合新手）',
              '系统视频课程（B站付费课 / 线下老师 ¥100-300/节）',
              '拾音器或效果器（如有录音/演出需求）',
            ],
            note: '全单木材音色更通透，适合认真长期练习、有演出或录音需求的玩家',
          },
        ],
      },
      citations: ['xhs_6760077a0000000014027673', 'xhs_68c3d86e000000001c012746', 'xhs_6959fde300000000210321bb'],
      video_refs: ['douyin_7593791124486229274'],
    },
    {
      id: 'learning_curve',
      title: '学习路径',
      content: {
        type: 'timeline',
        entries: [
          { label: '1 周', title: '摸清吉他基本结构，手指开始适应',
            detail: '认识6根弦名称（EADGBE）、学会用App调音、掌握正确持琴姿势；能按出 C、G、Am、Em 4个基本和弦（每个和弦能按实，不出现闷音）；每天爬格子10分钟，感受指尖从疼到适应的过程' },
          { label: '1 个月', title: '能流畅切换4个常用和弦，弹出第一首歌',
            detail: 'C/G/Am/Em/F/D 和弦转换基本顺滑（每分钟转换次数≥40次）；能配合节拍器（60bpm）完整弹完一首简单4/4拍流行歌（如《童话》副歌）；右手扫弦基本节奏（下扫为主）不断弦' },
          { label: '3 个月', title: '自娱自乐水平，能弹唱10首以上歌曲',
            detail: '掌握靠弦法与勾弦法；能用节拍器跟练稳定在80bpm以上；会使用变调夹灵活切换调性；曲库达到10首以上流行歌，可完整弹唱；手指灵活度和音感均有明显提升' },
          { label: '半年', title: '进入中级阶段，弹唱几十首歌，尝试指弹',
            detail: '弹唱曲库达到30-50首；能初步演奏简单指弹曲目（如卡农简化版）；了解基础乐理（C大调音阶、常见和弦级数）；可尝试根据喜好的歌曲自行查谱练习，具备一定自学能力' },
        ],
      },
      citations: ['xhs_68b3b611000000001d0087ab', 'xhs_68c3d86e000000001c012746', 'xhs_6959fde300000000210321bb', 'xhs_68249cb8000000002300c786'],
      video_refs: ['douyin_7563758100056280335'],
    },
    {
      id: 'resources',
      title: '学习资源推荐',
      content: {
        type: 'cards',
        cards: [
          { title: '果木音乐教室（B站UP主）',
            description: '代表作《吉他入门标准教程》播放量超千万，结构化分阶段教学，对右手拨弦角度、按弦力度等基础动作讲解极为细致，适合想打好基础的零基础新手',
            meta: 'B站 · 免费 · 零基础/入门阶段 · 粉丝25万+' },
          { title: '吉他大学霸（B站UP主）',
            description: '偏流行弹唱方向，热门歌曲教程更新快，很多当前流行歌曲都能找到完整教学，适合想快速学会弹唱热门歌的学习者',
            meta: 'B站 · 免费 · 入门/进阶阶段 · 粉丝66万+' },
          { title: '老姚吉他（B站UP主）',
            description: 'B站顶流吉他教学UP主，教学语言幽默，善用生活化比喻降低学习门槛，擅长将经典老歌和网络热歌改编成简单好听的吉他版，免费内容丰富',
            meta: 'B站 · 免费 · 零基础/入门阶段 · 粉丝57万+' },
          { title: '悦器社 App',
            description: '内含6000+吉他曲谱、调音器、节拍器和教学课程，一个App覆盖练习全流程，适合自学者日常使用，免费内容足够入门阶段使用',
            meta: 'App · 免费/订阅 · 全阶段适用' },
          { title: '《吉他自学三月通》（教材）',
            description: '内容全面、谱例丰富，是自学者口碑最高的入门教材之一，建议搭配B站视频教程一起使用，系统性强',
            meta: '纸质教材 · 约¥30 · 零基础/入门阶段' },
        ],
      },
      citations: ['xhs_67f31935000000001d016216', 'xhs_68c3d86e000000001c012746', 'xhs_6959fde300000000210321bb'],
      video_refs: ['douyin_7273113642130836792'],
    },
    {
      id: 'milestone',
      title: '第一个里程碑',
      content: {
        type: 'markdown',
        text: `## 🏆 第一个里程碑：完整弹唱一首流行歌曲副歌

**目标**：用吉他完整弹唱一首你最喜欢的流行歌曲的副歌段落（至少1分钟），录下来发给朋友或发小红书。

**预期时间**：约 **3-4 周**

---

### ✅ 达成动作清单

**第 1-3 天：装备与基础**
- [ ] 入手一把面单吉他（¥700-1000价位），装好App调音器
- [ ] 学会正确持琴姿势和调音方法
- [ ] 认识6根弦的名称，了解吉他谱（六线谱）怎么看

**第 4-10 天：和弦攻坚**
- [ ] 每天练习 C、G、Am、Em 四个核心和弦，每个能按实不闷音
- [ ] 每天10分钟爬格子，增强手指灵活度
- [ ] 右手练习最简单的下扫节奏，配合节拍器从 60bpm 起步

**第 11-21 天：学会目标曲目**
- [ ] 选一首和弦简单的4/4拍歌曲（推荐《童话》《晴天》副歌）
- [ ] 在悦器社或B站找到对应教程+曲谱
- [ ] 每天练习20-30分钟，专攻副歌段落的和弦转换
- [ ] 可以使用变调夹调整到适合自己音域的调性

**第 22-28 天：合成录制**
- [ ] 边弹边唱，哪怕节奏不完美也要唱出来
- [ ] 用手机录一段完整的副歌弹唱视频
- [ ] 发给朋友或上传到小红书，打卡成就！🎉

> 💡 提示：选歌时优先选 **4/4拍、和弦不超过4个** 的歌，避开R&B等复杂律动。完整弹下来那一刻，你就正式不是零基础了！`,
      },
      citations: ['xhs_68b3b611000000001d0087ab', 'xhs_66f66131000000002c02ce85', 'xhs_6959fde300000000210321bb'],
      video_refs: [],
    },
    {
      id: 'qa',
      title: '常见问题',
      content: {
        type: 'qa',
        items: [
          { q: '手指太细/太短/没有音乐基础，能学会吉他吗？',
            a: '完全可以。大多数自学成功的人都是从零基础开始的。手指灵活度是可以通过每天10-15分钟爬格子练出来的，与手指形状关系不大。音乐基础也不是必须的，先练和弦和节奏，乐理在练习过程中自然会慢慢理解。' },
          { q: '新手第一把吉他买多少钱的合适？买便宜的还是买好的？',
            a: '推荐预算500-1000元，优先选面单琴（面板为实木单板），音色和手感明显优于同价位合板。不推荐买200元以下的「烧火棍」，音准差会影响耳感发育，耽误学习。可以参考费森CLR300（¥698）、萨伽SF700（¥998）、雅马哈F310（¥949）等入门口碑款。' },
          { q: '自学还是找老师学？',
            a: '两种都可行。自学的话B站免费资源非常丰富，果木音乐教室适合打基础，老姚吉他适合弹唱热门歌。找老师的优点是可以及时纠正姿势问题，避免形成坏习惯。如果预算有限，可以先看免费视频入门，遇到瓶颈再请教老师。' },
          { q: '每天要练多长时间？',
            a: '初学阶段每天固定练习20-30分钟，比周末突击一次效果好得多。不需要每次练很久，关键是「每天都练」。爬格子+音阶约20分钟，再加上练习目标歌曲，总计30-45分钟是比较理想的量，坚持两周就能感受到明显进步。' },
          { q: '按弦手指很疼，正常吗？要不要坚持？',
            a: '完全正常！初学时指尖会疼，这是因为手指皮肤还没有形成老茧。一般坚持1-2周后疼痛感会明显减轻。可以选择弦距较低的吉他（弦距低意味着按弦更省力），也可以搭配变调夹降低按弦难度。疼痛期不要放弃，熬过去就是坦途。' },
          { q: '学吉他一定要先学乐理吗？',
            a: '不是必须的。按「邪修」路线也完全可以：先练手指灵活度、和弦转换、扫弦，三个月达到自娱自乐水平。乐理不是入门门槛，而是辅助工具，在练习过程中自然会遇到、慢慢吸收。如果一开始就埋头啃乐理，很容易把兴趣磨没了。' },
          { q: '在哪里找吉他谱？',
            a: '推荐几个靠谱渠道：①悦器社App（6000+谱子，免费）；②吉他大学霸/果木音乐B站视频（有配套谱）；③搜索「歌名+吉他谱」直接在小红书或B站找；④《吉他自学三月通》教材内也有大量谱例。' },
        ],
      },
      citations: ['xhs_68b3b611000000001d0087ab', 'xhs_6959fde300000000210321bb', 'xhs_68c3d86e000000001c012746', 'xhs_6760077a0000000014027673'],
      video_refs: ['douyin_7612537624436147633'],
    },
  ],
  // Trimmed evidence/video map — keys match citations/video_refs above.
  evidence: {
    xhs_68249cb8000000002300c786: { platform: 'xhs', title: '吉他自学正确流程', author: 'KT老师吉他教学', likes: 86394 },
    xhs_68c3d86e000000001c012746: { platform: 'xhs', title: '自学吉他两年，总结了一些学习资源和心得', author: '迪迪', likes: 6810 },
    xhs_66f66131000000002c02ce85: { platform: 'xhs', title: '自学吉他🔥零基础弹唱保姆级教程来啦！！', author: '绝世小彩虹', likes: 5803 },
    xhs_6663f80f000000000c019078: { platform: 'xhs', title: '认识吉他第一课，学吉他前一定要知道。', author: '🎸吉他阿鑫', likes: 5514 },
    xhs_67f31935000000001d016216: { platform: 'xhs', title: '破站受欢迎的吉他教学up主及各自特点', author: '半吨拿铁', likes: 4398 },
    xhs_6760077a0000000014027673: { platform: 'xhs', title: '新手吉他购买推荐！看着一条就够了！🥰', author: '小胡吉他指南', likes: 3523 },
    xhs_68b3b611000000001d0087ab: { platform: 'xhs', title: '给想要自学吉他的朋友一点建议——邪修篇', author: '问召', likes: 3464 },
    xhs_6959fde300000000210321bb: { platform: 'xhs', title: '自学吉他两年来，个人觉得非常有用的干货', author: '这河狸吗', likes: 2270 },
  },
  videos: {
    douyin_7500585749051854089: { author: 'kt文吉他教学', likes: 84615, title: '新手拿到吉他第一步练什么？' },
    douyin_7593791124486229274: { author: '大清Lantsaich', likes: 51782, title: '七分钟告诉你为啥学吉他半途而废！' },
    douyin_7563758100056280335: { author: '吉他邪修大法师', likes: 257552, title: '吉他自学速成教程' },
    douyin_7273113642130836792: { author: '赤邑文化-吉他教学', likes: 15783, title: '【零基础/全免费】吉他自学教程03 G调音阶' },
    douyin_7612537624436147633: { author: '贝应铭（开课中）', likes: 12468, title: '零基础免费吉他教程它来了！' },
  },
};

// ─── Tiny markdown renderer ─────────────────────────────────
// Handles only what the report content uses: h2/h3, **bold**,
// bullet lists, `- [ ]` checkboxes, blockquotes, `---` rules,
// paragraphs. Not a general-purpose markdown engine.
function renderInline(text, keyBase) {
  // Split on **bold** markers, preserving them.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={`${keyBase}-b-${i}`} style={{ color: 'var(--ink)' }}>{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyBase}-t-${i}`}>{p}</React.Fragment>;
  });
}

function MarkdownBlock({ text, color }) {
  const lines = text.split('\n');
  const blocks = [];
  let listBuf = null;
  let listKind = null; // 'bullet' | 'check'
  const flushList = () => {
    if (!listBuf) return;
    const items = listBuf;
    const kind = listKind;
    blocks.push(
      <ul key={`ul-${blocks.length}`} style={{
        margin: '8px 0 12px',
        paddingLeft: kind === 'check' ? 0 : 22,
        listStyle: kind === 'check' ? 'none' : 'disc',
      }}>
        {items.map((it, i) => (
          <li key={i} className="cn" style={{
            color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.7,
            display: kind === 'check' ? 'flex' : 'list-item',
            alignItems: 'flex-start', gap: 8,
            marginBottom: 4,
          }}>
            {kind === 'check' && (
              <span style={{
                width: 16, height: 16, borderRadius: 4,
                border: `1.5px solid ${color}66`, flexShrink: 0,
                marginTop: 3,
              }} />
            )}
            <span>{renderInline(it, `li-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
    listBuf = null;
    listKind = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (!line.trim()) { flushList(); return; }
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2 key={`h2-${idx}`} className="cn" style={{
          color: 'var(--ink)', fontSize: 18, fontWeight: 700,
          margin: '10px 0 10px', letterSpacing: 0.2,
        }}>{renderInline(line.slice(3), `h2-${idx}`)}</h2>
      );
      return;
    }
    if (line.startsWith('### ')) {
      flushList();
      blocks.push(
        <h3 key={`h3-${idx}`} className="cn" style={{
          color: 'var(--ink)', fontSize: 15, fontWeight: 600,
          margin: '14px 0 6px',
        }}>{renderInline(line.slice(4), `h3-${idx}`)}</h3>
      );
      return;
    }
    if (line.startsWith('> ')) {
      flushList();
      blocks.push(
        <blockquote key={`bq-${idx}`} className="cn" style={{
          margin: '10px 0', padding: '10px 12px',
          borderLeft: `3px solid ${color}`,
          background: `${color}10`,
          color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.65,
          borderRadius: '0 8px 8px 0',
        }}>{renderInline(line.slice(2), `bq-${idx}`)}</blockquote>
      );
      return;
    }
    if (line === '---') {
      flushList();
      blocks.push(<hr key={`hr-${idx}`} style={{ border: 0, height: 1, background: 'var(--line)', margin: '14px 0' }} />);
      return;
    }
    const checkMatch = line.match(/^-\s+\[ \]\s+(.*)$/);
    if (checkMatch) {
      if (listKind !== 'check') { flushList(); listKind = 'check'; listBuf = []; }
      listBuf.push(checkMatch[1]);
      return;
    }
    if (line.startsWith('- ')) {
      if (listKind !== 'bullet') { flushList(); listKind = 'bullet'; listBuf = []; }
      listBuf.push(line.slice(2));
      return;
    }
    flushList();
    blocks.push(
      <p key={`p-${idx}`} className="cn" style={{
        color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.75,
        margin: '0 0 10px',
      }}>{renderInline(line, `p-${idx}`)}</p>
    );
  });
  flushList();
  return <div>{blocks}</div>;
}

// ─── Section content renderers ──────────────────────────────
function BudgetTiers({ tiers, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tiers.map((tier, i) => (
        <div key={i} style={{
          padding: 12,
          borderRadius: 14,
          background: 'var(--surface)',
          border: `1px solid ${color}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="cn" style={{ color, fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>{tier.name}</span>
            <span className="mono" style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600 }}>{tier.price_range}</span>
          </div>
          <ul className="cn" style={{ margin: 0, paddingLeft: 18, listStyle: 'disc', color: 'var(--ink-2)', fontSize: 12.5, lineHeight: 1.7 }}>
            {tier.items.map((it, j) => <li key={j} style={{ marginBottom: 2 }}>{it}</li>)}
          </ul>
          {tier.note && (
            <div className="cn" style={{ marginTop: 8, padding: '6px 10px', borderRadius: 8, background: `${color}14`, color: 'var(--ink-2)', fontSize: 12, lineHeight: 1.6 }}>
              💡 {tier.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Timeline({ entries, color }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 18 }}>
      <div style={{ position: 'absolute', left: 5, top: 4, bottom: 4, width: 2, background: `${color}33` }} />
      {entries.map((e, i) => (
        <div key={i} style={{ position: 'relative', paddingBottom: i === entries.length - 1 ? 0 : 14 }}>
          <div style={{
            position: 'absolute', left: -18, top: 4,
            width: 12, height: 12, borderRadius: '50%',
            background: color, boxShadow: `0 0 0 3px ${color}33`,
          }} />
          <div className="mono" style={{ color, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}>{e.label}</div>
          <div className="cn" style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{e.title}</div>
          <div className="cn" style={{ color: 'var(--ink-2)', fontSize: 12.5, lineHeight: 1.65 }}>{e.detail}</div>
        </div>
      ))}
    </div>
  );
}

function CardsList({ cards, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          padding: 12, borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
        }}>
          <div className="cn" style={{ color: 'var(--ink)', fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
          <div className="cn" style={{ color: 'var(--ink-2)', fontSize: 12.5, lineHeight: 1.65, marginBottom: 6 }}>{c.description}</div>
          <div className="mono" style={{ color, fontSize: 10.5, letterSpacing: 0.3 }}>{c.meta}</div>
        </div>
      ))}
    </div>
  );
}

function QA({ items, color }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{
            borderRadius: 10, background: 'var(--surface)',
            border: '1px solid var(--line)', overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="cn"
              style={{
                width: '100%', background: 'transparent', border: 0,
                padding: '11px 12px', textAlign: 'left',
                color: 'var(--ink)', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'flex-start', gap: 8,
                cursor: 'pointer',
              }}
            >
              <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 1 }}>Q{i + 1}</span>
              <span style={{ flex: 1 }}>{it.q}</span>
              <span style={{ color: 'var(--ink-3)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>{Icon.chev()}</span>
            </button>
            {isOpen && (
              <div className="cn" style={{
                padding: '0 12px 12px 32px',
                color: 'var(--ink-2)', fontSize: 12.5, lineHeight: 1.7,
              }}>{it.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ContentByType({ content, color }) {
  switch (content.type) {
    case 'markdown':     return <MarkdownBlock text={content.text} color={color} />;
    case 'budget_tiers': return <BudgetTiers tiers={content.tiers} color={color} />;
    case 'timeline':     return <Timeline entries={content.entries} color={color} />;
    case 'cards':        return <CardsList cards={content.cards} color={color} />;
    case 'qa':           return <QA items={content.items} color={color} />;
    default:             return <div className="cn" style={{ color: 'var(--ink-3)' }}>未知内容类型：{content.type}</div>;
  }
}

// ─── Citations / video refs footer per section ──────────────
function SectionRefs({ section, report, color }) {
  const cites = section.citations.map((id) => report.evidence[id]).filter(Boolean);
  const vids = section.video_refs.map((id) => report.videos[id]).filter(Boolean);
  if (cites.length === 0 && vids.length === 0) return null;
  return (
    <div style={{
      marginTop: 10, paddingTop: 10,
      borderTop: '1px dashed var(--line)',
    }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
        Sources · {cites.length} 笔记 / {vids.length} 视频
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {cites.slice(0, 4).map((c, i) => (
          <span key={`c-${i}`} className="cn" style={{
            padding: '3px 8px', borderRadius: 999,
            background: `${color}14`, color: 'var(--ink-2)',
            fontSize: 10.5, lineHeight: 1.4,
            maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }} title={c.title}>📕 {c.title}</span>
        ))}
        {vids.slice(0, 2).map((v, i) => (
          <span key={`v-${i}`} className="cn" style={{
            padding: '3px 8px', borderRadius: 999,
            background: `${color}14`, color: 'var(--ink-2)',
            fontSize: 10.5, lineHeight: 1.4,
            maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }} title={v.title}>🎬 {v.title}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main screen ────────────────────────────────────────────
function GuitarReport({ onNav }) {
  const report = GUITAR_REPORT;
  const color = report.neon_color;

  return (
    <div className="screen report-snap" data-screen-label="09 Report"
      style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>
      {/* Top bar (overlay across all snap pages) */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '54px 14px 10px',
        background: 'linear-gradient(180deg, var(--bg) 60%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: -64,  // pull the first page up so it tucks under the topbar
      }}>
        <button onClick={() => onNav && onNav('feed')} style={{
          background: 'transparent', border: 0, color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
          fontFamily: 'var(--font-cn)', fontSize: 13,
        }}>
          {Icon.back({ width: 18, height: 18 })}<span>返回挑选</span>
        </button>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.5 }}>REPORT · {report.hobby_id}</div>
      </div>

      {/* Sections — each one snap-scrolls as its own page */}
      {report.sections.map((section, i) => (
        <ReportPage key={section.id}>
          <section style={{
            padding: 16, borderRadius: 16,
            background: 'var(--bg-elev)',
            border: '1px solid var(--line)',
          }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="mono" style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}22`, color, fontSize: 11, fontWeight: 700,
              }}>{String(i + 1).padStart(2, '0')}</span>
              <h2 className="cn" style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{section.title}</h2>
            </header>
            <ContentByType content={section.content} color={color} />
            <SectionRefs section={section} report={report} color={color} />
          </section>
        </ReportPage>
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        .report-snap > .report-page { scroll-snap-align: start; scroll-snap-stop: always; }
        .report-snap .report-page section::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}

function ReportPage({ children }) {
  return (
    <div className="report-page" style={{
      minHeight: '100%',
      padding: '74px 14px 24px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}

// Expose to global scope (matches the rest of the prototype).
window.GuitarReport = GuitarReport;
