/* 实现拖拽多个元素的功能 */
import { reactive } from 'vue'
/**
 * 实现拖拽多个元素的功能
 * @param focusData 内容区选中和未选中block
 * @param lastSelectBlock 最后一个选中的block
 * @returns {{mousedown: mousedown}}
 */
export default function (focusData, lastSelectBlock) {

    // 组件拖拽前的状态管理
    let dragState = {}

    const markLine = reactive({x: 0, y: 0})

    // 实现拖拽多个元素的功能
    const mousedown = (e) => {
        // 最后被选中组件的 (x, y) 坐标
        const { left: bLeft, top: bTop, width: bWidth, height: bHeight } = lastSelectBlock.value

        const lines = { x: [], y: [] }

        dragState = {
            startY: e.clientY,
            startX: e.clientX,
            startPos: focusData.value.focus.map(({ left, top }) => ({ left, top })),
            lines: (() => {
                [...focusData.value.unFocused, {
                    width: 0,
                    height: 0,
                    left: 0,
                    top: 0
                }].forEach( ({ left: aLeft, top: aTop, width: aWidth, height: aHeight} ) => {
                    // x轴辅助线的坐标
                    // 顶对顶
                    lines.x.push({showTop: aTop, top: aTop})
                    // 中对中
                    lines.x.push({showTop: aTop + aHeight / 2, top: aTop + aHeight / 2 - bHeight / 2})
                    // 底对顶
                    lines.x.push({showTop: aTop, top: aTop - bHeight})
                    // 顶对底
                    lines.x.push({showTop: aTop + aHeight, top: aTop + aHeight})
                    // 底对底
                    lines.x.push({showTop: aTop + aHeight, top: aTop + aHeight - bHeight})
                    // y轴辅助线的坐标
                    // 左对左
                    // 中对中
                    // 右对右
                    // 右对左
                    // 左对右
                })
                return lines
            })() // 生成所有的线
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }
    const mousemove = (e) => {
        console.log(dragState.lines)
        let { clientX: moveX, clientY: moveY } = e
        let x,y = null;
        for(let i = 0; i < dragState.lines.x.length; i++) {
            if (dragState.lines.x[i].top === moveX) {
                y = dragState.lines.x[i].top
                break;
            }
        }
        const durX = moveX - dragState.startX
        const durY = moveY - dragState.startY
        focusData.value.focus.forEach((block, index) => {
            block.top = durY + dragState.startPos[index].top
            block.left = durX + dragState.startPos[index].left
        })
        markLine.y = y
    }
    const mouseup = (e) => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
    }

    return { mousedown, markLine }
}