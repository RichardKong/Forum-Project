import { Layout, Button,PageHeader, Avatar, List, Form,Input} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"


const { Footer, Content } = Layout;
export default class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            type : "", //板块类型
            token: "", //验证
            display_name: 'none',//发帖区域显示状态
            notdisplay_name:'block',//按钮显示状态
            title: "",
            content: "",
            postings:[],
            type: "",
        }
        //绑定需要调用的async函数
        this.handleChange=this.handleChange.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentDidMount(){
        let token = cookie.load("token")
        let formData = new FormData()
        formData.append('Authorization',token)
        axios.post("/api/board/"+type(), formData)
            .then(response=>{
                let data = response.data
                let posts = data.postings
                this.setState({
                    postings: posts,
                    token: token,
                    type:type()
                });
        })
            
    }
    async submit(){
        let formData = new FormData();
        formData.append('title',this.state.title);
        formData.append('content',this.state.content);
        formData.append('type',postType(this.state.type));
        formData.append('Authorization',this.state.token);
        ////调用后端api,并存储返回值
        let ret=(await axios.post('/api/post',formData)).data;
        let state=ret.state;
        //根据返回值进行处理
        if(state==true){
            window.location.reload()//直接打开新网页
        }
        else {
           let message=ret.message;
           alert(message);
        }
     }
     //实时更新state里面的值
     handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
     }

    display_name() { //编辑按钮的单击事件，修改状态机display_name的取值
        if (this.state.display_name == 'none') {
            this.setState({
                display_name: 'block',
                notdisplay_name: 'none'
            })
        }
        else if (this.state.display_name == 'block') {
            this.setState({
                display_name: 'none',
                notdisplay_name: 'block'
            })

        }
    }

    checkTitle(rule, value, callback) {//待定
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
        }
        callback();
    }
    checkContent(rule, value, callback) {//待定
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
        }
        callback();
    }

    render() {
        this.state.token = cookie.load("token");
        this.state.type = type();
        if(this.state.token){
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <PageHeader style={{ padding: '20px 50px' }} title={title(this.state.type)} />   

                    <p class="slide" style={{ display: this.state.notdisplay_name }}>
                        <Button type="primary" id="createPost" style={{ float: 'left', marginLeft: 50 }}
                            onClick={this.display_name.bind(this)}>
                            {/**./createPost*/}
                            发帖
                        </Button>
                    </p>
                    {/*发帖区域动态显示 */}
                <div style={{display: this.state.display_name}}>
                        <h3 style={{ padding: '0px 50px' }}>新建帖子</h3>

                    <div>
                            <Layout className="layout">
                            <Content>
                            <Form
                                name="basic"
                                initialValues={{ remember: true }}
                                    >
                                <Form.Item
                                    name="title"
                                    rules={[{ 
                                            required: true, message: '请输入标题!' 
                                        },{
                                            validator: this.checkTitle.bind(this)
                                        }
                                    ]}
                                >
                                            <Input placeholder="标题"
                                                style={{ width: "80%", marginLeft: '50px',marginTop:'10px'}}
                                                type="text" name="title" onChange={this.handleChange} />
                                </Form.Item>
                                <Form.Item
                                    name="content"
                                    rules={[{
                                            required: true, message: '请输入正文!'
                                    }, {
                                            validator: this.checkContent.bind(this)
                                        }
                                    ]}
                                >
                                            <textarea placeholder="正文"
                                                style={{ width: "80%", height: "300px",marginLeft: '50px',textIndent:"8px" }}
                                                type="text" name="content" onChange={this.handleChange} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ float: 'left', marginLeft: 50 }} onClick={this.submit}>
                                    发送
                                    </Button>
                                    <Button id="send" style={{ float: 'left', marginLeft: 10 }}
                                                onClick={this.display_name.bind(this)}>
                                                取消
                                    </Button>
                                    <Button id="hidePost" style={{ float: 'right', marginRight:"10%" }}
                                                onClick={this.display_name.bind(this)}>
                                                保存草稿（没实现，现同取消）
                                    </Button>
                                </Form.Item>

                            </Form>
                            </Content>
                            </Layout>
                    </div>
                </div>


                    <Content style={{ padding: '0px 50px'}}>
                        <List
                            pagination={{
                            onChange: page => {
                            console.log(page);
                            },
                            pageSize: 4,
                            }}
                            itemLayout="horizontal"
                            dataSource={this.state.postings}
                            renderItem={item => (
                            <List.Item actions={[<div>data</div>]}>
                                <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={[<div><a href={'/post/' + item.id}>{item.title}</a></div>]}
                                description={<div>description</div>}
                                />
                            </List.Item>
                            )}
                        />
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
                </Layout>
            );
        }
        else{
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <br/><br/><br/>
                    <h1 align="center">
                        请先登录！
                    </h1>
                </Layout>
            );
        }
    }
    
}
function type(){
    var url = window.location.href;
    var content = url.split("/");
    if(content.length<5)
        return "study";
    else {
        return content[4];
    }
}

function title(type){
    if(type==null)
        return "板块信息";
    else {
        if(type == "emotion")
            return "情感交流";
        else if(type == "information")
            return "校园生活";
        else if(type == "intern")
            return "实习信息";
        else if(type == "study")
            return "学习资料";
    }
}

function postType(type){
    if(type==null)
        return 1;
    else {
        if(type == "emotion")
            return 2;
        else if(type == "information")
            return 3;
        else if(type == "intern")
            return 4;
        else if(type == "study")
            return 1;
    }
}