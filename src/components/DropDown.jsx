import { provide, inject, computed, createVNode, defineComponent, onBeforeUnmount, onMounted, reactive, ref, render} from 'vue'

export const DropdownItem = defineComponent({
    props: {
        label: String,
        icon: String
    },
    setup(props, ctx) {
        let { icon, label } = props
        const hide = inject('hide')
        return () => <div class="dropdown-item" onClick={ hide }>
            <i class={ icon }></i>
            <span>{ label }</span>
        </div>
    }
})

const DropDownComponent = defineComponent({
    props: {
        option: {
            type: Object
        }
    },
    setup(props, ctx) {

        const state = reactive({
            isShow: false,
            option: props.option,
            left: 0,
            top: 0
        })

        ctx.expose({
            showDropDown(option) {
                state.option = option
                state.isShow = true
                const { right, top } = option.el.getBoundingClientRect()
                state.top = top
                state.left = right
            }
        })

        // 提供隐藏方法供子组件用
        provide('hide', () => {
            state.isShow = false
        }, false)

        const classes = computed(() => ['dropdown',
            {
                'dropdown-isShow': state.isShow
            }
        ])

        const styles = computed(() => ({
            top: `${state.top}px`,
            left: `${state.left}px`
        }))

        const el = ref(null)
        const onMousedownDocument = (e) => {
            if (!el.value.contains(e.target)) { // 如果点击的是dropdown内部 什么都不做
                state.isShow = false
            }
        }

        onMounted(() => {
            // 事件的传递行为是先捕获 在冒泡
            // 之前为了阻止事件传播 我们给block 都增加的stopPropagation
            document.body.addEventListener('mousedown', onMousedownDocument, true)
        })

        onBeforeUnmount(() => {
            document.body.removeEventListener('mousedown', onMousedownDocument, true)
        })

        return () => {
            return <div
                class={ classes.value }
                style={ styles.value }
                ref={ el }
            >
                { state.option.content() }
            </div>
        }
    }
})

let vm;
export function $dropdown(option) {
    // element-plus中有el-dialog组件
    // 手动挂载组件 new SubComponent.$mount()
    if (!vm) {
        let el = document.createElement('div')
        vm = createVNode(DropDownComponent, { option }) // 将组件渲染成虚拟节点
        // 这里需要将el渲染到页面中
        document.body.appendChild((render(vm, el), el))
    }
    const { showDropDown } = vm.component.exposed
    showDropDown(option)
}