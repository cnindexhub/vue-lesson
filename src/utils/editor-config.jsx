// 列表区可以显示所有的物料
// key对于的组件映射关系
import {ElButton, ElInput, ElOption, ElSelect} from 'element-plus'
import Range from '@/components/Range'
function createEditorConfig () {
    const componentList = []
    const componentMap = {}

    return {
        componentMap,
        componentList,
        register: (component) => {
            componentList.push(component)
            componentMap[component.key] = component
        }
    }
}

export let registerConfig = createEditorConfig()
const createInputProps = (label) => ({ type: 'input', label })
const createColorProps = (label) => ({ type: 'color', label })
const createSelectProps = (label, options) => ({ type: 'select', label,options })
const createTableProps = (label, table) => ({ type: 'table', label, table })

registerConfig.register({
    label: '下拉框',
    preview: ()=> <ElSelect placeholder={ '预览下拉框' }></ElSelect>,
    render: ({ props, model })=> {
        return <ElSelect placeholder={ '渲染下拉框' } {...model.default}>
            { (props.options || []).map((option, index) => {
                return <ElOption
                    label={ option.label }
                    value={ option.value }
                    key={ index }
                ></ElOption>
            }) }
        </ElSelect>
    },
    key: 'select',
    props: {
        options: createTableProps('下拉框', {
            options: [
                { label: '显示值', field: 'label'},
                { label: '绑定值', field: 'value'},
            ],
            key: 'label'
        }),
    },
    model: {
        default: '绑定字段'
    }
})

registerConfig.register({
    label: '文本',
    preview: () => '预览的文本',
    render: ({ props }) => <span style={ { color: props.color, fontSize: props.size } }>
            { props.text || '渲染文本' }
        </span>,
    key: 'text',
    props: {
        text: createInputProps("文本内容"),
        color: createColorProps("字体颜色"),
        size: createSelectProps("字体大小", [
            { 'label': '14px', value: '14px' },
            { 'label': '20px', value: '20px' },
            { 'label': '24px', value: '24px' },
        ]),
    }
})

registerConfig.register({
    label: '按钮',
    resize: {
        width: true,
        height: true
    },
    preview: () => <ElButton>预览按钮</ElButton>,
    render: ({ props }) => <ElButton type={ props.type } size={ props.size }> { props.text || '渲染按钮' } </ElButton>,
    key: 'button',
    props: {
        text: createInputProps("按钮内容"),
        type: createSelectProps("按钮类型", [
            { label: '基础', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '文本', value: 'text' },
        ]),
        size: createSelectProps('按钮尺寸', [
            { label: '默认', value: '' },
            { label: '中等', value: 'medium' },
            { label: '小', value: 'small' },
            { label: '极小', value: 'mini' },
        ])
    }
})

registerConfig.register({
    label: '输入框',
    preview: () => <ElInput placeholder="预览输入框"></ElInput>,
    render: ({ props, model }) =>
    <ElInput
        type={ props.type }
        size={ props.size }
        { ...model.default }
        placeholder={ props.text || '渲染输入框' }
    ></ElInput>,
    key: 'input',
    model: { // {default: 'username'}
      default: '绑定字段'
    }
})

registerConfig.register({
    label: '范围选择器',
    preview: () => <Range placeholder="预览输入框"></Range>,
    render: ({ model }) => <Range
        {...{
            start: model.start.modelValue,
            'onUpdate:start': model.start['onUpdate:modelValue'],
            end: model.end.modelValue,
            'onUpdate:end': model.end['onUpdate:modelValue'],
        }}
        placeholder="预览输入框"
    ></Range>,
    key: 'range',
    model: { // {default: 'username'}
      start: '开始范围字段',
      end: '开始范围字段',
    }
})