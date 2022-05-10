const constants = {
  url: {
    main: "http://192.168.11.2:3001",
    sub: "http://192.168.11.2:3001",
    search: "other/search?keyword=",
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
      broadcast: "/other/broadcast"
    }
  },
  ws: "wss://online.showroom-live.com",
}

module.exports = Object.freeze(constants);