import React, { Component } from 'react';
import { connect } from "react-redux"
import { Form, Checkbox, Button, Grid, GridRow } from "semantic-ui-react"
import { addfile , setfiles } from "../actions/index"
import "../css/appupload.css"

class AppUpload extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            filename:'',
            ispublic:false,
            filedata:'',
            showform:false
         }
    }
    handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                filename:file.name,
                filedata:file,
                showform:true
            })
        }
        if(file){
            reader.readAsDataURL(file)
        }
    }

    handleChange=(e)=>{
        const name = e.target.name
        const value = e.target.value
        this.setState({[name]:value})
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        let { filename,filedata,ispublic,showform } = this.state

        if(filename && filedata){
            var formData = new FormData()
            filedata ? formData.append('upload', filedata) : void 0
            formData.append('file_name',filename )
            formData.append('ispublic', ispublic)
            this.props.AddFile(formData , this.successcallback)
        }
    }
    handleCheck=()=>{
        this.setState({
            ispublic: !this.state.ispublic
        })
    }
    successcallback(){
        this.props.SetFiles()
    }
    render() { 
        const { filename, showform, ispublic } = this.state
        const { files } = this.props
        return ( 
                <Grid>
                    <GridRow>
                        <input type="file" onChange={this.handleImageChange} styleName="file-input" id="embedpollfileinput" />
                        <label for="embedpollfileinput" className="ui medium primary left floated button">
                            Upload image
                        </label>
                    </GridRow>
                    <GridRow>
                        {showform ?
                        <Form encType='multiple/form-data' onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label>Image Name</label>
                                <input name="filename" value={filename} onChange={this.handleChange} placeholder='First Name' />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox checked={ispublic} onChange={this.handleCheck} label='Public' />
                            </Form.Field>
                            <Button loading={files.isuploading} type='submit'>Submit</Button>
                        </Form> : null}
                    </GridRow>
                </Grid>
         );
    }
}

const mapStateToProps = state =>{
    return {
        files: state.files
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetFiles:()=>{
            return dispatch(setfiles())
        },
        AddFile: (data,callback)=>{
            return dispatch(addfile(data,callback))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AppUpload);
