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
    Select,
    Hidden
} = require('../components/forms')
class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }
    componentDidMount() {
        this._req(this.props)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params.pages != nextProps.params.pages || this.props.params.page != nextProps.params.page) {
            this._req(nextProps)
        }
    }
    _req(props) {
        let {
            pages,
            page
        } = props.params
        let requrl = page == 'add' ? 'admin/add' : 'admin/detail'
        request.get(requrl)
            .query({
                list: pages,
                id: page
            })
            .end(function(err, res) {
                let data = JSON.parse(res.text)
                this.setState({
                    fields: data.fields,
                    info: data.info || {}
                })
            }.bind(this))
    }
    _onSubmit(e) {
        let {
            pages,
            page
        } = this.props.params
        console.log(this.state.info)
        let requrl = page == 'add' ? 'admin/add' : 'admin/detail'
        request.post(requrl)
            .query({
                list: pages
            })
            .send(this.state.info)
            .end(function(err, res) {
                let msg
                if (err) {
                    msg = err.response.error.message
                } else {
                    let data = JSON.parse(res.text);
                    msg = data.msg
                }
                ConfigActions.message(msg)
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
            forms = model.map(function(ds, index) {
                let d = {}
                if (info[ds.key] || info[ds.key] == 0) {
                    d.value = info[ds.key]
                } else {
                    d.value = ds.f_default || ''
                }
                if (ds.f_options) {
                    d.key = ds.f_options
                }
                d.f_ext = ds.f_ext
                d.key = ds.key
                d.name = ds.key
                d.type = ds.type
                d.title = ds.title
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
                    case "select":
                        return (React.createElement(Select, d))
                        break;
                    case "hidden":
                        return (React.createElement(Hidden, d))
                        break;
                    default:
                        break;
                }
            })
        }
        // if (info) {
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
            // }
        return (
            React.createElement('section', {
                className: 'warp'
            }, render)
        )
    }
}
module.exports = Page