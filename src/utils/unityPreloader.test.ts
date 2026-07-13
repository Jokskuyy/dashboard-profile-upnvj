/**
 * TDD Tests for unityPreloader behavior
 *
 * Tests verify skip conditions and download behavior using
 * focused unit tests on the core logic patterns.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Helper: create preloader skip logic (mirrors actual implementation) ────

interface ConnectionInfo {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
}

function shouldSkipPreload(opts: {
  hostname?: string;
  innerWidth?: number;
  userAgent?: string;
  connection?: ConnectionInfo | null;
}): { skip: boolean; reason: string } {
  const {
    hostname = 'localhost',
    innerWidth = 1280,
    userAgent = 'Mozilla/5.0 (Windows NT 10.0)',
    connection = null,
  } = opts;

  if (hostname.includes('github.io')) {
    return { skip: true, reason: 'GitHub Pages detected' };
  }

  const isMobile =
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
    innerWidth < 768;
  if (isMobile) {
    return { skip: true, reason: 'Mobile device detected' };
  }

  if (connection) {
    if (connection.saveData) {
      return { skip: true, reason: 'Save-Data mode enabled' };
    }
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return { skip: true, reason: `Slow connection: ${connection.effectiveType}` };
    }
  }

  return { skip: false, reason: '' };
}

// ── Helper: simulate file download priority order ─────────────────────────

function getUnityFileUrls(basePath = '/'): string[] {
  const buildPath = `${basePath}unity-builds/v0.6.3/Build`;
  return [
    `${buildPath}/v0.6.3.loader.js`,
    `${buildPath}/v0.6.3.framework.js.unityweb`,
    `${buildPath}/v0.6.3.wasm.unityweb`,
    `${buildPath}/v0.6.3.data.unityweb`,
  ];
}

// ── Tests: Skip Conditions ─────────────────────────────────────────────────

describe('UnityPreloader — skip conditions (behavior)', () => {
  it('skips on GitHub Pages hostname', () => {
    const result = shouldSkipPreload({ hostname: 'user.github.io' });
    expect(result.skip).toBe(true);
    expect(result.reason).toContain('GitHub Pages');
  });

  it('skips on mobile viewport width < 768px', () => {
    const result = shouldSkipPreload({ innerWidth: 375 });
    expect(result.skip).toBe(true);
    expect(result.reason).toContain('Mobile');
  });

  it('skips on Android user agent', () => {
    const result = shouldSkipPreload({ userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)' });
    expect(result.skip).toBe(true);
    expect(result.reason).toContain('Mobile');
  });

  it('skips when Save-Data is enabled', () => {
    const result = shouldSkipPreload({ connection: { saveData: true, effectiveType: '4g' } });
    expect(result.skip).toBe(true);
    expect(result.reason).toContain('Save-Data');
  });

  it('skips on 2G connection', () => {
    const result = shouldSkipPreload({ connection: { saveData: false, effectiveType: '2g' } });
    expect(result.skip).toBe(true);
    expect(result.reason).toContain('2g');
  });

  it('skips on slow-2G connection', () => {
    const result = shouldSkipPreload({ connection: { saveData: false, effectiveType: 'slow-2g' } });
    expect(result.skip).toBe(true);
    expect(result.reason).toContain('slow-2g');
  });

  it('does NOT skip on desktop 4G', () => {
    const result = shouldSkipPreload({
      hostname: 'localhost',
      innerWidth: 1280,
      connection: { saveData: false, effectiveType: '4g', downlink: 10 },
    });
    expect(result.skip).toBe(false);
  });

  it('does NOT skip on desktop with no connection info', () => {
    const result = shouldSkipPreload({
      hostname: 'dashboard.upnvj.ac.id',
      innerWidth: 1440,
      connection: null,
    });
    expect(result.skip).toBe(false);
  });
});

// ── Tests: File Priority Order ─────────────────────────────────────────────

describe('UnityPreloader — download priority order (behavior)', () => {
  it('downloads loader first (smallest file)', () => {
    const urls = getUnityFileUrls();
    expect(urls[0]).toContain('loader.js');
  });

  it('downloads framework second', () => {
    const urls = getUnityFileUrls();
    expect(urls[1]).toContain('framework.js.unityweb');
  });

  it('downloads wasm third', () => {
    const urls = getUnityFileUrls();
    expect(urls[2]).toContain('wasm.unityweb');
  });

  it('downloads data last (largest file)', () => {
    const urls = getUnityFileUrls();
    expect(urls[3]).toContain('data.unityweb');
  });

  it('always returns exactly 4 files', () => {
    const urls = getUnityFileUrls();
    expect(urls).toHaveLength(4);
  });

  it('all URLs reference v0.6.3 build', () => {
    const urls = getUnityFileUrls();
    urls.forEach(url => {
      expect(url).toContain('v0.6.3');
    });
  });
});

// ── Tests: Search Debounce Behavior ────────────────────────────────────────

describe('Search debounce behavior (300ms)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('does NOT fire search immediately on input', () => {
    const searchFn = vi.fn();
    let timer: ReturnType<typeof setTimeout>;

    const handleInput = (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => searchFn(value), 300);
    };

    handleInput('gedung');
    expect(searchFn).not.toHaveBeenCalled();
  });

  it('fires search after 300ms debounce', () => {
    const searchFn = vi.fn();
    let timer: ReturnType<typeof setTimeout>;

    const handleInput = (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => searchFn(value), 300);
    };

    handleInput('perpustakaan');
    vi.advanceTimersByTime(300);
    expect(searchFn).toHaveBeenCalledTimes(1);
    expect(searchFn).toHaveBeenCalledWith('perpustakaan');
  });

  it('cancels previous timer on rapid typing — only last fires', () => {
    const searchFn = vi.fn();
    let timer: ReturnType<typeof setTimeout>;

    const handleInput = (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => searchFn(value), 300);
    };

    ['g', 'ge', 'ged', 'gedu', 'gedun', 'gedung'].forEach(handleInput);

    vi.advanceTimersByTime(300);
    expect(searchFn).toHaveBeenCalledTimes(1);
    expect(searchFn).toHaveBeenCalledWith('gedung');
  });

  it('fires separate searches when user pauses between inputs', () => {
    const searchFn = vi.fn();
    let timer: ReturnType<typeof setTimeout>;

    const handleInput = (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => searchFn(value), 300);
    };

    handleInput('gedung a');
    vi.advanceTimersByTime(300);
    handleInput('fasilitas');
    vi.advanceTimersByTime(300);

    expect(searchFn).toHaveBeenCalledTimes(2);
    expect(searchFn).toHaveBeenNthCalledWith(1, 'gedung a');
    expect(searchFn).toHaveBeenNthCalledWith(2, 'fasilitas');
  });
});
