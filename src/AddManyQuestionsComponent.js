import * as React from "react";
import axios from "./api";
import ContentEditable from "./ContentEditable";
import ReactDOM from "react-dom";

export default class AddManyQuestionsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parsedComponent: '',
            textValue: '',
            parsedJson: ''
        }
    }

    addQuestions = () => {
        axios.post('/api/too_many_questions/', this.state.parsedJson).then(() => {
            this.props.switchAddManyQuestions();
            this.props.loadQuestions();
        })
    }

    onPaste = (e) => {
        let cbPayload = [...(e.clipboardData || e.originalEvent.clipboardData).items];
        cbPayload = cbPayload.filter(i => /image/.test(i.type));

        if (!cbPayload.length || cbPayload.length === 0) return true;

        const file = cbPayload[0].getAsFile();
        axios.post('https://api.imgur.com/3/image', file, {
            headers: {
                Authorization: `Client-ID 729e28b840b397e`
            }
        }).then((data) => {
            let textValue = this.state.textValue;
            textValue +=
                `<img src="${data.data.data.link}"/>`
            this.setState({
                textValue: textValue
            })
            this.onChange({target: {value: textValue}})
        })
    };

    onChange = (event) => {
        const value = event.target.value
        const questions = value.replace('<div><br></div>', '').split('<div>#</div>')
        let parsedComponent = '';
        const parsedJson = []
        try {
            const questionComponents = questions.map((x, index) => {
                parsedJson.push({
                    text: '',
                    type: '',
                    topic: this.props.currentTopic.id,
                    answers: []
                })
                let items = x.split(/<div>|<\/div>/).filter(x => !!x).map(x => x.trim());
                const questionName = items.shift();
                parsedJson[index].text = questionName
                const rightCount = items.filter(x => x.startsWith('+')).length
                let updatedItems = items.map(x => {
                    if (x.startsWith('+')) {
                        return x.substring(1);
                    }
                    return x;
                })
                return <div style={{width: '90%', maxWidth: '90%'}}>
                    {questionName ?
                        <div className={'question-text'}
                             style={{width: '100%', textAlign: 'center'}}
                             dangerouslySetInnerHTML={{__html: `${index + 1}. ${questionName}`}}>
                        </div> : null}
                    <div style={{maxWidth: '90%', width: '90%'}}>
                        {updatedItems.map((elem, index2) => {
                            if (items.length === 1) {
                                if(items[0].startsWith('+')) {
                                    parsedJson[index].type = 'input';
                                    parsedJson[index].answers.push({
                                        right: true,
                                        text: elem
                                    })
                                    return <div key={index2} className={'answer'}>
                                        <div className={'input'} style={{width: '200px'}}>
                                            <input type={'text'}
                                                   disabled={true}
                                                   value={elem}/>
                                        </div>
                                    </div>
                                }
                                else {
                                    parsedJson[index].type = 'text';
                                    parsedJson[index].answers.push({
                                        right: false,
                                        text: elem
                                    })
                                    return <div key={index2} className={'answer'}
                                                dangerouslySetInnerHTML={{__html: elem}}/>
                                }
                            } else if (rightCount <= 1) {
                                parsedJson[index].type = 'radio';
                                parsedJson[index].answers.push({
                                    right: items[index2].startsWith('+'),
                                    text: elem
                                })
                                return <div key={index2} className={'answer'}
                                            style={{display: 'flex'}}><input
                                    type={'radio'}
                                    checked={items[index2].startsWith('+')}
                                    disabled={true}
                                    name={index2}/>
                                    <div style={{maxWidth: '90%', wordBreak: 'break-word'}}
                                         dangerouslySetInnerHTML={{__html: elem}}/>
                                </div>
                            } else if (rightCount > 1) {
                                parsedJson[index].type = 'checkbox';
                                parsedJson[index].answers.push({
                                    right: items[index2].startsWith('+'),
                                    text: elem
                                })
                                return <div key={index2} className={'answer'}
                                            style={{display: 'flex'}}><input
                                    disabled={true}
                                    checked={items[index2].startsWith('+')}
                                    type={'checkbox'}
                                    onChange={this.handleChange}/>
                                    <div style={{maxWidth: '90%', wordBreak: 'break-word'}}
                                         dangerouslySetInnerHTML={{__html: elem}}/>
                                </div>
                            } else return '';
                        })}
                    </div>
                </div>
            })
            parsedComponent = <div>{questionComponents}</div>
        } catch (e) {
            console.log(e)
            parsedComponent = <div style={{color: 'red'}}>Error during parsing</div>
        }
        this.setState({
            textValue: value,
            parsedComponent: parsedComponent,
            parsedJson: parsedJson
        })
    }
    handleInputFile = (event) => {
        const file = event.target.files[0];
        axios.post('https://api.imgur.com/3/image', file, {
            headers: {
                Authorization: `Client-ID 729e28b840b397e`
            }
        }).then((data) => {
            let textValue = this.state.textValue;
            textValue +=
                `<img src="${data.data.data.link}"/>`
            this.setState({
                textValue: textValue
            })
            this.onChange({target: {value: textValue}})
        })

    }

    render() {
        return <>
            <div style={{paddingTop: '15px', textAlign: 'center'}}>Введите текст вопросов по
                заданному шаблону
            </div>
            <div style={{
                paddingTop: '5px',
                width: '100%',
                display: 'flex',
                justifyContent: "center"
            }}>
                <ContentEditable
                    style={{
                        background: 'none',
                        outline: 'none',
                        border: '1px solid grey',
                        width: '90%',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        resize: 'none',
                        height: '300px',
                        padding: '5px'
                    }}
                    onPaste={this.onPaste}
                    html={this.state.textValue}
                    onChange={this.onChange}
                    placeholder={'Вопрос 1\n+Правильный ответ\nНеправильный ответ\n#\nВопрос 2\n+Правильный ответ' +
                    '\n+Еще правильный ответ\nНеправильный ответ\n#\nОткрытый вопрос\nТекст вопроса'}
                />
            </div>
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
                    }} onChange={this.handleInputFile} title={' '}/>
                    <span style={{fontSize: '12px'}}>Вставить картинку</span>
                </label>
            </div>
            <div
                style={{
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    display: 'flex',
                    flexDirection: 'row-reverse'
                }}>
                <button className={'button'} style={{
                    width: '100px', height: '20px'
                }} onClick={this.addQuestions}>Сохранить
                </button>
                <button className={'button'} style={{
                    width: '100px', height: '20px', margin: '0 10px'
                }} onClick={this.props.switchAddManyQuestions}>Отмена
                </button>
            </div>
            <div style={{
                paddingTop: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: "center"
            }}>
                <div style={{width: '90%'}}>{this.state.parsedComponent}</div>
            </div>
        </>
    }
}