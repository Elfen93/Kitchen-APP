// Cloudflare Pages Functions entry: every /api/* request goes to the same
// handler the Worker uses (worker/index.js). Static files are served by Pages.
import worker from '../../worker/index.js';

export function onRequest(context) {
  return worker.fetch(context.request, context.env);
}
