import { defineComponent, computed, inject } from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
export default defineComponent({
    props: {
      modelValue: {
          type: Object
      }
    },
    components: { EditorBlock },
    setup: function (props) {
        const data = computed(() => {
            return props.modelValue
        })
        const containerStyles = computed(() => {
            return {
                width: data.value.container.width + "px",
                height: data.value.container.height + "px"
            }
        })

        const config = inject('config')

        return () => <div class="editor">
            <div class="editor-left">
                {/*根据注册列表渲染内容*/}
                {config.componentList.map(component => (
                    <div className="editor-left-item">
                        <span>{ component.label }</span>
                        <div>{ component.preview() }</div>
                    </div>
                ))}
            </div>
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性控制栏目</div>
            <div class="editor-container">
                {/*负责产生滚动条*/}
                <div class="editor-container-canvas">
                    {/*产生内容区域*/}
                    <div class="editor-container-canvas__content" style={containerStyles.value}>
                        {
                            data.value.blocks.map(block => <EditorBlock block={block}></EditorBlock>)
                        }
                    </div>
                </div>
            </div>
        </div>
    }
})