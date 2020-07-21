import React from 'react'
import { useDrop } from 'react-dnd'

export default function DropContainer(){
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'category',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }
  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </div>
  )
}