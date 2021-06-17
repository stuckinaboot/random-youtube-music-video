const fetch = require("node-fetch");

const playlists = [
  {
    name: "most-viewed",
    id: "PL15B1E77BB5708555",
    max: 543,
  },
  {
    name: "billboard",
    id: "PL55713C70BA91BD6E",
    max: 200,
  },
  {
    name: "latest",
    id: "PLFgquLnL59akA2PflFpeQG9L01VFg90wS",
    max: 100,
  },
  {
    name: "popular-music-videos",
    id: "PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
    max: 200,
  },
  {
    name: "top-hits-this-week",
    id: "PLw-VjHDlEOgvWPpRBs9FRGgJcKpDimTqf",
    max: 130,
  },
];

const app = {
  playlist: {},
  index: null,
  baseURL: "https://www.youtube.com/embed/?list={0}&index={1}",
  queryStrings:
    "&amp;t=15&amp;wmode=transparent&amp;autoplay=1&amp;rel=0&amp;showinfo=0&amp;iv_load_policy=3&amp;showsearch=0&amp;autohide=1&amp;controls=1&amp;wadsworth=1",
  iframeSrc: "",
};

String.prototype.format = function () {
  let string = this;
  for (let i = 0; i < arguments.length; i++) {
    const regexp = new RegExp("\\{" + i + "\\}", "gi");
    string = string.replace(regexp, arguments[i]);
  }

  return string;
};

function generateRandom(num) {
  return Math.floor(Math.random() * num);
}

function getPlaylist() {
  const loc = generateRandom(playlists.length);
  return playlists[loc];
}

function getEmbedMusicVideoUrl() {
  const playlist = getPlaylist();
  const index = generateRandom(playlist.max);

  return app.baseURL.format(playlist.id, index) + app.queryStrings;
}

async function getMainSiteYoutubeMusicVideoUrl(embedUrl) {
  if (embedUrl == null) {
    throw new Error("embedUrl is null");
  }
  const res = await fetch(embedUrl);
  const txt = await res.text();

  const realUrlStartIdx = txt.indexOf("https://www.youtube.com/watch?v=");
  if (realUrlStartIdx === -1) {
    return embedUrl;
  }

  const realUrlEndIdx = txt.indexOf('"', realUrlStartIdx);
  if (realUrlEndIdx === -1) {
    return embedUrl;
  }

  return txt.substring(realUrlStartIdx, realUrlEndIdx);
}

async function getRandomMusicVideoUrl() {
  const embedUrl = getEmbedMusicVideoUrl();
  const mainUrl = await getMainSiteYoutubeMusicVideoUrl(embedUrl);
  return mainUrl;
}

module.exports = {
  getRandomMusicVideoUrl,
};
