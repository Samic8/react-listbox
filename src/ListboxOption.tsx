import React, { Component } from "react"
import { ListboxContext } from "./Listbox"
import { generateId } from "./utils"

type Props = {
  children: (({ isActive, isSelected }: { isActive: boolean, isSelected: boolean }) => React.ReactNode | string) | React.ReactNode | string | null,
  className?: string,
  value: string
}

type State = {
  id: string
}

export class ListboxOption extends Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = { id: generateId() }
  }
  
  componentDidMount(): void{
    this.context.registerOptionRef(this.props.value, this.ownRef)
    this.context.registerOptionId(this.props.value, this.state.id)
  }
  
  componentWillUnmount(): void{
    this.context.unregisterOptionId(this.props.value)
    this.context.unregisterOptionRef(this.props.value)
  }
  ownRef: HTMLElement | null = null

  handleClick = (): void => {
    this.context.select(this.props.value)
  }

  handleMouseMove = (): void => {
    if (this.context.activeItem === this.props.value) { return } // this option is already active

    this.context.setActiveItem(this.props.value)
  }

  render(): React.ReactNode{
    const { children, className } = this.props
    const isActive = this.context.activeItem === this.props.value
    const isSelected = this.context.props.value === this.props.value
    return (
      <li
        className={className}
        id={this.state.id}
        onMouseDown={this.handleClick}
        onMouseMove={this.handleMouseMove}
        ref={el => this.ownRef = el}
        tabIndex={-1}
        {...isSelected ? { "aria-selected": true, role: "option" } : {}}
      >
        { children instanceof Function ? children({ isSelected, isActive }) : children }
      </li>
    )
  }
} 

ListboxOption.contextType = ListboxContext
export default null