import React from 'react';
import '../asset/register.css';
import {Button, Form, Input} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';
import {Carousel} from 'antd';

// 添加走马灯图片
import registerImg1 from '../img/register-1.jpg';
import registerImg2 from '../img/register-2.jpg';
import registerImg3 from '../img/register-3.jpg';
import registerImg4 from '../img/register-4.jpg';

// register部分
class register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //注册需要提交的值
            name: '',
            password: '',
            email: '',
            token: '',//验证码

            //验证码等待时间相关变量
            time: 59,
            loading: false,
        }
        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

//提交函数
    async submit() {
        let formData = new FormData();
        //非登录状态传输数据的方式
        formData.append('email', this.state.email);
        formData.append('name', this.state.name);
        formData.append('password', this.state.password);
        formData.append('token', this.state.token);
        let register_return = (await axios.post('/api/register', formData)).data;//调用后端register接口，返回消息
        let success = register_return.state;
        if (success) {
            alert(register_return.message);//返回信息
            //加入cookie给跳转页面（token表示已登录)
            cookie.save("token", register_return.authorizeToken);
            cookie.save("name", this.state.name);
            window.location.href = "http://106.12.27.104/";//返回初始页面，进入登录状态
        } else {
            let message = register_return.message;
            alert(message);
        }
    }

//验证码60s等待
    count = () => {
        let {time} = this.state;
        this.setState({loading: true});
        let siv = setInterval(() => {
            this.setState({time: (time--)}, () => {
                if (time <= -1) {
                    clearInterval(siv);　　//倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
                    this.setState({loading: false, time: 59})
                }
            });
        }, 1000);
    }

//调用后端邮件api
    async sendEmail(emailAddress) {
        if (emailAddress != "") {
            let formData = new FormData();
            formData.append('email', emailAddress);
            let ret = (await axios.post('/api/applyEmail', formData)).data;
            let success = ret.state;
            if (success) {
                alert("You have reived the email contains token!");
                return true;
            } else {
                alert("Some wrongs happened, please retry!");
            }
        }
        return false;
    }

//发送邮件
    applyEmail() {
        let email = this.state.email;
        if (this.sendEmail(email)) {
            this.count();
        }
    }

//检查邮箱是否有错
    checkEmail(rule, value, callback) {
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
            callback('请输入正确的邮箱地址');
        }
        callback();
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <div>
                    <Form
                        name="basic"
                        initialValues={{remember: true}}
                        style={{marginLeft: "2%", marginTop: "2%", width: "75%"}}
                    >
                        <Form.Item
                            label="用户名"
                            name="name"
                            rules={[{
                                required: true, message: '请输入用户名!'
                            }
                            ]}
                        >
                            <Input name="name" type="text" onChange={this.handleChange}/>
                        </Form.Item>
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[{
                                required: true, message: '请输入邮箱!'
                            }, {
                                validator: this.checkEmail.bind(this)
                            }
                            ]}
                        >
                            <Input name="email" type="text" onChange={this.handleChange}/>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码!'}]}
                        >
                            <Input.Password name="password" onChange={this.handleChange}/>
                        </Form.Item>

                        <Form.Item
                            label="确认密码"
                            name="confirmpassword"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {required: true, message: '请确认密码!'},
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('两个密码不一致!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password name="password" onChange={this.handleChange}/>
                        </Form.Item>
                        <Form.Item
                            label="验证码"
                            name="token"
                            rules={[{required: true, message: '请输入验证码!'}]}
                        >
                            <Input name="token" allowClear={true}
                                   onChange={this.handleChange}/>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={this.applyEmail.bind(this)} loading={this.state.loading}
                                    style={{marginRight: "5%"}}>
                                {this.state.loading ? this.state.time + '秒' : '发送邮件验证'}
                            </Button>
                            <Button type="primary" htmlType="submit" onClick={this.submit}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form></div>
                <div>
                    <Carousel>
                        <div><img src={registerImg1} className="logo-img"/></div>
                        <div><img src={registerImg2} className="logo-img"/></div>
                        <div><img src={registerImg3} className="logo-img"/></div>
                        <div><img src={registerImg4} className="logo-img"/></div>
                    </Carousel>
                </div>
            </div>
        )
    }
}

export default register;
