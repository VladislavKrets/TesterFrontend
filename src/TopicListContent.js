import * as React from "react";
import addIcon from "./icons/add_icon.svg";
import Alert from "./Alert";
import AlertDelete from "./AlertDelete";

export default class TopicListContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addTopicAlert: null,
            deleteAlert: null,
        }
    }

    onCloseAlert = () => {
        this.setState({
            addTopicAlert: null
        })
    }

    onCloseDeleteAlert = () => {
        this.setState({
            deleteAlert: null
        })
    }

    showAlert = () => {

        this.setState({
            addTopicAlert: <Alert onClose={this.onCloseAlert} loadItems={this.props.loadItems}>
            </Alert>
        })
    }

    showDeleteAlert = (elem) => {
        this.setState({
            deleteAlert: <AlertDelete onClose={this.onCloseDeleteAlert}
                                      text={`Вы действительно хотите удалить раздел "${elem.name}"?`}
                                      execute={this.props.onTopicDelete.bind(this, elem.id)}>
            </AlertDelete>
        })
    }

    render() {
        return <>
            {this.state.addTopicAlert}
            {this.state.deleteAlert}
            <div className={'admin-content'}
                 style={{
                     backgroundColor: "white",
                     flexDirection: 'row-reverse',
                     alignItems: 'center',
                     borderBottom: '1px solid green',
                     paddingBottom: '20px'
                 }}>
                <div

                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'green',
                        cursor: "pointer"
                    }}
                    onClick={this.showAlert}
                >
                    <img width={'28px'} height={'28px'} className={'mobile-right'} src={addIcon}/>
                    <span className={'back'}>Добавить раздел</span>
                </div>
            </div>
            {this.props.items.length > 0 ?
                <div className={'admin-content'} style={{margin: 0}}>
                    <div className={'admin-list-data'}>
                        {this.props.items.map((elem, index) => {
                            return <div
                                onClick={() => {
                                    this.props.setCurrentTopic(elem)
                                }}
                                className={'admin-content-item'}
                                style={{
                                    cursor: "pointer",
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingRight: '15px'
                                }}
                            >
                                <div>{elem.name}</div>
                                <div style={{color: 'red', cursor: 'pointer'}} onClick={e => {
                                    e.stopPropagation();
                                    this.showDeleteAlert(elem)
                                }}>X
                                </div>
                            </div>
                        })}
                    </div>
                </div> : <div className={'admin-content'} style={{
                    backgroundColor: 'white',
                    textAlign: 'center',
                    paddingTop: '100px'
                }}>Ни
                    одного раздела еще не создано</div>}
        </>
    }
}