import { defineComponent, computed, inject, ref, onUpdated } from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
import deepcopy from "deepcopy";
import useMenuDragger from './useMenuDragger'
import useFocus from './useFocus'
import useBlockDragger from './useBlockDragger'

export default defineComponent({
    emits: ['update:modelValue'],
    props: {
      modelValue: {
          type: Object
      }
    },
    components: { EditorBlock },
    setup: function (props, ctx) {
        const data = computed({
            get() {
                return props.modelValue
            },
            set(newValue) {
                ctx.emit('update:modelValue', deepcopy(newValue))
            }
        })
        const containerStyles = computed(() => {
            return {
                width: data.value.container.width + "px",
                height: data.value.container.height + "px"
            }
        })

        const config = inject('config')

        const containerRef = ref(null)

        // 实现菜单的拖放功能
        const { dragstart, dragend } = useMenuDragger(containerRef, data)

        // 实现内容区组件选中
        const { blockMousedown,  containerMousedown, focusData, lastSelectBlock } = useFocus(data, (e) => {
            mousedown(e)
        })

        // 绑定鼠标移动事件，记录鼠标移动前鼠标与已选中组件的相对浏览器左上角的坐标位置
        const { mousedown, markLine } = useBlockDragger(focusData, lastSelectBlock, data)

        return () => <div className="editor">
            <div className="editor-left">
                {/*根据注册列表渲染内容*/}
                { config.componentList.map(component => (
                    <div
                        className="editor-left-item"
                        draggable
                        onDragstart={ e => dragstart(e, component) }
                        onDragend={ dragend }
                    >
                        <span>{ component.label }</span>
                        <div>{ component.preview() }</div>
                    </div>
                )) }
            </div>
            <div className="editor-top">菜单栏</div>
            <div className="editor-right">属性控制栏目</div>
            <div className="editor-container">
                {/*负责产生滚动条*/}
                <div className="editor-container-canvas">
                    {/*产生内容区域*/}
                    <div
                        className="editor-container-canvas__content"
                        style={ containerStyles.value }
                        ref={ containerRef }
                        onMousedown={ containerMousedown }
                    >
                        {
                            data.value.blocks.map((block, index) => (
                                <EditorBlock
                                    block={ block }
                                    onMousedown={ e => blockMousedown(e, block, index) }
                                >

                                </EditorBlock>
                            ))
                        }
                        <div className="line-y" style={{top: markLine.y + 'px'}}></div>
                        <div className="line-x" style={{left: markLine.x + 'px'}}></div>
                    </div>
                </div>
            </div>
        </div>
    }
})