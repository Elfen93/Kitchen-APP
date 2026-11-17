import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileView from './ProfileView.jsx';
import GuideView from './GuideView.jsx';
import CommunityView from './CommunityView.jsx';
import AboutView from './AboutView.jsx';
import { useI18n } from '../i18n/index.jsx';

const PAGES = [
  { id: 'profile', emo: '🎯', title: 'pageProfile', sub: 'pageProfileSub' },
  { id: 'guide', emo: '🧭', title: 'pageGuide', sub: 'pageGuideSub' },
  { id: 'community', emo: '🍲', title: 'pageCommunity', sub: 'pageCommunitySub' },
  { id: 'about', emo: 'ℹ️', title: 'pageAbout', sub: 'pageAboutSub' },
];

export default function MoreView({ page, setPage, ...props }) {
  const { t } = useI18n();
  const current = PAGES.find((p) => p.id === page);
  if (!current) {
    return (
      <>
        <div className="section-head"><h2>{t('moreTitle')}</h2></div>
        <div className="stack" style={{ gap: 8 }}>
          {PAGES.map((p) => (
            <button key={p.id} className="menu-item" onClick={() => setPage(p.id)}>
              <span className="emo" aria-hidden="true">{p.emo}</span>
              <span className="grow"><b>{t(p.title)}</b><small>{t(p.sub)}</small></span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <button className="back" onClick={() => setPage(null)}><ChevronLeft size={18} /> {t('moreTitle')}</button>
      {current.id !== 'community' && <div className="section-head"><h2>{t(current.title)}</h2></div>}
      {current.id === 'profile' && <ProfileView {...props} />}
      {current.id === 'guide' && <GuideView />}
      {current.id === 'community' && <CommunityView {...props} />}
      {current.id === 'about' && <AboutView />}
    </>
  );
}
