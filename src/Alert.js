import React from "react";
import './Alert.css'
import axios from './api'

export default class Alert extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            topicName: ''
        }
    }

    onTopicNameChange = (event) => {
        this.setState({
            topicName: event.target.value
        })
    }

    onButtonClick = () => {
        axios.post('/api/topics/?format=json', {
            name: this.state.topicName
        }).then(() => {
            this.props.onClose();
            console.log(this.props.loadItems)
            this.props.loadItems();
        })
    }

    render() {
        return <div className={'alert-canvas'} onClick={this.props.onClose}>
            <div className={'alert'} onClick={(e) => {e.stopPropagation()}}>
                <div className={'alert-top-bar'} style={{width: '100%'}}>
                    <div style={{cursor: "pointer"}} onClick={(e) => {
                        e.stopPropagation();
                        this.props.onClose()
                    }}>
                        X
                    </div>
                </div>
                <div className={'alert-content'} style={{width: '100%', paddingTop: '15px', paddingBottom: '15px'}}>
                    <div>
                        <div style={{paddingBottom: '10px'}}>
                            Введите название раздела
                        </div>
                        <div className={'input'}>
                            <input type={'text'} value={this.state.topicName} onChange={this.onTopicNameChange}/>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <button className={'button'} style={{width: '100px', height: '20px'}} onClick={this.onButtonClick}>Подтвердить</button>
                    </div>
                </div>
            </div>
        </div>
    }
}