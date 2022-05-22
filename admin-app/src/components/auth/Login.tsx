import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { getAccessToken, setAccessToken, showNotificationMessage } from '../../helpers';
import * as routes from '../../constants/routes';
import axios from 'axios';
import { NOTIFICATION_TYPES } from '../../constants/common';

const Login = () => {
    const token = getAccessToken()
    const navigate = useNavigate();

    useEffect(() => {
        token && navigate(routes.ROOT)
    }, [])

    const submitHandler = (values: { email: string, password: string }) => {
        axios.post(`${process.env.REACT_APP_API_BASE_URL}login`, { email: values.email, password: values.password })
            .then(res => {
                if (res?.data) {
                    setAccessToken(res.data.accessToken)
                    navigate(routes.ROOT)
                }
            })
            .catch((err) => {
                showNotificationMessage(NOTIFICATION_TYPES.ERROR, err?.response?.data?.message)
            });
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <Form layout='vertical' onFinish={submitHandler}            >
                <Row gutter={[32, 32]}>
                    <Col span={24}>
                        <Form.Item
                            label='Email Address'
                            name="email"
                            rules={[
                                { required: true, message: 'Email Address is required' },
                                { type: 'email', whitespace: true, message: 'Enter a valid Email Address' }
                            ]}
                            validateTrigger={['onBlur', 'onChange']}
                        >
                            <Input size="large" placeholder={'Email Address'} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[32, 32]}>
                    <Col span={24}>
                        <Form.Item
                            label='Password'
                            name="password"
                            rules={[{ required: true, whitespace: true, message: 'Password is required' },]}
                            validateTrigger={['onBlur', 'onChange']}
                        >
                            <Input.Password
                                size="large"
                                placeholder={'Password'}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Button block type="primary" htmlType="submit">
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login