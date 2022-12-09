import {defineComponent, inject, reactive, watch} from 'vue'
import {ElButton, ElForm, ElFormItem, ElInputNumber, ElInput, ElColorPicker, ElSelect, ElOption} from "element-plus";
import deepcopy from "deepcopy";
import TableEditor from "@/components/table-editor";
export default defineComponent({
    props: {
        block: { type: Object },
        data: { type: Object },
        updateBlock: { type: Function },
        updateContainer: { type: Function }
    },
    setup(props) {
        console.log(props)
        const config = inject('config') // 组件的配置信息
        const state = reactive({
            editData: {}
        })
        const reset = () => {
            if (!props.block) { // 说明要绑定的是容器的宽度和高度
                state.editData = deepcopy(props.data.container)
            } else {
                state.editData = deepcopy(props.block)
            }
        }
        const apply = ()=> {
            if (!props.block) {
                props.updateContainer({ ...props.data, container: state.editData })
            } else {
                props.updateBlock(props.block, state.editData)
            }
        }
        watch(() => props.block, reset, { immediate: true })
        return () => {
            let content = []
            if (!props.block) {
                content.push(<>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber v-model={state.editData.width}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={state.editData.height}></ElInputNumber>
                    </ElFormItem>
                </>)
            } else {
                let component = config.componentMap[props.block.key]
                if (component && component.props) {
                    content.push(Object.entries(component.props).map(([propName, propConfig]) => {
                        return <ElFormItem label={ propConfig.label }>
                            {{
                                input: () => <ElInput v-model={ state.editData.props[propName] }></ElInput>,
                                color: () => <ElColorPicker v-model={ state.editData.props[propName] }></ElColorPicker>,
                                select: () => <ElSelect v-model={ state.editData.props[propName] }>
                                    {
                                        propConfig.options.map(opt => {
                                            return <ElOption label={ opt.label } value={ opt.value }>
                                            </ElOption>
                                        })
                                    }
                                </ElSelect>,
                                table: ()=> <TableEditor
                                    propsConfig={ propConfig }
                                    v-model={ state.editData.props[propName] }
                                >

                                </TableEditor>
                            }[propConfig.type]()}
                        </ElFormItem>
                    }))
                }

                if (component && component.model) {
                    content.push(Object.entries(component.model).map(([ modelName, label ]) => {
                        return <ElFormItem label={ label }>
                            <ElInput v-model={ state.editData.model[modelName] }></ElInput>
                        </ElFormItem>
                    }))
                }
            }

            return <ElForm labelPosition="top" style="padding: 30px;">
                    { content }
                    <ElFormItem>
                        <ElButton type="primary" onClick={ apply }>应用</ElButton>
                        <ElButton onClick={ reset }>重置</ElButton>
                    </ElFormItem>
                </ElForm>
            }
        }
})