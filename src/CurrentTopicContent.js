import * as React from "react";
import addIcon from "./icons/add_icon.svg";
import AddQuestionComponent from "./AddQuestionComponent";
import backArrow from './icons/back_arrow.svg'
import AddManyQuestionsComponent from "./AddManyQuestionsComponent";
import AlertDelete from "./AlertDelete";
import GoogleSheetAlert from "./GoogleSheetAlert";

export default class CurrentTopicContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questions: [],
            currentQuestion: null,
            questionAdd: false,
            addManyQuestions: false,
            deleteAlert: null,
            sheetAlert: null
        }
    }

    componentDidMount() {
        this.loadQuestions();
    }

    loadQuestions = () => {
        this.setState(({
            loading: true
        }))
        this.props.loadQuestions(this.props.currentTopic.id).then(data => {
            this.setState({
                questions: data.data,
                loading: false,
            })
        })
    }

    onCloseSheetAlert = () => {
        this.setState({
            sheetAlert: null
        })
    }

    onCloseDeleteAlert = () => {
        this.setState({
            deleteAlert: null
        })
    }

    showDeleteAlert = (elem) => {
        this.setState({
            deleteAlert: <AlertDelete onClose={this.onCloseDeleteAlert}
                                      text={`Вы действительно хотите удалить данный вопрос?`}
                                      execute={this.execute.bind(this, elem)}>
            </AlertDelete>
        })
    }

    showSheetAlert = () => {
        this.setState({
            sheetAlert: <GoogleSheetAlert onClose={this.onCloseSheetAlert} topicId={this.props.currentTopic.id}/>
        })
    }

    switchQuestionAdd = () => {
        this.setState({
            questionAdd: !this.state.questionAdd
        })
    }

    switchAddManyQuestions = () => {
        this.setState({
            addManyQuestions: !this.state.addManyQuestions
        })
    }
    execute = (elem) => {
        this.props.deleteQuestion(elem, this.props.currentTopic.id).then(() => {
            this.loadQuestions();
        })
    }
    render() {
        return this.state.addManyQuestions ?
            <AddManyQuestionsComponent
                switchAddManyQuestions={this.switchAddManyQuestions}
                loadQuestions={this.loadQuestions}
                currentTopic={this.props.currentTopic}
            />
            : !this.state.questionAdd ? <>
                {this.state.loading ? <div style={{marginTop: '100px', textAlign: 'center'}}>
                        <div className="lds-ring">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    </div>
                    : <>
                        {this.state.deleteAlert}
                        {this.state.sheetAlert}
                        <div className={'admin-content'} style={{
                            display: 'block',
                            backgroundColor: 'white',
                            paddingBottom: '20px',
                            borderBottom: '1px solid green'
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    justifyContent: "space-between",

                                }}>
                                <div
                                    className={'mobile-right'}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'green',
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            currentQuestion: null
                                        })
                                        this.switchQuestionAdd()
                                    }}
                                >
                                    <img width={'28px'} height={'28px'} src={addIcon}/>
                                    <span className={'back'}>Добавить вопрос</span>
                                </div>
                                <div className={'back'}>
                                    {this.props.currentTopic.name}
                                </div>
                                <div
                                    className={'mobile-left'}
                                    style={{
                                        color: 'green',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => this.props.setCurrentTopic(null)}>
                                    <img style={{width: '28px', height: '28px'}} src={backArrow}/> <span
                                    style={{paddingLeft: '10px'}}
                                    className={'back'}>Назад</span>
                                </div>
                            </div>
                            <div style={{textAlign: 'center', color: 'green', paddingTop: '15px'}}>
                            <span style={{
                                padding: '10px',
                                paddingBottom: '2px',
                                borderBottom: '1px solid green',
                                cursor: 'pointer'
                            }} onClick={this.switchAddManyQuestions}>Добавить сразу несколько вопросов</span>
                            </div>
                            <div style={{textAlign: 'center', color: 'green', paddingTop: '15px'}}>
                            <span style={{
                                padding: '10px',
                                paddingBottom: '2px',
                                borderBottom: '1px solid green',
                                cursor: 'pointer'
                            }} onClick={this.showSheetAlert}>Добавить вопросы из гугл таблички</span>
                            </div>
                        </div>
                        {
                            this.state.questions.length === 0 ?
                                <div className={'admin-content'} style={{
                                    backgroundColor: 'white',
                                    textAlign: 'center',
                                    paddingTop: '100px'
                                }}>Ни
                                    одного вопроса еще не создано</div> :
                                <div className={'admin-content'} style={{margin: 0}}>
                                    <div className={'admin-list-data'}
                                         style={{margin: 0, backgroundColor: 'aliceblue'}}>
                                        {this.state.questions.map((elem, index) => {
                                            return <div
                                                className={'admin-content-item'}
                                                style={{
                                                    cursor: "pointer",
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingRight: '15px',
                                                    alignItems: 'center'
                                                }}
                                                onClick={() => {
                                                    this.setState({
                                                        currentQuestion: elem,
                                                    })
                                                    this.switchQuestionAdd()
                                                }}
                                            >
                                                <div dangerouslySetInnerHTML={{__html: elem.text}}></div>
                                                <div style={{color: 'red', cursor: 'pointer'}}
                                                     onClick={e => {
                                                         e.stopPropagation();
                                                         this.showDeleteAlert(elem)
                                                     }}>X
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                        }
                    </>}
            </> :
            <AddQuestionComponent
                switchQuestionAdd={this.switchQuestionAdd}
                currentTopic={this.props.currentTopic}
                addQuestion={this.props.addQuestion}
                loadQuestions={this.loadQuestions}
                updateQuestion={this.props.updateQuestion}
                question={this.state.currentQuestion}
            />
    }
}