import React from "react";
import './PanelContent.css'
import axios from './api'

export default class PanelContent extends React.Component {
    constructor(props) {
        super(props);
        const checked = []
        this.state = {
            questions: [],
            currentIndex: 0,
            currentScore: 0,
            checked: checked,
            isChecked: false,
            isRight: false,
            isCurrentRight: false,
            loading: true,
            currentInputAnswer: ''
        }
    }

    handleChange = (event) => {
        const question = this.state.questions[this.state.currentIndex];
        if (question.type === 'radio') {
            const {checked} = this.state
            for (let i = 0; i < checked.length; i++) {
                checked[i] = false;
            }
            checked[event.target.name] = true
            this.setState({
                checked: checked
            })
        } else if (question.type === 'checkbox') {
            const {checked} = this.state
            checked[event.target.name] = event.target.checked
            this.setState({
                checked: checked
            })
        } else if (question.type === 'input'){
            this.setState({
                currentInputAnswer: event.target.value
            })
        }
    }

    nextClick = () => {
        let isRight = true;
        let currentScore = this.state.currentScore;
        if (this.state.isChecked) isRight = this.state.isRight;
        else {
            if (this.state.questions[this.state.currentIndex].type !== 'input') {
                for (let i = 0; i < this.state.checked.length; i++) {
                    isRight = isRight && (this.state.checked[i] === this.state
                        .questions[this.state.currentIndex].answers[i].right)
                }
            }
            else {
                const userAnswer = this.state.currentInputAnswer.trim();
                const correctAnswer = this.state.questions[this.state.currentIndex].answers[0].text.trim()
                isRight = (userAnswer === correctAnswer)
            }
        }
        if (isRight || this.state.questions[this.state.currentIndex].type === 'text') currentScore++;
        const checked = []
        if (this.state.currentIndex + 1 < this.state.questions.length)
            this.state.questions[this.state.currentIndex + 1].answers.forEach(() => checked.push(false))
        this.setState({
            currentIndex: this.state.currentIndex + 1,
            checked: checked,
            isChecked: false,
            isRight: false,
            isCurrentRight: false,
            currentScore: currentScore,
            currentInputAnswer: ''
        })

    }

    newClick = () => {
        const checked = []
        this.state.questions[0].answers.forEach(() => checked.push(false))
        this.setState({
            currentIndex: 0,
            checked: checked,
            isChecked: false,
            isRight: false,
            isCurrentRight: false,
            currentScore: 0,
            currentInputAnswer: ''
        })
    }

    checkClick = () => {
        let isRight = true
        if (this.state.questions[this.state.currentIndex].type !== 'input') {
            for (let i = 0; i < this.state.checked.length; i++) {
                isRight = isRight && (this.state.checked[i] === this.state
                    .questions[this.state.currentIndex].answers[i].right)
            }
        }
        else {
            const userAnswer = this.state.currentInputAnswer.trim();
            const correctAnswer = this.state.questions[this.state.currentIndex].answers[0].text.trim()
            isRight = (userAnswer === correctAnswer)
        }
        const isFirstCheckRight = this.state.isChecked ? this.state.isRight : isRight;
        this.setState({
            isChecked: true,
            isRight: isFirstCheckRight,
            isCurrentRight: isRight
        })
    }

    loadQuestions = () => {
        axios.get('/api/questions/?format=json', {
            headers: {
                topic: this.props.currentItem.id
            }
        })
            .then(data => {
                const questions = data.data;
                console.log(questions.length)
                const checked = [];
                if (questions.length > 0)
                    questions[0].answers.forEach(() => checked.push(false))
                this.setState({
                    questions: data.data,
                    checked: checked,
                    loading: false
                })
            })
    }
    shuffle = (a) => {
        let temp, j;
        for (let i = a.length - 1; i > 0; i--){
            j = Math.floor(Math.random() * (i + 1));
            temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return a;
    }
    shuffleClick = () => {
        const {questions} = this.state
        for (let i = 0; i < questions.length; i++) {
            questions[i].answers = this.shuffle(questions[i].answers)
        }
        const checked = []
        this.state.questions[0].answers.forEach(() => checked.push(false))
        this.setState({
            questions: this.shuffle(questions),
            currentIndex: 0,
            checked: checked,
            isChecked: false,
            isRight: false,
            isCurrentRight: false,
            currentScore: 0
        })
    }
    componentDidMount() {
        this.loadQuestions();
    }

    render() {
        const question = this.state.questions.length > 0 ? this.state.questions[this.state.currentIndex] : null;
        return this.state.loading ?
            <div style={{marginTop: '100px', textAlign: 'center'}}>
                <div className="lds-ring">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div> : this.state.questions.length > 0 ?
                <div className={'panel-content'} style={{paddingBottom: '15px'}}>
                    {this.state.currentIndex < this.state.questions.length ?
                        <div className={'question-content'}>
                            {this.state.currentIndex === 0 && <span style={{
                                padding: '10px',
                                paddingBottom: '1px',
                                borderBottom: '1px solid green',
                                color: 'green',
                                cursor: 'pointer',
                                marginBottom: '10px',
                            }} onClick={this.shuffleClick}>Перемешать всё</span>}
                            <div>{this.state.currentIndex + 1}/{this.state.questions.length}</div>
                            <div className={'question-text'} style={{textAlign: 'center'}}
                                 dangerouslySetInnerHTML={{__html: question.text}}>
                            </div>
                            <div className={'answers'}>
                                {question.answers.map((elem, index) => {
                                    console.log(elem)
                                    if (question.type === 'radio') {
                                        return <label className={'answer'}
                                                    style={{display: 'flex'}}><input
                                            type={'radio'}
                                            checked={this.state.checked[index]}
                                            name={index}
                                            onChange={this.handleChange}/>
                                            <div style={{maxWidth: '90%', wordBreak: 'break-word'}}
    dangerouslySetInnerHTML={{__html: elem.text}}/>
                                        </label>
                                    } else if (question.type === 'checkbox') {
                                        return <label
                                                    className={'answer'} style={{display: 'flex'}}><input
                                            type={'checkbox'}
                                            name={index}
                                            checked={this.state.checked[index]}
                                            onChange={this.handleChange}/>
                                            <div style={{maxWidth: '90%', wordBreak: 'break-word'}}
    dangerouslySetInnerHTML={{__html: elem.text}}/>
                                        </label>
                                    } else if (question.type === 'text') {
                                        return <div className={'answer'} style={{wordBreak: 'break-word'}}
    dangerouslySetInnerHTML={{__html: elem.text}}/>
                                    } else if (question.type === 'input') {
                                        return <div className={'input'}>
                                            <input type={'text'} name={index}
                                                   placeholder={'Введите ответ'}
                                                   autoComplete={'off'}
                                                   value={this.state.currentInputAnswer}
                                                   onChange={this.handleChange}/>
                                        </div>
                                    }
                                    else return '';
                                })}
                            </div>
                            {this.state.isChecked ?
                                <div className={'alert-panel-content'} style={{
                                    backgroundColor: this.state.isCurrentRight ? 'rgba(132, 181, 105, 0.5)' : 'rgba(227, 89, 89, 0.5)',
                                    color: this.state.isCurrentRight ? 'green' : 'red'
                                }}>
                                    <div>{this.state.isCurrentRight ? "Верно" : "Неверно"}</div>
                                    {!this.state.isCurrentRight ? ( question.type !== 'input' ?
                                        <div>Верные варианты: {question.answers.map((x, index) => {
                                            return (x.right ? index + 1 : '') + " "
                                        })}</div> : <div>Верный ответ: {question.answers[0].text}</div>) : null}
                                </div>
                                : null}
                            <div className={'button-bar'}>
                                {question.type === 'text' ? null :
                                    <button className={'clear-button check-button'}
                                            onClick={this.checkClick}>Проверить</button>
                                }
                                <button className={'clear-button next-button'}
                                        onClick={this.nextClick}>Далее
                                </button>
                            </div>
                        </div>
                        : <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: '100px'
                        }}>
                            <div>Правильных ответов {this.state.currentScore}</div>
                            <div>Процент
                                выполнения {Math.round(this.state.currentScore / this.state.questions.length * 100)}</div>
                            <button className={'clear-button next-button'}
                                    style={{marginTop: '30px'}}
                                    onClick={this.newClick}>Заново
                            </button>
                        </div>}
                </div> : <div className={'panel-content'}
                              style={{marginTop: '100px', textAlign: 'center'}}>Еще нет ни одного
                    вопроса</div>
    }
}