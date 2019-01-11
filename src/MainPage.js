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
    padding: 5px;
    display: flex;
    background-color: cyan;
    justify-content: center;
`

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount() {
        axios.get("/photos.json").then(({data}) => {
            if (data && data.length > 0) {
                this.setState({ photos: data })
            }
        })
    }
    render() {
        return (
            <Main>
                <Title>Todas las fotos subidas</Title>
                <Grid>
                    { this.state.photos && this.state.photos.map(item => {
                        return (
                            <GridItem key={item.id} >
                                <Image src={item.img_url} alt="" />
                                <ImageName>{item.filename}</ImageName>
                            </GridItem>
                    )})}
                </Grid>
            </Main>
        )
    }
}

export default MainPage
