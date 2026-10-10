(() => {
  'use strict';
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const text = (value, limit = 150) => typeof value === 'string' && value.trim() && value.trim().length <= limit ? value.trim() : null;
  const config = object(window.HYPERSONIC_CONFIG);
  const release = object(config.release);
  const support = object(config.support);
  const community = object(config.community);
  const prereq = object(config.prereq);
  const byId = id => document.getElementById(id);
  const node = (tag, content, className) => {
    const result = document.createElement(tag);
    if (content) result.textContent = content;
    if (className) result.className = className;
    return result;
  };
  // Only HTTPS service links and paths contained in this site's directory are accepted.
  function url(value, local = false) {
    const raw = text(value, 2048);
    if (!raw || raw === '#' || /[\u0000- \u007f\\]/.test(raw)) return null;
    try {
      const result = new URL(raw, location.href);
      if (result.username || result.password) return null;
      if (/^https:\/\//i.test(raw) && result.protocol === 'https:') return result.href;
      if (!local || /^[/#?]|:/.test(raw)) return null;
      const decoded = decodeURIComponent(raw.split(/[?#]/)[0]);
      if (/\\|:/.test(decoded) || decoded.split('/').some(part => part === '..')) return null;
      const base = new URL('.', location.href);
      if (result.origin !== base.origin || result.protocol !== base.protocol || !result.pathname.startsWith(base.pathname)) return null;
      return result.href;
    } catch { return null; }
  }
  function link(label, destination, className) {
    const result = node('a', label || null, className);
    result.href = destination;
    return result;
  }

  // Download button: icon, label and file details; shows "starting" then "started" states on click.
  const ICON_DOWNLOAD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_DONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function downloadButton(key, item) {
    const installer = key === 'installer';
    const action = link(null, item.url, installer ? 'button primary download-button' : 'button download-button');
    const ext = installer ? '.exe' : key === 'android' ? '.apk' : '.zip';
    const icon = node('span', null, 'dl-icon');
    icon.innerHTML = ICON_DOWNLOAD;
    const textBox = node('span', null, 'dl-text');
    const meta = size(item.bytes) || (installer ? 'Windows setup' : 'Portable ZIP');
    textBox.append(node('span', `Download ${ext}`, 'dl-label'), node('span', meta, 'dl-meta'));
    action.append(icon, textBox);
    action.dataset.meta = meta;
    action.dataset.label = `Download ${ext}`;
    if (item.kind === 'file') {
      action.dataset.package = key;
      action.setAttribute('download', '');
    }
    return action;
  }
  function downloadState(action, state) {
    const label = action.querySelector('.dl-label');
    const meta = action.querySelector('.dl-meta');
    const icon = action.querySelector('.dl-icon');
    if (!label) return;
    clearTimeout(action._timer);
    action.classList.remove('is-starting', 'is-started');
    const installer = action.dataset.package === 'installer';
    if (state === 'starting') {
      action.classList.add('is-starting');
      action.setAttribute('aria-busy', 'true');
      icon.innerHTML = '<span class="spinner"></span>';
      label.textContent = 'Starting download…';
      meta.textContent = 'Connecting to GitHub';
      action._timer = setTimeout(() => downloadState(action, 'started'), 2200);
    } else if (state === 'started') {
      action.classList.add('is-started');
      action.removeAttribute('aria-busy');
      icon.innerHTML = ICON_DONE;
      label.textContent = 'Download started';
      meta.textContent = "Check your browser's downloads";
      action._timer = setTimeout(() => downloadState(action, 'idle'), 9000);
    } else {
      action.removeAttribute('aria-busy');
      icon.innerHTML = ICON_DOWNLOAD;
      label.textContent = action.dataset.label;
      meta.textContent = action.dataset.meta;
    }
  }

  // Discord mark for community links (official glyph, currentColor).
  function discordLink(label, destination, className) {
    const result = link(null, destination, className);
    result.classList.add('discord-link');
    const icon = node('span', null, 'discord-icon');
    icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.32 4.37A19.8 19.8 0 0 0 15.39 2.8a13.6 13.6 0 0 0-.63 1.29 18.4 18.4 0 0 0-5.52 0 12.8 12.8 0 0 0-.64-1.29 19.7 19.7 0 0 0-4.93 1.53C.53 9.05-.32 13.6.1 18.1a19.9 19.9 0 0 0 6.04 3.05c.49-.66.92-1.37 1.3-2.1a12.9 12.9 0 0 1-2.04-.98c.17-.13.34-.26.5-.39a14.2 14.2 0 0 0 12.2 0l.5.39c-.65.39-1.33.71-2.04.98.38.74.81 1.44 1.3 2.1a19.8 19.8 0 0 0 6.04-3.05c.5-5.22-.84-9.73-3.58-13.73ZM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42s.95-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.16-1.09-2.16-2.42s.95-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.94 2.42-2.16 2.42Z"/></svg>';
    result.append(icon, document.createTextNode(label));
    return result;
  }

  // ---- Release state -------------------------------------------------------------------------
  const stage = release.stage === 'public' ? 'public' : 'closed';
  document.querySelector('meta[name="description"]').content = `A free fan mod for Command & Conquer: Generals – Zero Hour. Iran joins as a fourth faction, with strike drones and ballistic missiles. ${stage === 'public' ? 'Public' : 'Closed'} Windows alpha; requires your own Zero Hour 1.04.`;
  const version = text(release.version, 60) || '1.0.0-alpha.1';
  const source = url(release.engineSourceUrl, true);
  const androidSource = url(release.androidSourceUrl, true);
  const notes = url(release.notesUrl, true);
  const signup = url(release.testerSignupUrl);
  const access = url(release.testerAccessUrl);
  const provider = text(support.providerName, 60);
  const donation = provider && url(support.url);
  const communityUrl = url(community.url);
  const bugUrl = url(community.bugReportUrl);
  const siteUrl = url(config.publicSiteUrl);
  // ---- Analytics: GoatCounter (no cookies, no personal data); off unless a site code is configured.
  const goatCode = typeof object(config.analytics).goatcounterCode === 'string' && /^[a-z0-9-]{2,50}$/.test(config.analytics.goatcounterCode) ? config.analytics.goatcounterCode : null;
  if (goatCode) {
    const counter = document.createElement('script');
    counter.async = true;
    counter.src = 'https://gc.zgo.at/count.js';
    counter.dataset.goatcounter = `https://${goatCode}.goatcounter.com/count`;
    document.head.append(counter);
  }
  function countEvent(name, title) {
    if (goatCode && window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title, event: true });
  }
  const configuredPackages = object(release.packages);
  const packages = {};
  for (const key of ['installer', 'portable', 'android']) {
    const item = object(configuredPackages[key]);
    packages[key] = {
      url: stage === 'public' && source ? url(item.url, true) : null,
      bytes: Number.isSafeInteger(item.bytes) && item.bytes > 0 ? item.bytes : null,
      sha256: typeof item.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(item.sha256) ? item.sha256 : null,
      kind: item.destinationKind === 'file' ? 'file' : 'release-page'
    };
  }
  const enabled = packages.installer.url || packages.portable.url;
  const size = bytes => bytes ? (bytes < 1000000 ? `${Math.ceil(bytes / 1000)} KB` : `${(bytes / 1000000).toFixed(1)} MB`) : null;
  const descriptorFor = key => key === 'installer' ? 'Installer (.exe)' : key === 'android' ? 'Android APK (.apk)' : 'Portable ZIP (.zip)';
  const label = stage === 'closed' ? (signup ? 'Apply to test the alpha' : 'How to get the alpha') : enabled ? 'Download for Windows' : 'How to get the mod';
  document.querySelectorAll('[data-release-cta]').forEach(action => {
    action.replaceChildren(document.createTextNode(label + ' '));
    const arrow = node('span', '↓');
    arrow.setAttribute('aria-hidden', 'true');
    action.append(arrow);
  });

  // Routes shown in the status card: application, tester portal, community. Each appears only
  // when its HTTPS destination is configured.
  const routes = byId('tester-routes');
  function route(title, destination, className, note, discord) {
    const item = node('div', null, 'route');
    item.append(discord ? discordLink(title, destination, className) : link(title, destination, className));
    if (note) item.append(node('p', note));
    routes.append(item);
  }
  // Separated lists are built from items; CSS draws the "·" after each item (never at a line start).
  const NB = ' ';
  const zh = `Zero${NB}Hour${NB}1.04`;
  function sepFill(element, parts) {
    element.replaceChildren(...parts.filter(Boolean).map(part => typeof part === 'string' ? node('span', part) : part));
  }
  function statusLabel(stageName) {
    sepFill(byId('status-label'), [stageName, node('span', `v${version}`, 'version'), 'Windows PC']);
  }
  // Heading: "Alpha availability" while there is nothing to act on; "Get the alpha" once a route or package exists.
  byId('download-title').textContent = (signup || access || communityUrl || enabled) ? 'Get the alpha' : 'Alpha availability';
  if (stage === 'closed') {
    sepFill(byId('hero-release'), [`v${version}`, 'Closed Windows alpha', `Requires ${zh}`, 'Android planned']);
    statusLabel('Closed alpha');
    byId('release-banner').textContent = `This alpha is available by invitation only. Invited testers receive access instructions.`;
    byId('status-next').textContent = signup
      ? 'There is no public download yet. You can apply to test the alpha.'
      : `There is no public download or tester sign-up form on this site yet. The public download will be posted here${communityUrl ? ' and in the community' : ''} when it is ready.`;
    if (signup) route('Apply to test the alpha', signup, 'button primary', 'Applying does not guarantee an invitation. Donations do not affect selection.');
    if (access) route('Tester access', access, 'button', 'For invited testers; sign-in may be required.');
  } else {
    const preferred = packages.installer.url ? 'installer' : 'portable';
    sepFill(byId('hero-release'), [`v${version}`, 'Windows alpha', ...(enabled ? [descriptorFor(preferred), size(packages[preferred].bytes)] : ['Release files are being prepared']), `Requires ${zh}`]);
    statusLabel('Public alpha');
    byId('release-banner').textContent = enabled
      ? `v${version} is a public alpha for Windows, with an experimental Android build. Expect bugs and unfinished art.`
      : 'Public Windows alpha downloads are not available yet. Release files are being prepared.';
    byId('status-next').textContent = enabled ? '' : `The download will be posted here${communityUrl ? ' and in the community' : ''} when it is ready.`;
    byId('status-next').hidden = Boolean(enabled);
    const blocks = byId('public-packages');
    blocks.hidden = false;
    for (const key of ['installer', 'portable']) {
      const item = packages[key];
      const installer = key === 'installer';
      const block = node('article', null, installer ? 'package recommended' : 'package');
      const head = node('div', null, 'package-head');
      if (installer) head.append(node('span', 'Recommended', 'badge'));
      head.append(node('h3', installer ? 'Windows installer' : 'Portable ZIP'));
      block.append(head, node('p', installer ? 'Installs into its own folder and adds a Start menu shortcut.' : 'No setup: extract into its own folder and run HypersonicZH.exe.', 'package-desc'));
      if (item.url) {
        const action = downloadButton(key, item);
        block.append(action, node('p', `v${version} · Windows 10/11`, 'package-meta'));
        if (item.kind === 'release-page') block.append(node('p', 'Opens the release download page', 'package-meta'));
      } else block.append(node('p', installer ? 'Installer download is not available yet' : 'Portable ZIP download is not available yet', 'package-meta'));
      blocks.append(block);
    }
    const phone = packages.android;
    if (phone.url && androidSource) {
      const block = node('article', null, 'package android');
      const head = node('div', null, 'package-head');
      head.append(node('span', 'Experimental', 'badge'), node('h3', 'Android'));
      block.append(head, node('p', 'For 64-bit phones on Android 9 or newer. Copy your own Zero Hour game files to the phone, install the APK, then pick that folder in the app’s setup screen.', 'package-desc'));
      block.append(downloadButton('android', phone), node('p', `v${version} · Skirmish works; expect rough edges on phones`, 'package-meta'));
      blocks.append(block);
    }
    if (notes && enabled) {
      const more = node('p', null, 'packages-more');
      more.append(link('Release notes and all files on GitHub →', notes));
      blocks.append(more);
    }
    if (!packages.installer.url && packages.portable.url) {
      byId('setup-two').textContent = 'Extract the ZIP into its own folder, outside Zero Hour.';
      byId('setup-three').textContent = 'Run HypersonicZH.exe.';
    }
    byId('install-summary').textContent = enabled ? 'Install in three steps' : 'Installation steps for when downloads are available';
    if (enabled) byId('install').open = true;
  }
  if (communityUrl) route('Join the Discord', communityUrl, 'button', null, true);
  routes.hidden = !routes.childElementCount;

  function ordinary(event) { return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey; }
  function requestFeedback(key) {
    if (stage !== 'public' || !packages[key].url || packages[key].kind !== 'file') return;
    byId('request-feedback').hidden = false;
    byId('request-status').textContent = key === 'installer' ? 'Download requested. Once the file is saved, run the installer using the steps below.' : key === 'android' ? 'Download requested. Open the APK on your phone to install it (allow installs from your browser if asked), then pick your Zero Hour files folder in the app.' : 'Download requested. Once the ZIP is saved, extract it into its own folder using the steps below.';
    const retry = link("Download didn't start? Try again", packages[key].url);
    retry.dataset.package = key;
    retry.setAttribute('download', '');
    byId('request-links').replaceChildren(retry);
    if (donation) byId('request-links').append(link('Support the developer →', '#support'));
  }
  document.addEventListener('click', event => {
    const action = event.target.closest('a[data-package]');
    if (!action || !ordinary(event)) return;
    if (action.classList.contains('download-button')) downloadState(action, 'starting');
    countEvent(`download-${action.dataset.package}`, `Download ${action.dataset.package} v${version}`);
    requestFeedback(action.dataset.package);
  });

  // Store names are links inside the sentence; an unconfigured store stays as plain text.
  for (const [key, id] of [['steamUrl', 'store-steam'], ['eaAppUrl', 'store-ea']]) {
    const anchor = byId(id);
    const destination = url(prereq[key]);
    if (destination) anchor.href = destination;
    else anchor.replaceWith(document.createTextNode(anchor.textContent));
  }

  const verification = byId('file-verification');
  verification.replaceChildren();
  for (const key of ['installer', 'portable', 'android']) {
    const item = packages[key];
    if (key === 'android' && !androidSource) continue;
    if (item.url && item.sha256) {
      verification.append(node('p', `${descriptorFor(key)} · SHA-256`));
      const row = node('div', null, 'hash-row');
      const copy = node('button', 'Copy', 'copy-hash');
      copy.type = 'button';
      copy.setAttribute('aria-label', `Copy the ${descriptorFor(key)} SHA-256`);
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(item.sha256); copy.textContent = 'Copied'; }
        catch { copy.textContent = 'Select and copy'; }
        setTimeout(() => { copy.textContent = 'Copy'; }, 2000);
      });
      row.append(node('code', item.sha256, 'hash'), copy);
      verification.append(row);
    }
  }
  if (!enabled) verification.append(node('p', 'Checksums will accompany the release packages.'));
  else {
    // Packages are live: say plainly which of them has no configured checksum.
    const offered = ['installer', 'portable'].filter(key => packages[key].url);
    const missing = offered.filter(key => !packages[key].sha256);
    if (missing.length === offered.length) verification.append(node('p', 'Checksums are not available for these packages yet.'));
    else if (missing.length) verification.append(node('p', `No checksum is available yet for the ${missing.map(key => key === 'installer' ? 'Windows installer' : 'portable ZIP').join(' or ')}.`));
  }
  if (source) verification.append(link('Matching engine source', source));
  if (androidSource && packages.android.url) { verification.append(document.createTextNode(' · ')); verification.append(link('Android engine source', androidSource)); }
  if (notes) byId('footer-config-links').append(link('Release notes', notes));
  if (source) {
    byId('footer-config-links').append(link('Engine source', source));
    byId('footer-source').hidden = true;
  } else if (stage === 'public') {
    byId('footer-source').textContent = 'Matching engine source will accompany the public release.';
    byId('footer-source').hidden = false;
  }
  byId('signing-note').hidden = !(release.signingStatus === 'unsigned' && enabled);

  // ---- Support -------------------------------------------------------------------------------
  if (donation) {
    byId('donation-action').replaceChildren(link('Support the developer', donation, 'button dark'), node('p', `Opens ${provider}`, 'provider-note'));
  }
  const costs = Array.isArray(support.confirmedCostCategories) ? support.confirmedCostCategories.map(value => text(value, 100)).filter(Boolean).slice(0, 8) : [];
  if (costs.length) {
    byId('confirmed-costs').hidden = false;
    byId('confirmed-costs').textContent = `Mod costs covered from donations include ${costs.join(', ')}.`;
  }
  const channels = byId('community-links');
  if (communityUrl) channels.replaceChildren(discordLink('Join the Discord', communityUrl));
  if (bugUrl) {
    const item = node('li');
    item.append(link('Report a bug', bugUrl));
    channels.after(item);
    if (!communityUrl) channels.remove();
    byId('help-bug-link').append(document.createTextNode(' · '), link('Report a bug', bugUrl));
    byId('bug-helper').hidden = true;
  }
  if (siteUrl) {
    byId('share-action').hidden = false;
    byId('share-url').value = siteUrl;
    byId('copy-project').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(siteUrl);
        byId('share-status').textContent = 'Project link copied.';
      } catch {
        byId('share-url').hidden = false;
        byId('share-status').textContent = 'Select and copy the public project link below.';
        byId('share-url').focus();
        byId('share-url').select();
      }
    });
  }

  // ---- Showcase images and the enlarged-image viewer -----------------------------------------
  const pending = 'Preview awaiting gameplay verification.';
  const media = object(config.media);
  const dialog = byId('image-dialog');
  let opener;
  document.querySelectorAll('[data-scene]').forEach(scene => {
    const item = object(media[scene.dataset.scene]);
    const alt = text(item.alt, 700);
    const verified = item.verifiedCapture === true && Boolean(alt);
    if (verified) scene.querySelector('.capture img').alt = alt;
    else {
      // Unused while all five images are owner-verified; kept for future, unreviewed captures.
      const labels = { launch: 'launch', missiles: 'missile', drones: 'drone', ground: 'ground-forces', defense: 'air-defense' };
      scene.querySelector('.capture img').alt = `Unverified ${labels[scene.dataset.scene] || 'gameplay'} preview.`;
      scene.querySelector('.briefing-text, .briefing').append(node('p', pending, 'capture-status'));
    }
    const action = scene.querySelector('.scene-view');
    if (typeof dialog.showModal !== 'function') return;
    action.setAttribute('aria-haspopup', 'dialog');
    action.addEventListener('click', event => {
      if (!ordinary(event)) return;
      event.preventDefault();
      opener = action;
      const image = byId('dialog-image');
      const picture = scene.querySelector('.capture picture');
      image.alt = scene.querySelector('.capture img').alt;
      image.srcset = picture && picture.dataset.full ? picture.dataset.full : '';
      image.sizes = '(min-width: 1352px) 1286px, calc(100vw - 66px)';
      image.src = action.href;
      byId('dialog-caption').textContent = scene.querySelector('h3').textContent;
      byId('dialog-status').textContent = pending;
      byId('dialog-status').hidden = verified;
      dialog.showModal();
    });
  });
  byId('dialog-close').addEventListener('click', () => dialog.close());
  // The native modal makes the page inert. Keep its single keyboard stop inside the viewer as
  // well, including browsers that otherwise tab to browser chrome.
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); byId('dialog-close').focus(); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus({ preventScroll: true }); });

  // ---- Header and anchor clearance -----------------------------------------------------------
  const header = document.querySelector('.site-header');
  const wide = matchMedia('(min-width: 768px)');
  function headerState() { header.classList.toggle('at-top', scrollY <= 8); }
  function layout() {
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-height', `${height}px`);
    // The sticky header covers the top of the page on wide screens; phones scroll it away.
    document.documentElement.style.setProperty('--anchor-offset', `${wide.matches ? height : 0}px`);
    headerState();
  }
  let frame;
  function scheduleLayout() { cancelAnimationFrame(frame); frame = requestAnimationFrame(layout); }
  addEventListener('scroll', headerState, { passive: true });
  addEventListener('resize', scheduleLayout);
  addEventListener('pageshow', layout);
  addEventListener('hashchange', headerState);
  new ResizeObserver(scheduleLayout).observe(header);

  // ---- Title logo: a blurred preview holds its place until the image has loaded ----------------------
  const titleArt = byId('title-art');
  const titlePicture = document.querySelector('.title-picture');
  function logoFallback() { titlePicture.hidden = true; byId('title-fallback').hidden = false; }
  function logoReady() {
    titlePicture.classList.remove('pending');
    setTimeout(() => titlePicture.classList.add('loaded'), 700);
  }
  titleArt.addEventListener('error', logoFallback);
  titleArt.addEventListener('load', logoReady);
  if (titleArt.complete) { if (titleArt.naturalWidth) logoReady(); else logoFallback(); }
  else titlePicture.classList.add('pending');
  layout();

  // ---- Deep links (#download etc.) ------------------------------------------------------------
  // The browser jumps to the anchor as soon as the element exists, before web fonts and images
  // have settled. Re-align the target after load and after the fonts are ready, unless the
  // visitor has already started scrolling on their own.
  let userScrolled = false;
  const stopRealign = () => { userScrolled = true; };
  for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown']) addEventListener(type, stopRealign, { passive: true, once: true });
  function realign() {
    if (userScrolled || !location.hash) return;
    let target = null;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    layout();
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    headerState();
  }
  realign();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(realign);
  if (document.readyState === 'complete') realign(); else addEventListener('load', () => { realign(); requestAnimationFrame(realign); });
  addEventListener('hashchange', () => { userScrolled = false; });
})();
