import React, {Component} from 'react'
import styled from 'styled-components'
import axios from './axios'

const Main = styled.div`
    position: relative;
`
const LoaderWrapper = styled.div`
    position: relative;
    width: 100%;
    text-align: center;
    padding: 30px;
`
const LoadingGif = styled.img`
    width: 100px;
    object-fit: cover;
    object-position: center;
`
const ButtonWrapper = styled.div`
    position: relative;
    width: 100%;
    text-align: center;
    padding: 30px;
`
const UploadInputField = styled.input`
    position: absolute;
    right: 3000px;
`
const LabelButton = styled.label`
    position: relative;
    border: 1px grey solid;
    cursor: pointer;
`
const UploadButton = styled.button`
    position: relative;
`
const Grid = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-template-rows: repeat(2, 220px);
    grid-gap: 10px;
    margin: 20px;
    text-align: center;
`
const GridItem = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: lightgrey;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-item: center;
`
const Image = styled.img`
    position: relative;
    width: 100%;
    max-height: 90%;
    object-fit: cover;
    object-position: center;
`
const Title = styled.div`
    position: relative;
    margin-top: 20px;
    width: 100%;
    text-align: center;
`
const ImageName = styled.div`
    position: relative;
    width: 100%;
    text-align: center;
    height: 10%;
    display: flex;
    background-color: red;
    justify-content: center;
`
const DeleteButton = styled.button`
    position: absolute;
    color: white;
    top: 5px;
    right: 5px;
`
const Tip = styled.div`
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: grey;
`

class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            submit: false,
            selectFile: true,
            selectedFiles: []
        }

        this.imageSelected = this.imageSelected.bind(this)
        this.upload = this.upload.bind(this)
        this.removeFile = this.removeFile.bind(this)
        this.saveSelection = this.saveSelection.bind(this)
    }
    componentDidMount() {
        axios.get("/previews.json").then(({data}) => {
            console.log("data HERE LOOKING FOR previews: ", data);
            if (data.length > 0) {
                this.setState({ finalizedImages: data })
            }
        })
    }

    imageSelected(e) {
        var selectedFilesClone = this.state.selectedFiles
        for (var i = 0; i < e.target.files.length; i++) {
            selectedFilesClone.push(e.target.files[i])
        }
        this.upload()
        this.setState({
            submit: true,
            selectedFiles: selectedFilesClone,
        })
    }

    removeFile() {
        this.setState({
            imageFile: null,
            submit: false,
            selectFile: true
        })
    }

    upload() {
        var self = this
        var formData = new FormData;
        if (!this.state.selectedFiles && this.state.selectedFiles.length) {
            this.setState({
                error: 'Please select a file in order to upload'
            })
        } else {
            var selectedFilesClone = this.state.selectedFiles
            selectedFilesClone.forEach(file => {
                formData.append('file', file);
            })
            axios.post('/upload-images.json', formData)
            .then((res) => {
                console.log("res.data: ", res.data);
                if (res.data.success) {
                    this.setState({ finalizedImages: res.data.finalizedImages })
                }
            })

        }
    }

    saveSelection() {
        console.log("save selection happening");

        axios.post("/save-images.json", this.state.finalizedImages).then(({data}) => {
            console.log("IMAGES SUCCESFULLY SAVED: ", data);
            if (data.success && data.savedImages.length > 0) {
                this.setState({
                    uploadSuccess: true,
                    savedImages: data.savedImages,
                    finalizedImages: null,
                    selectedFiles: []
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            uploadSuccess: true,
                            savedImages: null,
                            finalizedImages: null,
                            selectedFiles: []
                        })
                    }, 2500)
                })
            }
        })
    }

    render() {
        console.log("Main page of admin rendering");
        return (
            <Main>
                { !this.state.finalizedImages &&
                    <div>
                        { (!this.state.selectedFiles || (this.state.selectedFiles && this.state.selectedFiles.length === 0)) &&
                            <ButtonWrapper>
                                <LabelButton className="button" id="file-label" htmlFor="file-field">Subir Photos</LabelButton>
                            </ButtonWrapper>
                        }
                        <UploadInputField id="file-field" type="file" onChange={(e) => this.imageSelected(e)} name="" value="" multiple></UploadInputField>
                        {/*{ this.state.submit &&
                            this.state.selectedFiles.map(file => {
                                return (
                                    <div id="multiple-image-name" key={file.name}>
                                        <div id="filename-div">{ file.name }</div>
                                        <div id="remove-file-x" onClick={ this.removeFile } >x</div>
                                    </div>
                                )
                            })
                        }*/}
                        {/*{ this.state.submit &&
                            <ButtonWrapper>
                                <UploadButton onClick={ this.upload } name="button">Comfirmar</UploadButton>
                            </ButtonWrapper>
                        }*/}
                    </div>
                }
                { ((this.state.selectedFiles.length > 0) && !this.state.finalizedImages && !this.state.savedImages) &&
                    <LoaderWrapper>
                        <Title>Preparando previsualizacion</Title>
                        <LoadingGif src="/content/loading.gif" alt=""/>
                    </LoaderWrapper>
                }
                { this.state.finalizedImages &&
                    <div>
                        <Title>Previsualizacion lista</Title>
                        <ButtonWrapper>
                            <UploadButton onClick={ this.saveSelection } name="button">Comfirmar seleccion</UploadButton>
                        </ButtonWrapper>
                        <Tip>(Si hay imagenes rotas, refresca la pagina)</Tip>
                        <Grid>
                            { this.state.finalizedImages.map(item => {
                                return (
                                    <GridItem key={item.id} >
                                        <Image src={item.img_url} alt="" />
                                        <ImageName>{item.filename}</ImageName>
                                        <DeleteButton>x</DeleteButton>
                                    </GridItem>
                                )
                            })}
                        </Grid>
                    </div>
                }
                { (this.state.uploadSuccess && this.state.savedImages) && <Title>{this.state.savedImages.length} fotos subidas con exito</Title> }
            </Main>
        )
    }
}

export default AdminPage
