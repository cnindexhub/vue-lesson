import { defineComponent, computed, inject } from 'vue'
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
        console.log(config)
        return ()=> {
            // 通过block的key属性直接获取对于的组件
            const component = config.componentMap[props.block.key]
            const componentRender = component.render()
            return <div class="editor-block" style={blockStyles.value}>
                { componentRender }
            </div>
        }
    }
})