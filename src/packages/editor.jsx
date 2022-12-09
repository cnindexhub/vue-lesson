import { defineComponent, computed, inject, ref } from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
import deepcopy from "deepcopy";
import useMenuDragger from './useMenuDragger'
import useFocus from './useFocus'
import useBlockDragger from './useBlockDragger'
import { useCommand } from './useCommand'
import { $dialog } from "@/components/Dialog";
import { ElButton } from "element-plus";
import { $dropdown, DropdownItem } from "@/components/DropDown"
import EditorOperator from "@/packages/editor-operator"

export default defineComponent({
    emits: ['update:modelValue'],
    props: {
        modelValue: {
          type: Object
        },
        formData: {
              type: Object
        }
    },
    components: { EditorBlock },
    setup: function (props, ctx) {
        // 预览的时候 内容不能在操作了 可以点击 输入内容 方法看效果
        const previewRef = ref(false)
        const editorRef = ref(true)

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
        const {
            blockMousedown,
            containerMousedown,
            focusData,
            lastSelectBlock,
            clearBlockFocus
        } = useFocus(data, previewRef, (e) => {
            mousedown(e)
        })

        // 绑定鼠标移动事件，记录鼠标移动前鼠标与已选中组件的相对浏览器左上角的坐标位置
        const { mousedown, markLine } = useBlockDragger(focusData, lastSelectBlock, data)

        const { commands } = useCommand(data, focusData); // 获取所有快捷命令

        const buttons = [
            { label: '撤销', icon: 'icon-back', handler: ()=>  commands.undo() },
            { label: '重做', icon: 'icon-reset', handler: ()=> commands.redo() },
            { label: '导出', icon: 'icon-export', handler: ()=> {
                    $dialog({
                        title: '导出json使用',
                        content: JSON.stringify(data.value)
                    })
                }
            },
            { label: '导入', icon: 'icon-import', handler: ()=> {
                    $dialog({
                        title: '导出json使用',
                        content: '',
                        footer: true,
                        onConfirm: (text) => {
                            commands.updateContainer(JSON.parse(text))
                        }
                    })
                }
            },
            { label: '置顶', icon: 'icon-place-top', handler: ()=> commands.placeTop() },
            { label: '置底', icon: 'icon-place-bottom', handler: ()=> commands.placeBottom() },
            { label: '删除', icon: 'icon-delete', handler: ()=> commands.delete() },
            {
                label: () => previewRef.value ? '编辑' : '预览',
                icon: () => previewRef.value ? 'icon-edit' : 'icon-browse',
                handler: ()=> {
                    previewRef.value = !previewRef.value
                    if (previewRef.value) clearBlockFocus()
                }
            },
            {
                label: '关闭',
                icon: 'icon-close',
                handler: ()=> {
                    editorRef.value = false
                    if (editorRef.value) clearBlockFocus()
                }
            },
        ]

        const onContextMenuBlock = (e, block) => {
            e.preventDefault()
            $dropdown({
                el: e.target, // 以那个元素为准定位组件
                content: () => {
                    return <>
                        <DropdownItem label="删除" icon="icon-delete" onClick={() => commands.delete()}></DropdownItem>
                        <DropdownItem label="置顶" icon="icon-place-top" onClick={() => commands.placeTop()}></DropdownItem>
                        <DropdownItem label="置底" icon="icon-place-bottom" onClick={() => commands.placeBottom()}></DropdownItem>
                        <DropdownItem label="查看" icon="icon-browse" onClick={()=> {
                            $dialog({
                                title: '查询组件数据',
                                content: JSON.stringify(block)
                            })
                        }}
                        ></DropdownItem>
                        <DropdownItem label="导入" icon="icon-import" onClick={() => {
                            $dialog({
                                title: '导入组件数据',
                                content: JSON.stringify(block),
                                footer: true,
                                onConfirm: (newBlock)=> {
                                    newBlock = JSON.parse(newBlock)
                                    commands.updateBlock(block, newBlock)
                                }
                            })
                        }}></DropdownItem>
                    </>
                }
            })
        }

        return () => !editorRef.value ?
        <>
            <div
                class="editor-container-canvas__content"
                style={containerStyles.value}
                style='margin: 0;'
                ref={containerRef}
            >
                {
                    data.value.blocks.map((block) => (
                        <EditorBlock
                            block={ block }
                            class='editor-block-preview'
                            formData={props.formData}
                        >

                        </EditorBlock>
                    ))
                }
            </div>
            <div>
                <ElButton type="primary" onClick={ () => editorRef.value = true }>继续编辑</ElButton>
                { JSON.stringify(props.formData) }
            </div>
        </> :
        <div class="editor">
            <div class="editor-left">
                {/*根据注册列表渲染内容*/}
                { config.componentList.map(component => (
                    <div
                        class="editor-left-item"
                        draggable
                        onDragstart={ e => dragstart(e, component) }
                        onDragend={ dragend }
                    >
                        <span>{ component.label }</span>
                        <div>{ component.preview() }</div>
                    </div>
                )) }
            </div>
            {/*按钮区域*/}
            <div class="editor-top">
                {
                    buttons.map( btn => {
                        const icon = typeof btn.icon === 'function' ? btn.icon() : btn.icon
                        const label = typeof btn.label === 'function' ? btn.label() : btn.label
                        return <div
                            class="editor-top__button"
                            onClick={ btn.handler }
                        >
                            <i class={ icon }></i>
                            <span>{ label }</span>
                        </div>
                    })
                }
            </div>
            <div class="editor-right">
                <EditorOperator
                    block={ lastSelectBlock.value }
                    data={ data.value }
                    updateContainer={ commands.updateContainer }
                    updateBlock={ commands.updateBlock }
                ></EditorOperator>
            </div>
            <div class="editor-container">
                {/*负责产生滚动条*/}
                <div class="editor-container-canvas">
                    {/*产生内容区域*/}
                    <div
                        class="editor-container-canvas__content"
                        style={ containerStyles.value }
                        ref={ containerRef }
                        onMousedown={ containerMousedown }
                    >
                        {
                            data.value.blocks.map((block, index) => (
                                <EditorBlock
                                    block={ block }
                                    onMousedown={ e => blockMousedown(e, block, index) }
                                    class={previewRef.value ? 'editor-block-preview' : ''}
                                    oncontextmenu={ (e) => onContextMenuBlock(e, block) }
                                    formData={props.formData}
                                >

                                </EditorBlock>
                            ))
                        }
                        <div v-show={ markLine.y } class="line-y" style={{top: markLine.y + 'px'}}></div>
                        <div v-show={ markLine.x } class="line-x" style={{left: markLine.x + 'px'}}></div>
                    </div>
                </div>
            </div>
        </div>
    }
})