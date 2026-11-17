const KOFI = import.meta.env.VITE_KOFI_URL;
const PAYPAL = import.meta.env.VITE_PAYPAL_URL;

export default function AboutView() {
  const share = async () => {
    const data = { title: '買い物 Cook', text: 'Cheap recipes and shopping help for living in Japan', url: location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); alert('Link copied'); }
    } catch { /* cancelled */ }
  };
  return (
    <div className="stack">
      <div className="card">
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Why this exists</h2>
        <p className="muted">Moving to Japan is hard enough without also working out how to eat well on little money in a language you can't read yet. 買い物 Cook is free, with no ads and no accounts.</p>
      </div>
      <div className="card">
        <p className="eyebrow">Your data</p>
        <p className="small muted">Your budget, pantry, list and favourites are stored only in this browser. When you generate recipes, your meal choice, diet, allergies and pantry items are sent to our server and to Anthropic's API to write the recipes; nothing else is sent and nothing is tied to your identity. Community recipes you submit are public.</p>
      </div>
      <div className="card">
        <p className="eyebrow">Prices</p>
        <p className="small muted">Prices are estimates for typical Tokyo supermarkets and vary by store, region and season. Set what you actually pay on any ingredient and the app uses it everywhere.</p>
      </div>
      {(KOFI || PAYPAL) && (
        <div className="card">
          <p className="eyebrow">Support</p>
          <p className="small muted mb">Generating recipes costs money for every request. If the app helps you and you can afford it, a small contribution keeps it free for people who can't.</p>
          <div className="stack" style={{ gap: 8 }}>
            {KOFI && <a className="btn accent block" href={KOFI} target="_blank" rel="noopener noreferrer">☕ Ko-fi</a>}
            {PAYPAL && <a className="btn block" href={PAYPAL} target="_blank" rel="noopener noreferrer">PayPal</a>}
          </div>
        </div>
      )}
      <button className="btn block" onClick={share}>Share with someone who just moved here</button>
    </div>
  );
}
