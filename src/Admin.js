import * as React from "react";
import './Admin.css'
import TopicListContent from "./TopicListContent";
import CurrentTopicContent from "./CurrentTopicContent";

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTopic: null
        }
    }

    setCurrentTopic = (currentTopic) => {
        this.setState(({
            currentTopic: currentTopic
        }))
    }

    render() {
        return (
            <div className={'admin'}>
                {!this.state.currentTopic ?
                <TopicListContent
                    items={this.props.items}
                    loadItems={this.props.loadItems}
                    onTopicDelete={this.props.onTopicDelete}
                    setCurrentTopic={this.setCurrentTopic}
                />
                : <CurrentTopicContent
                        key={this.state.currentTopic.id}
                        currentTopic={this.state.currentTopic}
                        loadQuestions={this.props.loadQuestions}
                        addQuestion={this.props.addQuestion}
                        deleteQuestion={this.props.deleteQuestion}
                        setCurrentTopic={this.setCurrentTopic}
                        updateQuestion={this.props.updateQuestion}
                    />
                }
            </div>
        )
    }
}