import React, {Component} from 'react'
import styled from 'styled-components'
import axios from './axios'

const Main = styled.div`
    position: relative;
`
const ErrorMessage = styled.div`
    position: relative;
    color: red;
`

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {}

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        axios.post("/admin.json", this.state).then(({data}) => {
            console.log("data received from server: ", data);
            if (data.success) {
                console.log("login success, redirecting to /admin");
                location.replace("/admin")
            } else {
                this.setState({ error: data.error })
            }
        })
    }

    render() {
        return (
            <Main>
                Admin Page
                { this.state.error && <ErrorMessage>{this.state.error}</ErrorMessage> }
                <form action="/admin.json">
                    <input onChange={ this.handleChange } name="password" placeholder='Contraseña' type='password' />
                    <button onClick={(e) => this.handleSubmit(e) }>submit</button>
                </form>
            </Main>
        )
    }
}

export default Login
