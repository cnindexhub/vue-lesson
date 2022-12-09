/*实现内容区组件选中*/
import { computed, ref } from "vue";

export default function (data, previewRef, callback) {
    // 最后选中的block索引
    const selectBlockIndex = ref(-1)
    // 最后选中的block
    const lastSelectBlock = computed(() => data.value.blocks[selectBlockIndex.value])

    // 将所有block的focus设置为false, 清空选中状态
    const clearBlockFocus = () => {
        data.value.blocks.map(block => block.focus = false)
    }

    // 计算已选中和未选中的block
    const focusData = computed(() => {
        const focus = []
        const unFocused = []
        data.value.blocks.forEach(block => (block.focus ? focus : unFocused).push(block))
        return {
            focus, unFocused
        }
    })

    // 实现获取焦点
    const blockMousedown = (e, block, index) => {
        if (previewRef.value) return
        e.preventDefault()
        e.stopPropagation()
        if (!e.shiftKey) {
            if (!block.focus) {
                // 清空其他已选择的block
                clearBlockFocus()
                block.focus = true
            } // 当前自己已经被选中了，在次点击时还是选中状态
        } else {
            if (focusData.value.focus.length === 1) block.focus = true
            else block.focus = !block.focus
        }
        selectBlockIndex.value = index
        callback(e)
    }





    // 点击内容区清空block选中状态
    const containerMousedown = (e) => {
        if (previewRef.value) return
        clearBlockFocus()
        selectBlockIndex.value = -1
    }

    return {
        blockMousedown,
        containerMousedown,
        focusData,
        lastSelectBlock,
        clearBlockFocus
    }
}