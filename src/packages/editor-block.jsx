import { defineComponent, computed, inject, ref, onMounted} from 'vue'
import BlockResize from '@/packages/block-resize'
import './editor-block.scss'

export default defineComponent({
    name: 'EditorBlock',
    props: {
        block: { type: Object },
        formData: { type: Object }
    },
    setup: function (props) {

        const blockStyles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}`
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

        return () => {
            // 通过block的key属性直接获取对于的组件
            const component = config.componentMap[props.block.key]
            const componentRender = component.render({
                size:  props.block.hasResize ? { width: props.block.width, height: props.block.height } : {} ,
                props: props.block.props,
                model: Object.keys(component.model || {}).reduce((prev, modelName) => {
                    let propName = props.block.model[modelName];

                    prev[modelName] = {
                        modelValue: props.formData[propName],
                        "onUpdate:modelValue": v => props.formData[propName] = v
                    }

                    return prev
                }, {})
            })
            const { width, height} = component.resize || {}
            console.log(component)
            console.log(props.block.focus)
            return <div class="editor-block"
                        class={props.block.focus ? "editor-block__focus" : ""}
                        style={blockStyles.value}
                        ref={blockRef}
            >
                { componentRender }
                {/*传递block的目的是为了修改当前block的宽高,component中存放了修改高度还是宽度*/}
                { props.block.focus && (width || height) && <BlockResize
                    block={ props.block }
                    component={ component }
                ></BlockResize>}
            </div>
        }
    }
})