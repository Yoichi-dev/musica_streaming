const constants = {
  url: {
    main: "https://yoichiro-api-v1.site:61808",
    sub: "https://showroom-app-api.herokuapp.com",
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
    }
  },
  ws: "wss://online.showroom-live.com",
  ytws: "wss://yoichiro-api-v1.site:61808/ws/",
  roomId: 373889,
  roomUrl: '/PianistMusica',
}

module.exports = Object.freeze(constants);