import { useEffect, useState } from 'react';
import { Github, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'gh-star-popup-dismissed-at';
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const GITHUB_URL = 'https://github.com/vickyRathee/11holidays';

export function GitHubStarPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const last = raw ? parseInt(raw, 10) : 0;
      if (!last || Date.now() - last > ONE_MONTH_MS) {
        const t = setTimeout(() => setOpen(true), 1500);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Star us on GitHub"
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in"
    >
      <button
        onClick={dismiss}
        aria-label="Close"
        className="absolute right-2 top-2 rounded-sm p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="rounded-md bg-muted p-2">
          <Github className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Enjoying the app?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Support the project by starring it on GitHub.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" asChild onClick={dismiss}>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Star className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
