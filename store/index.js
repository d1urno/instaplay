// States
export const state = () => ({
  playIndex: -1,
  isPlaying: true,
  isMuted: true,
  playIntent: false,
  progress: 0,
  playPosition: 0
})

// mutations
export const mutations = {
  SET_PLAY_INDEX(state, playIndex) {
    state.playIndex = playIndex
  },
  SET_PLAYING(state, isPLaying) {
    state.isPlaying = isPLaying
  },
  SET_MUTED(state, isMuted) {
    state.isMuted = isMuted
  },
  SET_PLAY_INTENT(state, playIntent) {
    state.playIntent = playIntent
  },
  SET_PROGRESS(state, progress) {
    state.progress = progress
  },
  SET_PLAY_POSITION(state, playPosition) {
    state.playPosition = playPosition
  }
}

// actions
export const actions = {
  setPlayIndex({ commit }, playIndex) {
    commit('SET_PLAY_INDEX', playIndex)
  },
  setPlaying({ commit }, isPlaying) {
    commit('SET_PLAYING', isPlaying)
  },
  setMuted({ commit }, isMuted) {
    commit('SET_MUTED', isMuted)
  },
  setPlayIntent({ commit }, playIntent) {
    commit('SET_PLAY_INTENT', playIntent)
  },
  setProgress({ commit }, progress) {
    commit('SET_PROGRESS', progress)
  },
  setPlayPosition({ commit }, playPosition) {
    commit('SET_PLAY_POSITION', playPosition)
  }
}

// Getters
export const getters = {
  playIndex: (state) => state.playIndex,
  isPlaying: (state) => state.isPlaying,
  isMuted: (state) => state.isMuted,
  playIntent: (state) => state.playIntent,
  progress: (state) => state.progress,
  playPosition: (state) => state.playPosition
}
