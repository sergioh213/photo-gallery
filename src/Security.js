import React, {Component} from 'react'
import styled from 'styled-components'
import axios from './axios'
import AdminNavBar from './AdminNavBar'

const Main = styled.div`
    position: relative;
`
const SuccessMessage = styled.div`
    position: relative;
    color: green;
`

class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        axios.get("/email.json").then(({data}) => {
            console.log("this data: ", data)
            this.setState({ currEmail: data })
        })
    }

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        axios.post("/update-info.json", this.state).then(({data}) => {
            console.log("data received from server: ", data);
            if (data.success === "pass") {
                this.setState({ successMessage: "Constraseña cambiada" }, () => {
                    setTimeout(() => {
                        this.setState({ successMessage: null })
                    }, 1500)
                })
            } else if (data.success === "email") {
                this.setState({ successMessage: `Email cambiado. Nuevo email:\n${data.email}` }, () => {
                    setTimeout(() => {
                        this.setState({ successMessage: null })
                    }, 1500)
                })
            } else if (data.success === "pass") {
                this.setState({ successMessage: `Constraseña y email cambiados. Nuevo email:\n${data.email}` }, () => {
                    setTimeout(() => {
                        this.setState({ successMessage: null })
                    }, 1500)
                })
            }
        })
    }
    render() {
        return (
            <Main>
                Admin Page
                { this.state.successMessage && <SuccessMessage>{this.state.successMessage}</SuccessMessage> }
                <form>
                    <input onChange={ this.handleChange } defaultValue={this.state.currEmail}  name="email" placeholder='Email' type='email' />
                    <input onChange={ this.handleChange } name="password" placeholder='Nueva contraseña' type='password' />
                    <button onClick={(e) => this.handleSubmit(e) }>submit</button>
                </form>
            </Main>
        )
    }
}

export default AdminPage
