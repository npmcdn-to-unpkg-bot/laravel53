'use strict'

const {
    Form,
    Input,
    Textarea,
    // Editer,
    Radio,
    Checkbox,
    Upload,
    Range,
    Button,
    Hidden
} = require('../components/forms')
class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this._req(this.props)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params.pages != nextProps.params.pages || this.props.params.page != nextProps.params.page) {
            this._reQuest(nextProps)
        }
    }
    _req(props) {
        let {
            pages,
            page
        } = props.params
        request.get('admin/detail')
            .query({
                list: pages,
                id: page
            })
            .end(function (err, res) {
                let data = JSON.parse(res.text)
                console.log(data);
                this.setState(data)
            }.bind(this))
    }
    _onSubmit(e) {
        let {
            pages,
            page
        } = this.props.params
        request.post('admin/detail')
            .query({
                list: pages
            })
            .send(this.state.info)
            .end(function (err, res) {
                if (err) {
                    let msg = [res.status + 'error']
                    ConfigActions.msg(msg);
                } else {
                    let data = JSON.parse(res.text);
                    ConfigActions.msg(data.msg)
                }
            }.bind(this))
    }
    _onChange(name, value) {
        let info = this.state.info
        info[name] = value
        this.setState({
            info: info
        })
    }
    render() {
        let render
        let forms
        let info = this.state.info
        let model = this.state.fields
        if (model) {
            let onChange = this._onChange.bind(this)
            forms = model.map(function (d, index) {
                if (info[d.key] || info[d.key] == 0) {
                    d.value = info[d.key]
                } else {
                    d.value = d.default || ''
                }
                d.name = d.key
                d.onChange = onChange
                switch (d.type) {
                    case "text":
                        return (React.createElement(Input, d))
                        break;
                    case "password":
                        return (React.createElement(Input, d))
                        break;
                    case "email":
                        return (React.createElement(Input, d))
                        break;
                    case "textarea":
                        return (React.createElement(Textarea, d))
                        break;
                    case "upload":
                        return (React.createElement(Upload, d))
                        break;
                    case "image":
                        return (React.createElement(Upload, d))
                        break;
                    // case "editer":
                    //     return (React.createElement(Editer, d))
                    //     break;
                    case "radio":
                        return (React.createElement(Radio, d))
                        break;
                    case "checkbox":
                        return (React.createElement(Checkbox, d))
                        break;
                    case "hidden":
                        return (React.createElement(Hidden, d))
                        break;
                    default:
                        break;
                }
            })
        }
        if (info) {
            render =
                React.createElement('section', {
                    className: 'container'
                },
                    React.createElement(Form, {
                        action: this.state.action,
                        info: info,
                        apiSubmit: false,
                        legend: this.state.title,
                        onSubmit: this._onSubmit.bind(this)
                    },
                        forms,
                        React.createElement(Button)
                    )
                )
        }
        return (
            React.createElement('section', {
                className: 'warp'
            }, render)
        )
    }
}
module.exports = Page