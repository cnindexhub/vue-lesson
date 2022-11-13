import { defineComponent } from "vue";
import './editor.scss'
export default defineComponent({
    props: {
      data: Object
    },
    setup(props) {
        console.log(props.data)
        return () => <div class="editor">
            <div class="editor-left">左侧物料区</div>
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性控制栏目</div>
            <div class="editor-container">
                {/*负责产生滚动条*/}
                <div class="editor-container-canvas"></div>
                    {/*产生内容区域*/}
                <div class="editor-container-canvas__content">
                    内容区
                </div>
            </div>
        </div>
    }
})