import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileView from './ProfileView.jsx';
import GuideView from './GuideView.jsx';
import CommunityView from './CommunityView.jsx';
import AboutView from './AboutView.jsx';

const PAGES = [
  { id: 'profile', emo: '🎯', title: 'Budget & diet', sub: 'Weekly spending, diet, allergies, calories' },
  { id: 'guide', emo: '🧭', title: 'Supermarket guide', sub: 'Stores, label words, what’s in season' },
  { id: 'community', emo: '🍲', title: 'Community recipes', sub: 'Dishes shared by other people' },
  { id: 'about', emo: 'ℹ️', title: 'About & privacy', sub: 'What’s stored, how prices work, support' },
];

export default function MoreView({ page, setPage, ...props }) {
  const current = PAGES.find((p) => p.id === page);
  if (!current) {
    return (
      <>
        <div className="section-head"><h2>More</h2></div>
        <div className="stack" style={{ gap: 8 }}>
          {PAGES.map((p) => (
            <button key={p.id} className="menu-item" onClick={() => setPage(p.id)}>
              <span className="emo" aria-hidden="true">{p.emo}</span>
              <span className="grow"><b>{p.title}</b><small>{p.sub}</small></span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <button className="back" onClick={() => setPage(null)}><ChevronLeft size={18} /> More</button>
      {current.id !== 'community' && <div className="section-head"><h2>{current.title}</h2></div>}
      {current.id === 'profile' && <ProfileView {...props} />}
      {current.id === 'guide' && <GuideView />}
      {current.id === 'community' && <CommunityView {...props} />}
      {current.id === 'about' && <AboutView />}
    </>
  );
}
