import {createVNode, defineComponent, reactive, render} from 'vue'
import { ElButton, ElDialog, ElInput } from "element-plus"

const DialogComponent = defineComponent({
    props: {
        option: {
            type: Object
        }
    },
    setup(props, ctx) {
        console.log(props)
        const state = reactive({
            isShow: false,
            option: props.option // 用户给组件的属性
        })
        ctx.expose({
            showDialog(option) {
                state.option = option
                state.isShow = true
            }
        })
        const onCancel = () => {
            state.isShow = false
        }
        const onConfirm = () => {
            state.isShow = false
            state.option.onConfirm && state.option.onConfirm(state.option.content)
        }
        return () => {
            return <ElDialog v-model={ state.isShow } title={ state.option.title }>
                {{
                    default: ()=>
                        <ElInput
                            type="textarea"
                            v-model={ state.option.content }
                            rows={10}
                        >
                        </ElInput>
                    ,
                    footer: ()=> state.option.footer &&
                        <div>
                            <ElButton onclick={ onCancel }>取消</ElButton>
                            <ElButton type="primary" onclick={ onConfirm }>确定</ElButton>
                        </div>
                    ,
                }}
            </ElDialog>
        }
    }
})

let vm;
export function $dialog(option) {
    // element-plus中有el-dialog组件
    // 手动挂载组件 new SubComponent.$mount()
    if (!vm) {
        let el = document.createElement('div')
        vm = createVNode(DialogComponent, { option }) // 将组件渲染成虚拟节点
        // 这里需要将el渲染到页面中
        document.body.appendChild((render(vm, el), el))
    }
    // 将组件渲染到这个el元素上
    let { showDialog } = vm.component.exposed
    showDialog(option)
}