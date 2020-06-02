import React from "react";
import './Drawer.css'

export default class Drawer extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'drawer-canvas'} onClick={this.props.closeDrawer}>
                <div className={'drawer'}>
                    <div className={'content'}>
                        {this.props.items.map((elem, index) => {
                            return <div
                                        className={'drawer-item' + (this.props.currentItem && elem.id === this.props.currentItem.id ? ' current' : '')}
                                       onClick={(e) => {
                                           e.stopPropagation();
                                           this.props.setCurrentItem(elem);
                                           this.props.closeDrawer()
                                       }}>{elem.name}</div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}