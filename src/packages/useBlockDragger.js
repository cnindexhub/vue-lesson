/* 实现拖拽多个元素的功能 */
import { reactive } from 'vue'
/**
 * 实现拖拽多个元素的功能
 * @param focusData 内容区选中和未选中block
 * @param lastSelectBlock 最后一个选中的block
 * @param data json
 * @returns {{mousedown: mousedown}}
 */
export default function (focusData, lastSelectBlock, data) {

    // 组件拖拽前的状态管理
    let dragState = {}

    const markLine = reactive({x: 0, y: 0})

    // 实现拖拽多个元素的功能
    const mousedown = (e) => {
        // 最后被选中组件的 (x, y) 坐标
        const { width: bWidth, height: bHeight } = lastSelectBlock.value

        const lines = { x: [], y: [] }

        dragState = {
            startY: e.clientY,
            startX: e.clientX,
            dragStartLeft: lastSelectBlock.value.left,
            dragStartTop: lastSelectBlock.value.top,
            startPos: focusData.value.focus.map(({ left, top }) => ({ left, top })),
            lines: (() => {
                [...focusData.value.unFocused, {
                    width: data.value.container.width,
                    height: data.value.container.height,
                    left: 0,
                    top: 0
                }].forEach( ({ left: aLeft, top: aTop, width: aWidth, height: aHeight} ) => {
                    // 横轴辅助线的坐标
                    // 顶对顶
                    lines.y.push({ showTop: aTop, top: aTop })
                    // 中对中
                    lines.y.push({ showTop: aTop + aHeight / 2, top: aTop + aHeight / 2 - bHeight / 2 })
                    // 底对顶
                    lines.y.push({ showTop: aTop, top: aTop - bHeight })
                    // 顶对底
                    lines.y.push({ showTop: aTop + aHeight, top: aTop + aHeight })
                    // 底对底
                    lines.y.push({ showTop: aTop + aHeight, top: aTop + aHeight - bHeight })
                    // y轴辅助线的坐标
                    // 左对左
                    lines.x.push({ showLeft: aLeft, left: aLeft })
                    // 中对中
                    lines.x.push({ showLeft: aLeft + aWidth / 2, left: aLeft + aWidth / 2 - bWidth / 2 })
                    // 右对右
                    lines.x.push({ showLeft: aLeft + aWidth, left: aLeft + aWidth - bWidth })
                    // 右对左
                    lines.x.push({ showLeft: aLeft, left: aLeft + bWidth })
                    // 左对右
                    lines.x.push({ showLeft: aLeft + aWidth, left: aLeft + aWidth })
                })
                return lines
            })() // 生成所有的线
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }
    const mousemove = (e) => {
        let { clientX: moveX, clientY: moveY } = e
        let top = moveY - dragState.startY + dragState.dragStartTop
        let left = moveX - dragState.startX + dragState.dragStartLeft
        let x,y = 0
        for(let i = 0; i < dragState.lines.y.length; i++) {
            const { showTop: s, top: t} = dragState.lines.y[i]
            if (Math.abs(t - top) < 5) {
                y = s
                moveY = dragState.startY - dragState.dragStartTop + t
                break
            }
        }
        for(let i = 0; i < dragState.lines.x.length; i++) {
            const { showLeft: s, left: l} = dragState.lines.x[i]
            if (Math.abs(l - left) < 5) {
                x = s
                moveX = dragState.startX - dragState.dragStartLeft + l
                break
            }
        }
        const durX = moveX - dragState.startX
        const durY = moveY - dragState.startY
        focusData.value.focus.forEach((block, index) => {
            block.top = durY + dragState.startPos[index].top
            block.left = durX + dragState.startPos[index].left
        })
        markLine.y = y
        markLine.x = x
    }
    const mouseup = (e) => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
        markLine.y = 0
        markLine.x = 0
    }

    return { mousedown, markLine }
}