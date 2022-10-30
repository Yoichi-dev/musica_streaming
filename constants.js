const constants = {
  url: {
    main: "https://pianistmusica.net/yt",
    sub: "https://pianistmusica.net/yt",
    live: {
      onlives: "/live/onlives",
      premium: "/live/premium",
      giftList: "/live/gift_list/",
      stageUserList: "/live/stage_user_list/",
      liveInfo: "/live/live_info/",
      commentLog: "/live/comment_log/",
      giftLog: "/live/gift_log/",
    },
    room: {
      profile: "/room/profile/",
      eventAndSupport: "/room/event_and_support/",
    },
    user: {
      profile: "/users/profile/",
    },
    other: {
      broadcast: "/other/broadcast",
      status: "/other/status",
      search: "/other/search?keyword=",
    },
    youtube: {
      channel: "/youtube/channel/",
      comment: "/youtube/comment"
    }
  },
  ws: "wss://online.showroom-live.com",
  ytws: "wss://pianistmusica.net/ws/",
  roomId: 373889,
  roomUrl: '/PianistMusica',
  channelId: 'UCFdcDkKQJbK76e_1zxYXsDA'
}

module.exports = Object.freeze(constants);