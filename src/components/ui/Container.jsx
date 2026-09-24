import React from 'react'
import { cn } from '../../shared/utils/cn'

const Container = ({className, children}) => {
  return (
    <div className={cn('w-full px-7 desktop:px-4', className)}>
      {children}
    </div>
  )
}

export default Container
