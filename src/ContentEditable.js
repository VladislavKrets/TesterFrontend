import * as React from "react";
import ReactDOM from "react-dom";

export default class ContentEditable extends React.Component {
    render() {
        return <div
            onPaste={this.props.onPaste}
            className={this.props.className ? this.props.className + ' remove-scroll-bars' : 'remove-scroll-bars'}
            onInput={this.emitChange}
            onBlur={this.emitChange}
            placeholder={this.props.placeholder}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}
            style={{...this.props.style, overflow: 'scroll'}}
        />;
    }

    shouldComponentUpdate = (nextProps) => {
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    }

    emitChange = () => {
        let html = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {

            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
}