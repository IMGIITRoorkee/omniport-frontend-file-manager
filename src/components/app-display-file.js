import React, { Component } from 'react';
import { connect } from "react-redux"
import { Message, Dimmer,Loader, List, Image, GridColumn, Container,Grid, GridRow,Header, Button, Popup} from 'semantic-ui-react'
import { setfiles } from "../actions/index"
import AppUpload from "./app-upload"

class AppDisplayFile extends Component {
    handleClick = (file) =>{
        localStorage.setItem("file_url",file.file_data)
        window.close()
    }
    componentDidMount(){
        this.props.SetFiles()
        console.log(this.props,"tushar")
    }
    render( ) { 
        const { files } = this.props
        return ( 
            <React.Fragment>
                <Container>
                    <Grid>
                        <GridRow>
                            <GridColumn>
                                <Header as='h1'>Browse Folder</Header>
                            </GridColumn>
                        </GridRow>
                        <GridRow>
                            <Message positive>
                                <Message.Header>Successfully Uploaded</Message.Header>
                            </Message>
                        </GridRow>
                        <GridRow >
                             <Grid.Column>
                                <List divided selection verticalAlign='middle'>
                                    {files.isfetching ?    
                                        <Dimmer active inverted>
                                            <Loader inverted content='Fetching' />
                                        </Dimmer> : null }
                                    
                                    { files && files.file_list && files.file_list[0] && files.file_list.map((file,index)=>
                                        <List.Item onClick={()=>this.handleClick(file)}>
                                            <Image size={'mini'} src={file.upload.replace("http://localhost/" , "http://192.168.121.228/")} circular />
                                            <List.Content>
                                                <List.Header as='a'>{file.fileName}</List.Header>
                                            </List.Content>
                                            <Popup trigger={<Button floated='right'>Options</Button>} flowing hoverable>
                                                <Grid centered divided columns={2}>
                                                <Grid.Column textAlign='center'>
                                                    <Button>Rename</Button>
                                                </Grid.Column>
                                                <Grid.Column textAlign='center'>
                                                    <Button>Delete</Button>
                                                </Grid.Column>
                                                </Grid>
                                            </Popup>
                                        </List.Item>
                                    ) }
                                </List>
                            </Grid.Column>
                        </GridRow>
                        <GridRow>
                            <AppUpload />
                        </GridRow>
                    </Grid>
                </Container>
            </React.Fragment>
         );
    }
}

const mapStateToProps = (state) => {
    return {
        files: state.files
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetFiles: () => {
            dispatch(setfiles())
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AppDisplayFile);