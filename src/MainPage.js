import React, {Component} from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components'
import axios from './axios'

const Main = styled.div`
    position: relative;
`
const Grid = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 10px;
    margin: 20px;
    text-align: center;
    margin-bottom: 60px;
`
// grid-template-rows: repeat(2, 220px);
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
    margin-bottom: 20px;
`
const AlbumTitle = styled.div`
    position: relative;
    width: 100%;
    text-align: center;
    background-color: cyan;
    font-size: 18px;
    font-weight: 400;
    padding: 5px;
`
const AlbumDescription = styled.p`
    position: relative;
    padding: 10px;
    margin: 0;
    width: 100%;
    text-align: center;
    background-color: lightgrey;
`
const ImageName = styled.div`
    position: relative;
    width: 100%;
    text-align: center;
    height: 10%;
    padding: 5px;
    display: flex;
    background-color: cyan;
    justify-content: center;
`
const AlbumsIcon = styled.i`
    color: white;
    margin-right: 10px;
`

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount() {
        // axios.get("/photos.json").then(({data}) => {
        //     if (data && data.length > 0) {
        //         this.setState({ photos: data })
        //     }
        // })
        axios.get("/all.json").then(({data}) => {
            console.log("receiving 'albums' : ", data);
            if (data && data.length > 0) {
                console.log("inside if");
                var albumsClone = data
                for (var i = 0; i < albumsClone.length; i++) {
                    if (albumsClone[i].photos.length === 0) {
                        console.log("no photos detected on following album: ", albumsClone[i]);
                        albumsClone.splice(i, 1)
                        i = i-1
                    }
                }
                console.log("setting the state");
                this.setState({ albums: albumsClone })
            } else {
                this.setState({ message: true })
            }
        })
    }
    render() {
        console.log("LOGGING the state: ", this.state);
        if ( !this.state.albums && !this.state.message ) {
            console.log("STUCK");
            return null
        }
        return (
            <Main>
                <Title>Todos los albums</Title>

                { this.state.message && <AlbumDescription>Todavia no hay ninguna foto que mostrar en esta galeria</AlbumDescription> }

                { this.state.albums && this.state.albums.map(album => {
                    return (
                        <div key={album.id}>
                            <AlbumTitle><AlbumsIcon className="fas fa-images"></AlbumsIcon>{album.name}</AlbumTitle>
                            <AlbumDescription>{album.description}</AlbumDescription>
                            <Grid>
                                { album.photos.map(item => {
                                    return(
                                        <GridItem key={item.id} >
                                            <Image src={item.img_url} alt="" />
                                            <ImageName>{item.filename}</ImageName>
                                        </GridItem>
                                )})}
                            </Grid>
                        </div>
                )})}

                {/*<Grid>
                    { this.state.photos && this.state.photos.map(item => {
                        return (
                            <GridItem key={item.id} >
                                <Image src={item.img_url} alt="" />
                                <ImageName>{item.filename}</ImageName>
                            </GridItem>
                    )})}
                </Grid>*/}
            </Main>
        )
    }
}

export default MainPage
