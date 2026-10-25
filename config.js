/* Owner configuration. Only approved HTTPS destinations or site-local artifacts.
   Never put private download URLs, tokens or credentials in this public file.
   Public packages require matching engine source; verify the version before publishing.
   Captures count as verified only when reviewed AND supplied with meaningful alt text.
   All five showcase images were reviewed and chosen by the owner (2026-10-06). */
window.HYPERSONIC_CONFIG = {
  release: {
    stage: 'public',
    version: '1.0.0-alpha.1',
    testerSignupUrl: null,
    testerAccessUrl: null,
    packages: {
      installer: { url: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.1/GeneralsHypersonic-1.0.0-alpha.1-setup.exe', bytes: 58730979, sha256: 'a9871a1701b9912a9eb72f8343a0978b379c4307ab78afaa1dae6699d64a9377', destinationKind: 'file' },
      portable: { url: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.1/GeneralsHypersonic-1.0.0-alpha.1-portable.zip', bytes: 70934321, sha256: '4e4deeaa13fdd0422877ac9a7902830bf99e0e8b7f196ddc5bf6e36e53e47210', destinationKind: 'file' },
      // Experimental phone build (arm64, Android 9+); players supply their own Zero Hour files.
      android: { url: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.1/GeneralsHypersonic-1.0.0-alpha.1-android.apk', bytes: 179173991, sha256: '45717816a8ea63ed67adc6828d3cfa591c6f779d5bb789637aad2b575a44518d', destinationKind: 'file' }
    },
    engineSourceUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.1/GeneralsHypersonic-1.0.0-alpha.1-engine-source.zip',
    androidSourceUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/download/v1.0.0-alpha.1/GeneralsHypersonic-1.0.0-alpha.1-android-engine-source.zip',
    notesUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/releases/tag/v1.0.0-alpha.1',
    signingStatus: 'unsigned'
  },
  prereq: {
    steamUrl: 'https://store.steampowered.com/bundle/39394/Command_Conquer_The_Ultimate_Collection/',
    eaAppUrl: 'https://www.ea.com/games/command-and-conquer/command-and-conquer-the-ultimate-collection'
  },
  support: { url: 'https://nowpayments.io/donation/generalshypersonic', providerName: 'NOWPayments', confirmedCostCategories: [] },
  community: { email: 'generalshypersonic@gmail.com', url: 'https://discord.gg/NbYUCE6PX9', instagramUrl: 'https://www.instagram.com/generalshypersonic/', telegramUrl: 'https://t.me/HypersonicVoices', bugReportUrl: 'https://github.com/MxAlmousawi/generals-hypersonic-site/issues/new' },
  // Temporary header promo (2026-10-24): replaces the three header community icons with the new reel and the
  // Instagram account. enabled: false = the three icons come back exactly as before. Footer links are not affected.
  promo: { enabled: true, kicker: 'New reel', title: 'First look at the next update', reelUrl: 'https://www.instagram.com/p/De44DUQB2yK/', accountUrl: 'https://www.instagram.com/generalshypersonic/', thumb: 'assets/generated/reel-thumb-96.webp' },
  // Cookie-free visit and download counts (goatcounter.com). Set the site code, e.g. 'hypersonic'; null = off.
  analytics: { goatcounterCode: 'generals-hypersonic' },
  publicSiteUrl: 'https://mxalmousawi.github.io/generals-hypersonic-site/',
  // Thin bar at the top of the page pointing to the voice acting roles (#voices), with the open-role count from `voices`.
  // enabled: false = no bar. A visitor who closes it never sees this campaign again (stored per browser); a new `id`
  // shows the bar again to everyone. It also hides itself while no role is open.
  announcement: { enabled: true, id: 'voices-2026-10', href: '#voices' },
  // Voice acting casting board (#voices). Change only `status` and `credit`, then set `updated`.
  // status: 'open' | 'taken' (someone has claimed it) | 'recorded' (recordings received).
  // credit: the name the volunteer asked to be credited as (only with their OK), or null. Shown on the card and in
  // "Voices so far". Keep the Telegram role list (crossed-out roles) in step with this.
  voices: {
    updated: '2026-10-25',
    roles: {
      announcer: { status: 'recorded', credit: 'Mohammadhosein Farahnaki' },
      irgc: { status: 'recorded', credit: null },
      basij: { status: 'recorded', credit: '@9ninegames9' },
      atgm: { status: 'taken', credit: null },
      misagh: { status: 'taken', credit: null },
      'drone-operator': { status: 'recorded', credit: 'Morteza Zare Moghaddam' },
      kaveh: { status: 'recorded', credit: 'Big Dani' },
      dozer: { status: 'recorded', credit: 'Saman Shahmoradi' },
      'supply-truck': { status: 'recorded', credit: 'Okhos' },
      karrar: { status: 'taken', credit: null },
      safir: { status: 'recorded', credit: null },
      boragh: { status: 'taken', credit: null },
      zu23: { status: 'recorded', credit: 'danialgh' },
      bavar: { status: 'recorded', credit: 'Okhos' },
      fajr5: { status: 'taken', credit: null },
      zolfaghar: { status: 'recorded', credit: '@9ninegames9' }
    }
  },
  media: {
    launch: { verifiedCapture: true, alt: 'Gameplay screenshot: four truck-mounted launchers on a desert base fire ballistic missiles straight up, trailing smoke.' },
    missiles: { verifiedCapture: true, alt: 'Gameplay screenshot: missiles strike an enemy base, with two bright explosions among the buildings and tracer lines crossing the sky.' },
    drones: { verifiedCapture: true, alt: 'Gameplay screenshot: delta-wing strike drones fly over a desert crossroads while a launcher at the junction fires toward a burning enemy building.' },
    ground: { verifiedCapture: true, alt: 'Gameplay screenshot: tanks, armored vehicles and infantry stand in formation on both sides of a desert road, with rocket launchers behind them.' },
    defense: { verifiedCapture: true, alt: 'Gameplay screenshot: surface-to-air missiles arc up from launchers on both sides of a road and burst in smoke around an enemy helicopter.' }
  }
};
