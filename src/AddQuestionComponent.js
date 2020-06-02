import * as React from "react";
import ReactDOM from "react-dom";
import axios from './api'
import ContentEditable from "./ContentEditable";

export default class AddQuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                text: '',
                type: 'radio',
                topic: props.currentTopic.id,
                answers: [
                    {
                        right: false,
                        text: ''
                    },
                    {
                        right: false,
                        text: ''
                    },
                ]
            }
        }
    }

    deleteLast = () => {
        if (this.state.question.answers.length > 2) {
            const {question} = this.state;
            question.answers.pop();
            this.setState({
                question: question
            })
        }
    }

    addLast = () => {
        const {question} = this.state;
        question.answers.push({
            right: false,
            text: ''
        })
        this.setState({
            question: question
        })
    }

    checkedAnswer = (event) => {
        const {question} = this.state;
        if (question.type === 'radio') {
            question.answers = question.answers.map(x => {
                x.right = false;
                return x;
            })
        }
        question.answers[event.target.name].right = event.target.checked;
        this.setState({
            question: question
        })
    }

    handleInputAnswer = (event) => {
        const {question} = this.state;
        if (event.target.name === 'question') {
            question.text = event.target.value;
        } else {
            question.answers[event.target.name].text = event.target.value;
        }
        this.setState({
            question: question
        })
    }

    handleTextAreaAnswer = (event) => {
        const {question} = this.state;
        question.answers[0].text = event.target.value;
        this.setState({
            question: question
        })
    }

    selectHandler = (event) => {
        const {question} = this.state;
        question.type = event.target.value;
        if (question.type === 'text') {
            question.answers = [
                {
                    right: false,
                    text: ''
                },
            ]
        } else if (question.type === 'input') {
            question.answers = [
                {
                    right: true,
                    text: ''
                },
            ]
        } else {
            question.answers = [
                {
                    right: false,
                    text: ''
                },
                {
                    right: false,
                    text: ''
                },
            ]
        }
        this.setState({
            question: question
        })
    }

    componentDidMount() {
        if (this.props.question) this.setState({question: this.props.question})
    }

    onSubmit = () => {
        this.props.addQuestion(this.state.question, this.props.currentTopic.id)
            .then(() => {
                this.props.switchQuestionAdd();
                this.props.loadQuestions();
            })
    }

    onPasteQuestionText = (e) => {
        let cbPayload = [...(e.clipboardData || e.originalEvent.clipboardData).items];
        cbPayload = cbPayload.filter(i => /image/.test(i.type));

        if (!cbPayload.length || cbPayload.length === 0) return true;

        const file = cbPayload[0].getAsFile();
        axios.post('https://api.imgur.com/3/image', file, {
            headers: {
                Authorization: `Client-ID 729e28b840b397e`
            }
        }).then((data) => {
            const {question} = this.state;
            question.text +=
                `<img src="${data.data.data.link}"/>`
            this.setState({
                question: question
            })
        })
    };

    onPasteOpenAnswerText = (e) => {
        let cbPayload = [...(e.clipboardData || e.originalEvent.clipboardData).items];
        cbPayload = cbPayload.filter(i => /image/.test(i.type));

        if (!cbPayload.length || cbPayload.length === 0) return true;

        const file = cbPayload[0].getAsFile();
        axios.post('https://api.imgur.com/3/image', file, {
            headers: {
                Authorization: `Client-ID 729e28b840b397e`
            }
        }).then((data) => {
            const {question} = this.state;
            question.answers[0].text +=
                `<img src="${data.data.data.link}"/>`
            this.setState({
                question: question
            })
        })
    };

    onUpdate = () => {
        this.props.updateQuestion(this.state.question, this.props.currentTopic.id)
            .then(() => {
                this.props.switchQuestionAdd();
                this.props.loadQuestions();
            })
    }

    handleInputFile = async (event) => {
        const file = event.target.files[0];
        await axios.post('https://api.imgur.com/3/image', file, {
            headers: {
                Authorization: `Client-ID 729e28b840b397e`
            }
        }).then((data) => {
            const {question} = this.state;
            question.answers[0].text +=
                `<img src="${data.data.data.link}"/>`
            this.setState({
                question: question
            })
        })
    }

    questionTextAnswer = (event) => {
        const file = event.target.files[0];
        axios.post('https://api.imgur.com/3/image', file, {
            headers: {
                Authorization: `Client-ID 729e28b840b397e`
            }
        }).then((data) => {
            const {question} = this.state;
            question.text +=
                `<img src="${data.data.data.link}"/>`
            this.setState({
                question: question
            })
        })
    }

    handleChangeTextQuestion = (event) => {
        const {question} = this.state;
        question.text = event.target.value;
        this.setState({
            question: question
        })
    }

    render() {
        return <>
            <div style={{paddingTop: '20px', fontSize: '1.5em'}}>
                Вопрос к топику {this.props.currentTopic.name}
            </div>
            <div className={'admin-content'}>
                <div className={'admin-list-data'} style={{padding: '15px'}}>
                    <div style={{paddingBottom: '10px'}}>Введите текст вопроса</div>
                    <>
                        <ContentEditable className={'add-textarea'} style={{
                            padding: '3px',
                            background: 'none',
                            outline: 'none',
                            border: '1px solid grey',
                            width: '100%',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            resize: 'none',
                            height: '100px',
                            overflow: 'scroll'
                        }}
                                         html={this.state.question.text}
                                         onPaste={this.onPasteQuestionText}
                                         onChange={this.handleChangeTextQuestion}/>
                        <div
                            style={{
                                paddingTop: '20px',
                                display: 'flex',
                                flexDirection: 'row-reverse'
                            }}>
                            <label className={'button'} style={{padding: '3px'}}>
                                <input type={'file'} className={'button'} accept="image/*" style={{
                                    display: 'none',
                                    width: '200px',
                                    height: '20px',
                                    background: 'none',
                                    outline: 'none',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'transparent',
                                }} onChange={this.questionTextAnswer}
                                       title={' '}/>
                                <span style={{fontSize: '12px'}}>Вставить картинку</span>
                            </label>
                        </div>
                    </>
                    <div style={{
                        padding: '10px 0',
                        paddingBottom: '15px',
                        borderBottom: '1px solid green'
                    }}>
                        <select onChange={this.selectHandler} style={{
                            background: 'none',
                            outline: 'none',
                            backgroundColor: 'white',
                            width: '200px',
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid grey',
                            cursor: 'pointer',
                        }}
                                value={this.state.question.type}>
                            <option value="radio">Один вариант</option>
                            <option value="checkbox">Несколько вариантов</option>
                            <option value="text">Открытый</option>
                            <option value="input">Один открытый</option>
                        </select>
                    </div>
                    <div style={{padding: '15px 0'}}>
                        {this.state.question.type !== 'text' ? 'Варианты ответа' : 'Ответ'}
                    </div>
                    <div style={{padding: '10px 0'}}>
                        {this.state.question.type !== 'text' ?
                            this.state.question.answers.map((elem, index) => {
                                return <div
                                    key={index}
                                    style={{
                                        borderBottom: this.state.question.answers.length !== index + 1 ? '1px solid green' : null,
                                        padding: '15px 0'
                                    }}>
                                    {this.state.question.type !== 'input' ?
                                        <>
                                            <div>{index + 1}.</div>
                                            <div style={{display: 'flex', paddingBottom: '10px'}}>
                                                <span style={{paddingRight: '10px'}}>Правильный ответ</span>
                                                <input type={'checkbox'} checked={elem.right}
                                                       name={index}
                                                       onChange={this.checkedAnswer}/>
                                            </div>
                                        </>
                                        : null}
                                    <div className={'input'}>
                                        <input type={'text'} value={elem.text} name={index}
                                               autoComplete={'off'}
                                               onChange={this.handleInputAnswer}/>
                                    </div>
                                </div>
                            }) : <><ContentEditable className={'add-textarea'} style={{
                                padding: '3px',
                                background: 'none',
                                outline: 'none',
                                border: '1px solid grey',
                                width: '100%',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                resize: 'none',
                                height: '100px',
                                overflow: 'scroll'
                            }}
                                                    onPaste={this.onPasteOpenAnswerText}
                                                    html={this.state.question.answers[0].text}
                                                    onChange={this.handleTextAreaAnswer}/>
                                <div
                                    style={{
                                        paddingTop: '20px',
                                        display: 'flex',
                                        flexDirection: 'row-reverse'
                                    }}>
                                    <label className={'button'} style={{padding: '3px'}}>
                                        <input type={'file'} className={'button'} accept="image/*"
                                               style={{
                                                   display: 'none',
                                                   width: '200px',
                                                   height: '20px',
                                                   background: 'none',
                                                   outline: 'none',
                                                   border: 'none',
                                                   backgroundColor: 'transparent',
                                                   color: 'transparent',
                                               }} onChange={this.handleInputFile} title={' '}/>
                                        <span style={{fontSize: '12px'}}>Вставить картинку</span>
                                    </label>
                                </div>
                            </>
                        }
                        {this.state.question.type !== 'text' && this.state.question.type !== 'input' ?
                            <div className={'add-question-bar'} style={{paddingTop: '15px'}}>
                            <span style={{
                                padding: '20px 3px 0 0',
                                color: 'blue',
                                cursor: 'pointer',
                                borderBottom: '1px solid blue'
                            }} className={'add-variant'} onClick={this.addLast}>Добавить вариант ответа</span>
                                <span style={{
                                    padding: '20px 3px 0 0',
                                    color: 'red',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid red'
                                }} onClick={this.deleteLast}>Удалить последний</span>
                            </div> : null}
                    </div>
                    <div
                        style={{paddingTop: '20px', display: 'flex', flexDirection: 'row-reverse'}}>
                        <button className={'button'} style={{
                            width: '100px', height: '20px'
                        }} onClick={this.props.question ? this.onUpdate : this.onSubmit}>Сохранить
                        </button>
                        <button className={'button'} style={{
                            width: '100px', height: '20px', margin: '0 10px'
                        }} onClick={() => {
                            this.props.switchQuestionAdd()
                        }}>Отмена
                        </button>
                    </div>
                </div>
            </div>

        </>
    }

}
