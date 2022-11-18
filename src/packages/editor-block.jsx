import { defineComponent, computed, inject, ref, onMounted} from 'vue'
import './editor-block.scss'

export default defineComponent({
    name: 'EditorBlock',
    props: {
        block: Object
    },
    setup(props) {

        const blockStyles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}px`
        }))
        const config = inject('config') // 注入一个由祖先组件或整个应用 (通过 app.provide()) 提供的值。

        // 当前组件dom的引用
        const blockRef = ref(null)

        onMounted(() => {
            let {offsetWidth, offsetHeight} = blockRef.value
            if (props.block.alignCenter) {
                props.block.left = props.block.left - offsetWidth / 2
                props.block.top = props.block.top - offsetHeight / 2
                props.block.alignCenter = false
            }
            props.block.width = offsetWidth
            props.block.height = offsetHeight
        })

        return ()=> {
            // 通过block的key属性直接获取对于的组件
            const component = config.componentMap[props.block.key]
            const componentRender = component.render()
            return <div class="editor-block"
                        class={props.block.focus ? "editor-block__focus" : ""}
                        style={blockStyles.value}
                        ref={ blockRef }
                   >
                { componentRender }
            </div>
        }
    }
})