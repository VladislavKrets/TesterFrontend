import React from "react";
import './Alert.css'

export default class AlertDelete extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={'alert-canvas'} onClick={this.props.onClose}>
            <div className={'alert'} onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className={'alert-top-bar'} style={{width: '100%'}}>
                    <div style={{cursor: "pointer"}} onClick={(e) => {
                        e.stopPropagation();
                        this.props.onClose()
                    }}>
                        X
                    </div>
                </div>
                <div className={'alert-content'}
                     style={{width: '100%', paddingTop: '15px', paddingBottom: '15px'}}>
                    <div>
                        <div style={{paddingBottom: '10px', textAlign: 'center'}}>
                            {this.props.text}
                        </div>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <button className={'button'} style={{width: '100px', height: '20px'}}
                                onClick={() => {
                                    this.props.execute();
                                    this.props.onClose();
                                }}>Подтвердить
                        </button>
                        <button className={'button'}
                                style={{width: '100px', height: '20px', margin: '0 20px'}}
                                onClick={this.props.onClose}>Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}