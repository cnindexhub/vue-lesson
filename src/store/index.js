import { createStore } from 'vuex'

const state = {
    blocks: [
        {'top': 100, 'left':  100, 'zIndex': 1, 'key':  'text'},
        {'top': 200, 'left':  200, 'zIndex': 1, 'key':  "button"},
        {'top': 300, 'left':  300, 'zIndex': 1, 'key':  "input"}
    ]
}

const getters = {

}

const actions = {

}

const mutations = {

}


const store = createStore({
    state,
    getters,
    actions,
    mutations
})

export { store }