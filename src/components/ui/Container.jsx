import React from 'react'
import { cn } from '../../shared/utils/cn'

const Container = ({className, children}) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}

export default Container
