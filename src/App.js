import React from 'react';
import './App.css';
import openDrawer from './icons/open_drawer.svg'
import Drawer from "./Drawer";
import settingsIcon from './icons/settings_icon.svg'
import Admin from "./Admin";
import axios from './api'
import PanelContent from "./PanelContent";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: true,
            currentItem: null,
            drawer: null,
            isAdmin: false,
            content: null,
        }
    }

    setCurrentItem = (item) => {
        const content = <PanelContent
            key={item.id}
            currentItem={item}/>
        this.setState({
            currentItem: item,
            isAdmin: false,
            content: content
        })
    }

    closeDrawer = () => {
        this.setState({
            drawer: null
        })
    }
    loadItemsWithoutChanging = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/topics/?format=json').then(data => {
            this.setState({
                loading: false,
                items: data.data,
            })
        })
    }
    loadItems = () => {
        axios.get('/api/topics/?format=json', {
            headers: {
                'Content-Type': 'text/plain',
            },
        }).then(data => {
            const currentItem = data.data.length > 0 ? data.data[0] : null;
            this.setState({
                items: data.data,
                currentItem: currentItem,
                loading: false,
                content: currentItem ? <PanelContent key={currentItem ? currentItem.id : 0} currentItem={currentItem}/> : null,
            })
        })
    }

    componentDidMount() {
        this.loadItems();
    }

    onTopicDelete = (id) => {
        axios.delete(`/api/topics/${id}/?format=json`).then(() => {
            this.loadItemsWithoutChanging();
        })
    }
    loadQuestions = (itemId) => {
        return axios.get('/api/questions/?format=json', {
            headers: {
                topic: itemId
            }
        });
    }
    addQuestion = (question, itemId) => {
        return axios.post('/api/questions/?format=json', question, {
            headers: {
                topic: itemId
            }
        })
    }

    deleteQuestion = (question, itemId) => {
        return axios.delete(`/api/questions/${question.id}/?format=json`, {
            headers: {
                topic: itemId
            }
        })
    }

    updateQuestion = (question, itemId) => {
        return axios.patch(`/api/questions/${question.id}/?format=json`, question, {
            headers: {
                topic: itemId
            }
        })
    }

    render() {
        return this.state.loading ?
            <div style={{marginTop: '100px', textAlign: 'center'}}>
                <div className="lds-ring">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div> :
            <div className="main">
                <div className={'mobile'}/>
                <div className={"nav-bar"}>
                    <ul className={"nav-list"}>
                        <li className={'nav-item' + (this.state.isAdmin ? ' current' : '')}
                            onClick={() => {
                                this.setState(
                                    {
                                        isAdmin: true,
                                        currentItem: null,
                                        adminContent:  <Admin items={this.state.items}/>
                                    })
                            }}>
                            Админка
                        </li>
                        {this.state.items.map((elem, index) => {
                            return <li key={index}
                                       className={'nav-item' + (this.state.currentItem && elem.id === this.state.currentItem.id ? ' current' : '')}
                                       onClick={() => {
                                           this.setCurrentItem(elem)
                                       }}>{elem.name}</li>
                        })}
                    </ul>

                    <div className={'open-drawer'}
                         onClick={() => this.setState(
                             {
                                 drawer: <Drawer
                                     currentItem={this.state.currentItem}
                                     items={this.state.items}
                                     setCurrentItem={this.setCurrentItem}
                                     closeDrawer={this.closeDrawer}/>
                             })}>
                        <img src={openDrawer}/>
                    </div>
                    {this.state.currentItem ?
                        <div className={'open-drawer'} style={{fontSize: '1.2em'}}>
                            {this.state.currentItem.name}
                        </div> : null}
                    {this.state.isAdmin ?
                        <div className={'open-drawer'} style={{fontSize: '1.2em'}}>
                            Админка
                        </div> : null}
                    <div className={'open-drawer'}
                         onClick={() => this.setState({isAdmin: true, currentItem: null})}>
                        <img width={'32px'} height={'32px'} src={settingsIcon}/>
                    </div>
                </div>
                {this.state.drawer}
                {this.state.currentItem && !this.state.isAdmin ?
                    this.state.content
                    :
                    <Admin items={this.state.items}
                           loadItems={this.loadItemsWithoutChanging}
                           onTopicDelete={this.onTopicDelete}
                           loadQuestions={this.loadQuestions}
                           addQuestion={this.addQuestion}
                           deleteQuestion={this.deleteQuestion}
                           updateQuestion={this.updateQuestion}
                    />
                }
            </div>

    }
}

export default App;
