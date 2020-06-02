import React from "react";
import './Alert.css'
import axios from "./api";

export default class GoogleSheetAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetId: '',
            range: ''
        }
    }

    handleInputAnswer = (e) => {
        if (e.target.name === 'sheetId'){
            this.setState({
                sheetId: e.target.value
            })
        }
        else if (e.target.name === 'range'){
            this.setState({
                range: e.target.value
            })
        }
    }

    execute = () => {
        axios.post('/api/google_sheet/', {
            sheet_id: this.state.sheetId,
            range: this.state.range
        }, {
            headers: {
                topic: this.props.topicId
            }
        });
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
                            <span>Введите id таблицы</span>
                            <div className={'input'}>
                                <input type={'text'} value={this.state.sheetId} name={'sheetId'}
                                       autoComplete={'off'}
                                       onChange={this.handleInputAnswer}/>
                            </div>
                            <span>Введите диапазон ячеек</span>
                            <div className={'input'}>
                                <input type={'text'} value={this.state.range} name={'range'}
                                       autoComplete={'off'}
                                       onChange={this.handleInputAnswer}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <button className={'button'} style={{width: '100px', height: '20px'}}
                                onClick={() => {
                                    this.execute();
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