import React, {Component} from 'react'
import { connect } from 'react-redux';
// import { getProfile } from './redux-socket/actions.js'
import styled from 'styled-components'
import axios from './axios'
import { Link } from 'react-router-dom'

const mapStateToProps = state => {
    return {
        profile: state.profile
    }
}

const Main = styled.div`
    background-color: red;
    padding: 5px;
    display: flex;
    justify-content: center;
    color: white;
    font-weight: 400;

    &:hover{
        text-decoration: underline;
    }
`
const FirstPart = styled.div`
    display: inline-block;
    white-space: pre;
`

class RedAdminStripe extends Component {
    render() {
        console.log("regular nav bar rendering");
        return (
            <Main>
                { this.props.match.params.extension === "home" ?
                    <div>
                        <FirstPart>Esto es lo que ve la gente. </FirstPart>
                        <Link to="/admin"
                            style={{
                                textDecoration: 'underline',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'inline-block'
                            }}
                        >
                             Volver a administrador
                        </Link>
                    </div> :
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'white' }}>
                        Cuenta de administrador activada
                    </Link>
                }
            </Main>
        )
    }
}

export default connect(mapStateToProps)(RedAdminStripe)
