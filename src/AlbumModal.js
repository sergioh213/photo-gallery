import React, {Component} from 'react'
import styled from 'styled-components'
import axios from './axios'

const Main = styled.div`
    position: absolute;
    width: 300px;
    height: 200px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: green;
    z-index: 1;
    padding: 20px;
`

const CloseX = styled.div`
    float: right;
    cursor: pointer;
`
const Title = styled.div`
    position: relative;
    margin-bottom: 10px;
`
const ButtonsWrapper = styled.div`
    position: relative;
    text-align: center;
    margin-top: 20px;
`
const CreateAlbum = styled.button`
    position: relative;
    display: inline-block;
    margin-right: 20px;
`
const AddToThisAlbumButton = styled.button`
    position: relative;
    display: inline-block;
`
const InputName = styled.input`
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    margin-top: 20px;
`
const DescriptionTextArea = styled.textarea`
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    resize: none;
`

class AlbumModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAlbumCreationForm: false
        }

        this.toggleShowAlbumCreationForm = this.toggleShowAlbumCreationForm.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
    }

    componentDidMount() {
        axios.get("/albums.json").then(({data}) => {
            console.log("data on albums: ", data);
            if (data) {
                this.setState({ albums: data })
            }
        })
    }

    handleSelectChange(e) {
        console.log("handleSelectChange: ", e.target.options[e.target.selectedIndex].value);
        var albumsClone = this.state.albums
        if (e.target.options[e.target.selectedIndex].value !== "default") {
            albumsClone.map(item => {
                console.log("inside map");
                if (item.id === parseInt(e.target.options[e.target.selectedIndex].value, 10)) {
                    console.log("ids match");
                    this.setState({
                        albumSelected: item,
                        showAlbumCreationForm: false
                    })
                }
            })
        } else {
            this.setState({
                albumSelected: null,
                showAlbumCreationForm: false
            })
        }
    }

    toggleShowAlbumCreationForm() {
        this.setState({ showAlbumCreationForm: !this.state.showAlbumCreationForm })
    }

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        axios.post("/create-album.json", this.state).then(({data}) => {
            console.log("data received from server, create album: ", data);
            const albumsClone = this.state.albums
            albumsClone.unshift(data)
            this.setState({
                showAlbumCreationForm: false,
                albums: albumsClone,
                message: true
            }, () => {
                setTimeout(() => {
                    this.setState({ message: false })
                }, 2000)
            })
        })
    }

    render() {
        var test = []
        console.log("modal state: ", this.state);
        return (
            <Main className="shadow">
                <CloseX onClick={this.props.toggleShowAlbumModal}>x</CloseX>
                { this.state.message && <div>Album creado</div> }
                { (!this.state.albums || this.state.albums.length === 0) ? <Title>Todavia no has creado ningun album</Title> :
                    <form action="">
                        <select name="location_id" onChange={ this.handleSelectChange }>
                            <option value="default">Selecciona un album</option>
                            { this.state.albums &&
                                this.state.albums.map(item => {
                                    return (
                                        <option key={item.id} value={ item.id } defaultValue="">{ item.name }</option>
                                    )
                                })
                            }
                        </select>
                    </form>
                }
                { !this.state.showAlbumCreationForm &&
                    <ButtonsWrapper>
                        <CreateAlbum onClick={this.toggleShowAlbumCreationForm}>Crear nuevo album</CreateAlbum>
                        { this.state.albumSelected &&
                            <AddToThisAlbumButton onClick={ () => this.props.addToAlbum(this.state.albumSelected)}>Añadir a este album</AddToThisAlbumButton>
                        }
                    </ButtonsWrapper>
                }
                { this.state.showAlbumCreationForm &&
                    <form>
                        <InputName
                            type="text"
                            name="name"
                            placeholder="Nombre del album"
                            onChange={ (e) => this.handleChange(e) }
                        />
                        <DescriptionTextArea
                            type="text"
                            name="description"
                            placeholder="Descripcion"
                            onChange={ (e) => this.handleChange(e) }
                        />
                        <button onClick={this.handleSubmit} >Crear</button>
                    </form>
                }
            </Main>
        )
    }
}

export default AlbumModal
