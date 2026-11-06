/* Owner configuration. Only approved HTTPS destinations or site-local artifacts.
   Never put private download URLs, tokens or credentials in this public file.
   Public packages require matching engine source; verify the version before publishing.
   Captures count as verified only when reviewed AND supplied with meaningful alt text.
   All five showcase images were reviewed and chosen by the owner (2026-10-06). */
window.HYPERSONIC_CONFIG = {
  release: {
    stage: 'public',
    version: '1.0.0-alpha.2',
    testerSignupUrl: null,
    testerAccessUrl: null,
    packages: {
      installer: { url: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.2/GeneralsHypersonic-1.0.0-alpha.2-setup.exe', bytes: 97261840, sha256: '5bb7be6ede5030bdcf044183163f8a099e537b49fdd6fdc5c74dab84832443e1', destinationKind: 'file' },
      portable: { url: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.2/GeneralsHypersonic-1.0.0-alpha.2-portable.zip', bytes: 119243286, sha256: '6112782b08a50f6a9928caa5b19d40135ef41d6f18d175bee4bc782dda737422', destinationKind: 'file' },
      // Experimental phone build (arm64, Android 9+); players supply their own Zero Hour files.
      android: { url: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.2/GeneralsHypersonic-1.0.0-alpha.2-android.apk', bytes: 284241300, sha256: 'd72c185c67e1b6d490d9642e032f62e92667ac0320a7405e8fdc8e433e6fdb40', destinationKind: 'file' }
    },
    engineSourceUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.2/GeneralsHypersonic-1.0.0-alpha.2-engine-source.zip',
    androidSourceUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.2/GeneralsHypersonic-1.0.0-alpha.2-android-engine-source.zip',
    notesUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/tag/v1.0.0-alpha.2',
    signingStatus: 'unsigned'
  },
  prereq: {
    steamUrl: 'https://store.steampowered.com/bundle/39394/Command_Conquer_The_Ultimate_Collection/',
    eaAppUrl: 'https://www.ea.com/games/command-and-conquer/command-and-conquer-the-ultimate-collection'
  },
  // Only enabled options with a valid URL appear. Fill in the URL and set enabled: true after the owner checks.
  support: [
    { id: 'crypto', url: 'https://nowpayments.io/donation/generalshypersonic', providerName: 'NOWPayments', note: 'Accepts crypto donations', enabled: true },
    // Wait for the owner's Payoneer check; itch.io must keep the download free ($0 minimum).
    { id: 'itch', url: '', providerName: 'itch.io', note: 'For card or PayPal donors: any amount, one-time', enabled: false },
    // Wait for the owner to check that the Whish Me QR reveals no phone number or full name.
    { id: 'whish', url: '', providerName: 'Whish', note: 'For donors in Lebanon: scan with the Whish app', enabled: false }
  ],
  confirmedSupportCostCategories: [],
  community: { email: 'generalshypersonic@gmail.com', url: 'https://discord.gg/NbYUCE6PX9', instagramUrl: 'https://www.instagram.com/generalshypersonic/', telegramUrl: 'https://t.me/HypersonicVoices', bugReportUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/issues/new' },
  // Temporary header promo (2026-10-24): replaces the three header community icons with the new reel and the
  // Instagram account. enabled: false = the three icons come back exactly as before. Footer links are not affected.
  promo: { enabled: false, kicker: 'New reel', title: 'First look at the next update', reelUrl: 'https://www.instagram.com/p/De44DUQB2yK/', accountUrl: 'https://www.instagram.com/generalshypersonic/', thumb: 'assets/generated/reel-thumb-96.webp' },
  // Cookie-free visit, download and support-click counts (goatcounter.com). Set the site code; null = off.
  analytics: { goatcounterCode: 'generals-hypersonic' },
  publicSiteUrl: 'https://mxalmousawi.github.io/generals-hypersonic-site/',
  // Thin bar at the top of the page. enabled: false = no bar. A visitor who closes it never sees this campaign again
  // (stored per browser); a new `id` shows the bar again to everyone.
  announcement: { enabled: true, id: 'release-1-0-0-alpha-2', href: '#new', text: 'Version 1.0.0-alpha.2 is out.', linkText: 'See what is new' },
  media: {
    launch: { verifiedCapture: true, alt: 'Gameplay screenshot: four truck-mounted launchers on a desert base fire ballistic missiles straight up, trailing smoke.' },
    missiles: { verifiedCapture: true, alt: 'Gameplay screenshot: missiles strike an enemy base, with two bright explosions among the buildings and tracer lines crossing the sky.' },
    drones: { verifiedCapture: true, alt: 'Gameplay screenshot: delta-wing strike drones fly over a desert crossroads while a launcher at the junction fires toward a burning enemy building.' },
    ground: { verifiedCapture: true, alt: 'Gameplay screenshot: tanks, armored vehicles and infantry stand in formation on both sides of a desert road, with rocket launchers behind them.' },
    defense: { verifiedCapture: true, alt: 'Gameplay screenshot: surface-to-air missiles arc up from launchers on both sides of a road and burst in smoke around an enemy helicopter.' }
  }
};
